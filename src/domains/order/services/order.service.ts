import { Service } from "typedi";
import { Order } from "../models/Order";
import { Customer } from "../../Customer/models/Customer";
import logger from "../../../common/middlewares/logger";
import { Paint } from "../models/Paint";
import { EmailSender } from "../../../common/utils/EmailSender";
import { OrderHistory } from "../models/OrderHistory";

@Service()
export class OrderService {
	constructor(private emailSender: EmailSender) {}

	async createOrder(newOrder: any) {
		const { items, orderStatus, customerId } = newOrder;
		// console.log("SERVICE ITEM", items);
		const { totalQuantity, totalPrice, itemsArray } =
			await this.createItemArray(items);

		// console.log("Order Status:", orderStatus);
		console.log("ITEM ARRAY", totalQuantity, totalPrice, itemsArray);
		const order = await Order.create({
			items: itemsArray,
			orderStatus,
			totalQuantity,
			totalPrice,
			customer: customerId,
		});
		// console.log("ORDER STATUS:", orderStatus);
		const orderHistory = await OrderHistory.create({
			order,
			orderStatus,
			deliveryStatus: order.deliveryStatus,
			customer: customerId,
		});
		// console.log(orderHistory);
		logger.info(`Order Created: ${order}`);
		return order;
	}

	//creating array of items with price, total quantity and total price
	private async createItemArray(items: any) {
		interface itemObject {
			itemName: string;
			quantity: number;
			price: number;
		}
		let itemsArray: itemObject[] = [];
		// console.log("CREATE ITEM ARRAY : ", items);
		let totalQuantity = 0;
		let totalPrice = 0;
		// console.log("IN create Item Items : ", items);

		for (const item of items) {
			// console.log("item : ", item);
			// console.log("IN create Item Array : ", item.itemName);

			let price = await this.getItemPrice(item.itemName);
			price = price * item.quantity;
			totalPrice += price;
			totalQuantity += item.quantity;
			const newItem: itemObject = {
				itemName: item.itemName,
				price,
				quantity: item.quantity,
			};
			itemsArray.push(newItem);
		}
		console.log(totalQuantity, totalPrice, itemsArray);
		return { totalQuantity, totalPrice, itemsArray };
	}

	//gets price for a paint item
	private async getItemPrice(paintName: string) {
		const dbPaint = await Paint.findOne({ paintName });
		if (dbPaint) {
			return dbPaint.price;
		} else return 0;
	}

	async createCustomer(newCustomer: any) {
		try {
			const customer = await Customer.create(newCustomer);
			return customer;
		} catch (err) {
			return null;
		}
	}

	async updateCustomer(customerId: any, newCustomer: any) {
		const { firstName, lastName, email, phone, addressLine1, addressLine2 } =
			newCustomer;
		try {
			const customer = await Customer.findByIdAndUpdate(
				{ _id: customerId },
				{
					firstName,
					lastName,
					email,
					phone,
					addressLine1,
					addressLine2,
				},
				{ new: true }
			);

			return customer;
		} catch (err) {
			logger.error(`Error occurred while editing Customer`);
			return null;
		}
	}

	async getAllOrders() {
		const orders = await Order.find({ isDeleted: false })
			.sort({ updatedAt: -1 })
			.populate({ path: "customer", select: "-createdAt -updatedAt -__v " })
			.populate({
				path: "deliveryPartner",
				options: { retainNullValues: true },
			})
			.select("-createdAt -updatedAt -__v ");

		// console.log("ORDER SERVICE : ", orders);
		return orders;
	}
	async getAllOrdersWithFilters(
		page: number,
		limit: number,
		search: string,
		orderStatus: string,
		deliveryStatus: string
	) {
		const startIndex = (page - 1) * limit;

		const query: {
			customer?:{
				firstName?: string;
			},
			orderStatus?: string;
			deliveryStatus?: string;
			isDeleted?: Boolean;
		} = {};
		query.isDeleted = false;
		if (orderStatus && orderStatus !== "all") query.orderStatus = orderStatus;
		if (deliveryStatus && deliveryStatus !== "all")
			query.deliveryStatus = deliveryStatus;
		// if (search) query.customer.firstName = String(search);

		const orders = await Order.find(query)
			.sort({ updatedAt: -1 })
			.populate({ path: "customer", select: "-createdAt -updatedAt -__v " })
			.populate({
				path: "deliveryPartner",
				options: { retainNullValues: true },
			})
			.select("-createdAt -updatedAt -__v ")
			.skip(startIndex)
			.limit(limit);
		return orders;
	}

	async getOrder(orderId: string) {
		const order = await Order.findById(orderId).populate("customer");
		console.log(order);
		if (order) return order;
		else return null;
	}

	async updateOrder(orderId: string, newData: any) {
		try {
			const {
				firstName,
				lastName,
				phone,
				email,
				addressLine1,
				addressLine2,
				items,
				orderStatus,
			} = newData;
			console.log("UPDATE SERVICE:", items);
			const order = await this.getOrder(orderId);
			if (order) {
				const customer = await this.updateCustomer(order?.customer?._id, {
					firstName,
					lastName,
					phone,
					email,
					addressLine1,
					addressLine2,
				});
				const { itemsArray, totalQuantity, totalPrice } =
					await this.createItemArray(items);
				const updatedOrder = await Order.findByIdAndUpdate(
					{ _id: orderId },
					{
						items: itemsArray,
						orderStatus,
						totalQuantity,
						totalPrice,
						customer: customer?._id,
					},
					{ new: true }
				);
				if (updatedOrder) {
					const orderHistory = await OrderHistory.create({
						order,
						orderStatus,
						deliveryStatus: order.deliveryStatus,
						customer,
					});

					this.emailSender.sendUpdatedOrderToCustomer(
						email,
						firstName,
						lastName,
						updatedOrder
					);
					return updatedOrder;
				}
			} else {
				logger.warn(`Order ID is not available`);
				return null;
			}
		} catch (err) {
			logger.error("Error occured while editing order");
		}
	}

	async deleteOrder(orderId: string) {
		try {
			const order = await Order.findByIdAndUpdate(
				{ _id: orderId },
				{ isDeleted: true },
				{ new: true }
			);
			if (order) {
				const orderHistory = await OrderHistory.create({
					order,
					orderStatus: order?.orderStatus,
					deliveryStatus: order?.deliveryStatus,
					customer: order?.customer,
				});

				return order;
			}
		} catch (err) {
			logger.error(`Error while deleting Order`);
			return null;
		}
	}

	async updateStatus(orderId: string, statusType: string, status: string) {
		try {
			const order = await Order.findOne({ _id: orderId });
			if (order) {
				const newOrder = await Order.findByIdAndUpdate(
					{ _id: orderId },
					{ statusType: status },
					{ new: true }
				);
				return newOrder;
			} else {
				logger.info("Failed to update Order Status of Order");
				return null;
			}
		} catch (err) {
			logger.info("Failed to update Order Status of Order");
			return null;
		}
	}

	async getAllPaints() {
		try {
			const paints = await Paint.find();
			return paints;
		} catch (err) {
			return null;
		}
	}
}

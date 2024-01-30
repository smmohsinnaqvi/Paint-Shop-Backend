import { Service } from "typedi";
import { Order } from "../../../order/models/Order";
import logger from "../../../../common/middlewares/logger";
import { User } from "../../common/models/User";
import { OrderHistory } from "../../../order/models/OrderHistory";
import { EmailSender } from "../../../../common/utils/EmailSender";
import { Customer } from "../../../Customer/models/Customer";

@Service()
export class DeliveryPartnerService {
	constructor(private emailSender: EmailSender) {}
	async getAllNotAssignedPaintOrder() {
		try {
			const orders = await Order.find({
				$and: [
					{ deliveryStatus: "not assigned" },
					{ isDeleted: false },
					{ orderStatus: "done" },
				],
			})
				.populate("customer")
				.sort({ updatedAt: -1 })
				.select("-createdAt -updatedAt -__v");
			if (orders) {
				// logger.info(`Order for Delivery Partners are ${orders}`);
				return orders;
			} else {
				logger.error(`Failed to get Paint Orders`);
				return null;
			}
		} catch (err) {
			logger.error(`Failed to get Paint Orders`);
			return null;
		}
	}

	async getOrder(id: any) {
		try {
			const order = await Order.findById({ _id: id })
				.populate({ path: "customer", select: "-createdAt -updatedAt -__v " })
				.populate({
					path: "deliveryPartner",
					options: { retainNullValues: true },
				});

			return order;
		} catch (err) {
			logger.error("Error while Getting Order");
			return null;
		}
	}

	async deliveredOrdersById(partnerId: string) {
		// const queryConditions = {
		// 	$and: [{ _id: partnerId }, { deliveryStatus: "delivered" }],
		// };
		try {
			const deliveredOrders = await Order.find({
				$and: [{ deliveryPartner: partnerId }, { deliveryStatus: "delivered" }],
			}).populate("customer");
			logger.info("Delivered Orders By Delivery Partner sent");

			return deliveredOrders;
		} catch (err) {
			logger.error(`Failed to get Delivered Orders`);
			return null;
		}
	}

	async acceptOrder(orderId: string, partnerId: string) {
		try {
			const partner = await User.findById({ _id: partnerId });
			const order = await Order.findByIdAndUpdate(
				{ _id: orderId },
				{ deliveryPartner: partner?._id, deliveryStatus: "accepted" },
				{ new: true }
			);
			if (order) {
				logger.info(`Order Accepted By ${partner?.firstName}`);

				const orderHistory = await OrderHistory.create({
					order,
					orderStatus: order?.orderStatus,
					deliveryStatus: order?.deliveryStatus,
					deliveryPartner: partner,
					customer: order?.customer,
				});
				return order;
			} else {
				return null;
			}
		} catch (err) {
			logger.error("Failed to Accept Order By Delivery Partner");
			return null;
		}
	}

	async pickedUpOrder(partnerId: string, orderId: string, imageURL: string) {
		try {
			console.log("parner id ", partnerId);
			console.log("order id", orderId);
			console.log("image URL", imageURL);
			const partner = await User.findOne({ _id: partnerId });
			const order = await Order.findByIdAndUpdate(
				{ _id: orderId },
				{ deliveryStatus: "picked up", pickedUpImageURL: imageURL },
				{ new: true }
			);
			if (order) {
				const customer = await Customer.findOne({ _id: order.customer });
				// try {
				// 	const orderHistory = await OrderHistory.create({
				// 		order,
				// 		orderStatus: order.orderStatus,
				// 		deliveryStatus: order?.deliveryStatus,
				// 		deliveryPartner: partner,
				// 		customer,
				// 	});
				// 	console.log("orderHistory", orderHistory);
				// } catch (err) {
				// 	logger.error("error creating order history");
				// }
				await this.emailSender.sendPickedUpToCustomer(customer, partner, order);
				return order;
			}
		} catch (err) {
			logger.error("Failed to Change Order Status");
			return null;
		}
	}

	async deliveredOrder(partnerId: string, orderId: string, imageURL: string) {
		try {
			const partner = await User.find({ _id: partnerId });
			const order = await Order.findByIdAndUpdate(
				{ _id: orderId },
				{ deliveryStatus: "delivered", deliveredImageURL: imageURL },
				{ new: true }
			);
			if (order) {
				// const orderHistory = await OrderHistory.create({
				// 	order,
				// 	orderStatus: order?.orderStatus,
				// 	deliveryStatus: order?.deliveryStatus,
				// 	deliveryPartner: partner,
				// 	customer: order?.customer,
				// });
				const customer = await Customer.findOne({ _id: order.customer });
				if (customer) {
					await this.emailSender.sendDeliveredToCustomer(order, customer);
				}

				return order;
			} else return null;
		} catch (err) {
			logger.error("Failed to Change Order Status");
			return null;
		}
	}
}

import { Service } from "typedi";
import { OrderService } from "../services/order.service";
import logger from "../../../common/middlewares/logger";
import { NextFunction, Request, Response } from "express";
import { Order } from "../models/Order";
import { EmailSender } from "../../../common/utils/EmailSender";
import { Paint } from "../models/Paint";
import { firebaseNotifyOnAccept } from "../../../common/utils/firebase";
import { getMessaging } from "firebase-admin/messaging";

@Service()
export class OrderController {
	constructor(
		private orderService: OrderService,
		private emailSender: EmailSender
	) {}

	async getAllOrders(req: Request, res: Response, next: NextFunction) {
		let page: number = 1;
		let limit: number = 10;
		try {
			const orders = await this.orderService.getAllOrders();
			res.status(200).json({ success: true, orders });
		} catch (err) {
			console.log(err);
			res.status(400).json({
				success: false,
				error: "some error encountered while listing orders",
			});
			logger.error("some error encountered while listing orders");
		}
	}
	async getAllOrdersWithFilters(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// console.log("IN CONTROLLER");
		let page: number = 1;
		let limit: number = 10;
		try {
			const orders = await this.orderService.getAllOrdersWithFilters(
				Number(req.query.page),
				Number(req.query.limit),
				String(req.query.search) || "",
				String(req.query.orderStatus) || "",
				String(req.query.deliveryStatus) || ""
			);
			res.status(200).json({ success: true, orders });
		} catch (err) {
			console.log(err);
			res.status(400).json({
				success: false,
				error: "some error encountered while listing orders",
			});
			logger.error("some error encountered while listing orders");
		}
	}

	async getOrder(req: Request, res: Response, next: NextFunction) {
		const order = await this.orderService.getOrder(req.params.id);
		res.status(200).json({ success: true, order });
	}

	async createOrder(req: Request, res: Response, next: NextFunction) {
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
			} = req.body;
			console.log("IN CREATE ORDER:", items);
			const customer = await this.orderService.createCustomer({
				firstName,
				lastName,
				phone,
				email,
				addressLine1,
				addressLine2,
			});
			if (customer) {
				const customerEmail = customer.email;
				const customerId = customer._id;
				logger.info(`Customer _ID ${customerId} `);

				const order = await this.orderService.createOrder({
					items,
					orderStatus,
					customerId,
				});

				logger.info(`ORDER CREATED :  ${order}`);
				if (order) {
					this.emailSender.sendOrderToCustomer(
						customerEmail,
						firstName,
						lastName,
						order
					);
					res.status(201).json({ success: true, order });
				}
			} else {
				res.status(400).json({
					success: false,
					error: "error occurred while creating order",
				});
				logger.error(`error occurred while creating order`);
			}
		} catch (err) {
			logger.error(`error occurred while creating order`);
			res
				.status(400)
				.json({ success: false, error: "error occurred while creating order" });
		}
	}

	async updateOrder(req: Request, res: Response, next: NextFunction) {
		logger.info(`Editing Order:`, req.body, req.params.id);

		try {
			const updatedOrder = await this.orderService.updateOrder(
				req.params.id,
				req.body
			);
			if (updatedOrder) {
				logger.info(`Order Edited`);
				if (updatedOrder.orderStatus === "done") {
					await firebaseNotifyOnAccept(res, updatedOrder);
				} else {
					res.status(201).json({ success: true, updatedOrder });
				}
			}
		} catch (err) {
			console.log("-------------------err", err);
			logger.error("Error while Editing Order");
			res
				.status(400)
				.json({ success: false, error: "Error while Editing Order" });
		}
	}

	async updateStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const newOrder = await this.orderService.updateStatus(
				req.params.id,
				req.params.statusType || "orderStatus",
				req.params.orderStatus
			);
			if (newOrder) {
				logger.info("Order Status Changed");
				res.status(201).json({ success: true, order: newOrder });
			} else {
				logger.info("Failed to update Order Status of Order");
				res.status(400).json({
					success: false,
					error: "Failed to update Order Status of Order",
				});
			}
		} catch (err) {
			logger.info("Failed to update Order Status of Order");
			res.status(400).json({
				success: false,
				error: "Failed to update Order Status of Order",
			});
		}
	}

	async deleteOrder(req: Request, res: Response, next: NextFunction) {
		try {
			const order = await this.orderService.deleteOrder(req.params.id);
			res.status(200).json(order);
		} catch (err) {
			logger.error("Error occured while deleting Order");
			res
				.status(400)
				.json({ success: false, error: "Error occured while deleting Order" });
		}
	}

	async getAllPaints(req: Request, res: Response, next: NextFunction) {
		try {
			const paints = await this.orderService.getAllPaints();
			res.status(200).json({ success: true, paints });
		} catch (err) {
			logger.error(`Error occured while getting paints`);
			res
				.status(400)
				.json({ success: false, error: "Error occured while getting paints" });
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { DeliveryPartnerService } from "../services/delivery-partner.service";
import logger from "../../../../common/middlewares/logger";
import { getMessaging } from "firebase-admin/messaging";
import { firebaseNotifyOnAccept } from "../../../../common/utils/firebase";

@Service()
export class DeliveryPartnerController {
	constructor(private deliveryPartnerService: DeliveryPartnerService) {}

	async getAllNotAssignedPaintOrder(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const orders =
				await this.deliveryPartnerService.getAllNotAssignedPaintOrder();
			// console.log(orders);
			if (orders) {
				logger.info("Orders sent to Delivery Partners");
				res.status(200).json({ success: true, orders });
			}
		} catch (err) {
			logger.info("Error occured while getting orders for Delivery Partners");
			res.status(400).json({
				success: false,
				error: "Error occured while getting orders for Delivery Partners",
			});
		}
	}

	async deliveredOrdersById(req: Request, res: Response, next: NextFunction) {
		try {
			const deliveredOrders =
				await this.deliveryPartnerService.deliveredOrdersById(req.params.id);
			if (deliveredOrders) {
				logger.info("Delivered Orders sent to Delivery Partner");
				res.status(200).json({ success: true, deliveredOrders });
			} else {
				logger.info("Delivered Orders sent to Delivery Partner and is empty");
				res.status(200).json({ success: true, deliveredOrders: [] });
			}
		} catch (err) {
			logger.error(`Failed to sent delivered Orders to Delivery Partner`);
			res.status(400).json({
				success: false,
				error: "Failed to sent delivered Orders to Delivery Partner",
			});
		}
	}

	async acceptOrder(req: Request, res: Response, next: NextFunction) {
		try {
			// console.log("reqbody", req.params);
			const order = await this.deliveryPartnerService.acceptOrder(
				req.params.orderId,
				req.params.id
			);
			if (order) {
				logger.info(`Order Accepted and Updated Order Sent`);
				// const notify = firebaseNotifyOnAccept("fcmtoken");
				res.status(201).json({ success: true, order });
			}
		} catch (err) {
			logger.error(`Failed to Accept Order By Delivery Partner`);
			res.status(400).json({
				success: false,
				error: "Failed to Accept Order By Delivery Partner",
			});
		}
	}

	async pickedUpOrder(req: Request, res: Response, next: NextFunction) {
		try {
			console.log(req.body);

			const order = await this.deliveryPartnerService.pickedUpOrder(
				req.params.id,
				req.body.orderId,
				req.body.pickedUpImageURL
			);
			logger.info("Order has been Picked Up");
			res.status(201).json({ success: true, order });
		} catch (err) {
			logger.error("Error while changing order status to pickup");
			res.status(400).json({
				success: false,
				error: "Error while changing order status to pickup",
			});
		}
	}
	async deliveredOrder(req: Request, res: Response, next: NextFunction) {
		try {
			const order = await this.deliveryPartnerService.deliveredOrder(
				req.params.id,
				req.body.orderId,
				req.body.deliveredImageURL
			);
			logger.info("Order has been Delivered");

			res.status(201).json({ success: true, order });
		} catch (err) {
			logger.error("Error while changing order status to delivered");
			res.status(400).json({
				success: false,
				error: "Error while changing order status to delivered",
			});
		}
	}
}

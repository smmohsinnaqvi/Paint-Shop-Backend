import { Service } from "typedi";
import { DeliveryPartnerController } from "../controllers/delivery-partner.controller";
import { Router } from "express";

@Service()
export class DeliveryPartnerRouter {
	router: Router;

	constructor(private deliveryPartnerController: DeliveryPartnerController) {
		this.router = Router();
		this.addRoutes();
	}

	getRoutes() {
		return this.router;
	}

	addRoutes() {
		this.router.get(
			"/list",
			this.deliveryPartnerController.getAllNotAssignedPaintOrder.bind(
				this.deliveryPartnerController
			)
		);
		this.router.get(
			"/deliveredOrders/:id",
			this.deliveryPartnerController.deliveredOrdersById.bind(
				this.deliveryPartnerController
			)
		);

		this.router.post(
			"/accept/:orderId/:id",
			this.deliveryPartnerController.acceptOrder.bind(
				this.deliveryPartnerController
			)
		);
		this.router.post(
			"/pickup/:id",
			this.deliveryPartnerController.pickedUpOrder.bind(
				this.deliveryPartnerController
			)
		);
		this.router.post(
			"/delivered/:id",
			this.deliveryPartnerController.deliveredOrder.bind(
				this.deliveryPartnerController
			)
		);
	}
}

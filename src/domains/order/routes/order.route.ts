import { Service } from "typedi";
import { OrderController } from "../controllers/order.controller";
import { Router } from "express";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";

@Service()
export class OrderRouter {
	private router: Router;

	constructor(
		private orderController: OrderController,
		private authMiddleware: AuthMiddleware
	) {
		this.router = Router();
		this.addRoutes();
	}

	getRoutes() {
		return this.router;
	}

	private addRoutes() {
		this.router.get(
			"/list",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.orderController.getAllOrders.bind(this.orderController)
		);

		this.router.get(
			"/filteredList",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.orderController.getAllOrdersWithFilters.bind(this.orderController)
		);

		this.router.get(
			"/:id",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.orderController.getOrder.bind(this.orderController)
		);

		this.router.post(
			"/create",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.orderController.createOrder.bind(this.orderController)
		);

		this.router.put(
			"/updateOrder/:id",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.orderController.updateOrder.bind(this.orderController)
		);

		this.router.post(
			"/delete/:id",

			// this.authMiddleware.protectRoute,
			// this.authMiddleware.authenticate,
			this.orderController.deleteOrder.bind(this.orderController)
		);

		this.router.get(
			"/paint/list",
			this.orderController.getAllPaints.bind(this.orderController)
		);
	}
}

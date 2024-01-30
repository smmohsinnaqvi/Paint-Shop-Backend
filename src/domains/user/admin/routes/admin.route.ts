import { Service } from "typedi";
import { AdminController } from "../controllers/admin.controller";
import { Router } from "express";
import { AuthMiddleware } from "../../../auth/middlewares/auth.middleware";

@Service()
export class AdminRouter {
	private router: Router;
	constructor(
		private adminController: AdminController,
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
			this.adminController.getAllUsers.bind(this.adminController)
		);

		this.router.get(
			"/:id",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.adminController.getUser.bind(this.adminController)
		);

		this.router.post(
			"/create",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.adminController.createUser.bind(this.adminController)
		);

		this.router.put(
			"/updateUser/:id",

			this.authMiddleware.protectRoute,
			this.authMiddleware.authenticate,
			this.adminController.updateUser.bind(this.adminController)
		);

		this.router.post(
			"/delete/:id",

			// this.authMiddleware.protectRoute,
			// this.authMiddleware.authenticate,
			this.adminController.deleteUser.bind(this.adminController)
		);
	}
}

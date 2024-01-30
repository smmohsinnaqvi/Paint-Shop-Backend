import { Router } from "express";
import { Service } from "typedi";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@Service()
export class AuthRouter {
	private router: Router;

	constructor(
		private authController: AuthController,
		private authMiddleware: AuthMiddleware
	) {
		this.router = Router();
		this.addRoutes();
	}

	getRoutes() {
		return this.router;
	}

	private addRoutes() {
		this.router.post(
			"/login",

			this.authMiddleware.validateRegistration,
			this.authMiddleware.handleValidationErrors,
			this.authController.login.bind(this.authController)
		);

		this.router.post(
			"/logout",
			this.authController.logout.bind(this.authController)
		);

		this.router.post(
			"/updatePassword",
			this.authController.updatePassword.bind(this.authController)
		);
	}
}

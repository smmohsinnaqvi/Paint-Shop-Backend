import "reflect-metadata";
import Container, { Service } from "typedi";
import express, { Request, Response, Application } from "express";
import { DBConnection } from "./common/constants/db";
import logger from "./common/middlewares/logger";
import cors from "cors";
import dotenv from "dotenv";
import { AuthRouter } from "./domains/auth/routes/auth.route";
import { AdminRouter } from "./domains/user/admin/routes/admin.route";
import { OrderRouter } from "./domains/order/routes/order.route";
import { DeliveryPartnerRouter } from "./domains/user/delivery-partner/routes/delivery-partner.route";
import { applicationDefault, initializeApp } from "firebase-admin/app";

dotenv.config({
	path: `/home/mindbowser/Documents/BitBucket_Backend/painters-shop-api/Paint-Shop-Backend/src/.env`,
});

@Service()
export class Main {
	app: Application = express();
	port = process.env.PORT || 8000;

	constructor(
		private dbConnection: DBConnection,
		private authRouter: AuthRouter,
		private adminRouter: AdminRouter,
		private orderRouter: OrderRouter,
		private deliveryPartnerRouter: DeliveryPartnerRouter
	) {
		this.addAllMiddlewares();
		this.addAllRoutes();
		this.addStatusRoute();
		process.env.GOOGLE_APPLICATION_CREDENTIALS;
	}

	startServer() {
		this.app.listen(this.port, () => {
			logger.info(`Server started at PORT ${this.port}`);
			this.dbConnection.startConnection();
			initializeApp({
				credential: applicationDefault(),
				projectId: "paintshop-fe755",
			});
		});
	}

	private addAllMiddlewares() {
		this.app.use(express.json());
		this.app.use(cors());

		logger.info(`Cross Orgin Resource Sharing Enabled`);
	}

	private addAllRoutes() {
		this.app.use("/auth", this.authRouter.getRoutes());
		this.app.use("/admin", this.adminRouter.getRoutes());
		this.app.use("/delivery-partner", this.deliveryPartnerRouter.getRoutes());
		this.app.use("/order", this.orderRouter.getRoutes());
	}

	private addStatusRoute() {
		this.app.get("/status", (req: Request, res: Response) => {
			res.send("App is running...");
		});
	}
}

Container.get(Main).startServer();

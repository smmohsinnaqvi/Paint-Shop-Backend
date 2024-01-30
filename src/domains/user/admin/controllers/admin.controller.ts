import { Service } from "typedi";
import { AdminService } from "../services/admin.service";
import logger from "../../../../common/middlewares/logger";
import { NextFunction, Request, Response } from "express";

@Service()
export class AdminController {
	constructor(private adminService: AdminService) {}

	async getAllUsers(req: Request, res: Response, next: NextFunction) {
		let page: number = 1;
		let limit: number = 10;
		const { totalCount, results: users } = await this.adminService.getAllUsers(
			String(req.query.role) || "admin",
			Number(req.query.page) || 1,
			Number(req.query.limit) || 10,
			String(req.query.search) || "",
			String(req.query.filter) || ""
		);

		res.status(200).json({ success: true, totalCount, users });
	}

	//Get User By ID
	async getUser(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await this.adminService.getUser(req.params.id);
			res.status(200).json({ success: true, user });
		} catch (err) {
			logger.warn("User does not exists with Id ");
			res.status(400).json({
				success: false,
				error:
					"Error occurred while fetching user info, maybe Id does not exist",
			});
		}
	}

	//Adding/Inviting User to Application ( Admin/Delivery Partner)
	async createUser(req: Request, res: Response, next: NextFunction) {
		const result = await this.adminService.createUser(req.body);
		if (result === 203) {
			logger.warn(`User with e-mail - ${req.body.email} already exists`);
			res
				.status(203)
				.json({ sucess: false, message: "User with email exists" });
		} else {
			logger.info(`User Registered Successfully`);
			res.status(201).json({ success: true, user: result });
		}
	}

	//Updating User Information
	async updateUser(req: Request, res: Response, next: NextFunction) {
		const user = await this.adminService.updateUser(req.params.id, req.body);

		res.status(201).json(user);
	}

	//Delete a User ( Setting isDeleted key to true)
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		const user = await this.adminService.deleteUser(req.params.id);

		res.status(200).json(user);
	}

	//Return All Admins registered to Application
	async getAllAdmins(req: Request, res: Response, next: NextFunction) {
		const users = this.adminService.getAllAdmins();
		res.status(200).json(users);
	}

	//Return All Delivery Partner registered to Application
	async getAllDeliveryPartners(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const users = this.adminService.getAllDeliveryPartners();
		res.status(200).json(users);
	}
}

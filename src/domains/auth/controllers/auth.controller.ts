import { Service } from "typedi";
import { AuthService } from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../../../common/middlewares/logger";

@Service()
export class AuthController {
	constructor(private authService: AuthService) {}

	//Method to login user to application
	async login(req: Request, res: Response, next: NextFunction) {
		console.log("Request body", req.body);
		const fcmtoken = req.body.fcmtoken || "";
		console.log("fcmtoken", fcmtoken);
		const user = await this.authService.login(req.body);

		if (user === 400) {
			logger.warn(`User with email - ${req.body.email} does not exists`);
			res
				.status(400)
				.json({ success: false, message: "User with email does not exists" });
		} else if (user === 404) {
			logger.warn(`User's password does not matches with existing record`);
			res
				.status(404)
				.json({ success: false, message: "Password does not matches" });
		} else {
			if (user?.confirmedUser === false) {
				res.status(302).json({ success: false, user });
			} else {
				this.sendTokenResponse(user, res, fcmtoken);
			}
		}
	}

	//Method To Update Password on First time login
	async updatePassword(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization || "";
		try {
			const user = await this.authService.updatePassword(
				userId,
				req.body.password
			);
			if (user) {
				logger.info(`Password updated Successfully`);
				res.status(201).json({ sucess: true, user });
			}
		} catch (err) {
			logger.error("Error occurred while updating password");
			res.status(400).json({
				success: false,
				error: "Error occurred while updating password",
			});
		}
	}

	//Method to Delete/Logout user from LoggedInUsers Collection
	async logout(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization || "";
		const user = await this.authService.loggedOut(token);
		if (user) {
			logger.info(`User logged out Successfully`);
			res.status(200).json({ success: true, user: {} });
		} else {
			logger.error(`Some error occured while logging out`);
			res.status(500).json({ success: false, message: "Some error occurred" });
		}
	}

	//Generating JSON Web Token and Sending Response
	private async sendTokenResponse(user: any, res: Response, fcmtoken: String) {
		const JWT_SECRET = String(process.env.JWT_SECRET);
		const JWT_EXPIRES = String(process.env.JWT_EXPIRES);
		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES,
			}
		);
		user.password = undefined;

		this.authService.loggedIn(user, token, fcmtoken);

		logger.info(`User's Info :  ${user} and its token : ${token} `);
		res.status(200).json({
			success: true,
			token,
			user,
		});
	}
}

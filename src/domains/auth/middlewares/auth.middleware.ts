import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import logger from "../../../common/middlewares/logger";
import { verify } from "jsonwebtoken";
import { User } from "../../user/common/models/User";
import { body, validationResult } from "express-validator";

@Service()
export class AuthMiddleware {
	async protectRoute(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization || "";
		// console.log("Token: ", token);
		if (!token) {
			console.log(token);

			logger.warn(" 401 : User Not Authorized");
			return res.status(401).json({
				success: false,
				message: "User Not Authorized for this route",
			});
		}

		try {
			const decoded = verify(token, "paintproject");
			const tokenInfo = Object(decoded);
			const user = await User.find({ _id: tokenInfo._id });
			if (user) {
				logger.info("User Authorized for this route");

				next();
			} else throw new Error();
		} catch (err) {
			logger.warn(`User not Authorized`);
			return res.status(401).json({
				success: false,
				message: "User Not Authorized for this route",
			});
		}
	}

	async authenticate(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization || "";

		const decoded = verify(token, "paintproject");
		const tokenInfo = Object(decoded);

		if (tokenInfo.role === "admin") {
			logger.info(`Aunthenticated for current route`);
			next();
		} else {
			logger.warn(`Not Aunthenticated for current route`);
			res.status(403).json({ success: false, error: "Not Authorized" });
		}
	}

	//Login Validations **

	validateRegistration = [
		body("email").isEmail(),
		body("password").isLength({ min: 5 }),
	];
	async handleValidationErrors(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Please Enter Valid Credentials",
				errors: errors.array(),
			});
		}
		next();
	}

	// **Login Validation
}

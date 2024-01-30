import { Service } from "typedi";
import { User } from "../../user/common/models/User";
import bcrypt from "bcryptjs";
import logger from "../../../common/middlewares/logger";
import { loggedInUser } from "../../user/common/models/LoggedInUser";
@Service()
export class AuthService {
	async login(credentials: any) {
		const { email, password } = credentials;

		const existingUser = await User.findOne({ email });
		console.log(existingUser);
		if (!existingUser) {
			return 400;
		}

		const passwordMatch = await bcrypt.compare(password, existingUser.password);

		if (passwordMatch) {
			const user = await User.findById(existingUser._id).select(
				"-password -createdAt -updatedAt -__v"
			);
			return user;
		} else return 404;
	}

	async updatePassword(id: String, password: string) {
		try {
			console.log(id, password);
			const hashValue = Number(process.env.BCRYPT_SALT);
			const hashedPassword = await bcrypt.hash(password, hashValue);
			const result = await User.findOneAndUpdate(
				{ _id: id },
				{ password: hashedPassword, confirmedUser: true },
				{ new: true }
			);
			console.log(result);
			return result;
		} catch (err) {
			logger.error("Error Occured while updating password");
			return null;
		}
	}

	async loggedIn(user: any, token: String, fcmtoken: String) {
		const loggedIn = await loggedInUser.create({
			userId: user._id,
			token,
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			fcmtoken,
		});
	}

	async loggedOut(token: String) {
		const user = await loggedInUser.findOne({ token });
		logger.info(user);
		if (user) {
			return loggedInUser.deleteOne({ _id: user._id });
		} else return false;
	}
}

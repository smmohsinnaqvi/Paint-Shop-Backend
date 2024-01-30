import { Service } from "typedi";
import { User } from "../../common/models/User";
import logger from "../../../../common/middlewares/logger";
import bcrypt from "bcryptjs";
import { EmailSender } from "../../../../common/utils/EmailSender";

@Service()
export class AdminService {
	constructor(private emailSender: EmailSender) {}

	async getAllUsers(
		role: string,
		page: number,
		limit: number,
		search: string,
		filter: string
	) {
		const startIndex = (page - 1) * limit;

		// const endIndex = page * limit;

		let filterCriteria = {};

		const totalCount = await User.countDocuments({ role: role });

		if (search && search !== "undefined") {
			if (filter.match("accepted")) {
				filterCriteria = {
					role: role,
					firstName: { $regex: new RegExp(search), $options: "i" },
					confirmedUser: true,
				};
			} else if (filter.match("pending")) {
				filterCriteria = {
					role: role,
					firstName: { $regex: new RegExp(search), $options: "i" },
					confirmedUser: false,
				};
			} else {
				filterCriteria = {
					role: role,
					firstName: { $regex: new RegExp(search), $options: "i" },
				};
			}
		} else if (role === "undefined") {
			filterCriteria = {};
		} else {
			if (filter.match("accepted")) {
				filterCriteria = { role: role, confirmedUser: true };
			} else if (filter.match("pending")) {
				filterCriteria = { role: role, confirmedUser: false };
			} else filterCriteria = { role: role };
		}
		const results = await User.find(filterCriteria)
			.sort({ updatedAt: -1 })
			.select("-password -createdAt -updatedAt -__v")
			.skip(startIndex)
			.limit(limit);

		return { totalCount, results };
	}

	async getUser(userId: string) {
		const user = await User.find({ _id: userId }).select(
			"-password -createdAt -updatedAt -__v"
		);

		return user;
	}

	async createUser(newUser: any) {
		const {
			firstName,
			phone,
			lastName,
			email,
			addressLine1,
			addressLine2,
			role,
		} = newUser;

		const existingUser = await User.findOne({ email });
		logger.info(`User Creaton Request :  ${existingUser}`);

		if (!existingUser) {
			const tempPassword = this.randomString(5);

			console.log(tempPassword, typeof tempPassword);
			const hashValue = Number(process.env.BCRYPT_SALT);
			const hashedPassword = await bcrypt.hash(tempPassword, hashValue);

			// console.log(hashedPassword, typeof hashedPassword);

			const user = await User.create({
				firstName,
				lastName,
				email,
				phone,
				password: hashedPassword,
				role,
				addressLine1,
				addressLine2,
			});
			try {
				this.emailSender.sendPassword(email, firstName, lastName, tempPassword);
			} catch (e) {
				console.log("Error occured during sending email", e);
			}
			logger.info(`User Created : ${user}`);
			return user;
		} else return 203;
	}

	async updateUser(userId: string, newData: any) {
		const user = await User.findByIdAndUpdate({ _id: userId }, newData, {
			new: true,
		});

		return user;
	}

	async deleteUser(userId: string) {
		const user = await User.findByIdAndUpdate(
			{ _id: userId },
			{ isDeleted: true },
			{ new: true }
		);
		return user;
	}

	async getAllAdmins() {
		const users = await User.find({ role: "admin" });
		return users;
	}

	async getAllDeliveryPartners() {
		const users = await User.find({ role: "delivery-partner" });
		return users;
	}

	private randomString(length: number) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		let result = "";
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}

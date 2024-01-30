import { getMessaging } from "firebase-admin/messaging";
import logger from "../middlewares/logger";
import { loggedInUser } from "../../domains/user/common/models/LoggedInUser";
import { Response } from "express";

export const firebaseNotifyOnAccept = async (
	res: Response,
	updatedOrder: any
) => {
	const loggedInPartners = await loggedInUser.find({ role: "partner" });
	const fcmtokens = loggedInPartners.filter((user) => {
		if (user.fcmtoken) return user.fcmtoken;
	});
	console.log(fcmtokens);
	const message: any = {
		notification: {
			title: "New Orders ",
			body: "A new Order has been been completed and ready to be received by you",
		},
		token:
			"eTPhkH9SRvm38_VaNrss-c:APA91bElNW8Yh17ZYbs3Ymy4bf-lFPaUnw6lZlBmHmD6ineZ29cEETaU8tKgRoFETE-odiPTUKXvQJ6345SL8daQjItHGrfO3i9ueHBpOHDMcJ9NIew92_R6f5SZ7JJsSKDelvv-2hUc",
	};
	getMessaging()
		.send(message)
		.then(() => {
			res.status(201).json({ success: true, updatedOrder });
		})
		.catch(() => {
			logger.error("Error while sending Push Notification");
		});
};
// getMessaging()
// 	.send(message)
// 	.then((response) => {
// 		return {
// 			message: "Sucessfully sent message",
// 			token: receiveToken,
// 		};
// 		console.log("Sucessfully sent message", response);
// 	})
// 	.catch((error) => {
// 		console.log("Error sending message :", error);
// 	});

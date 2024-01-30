import { Schema, model } from "mongoose";

const loggedInUserSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		fcmtoken: {
			type: String,
		},
		role: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const loggedInUser = model("LoggedInUser", loggedInUserSchema);

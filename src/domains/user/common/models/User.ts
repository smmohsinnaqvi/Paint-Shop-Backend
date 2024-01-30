import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},

		lastName: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			default: "Paint123",
		},
		role: {
			type: String,
			required: true,
			default: "partner",
		},
		addressLine1: {
			type: String,
			required: true,
		},
		addressLine2: {
			type: String,
			required: true,
		},

		confirmedUser: {
			type: Boolean,
			default: false,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const User = model("User", userSchema);

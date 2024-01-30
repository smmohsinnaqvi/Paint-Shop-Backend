import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phone: { type: String, required: true },
		email: { type: String, required: true },
		addressLine1: { type: String, required: true },
		addressLine2: { type: String, required: true },
	},
	{ timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);

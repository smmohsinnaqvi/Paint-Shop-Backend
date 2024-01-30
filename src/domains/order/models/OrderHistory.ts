import { Schema, model } from "mongoose";

const orderHistorySchema = new Schema(
	{
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order",
		},
		orderStatus: String,
		deliveryStatus: String,
		deliveryPartner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		customer: {
			type: Schema.Types.ObjectId,
			ref: "Customer",
		},
	},
	{ timestamps: true }
);

export const OrderHistory = model("OrderHistory", orderHistorySchema);

import mongoose, { Schema } from "mongoose";

const itemsSchema = new Schema({
	itemName: {
		type: String,
		// required: true,
	},
	price: {
		type: Number,
	},
	quantity: {
		type: Number,
	},
});
const orderSchema = new mongoose.Schema(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		items: {
			type: [itemsSchema],
		},
		totalQuantity: {
			type: Number,
		},
		totalPrice: {
			type: Number,
		},

		customer: {
			type: Schema.Types.ObjectId,
			ref: "Customer",
		},
		orderStatus: {
			type: String,
			enum: ["open", "in progress", "done"],
			default: "open",
		},
		deliveryStatus: {
			type: String,
			enum: ["accepted", "declined", "not assigned", "picked up", "delivered"],
			default: "not assigned",
		},
		deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		pickedUpImageURL: String,
		deliveredImageURL: String,
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

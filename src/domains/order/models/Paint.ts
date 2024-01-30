import { Schema, model } from "mongoose";

const paintSchema = new Schema({
	paintName: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

export const Paint = model("Paint", paintSchema);

import logger from "./logger";

export class ErrorResponse extends Error {
	statusCode;
	constructor(message: any, statusCode: Number) {
		super(message);
		this.statusCode = statusCode;
		logger.error(`${statusCode} , ${message}`);
	}
}

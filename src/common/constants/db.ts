import { Service } from "typedi";
import { connect } from "mongoose";
import logger from "../middlewares/logger";
@Service()
export class DBConnection {
	constructor() {}

	async startConnection() {
		await connect("mongodb://127.0.0.1:27017/paint-project")
			.then(() => [logger.info(`Database Connection Established`)])
			.catch(() => {
				logger.error(`Database Connection Failed`);
			});
	}
}

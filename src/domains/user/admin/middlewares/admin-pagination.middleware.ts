		//For Paginated Results
	// private async paginatedResult(result: any, req: Request, res: Response) {
	// 	let page = 1;
	// 	let limit = 10;
	// 	if (req.params) {
	// 		page = parseInt(req.params.page) || 1;
	// 		limit = parseInt(req.params.limit) || 10;
	// 	}

	// 	const startIndex = (page - 1) * limit;
	// 	const endIndex = page * limit;

	// 	const results = { success: false, next: {}, prev: {}, result: {} };

	// 	if (endIndex < result.length) {
	// 		results.next = {
	// 			page: page + 1,
	// 			limit: limit,
	// 		};
	// 	}

	// 	if (startIndex > 0) {
	// 		results.prev = {
	// 			page: page - 1,
	// 			limit: limit,
	// 		};
	// 	}
	// 	try {
	// 		results.result = await User.find().skip(startIndex).limit(limit).exec();
	// 	} catch (err) {
	// 		logger.error("Error while fetching user results");
	// 		res.status(400).json({
	// 			success: false,
	// 			error: "Error while fetching paginated results",
	// 		});
	// 	}
	// 	results.success = true;
	// 	logger.info("Successfully Sent paginated results");
	// 	res.status(200).json(results);
	// }
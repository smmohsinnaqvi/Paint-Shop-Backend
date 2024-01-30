import { Service } from "typedi";
import { createTransport } from "nodemailer";
import logger from "../middlewares/logger";
import fs from "fs";
import path from "path";
import { EmailHTML } from "./EmailHTML";
@Service()
export class EmailSender {
	constructor(private emailHTML: EmailHTML) {}
	private transporter = createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_ADDRESS,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	async sendPassword(
		email: string,
		firstName: string,
		lastName: string,
		password: string
	) {
		const html = this.emailHTML.sendPasswordToUser(
			firstName,
			lastName,
			password
		);
		const info = await this.transporter.sendMail({
			from: {
				name: "GO LOGO",
				// address: process.env.EMAIL_ADDRESS,
				address: "heyurmohsin@gmail.com",
			},
			to: email,
			subject: `Welcome User ! GO LOGO login Password`,
			html: html,
		});
		logger.info(`Email sent ` + info.messageId);
	}

	async sendOrderToCustomer(
		email: string,
		firstName: string,
		lastName: string,
		order: any
	) {
		const html = this.emailHTML.sendOrderToCustomer(firstName, lastName, order);
		try {
			const info = await this.transporter.sendMail({
				from: {
					name: "GO LOGO",
					// address: process.env.EMAIL_ADDRESS,
					address: "heyurmohsin@gmail.com",
				},
				to: email,
				subject: `Your Order is Created !`,
				html: html,
			});
			logger.info(`Email sent ` + info.messageId);
			if (!info) {
				logger.error(`Some error occurred while sending email`);
			}
		} catch (err) {
			logger.error(`Some error occurred while sending email`);
		}
	}

	async sendUpdatedOrderToCustomer(
		email: any,
		firstName: string,
		lastName: string,
		order: any
	) {
		const html = this.emailHTML.sendOrderToCustomer(firstName, lastName, order);
		try {
			const info = await this.transporter.sendMail({
				from: {
					name: "GO LOGO",
					// address: process.env.EMAIL_ADDRESS,
					address: "heyurmohsin@gmail.com",
				},
				to: email,
				subject: `Your Order is Updated`,
				html: html,
			});
			logger.info(`Email sent ` + info.messageId);
			if (!info) {
				logger.error(`Some error occurred while sending email`);
			}
		} catch (err) {
			logger.error(`Some error occurred while sending email`);
		}
	}

	async sendPickedUpToCustomer(customer: any, partner: any, order: any) {
		console.log(partner);

		const html = this.emailHTML.sendPickedUpToCustomer(
			customer,
			partner,
			order
		);
		try {
			const info = await this.transporter.sendMail({
				from: {
					name: "GO LOGO",
					// address: process.env.EMAIL_ADDRESS,
					address: "heyurmohsin@gmail.com",
				},
				to: customer.email,
				subject: `Your Order is on the Way`,
				html: html,
			});
			logger.info(`Email sent ` + info.messageId);
			if (!info) {
				logger.error(`Some error occurred while sending email`);
			}
		} catch (err) {
			logger.error(`Some error occurred while sending email`);
		}
	}
	async sendDeliveredToCustomer(order: any, customer:any) {

		const html = this.emailHTML.sendDeliveredToCustomer(
			order, customer
		);
		try {
			const info = await this.transporter.sendMail({
				from: {
					name: "GO LOGO",
					// address: process.env.EMAIL_ADDRESS,
					address: "heyurmohsin@gmail.com",
				},
				to: customer.email,
				subject: `Your Order is Delivered !`,
				html: html,
			});
			logger.info(`Email sent ` + info.messageId);
			if (!info) {
				logger.error(`Some error occurred while sending email`);
			}
		} catch (err) {
			logger.error(`Some error occurred while sending email`);
		}
	}
}

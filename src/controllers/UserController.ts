import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/Nodemailer";
import * as jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../environments/env";
import * as Request from "request";
import * as Cheerio from "cheerio";

export class UserController {
	static async signUp(req: any, res: any, next: any) {
		try {
			const { email, password, username, address } = req.body;

			const token = Utils.generateVerificationToken();

			const encryptPassword = await Utils.encryptPassword(password);

			const data = {
				email,
				password: encryptPassword,
				username,
				address,
				verification_token: token,
				verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
			};

			const user = await new User(data).save();

			const mailOptions = {
				to: email,
				from: getEnvironmentVariable().email,
				subject: "Verification Mail",
				text: `Here is your otp ${token}`,
			};

			res.send(user);

			await NodeMailer.transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					next(err);
				}
			});
		} catch (err) {
			next(err);
		}
	}

	static async verify(req: any, res: any, next: any) {
		try {
			const { verificationToken } = req.body;
			const email = req.user.email;

			const user = await User.findOneAndUpdate(
				{
					email,
					verification_token: verificationToken,
					verification_token_time: { $gt: Date.now() },
				},
				{
					verified: true,
					updated_at: new Date(),
				},
				{ new: true }
			);

			if (user) {
				res.send(user);
			} else {
				throw new Error(
					"Verification Token is expired. Please request for a new one"
				);
			}
		} catch (e) {
			next(e);
		}
	}

	static async resendVerificationMail(req: any, res: any, next: any) {
		try {
			const email = req.user.email;
			const token = Utils.generateVerificationToken();
			const user: any = await User.findOneAndUpdate(
				{
					email,
				},
				{
					verification_token: token,
					verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
					updated_at: Date.now(),
				}
			);

			if (user) {
				res.send(user);
				const mailer = await NodeMailer.transporter.sendMail({
					to: email,
					from: getEnvironmentVariable().email,
					subject: "Verification Mail",
					text: `Here is your otp ${token}`,
				});
			} else {
				throw new Error("User does not exist");
			}
		} catch (err) {
			next(err);
		}
	}

	static async login(req: any, res: any, next: any) {
		try {
			const { password } = req.body;

			let plainPassword = "" + password;
			let encryptedPassword = "" + req.user.password;
			
			await Utils.comparePassword({
			    plainPassword,
			    encryptedPassword,
			});
			
			const token = jwt.sign(
				{ _id: req.user._id, email: req.user.email },
				getEnvironmentVariable().jwt_secret,
				{ expiresIn: "120d" }
			);
			res.json({
				statusCode: 200,
				token,
				user: req.user,
			});
		} catch (err) {
			next(err);
		}
	}

	static async sendResetPassword(req: any, res: any, next: any) {
		try {
			const { email } = req.body;
			const resetPasswordToken = Utils.generateVerificationToken();
			const updatedUser = await User.findOneAndUpdate(
				{ email },
				{
					updated_at: Date.now(),
					reset_password_token: resetPasswordToken,
					reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
				},
				{ new: true }
			);

			res.send(updatedUser);
			await NodeMailer.transporter.sendMail({
				to: [email],
				from: getEnvironmentVariable().email,
				subject: "Reset Password Email",
				html: `<h1> ${resetPasswordToken} </h1>`,
			});
		} catch (err) {
			next(err);
		}
	}

	static async verifyResetPasswordToken(req: any, res: any, next: any) {
		try {
			res.json({
				success: true,
			});
		} catch (err) {
			next(err);
		}
	}

	static async resetPassword(req: any, res: any, next: any) {
		try {
			const user = req.user;
			const encryptedPassword = await Utils.encryptPassword(
				req.body.newPassword
			);
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ updated_at: Date.now(), password: encryptedPassword },
				{ new: true }
			);
			res.send(updatedUser);
		} catch (err) {
			next(err);
		}
	}

	static async uploadProfilePic(req: any, res: any, next: any) {
		try {
			const userId = req.user._id;
			const url = "http://localhost:8000/" + req.file.path;
			const updatedUser = await User.findOneAndUpdate(
				{ _id: userId },
				{
					updated_at: Date.now(),
					profile_pic_url: url,
				},
				{ new: true }
			);
			res.send(updatedUser);
		} catch (err) {
			next(err);
		}
	}

	static async testWebScraping(req: any, res: any, next: any) {
		Request(
			"https://webscraper.io/test-sites/e-commerce/allinone",
			(error, response, html) => {
				if (!error && response.statusCode == 200) {
					const $ = Cheerio.load(html);
					const data = [];

					$(".thumbnail").each((index, element) => {
						const image = $(element).find(".img-responsive").attr("src");
						const title = $(element).find(".title").text();
						const price = $(element).find(".price").text();
						const description = $(element).find(".description").text();

						data.push({ title, image, price, description });
					});

					res.send(data);
				}
			}
		);
	}

	static async amazonWebScraping(req: any, res: any, next: any) {
		try {
			Request(
				"https://www.amazon.in/Apple-iPhone-14-128-GB/dp/B0BXQ2V3NJ/ref=sr_1_1_sspa?crid=2U3VT8XFRRIV9&keywords=iphone&qid=1681717166&sprefix=iphone%2Caps%2C243&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
				(error, response, html) => {
					if (!error && response.statusCode == 200) {
						const $ = Cheerio.load(html);
						const data = [];

						$(".a-row").each((index, element) => {
							const name = $(element).find(".a-profile-name").text();
							const image = $(element).find(".a-profile-avatar").attr("src");
							const about = $(element).find(".a-expander-content").text();
							const vote = $(element).find(".cr-vote-text").text();
							data.push({ name, image, about, vote });
						});

						res.send(data);
					}
				}
			);
		} catch (err) {
			next(err);
		}
	}

	static async searchByKey(req: any, res: any, next: any) {
		try {
			const { q } = req.query;

			// for single filed
			// const users = await User.find({username : {$regex : name, $options : "i"}});

			// for multiple filed
			const users = await User.find({
				$or: [
					{ username: { $regex: q, $options: "i" } },
					{ address: { $regex: q, $options: "i" } },
				],
			});

			if (users) {
				res.send(users);
			} else {
				next(new Error("User not found"));
			}
		} catch (err) {
			next(err);
		}
	}
}

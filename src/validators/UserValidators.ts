import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidators {
    static signUp() {
        return [
            body("username", "username is required").isString(),
            body("email", "email is requried")
                .isEmail()
                .custom(async (email) => {
                    const user = await User.findOne({ email });
                    if (user) {
                        throw new Error("User Already Exist");
                    } else {
                        return true;
                    }
                }),
            body("password", "password is required")
                .isAlphanumeric()
                .isLength({ min: 6, max: 12 })
                .withMessage("password can be 6-12 character"),
            body("address", "Address is required").isString()
        ];
    }

    static verifyUser() {
        return [
            body("verificationToken", "Verification Token is required").isNumeric(),
        ];
    }

    static resendVerificationEmail() {
        return [query("email", "email is required").isEmail()];
    }

    static login() {
        return [
            body("email", "email is requried")
                .isEmail()
                .custom(async (email, { req }) => {
                    await User.findOne({ email }).then((user) => {
                        if (user) {
                            req.user = user;
                            return true;
                        } else {
                            throw new Error("user does not exist");
                        }
                    });
                }),
            body("password", "password is required").isAlphanumeric(),
        ];
    }

    static sendResetPasswordEmail() {
        return [
            body("email", "email is requried")
                .isEmail()
                .custom(async (email) => {
                    const user = await User.findOne({ email });
                    if(user){
                        return true;
                    }
                    else{
                        throw new Error('Email does not exist');
                    }
                }),
        ];
    }

    static verifyResetPassword() {
        return [
            query("resetPasswordToken", "reset password token is required")
                .isNumeric()
                .custom((token, {req}) => {
                    return User.findOne({
                        reset_password_token : token,
                        reset_password_token_time : {$gt : Date.now()}
                    }).then(user => {
                        if (user) {
                            return true;
                        }
                        else {
                            throw new Error("Token does not exist. Please request for new one");
                        }
                    })
                })
        ]
    }

    static resetPassword() {
        return [
            body("email", "email is required").isEmail().custom((email, {req}) => {
                return User.findOne({email})
                    .then(user => {
                        if (user) {
                            req.user = user;
                            return true;
                        }
                        else {
                            throw new Error("Email does not exist")
                        }
                    })
            }),
            body("newPassword", "password is required").isAlphanumeric().custom((newPassword, {req}) => {
                if (newPassword === req.body.confirmPassword) {
                    return true;
                }
                else {
                    throw new Error("new password and confirm password does not match")
                }
            }),
            body("confirmPassword", "confirm password is required").isAlphanumeric(),
            body("resetPasswordToken", "reset password token is required")
                .isNumeric()
                .custom((token, {req}) => {
                    if (Number(req.user.reset_password_token) === Number(token)) {
                        return true;
                    }
                    else {
                        req.errorStatus = 422;
                        throw new Error("Reset password token is invalid");
                    }
                })
        ]
    }

    static updateProfilePic() {
        return [
            body("profile_pic", "profile picture is required").custom((profile_pic, {req}) => {
                if (req.file) {
                    return true;
                }
                else {
                    throw new Error("File not uploaded");
                }
            })
        ]
    }
}

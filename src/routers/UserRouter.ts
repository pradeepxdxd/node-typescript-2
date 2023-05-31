import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { Utils } from "../utils/Utils";

class UserRouter{
    public router : Router;

    constructor(){
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes(){
        this.router.get("/resend/verify", GlobalMiddleware.authenticate, UserController.resendVerificationMail)
        this.router.post("/login", UserValidators.login(), GlobalMiddleware.checkError, UserController.login)
        this.router.get("/send/reset/password", GlobalMiddleware.authenticate, UserValidators.sendResetPasswordEmail(), GlobalMiddleware.checkError, UserController.sendResetPassword)
        this.router.get("/verify/reset/password", GlobalMiddleware.authenticate, UserValidators.verifyResetPassword(), GlobalMiddleware.checkError, UserController.verifyResetPasswordToken )
        this.router.get('/searchByName', GlobalMiddleware.authenticate, UserController.searchByKey);
        this.router.get('/test/webscraping', UserController.testWebScraping);
        this.router.get('/test/amazon/webscraping', UserController.amazonWebScraping);
    }
    
    postRoutes(){
        this.router.post("/signup", UserValidators.signUp(), GlobalMiddleware.checkError, UserController.signUp);
    }
    
    putRoutes(){
        
    }
    
    patchRoutes(){
        this.router.patch("/verify", GlobalMiddleware.authenticate, UserValidators.verifyUser(), GlobalMiddleware.checkError, UserController.verify);
        this.router.patch("/reset/passowrd", GlobalMiddleware.authenticate, UserValidators.resetPassword(), GlobalMiddleware.checkError, UserController.resetPassword)
        this.router.patch("/update/profilePic", GlobalMiddleware.authenticate, Utils.multer.single("profile_pic"), UserValidators.updateProfilePic(), GlobalMiddleware.checkError, UserController.uploadProfilePic)
    }

    deleteRoutes(){

    }
}

export default new UserRouter().router;
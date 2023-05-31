import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { CommentValidator } from "../validators/CommentValidator";
import { CommentController } from "../controllers/CommentController";

class CommentRouter {
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
        
    }
    
    postRoutes(){
        this.router.post('/add/:id', GlobalMiddleware.authenticate, CommentValidator.addComment(), GlobalMiddleware.checkError, CommentController.addComment);
    }
    
    putRoutes(){
        
    }
    
    patchRoutes(){
        this.router.patch('/edit/:id', GlobalMiddleware.authenticate, CommentValidator.editComment(), GlobalMiddleware.checkError, CommentController.editComment);
    }

    deleteRoutes(){
        // this.router.delete('/delete/:id', GlobalMiddleware.authenticate, CommentValidator.deleteComment(), GlobalMiddleware.checkError, CommentController.deleteComment)
        this.router.delete('/delete/:id', GlobalMiddleware.authenticate, CommentValidator.deleteComment(), GlobalMiddleware.checkError, CommentController.deleteMyComment)
    }
}

export default new CommentRouter().router;

import {validationResult} from "express-validator";
import * as jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../environments/env";

export class GlobalMiddleware{
    static checkError(req: any, res: any, next: any){
        const error = validationResult(req);
        if(!error.isEmpty()){
            next(new Error(error.array()[0].msg));
        }
        else{
            next();
        }
    }

    static async authenticate(req: any, res: any, next: any){
        try{
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.split(' ')[1] : null;

            jwt.verify(token, getEnvironmentVariable().jwt_secret, (err: any, decoded: any) => {
                if (err) {
                    next(err);
                }
                else if(!decoded){
                    req.errorStatus = 401;
                    next(new Error('User not authorised'));
                }
                else{
                    req.user = decoded
                    next();
                }
            })
        }
        catch(err){
            req.errorStatus = 403;
            next(err)
        }
    }
}
import * as express from "express";
import { getEnvironmentVariable } from "./environments/env";
import mongoose from "mongoose";
import UserRouter from "./routers/UserRouter";
import * as cors from 'cors';
import PostRouter from "./routers/PostRouter";
import bodyParser = require("body-parser");
import CommentRouter from "./routers/CommentRouter";
import { Jobs } from "./jobs/Jobs";

export class Server{
    public app : express.Application = express();

    constructor(){
        this.setConfigurations();
        this.setRoutes();
        this.pageNotFoundHandler();
        this.handleError();
    }
    
    setConfigurations(){
        this.connectMongoDb();  
        this.configuareBodyParser();
        this.configuareCors();
        Jobs.runRequiredJobs();
    }

    connectMongoDb(){
        const databaseUrl = getEnvironmentVariable().db_url;
        mongoose.connect(databaseUrl).then(() => console.log("DB Connected..."))
    }

    setRoutes(){
        this.app.use("/src/uploads", express.static("src/uploads")); 
        this.app.use("/api/user", UserRouter);
        this.app.use("/api/post", PostRouter);
        this.app.use("/api/comment", CommentRouter);
    }

    configuareBodyParser(){
        // this.app.use(bodyParser.urlencoded({extended : true}));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended : false}));
    }

    configuareCors(){
        this.app.use(cors({
            origin : 'http://localhost:3000',
            credentials : true
        }));

        // this.app.use(cors());
    }

    pageNotFoundHandler(){
        this.app.use((req, res) => {
            res.status(404).json({
                statusCode : 404,
                message : "Page Not Found"
            })
        })
    }

    handleError(){
        this.app.use((error : any, req : any, res : any, next : any) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                statusCode : errorStatus,
                message : error.message || 'Something Went Wrong'
            })
        })
    }
}
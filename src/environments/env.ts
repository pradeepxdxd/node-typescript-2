import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./prod.env";

export interface Environment{
    db_url : string,
    jwt_secret : string,
    email : string,
    password : string,
    port : number
}

export function getEnvironmentVariable(){
    if(process.env.NODE_ENV === "production"){
        return ProdEnvironment;
    }
    else{
        return DevEnvironment;
    }
}
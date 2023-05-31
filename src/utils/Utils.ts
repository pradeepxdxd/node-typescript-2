import * as bcrypt from "bcrypt";
import * as multer from "multer";

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, "./src/uploads");
    },
    filename : function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

export class Utils{
    public MAX_TOKEN_TIME = 100000;
    public static multer = multer({storage, fileFilter});

    static generateVerificationToken(size : number = 5){
        let digits = '0123456789';
        let otp = '';
        for(let i = 0; i < size; i++){
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }

    static encryptPassword(password : string) : Promise<any> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else{
                    resolve(hash);
                }
            })
        })
    }

    static async comparePassword(password : {plainPassword : string, encryptedPassword : string}) : Promise<any> {
        return new Promise((resolve, reject) => {            
            bcrypt.compare(password.plainPassword, password.encryptedPassword, (err, isValid) => {
                if (err) {                    
                    reject(err);
                }
                else if(!isValid){
                    reject("invalid email and password");
                }
                else{
                    resolve(isValid);
                }
            })
        })
    }
}
import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    verified : {
        type : Boolean,
        required : true,
        default : false
    },
    verification_token : {
        type : Number,
        required : true
    },
    verification_token_time : {
        type : Date,
        required : true
    },
    reset_password_token : {
        type : Number,
        required : false
    },
    reset_password_token_time : {
        type : Date,
        required : false
    },
    profile_pic_url : {
        type : String,
        required : true,
        default : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    created_at : {
        type : Date,
        required : true,
        default : new Date()
    },
    updated_at : {
        type : Date,
        required : true,
        default : new Date()
    },
})

export default mongoose.model("user", userSchema);
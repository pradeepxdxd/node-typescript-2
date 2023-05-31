import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    content : {
        type : String,
        trim : true
    },
    chat : {
        type : mongoose.Types.ObjectId,
        ref : 'Chat'
    }
}, {timestamps : true})

export default mongoose.model('Message', messageSchema);
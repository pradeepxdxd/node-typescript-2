import * as mongoose from "mongoose";
import Comments from "./Comments";

const postSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Types.ObjectId,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    comments : [{
        type : mongoose.Types.ObjectId,
        ref : 'comment'
    }]
}, {timestamps : true});

postSchema.post('remove', (async doc => {
    for (let id of (doc as any).comments) {
        await Comments.findOneAndDelete({_id : id});
    }
}))

postSchema.virtual("commentCounts").get(function(){
    return this.comments.length;
})

export default mongoose.model("post", postSchema);
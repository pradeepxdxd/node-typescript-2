import Comments from "../models/Comments";
import Post from "../models/Post";

export class PostController {
    static async addPost (req : any, res : any, next : any) {
        try{
            const { content } = req.body;
            const user_id = req.user._id;

            const post = await new Post({ content, user_id }).save();

            res.send(post);
        }
        catch(err) {
            next(err)
        }
    }

    static async getMyPost(req : any, res : any, next : any) {
        try{
            const user_id = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const perPage = 2;
            let currentPage = page;
            let prevPage = page === 1 ? null : page - 1;
            let pageToken = page + 1;
            let totalPage: number;

            const postCount = await Post.countDocuments({user_id});
            totalPage = Math.ceil( postCount / perPage);

            if (totalPage === page || totalPage === 0) {
                pageToken = null;
            }

            if (page > totalPage) {
                throw Error("No more post to show");
            }

            const posts = await Post.find({user_id}, {_id : 0, __v : 0, user_id : 0}).populate("comments").skip((perPage * page) - perPage).limit(perPage);

            res.json({
                posts,
                pageToken,
                totalPage,
                currentPage,
                prevPage
            })
        }
        catch(err) {
            next(err);
        }
    }

    static async getAllPosts(req : any, res : any, next : any) {
        try{
            const page = parseInt(req.query.page) || 1;
            const perPage = 2;
            let currentPage = page;
            let prevPage = page === 1 ? null : page - 1;
            let pageToken = page + 1;
            let totalPage: number;

            const postCount = await Post.estimatedDocumentCount();
            totalPage = Math.ceil( postCount / perPage);

            if (totalPage === page || totalPage === 0) {
                pageToken = null;
            }
            
            if (page > totalPage) {
                throw Error("No more post to show");
            }

            const posts = await Post.find({}, {_id : 0, __v : 0, user_id : 0}).populate("comments").skip((perPage * page) - perPage).limit(perPage);

            res.json({
                posts,
                pageToken,
                totalPage,
                currentPage,
                prevPage
            })
        }
        catch(err) {
            next(err);
        }
    }

    static async getPostById(req : any, res : any, next : any) {
        try{
            res.json({
                post : req.post,
                commentCount : req.post.commentCounts
            })
        }
        catch(err) {
            next(err);
        }
    }

    static async editPost(req : any, res : any, next : any) {
        try{
            const content = req.body.content;

            const updatedPost = await Post.findOneAndUpdate({_id : req.params.id}, {content}, {new : true}).populate("comments");

            if (updatedPost) {
                res.send(updatedPost);
            }
            else {
                throw new Error("Post does not exist")
            }
        }
        catch(err){
            next(err);
        }
    }

    static async deletePost(req : any, res : any, next : any) {
        try{
            const id = req.params.id;
            const post = await Post.findById({_id : id});

            // deleting all the comments from Comments collection
            for (let id of (post as any).comments) {
                await Comments.findOneAndDelete({_id : id});
            }

            // deleting the Post
            const postDeleted = await Post.findOneAndDelete({_id : id});
            if (postDeleted) {
                res.send('Post is deleted');
            }
            else {
                next(new Error('Something went wrong'));
            }
        }
        catch(err) {
            next(err);
        }
    }

}
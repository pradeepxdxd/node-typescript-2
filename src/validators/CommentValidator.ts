import { body, param } from "express-validator";
import Post from "../models/Post";
import Comments from "../models/Comments";

export class CommentValidator {
    static addComment() {
        return [
            body("content", "comment is required").isString(),
            param("id").custom((id, { req }) => {
                return Post.findOne({ _id: id })
                    .then((post) => {
                        req.post = post;
                        return true;
                    })
                    .catch((err) => {
                        throw new Error("Post does not exist");
                    });
            }),
        ];
    }

    static editComment() {
        return [
            body('content', 'Content is required').isString()
        ]
    }

    static deleteComment() {
        return [param('id').custom((id, {req}) => {
            return Comments.findOne({_id: id}).then((comment) => {
                if (comment) {
                    req.comment = comment;
                    return true;
                } else {
                    throw new Error('Comment Does Not Exist');
                }
            })
        })]
    }
}

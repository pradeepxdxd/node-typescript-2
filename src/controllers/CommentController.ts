import Comments from "../models/Comments";
import Post from "../models/Post";

export class CommentController {
  static async addComment(req: any, res: any, next: any) {
    try {
      const content = req.body.content;
      const post = req.post;

      console.log(post);

      const comment = new Comments({
        content,
      });

      post.comments.push(comment);
      Promise.all([comment.save(), post.save()]);

      res.send(comment);
    } catch (err) {
      next(err);
    }
  }

  static async editComment(req: any, res: any, next: any) {
    try {
      const content = req.body.content;
      const commentId = req.params.id;

      const updatedComment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { content },
        { new: true }
      );

      if (updatedComment) {
        res.send(updatedComment);
      } else {
        throw new Error("Comment does not exist");
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteComment(req: any, res: any, next: any) {
    const comment = req.comment;
    try {
      await comment.remove();
      res.send(comment);
    } catch (e) {
      next(e);
    }
  }

  static async deleteMyComment(req: any, res: any, next: any) {
    try {
      const commentId = req.params.id;
      await Comments.findOneAndDelete({ _id: commentId });
      const post = await Post.findOne({ comments: { $in: [commentId] } });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: post._id },
        { $pull: { comments: commentId } }
      );
      if (updatedPost) {
        res.send("comment is deleted");
      } else {
        next(new Error("Something went wrong"));
      }
    } catch (err) {
      next(err);
    }
  }
}

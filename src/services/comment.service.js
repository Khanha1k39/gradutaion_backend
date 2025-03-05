const Comment = require("../models/repository/comment.model");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
    } else {
      const maxRightValue = await Comment.findOne({
        comment_productId: convertToObjectIdMongoDB(productId),
        comment_parentId: null,
        sort: { comment_right: -1 },
      });

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    return await comment.save();
  }
}
module.exports = CommentService;

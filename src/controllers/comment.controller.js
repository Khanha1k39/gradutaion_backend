const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new OkResponse({
      message: "Successful checkout review",
      metadata: await CommentService.createComment({
        ...req.body,
      }),
    }).send(res);
  };
}
module.exports = new CommentController();

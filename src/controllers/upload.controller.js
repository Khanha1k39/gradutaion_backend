const { OkResponse } = require("../core/success.response");
const { uploadImageFromLocalS3 } = require("../services/upload.service");

class UploadController {
  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }

    new OkResponse({
      message: "upload successfully uploaded",
      metadata: await uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}
module.exports = new UploadController();

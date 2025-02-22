"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse, OkResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new OkResponse({
      message: "Successful Code Generation",
      metadata: await listNotiByUser({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new NotificationController();

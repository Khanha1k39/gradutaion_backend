"use strict";

const notificationModel = require("../models/notification.model");

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type == "SHOP-001") {
    noti_content = "Vua them san pham";
  } else if (type == "PROMOTION-001") {
    noti_content = "Pgg";
  }
  const newNoti = await notificationModel.create({
    noti_type: type,
    noti_content,
    noti_options: options,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
  });
  return newNoti;
};
const listNotiByUser = async ({
  userId = "1", // ID người nhận thông báo
  type = "ALL", // Loại thông báo, mặc định là 'ALL'
  isRead = 0, // Trạng thái đọc của thông báo
}) => {
  // Xây dựng điều kiện lọc cho truy vấn
  const match = { noti_receivedId: userId };

  if (type !== "ALL") {
    match["noti_type"] = type; // Thêm điều kiện lọc theo loại thông báo
  }

  // Sử dụng Mongoose Aggregation để lọc và chỉ lấy các trường cần thiết
  return await notificationModel.aggregate([
    {
      $match: match, // Lọc thông báo theo người nhận và loại thông báo
    },
    {
      $project: {
        noti_type: 1, // Chỉ lấy trường 'noti_type'
        noti_senderId: 1, // Chỉ lấy trường 'noti_senderId'
        noti_receivedId: 1, // Chỉ lấy trường 'noti_receivedId'
        noti_content: 1, // Chỉ lấy trường 'noti_content'
        createAt: 1, // Chỉ lấy trường 'createAt' (ngày tạo thông báo)
      },
    },
  ]);
};
module.exports = { pushNotiToSystem, listNotiByUser };

"use strict";
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
const keySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: "true",
      ref: "Shop",
    },
    publicKey: {
      type: String,
      require: "true",
    },
    privateKey: {
      type: String,
      require: "true",
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, keySchema);
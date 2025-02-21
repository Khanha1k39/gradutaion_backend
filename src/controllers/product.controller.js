'use strict'

const { CreatedResponse, OkResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new CreatedResponse({
            message: "create product successfully",
            metadata: await ProductFactory.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId })
        }).send(res);
    }

    getAllDraftsForShop = async (req, res) => {
        new OkResponse({
            message: "get all drafts successfully",
            metadata: await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res);
    }

    getAllPublishedForShop = async (req, res) => {
        new OkResponse({
            message: "get all successfully",
            metadata: await ProductFactory.getAllPublishedForShop({ product_shop: req.user.userId })
        }).send(res);
    }
    PublishProductForShop = async (req, res) => {
        new OkResponse({
            message: "publish successfully",
            metadata: await ProductFactory.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res);
    }
    unPublishProductForShop = async (req, res) => {
        new OkResponse({
            message: "unpublish successfully",
            metadata: await ProductFactory.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res);
    }
    searchProductsByUser = async (req, res) => {
        new OkResponse({
            message: "Search successfully",
            metadata: await ProductFactory.searchProductsByUser(req.params)
        }).send(res);
    }
    findAllProduct = async (req, res) => {
        new OkResponse({
            message: "find all successfully",
            metadata: await ProductFactory.findAllProducts(req.query)
        }).send(res);
    }
    findProduct = async (req, res) => {
        new OkResponse({
            message: "find product successfully",
            metadata: await ProductFactory.findProduct(req.params.id)
        }).send(res);
    }

    updateProduct = async (req, res) => {
        new OkResponse({
            message: "Update product successfully",
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.body, req.params.id)
        }).send(res);
    }

}

module.exports = new ProductController();
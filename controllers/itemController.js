const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
exports.item_create_get = function (req, res, next) {
  Category.find({})
  .sort([["name", "ascending"]])
  .exec(function (err, categories) {
    if (err) {
      return next(err);
    }
    if (categories == null) {
      // no results.
      let err = new Error("categories not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render("item_form", { title: "Create Item", categories: categories });
  });
};

// POST request for creating item.
exports.item_create_post = function (req, res, next) {
    res.send("Page not yet build for item_create_post")
  };

// GET request to delete item.
exports.item_delete_get = function (req, res, next) {
    res.send("Page not yet build for item_delete_get")
  };

// POST request to delete item.
exports.item_delete_post = function (req, res, next) {
    res.send("Page not yet build for item_delete_post")
  };

// GET request to update item.
exports.item_update_get = function (req, res, next) {
    res.send("Page not yet build for item_update_get")
  };

// POST request to update item.
exports.item_update_post = function (req, res, next) {
    res.send("Page not yet build for item_update_post")
  };

// GET request for one item.
exports.item_detail = function (req, res, next) {
    res.send("Page not yet build for item_details")
  };

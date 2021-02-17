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
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name").trim().isLength({ min: 1, max: 100 }).escape().withMessage("Must provide a name."),
  body("sku").trim().isLength({ min: 1, max: 100 }).escape().withMessage("Must provide a sku."),
  body("price")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Must provide a price")
    .isNumeric()
    .withMessage("price must be a number.")
    .isFloat({ min: 0 })
    .withMessage("price must be greater than or equal to 0."),
  body("quantity")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Must provide a quantity")
    .isNumeric()
    .withMessage("Quantity must be a number.")
    .isFloat({ min: 0 })
    .withMessage("quantity must be greater than or equal to 0."),
  body("weight")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Must provide a weight")
    .isNumeric()
    .withMessage("Weight must be a number.")
    .isFloat({ min: 0 })
    .withMessage("weight must be greater than or equal to 0."),
  body("category")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage("Must provide a category."),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape()
    .withMessage("Description must be 5000 characters or less."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("item_form", {
        title: "Create Item",
        item: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      let item = new Item({
        name: req.body.name,
        sku: req.body.sku,
        price: req.body.price,
        quantity: req.body.quantity,
        weight: req.body.weight,
        category: req.body.category,
        description: req.body.description,
      });

      // Check to see if the category exists
      Category.findById(item.category).exec((err, found_category) => {
        if (err) {
          return next(err);
        } else if (found_category) {
          // Check to see if the sku is already being used
          Item.findOne({ sku: item.sku }).exec((err, found_sku) => {
            if (found_sku) {
              res.redirect(found_sku.url);
              console.log(`sku: "${item.sku}" already exists`);
            } else {
              item.save((err) => {
                if (err) {
                  return next(err);
                }
                // Successful - redirect to the new item record.
                res.redirect(item.url);
              });
            }
          });
        }
      });
    }
  },
];

// GET request to delete item.
exports.item_delete_get = function (req, res, next) {
  res.send("Page not yet build for item_delete_get");
};

// POST request to delete item.
exports.item_delete_post = function (req, res, next) {
  res.send("Page not yet build for item_delete_post");
};

// GET request to update item.
exports.item_update_get = function (req, res, next) {
  res.send("Page not yet build for item_update_get");
};

// POST request to update item.
exports.item_update_post = function (req, res, next) {
  res.send("Page not yet build for item_update_post");
};

// GET request for one item.
exports.item_detail = function (req, res, next) {
  res.send("Page not yet build for item_details");
};

const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const async = require("async");

// Display list of all Categories.
exports.index_get = function (req, res, next) {
  Category.find()
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
    res.render("index", { title: "Categories", categories: categories });
  });
};

// GET request for creating category.
exports.category_create_get = function (req, res, next) {
  res.render("category_form", { title: "Create Category" });
};

// POST request for creating category.
exports.category_create_post = [
  // Validate and sanitize fields.
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Must provide a name."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Must provide a description."),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    console.log(req.body);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Create Category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      let category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      Category.findOne({ name: req.body.name }).exec(function (err, found_category) {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_category.url);
          console.log("Category already exists");
        } else {
          category.save(function (err) {
            if (err) {
              return next(err);
            }
            // Successful - redirect to new author record.
            res.redirect(category.url);
          });
        }
      });
      // Data from form is valid.

      // Create an Category object with escaped and trimmed data.
    }
  },
];

// GET request to delete category.
exports.category_delete_get = function (req, res, next) {
  res.send("Page not yet build for category_delete_get");
};

// POST request to delete category.
exports.category_delete_post = function (req, res, next) {
  res.send("Page not yet build for category_delete_post");
};

// GET request to update category.
exports.category_update_get = function (req, res, next) {
  res.send("Page not yet build for category_update_get");
};

// POST request to update category.
exports.category_update_post = function (req, res, next) {
  res.send("Page not yet build for category_update_post");
};

// GET request for one category.
exports.category_detail = function (req, res, next) {
  Category.findOne({ name: req.params.id.split("_").join(" ") }).exec(function (err, category) {
    if (err) {
      return next(err);
    }
    if (category == null) {
      // no results.
      let err = new Error("category not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render("category_detail", { category: category });
  });
};

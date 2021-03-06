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
        nameLower: req.body.name.toLowerCase(),
        description: req.body.description,
      });

      Category.findOne({ nameLower: req.body.name.toLowerCase() }).exec(function (
        err,
        found_category
      ) {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
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
  Category.findOne({ nameLower: req.params.id.split("_").join(" ") }).exec((err, category) => {
    if (err) {
      return next(err);
    }
    if (category == null) {
      res.redirect("/");
    }
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
    });
  });
};

// POST request to delete category.
exports.category_delete_post = function (req, res, next) {
  Category.findByIdAndRemove(req.body.categoryid, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// GET request to update category.
exports.category_update_get = function (req, res, next) {
  Category.findOne({ nameLower: req.params.id.split("_").join(" ") }).exec(function (
    err,
    found_category
  ) {
    if (err) {
      return next(err);
    }
    if (found_category) {
      res.render("category_form", {
        title: `Update Category: ${found_category.name}`,
        category: found_category,
      });
    } else {
      return next(err);
    }
  });
};

// POST request to update category.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Must provide a name."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Must provide a description."),

  (req, res, next) => {
    const errors = validationResult(req);

    Category.findOne({ nameLower: req.params.id.split("_").join(" ") }).exec(function (
      err,
      found_category
    ) {
      if (err) {
        return next(err);
      }
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("category_form", {
          title: `Update Category: ${found_category.name}`,
          category: req.body,
          errors: errors.array(),
        });
        return;
      } else {
        let updatedCategory = new Category({
          name: req.body.name,
          nameLower: req.body.name.toLowerCase(),
          description: req.body.description,
          _id: found_category._id,
        });

        //check to see if the cateogry name is already in use
        Category.find({ nameLower: updatedCategory.nameLower.split("_").join(" ") }).exec(
          (err, checked_category) => {
            if (err) {
              return next(err);
            }
            if (checked_category) {
              if (checked_category._id == found_category._id) {
                let msg = `the category name <a href="${checked_category[0].url}">${checked_category[0].name}</a> is already in use.`;
                res.render("category_form", {
                  title: `Update Category: ${found_category.name}`,
                  category: req.body,
                  errors: [
                    {
                      msg: msg,
                    },
                  ],
                });
              }
            }
            Category.findByIdAndUpdate(
              updatedCategory._id,
              updatedCategory,
              { new: true },
              (err, theCategory) => {
                if (err) {
                  return next(err);
                }
                console.log("POST LOGIC: " + updatedCategory);
                res.redirect(theCategory.url);
              }
            );
          }
        );
      }
    });
  },
];

// GET request for one category.
exports.category_detail = function (req, res, next) {
  async.waterfall(
    [
      function (callback) {
        Category.findOne({ nameLower: req.params.id.split("_").join(" ") }).exec(function (
          err,
          found_category
        ) {
          if (found_category) {
            callback(null, found_category);
          } else {
            return next(err);
          }
        });
      },
      function (found_category, callback) {
        Item.find({ category: found_category._id }).exec(function (err, items) {
          if (items) {
            callback(null, found_category, items);
          } else {
            return next(err);
          }
        });
      },
      function (found_category, items, callback) {
        if (found_category == null) {
          // no results.
          let err = new Error("category not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render.
        res.render("category_detail", { category: found_category, items: items });
        callback(null, "done");
      },
    ],
    function (err, result) {
      // result now equals 'done'
      if (err) {
        return next(err);
      }
    }
  );
};

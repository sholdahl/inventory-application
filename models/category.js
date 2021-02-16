var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 5000 },
});

// Virtual for category's URL
CategorySchema.virtual("url").get(function () {
  return "/category/" + this.name.split(' ').join('_');
});

module.exports = mongoose.model("Category", CategorySchema);

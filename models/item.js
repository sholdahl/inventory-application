var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  skuLower: { type: String, required: true, maxLength: 100 },
  sku: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 5000, required: false },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  weight: { type: Number, required: false, min: 0 },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

// Virtual for Item's URL
ItemSchema.virtual("url").get(function () {
  return "/item/" + this.sku.toLowerCase().split(' ').join('_');;
});

module.exports = mongoose.model("Item", ItemSchema);

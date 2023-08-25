const slugify = require("slugify");
const Product = require("../models/productModel");
const createError = require("http-errors");
const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    category,
    imageBufferString,
  } = productData;
  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createError(409, "Product name Already exists  ");
  }

  const product = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    category: category,
    image: imageBufferString,
  });
  return product;
};
const getProducts = async (page = 1, limit = 4, filter = {}) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit);
  if (!products) {
    throw createError(404, "Product not found ");
  }
  const count = await Product.find(filter).countDocuments();

  return {
    products,
    count,
    totalPage: Math.ceil(count / limit),
    currentPage: page,
  };
};
const getProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) {
    throw createError(404, "Product not found with this slug");
  }
  return product;
};
const deleteProduct = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });
  if (!product) {
    throw createError(404, "Product not found with this slug");
  }
  return product;
};
const updateProduct = async (slug, updates, image) => {
  const updateOptions = { new: true, runValidators: true, context: "query" };
  if (updates.name) {
    updates.slug = slugify(updates.name);
  }

  if (image) {
    if (image > 12097152) {
      createError(400, "File too large . It must be less then 2 Mb");
    }
    updates.image = image.buffer.toString("base64");
  }

  const updateProduct = await Product.findOneAndUpdate(
    { slug },
    updates,
    updateOptions
  );

  if (!updateProduct) {
    throw createError(403, "Product does not exists with this slug");
  }

  return updateProduct;
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};

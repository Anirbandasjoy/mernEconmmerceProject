const slugify = require("slugify");
const Category = require("../models/categoryModel");
const createCategory = async (name) => {
  const category = await Category.create({
    name: name,
    slug: slugify(name),
  });
  return category;
};

const getCategories = async () => {
  return await Category.find({}).select("name slug").lean();
};
const getCategory = async (slug) => {
  return await Category.find({ slug }).select("name slug").lean();
};

const updateCategory = async (name, slug) => {
  const filter = { slug: slug };
  const updates = {
    $set: {
      name: name,
      slug: slugify(name),
    },
  };
  const option = { new: true };

  const updatedNewCategory = await Category.findOneAndUpdate(
    filter,
    updates,
    option
  );
  return updatedNewCategory;
};

const deleteCategory = async (slug) => {
  return await Category.findOneAndDelete({ slug });
};
module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

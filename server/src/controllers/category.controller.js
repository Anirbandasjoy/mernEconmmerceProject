const createError = require("http-errors");
const { successReponse } = require("./responseContraller");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/category");

const handelCategoryCreate = async (req, res, next) => {
  try {
    const { name } = req.body;
    await createCategory(name);
    return successReponse(res, {
      statusCode: 201,
      message: "Category cteated successfully",
    });
  } catch (error) {
    next(error);
  }
};
const handelGetCategories = async (req, res, next) => {
  try {
    const catagories = await getCategories();
    if (!catagories) {
      throw createError(404, "Categories not found ");
    }
    return successReponse(res, {
      statusCode: 200,
      message: "Category cteated successfully",
      payload: catagories,
    });
  } catch (error) {
    next(error);
  }
};
const handelGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategory(slug);
    if (!category) {
      throw createError(404, "Categories not found ");
    }
    return successReponse(res, {
      statusCode: 200,
      message: "Category cteated successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

const handelUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const updatedNewCategory = await updateCategory(name, slug);
    if (!updatedNewCategory) {
      throw createError(404, "Category not fond with this slug");
    }
    return successReponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: updatedNewCategory,
    });
  } catch (error) {
    next(error);
  }
};
const handelDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedCategory = await deleteCategory(slug);
    if (!deletedCategory) {
      throw createError(404, "Category not fond with this slug");
    }
    return successReponse(res, {
      statusCode: 200,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelCategoryCreate,
  handelGetCategories,
  handelGetCategory,
  handelUpdateCategory,
  handelDeleteCategory,
};

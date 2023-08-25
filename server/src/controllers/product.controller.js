const createError = require("http-errors");
const { successReponse } = require("./responseContraller");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../services/productService");
const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const handelProductCreate = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;
    if (!req.file) {
      createError(400, "image file is required");
    }
    if (req.file.size > 12097152) {
      createError(400, "File too large . It must be less then 2 Mb");
    }
    const imageBufferString = req.file.buffer.toString("base64");
    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      category,
      imageBufferString,
    };
    const product = await createProduct(productData);

    return successReponse(res, {
      statusCode: 201,
      message: "Product was created successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};
const handelGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        {
          name: { $regex: searchRegExp },
        },
      ],
    };

    const productData = await getProducts(page, limit, filter);
    const { products, count, totalPage, currentPage } = productData;

    return successReponse(res, {
      statusCode: 201,
      message: "Returned All Products",
      payload: {
        products: products,
        pagination: {
          totalPage: totalPage,
          currentPage: currentPage,
          prvPage: currentPage - 1,
          nextPage: currentPage + 1,
          totalNumberOfProduct: count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const handelGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getProduct(slug);
    return successReponse(res, {
      statusCode: 201,
      message: "Returned All Products",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};
const handelDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    await deleteProduct(slug);
    return successReponse(res, {
      statusCode: 201,
      message: "deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
const handelUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let updates = {};

    const allowedFild = [
      "name",
      "description",
      "price",
      "quantity",
      "shipping",
      "sold",
    ];
    for (let key in req.body) {
      if (allowedFild.includes(key)) {
        updates[key] = req.body[key];
      }
      //  else if (key == "email") {
      //   throw new Error("Email can not be updated");
      // }
    }
    const image = req.file;

    const product = await updateProduct(slug, updates, image);
    console.log(product);

    return successReponse(res, {
      statusCode: 200,
      message: "Product was updated successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelProductCreate,
  handelGetProducts,
  handelGetProduct,
  handelDeleteProduct,
  handelUpdateProduct,
};

const productsModel = require("../../models/products");
const categoriesModel = require("../../models/categories");
const { isValidObjectId } = require("mongoose");

exports.getAll = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      sortBy = "price",
      order = "asc",
      categoryID,
      minPrice,
      maxPrice,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    if (limit > 100) limit = 100;

    let filter = {};
    if (categoryID) {
      if (!isValidObjectId(categoryID)) {
        return res.status(400).json({ message: "آیدی دسته‌بندی معتبر نیست" });
      }
      filter.categoryID = categoryID;
    }
    if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
    if (maxPrice)
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    const products = await productsModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await productsModel.countDocuments(filter);

    return res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};

exports.getOne = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "آیدی محصول معتبر نیست",
    });
  }

  const product = await productsModel.findOne({ _id: id });

  if (!product) {
    return res.status(404).json({
      message: "محصول پیدا نشد",
    });
  }

  return res.json({ product });
};

exports.getByCategory = async (req, res) => {
  const { categoryID } = req.params;

  if (!isValidObjectId(categoryID)) {
    return res.status(400).json({
      message: "آیدی دسته بندی معتبر نیست",
    });
  }

  const isCategoryExists = await categoriesModel.findOne({ _id: categoryID });

  if (!isCategoryExists) {
    return res.status(404).json({
      message: "دسته بندی پیدا نشد",
    });
  }

  const products = await productsModel.find({ categoryID });

  return res.json({ products });
};

exports.add = async (req, res) => {
  try {
    const { title, description, price, discount, categoryID } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "تصویری ارسال نشده است!",
      });
    }

    const isCategoryExists = await categoriesModel.findById(categoryID);
    if (!isCategoryExists) {
      return res.status(404).json({ message: "دسته‌بندی پیدا نشد" });
    }

    const mediaUrlPath = `/covers/${req.file.filename}`;

    const addedProduct = await productsModel.create({
      title,
      description,
      price,
      categoryID,
      image: mediaUrlPath,
      discount,
    });

    return res.status(201).json({
      message: "محصول با موفقیت اضافه شد",
      addedProduct,
    });
  } catch (error) {
    console.error("Error in adding product:", error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "آیدی محصول معتبر نیست",
    });
  }

  const removedProduct = await productsModel.findOneAndDelete({ _id: id });

  if (!removedProduct) {
    return res.status(404).json({
      message: "محصول پیدا نشد",
    });
  }

  return res.status(200).json({
    message: "محصول با موفقیت حذف شد",
    removedProduct,
  });
};

exports.edit = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    timeRequired,
    priceWithoutDiscount,
    priceWithDiscount,
    categoryID,
    discount,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message: "تصویری ارسال نشده",
    });
  }

  const mediaUrlPath = `/covers/${req.file.filename}`;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "آیدی محصول معتبر نیست",
    });
  }

  const updatedProduct = await productsModel.findByIdAndUpdate(id, {
    title,
    description,
    timeRequired,
    priceWithDiscount,
    priceWithoutDiscount,
    categoryID,
    discount,
    image: {
      filename: req.file.filename,
      path: mediaUrlPath,
    },
  });

  if (!updatedProduct) {
    return res.status(404).json({
      message: "محصول پیدا نشد",
    });
  }

  return res.status(200).json({
    message: "محصول با موفقیت ویرایش شد",
    updatedProduct,
  });
};

exports.getByDiscounts = async (req, res) => {
  try {
    const productsDiscount = await productsModel.find({ discount: { $gt: 0 } });

    return res.json({
      products: productsDiscount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "خطایی رخ داده است", error });
  }
};

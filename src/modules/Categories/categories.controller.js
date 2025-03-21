const { isValidObjectId } = require("mongoose");
const categoryModel = require("../../models/categories");

exports.getAll = async (req, res) => {
  const categories = await categoryModel.find({}).lean();

  return res.json(categories);
};

exports.add = async (req, res) => {
    const { title } = req.body;

    const categoryExists = await categoryModel.findOne({ title });
    const mediaUrlPath = `/covers/${req.file.filename}`;

    if (categoryExists) {
      return res.status(400).json({
        message: "این دسته بندی قبلا اضافه شده",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "تصویر ارسال نشده!",
      });
    }

    const category = await categoryModel.create({
      title,
      image: mediaUrlPath,
    });

    return res.status(201).json({
      message: "دسته بندی با موفقیت ایجاد شد",
      category,
    })
};

exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "تصویر ارسال نشده!",
      });
    }

    const mediaUrlPath = `/covers/${req.file.filename}`;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "آیدی دسته بندی معتبر نیست",
      });
    }

    const category = await categoryModel.findOneAndUpdate(
      { _id: id },
      {
        title: title,
        image: mediaUrlPath,
      },
      { new: true } 
    );

    if (!category) {
      return res.status(404).json({
        message: "دسته بندی پیدا نشد!",
      });
    }

    return res.status(200).json({
      message: "دسته بندی با موفقیت ویرایش شد",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "خطا در ویرایش دسته بندی",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "آیدی دسته بندی معتبر نیست",
    });
  }

  const category = await categoryModel.findOneAndDelete({ _id: id });

  if (!category) {
    return res.status(404).json({
      message: "دسته بندی پیدا نشد",
    });
  }

  return res.status(200).json({
    message: "دسته بندی با موفقیت حذف شد",
  });
};

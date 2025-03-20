const { isValidObjectId } = require("mongoose");
const usersModel = require("../../models/users");

exports.allUsers = async (req, res) => {
  const users = await usersModel.find({}).select("-password").lean();

  return res.status(200).json(users);
};

exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId) {
      return res.status(400).json({
        message: "آیدی وارد شده معتبر نیست",
      });
    }

    const user = await usersModel
      .findOneAndUpdate(
        { _id: id },
        {
          role: req.body.role,
        }
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "کاربر پیدا نشد",
      });
    }

    return res.status(200).json({
      message: "نقش کاربر با موفقیت تغییر یافت",
      user,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId) {
    return res.status(400).json({
      message: "آیدی کاربر معتبر نیست",
    });
  }

  const removeUser = await usersModel.findOneAndDelete({ _id: id });

  if (!removeUser) {
    return res.status(404).json({
      message: "کاربر پیدا نشد",
    });
  }

  return res.status(200).json({
    message: "کاربر با موفقیت حذف شد",
    removeUser,
  });
};

exports.edit = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "لطفا تمامی فیلدها را پر کنید" });
  }

  const user = await usersModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      name,
      phone,
      email,
      password,
    }
  );

  if (!user) {
    return res.status(404).json({
      message: "کاربر پیدا نشد",
    });
  }

  return res.status(200).json({
    message: "اطلاعات با موفقیت تغییر یافت",
  });
};

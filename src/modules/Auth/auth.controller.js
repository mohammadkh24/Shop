const usersModel = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "لطفا تمامی فیلدها را پر کنید" });
    }

    const existUser = await usersModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (existUser) {
      return res.status(400).json({
        message: "کاربر با این شماره موبایل یا ایمیل قبلا ثبت نام کرده",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const countOfUsers = await usersModel.countDocuments();

    const user = await usersModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: countOfUsers > 0 ? "USER" : "ADMIN",
    });

    const userObject = user.toObject();
    Reflect.deleteProperty(userObject, "password");

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30 days",
    });

    return res.status(201).json({
      message: "ثبت نام با موفقیت انجام شد",
      user,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "لطفا تمامی فیلدها را پر کنید" });
  }

  const user = await usersModel.findOne({ phone: phone });

  if (!user) {
    return res.status(404).json({
      message: "کاربر با این شماره موبایل پیدا نشد",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({
      message: "رمز عبور صحیح نیست",
    });
  }

  const accessToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 days",
  });

  return res.status(200).json({
    message: "ورود با موفقیت انجام شد",
    accessToken,
  });
};

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/**
 * @name  signup
 * @route  api/user/signup
 * @body  name, password, email
 */
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({
      status: false,
      errors: errors.array(),
    });
  }
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        status: false,
        message: "Email already taken!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encPassword = await bcrypt.hash(password, salt);

    user = new User({
      password: encPassword,
      email,
      name,
    });

    await user.save();
    console.log(user);
    const payload = {
      user: {
        id: user._id,
      },
    };
    console.log(payload);

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 864000, // 10 days
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          status: true,
          token,
          isAdmin: user.isAdmin,
          name: user.name,
        });
      }
    );
  } catch (e) {
    console.log(e);
    res.send({
      status: false,
      message: "Error in Fetching user",
    });
  }
};

/**
 * @name  login
 * @route  api/user/login
 * @description  logs the users and gives JWT
 * @body  email, password
 */
exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email,
    });

    if (!user)
      return res.status(200).json({
        status: false,
        message: "User Not Exist",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(200).json({
        status: false,
        message: "Invalid credentials",
      });

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 864000, // 10 days
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          status: true,
          token,
          isAdmin: user.isAdmin,
          name: user.name,
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

/**
 * @name  updatePassword
 * @route  api/user/update-password
 * @description  updates user password
 * @body  oldPassword, password
 */
exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(200).json({
      status: false,
      errors: errors.array(),
    });
  }

  const { oldPassword, password } = req.body;
  const id = req.user.id;
  console.log({ oldPassword, password, id });
  try {
    const user = await User.findById(id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(200).json({
        status: false,
        message: "Incorrect Password!",
      });
    const salt = await bcrypt.genSalt(10);
    const encPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(id, { password: encPassword });

    res.status(200).json({
      status: true,
      message: "Password updated successful",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

/**
 * @name  me
 * @route  api/user/me
 * @description  gets logged in user's information
 * @body  userId, which is populated by withAuth middleware
 */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate([
      {
        path: "taskAssigned",
        model: "Task",
        populate: {
          path: "assignedBy",
          model: "User",
          select: "email name",
        },
      },
      {
        path: "taskInProgress",
        model: "Task",
        populate: {
          path: "assignedBy",
          model: "User",
          select: "email name",
        },
      },
      {
        path: "taskCompleted",
        model: "Task",
        populate: {
          path: "assignedBy",
          model: "User",
          select: "email name",
        },
      },
    ]);

    user.password = undefined;
    user.joiningId = undefined;
    user._id = undefined;
    user.organization = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;

    res.json({
      status: true,
      user,
    });
  } catch (e) {
    res.send({
      status: false,
      message: "Error in Fetching user",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { name: { $exists: true } },
      { isDeleted: 0, password: 0 }
    )
      .populate("taskAssigned")
      .populate("taskInProgress")
      .populate("taskCompleted");

    res.status(200).json({
      status: true,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({
      status: true,
      message: "user deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

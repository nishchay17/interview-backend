const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  me,
  login,
  signup,
  deleteUser,
  getAllUsers,
  updatePassword,
} = require("../controllers/userController");
const { withAuth, withAdmin } = require("../middlewares/auth");

/**
 * @method  POST
 * @route  api/user/signup
 * @description  user sign-up
 */
router.post(
  "/signup",
  [
    check("name", "Please Enter a Valid name"),
    check("email", "Please enter a valid email"),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  signup
);

/**
 * @method  POST
 * @route  api/user/login
 * @description  user log-in
 */
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  login
);

/**
 * @method  GET
 * @description  Get LoggedIn User
 * @route  api/user/me
 * @protected
 */
router.get("/me", withAuth, me);

/**
 * @method  PUT
 * @description  update password
 * @route  api/user/update-password
 * @protected
 */
router.put(
  "/update-password",
  [
    check("oldPassword", "Please enter old password"),
    check("password", "Please enter password").isLength({
      min: 6,
    }),
  ],
  withAuth,
  updatePassword
);

/**
 * @method  GET
 * @description  make admin to given employeeId user
 * @route  api/user/all
 * @protected
 * @admin
 */
router.get("/all", withAuth, withAdmin, getAllUsers);

/**
 * @method  DELETE
 * @description  delete user
 * @route  api/user/delete/:id
 * @protected
 * @admin
 */
router.delete("/delete/:id", withAuth, withAdmin, deleteUser);

module.exports = router;

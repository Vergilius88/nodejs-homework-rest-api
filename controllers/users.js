const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constans");
require("dotenv").config();
const fs = require('fs').promises;
const path = require('path');
const createFolderIsExist = require('../helpers/create-dir');
const SECRET_KEY = process.env.JWT_SECRET;

const reg = async (req, res, next) => {

  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);

    if (user) {

      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        data: "Conflict",
        message: "Email already use",
      });
    }
    const newUser = await Users.create(req.body);

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {

  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {

      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        data: "UNAUTHORIZED",
        message: "Email or password is wrong",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);

  return res.status(HttpCode.NO_CONTENT).json({});
};

const currentUser = async (req, res, next) => {

  try {

    if (!req.user) {

      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        data: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }
    const id = req.user.id;
    const currentUser = await Users.findById(id);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        email: currentUser.email,
        subscription: currentUser.subscription,
      },
    });
  } catch (err) {
    next(err)
  }
};

const updateUser = async (req, res, next)=>{

  try {
    const id = req.user.id;
    const avatarUrl = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, avatarUrl);

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        ...req.body,
        avatarUrl,
      }
    })
  } catch (err) {
    next(err);
  }
};

const saveAvatarToStatic = async (req) => {
  const id = req.user.id;
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const avatarName = req.file.originalname;
  const folderForUserAvatar = id;
  await createFolderIsExist(path.join(AVATARS_OF_USERS, folderForUserAvatar));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, folderForUserAvatar, avatarName));
  const avatarURL = path.normalize(path.join(id, avatarName));

  try {
    await fs.unlink(path.join(process.cwd(),AVATARS_OF_USERS,req.user.avatar))
  } catch (err) {
    console.log(err.message);
  }

  return avatarURL;
}

module.exports = { reg, login, logout, currentUser, updateUser };
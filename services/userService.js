const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");
const ApiError = require("../utils/errors");
const TokenService = require("./tokenServices");

class UserService {
  async registration(email, name, password, role) {
    const uniqueEmail = await UserModel.findOne({ email });
    const uniqueName = await UserModel.findOne({ name });
    if (uniqueEmail) {
      throw new ApiError(400, "A user with such email already exists.");
    }

    if (uniqueName) {
      throw new ApiError(400, "A user with such name already exists.");
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await UserModel.create({
      email,
      name,
      role,
      password: hashPassword,
    });
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const tokens = TokenService.generateTokens(payload);
    await TokenService.saveToken(user._id, tokens.refreshToken);

    return { user, ...tokens };
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(400, "A user with such email not found.");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw new ApiError(400, "Невірний пароль.");
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const tokens = TokenService.generateTokens({ ...payload });
    await TokenService.saveToken(user._id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Користувач не авторизований.");
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw new ApiError(401, "Користувач не авторизований.");
    }

    const user = await UserModel.findById(userData.id);

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const tokens = TokenService.generateTokens({ ...payload });
    await TokenService.saveToken(user._id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async getUser(id) {
    const user = await UserModel.findById(id);
    return user;
  }
}

module.exports = new UserService();

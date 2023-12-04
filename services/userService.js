const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");
const ApiError = require("../utils/errors");

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
      token: `${Date.now().toString(32)}_${Math.random().toString(32)}`,
    });

    return { user };
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(400, "A user with such email not found.");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw new ApiError(400, "Invalid password.");
    }

    user.token = `${Date.now().toString(32)}_${Math.random().toString(32)}`;

    await user.save();

    return user;
  }

  async logout(token) {
    const user = await UserModel.findOne({ token });
    
    user.token = null;

    await user.save();

    console.log("user", user);
    return user;
  }

  async getUser(token) {
    const user = await UserModel.findById(token);
    return user;
  }
}

module.exports = new UserService();

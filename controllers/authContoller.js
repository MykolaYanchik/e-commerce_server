const UserService = require("../services/userService");

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, name, password, role } = req.body;
      const user = await UserService.registration(email, name, password, role);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserService.login(email, password);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { token } = req.body;
      
      const user = await UserService.logout(token);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res) {
    const id = req.params.id;
    const user = await UserService.getUser(id);
    return res.json(user);
  }
}

module.exports = new AuthController();

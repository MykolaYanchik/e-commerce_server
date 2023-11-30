const Router = require("express");
const controller = require("../controllers/authContoller");
const authMiddleware = require("../middlewares/auth")

const router = new Router();

router.post("/user/registration", controller.registration);
router.post("/user/login", controller.login);
router.post("/user/logout", controller.logout);
router.get("/user/refresh", controller.refresh);
router.get("/user/:id", authMiddleware, controller.getUser)

module.exports = router;

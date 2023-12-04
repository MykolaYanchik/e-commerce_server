const Router = require("express");
const controller = require("../controllers/authContoller");

const router = new Router();

router.post("/user/registration", controller.registration);
router.post("/user/login", controller.login);
router.post("/user/logout", controller.logout);
router.get("/user/:id", controller.getUser);

module.exports = router;

const { Router } = require("express");

const router = Router();
const RespostasController = require("../controllers/RespostasController");
const authAll = require("../middlewares/authAllJWT");

router.use(authAll);
router.post("/create", RespostasController.create);
router.get("/", RespostasController.list);

module.exports = router;

const { Router } = require("express");

const router = Router();
const OpcoesController = require("../controllers/OpcoesController");
const authAdmin = require("../middlewares/authAdminJWT");
const authUser = require("../middlewares/authUserJWT");
router.post("/signup", authUser, OpcoesController.create);
router.get("/", authUser, OpcoesController.listAll);
router.use(authAdmin);
router.get("/:id", OpcoesController.listOne);
router.put("/:id", OpcoesController.update);
router.delete("/:id", OpcoesController.delete);

module.exports = router;

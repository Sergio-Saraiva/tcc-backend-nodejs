const { Router } = require("express");

const router = Router();
const authAdmin = require("../middlewares/authAdminJWT");
const authUser = require("../middlewares/authUserJWT");
const PerguntasController = require("../controllers/PerguntasController");
router.post("/signup", authUser, PerguntasController.create);
router.get("/", authUser, PerguntasController.listAll);
router.use(authAdmin);
router.get("/:id", PerguntasController.listOne);
router.put("/:id", PerguntasController.update);
router.delete("/:id", PerguntasController.delete);

module.exports = router;

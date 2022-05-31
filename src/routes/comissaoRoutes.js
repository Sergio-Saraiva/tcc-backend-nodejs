const { Router } = require('express');

const router = Router();
const comissaoAutoavaliadoraController = require('../controllers/ComissaoAutoavaliadoraController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', comissaoAutoavaliadoraController.create);
router.get('/', comissaoAutoavaliadoraController.listAll);
router.get('/:id', comissaoAutoavaliadoraController.listOne);
router.put('/:id', comissaoAutoavaliadoraController.update);
router.delete('/:id', comissaoAutoavaliadoraController.delete);

module.exports = router;

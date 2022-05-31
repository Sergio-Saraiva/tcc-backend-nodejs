const { Router } = require('express');

const router = Router();
const orientacoesController = require('../controllers/OrientacoesController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', orientacoesController.create);
router.get('/', orientacoesController.listAll);
router.get('/:id', orientacoesController.listOne);
router.put('/:id', orientacoesController.update);
router.delete('/:id', orientacoesController.delete);

module.exports = router;

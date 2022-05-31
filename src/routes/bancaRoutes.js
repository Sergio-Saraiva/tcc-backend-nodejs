const { Router } = require('express');

const router = Router();
const bancasController = require('../controllers/BancasController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', bancasController.create);
router.get('/', bancasController.listAll);
router.get('/:id', bancasController.listOne);
router.put('/:id', bancasController.update);
router.delete('/:id', bancasController.delete);

module.exports = router;

const { Router } = require('express');

const router = Router();
const secretariaController = require('../controllers/SecretariasController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', secretariaController.create);
router.get('/', secretariaController.listAll);
router.get('/:id', secretariaController.listOne);
router.put('/:id', secretariaController.update);
router.delete('/:id', secretariaController.delete);
module.exports = router;

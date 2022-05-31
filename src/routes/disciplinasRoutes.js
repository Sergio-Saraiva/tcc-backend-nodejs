const { Router } = require('express');

const router = Router();
const disciplinasController = require('../controllers/DisciplinasController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', disciplinasController.create);
router.get('/', disciplinasController.listAll);
router.get('/:id', disciplinasController.listOne);
router.put('/:id', disciplinasController.update);
router.delete('/:id', disciplinasController.delete);

module.exports = router;

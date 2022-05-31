const { Router } = require('express');

const router = Router();
const DisciplinaHasDocentesController = require('../controllers/DisciplinaHasDocentesController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', DisciplinaHasDocentesController.signup);
router.get('/', DisciplinaHasDocentesController.listAll);
router.get('/:id', DisciplinaHasDocentesController.listOne);
router.put('/:id', DisciplinaHasDocentesController.update);
router.delete('/:id', DisciplinaHasDocentesController.delete);
module.exports = router;

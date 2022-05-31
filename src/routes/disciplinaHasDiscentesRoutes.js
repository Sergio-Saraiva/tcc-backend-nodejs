const { Router } = require('express');

const router = Router();
const DisciplinaHasDiscentesController = require('../controllers/DisciplinaHasDiscentesController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', DisciplinaHasDiscentesController.signup);
router.get('/', DisciplinaHasDiscentesController.listAll);
router.get('/:id', DisciplinaHasDiscentesController.listOne);
router.put('/:id', DisciplinaHasDiscentesController.update);
router.delete('/:id', DisciplinaHasDiscentesController.delete);
module.exports = router;

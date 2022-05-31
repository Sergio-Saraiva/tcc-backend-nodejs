const { Router } = require('express');
const authAll = require('../middlewares/authAllJWT');
const auth = require('../middlewares/authAdminJWT');
const docentesController = require('../controllers/DocentesController');

const router = Router();

router.post('/signup', docentesController.signUp);
router.get('/:id', authAll, docentesController.listOne);
router.put('/:id', authAll, docentesController.update);
router.delete('/:id', authAll, docentesController.delete);
router.get('/', auth, docentesController.listAll);

module.exports = router;

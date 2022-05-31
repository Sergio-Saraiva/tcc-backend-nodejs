const { Router } = require('express');
const auth = require('../middlewares/authAdminJWT');
const authAll = require('../middlewares/authAllJWT');
const discentesController = require('../controllers/DiscentesController');

const router = Router();

router.post('/signup', discentesController.signUp);
router.get('/:id', authAll, discentesController.listOne);
router.put('/:id', authAll, discentesController.update);
router.delete('/:id', authAll, discentesController.delete);
router.get('/', auth, discentesController.listAll);

module.exports = router;

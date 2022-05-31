const { Router } = require('express');
const auth = require('../middlewares/authAdminJWT');
const authUser = require('../middlewares/authAllJWT');

const router = Router();
const taesController = require('../controllers/TaesController');

router.post('/signup', taesController.signUp);
router.get('/', authUser, taesController.listAll);
router.get('/:id', authUser, taesController.listOne);
router.put('/:id', authUser, taesController.update);
router.use(auth);
router.get('/', taesController.listAll);
router.get('/:id', taesController.listOne);
router.put('/:id', taesController.update);
router.delete('/:id', taesController.delete);
module.exports = router;

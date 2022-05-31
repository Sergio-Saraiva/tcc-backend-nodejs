const { Router } = require('express');
const TemasController = require('../controllers/TemasController');
const auth = require('../middlewares/authAdminJWT');
const authAll = require('../middlewares/authAllJWT');
const router = Router();

router.get('/', authAll, TemasController.listAll);
router.get('/:id', authAll, TemasController.listOne);
router.post('/signup', auth, TemasController.create);
router.put('/:id', auth, TemasController.update);
router.delete('/:id', auth, TemasController.delete);

module.exports = router;

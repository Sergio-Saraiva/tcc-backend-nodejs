const { Router } = require('express');

const router = Router();
const AdminController = require('../controllers/AdminController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', AdminController.signUp);
router.get('/', AdminController.listAll);
router.get('/:id', AdminController.listOne);
router.put('/:id', AdminController.update);
router.delete('/:id', AdminController.delete);
module.exports = router;

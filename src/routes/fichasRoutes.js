const { Router } = require('express');

const router = Router();
const FichasController = require('../controllers/FichasController');
const auth = require('../middlewares/authAdminJWT');
router.get('/', FichasController.listAll);
router.get('/:id', FichasController.listOne);
router.use(auth);
router.post('/signup', FichasController.create);
router.put('/:id', FichasController.update);
router.delete('/:id', FichasController.delete);

module.exports = router;

const { Router } = require('express');

const router = Router();
const DocentesHasComissaoAutoavaliadorasController = require('../controllers/DocentesHasComissaoAutoavaliadorasController');
const auth = require('../middlewares/authAdminJWT');
router.use(auth);
router.post('/signup', DocentesHasComissaoAutoavaliadorasController.signup);
router.get('/', DocentesHasComissaoAutoavaliadorasController.listAll);
router.get('/:id', DocentesHasComissaoAutoavaliadorasController.listOne);
router.put('/:id', DocentesHasComissaoAutoavaliadorasController.update);
router.delete('/:id', DocentesHasComissaoAutoavaliadorasController.delete);
module.exports = router;

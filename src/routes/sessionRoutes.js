const { Router } = require('express');

const router = Router();
const SessionController = require('../controllers/SessionController');

router.post('/login', SessionController.login);

module.exports = router;

const Router = require("express").Router;
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const router = new Router();


router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh);

router.get('/users', authMiddleware, adminMiddleware, UserController.getUsers);

router.post('/register', UserController.registration);
router.put('/subscribe', authMiddleware, adminMiddleware, UserController.changeUserSubscribe);
router.put('/brokers', authMiddleware, adminMiddleware, UserController.changeUserBrokers);
router.post('/destroy', authMiddleware, adminMiddleware, UserController.destroy);


module.exports = router;
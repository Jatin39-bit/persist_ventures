const router = require('express').Router();
const userController = require('../controllers/user.controller.js');
const { body} = require('express-validator');
const { authenticate } = require('../middleware/middleware.js');

router.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 8 characters long')
],userController.signup);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
],userController.login);

router.get('/profile',authenticate, userController.getProfile);
router.put('/profile',authenticate, userController.updateProfile);

router.get('/liked',authenticate, userController.getLiked);



module.exports = router;


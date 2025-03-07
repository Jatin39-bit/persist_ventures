const router = require('express').Router();
const { body} = require('express-validator');
const { authenticate } = require('../middleware/middleware.js');
const memeController = require('../controllers/meme.controller.js');

router.get('/feed', memeController.getFeed);
router.get('/leaderboard', memeController.getLeaderboard);

router.get('/search', memeController.searchMemes);

router.post('/upload', authenticate, memeController.uploadMeme);

router.get('/uploaded', authenticate, memeController.getUploadedMemes);
router.get('/:id', memeController.getMemeById);

router.post('/:id/comment', authenticate, [
    body('text').trim().isLength({min: 1, max: 200}).withMessage("Comment length should be between 1 and 200 characters")
], memeController.postComment);


router.post('/:id/like', authenticate, memeController.likeMeme);

router.get('/:id/like-status', authenticate, memeController.getLikeStatus);

router.post('/:id/unlike', authenticate, memeController.unlikeMeme);

router.get('leaderboard', memeController.getLeaderboard);

router.get('/search', memeController.searchMemes);

router.post('/upload', authenticate, memeController.uploadMeme);

router.get('/uploaded', authenticate, memeController.getUploadedMemes);



module.exports = router;


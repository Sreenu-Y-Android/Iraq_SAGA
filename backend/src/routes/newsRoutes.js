const express = require('express');
const router  = express.Router();
const { getArticles, getStats } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       protect, getArticles);
router.get('/stats',  protect, getStats);

module.exports = router;

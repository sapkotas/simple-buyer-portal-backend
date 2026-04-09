const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllProperties, getFavourites, addFavourite, removeFavourite } = require('../controllers/favouriteController');

router.get('/properties', getAllProperties);           // Public
router.get('/favourites', authMiddleware, getFavourites);
router.post('/favourites', authMiddleware, addFavourite);
router.delete('/favourites', authMiddleware, removeFavourite);

module.exports = router;
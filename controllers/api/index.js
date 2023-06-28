const router = require('express').Router();
const userRoutes = require('./userRoutes');
const blogpostRoutes = require('./blogpostRoutes');
const seedDbRoute = require('./seedDB');

router.use('/users', userRoutes);
router.use('/blogposts', blogpostRoutes);
router.use('/seedDb', seedDbRoute);

module.exports = router;
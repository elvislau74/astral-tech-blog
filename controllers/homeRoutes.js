const router = require('express').Router();
const { Blogpost, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    // res.json('check if works');
    try {
        const blogpostData = await Blogpost.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['message']
                },
            ],
        });

        const blogposts = blogpostData.map((blogpost) => blogpost.get({ plain: true }));

        res.render('homepage', {
            blogposts,
            logged_in: req.session.logged_in,
            username: req.session.username
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/blogpost/:id', async (req, res) => {
    try {
      const blogpostData = await Blogpost.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });
  
      const blogpost = blogpostData.get({ plain: true });
  
      res.render('blogpost', {
        ...blogpost,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Use withAuth middleware to prevent access to route
  router.get('/profile', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Blogpost }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true,
        username: req.session.username,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;
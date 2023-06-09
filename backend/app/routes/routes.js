const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const userController = require('../controller/user.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify', authController.verify);

router.post('/search_movies', userController.search_movies);
router.post('/search_books', userController.search_books);

router.get('/get_movies', userController.get_movies);
router.get('/get_books', userController.get_books);

router.post('/create_group', userController.create_group);
router.get('/get_groups', userController.get_groups);

router.post('/get_followers', userController.get_followers);
router.post('/get_following', userController.get_followers);
router.post('/get_joined_groups', userController.get_joined_groups);

module.exports = router;
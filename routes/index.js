const router = require('express').Router();
const UrlController = require('../controllers/UrlController');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');

//auth
router.post(
  '/auth/signup',
  ValidationMiddleware.validateSignupUser,
  AuthController.signup
);
router.get(
  '/auth/signup/:id/verify/:token',
  AuthController.verifyUserAccountLink
);
router.post(
  '/auth/login',
  ValidationMiddleware.validateLoginUser,
  AuthController.login
);
router.post(
  '/auth/password-reset',
  ValidationMiddleware.validateEmail,
  AuthController.verifyEmail
);
router.get(
  '/auth/password-reset/:id/:token',
  AuthController.verifyPasswordResetLink
);
router.post(
  '/auth/password-reset/:id/:token',
  ValidationMiddleware.validatePassword,
  AuthController.passwordReset
);

//url
router.post(
  '/url/quick_create',
  ValidationMiddleware.validateUrl,
  UrlController.quickCreate
);
router.post(
  '/url/create',
  AuthMiddleware.isAuthenticated,
  ValidationMiddleware.validateUrl,
  UrlController.createShortUrl
);
router.get(
  '/url/dashboard',
  AuthMiddleware.isAuthenticated,
  UrlController.getDashboard
);
router.get('/url/search', AuthMiddleware.isAuthenticated, UrlController.getUrl);
router.delete(
  '/url/delete/:urlId',
  AuthMiddleware.isAuthenticated,
  UrlController.deleteUrl
);
router.put('/url/redirect/:shortUrl', UrlController.redirectToUrl);
router.get('/url/count', UrlController.getUrlCreatedDate);

module.exports = router;

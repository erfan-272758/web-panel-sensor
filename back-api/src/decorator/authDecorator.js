import authController from "../controllers/authController.js";

export function protect(req, res, next) {
  return authController.loginWithToken(req, null, next);
}

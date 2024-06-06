import { Router } from "express"
import { 
    getCurrentUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    } from "../controllers/user.controller.js"
    
import { RegisterValidator, LoginValidator } from "../utils/validationSchema.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()


// public routes 
router.route('/register').post(
    RegisterValidator,
    registerUser)

router.route('/login').post(
    LoginValidator,
    loginUser)


// private routes
router.route("/refresh-token").post(refreshAccessToken)
router.route('/logout').post(verifyJWT, logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)


export default router
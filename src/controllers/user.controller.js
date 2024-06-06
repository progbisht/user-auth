import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/User.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"


// @desc - method to generate refresh token and access tokens
const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)
    
        // generate tokens and save refresh token into the database

        const accessToken = user.generateAccessToken()
    
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        
        await user.save({ validateBeforeSave : false })

        return { accessToken, refreshToken }

    }
    catch(err){
        throw new ApiError(500, "Something went wrong while generating access or refresh token.")
    }
}


// @desc - method to handle user's registration requests
// @route - POST /register
// @access - public
const registerUser = asyncHandler( async(req, res) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        // return res.status(422).json({ errors: errors.array() });
        throw new ApiError(422, errors.array())
    }

    const { fullName, email, password } = req.body

    // check for already existing user with the provided credentials

    const existedUser = await User.findOne({ email })

    if(existedUser){
        throw new ApiError(409, "User with or email already exists")
    }
    
    // create a new user and save in the database
    const user = await User.create({
        fullName,
        email,
        password
    })


    // optional (If we wish to save database calls then we can prevent this step)
    const createdUser = await User.findById( user._id ).select("-password -refreshToken")


    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registerung a user.")
    }


    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully.")
    )

})


// @desc - method to handle user authentication (login) requests
// @route - POST /login
// @access - public
const loginUser = asyncHandler( async(req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        // return res.status(422).json({ errors: errors.array() });
        throw new ApiError(422, errors.array())

    }

    const { email, password } = req.body

    // check for existing user and verify the existing user's password
    
    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(401, "Invalid user credentials or User may not exist.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials or User may not exist.")
    }

    // generate the tokens and send them in a cookie (or as a resposnse for flutter devs)

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .cookie(
        "accessToken", 
        accessToken,
        options
    )
    .cookie(
        "refreshToken",
        refreshToken,
        options
    )
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken,
            },
            "User logged in successfully"
        )
    )


})


// @desc - method to handle logout request
// @route - POST /logout
// @access - private
const logoutUser = asyncHandler( async(req, res) => {
    
    // delete the refresh token on logout (end the session)
    await User.findByIdAndUpdate(
        req.body._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully.")
    )
})


// @desc - method to refresh the tokens
// @route - POST /refresh-token
// access - private
const refreshAccessToken = asyncHandler( async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {

        // decode the token and verify that the token belongs to a valid user
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        // regenetate the tokens and set them in cookie or send them as a response
        const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken
                },
                "Access token refreshed."
            )
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Invalid refresh token")
    }

})



// @desc - method to get current user
// @route - GET /current-user
// @access - private
const getCurrentUser = asyncHandler( async(req, res) => {

    const { _id } = req.user

    const user = await User.findOne({ _id }).select('-password -refreshToken')

    if(!user){
        throw new ApiError(404, "User not found. Please try again later.")
    }

    res.status(200)
    .json(
        new ApiResponse(200, user, "Current user fetched successfully.")
    )
})



export { 
    registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken,
    getCurrentUser,
    
}
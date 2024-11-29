import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import generateToken from '../utils/generateTokens.js'
import cloudinary from '../utils/cloudinary.js'

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) =>
{
    const { email , password } = req.body
    
    const user = await User.findOne({ email})

    if(user && await user.matchPassword(password))
    {
        generateToken(res, user._id , 'userJWT')
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            profileImage : user.profileImage
        })
    }
    else
    {
        res.status(400)
        throw new Error('Invalid Email or Password')
    }
})

// @desc Register a new user
// route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) =>
{
    const { name , email , password } = req.body
    const userExists = await User.findOne({email})

    if(userExists)
    {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create
    ({
        name,
        email,
        password
    })

    if(user)
    {
        generateToken(res , user._id , "userJWT")
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            profileImage : user.profileImage
        })
    }
    else
    {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc Logout user
// route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) =>
{
    // res.cookie('userJWT','',{
    //     httpOnly : true,
    //     expires : new Date(0)
    // })
    res.clearCookie('userJWT', { httpOnly: true })
    res.status(200).json({message : 'User Logged Out'})
})

// @desc Get User Profile
// route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) =>
{
    const { _id , name , email , profileImage } = req.user

    const user = 
    {
        _id,
        name,
        email,
        profileImage
    }

    res.status(200).json({user})
})

// @desc Update User Profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) =>
{
    const user = await User.findById(req.user._id)

    const { name , email , password , imageUrl , publicId  } = req.body
    if(user)
    {
        user.name = name || user.name
        user.email = email || user.email

        if(password)
        {
            user.password = password
        }

        if(imageUrl)
        {
            if (publicId && publicId.trim() !== '') {
                try {
                  
                  const folderPath = 'profilePictures';
                  const fullPath = `${folderPath}/${publicId}`;
                  const result = await cloudinary.uploader.destroy(fullPath);
                  console.log('Deleted previous image:', result);
                } catch (error) {
                  console.error('Error deleting image:', error);
                  throw new Error('Error deleting previous profile image');
                }
              }
        

            user.profileImage = imageUrl
        }

        

        const updatedUser = await user.save()

        res.status(200).json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            profileImage : updatedUser.profileImage
        })
    }
    else
    {
        res.status(404)
        throw new Error('User not Found')
    }
})

export 
{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}
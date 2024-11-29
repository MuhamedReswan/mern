import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from '../utils/generateTokens.js'
import cloudinary from '../utils/cloudinary.js'

const authAdmin = asyncHandler(async (req, res) =>
{
    const { email , password } = req.body

    const admin = await User.findOne({email})

    if(admin && admin.isAdmin && (await admin.matchPassword(password)))
    {
        generateToken(res , admin._id , "adminJWT")
        res.status(201).json({
            _id : admin._id,
            name : admin.name,
            email : admin.email,
            profileImage : admin.profileImage
        })
    }
    else
    {
        res.status(400)
        throw new Error('Invalid Email or Password')
    }
})

const logoutAdmin = asyncHandler(async (req, res) =>
{
    res.cookie('adminJWT','',{
        httpOnly : true,
        expires : new Date(0)
    })
    res.status(200).json({message : 'Admin Logged Out'})
})

const getUsers = asyncHandler(async (req, res) => 
{
    const usersData = await User.find({ isAdmin: { $ne: true } });
    console.log("usersData on admin controller",usersData)
  
    res.status(200).json(usersData);
});

const addNewUser = asyncHandler(async (req, res) =>
    {
        console.log("in add new user admin contorller");
        const { name , email , password , imageUrl } = req.body
        const userExists = await User.findOne({email})
        console.log(req.body);
    
        if(userExists)
        {
            res.status(400);
            throw new Error('User already exists');
        }
    
        const user = await User.create
        ({
            name,
            email,
            password,
            profileImage : imageUrl
        })
    
        if(user)
        {
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

            const editUser = asyncHandler(async (req, res) =>
            {
                console.log("in edit use in admin controller")

                const {_id, name , email , password , imageUrl , publicId  } = req.body
                const user = await User.findById(_id)
                console.log(req.body);
            
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
            const deleteUser = asyncHandler(async (req, res) =>
                {
                const { userId } = req.body;
                const deletUser = await User.findOne({ _id: userId });
                await User.deleteOne({ _id: userId });
                res.cookie("userJWT", "", {
                  httpOnly: true,
                  expires: new Date(0),
                });
                res.status(200).json(deletUser);
              });     

export 
{
    authAdmin,
    logoutAdmin,
    getUsers,
    addNewUser,
    editUser,
    deleteUser,
}
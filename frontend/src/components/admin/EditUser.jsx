import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../../components/user/FormContainer';
import { useUpdateUserDetailsMutation } from '../../slices/admin/adminApiSlice.js';
import { toast } from 'react-toastify';
import Loader from '../../components/user/Loader.jsx';

const EditUser = ({userData , onClose}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();

  const defaultAvatar = '../../../placeeHolderProfile.jpg'

  useEffect(() =>
  {
    setName(userData.name);
    setEmail(userData.email);
    setProfileImage(userData.profileImage || '');
    setImagePreview(userData.profileImage || defaultAvatar); // Set default avatar path
  }, []);

  const handleImageChange = (e) =>
  {
    const file = e.target.files[0];
    if (file)
    {
      setImagePreview(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const uploadImage = async (file) =>
    {
      const formData = new FormData();
  
      formData.append('file', file);
      formData.append('upload_preset', 'ums-profile');
      formData.append('cloud_name', 'duxddwvek')
      formData.append('folder', 'ums-profile');
  
      try
      {
        const response = await fetch("https://api.cloudinary.com/v1_1/duxddwvek/image/upload", {
          method: 'POST',
          body: formData,
        });
    
        const data = await response.json();
        return data.secure_url
      }
      catch (error)
      {
        toast.error('Image upload failed');
        return null;
      }
    };


  const submitHandler = async (e) =>
  {
    e.preventDefault();

    if (password !== confirmPassword)
    {
      toast.error('Passwords do not match');
    }
    else
    {
      try
      {
        let imageUrl = userData.profileImage;
        let publicId = ''
        const cloudinaryUrlPattern = /\/profilePictures\/([^\/]+)\.jpg/;

        const match = cloudinaryUrlPattern.exec(userData.profileImage);

        if (match)
        {
          publicId = match[1];
        }

        if (profileImage)
        {
          imageUrl = await uploadImage(profileImage);
          console.log("this is the image url " , imageUrl);
        }

        const res = await updateUserDetails({
          _id : userData._id,
          name , 
          email , 
          password,
          imageUrl,
          publicId
        }).unwrap();
        toast.success('Profile Updated');
        onClose()
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="position-relative">
      {isLoading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <FormContainer>
        {/* <h1 className="text-white text-center">Update Profile</h1> */}
        <div className="text-center mb-3">
          <input
            type="file"
            id="profileImageInput"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <label htmlFor="profileImageInput">
            <img
              src={imagePreview || defaultAvatar}
              alt="Profile Preview"
              className="rounded-circle"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          </label>
          <div className="text-white mt-2" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('profileImageInput').click()}>
            Change Profile Picture
          </div>
        </div>
        <Form onSubmit={submitHandler} className="bg-dark text-white rounded">
          <Form.Group className="my-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Update
          </Button>
          <Button className='mt-3' variant="secondary" onClick={onClose}>Close</Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default EditUser;

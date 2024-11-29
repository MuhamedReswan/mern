import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../user/FormContainer.jsx'
import { toast } from 'react-toastify';
import { useAddNewUserMutation } from '../../slices/admin/adminApiSlice.js';
import Loader from '../user/Loader.jsx';

const AddUser = ({isOPen , onClose}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [addNewUser,{isLoading}] = useAddNewUserMutation();

  const defaultAvatar = '../../../placeeHolderProfile.jpg'

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

    if (
      !email.trim() ||
      !name.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill all fields.");
    } else if (!email.endsWith("@gmail.com")) {
      toast.error("Email should end with @gmail.com.");
    } else if (name.trim().length < 3) {
      toast.error("Name should be at least 3 characters.");
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name should only contain letters and spaces.");
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)
    ) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character."
      );
    } else if (password !== confirmPassword) {
      toast.error("Confirm Passwords do not match.");
    } 
    else
    {
      try
      {
        let imageUrl
        if (profileImage)
        {
          imageUrl = await uploadImage(profileImage);
          console.log("this is the image url ", imageUrl)
        }

        const res = await addNewUser({
          name , 
          email , 
          password,
          imageUrl,
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
            Add User
          </Button>
          <Button className='mt-3' variant="secondary" onClick={onClose}>Close</Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default AddUser;

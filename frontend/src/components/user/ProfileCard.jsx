import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ProfileCard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const defaultAvatar = '../../../public/placeeHolderProfile.jpg';
  

  const handleEditProfile = () => {
    navigate('/edit-profile'); // Navigate to the ProfileScreen component
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Card className="text-center" style={{ width: '650px'}}>
        <Card.Body>
          <div className="text-center mb-3">
            <img
              src={userInfo.profileImage || defaultAvatar}
              alt="Profile Preview"
              className="rounded-circle"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
              }}
            />
          </div>
          <Card.Title><h1><span className='card-datas'>{userInfo.name}</span></h1></Card.Title>
          <Card.Text><h6><span className='card-datas'>{userInfo.email}</span></h6></Card.Text>
          <Button variant="primary" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileCard;

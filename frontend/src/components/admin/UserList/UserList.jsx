import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Loader from '../../user/Loader';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

import { useGetUsersMutation , useDeleteUserMutation } from '../../../slices/admin/adminApiSlice';
import './UserList.css';

import AddUser from '../AddUser';
import EditUser from '../EditUser';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userCount, setUserCount] = useState(users?.length || 0);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser , setShowEditUser] = useState(false)
  const [selectedEditUser , setSelectedEditUser] = useState(null)

  const [getUsers, { isLoading }] = useGetUsersMutation();
  const [deleteUser, { isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    async function fetchData() {
      try {
        const usersData = await getUsers();
        console.log("usersData.data",usersData.data)
        setUsers(usersData.data);
      } catch (error) {
        // Handle error
      }
    }
    fetchData();
  }, [userCount , showAddUser,selectedEditUser,showEditUser,setUsers]);

  useEffect(() => {
    let searchedUsers = filterUser(search, users);
    setFilteredUsers(searchedUsers);
  }, [search, users]);

  const filterUser = (text, usersList) => {
    if (text === '') {
      return usersList;
    } else {
      const filtered = usersList.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        user.email.toLowerCase().includes(text.toLowerCase())
      );
      return filtered;
    }
  };

  const handleAddUserClick = () => {
    setShowAddUser(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };

  function handleEditUserClick(user){
    setSelectedEditUser(user)
    setShowEditUser(true);
  }

  const handleCloseEditUser = () => {
    setShowEditUser(false);
  };

  const handleDeletuser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      iconColor: "#3F51B5",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3F51B5",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteUser({ userId: userId });
        
           if (res) {
            setUserCount((prev) => prev - 1);
            toast.success("User deleted successfully");
    
              const storedUser = JSON.parse(localStorage.getItem("userInfo"));
              if (storedUser && storedUser._id === userId) {
                localStorage.removeItem("userInfo");
              }
            
          }
        } catch (error) {
          toast.error(error?.data?.message || error.message);
        }
      }
    });
  };

  return (
    <div className="container mt-3 mb-4">
      <div className="row justify-content-center">
        <div className="col-lg-9 mt-4 mt-lg-0">
          {/* Search Bar and Add New User Button */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary ml-2"
                type="button"
                onClick={handleAddUserClick}
              >
                Add New User {users.length}
              </button>
            </div>
          </div>
          {showAddUser && <AddUser onClose={handleCloseAddUser} />}
          {showEditUser && <EditUser userData={selectedEditUser} onClose={handleCloseEditUser}/>}
          <div className="user-dashboard-info-box table-responsive mb-0 bg-dark p-4 shadow-sm">
            {isLoading || isDeleting ? (
              <div className="loader-container">
                <Loader />
              </div>
            ) : (
              <table className="table manage-candidates-top mb-0 table-dark">
                <thead>
                  <tr>
                    <th>User's Name</th>
                    <th className="action text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>{console.log("filteredUsers:",filteredUsers)}
                  {/* {filteredUsers.map((user, index) => (
                    <tr className="candidates-list" key={index}>
                      <td className="title">
                        <div className="thumb">
                          <img className="img-fluid" src={user.profileImage} alt="" />
                        </div>
                        <div className="candidate-list-details">
                          <div className="candidate-list-info">
                            <div className="candidate-list-title">
                              <h5 className="mb-0">{user.name}</h5>
                            </div>
                            <div className="candidate-list-option">
                              <ul className="list-unstyled">
                                <li><i className="fas fa-filter pr-1"></i>{user.email}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-info action-btn" title="Edit" onClick={() => handleEditUserClick(user)}><FaPencilAlt /></button>
                        <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDeletuser(user._id)}><FaTrashAlt /></button>
                      </td>
                    </tr>
                  ))} */}{filteredUsers && filteredUsers.length > 0 ? (
  filteredUsers.map((user, index) => (
    <tr className="candidates-list" key={index}>
      <td className="title">
        <div className="thumb">
          <img className="img-fluid" src={user.profileImage} alt="" />
        </div>
        <div className="candidate-list-details">
          <div className="candidate-list-info">
            <div className="candidate-list-title">
              <h5 className="mb-0">{user.name}</h5>
            </div>
            <div className="candidate-list-option">
              <ul className="list-unstyled">
                <li><i className="fas fa-filter pr-1"></i>{user.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </td>
      <td>
        <button className="btn btn-sm btn-info action-btn" title="Edit" onClick={() => handleEditUserClick(user)}><FaPencilAlt /></button>
        <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDeletuser(user._id)}><FaTrashAlt /></button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="2" className="text-center">
      <p>No users found.</p>
    </td>
  </tr>
)}


                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;

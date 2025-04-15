import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './UserList.css';
import UserForm from './UserForm';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/users`;

// Dummy data for users
const dummyUsers = [
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alice@example.com',
    country: 'France',
    city: 'Paris',
    phone_number: '0123456789',
    position: 'Engineer',
  },
  {
    id: 2,
    first_name: 'Bob',
    last_name: 'Brown',
    email: 'bob@example.com',
    country: 'Germany',
    city: 'Berlin',
    phone_number: '0987654321',
    position: 'Designer',
  },
  {
    id: 3,
    first_name: 'Carol',
    last_name: 'Jones',
    email: 'carol@example.com',
    country: 'Spain',
    city: 'Madrid',
    phone_number: '1122334455',
    position: 'Manager',
  },
];

// Simple confirmation modal component
const ConfirmationModal = ({
  show, message, onConfirm, onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-button cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button confirm-button"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    userId: null,
    message: '',
  });

  // Initialize with dummy data
  useEffect(() => {
    setUsers(dummyUsers);
    setLoading(false);
  }, []);

  const handleDelete = async (id) => {
    // Show the confirmation modal
    setConfirmModal({
      show: true,
      userId: id,
      message: 'Are you sure you want to delete this user?',
    });
  };

  const confirmDelete = async () => {
    try {
      // Make API call to delete the user
      await axios.delete(`${API_URL}/${confirmModal.userId}`);

      // Update local state after successful deletion
      const updatedUsers = users.filter((user) => user.id !== confirmModal.userId);
      setUsers(updatedUsers);

      // Hide the modal
      setConfirmModal({ show: false, userId: null, message: '' });
    } catch (error) {
      console.error('Error deleting user:', error);
      setConfirmModal({
        show: true,
        userId: confirmModal.userId,
        message: 'Failed to delete user. Please try again.',
      });
    }
  };

  const cancelDelete = () => {
    // Just hide the modal
    setConfirmModal({ show: false, userId: null, message: '' });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowAddForm(false);
  };

  const handleFormSuccess = async (userData) => {
    try {
      // If editing an existing user
      if (userData && userData.id) {
        // Make API call to update the user
        const response = await axios.put(`${API_URL}/${userData.id}`, userData);
        const updatedUser = response.data;

        // Update local state after successful update
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      } else if (userData) {
        // For adding new users (keeping this simple for now)
        const newId = Math.max(...users.map((user) => user.id), 0) + 1;
        setUsers([...users, { ...userData, id: newId }]);
      }
      setEditUser(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving user:', error);
      // You could add error handling UI here
    }
  };

  const handleAddNew = () => {
    setEditUser(null);
    setShowAddForm(true);
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User Management</h2>
        <button type="button" className="add-button" onClick={handleAddNew}>Add New User</button>
      </div>

      {/* {error && <div className="error-message">{error}</div>} */}

      {showAddForm && (
        <div className="form-section">
          <h3>Add New User</h3>
          <UserForm onSuccess={handleFormSuccess} />
        </div>
      )}

      {editUser && (
        <div className="form-section">
          <h3>Edit User</h3>
          <UserForm user={editUser} onSuccess={handleFormSuccess} />
        </div>
      )}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          {users.length === 0 ? (
            <div className="no-users">No users found. Add a new user.</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{`${user.first_name} ${user.last_name}`}</td>
                    <td>{user.email}</td>
                    <td>{`${user.city}, ${user.country}`}</td>
                    <td>{user.phone_number}</td>
                    <td className="actions">
                      <button type="button" className="edit-button" onClick={() => handleEdit(user)}>
                        Edit
                      </button>
                      <button type="button" className="delete-button" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <ConfirmationModal
        show={confirmModal.show}
        message={confirmModal.message}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default UserList;

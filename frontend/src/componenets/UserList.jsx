import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './UserList.css';
import UserForm from './UserForm';
import api from '../tools/api';

// API endpoint
const USERS_ENDPOINT = '/api/users';

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
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    userId: null,
    message: '',
  });

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(USERS_ENDPOINT);
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      // Use empty array if fetch fails
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from the backend API
  useEffect(() => {
    fetchUsers();
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
      await api.delete(`${USERS_ENDPOINT}/${confirmModal.userId}`);

      // Update local state after successful deletion
      const updatedUsers = users.filter((user) => user.id !== confirmModal.userId);
      setUsers(updatedUsers);

      // Hide the modal
      setConfirmModal({ show: false, userId: null, message: '' });
    } catch (err) {
      console.error('Error deleting user:', err);
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
        const response = await api.put(`${USERS_ENDPOINT}/${userData.id}`, userData);
        const updatedUser = response.data;

        // Update local state after successful update
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      } else {
        // For new users, fetch all users again to get the server-generated ID
        await fetchUsers();
      }

      // Reset form state
      setEditUser(null);
      setShowAddForm(false);

      // Make sure to refresh the list regardless of the operation
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
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

      {error && <div className="error-message">{error}</div>}

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
                {users.map((user) => {
                 return (
                  <tr key={user.id}>
                  <td>
                    <div className="user-name-cell">
                      {user.profile_picture ? (
                        <img
                          src={`http://localhost:3002/api/users/getUserPhoto${user.profile_picture}`}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {user.first_name && user.first_name.charAt(0)}
                          {user.last_name && user.last_name.charAt(0)}
                        </div>
                      )}
                      <span>{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                  </td>
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
                 )
            })}
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

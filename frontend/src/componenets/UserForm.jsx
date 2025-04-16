import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './UserForm.css';
import FileUpload from './FileUpload';
import api from '../tools/api';

// API endpoint
const USERS_ENDPOINT = '/api/users';

const UserForm = ({ user, onSuccess }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: user || {},
  });

  const handleFileChange = (file) => {
    setProfilePicture(file);
  };

  const onSubmit = async (data) => {
    try {
      // Reset any previous error
      setFormError('');

      // Create FormData for all submissions to handle files
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // If profile picture was uploaded, add it to FormData
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      let response;

      if (user && user.id) {
        // Update existing user
        response = await api.put(`${USERS_ENDPOINT}/${user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new user
        response = await api.post(USERS_ENDPOINT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const userData = response.data;
      if (onSuccess) onSuccess(userData);
    } catch (error) {
      console.error('Error saving user:', error.message || 'Unknown error');
      setFormError('Failed to save user. Please try again.');
    }
  };

  return (
    <div className="user-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        {formError && (
          <div className="form-error-message">
            {formError}
          </div>
        )}

        <FileUpload onFileChange={handleFileChange} />

        <div className="form-group">
          <label htmlFor="first_name">
            First Name
            <input
              id="first_name"
              type="text"
              {...register('first_name', { required: 'First name is required' })}
            />
          </label>
          {errors.first_name && <span className="error">{errors.first_name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="last_name">
            Last Name
            <input
              id="last_name"
              type="text"
              {...register('last_name', { required: 'Last name is required' })}
            />
          </label>
          {errors.last_name && <span className="error">{errors.last_name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </label>
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="country">
            Country
            <input
              id="country"
              type="text"
              {...register('country', { required: 'Country is required' })}
            />
          </label>
          {errors.country && <span className="error">{errors.country.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city">
            City
            <input
              id="city"
              type="text"
              {...register('city', { required: 'City is required' })}
            />
          </label>
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">
            Phone Number
            <input
              id="phone_number"
              type="text"
              {...register('phone_number', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Please enter a valid phone number (digits only)',
                },
              })}
            />
          </label>
          {errors.phone_number && <span className="error">{errors.phone_number.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="position">
            Position
            <input
              id="position"
              type="text"
              {...register('position')}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {user && user.id ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    phone_number: PropTypes.string,
    position: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
};

UserForm.defaultProps = {
  user: null,
  onSuccess: null,
};

export default UserForm;

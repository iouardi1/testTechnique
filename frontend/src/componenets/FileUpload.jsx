import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FileUpload.css';

const FileUpload = ({ onFileChange }) => {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (png, jpg, jpeg)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Max size is 5MB');
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onFileChange(file);
  };

  return (
    <div className="file-upload">
      <div className="upload-container">
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Profile preview" className="image-preview" />
            <label htmlFor="fileInput" className="change-image">
              Change Image
              <input
                type="file"
                id="fileInput"
                accept="image/png, image/jpeg, image/jpg"x
                onChange={handleFileChange}
                className="file-input"
              />
            </label>
          </div>
        ) : (
          <label htmlFor="fileInput" className="upload-label">
            <div className="upload-icon">+</div>
            <div className="upload-text">Upload Profile Picture</div>
            <div className="upload-hint">(Optional)</div>
            <input
              type="file"
              id="fileInput"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="file-input"
            />
          </label>
        )}
      </div>
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

FileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default FileUpload;

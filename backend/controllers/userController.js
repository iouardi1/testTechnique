const db = require('../sql/db');
const userService = require('../services/user');
const path = require('path');
const fs = require('fs');

// Get all users
const getUsers = async (req, res) => {
  try {
    
    // First test with a simple query
    try {
      console.log('Testing database connection with simple query...');
      const testResult = await db.query('SELECT 1 as test');
      console.log('Simple query succeeded:', testResult.rows);
    } catch (testError) {
      console.error('Simple query failed:', testError);
      return res.status(500).json({ 
        error: 'Database connection test failed', 
        details: testError.message 
      });
    }
    
    // If we get here, the simple query worked, so try the real query
    console.log('Fetching users...');
    const queryText = 'SELECT * FROM users ORDER BY id ASC';
    const { rows } = await db.query(queryText);
    console.log(`Success! Found ${rows.length} users in the database`);
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch users', 
      details: error.message 
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {

  const id = parseInt(req.params.id);
  try {
    const queryText = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(queryText, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const {
    email, password, first_name, last_name, country, city, phone_number, position,
  } = req.body;

  try {
    // Hash the password if it exists
    let hashedPassword = null;
    if (password) {
      hashedPassword = userService.hashPassword(email, password);
    }

    // Handle the uploaded profile picture
    const profile_picture = req.file ? `/assets/${req.file.filename}` : null;

    const queryText = `
      INSERT INTO users (email, password, first_name, last_name, country, city, phone_number, position, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [email, hashedPassword, first_name, last_name, country, city, phone_number, position, profile_picture];

    const { rows } = await db.query(queryText, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserPhoto = (req, res) => {
  // Extract the filename from the request parameters
  const filename = req.params.filename;
  console.log('filename', filename);
  const filePath = path.join(__dirname, '..', 'assets', filename);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    // Set proper headers and send the file
    res.sendFile(filePath);
  });
};


// Update user
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    email, password, first_name, last_name, country, city, phone_number, position,
  } = req.body;

  try {
    // First check if user exists
    const checkQuery = 'SELECT * FROM users WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Process the password if it was changed
    let hashedPassword = checkResult.rows[0].password;
    if (password) {
      hashedPassword = userService.hashPassword(email || checkResult.rows[0].email, password);
    }

    // Handle the uploaded profile picture
    const profile_picture = req.file ? `/assets/${req.file.filename}` : checkResult.rows[0].profile_picture;

    const queryText = `
      UPDATE users
      SET email = COALESCE($1, email),
          password = COALESCE($2, password),
          first_name = COALESCE($3, first_name),
          last_name = COALESCE($4, last_name),
          country = COALESCE($5, country),
          city = COALESCE($6, city),
          phone_number = COALESCE($7, phone_number),
          position = COALESCE($8, position),
          profile_picture = $9,
          updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      email,
      hashedPassword,
      first_name,
      last_name,
      country,
      city,
      phone_number,
      position,
      profile_picture,
      id,
    ];

    const { rows } = await db.query(queryText, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await db.query(queryText, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPhoto,
};

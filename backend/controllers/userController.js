const db = require('../sql/db');
const userService = require('../services/user');

// Get all users
const getUsers = async (req, res) => {
  try {
    console.log('getUsers');
    const queryText = 'SELECT * FROM users ORDER BY id ASC';
    const { rows } = await db.query(queryText);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const queryText = `
      INSERT INTO users (email, password, first_name, last_name, country, city, phone_number, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [email, hashedPassword, first_name, last_name, country, city, phone_number, position];

    const { rows } = await db.query(queryText, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
          updated_at = NOW()
      WHERE id = $9
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
};

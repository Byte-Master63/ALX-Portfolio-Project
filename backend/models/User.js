/**
 * @file models/User.js
 * @description In-memory User model with basic CRUD helpers.
 */

const users = [];

/**
 * Create and add a new user to the store.
 * @param {Object} user - User object {id, email, password}
 * @returns {Object} Created user
 */
function createUser(user) {
  users.push(user);
  return user;
}

/**
 * Find user by email.
 * @param {string} email - User email
 * @returns {Object|undefined} User object if found
 */
function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

/**
 * Find user by id.
 * @param {string} id - User id
 * @returns {Object|undefined} User object if found
 */
function findUserById(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};


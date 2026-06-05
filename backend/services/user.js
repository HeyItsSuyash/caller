const prisma = require('./db');

/**
 * Find user by email.
 */
async function findUserByEmail(email) {
  try {
    return await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  } catch (err) {
    console.error(`[UserService] findUserByEmail error:`, err.message);
    throw err;
  }
}

/**
 * Find user by ID.
 */
async function findUserById(id) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (err) {
    console.error(`[UserService] findUserById error:`, err.message);
    throw err;
  }
}

/**
 * Create a new user.
 */
async function createUser(userData) {
  try {
    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role || 'user',
      }
    });
    return user;
  } catch (err) {
    console.error(`[UserService] createUser error:`, err.message);
    throw err;
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};

const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { generateId, sanitizeInput } = require('../services/utils');
const { 
    findUserByEmail, 
    createUser 
} = require('../services/userStorage');
const { ConflictError, UnauthorizedError } = require('../middleware/errorHandler');

/**
 * Register a new user
 */
async function register(req, res) {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object
    const newUser = {
        id: generateId(),
        name: sanitizeInput(name),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    await createUser(newUser);
    
    // Generate token
    const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name
    });
    
    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: userWithoutPassword,
            token
        }
    });
}

/**
 * Login user
 */
async function login(req, res) {
    const { email, password } = req.body;
    
    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken({
        userId: user.id,
        email: user.email,
        name: user.name
    });
    
    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: userWithoutPassword,
            token
        }
    });
}

/**
 * Get current user profile
 */
async function getProfile(req, res) {
    // req.user is set by auth middleware
    const { findUserById } = require('../services/userStorage');
    const user = await findUserById(req.userId);
    
    if (!user) {
        throw new UnauthorizedError('User not found');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
        success: true,
        data: userWithoutPassword
    });
}

/**
 * Verify token (for frontend to check if token is still valid)
 */
async function verifyToken(req, res) {
    // If we reach here, token is valid (auth middleware passed)
    res.json({
        success: true,
        message: 'Token is valid',
        data: {
            userId: req.userId,
            email: req.user.email,
            name: req.user.name
        }
    });
}

module.exports = {
    register,
    login,
    getProfile,
    verifyToken
};

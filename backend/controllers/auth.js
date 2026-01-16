const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { generateId, sanitizeInput } = require('../services/utils');
const { 
    findUserByEmail, 
    findUserById,
    createUser,
    updateUser,
    deleteUser
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
 * Update user profile
 */
async function updateProfile(req, res) {
    const { name, currentPassword, newPassword } = req.body;
    
    const user = await findUserById(req.userId);
    if (!user) {
        throw new UnauthorizedError('User not found');
    }
    
    // Prepare update data
    const updateData = {
        ...user,
        updatedAt: new Date().toISOString()
    };
    
    // Update name if provided
    if (name) {
        const sanitizedName = sanitizeInput(name);
        if (sanitizedName.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters long'
            });
        }
        updateData.name = sanitizedName;
    }
    
    // Update password if provided
    if (newPassword) {
        // Verify current password
        if (!currentPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is required to change password'
            });
        }
        
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }
        
        // Hash new password
        updateData.password = await bcrypt.hash(newPassword, 10);
    }
    
    // Update user
    await updateUser(req.userId, updateData);
    
    // Generate new token with updated info
    const token = generateToken({
        userId: updateData.id,
        email: updateData.email,
        name: updateData.name
    });
    
    // Return updated user data (without password)
    const { password: _, ...userWithoutPassword } = updateData;
    
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: userWithoutPassword,
            token
        }
    });
}

/**
 * Delete user account
 */
async function deleteAccount(req, res) {
    const user = await findUserById(req.userId);
    if (!user) {
        throw new UnauthorizedError('User not found');
    }
    
    // Delete user
    await deleteUser(req.userId);
    
    res.json({
        success: true,
        message: 'Account deleted successfully'
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
    updateProfile,
    deleteAccount,
    verifyToken
};

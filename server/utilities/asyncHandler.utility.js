import jwt from "jsonwebtoken";

// Async handler utility for handling async functions
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// JWT Token utility functions
const TOKEN_EXPIRATION_TIME = process.env.JWT_EXPIRES_IN || '1h';
const SLIDING_EXPIRATION_THRESHOLD = 15 * 60; // 15 minutes in seconds

const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const userId = user._id || user.id;
    console.log('generateToken - Input user:', { _id: user._id, id: user.id, username: user.username });
    console.log('generateToken - Using user ID:', userId);
    
    return jwt.sign(
        {
            id: userId,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION_TIME }
    );
};

const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Helper function to check if token needs refresh
const needsTokenRefresh = (decodedToken) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = decodedToken.exp - currentTime;
    return timeUntilExpiration <= SLIDING_EXPIRATION_THRESHOLD;
};

export { 
    asyncHandler, 
    generateToken, 
    verifyToken, 
    TOKEN_EXPIRATION_TIME, 
    SLIDING_EXPIRATION_THRESHOLD,
    needsTokenRefresh 
};
export default asyncHandler;

import jwt from "jsonwebtoken";
import { 
    generateToken, 
    SLIDING_EXPIRATION_THRESHOLD,
    needsTokenRefresh 
} from "../utilities/asyncHandler.utility.js";

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ 
            message: "Access Denied. No token provided",
            error: "MISSING_TOKEN" 
        }); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            let errorMessage = "Invalid token";
            let errorCode = "INVALID_TOKEN";
            
            if (err.name === 'TokenExpiredError') {
                errorMessage = "Token has expired";
                errorCode = "EXPIRED_TOKEN";
            } else if (err.name === 'JsonWebTokenError') {
                errorMessage = "Malformed token";
                errorCode = "MALFORMED_TOKEN";
            }
            
            return res.status(403).json({ 
                message: errorMessage,
                error: errorCode 
            });
        }
        
        // Store user info in request
        req.user = user;
        
        // Check if token needs refresh using utility function
        if (needsTokenRefresh(user)) {
            try {
                const newToken = generateToken({
                    _id: user.id,
                    username: user.username
                });
                
                // Send new token in response header
                res.setHeader('X-New-Token', newToken);
                
                console.log(`Token refreshed for user: ${user.username}`);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // Don't fail the request, just log the error
            }
        }
        
        next();
    });
}

export default authenticateToken;
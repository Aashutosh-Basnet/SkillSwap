import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utilities/asyncHandler.utility.js";

export const register = async (req, res) => {
  const { fullname, username, password, gender, skills, email, phone, previous_meetings } = req.body;

  try {
    // Input validation
    if (!fullname || !username || !password || !email) {
      return res.status(400).json({ 
        message: "Required fields missing",
        error: "VALIDATION_ERROR" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username ? "Username already exists" : "Email already exists",
        error: "USER_EXISTS" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      skills,
      email,
      phone,
      previous_meetings,
    });

    await newUser.save();
    
    // Generate token for immediate login after registration
    const token = generateToken(newUser);
    
    res.status(201).json({ 
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "User already exists",
        error: "DUPLICATE_USER" 
      });
    }
    
    res.status(500).json({ 
      message: "Error registering user",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Username and password are required",
        error: "VALIDATION_ERROR" 
      });
    }

    // Find user by username or email
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!existingUser) {
      return res.status(404).json({ 
        message: "User not found",
        error: "USER_NOT_FOUND" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: "Invalid credentials",
        error: "INVALID_CREDENTIALS" 
      });
    }

    // Generate token using utility function
    const token = generateToken(existingUser);

    res.json({ 
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        fullname: existingUser.fullname,
        email: existingUser.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Error logging in",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

export const logout = async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token from storage
  res.status(200).json({ 
    message: "Logged out successfully",
    note: "Please remove the token from client storage" 
  });
};
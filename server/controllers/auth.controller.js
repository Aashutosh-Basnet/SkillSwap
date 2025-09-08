import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utilities/asyncHandler.utility.js";

export const register = async (req, res) => {
  const { fullname, username, password, gender, about, learning_skills, teaching_skills, email, phone, previous_meeting } = req.body;

  try {
    // Input validation
    if (!fullname || !username || !password || !email) {
      return res.status(400).json({ 
        message: "Required fields missing",
        error: "VALIDATION_ERROR" 
      });
    }

    // Validate required skills arrays
    if (!learning_skills || !Array.isArray(learning_skills) || learning_skills.length === 0) {
      return res.status(400).json({ 
        message: "At least one learning skill is required",
        error: "VALIDATION_ERROR" 
      });
    }

    if (!teaching_skills || !Array.isArray(teaching_skills) || teaching_skills.length === 0) {
      return res.status(400).json({ 
        message: "At least one teaching skill is required",
        error: "VALIDATION_ERROR" 
      });
    }

    // Filter out empty strings from skills arrays
    const filteredLearningSkills = learning_skills.filter(skill => skill && skill.trim() !== '');
    const filteredTeachingSkills = teaching_skills.filter(skill => skill && skill.trim() !== '');

    if (filteredLearningSkills.length === 0) {
      return res.status(400).json({ 
        message: "At least one valid learning skill is required",
        error: "VALIDATION_ERROR" 
      });
    }

    if (filteredTeachingSkills.length === 0) {
      return res.status(400).json({ 
        message: "At least one valid teaching skill is required",
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
      about: about || '',
      learning_skills: filteredLearningSkills,
      teaching_skills: filteredTeachingSkills,
      email,
      phone,
      previous_meeting: previous_meeting || [],
    });

    await newUser.save();
    console.log('Registration - New user saved with ID:', newUser._id);
    console.log('Registration - New user object:', { id: newUser._id, username: newUser.username });
    
    // Generate token for immediate login after registration
    const token = generateToken(newUser);
    console.log('Registration - Generated token for user ID:', newUser._id);
    
    res.status(201).json({ 
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        avatar: newUser.avatar,
        about: newUser.about,
        learning_skills: newUser.learning_skills,
        teaching_skills: newUser.teaching_skills,
        skillswap_credits: newUser.skillswap_credits
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
        email: existingUser.email,
        avatar: existingUser.avatar,
        about: existingUser.about,
        learning_skills: existingUser.learning_skills,
        teaching_skills: existingUser.teaching_skills,
        skillswap_credits: existingUser.skillswap_credits
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
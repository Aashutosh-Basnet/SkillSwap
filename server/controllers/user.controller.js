import User from "../models/user.model.js";

// Get all users (for recommendation system)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json(users.map(user => ({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      avatar: user.avatar,
      about: user.about,
      learning_skills: user.learning_skills,
      teaching_skills: user.teaching_skills,
      previous_meeting: user.previous_meeting,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })));
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      message: "Error retrieving users",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

// Get user by ID (for recommendation system)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('getUserById - Looking for user ID:', userId);
    
    const user = await User.findById(userId).select('-password');
    console.log('getUserById - Found user:', user ? 'YES' : 'NO');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
    }

    res.json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      avatar: user.avatar,
      about: user.about,
      learning_skills: user.learning_skills,
      teaching_skills: user.teaching_skills,
      previous_meeting: user.previous_meeting,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      message: "Error retrieving user",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('getUserProfile - Token user object:', req.user);
    console.log('getUserProfile - Looking for user ID:', userId);
    console.log('getUserProfile - User ID type:', typeof userId);
    
    const user = await User.findById(userId).select('-password');
    console.log('getUserProfile - Found user:', user ? 'YES' : 'NO');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
    }

    res.json({
      message: "Profile retrieved successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        avatar: user.avatar,
        about: user.about,
        learning_skills: user.learning_skills,
        teaching_skills: user.teaching_skills,
        previous_meeting: user.previous_meeting,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Error retrieving profile",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, gender, avatar, about, learning_skills, teaching_skills } = req.body;

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

    // Update user profile
    const updateData = {
      learning_skills: filteredLearningSkills,
      teaching_skills: filteredTeachingSkills,
      updatedAt: new Date()
    };

    // Add optional fields if provided
    if (fullname && fullname.trim()) {
      updateData.fullname = fullname.trim();
    }
    
    if (gender) {
      updateData.gender = gender;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    if (about !== undefined) {
      updateData.about = about;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        avatar: updatedUser.avatar,
        about: updatedUser.about,
        learning_skills: updatedUser.learning_skills,
        teaching_skills: updatedUser.teaching_skills,
        previous_meeting: updatedUser.previous_meeting,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        error: "VALIDATION_ERROR",
        details: error.message
      });
    }
    
    res.status(500).json({
      message: "Error updating profile",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

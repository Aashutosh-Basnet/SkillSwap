import User from "../models/user.model.js";

// Get available teachers for a specific skill
export const getAvailableTeachers = async (req, res) => {
  try {
    const { skill } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        message: "User authentication required",
        error: "UNAUTHORIZED" 
      });
    }

    // Build query to find teachers
    let query = { _id: { $ne: userId } }; // Exclude current user
    
    if (skill) {
      query.teaching_skills = { $in: [skill] };
    }

    const teachers = await User.find(query)
      .select('username fullname avatar about teaching_skills')
      .limit(20);

    res.json({
      message: "Available teachers retrieved successfully",
      teachers
    });
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ 
      message: "Error retrieving teachers",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

// Request to learn from a teacher (deducts 1 credit)
export const requestLearning = async (req, res) => {
  try {
    const { teacherId, skill } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        message: "User authentication required",
        error: "UNAUTHORIZED" 
      });
    }

    if (!teacherId || !skill) {
      return res.status(400).json({ 
        message: "Teacher ID and skill are required",
        error: "VALIDATION_ERROR" 
      });
    }

    // Get current user and check credits
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ 
        message: "User not found",
        error: "USER_NOT_FOUND" 
      });
    }

    if (currentUser.skillswap_credits < 1) {
      return res.status(400).json({ 
        message: "Insufficient credits. You need at least 1 credit to learn a skill.",
        error: "INSUFFICIENT_CREDITS" 
      });
    }

    // Verify teacher exists and teaches the skill
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found",
        error: "TEACHER_NOT_FOUND" 
      });
    }

    if (!teacher.teaching_skills.includes(skill)) {
      return res.status(400).json({ 
        message: "Teacher does not teach this skill",
        error: "SKILL_NOT_TAUGHT" 
      });
    }

    // Deduct credit from learner
    await User.findByIdAndUpdate(userId, { 
      $inc: { skillswap_credits: -1 } 
    });

    res.json({
      message: "Learning request processed successfully",
      remainingCredits: currentUser.skillswap_credits - 1,
      teacher: {
        id: teacher._id,
        username: teacher.username,
        fullname: teacher.fullname
      },
      skill
    });
  } catch (error) {
    console.error("Request learning error:", error);
    res.status(500).json({ 
      message: "Error processing learning request",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

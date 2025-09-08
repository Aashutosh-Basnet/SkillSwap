import User from "../models/user.model.js";

// Get available learners for a specific skill
export const getAvailableLearners = async (req, res) => {
  try {
    const { skill } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        message: "User authentication required",
        error: "UNAUTHORIZED" 
      });
    }

    // Build query to find learners
    let query = { _id: { $ne: userId } }; // Exclude current user
    
    if (skill) {
      query.learning_skills = { $in: [skill] };
    }

    // Only show learners who have credits
    query.skillswap_credits = { $gte: 1 };

    const learners = await User.find(query)
      .select('username fullname avatar about learning_skills skillswap_credits')
      .limit(20);

    res.json({
      message: "Available learners retrieved successfully",
      learners
    });
  } catch (error) {
    console.error("Get learners error:", error);
    res.status(500).json({ 
      message: "Error retrieving learners",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

// Accept a teaching request (awards 1 credit)
export const acceptTeaching = async (req, res) => {
  try {
    const { learnerId, skill } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        message: "User authentication required",
        error: "UNAUTHORIZED" 
      });
    }

    if (!learnerId || !skill) {
      return res.status(400).json({ 
        message: "Learner ID and skill are required",
        error: "VALIDATION_ERROR" 
      });
    }

    // Get current user (teacher)
    const teacher = await User.findById(userId);
    if (!teacher) {
      return res.status(404).json({ 
        message: "Teacher not found",
        error: "USER_NOT_FOUND" 
      });
    }

    // Verify teacher teaches the skill
    if (!teacher.teaching_skills.includes(skill)) {
      return res.status(400).json({ 
        message: "You do not teach this skill",
        error: "SKILL_NOT_TAUGHT" 
      });
    }

    // Verify learner exists and wants to learn the skill
    const learner = await User.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ 
        message: "Learner not found",
        error: "LEARNER_NOT_FOUND" 
      });
    }

    if (!learner.learning_skills.includes(skill)) {
      return res.status(400).json({ 
        message: "Learner is not interested in this skill",
        error: "SKILL_NOT_WANTED" 
      });
    }

    if (learner.skillswap_credits < 1) {
      return res.status(400).json({ 
        message: "Learner has insufficient credits",
        error: "LEARNER_INSUFFICIENT_CREDITS" 
      });
    }

    // Award credit to teacher
    await User.findByIdAndUpdate(userId, { 
      $inc: { skillswap_credits: 1 } 
    });

    res.json({
      message: "Teaching session accepted successfully",
      newCredits: teacher.skillswap_credits + 1,
      learner: {
        id: learner._id,
        username: learner.username,
        fullname: learner.fullname
      },
      skill
    });
  } catch (error) {
    console.error("Accept teaching error:", error);
    res.status(500).json({ 
      message: "Error processing teaching acceptance",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

// Get user's current credit balance
export const getCreditBalance = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        message: "User authentication required",
        error: "UNAUTHORIZED" 
      });
    }

    const user = await User.findById(userId).select('skillswap_credits');
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        error: "USER_NOT_FOUND" 
      });
    }

    res.json({
      message: "Credit balance retrieved successfully",
      credits: user.skillswap_credits
    });
  } catch (error) {
    console.error("Get credit balance error:", error);
    res.status(500).json({ 
      message: "Error retrieving credit balance",
      error: "INTERNAL_SERVER_ERROR" 
    });
  }
};

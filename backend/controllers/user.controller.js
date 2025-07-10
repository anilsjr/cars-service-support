// User Controller
// Add your user logic here

// Example: Get user profile
const getProfile = (req, res) => {
    // You can access user info from req.user (set by auth middleware)
    res.json({
        message: 'User profile fetched successfully',
        user: req.user || null
    });
};

// Example: Update user profile
const updateProfile = (req, res) => {
    // Implement your update logic here
    res.json({
        message: 'User profile updated successfully',
        // You can return updated user info here
    });
};

export default {
    getProfile,
    updateProfile
};

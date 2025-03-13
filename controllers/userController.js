const getUserProfile = async (req, res) => {
    try {
      const user = req.user; // User data is already fetched in middleware
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = { getUserProfile };
  
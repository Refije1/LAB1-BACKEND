const express = require("express");
const path = require("path");
const multer = require("multer");

const {
  getUser,
  getAllUsers,
  createUserAbout,
  getUserAbout,
  updateUserAbout,
  verifyUserManually,
  deleteUser,
  deleteUserAbout,
  setProfilePicture,
  updateUser,
  // getUserPosts, // Uncomment or import this if it's implemented
  // verifyEmail, // Uncomment or import this if it's implemented
} = require("../controllers/users");

// Create a router object using express.Router()
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Setup the routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUser);
router.put("/users/profilePicture/:userId",
  upload.array("profilePicture", 1),
  setProfilePicture
);
// router.get("/users/:userId/posts", getUserPosts);
router.post("/users/:userId/about", createUserAbout);
router.get("/users/:userId/about", getUserAbout);
router.put("/users/:userId/about", updateUserAbout);
router.put("/update/:userId", updateUser);
router.put("/users/:userId/", verifyUserManually);
router.delete("/users/:userId", deleteUser);
router.delete("/users/about/:aboutId", deleteUserAbout); // Corrected route for clarity

// Optional: Uncomment the following if they are implemented and needed
// router.get("/verified", (req, res) => {
//   res.sendFile(path.join(__dirname, "./views/build", "index.html"));
// });

// EMAIL VERIFICATION
// router.get("/users/verify/:userId/:token", verifyEmail);

// PASSWORD RESET
// router.post("/request-passwordreset", requestPasswordReset);
// router.get("/reset-password/:userId/:token", resetPassword);
// router.post("/reset-password", changePassword);

// Export the router
module.exports = router;

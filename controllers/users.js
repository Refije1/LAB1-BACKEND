const User = require("../models/User.js");
const About = require("../models/About.js");
// const Verification = require("../models/emailVerification.js");
const { compareString, hashString } = require("../utils/helpers.js");
const { insertMultipleObjects } = require("../aws/S3Client.js");

const sql = require("mssql");
//const { pool } = require('../server');
//const config = require('../server').config;
// Create a pool and connect to SQL Server

const config = {
  user: "ari_kadriu",
  password: "123456",
  server: "127.0.0.1",
  database: "SocialMedia",
  options: {
  trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);



const getUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE UserId = @userId');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }
  
      return res.status(200).json(result.recordset[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const getAllUsers = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM Users');
  
      return res.status(200).json(result.recordset);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const createUserAbout = async (req, res) => {
    try {
      const userId = req.params.userId;
      const {
        highschool,
        university,
        residence,
        birthplace,
        phoneNumber,
        profession,
        contactEmail,
        website,
        socialLink,
      } = req.body;
  
      const pool = await poolPromise;
      const existingAbout = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM About WHERE UserId = @userId');
  
      if (existingAbout.recordset.length > 0) {
        return res.status(400).json({ error: "About information already exists for this user!" });
      }
  
      const insertAboutQuery = `
        INSERT INTO About (UserId, Highschool, University, Residence, Birthplace, PhoneNumber, Profession, ContactEmail, Website, SocialLink)
        VALUES (@userId, @highschool, @university, @residence, @birthplace, @phoneNumber, @profession, @contactEmail, @website, @socialLink)
      `;
  
      await pool.request()
        .input('userId', userId)
        .input('highschool', highschool)
        .input('university', university)
        .input('residence', residence)
        .input('birthplace', birthplace)
        .input('phoneNumber', phoneNumber)
        .input('profession', profession)
        .input('contactEmail', contactEmail)
        .input('website', website)
        .input('socialLink', socialLink)
        .query(insertAboutQuery);
  
      return res.status(201).json({ userId, highschool, university, residence, birthplace, phoneNumber, profession, contactEmail, website, socialLink });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const getUserAbout = async (req, res) => {
    try {
      const userId = req.params.userId;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM About WHERE UserId = @userId');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "About information not found" });
      }
  
      return res.status(200).json(result.recordset[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const updateUserAbout = async (req, res) => {
    try {
      const userId = req.params.userId;
      const {
        highschool,
        university,
        residence,
        birthplace,
        phoneNumber,
        profession,
        contactEmail,
        website,
        socialLink,
      } = req.body;
  
      const pool = await poolPromise;
      const existingAbout = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM About WHERE UserId = @userId');
  
      if (existingAbout.recordset.length === 0) {
        return res.status(404).json({ error: "About information not found for this user!" });
      }
  
      const updateAboutQuery = `
        UPDATE About
        SET Highschool = @highschool, University = @university, Residence = @residence, Birthplace = @birthplace,
            PhoneNumber = @phoneNumber, Profession = @profession, ContactEmail = @contactEmail, Website = @website,
            SocialLink = @socialLink
        WHERE UserId = @userId
      `;
  
      await pool.request()
        .input('highschool', highschool)
        .input('university', university)
        .input('residence', residence)
        .input('birthplace', birthplace)
        .input('phoneNumber', phoneNumber)
        .input('profession', profession)
        .input('contactEmail', contactEmail)
        .input('website', website)
        .input('socialLink', socialLink)
        .input('userId', userId)
        .query(updateAboutQuery);
  
      return res.status(200).json({ userId, highschool, university, residence, birthplace, phoneNumber, profession, contactEmail, website, socialLink });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
  const deleteUserAbout = async (req, res) => {
    try {
      const { aboutId } = req.params;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('aboutId', aboutId)
        .query('DELETE FROM About WHERE AboutId = @aboutId');
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "User about not found" });
      }
  
      return res.status(200).json({ message: "User about deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

//   const verifyEmail = async (req, res) => {
//     const { userId, token } = req.params;
  
//     try {
//       const pool = await poolPromise;
//       const result = await pool.request()
//         .input('userId', userId)
//         .query('SELECT * FROM Verification WHERE UserId = @userId');
  
//       if (result.recordset.length === 0) {
//         return res.redirect(`/users/verified?status=error&message=Verification not found.`);
//       }
  
//       const { expiresAt, token: hashedToken } = result.recordset[0];
  
//       if (expiresAt < Date.now()) {
//         await pool.request()
//           .input('userId', userId)
//           .query('DELETE FROM Users WHERE UserId = @userId');
        
//         return res.redirect(`/users/verified?status=error&message=Verification token has expired.`);
//       }
  
//       if (token !== hashedToken) {
//         return res.redirect(`/users/verified?status=error&message=Verification failed or link is invalid.`);
//       }
  
//       await pool.request()
//         .input('userId', userId)
//         .query('UPDATE Users SET verified = 1 WHERE UserId = @userId');
  
//       await pool.request()
//         .input('userId', userId)
//         .query('DELETE FROM Verification WHERE UserId = @userId');
  
//       return res.redirect(`/users/verified?status=success&message=Email verified successfully.`);
//     } catch (error) {
//       console.error(error);
//       return res.redirect(`/users/verified?message=Internal Server Error`);
//     }
//   };
  
  const verifyUserManually = async (req, res) => {
    try {
      const userId = req.params.userId;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE UserId = @userId');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await pool.request()
        .input('userId', userId)
        .query('UPDATE Users SET verified = 1 WHERE UserId = @userId');
  
      return res.status(201).json({ message: "User verified successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE UserId = @userId');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await pool.request()
        .input('userId', userId)
        .query('DELETE FROM Users WHERE UserId = @userId');
  
      return res.status(201).json({ message: "User deleted successfully", _id: userId });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  const setProfilePicture = async (req, res) => {
    try {
      const userId = req.params.userId;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE UserId = @userId');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let profilePicture = [];
  
      if (req.files) {
        try {
          const keys = await insertMultipleObjects(req.files);
          profilePicture = keys;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
  
      let picture = [];
  
      if (profilePicture.length > 0) {
        const url = "https://postify-development-images.s3.eu-central-1.amazonaws.com/";
        picture = profilePicture.map((key) => url + key);
        await pool.request()
          .input('picture', JSON.stringify(picture))
          .input('userId', userId)
          .query('UPDATE Users SET profilePicture = @picture WHERE UserId = @userId');
      }
  
      return res.status(201).json({ message: "Profile picture updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, gender, email } = req.body;
  
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE UserId = @userId');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
  
      await pool.request()
        .input('userId', userId)
        .input('firstName', firstName)
        .input('lastName', lastName)
        .input('gender', gender)
        .input('email', email)
        .query('UPDATE Users SET FirstName = @firstName, LastName = @lastName, Gender = @gender, Email = @email WHERE UserId = @userId');
  
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

module.exports = {
  getUser,
  getAllUsers,
  createUserAbout,
  getUserAbout,
  updateUserAbout,
  deleteUserAbout,
  verifyUserManually,
  deleteUser,
  setProfilePicture,
  updateUser
};
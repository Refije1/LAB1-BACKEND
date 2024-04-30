// Like.js

const { sql } = require("mssql");
const { pool } = require("../server");

// Function to create a new like
const createLike = async (userId, postId, author) => {
  try {
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("postId", sql.Int, postId)
      .input("author", sql.NVarChar, author)
      .query(
        "INSERT INTO Likes (userId, postId, author) VALUES (@userId, @postId, @author)"
      );

    return result.recordset[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { createLike };

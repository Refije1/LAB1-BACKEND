const pool = require("../server");

export const createComment = async (req, res) => {
  try {
    const { content, postId, from } = req.body;
    const userId = req.body.userId;

    // Check if the user exists
    const userQuery = "SELECT * FROM Users WHERE id = @userId;";
    const userResult = await pool
      .request()
      .input("userId", userId)
      .query(userQuery);
    const user = userResult.recordset[0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { firstName, lastName, profilePicture } = user;
    const author = firstName + " " + lastName;

    // Create a new comment
    const createCommentQuery = `
      INSERT INTO Comments (postId, userId, content, author, commenterProfilePicture)
      VALUES (@postId, @userId, @content, @author, @commenterProfilePicture);
    `;
    await pool
      .request()
      .input("postId", postId)
      .input("userId", userId)
      .input("content", content)
      .input("author", author)
      .input("commenterProfilePicture", profilePicture)
      .query(createCommentQuery);

    // Update the post to include the new comment
    const updatePostQuery = `
      UPDATE Posts
      SET comments = comments + 1
      WHERE id = @postId;
    `;
    await pool.request().input("postId", postId).query(updatePostQuery);

    return res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Update the comment
    const updateCommentQuery = `
      UPDATE Comments
      SET content = @content
      WHERE id = @id;
    `;
    await pool
      .request()
      .input("content", content)
      .input("id", id)
      .query(updateCommentQuery);

    return res.json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the comment
    const deleteCommentQuery = `
      DELETE FROM Comments
      WHERE id = @id;
    `;
    await pool.request().input("id", id).query(deleteCommentQuery);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Get comments for the specified post
    const getCommentsQuery = `
      SELECT * FROM Comments
      WHERE postId = @postId
      ORDER BY createdAt DESC;
    `;
    const result = await pool
      .request()
      .input("postId", postId)
      .query(getCommentsQuery);
    const comments = result.recordset;

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments for post:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const likePostComment = async (req, res) => {
  try {
    // Handle like functionality
    // This depends on your specific implementation and database schema
  } catch (error) {
    console.error("Error liking post comment:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    // Handle commenting on a post
    // This depends on your specific implementation and database schema
  } catch (error) {
    console.error("Error commenting on post:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const replyPostComment = async (req, res) => {
  try {
    // Handle replying to a post comment
    // This depends on your specific implementation and database schema
  } catch (error) {
    console.error("Error replying to post comment:", error);
    return res.status(400).json({ error: error.message });
  }
};

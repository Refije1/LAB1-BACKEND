const { sql } = require("mssql");

// Define the MSSQL table creation query
const createTableQuery = `
CREATE TABLE About (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(id),
    highschool NVARCHAR(MAX),
    university NVARCHAR(MAX),
    residence NVARCHAR(MAX),
    birthplace NVARCHAR(MAX),
    phoneNumber NVARCHAR(MAX),
    profession NVARCHAR(MAX),
    contactEmail NVARCHAR(MAX),
    website NVARCHAR(MAX),
    socialLink NVARCHAR(MAX)
);
`;

// Execute the table creation query
pool
  .request()
  .query(createTableQuery)
  .then(() => {
    console.log("About table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating About table:", err);
  });

// Export the About model functions
// These functions will interact with the About table
module.exports = {
  // Function to create a new about entry
  create: async (
    userId,
    highschool,
    university,
    residence,
    birthplace,
    phoneNumber,
    profession,
    contactEmail,
    website,
    socialLink
  ) => {
    try {
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("highschool", sql.NVarChar, highschool)
        .input("university", sql.NVarChar, university)
        .input("residence", sql.NVarChar, residence)
        .input("birthplace", sql.NVarChar, birthplace)
        .input("phoneNumber", sql.NVarChar, phoneNumber)
        .input("profession", sql.NVarChar, profession)
        .input("contactEmail", sql.NVarChar, contactEmail)
        .input("website", sql.NVarChar, website)
        .input("socialLink", sql.NVarChar, socialLink)
        .query(
          "INSERT INTO About (userId, highschool, university, residence, birthplace, phoneNumber, profession, contactEmail, website, socialLink) VALUES (@userId, @highschool, @university, @residence, @birthplace, @phoneNumber, @profession, @contactEmail, @website, @socialLink)"
        );

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },
};

const pool = require("../../db/mySqlConnection");

const getIndex = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT 1 + 1 AS solution");
    res.json(result[0]);
  } catch (error) {
    return res.status(error).json({ message });
  }
};

module.exports = {
  getIndex,
};

const pool = require("../../db/mySqlConnection");
const { promisify } = require("util");
const redisClient = require("../..//db/redisConnection");

const GET_ASYNC = promisify(redisClient.get).bind(redisClient);
const SET_ASYNC = promisify(redisClient.set).bind(redisClient);
const DELETE_ASYNC = promisify(redisClient.del).bind(redisClient);

const getEmployees = async (req, res) => {
  try {
    const { originalUrl } = req;
    const redisGet = await GET_ASYNC(`${originalUrl}-get-all`);
    console.log({ redisGet });

    if (redisGet !== null) return res.json(JSON.parse(redisGet));

    const [result] = await pool.query("SELECT * FROM employee");
    await SET_ASYNC(`${originalUrl}-get-all`, JSON.stringify(result));
    res.json(result);
  } catch (error) {
    return res.status(error.response.status).json({ message: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { originalUrl } = req;

    const reply = await GET_ASYNC(originalUrl);
    if (reply) return res.status(200).json(JSON.parse(reply));
    if (!reply) {
      const { id } = req.params;
      const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
        id,
      ]);
      if (!rows[0])
        return res.status(404).json({ message: "The employee doesn't exist" });
      res.json(rows[0]);
      await SET_ASYNC(originalUrl, JSON.stringify(rows));
      return res.status(200).json(rows);
    }
  } catch (error) {
    return res.status(error).json({ message: error });
  }
};
const postEmployees = async (req, res) => {
  try {
    const { name, salary } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO employee (name, salary) VALUES (?, ?)",
      [name, salary],
    );
    await DELETE_ASYNC("/api/employees-get-all");
    res.status(201).json({ id: rows.insertId, name, salary });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
const putEmployees = (req, res) => {
  res.json({ user: "geek" });
};

const deleteEmployees = async (req, res) => {
  try {
    const {
      originalUrl,
      params: { id },
    } = req;
    const [result] = await pool.query("DELETE FROM employee WHERE id = ?", [
      id,
    ]);
    console.log(result);
    if (result.affectedRows < 1) {
      return res.status(404).json({ message: "Id not found" });
    }
    await DELETE_ASYNC(originalUrl);
    await DELETE_ASYNC("/api/employees-get-all");
    res.status(200).json({ message: `${id} deleted` });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  postEmployees,
  putEmployees,
  deleteEmployees,
};

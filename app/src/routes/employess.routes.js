const { Router } = require("express");
const {
  getEmployees,
  getEmployee,
  postEmployees,
  putEmployees,
  deleteEmployees,
} = require("../controllers/employees/employees.controllers");

const router = Router();

// Routes
router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployee);
router.post("/employees", postEmployees);
router.put("/employees", putEmployees);
router.delete("/employees/:id", deleteEmployees);

module.exports = { router };

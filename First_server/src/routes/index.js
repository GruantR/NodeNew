const express = require("express");
const usersRoutes = require("./usersRoutes");
const router = express.Router();

router.use("/users", usersRoutes);
module.exports = router;

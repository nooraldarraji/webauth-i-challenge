const express = require("express");
const bcrypt = require("bcryptjs");
const server = express();

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`Listining on port ${port}`));
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const documentRouter = require("./modules/apiDoc/swagger.routes");
const authRouter = require("./modules/Auth/auth.routes")
const usersRouter = require("./modules/Users/users.routes")

const app = express();

// Get req.body
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/document" , documentRouter)
app.use("/auth" , authRouter)
app.use("/users" , usersRouter)

// Not-Found Page
app.use((req, res) => {
  return res.status(404).json({
    message: "404! Path Not Found!!",
  });
});

module.exports = app;

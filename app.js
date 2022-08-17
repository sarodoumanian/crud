require("dotenv").config();
const express = require("express");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const validationError = require("./middleware/error");

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(CookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

const { userRouter, componentRouter, catRouter, subcatRouter } = require("./routes/index");
app.use("/api/user", userRouter);
app.use("/api/component", componentRouter);
app.use("/api/catagory", catRouter);
app.use("/api/subcatagory", subcatRouter);

app.use(validationError);

// http.listen(process.env.PORT, () => console.log("server started"));

io.on("connection", (socket) => {
  socket.on("newComponent", () => {
    io.emit("sendNewNotif");
  });

  socket.on("revert", (userId) => {
    io.emit("reverted", userId);
  });
});

module.exports = http;

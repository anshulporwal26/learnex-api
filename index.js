if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", mediaRoutes);
app.use("/api", roadmapRoutes);
app.use("/api", categoryRoutes);
app.use("/api", resourceRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", profileRoutes);
app.use("/api/auth", authRoutes);

const { PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gqnnt.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT || 5000, () => {
      console.log("Server has started!");
    });
  });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connection to db established"));

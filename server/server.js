    require("dotenv").config();
    const express = require('express');
    const path = require("path");
    const mongoose = require('mongoose');
    const cors = require('cors');

    const app = express();

    //Middleware
    app.use(express.json())
    app.use(cors({ origin: "*" }))

    //Image Upload
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));


    //Connection To MongoDB
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log(err))

    //Starting Route
    app.get("/", (req, res) => {
        res.send("Welcome to To-Do API!")
    })

    const PORT = process.env.PORT || 5000;
    const todoRoutes = require("./routes/todoRoutes")
    app.use("/api", todoRoutes)
    app.listen(PORT, () => console.log(`Server is Running on http://localhost:${PORT} `))
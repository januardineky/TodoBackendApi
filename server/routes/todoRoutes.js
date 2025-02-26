const express = require('express');
const Todo = require('../models/todo');
const path = require("path");
const fs = require("fs");
const router = express.Router()
const multer = require("multer");

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/")); // Pastikan path sesuai
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

//Get All Todo Data
router.get("/todos", async (req, res) => {
    try{
        const todos = await Todo.find()
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Add Todo Data
router.post("/todos", async (req, res) => {
    try{
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Get the Specified Todo Data by ID / Edit Todo
router.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) {
            return res.status(404).json({ message: "To-Do not Found" });
        }
        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update Todo
router.put("/todos/:id", upload.single("image"), async (req, res) => {
    try {
        const { task, status } = req.body;
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: "Todo tidak ditemukan" });
        }

        // Cek apakah status ingin diubah menjadi true (completed)
        const newStatus = status === "true" || status === "1";

        // Jika ingin mengubah status menjadi completed, harus ada gambar
        if (newStatus && !req.file && !todo.image) {
            return res.status(400).json({ error: "Harus mengunggah gambar jika ingin menyelesaikan tugas!" });
        }

        // Update task dan status
        todo.task = task;
        todo.status = newStatus;

        // Jika ada file baru, update gambar
        if (req.file) {
            if (todo.image) {
                const oldImagePath = path.join(__dirname, "../uploads/", todo.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
            todo.image = req.file.filename;
        } 
        // Kalau tidak ada file baru, **jangan ubah field image**
        
        await todo.save();
        res.json(todo);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Gambar Harus Ada" });
    }
});

//Delete Todo
router.delete("/todos/:id", async (req, res) => {
  try {
      // Cari todo berdasarkan ID
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
          return res.status(404).json({ message: "To-Do tidak ditemukan" });
      }

      // Jika ada gambar, hapus file dari folder uploads
      if (todo.image) {
          const imagePath = path.join(__dirname, "../uploads/", todo.image);
          fs.unlink(imagePath, (err) => {
              if (err) {
                  console.error("Error deleting file:", err);
              }
          });
      }

      // Hapus todo dari database
      await Todo.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "To-Do dan gambar berhasil dihapus" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
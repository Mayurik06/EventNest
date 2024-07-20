require('dotenv').config();
require('express-async-errors');

const express = require("express");
const app = express();
const cors = require('cors');
const path=require("path");
const multer=require("multer")
const connectDB = require("./db/connect");
const eventRouter = require("./routes/events");
const addEventRouter=require('./routes/adeve')
const registerRoutes = require('./routes/Signup');
const loginRoutes = require('./routes/Login');
const logoutRoutes = require('./routes/Logout');


// const upload=require("./uploadConfig")
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use("/api/v1", eventRouter);
app.use('/api/v2',addEventRouter);
app.use('/api/v1', registerRoutes);
app.use('/api/v1', loginRoutes);
app.use('/api/v1', logoutRoutes); 

const port = process.env.PORT || 4000;

  
  const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 15000000 }, // 1.5MB limit
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    }
  }).single('file'); // 'file' should match the name attribute of your file input in the frontend form
  
  // Check file type
  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images and PDFs Only!');
    }
  }

  app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        if (!req.file) {
          res.status(400).json({ error: 'No file selected!' });
        } else {
          const filePath = req.file.path;
          // Here you can save filePath to your database or perform other operations
          res.status(201).json({ message: 'File uploaded successfully', filePath: filePath });
        }
      }
    });
  });

// app.post("/upload", upload.single("file"), (req, res) => {
//     if (req.file === undefined) {
//         return res.status(400).json({ message: "No file selected!" });
//     }
//     const folderName = "uploads";
//     res.json({
//         message: "File uploaded!",
//         file: `${folderName}/${req.file.filename}`,
//         folder: folderName,
//     });
// });

const start = async () => {
    try {
        // await connectDB(process.env.MONGO_URI);
        await connectDB("mongodb://localhost:27017/Calendar");

        app.listen(port, () => {
            console.log("Server listening on port " + port);
        })
    } catch (error) {
        console.log(error);
    }
}
start();
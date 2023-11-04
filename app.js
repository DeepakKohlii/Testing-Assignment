const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

const fileFilter = (req, file, cb) => {
  console.log("type",file.mimetype);
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and JPEG files are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 305 * 1024 * 1024 },
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/upload.html");
});

app.post("/upload", upload.single("uploadFile"), (req, res, next) => {

  console.log(req.body);
  if (req.file) {
    res.send("File uploaded successfully");
  } else {
    res.status(400).send("File size exceeds the limit or invalid file type.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

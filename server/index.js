import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { Meilisearch } from "meilisearch";
import dotenv from "dotenv";
import slugify from "slugify";
dotenv.config();

const app = express();
const port = 3001;
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const randomPrefix = Math.random().toString(36).substring(2, 15);
    const extension = file.mimetype.split("/")[1];
    const baseName = path.parse(file.originalname).name;
    const finalName = randomPrefix + "-" + baseName + "." + extension;
    cb(null, finalName);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const title= path.parse(req.file.originalname).name;
  const id = slugify(title, { lower: true, remove: /[.]/g });
  const imageData = {
    id,
    title,
    description: "",
    tags: [],
    filePath: "/images/" + req.file.filename,
  };

  const meilisearch = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: process.env.VITE_MEILI_MASTER_KEY,
  });
  meilisearch
    .index("images")
    .addDocuments([imageData])
    .then((reponse) => {
      console.log(reponse);
      res.json({
        message: "Image uploaded successfully",
        filename: req.file.filename,
      });
    })
    .catch((err) => {
      console.error("Failed to index image:", err);
      return res.status(500).json({ error: "Failed to index image" });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

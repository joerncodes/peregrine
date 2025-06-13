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
app.use(express.json());
import fs from "fs";

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
    filePath: "/images/" + req.file.filename,
    createdAt: new Date().toISOString(),
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

app.delete('/image/:id', (req, res) => {
  const { id } = req.params;
  const meilisearch = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: process.env.VITE_MEILI_MASTER_KEY,
  });
  meilisearch.index("images").deleteDocument(id);
  res.json({ message: "Image deleted" });
});
app.patch('/image/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;
  const meilisearch = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: process.env.VITE_MEILI_MASTER_KEY,
  });
  meilisearch.index("images").updateDocuments([{
    id,
    title,
    description,
    tags,
  }]);
  res.json({ message: "Image updated" });
});

app.get('/reset', (req, res) => {
  const meilisearch = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: process.env.VITE_MEILI_MASTER_KEY,
  });
  meilisearch.index("images").delete();
  // Delete all images from /public/images
  const imagesDir = path.join(process.cwd(), 'public/images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.status(500).json({ error: 'Failed to read images directory' });
    }

    files.forEach(file => {
      fs.unlink(path.join(imagesDir, file), err => {
        if (err) console.error('Error deleting file:', file, err);
      });
    });
  });

  res.json({ message: 'Images reset successful' });
});

app.get("/search", async (req, res) => {
  const { q = "" } = req.query;
  const meilisearch = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: process.env.VITE_MEILI_MASTER_KEY,
  });
  async function doSearch() {
    return await meilisearch.index("images").search(q, {
      limit: 1000,
      sort: ["createdAt:desc"],
    });
  }
  try {
    const result = await doSearch();
    res.json(result.hits);
  } catch (err) {
    console.error("Search failed, attempting to create index and set sortable attributes:", err);
    try {
      // Create the index if it doesn't exist
      await meilisearch.createIndex("images");
      // Set 'createdAt' as a sortable attribute
      await meilisearch.index("images").updateSortableAttributes(["createdAt"]);
      // Retry the search
      const result = await doSearch();
      res.json(result.hits);
    } catch (err2) {
      console.error("Search still failed after attempting to fix index:", err2);
      res.status(500).json({ error: "Search failed and could not fix index." });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

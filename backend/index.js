import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { Meilisearch } from "meilisearch";
import dotenv from "dotenv";
import slugify from "slugify";
import sharp from "sharp";
dotenv.config();

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
import fs from "fs";

const imagesDir = process.env.IMAGES_DIR || "/app/public/images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const randomPrefix = Math.random().toString(36).substring(2, 15);
    const extension = file.mimetype.split("/")[1];
    const originalName = file.originalname || `upload-${Date.now()}`;
    const baseName = path.parse(originalName).name;
    const finalName = randomPrefix + "-" + baseName + "." + extension;
    cb(null, finalName);
  },
});

const meilisearch = new Meilisearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_MASTER_KEY,
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/images/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(imagesDir, filename);
  res.sendFile(imagePath);
});

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const imagePath = path.join(imagesDir, req.file.filename);
    const metadata = await sharp(imagePath).metadata();

    const title = path.parse(req.file.originalname).name;
    const id = slugify(title, { lower: true, remove: /[.]/g });
    const imageData = {
      id,
      title,
      description: "",
      filePath: "/images/" + req.file.filename,
      createdAt: new Date().toISOString(),
      dimensions: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: req.file.size,
      },
    };

    const response = await meilisearch
      .index("images")
      .addDocuments([imageData]);
    console.log(response);
    res.json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
      dimensions: imageData.dimensions,
    });
  } catch (err) {
    console.error("Failed to process or index image:", err);
    return res.status(500).json({ error: "Failed to process or index image" });
  }
});

app.delete("/image/:id", (req, res) => {
  const { id } = req.params;
  meilisearch.index("images").deleteDocument(id);
  res.json({ message: "Image deleted" });
});
app.patch("/image/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;
  meilisearch.index("images").updateDocuments([
    {
      id,
      title,
      description,
      tags,
    },
  ]);
  res.json({ message: "Image updated" });
});

app.get("/reset", (req, res) => {
  meilisearch.index("images").delete();
  // Update the images directory path
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Error reading images directory:", err);
      return res.status(500).json({ error: "Failed to read images directory" });
    }

    files.forEach((file) => {
      fs.unlink(path.join(imagesDir, file), (err) => {
        if (err) console.error("Error deleting file:", file, err);
      });
    });
  });

  res.json({ message: "Images reset successful" });
});

app.get("/search", async (req, res) => {
  const { q = "" } = req.query;
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
    console.error(
      "Search failed, attempting to create index and set sortable attributes:",
      err
    );
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

async function initializeIndex() {
  try {
    await meilisearch.createIndex("images");
    await meilisearch.index("images").updateSortableAttributes(["createdAt"]);
    console.log("Index created and sortable attributes set");
  } catch (error) {
    // Index might already exist, which is fine
    console.log("Index initialization:", error.message);
  }
}

app.listen(port, "0.0.0.0", async () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  await initializeIndex();
});

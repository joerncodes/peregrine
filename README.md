![](frontend/src/assets/peregrine.png)
# Peregrine — Lightning fast self-hosted image library

**Peregrine** is a modern, self-hosted image library that lets you upload, search, and manage images with a beautiful, responsive web interface. It features drag-and-drop uploads, instant search, and image management powered by a fast backend and Meilisearch.

---

## Features

- **Drag & Drop Uploads:** Effortlessly upload images by dragging them onto the app.
- **Instant Search:** Lightning-fast, full-text search across your image library.
- **Image Management:** View, zoom, download, and copy images to your clipboard.
- **Tagging & Metadata:** Images are stored with titles, descriptions, and tags.
- **Self-Hosted:** All your images stay on your own server.
- **Modern UI:** Clean, responsive interface built with React and Tailwind CSS.

---

## How It Works

- **Frontend:** React app (Vite, Tailwind CSS) for the user interface.
- **Backend:** Node.js/Express server handles uploads, search, and image serving.
- **Search Engine:** Meilisearch provides fast, typo-tolerant search.
- **Storage:** Images are saved to the server's filesystem (`public/images/`).

---

## Getting Started

### Requirements
- Node.js (v18+ recommended)
- Docker (for Meilisearch, or install Meilisearch manually)

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd peregrine
```

### 2. Install dependencies
```sh
yarn install
```

### 3. Start Meilisearch (via Docker Compose)
```sh
docker-compose up -d
```

### 4. Start the backend server
```sh
yarn server
```

### 5. Start the frontend
```sh
yarn dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173)
- The backend API runs on [http://localhost:3001](http://localhost:3001)
- Meilisearch runs on [http://localhost:7700](http://localhost:7700)

---

## Usage

- **Upload Images:** Drag and drop images onto the app or use the upload button.
- **Search:** Use the search bar to instantly find images by title, description, or tags.
- **View & Manage:** Click an image to view details, zoom, download, or copy to clipboard.

---

## Configuration

- **Environment Variables:**  
  - `VITE_MEILI_MASTER_KEY` (set in `.env` or use default in `docker-compose.yml`)
- **Image Storage:**  
  - Uploaded images are stored in `public/images/`.

---

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

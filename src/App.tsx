import { useEffect, useState } from "react";
import peregrineLogo from "./assets/peregrine.png";
import "./App.css";
import type { ImageMeta } from "./@types/ImageMeta";
import SearchFactory from "./search/SearchFactory";
import { Input } from "./components/ui/input";
import Image from "./components/Image";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<ImageMeta[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const result = await SearchFactory.getInstance()
        .index("images")
        .search("");
      setImages(result.hits as ImageMeta[]);
      setLoaded(true);
    }
    fetchImages();
  }, []);

  return (
    <>
      <header className="bg-slate-600 text-slate-200 p-8 flex items-center gap-4">
        <img src={peregrineLogo} alt="Peregrine" className="w-14 h-14" />
        <h1 className="text-4xl font-bold text-center">Peregrine</h1>
        <Input
          type="text"
          placeholder="Search"
          className="w-full"
          autoFocus
          disabled={!loaded}
          onChange={(e) => {
            const search = e.target.value;
            SearchFactory.getInstance()
              .index("images")
              .search(search)
              .then((result) => {
                setImages(result.hits as ImageMeta[]);
              });
          }}
        />
      </header>
      <main className="container mx-auto mt-10">
        <div className="flex gap-4">
          {images.map((image) => (
            <Image key={image.id} image={image} />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;

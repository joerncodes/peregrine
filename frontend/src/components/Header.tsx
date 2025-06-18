import peregrineLogo from "../assets/peregrine.png";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";

export default function Header({
  loaded,
  uploading,
  setSearch,
  onUpload,
}: {
  loaded: boolean;
  uploading: boolean;
  setSearch: (search: string) => void;
  onUpload: (files: FileList) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(files);
      // Reset the input so the same file can be uploaded again
      event.target.value = '';
    }
  };

  return (
    <header className="flex flex-col lg:flex-row bg-peregrine-primary text-peregrine-text p-8 items-center gap-6 shadow-lg mb-8">
      <div className="justify-center lg:justify-start items-center gap-2 flex w-full lg:w-1/4">
        <img
          src={peregrineLogo}
          alt="Peregrine"
          className="w-16 h-16 drop-shadow-lg -rotate-2"
        />
        <h1 className="text-5xl font-limelight font-extrabold tracking-tight text-center text-peregrine-secondary">
          Peregrine
        </h1>
      </div>
      
      <div className="flex items-center gap-4 w-full lg:w-3/4">
        <Input
          type="text"
          placeholder="Search images..."
          className="flex-1 bg-white text-peregrine-primary-dark border-2 border-peregrine-primary focus:border-peregrine-highlight focus:ring-2 focus:ring-peregrine-highlight/50 rounded-sm px-4 py-2 transition-all"
          autoFocus
          disabled={!loaded || uploading}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        
        <Button
          onClick={handleUploadClick}
          disabled={!loaded || uploading}
          className="bg-peregrine-secondary hover:bg-peregrine-secondary/90 text-white border-2 px-4 py-2 transition-all flex items-center gap-2 font-semibold group"
          title="Upload images"
        >
          <UploadIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </header>
  );
}

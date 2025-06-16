import peregrineLogo from "../assets/peregrine.png";
import { Input } from "./ui/input";

export default function Header({
  loaded,
  uploading,
  setSearch,
}: {
  loaded: boolean;
  uploading: boolean;
  setSearch: (search: string) => void;
}) {
  return (
    <header className="flex flex-col lg:flex-row bg-gradient-to-r from-peregrine-primary to-peregrine-highlight text-peregrine-text p-8 items-center gap-6 shadow-lg rounded-b-2xl mb-8">
      <div className="justify-center lg:justify-start items-center gap-2 flex w-full lg:w-1/4">
        <img
          src={peregrineLogo}
          alt="Peregrine"
          className="w-16 h-16 drop-shadow-lg -rotate-2"
        />
        <h1 className="text-5xl font-limelight font-extrabold tracking-tight text-center ">
          Peregrine
        </h1>
      </div>
      <Input
        type="text"
        placeholder="Search images..."
        className="ml-auto lg:max-w-1/2 bg-white/80 text-peregrine-primary-dark border-2 border-peregrine-primary focus:border-peregrine-highlight focus:ring-2 focus:ring-peregrine-highlight/50 shadow-md rounded-xl px-4 py-2 transition-all"
        autoFocus
        disabled={!loaded || uploading}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </header>
  );
}

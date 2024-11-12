import { UrlShortner } from "./components/pages/UrlShortner";

function App() {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center">URL Shortner</h1>
        <UrlShortner />
      </div>
    </>
  );
}

export default App;

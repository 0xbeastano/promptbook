// FILE: src/App.tsx
import LibraryManager from "./components/LibraryManager";

export default function App() {
  return (
    <main className="popup-container relative flex flex-col overflow-hidden bg-[#09090b] font-sans">
      <LibraryManager />
    </main>
  );
}

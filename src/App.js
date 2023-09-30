import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { GlobalSearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <GlobalSearchProvider>
      <RouterProvider router={router} />
    </GlobalSearchProvider>
  );
}

export default App;

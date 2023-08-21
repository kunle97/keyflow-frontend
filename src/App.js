import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";


function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;

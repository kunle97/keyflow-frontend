import "./App.css";
import DashboardContainer from "./components/DashboardContainer";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { GlobalSearchProvider } from "./contexts/SearchContext";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";

function App() {
  return (
    <GlobalSearchProvider>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
      </Elements>
    </GlobalSearchProvider>
  );
}

export default App;

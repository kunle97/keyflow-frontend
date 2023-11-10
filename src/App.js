import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { GlobalSearchProvider } from "./contexts/SearchContext";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <GlobalSearchProvider>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
        </Elements>
      </GlobalSearchProvider>
    </AuthProvider>
  );
}

export default App;

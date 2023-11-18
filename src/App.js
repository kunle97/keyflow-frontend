import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { GlobalSearchProvider } from "./contexts/SearchContext";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";
import { AuthProvider } from "./contexts/AuthContext";
import { ParallaxProvider } from "react-scroll-parallax";
function App() {
  return (
    <AuthProvider>
      <GlobalSearchProvider>
        <ParallaxProvider>
          <Elements stripe={stripePromise}>
            <RouterProvider router={router} />
          </Elements>
        </ParallaxProvider>
      </GlobalSearchProvider>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import ReactGA from "react-ga4";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";

function App() {
  ReactGA.initialize([
    {
      trackingId: "G-Z7X45HF5K6",
    },
  ]);

  return (
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
      </Elements>
  );
}

export default App;

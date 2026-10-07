import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App/App";

import "./styles/index.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

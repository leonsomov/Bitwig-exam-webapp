import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BitwigCertApp from "./BitwigCertApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BitwigCertApp />
  </StrictMode>
);

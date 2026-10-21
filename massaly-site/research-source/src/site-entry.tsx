import { createRoot } from "react-dom/client";
import App from "./App";
const root = document.getElementById("research-interactive");
if (root) createRoot(root).render(<App />);

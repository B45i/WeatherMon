import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "./config/chalk.echart.ts";

dayjs.extend(relativeTime);

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

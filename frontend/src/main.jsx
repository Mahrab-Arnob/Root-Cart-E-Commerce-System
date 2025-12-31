import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SocketProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </SocketProvider>
  </BrowserRouter>
);
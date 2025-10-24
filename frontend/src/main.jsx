// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/theme-dark.css';
import './index.css';
import "./styles/profile-mini-cards.css";
import "./styles/movie-card.css";
//

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

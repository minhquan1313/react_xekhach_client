import App from "@/App";
import { UserProvider } from "@/Contexts/UserContext";
import "@/Styles/index.css";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ConfigProvider
          theme={{
            // algorithm: theme.darkAlgorithm,
            token: {
              fontFamily: "SVN-Poppins",
            },
          }}>
          <App />
        </ConfigProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import App from "@/App";
import { ApiProvider } from "@/Contexts/ApiContext";
import { UserProvider } from "@/Contexts/UserContext";
import "@/Styles/index.css";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ApiProvider>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                fontFamily: "SVN-Poppins",
              },
            }}>
            <App />
          </ConfigProvider>
        </ApiProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

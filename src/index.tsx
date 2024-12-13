import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";
import { App as AntdApp } from "antd";

function startApp() {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AntdApp>
          <Provider store={store}>
            <App />
          </Provider>
        </AntdApp>
      </BrowserRouter>
    </React.StrictMode>
  );
}

startApp();

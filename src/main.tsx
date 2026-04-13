
import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { store } from "./redux/store";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
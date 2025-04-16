import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react"; // Import ChakraProvider
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider> {/* Wrap your app with ChakraProvider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
);

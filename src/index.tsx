import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { Web3ReactProvider } from "@web3-react/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import connectors from "./connectors/index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider connectors={connectors as any}>
        <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <App />
        </SnackbarProvider>
      </Web3ReactProvider>
    </QueryClientProvider>
  </React.StrictMode>
);


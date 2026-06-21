import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppToastContainer } from "./components/AppToastContainer";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <AppToastContainer />
    </QueryClientProvider>
  </StrictMode>,
)

import type { JSX } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defaultToastOptions } from "../helpers/toast";

export function AppToastContainer(): JSX.Element {
  return (
    <ToastContainer
      position={defaultToastOptions.position}
      autoClose={defaultToastOptions.autoClose}
      pauseOnHover={defaultToastOptions.pauseOnHover}
      closeOnClick={defaultToastOptions.closeOnClick}
      draggable={defaultToastOptions.draggable}
      theme={defaultToastOptions.theme}
      newestOnTop
    />
  );
}

import { ThemeProvider } from "@mui/material/styles";
import Routes from "./router/Routes";
import { myTheme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function App() {
  const client = new QueryClient();

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={myTheme}>
            <Routes />

            {/* toaster */}
            <style>
              {`
        .myToast div {
          justify-content: left !important;
          font-size: 0.85rem !important;
        }
        `}
            </style>
            <Toaster
              containerClassName="toastContainer"
              position="top-right"
              toastOptions={{
                success: {
                  icon: null,
                  duration: 3000,
                  className:
                    "!bg-primary !rounded-md !min-w-[200px] !text-white !justify-left myToast",
                },
                error: {
                  icon: null,
                  duration: 3000,
                  className:
                    "!bg-red-500 !rounded-md !min-w-[200px] !text-white !justify-left myToast",
                },
              }}
            />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

import { ThemeProvider } from "@mui/material/styles";
import Routes from "./router/Routes";
import { myTheme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const client = new QueryClient();

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={myTheme}>
            <Routes />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

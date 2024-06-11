import { ThemeProvider } from "@mui/material/styles";
import Routes from "./router/Routes";
import { myTheme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={myTheme}>
          <Routes />
        </ThemeProvider>
      </Provider>
    </>
  );
}

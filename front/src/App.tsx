import polyglotI18nProvider from "ra-i18n-polyglot";
import {
  Admin,
  CustomRoutes,
  Resource,
  localStorageStore,
  useStore,
  StoreContextProvider,
} from "react-admin";

import authProvider from "./authProvider";
import { Dashboard } from "./dashboard";
import dataProviderFactory from "./dataProvider";
import englishMessages from "./i18n/en";
import { Layout, Login } from "./layout";
import { themes, ThemeName } from "./themes/themes";
import users from "./users";
import devices from "./devices";

const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fa") {
      return import("./i18n/fa").then((messages) => messages.default);
    }

    // Always fallback on english
    return englishMessages;
  },
  "en",
  [
    { locale: "en", name: "English" },
    // { locale: "fa", name: "فارسی" },
  ]
);

const store = localStorageStore(undefined, "web-panel");

const App = () => {
  const [themeName] = useStore<ThemeName>("themeName", "soft");
  const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;
  return (
    <Admin
      title=""
      dataProvider={dataProviderFactory(
        process.env.REACT_APP_DATA_PROVIDER || ""
      )}
      store={store}
      authProvider={authProvider}
      dashboard={Dashboard}
      loginPage={Login}
      layout={Layout}
      i18nProvider={i18nProvider}
      disableTelemetry
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
    >
      <Resource name="users" {...users} />
      <Resource name="devices" {...devices} />
    </Admin>
  );
};

const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <App />
  </StoreContextProvider>
);

export default AppWrapper;

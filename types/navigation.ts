export type RootStackParamList = {
  index: undefined;

  // Auth
  "(auth)": undefined;
  "login": undefined;
  "register": undefined;

  // Tabs
  "(tabs)": undefined;
  "favourites": undefined;
  "tracker": undefined;
  "tips": undefined;
  "profile": undefined;

  // Product Routes
  "product/[id]": { id: string };
};

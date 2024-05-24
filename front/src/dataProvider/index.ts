import { DataProvider } from "react-admin";
import fakeServerFactory from "../fakeServer";

export default (type: string) => {
  // The fake servers require to generate data, which can take some time.
  // Here we start the server initialization but we don't wait for it to finish
  let dataProviderPromise = getDataProvider(type);

  // Instead we return this proxy which may be called immediately by react-admin if the
  // user is already signed-in. In this case, we simply wait for the dataProvider promise
  // to complete before requesting it the data.
  // If the user isn't signed in, we already started the server initialization while they see
  // the login page. By the time they come back to the admin as a signed-in user,
  // the fake server will be initialized.
  const dataProviderWithGeneratedData = new Proxy(defaultDataProvider, {
    get(_, name) {
      return (resource: string, params: any) => {
        if (resource === "users") {
          const dp = {
            async getList() {
              return {
                data: [
                  {
                    id: 1,
                    name: "erfan",
                    username: "erfan",
                    createdAt: new Date(),
                  },
                  {
                    id: 2,
                    name: "hossein",
                    username: "hossein",
                    createdAt: new Date(),
                  },
                ],
                total: 2,
              };
            },
            async getOne() {
              return {
                data: {
                  id: 1,
                  name: "erfan",
                  username: "erfan",
                  createdAt: new Date(),
                },
              };
            },
            async getManyReference() {
              return {
                data: [
                  {
                    id: 1,
                    name: "erfan",
                    username: "erfan",
                    createdAt: new Date(),
                  },
                  {
                    id: 2,
                    name: "hossein",
                    username: "hossein",
                    createdAt: new Date(),
                  },
                ],
                total: 0,
              };
            },
            async getMany() {
              return await this.getManyReference();
            },
          };
          console.log(resource, name, params);
          return (dp as any)[name](resource, params);
        }
        if (resource === "devices") {
          const dp = {
            async getList() {
              return {
                data: [
                  {
                    id: 1,
                    name: "device 1",
                    owner: "erfan",
                    sensors: 3,
                    initialAt: new Date(),
                  },
                  {
                    id: 2,
                    name: "device 2",
                    owner: "erfan",
                    sensors: 1,
                    initialAt: new Date(),
                  },
                ],
                total: 2,
              };
            },
            async getOne() {
              return {
                data: {
                  id: 1,
                  name: "device 1",
                  owner: "erfan",
                  sensors: 3,
                  initialAt: new Date(),
                },
              };
            },
          };
          return (dp as any)[name](resource, params);
        }
        return dataProviderPromise.then((dataProvider) => {
          return dataProvider[name.toString()](resource, params);
        });
      };
    },
  });

  return dataProviderWithGeneratedData;
};

const getDataProvider = async (type: string): Promise<DataProvider> => {
  await fakeServerFactory(process.env.REACT_APP_DATA_PROVIDER || "");
  /**
   * This demo can work with either a fake REST server, or a fake GraphQL server.
   *
   * To avoid bundling both libraries, the dataProvider and fake server factories
   * use the import() function, so they are asynchronous.
   */
  if (type === "graphql") {
    return import("./graphql").then((factory) => factory.default());
  }
  return import("./rest").then((provider) => provider.default);
};

const defaultDataProvider: DataProvider = {
  // @ts-ignore
  create: () => Promise.resolve({ data: { id: 0 } }),
  // @ts-ignore
  delete: () => Promise.resolve({ data: {} }),
  deleteMany: () => Promise.resolve({}),
  getList: () => Promise.resolve({ data: [], total: 0 }),
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  // @ts-ignore
  getOne: () => Promise.resolve({ data: {} }),
  // @ts-ignore
  update: () => Promise.resolve({ data: {} }),
  updateMany: () => Promise.resolve({}),
};

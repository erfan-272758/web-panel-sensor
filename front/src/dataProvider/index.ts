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
                    created_at: new Date(),
                  },
                  {
                    id: 2,
                    name: "hossein",
                    username: "hossein",
                    created_at: new Date(),
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
                  created_at: new Date(),
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
                    created_at: new Date(),
                  },
                  {
                    id: 2,
                    name: "hossein",
                    username: "hossein",
                    created_at: new Date(),
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
                    created_at: new Date(),
                  },
                  {
                    id: 2,
                    name: "device 2",
                    owner: "erfan",
                    sensors: 1,
                    created_at: new Date(),
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
                  t_zone: "+3:30",
                  installation: {
                    lat: 53,
                    lon: -21,
                    operator_id: 125,
                    installation_time: new Date(),
                    cellular_no: 98999999,
                    cellular_operator: "MCI",
                    cert: true,
                  },
                  sensors: [
                    {
                      name: "sensor 1",
                      protocol: "mqtt",
                      port: 2750,
                      data_type: "integer",
                    },
                    {
                      name: "sensor 2",
                      protocol: "ws",
                      port: 2751,
                      data_type: "string",
                    },
                    {
                      name: "sensor 3",
                      protocol: "mqtt",
                      port: 2780,
                      data_type: "integer",
                    },
                  ],
                  created_at: new Date(),
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

const ENV = process.env.NODE_ENV;

const environments = {
  development: {
    API_URL: "http://localhost:8000/api",
  },
  production: {
    API_URL: "https://dirlux.com/programas/backendjsapp/api",
  },
};

const config =
  ENV === "production" ? environments.production : environments.development;

export default config;

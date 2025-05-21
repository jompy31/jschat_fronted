const ENV = process.env.NODE_ENV;

const environments = {
  development: {
    API_URL: "http://127.0.0.1:8000/api",
  },
  production: {
    API_URL: "http://127.0.0.1:8000/api",
  },
};

const config =
  ENV === "production" ? environments.production : environments.development;

export default config;

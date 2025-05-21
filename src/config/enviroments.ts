const ENV = process.env.NODE_ENV;

const environments = {
  development: {
    API_URL: "https://abcupon.com/api",
  },
  production: {
    API_URL: "https://abcupon.com/api",
  },
};

const config =
  ENV === "production" ? environments.production : environments.development;

export default config;

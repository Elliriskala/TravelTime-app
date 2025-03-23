module.exports = {
  apps: [
    {
      name: "authentication",
      script: "./auth-server/dist/index.js",
      args: "start",
      watch: true,
      env: {
        PORT: 3001,
        NODE_ENV: "production",
      },
    },
    {
      name: "postapi",
      script: "./travelpost-api/dist/index.js",
      args: "start",
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
    {
      name: "upload",
      script: "./upload-server/dist/index.js",
      args: "start",
      watch: true,
      env: {
        PORT: 3002,
        NODE_ENV: "production",
      },
    },
  ],
};

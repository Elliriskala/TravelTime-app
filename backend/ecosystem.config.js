module.exports = {
    apps: [
      {
        name: "auth-server",
        script: "npm",
        args: "start",
        cwd: "./auth-server",
        env: {
          PORT: 3001,
          NODE_ENV: "production"
        }
      },
      {
        name: "travelpost-api",
        script: "npm",
        args: "start",
        cwd: "./travelpost-api",
        env: {
          PORT: 3000,
          NODE_ENV: "production"
        }
      },
      {
        name: "upload-server",
        script: "npm",
        args: "start",
        cwd: "./upload-server",
        env: {
          PORT: 3002,
          NODE_ENV: "production"
        }
      }
    ]
  };
  
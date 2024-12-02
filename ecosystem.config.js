module.exports = {
  apps: [
    {
      name: 'slowboat-api',
      exec_mode: 'cluster',
      instances: 'max',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

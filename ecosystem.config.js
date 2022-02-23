module.exports = {
  apps: [
    {
      name: 'footyamigo',
      script: './server.js',
     
      env: {
        PORT: 3000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
  
      args: "start"
    }
  ]
}

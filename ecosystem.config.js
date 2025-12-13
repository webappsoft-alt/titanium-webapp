module.exports = {
  apps: [
    {
      name: "website",
      script: "npm",
      args: "start",
      cwd: "/var/www/titanium-next",
      env: {
        NODE_ENV: "production",
        PORT: 3177
      },
      watch: false,          // 🔥 MUST BE FALSE
      autorestart: true,
      max_restarts: 5,
      kill_timeout: 5000
    }
  ]
};

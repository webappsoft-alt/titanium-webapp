module.exports = {
  apps: [
    {
      name: "website",
      cwd: "/var/www/titanium-webapp",
      script: "npm",
      args: "start",
      exec_mode: "fork",   // 🔥 MUST be fork
      instances: 1,        // 🔥 MUST be 1
      env: {
        NODE_ENV: "production",
        PORT: 3177
      },
      watch: false,
      autorestart: true,
      max_restarts: 3,
      kill_timeout: 5000
    }
  ]
};

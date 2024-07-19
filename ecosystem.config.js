module.exports = {
  apps: [
    {
      name: 'RosalinaBot',
      script: 'index.js',
      watch: ['./resources/reboot'], // Specify the folder to watch
      ignore_watch: ['node_modules', 'logs', 'config'], // Specify the folder to ignore
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
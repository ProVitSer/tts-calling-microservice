/* eslint-disable prettier/prettier */
module.exports = {
    apps : [{
      name: 'tts-calling',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false
    }],
}
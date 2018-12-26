const fs = require("fs");
const shelljs = require('shelljs');

module.exports.setPort = (port, cb) => {
  let conf = "server {listen 80;listen [::]:80;location / {proxy_pass http://127.0.0.1:" + port + ";proxy_http_version 1.1;proxy_set_header Upgrade $http_upgrade;proxy_set_header Connection 'upgrade';proxy_set_header Host $host;proxy_set_header X-Real-IP $remote_addr;proxy_set_header X-Fowarded-For $proxy_add_x_forwarded_for;proxy_set_header X-Fowarded-Proto $scheme;proxy_cache_bypass $http_upgrade;}}";
  fs.writeFile('/etc/nginx/sites-enabled/default', conf, err => {
    if (err) return cb(err);
    shelljs.exec('service nginx reload', () => {
      return cb(null);
    });
  });
}

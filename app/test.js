const https = require('https');

let data = JSON.stringify({a: 1, name: 'Joe'});

let req = https.request({
  hostname: 'echoof.me',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Length': data.length,
    'Content-type': 'application/json'
  }
}, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });

  resp.on('end', () => {
    console.log(data);
  });
});

req.write(data);
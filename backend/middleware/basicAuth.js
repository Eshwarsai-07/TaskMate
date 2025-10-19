// middleware/basicAuth.js
const basicAuth = require('basic-auth');

const user = process.env.BASIC_AUTH_USER || 'admin';
const pass = process.env.BASIC_AUTH_PASS || 'password123';

module.exports = (req, res, next) => {
  const credentials = basicAuth(req);
  if (!credentials || credentials.name !== user || credentials.pass !== pass) {
    res.set('WWW-Authenticate', 'Basic realm="Task Manager"');
    return res.status(401).json({ error: 'Unauthorized access. Please provide valid credentials.' });
  }
  next();
};

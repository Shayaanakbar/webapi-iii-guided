const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const logger = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// GLOBAL MIDDLEWARE

// built in  middleware
server.use(express.json());

// third party middleware
server.use(helmet());
server.use(logger('dev'));

// custom middleware
server.use(typeLogger);
server.use(addName);
// server.use(lockout);
// server.use(moodyGatekeeper);

// router
server.use('/api/hubs', hubsRouter);

// this is custom middleware too but doesnt require next
server.get('/', (req, res, next) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// custom middleware

function typeLogger(req, res, next) {
  console.log (`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || "Shayaan";
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: 'API lockout!'}
  );
}

function moodyGatekeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json({ message: "you shall not pass!"});
  } else {
    next();
  }
}



module.exports = server;

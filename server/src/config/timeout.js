import timeout from 'connect-timeout';

// configure timeout for all requests
const setupTimeout = timeout('5s');

// timeout handler
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

export { setupTimeout, haltOnTimedout };

'use strict';

const logger = (req, res, next) => {
  const date = new Date ();
  console.log(`${date.toLocaleDateString()} ${req.method} ${req.url}`);
  next();
};

module.exports = logger;
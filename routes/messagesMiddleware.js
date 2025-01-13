const { allMessages } = require("../controllers/renderInformation");

async function messagesMiddleware(req, res, next) {
  res.locals.allMessages = await allMessages();
  next();
}

module.exports = messagesMiddleware;

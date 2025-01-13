const database = require("../config/database");

async function allMessages() {
  const { rows } = await database.query(
    "SELECT users.user_id, username, membership_status, title, timestamp, message_text, message_id FROM users INNER JOIN messages ON users.user_id = messages.user_id;"
  );
  return rows;
}

module.exports = { allMessages };

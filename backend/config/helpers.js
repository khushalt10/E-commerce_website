const MySqli = require('mysqli');

let conn = new MySqli({
  host: 'localhost',
  post: '3306',
  user: 'mega_user',
  passwd: '123456',
  db: 'mega-shop'
});

let db = conn.emit(false,'');

module.exports = {
  database: db
};

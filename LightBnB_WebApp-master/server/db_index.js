const { Pool } = require('pg');

const pool = new Pool({
  username: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
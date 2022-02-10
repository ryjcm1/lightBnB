const properties = require('./json/properties.json');
const users = require('./json/users.json');
const db = require('./db_index');

// const { Pool } = require('pg');

// const pool = new Pool({
//   username: 'labber',
//   password: 'labber',
//   host: 'localhost',
//   database: 'lightbnb'
// })


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  return db
    .query(`SELECT * FROM users
    WHERE email = $1;
    `, [email])
    .then((res) => res.rowCount > 0 ? res.rows[0] : null)
    .catch((err) => {
      console.log(err.message);
    });



}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  return db
    .query(`SELECT * FROM users
    WHERE id = $1;`, [id])
    .then(res => res.rowCount > 0  ? res.rows[0] : null)
    .catch(err => {
      console.log(err.message)
    })

  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {


  const values = [user.name, user.email, user.password];

  return db
   .query(`INSERT INTO users(name, email, password)
   VALUES ($1, $2, $3)
   RETURNING *;`, values)
   .then(res => res.rowCount > 0 ? res.rows[0] : null)
   .catch(err => {
     console.log(err.message)
   })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  let values = [guest_id, limit];

  return db.query(`SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`
  , values)
    .then(res => res.rowCount > 0 ? res.rows : null)
    .catch(err => console.log(err.message))


}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // let conjunction = !queryParams.length ? 'WHERE' : 'AND';

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.owner_id);
    queryString += ` properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.minimum_price_per_night*100);
    queryString += ` properties.cost_per_night >= $${queryParams.length} `;
  
  } 

  if (options.maximum_price_per_night) {
    queryString += `${!queryParams.length ? 'WHERE' : 'AND'}`;
    queryParams.push(options.maximum_price_per_night*100);
    queryString += ` properties.cost_per_night < $${queryParams.length} `;
  }
  
  
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return db.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const queryString = `INSERT 
  INTO properties (owner_id, title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code,  active)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  RETURNING *;`;

  values = [
    property.owner_id,
    property.title,
    property.description,
    property.number_of_bedrooms,
    property.number_of_bathrooms,
    property.parking_spaces,
    property.cost_per_night*100,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.street,
    property.country,
    property.city,
    property.province,
    property.post_code,
    true
  ];
  
  return db.query(queryString, values)
  .then(res => res.rows[0])
  .catch(err => console.log(err.message))

}
exports.addProperty = addProperty;

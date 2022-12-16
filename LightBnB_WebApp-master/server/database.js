const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
/// Users
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool.
  query(`SELECT * FROM users WHERE email = $1;`, [email])
  .then(result => {
    if(!result.rows[0]) return null;
    return result.rows[0];
  })
  .catch(err => console.log(err));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.
  query(`SELECT * FROM users WHERE id = $1`,[id])
  .then(result => {
    if(!result.rows[0]) return null;
    return result.rows[0];
  })
  .catch(err => console.log(err));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.email, user.password];
  return pool.
  query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
  .then (result => result.rows[0])
  .catch(err => console.log(err));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
  .query(`SELECT reservations.*, properties.title, properties.cost_per_night, properties.thumbnail_photo_url, properties.cover_photo_url, avg(rating) as average_rating
  FROM properties
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2;
  `, [guest_id, limit])
  .then(result => {
    console.log(result);
    return result.rows;
  })
  .catch(err => console.log(err));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  let queryParams = [];
  let queryString = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id`;

  for (const key in options) {
    if (options[key]) {
      
      if (!queryString.includes("WHERE")) {
        //add in WHERE clause if options is not empty, and WHERE is not in query yet
        queryString += " WHERE";
      } else if (key === "minimum_rating") { 
        //if options contains a range for rating, we need to use HAVING, and GROUP BY must come before that
        queryString += " GROUP BY properties.id HAVING";
      } else {
        // other cases, we add AND to add the new condition after the WHERE clause has been added
        queryString += " AND";
      }

      //different key will have a different query as condition
      switch(key) {
        case "city":
          queryParams.push(`%${options.city}`);
          queryString += ` city LIKE $${queryParams.length}`;
          break;
        case "owner_id":
          queryParams.push(`${options.owner_id}`);
          queryString += ` owner_id = $${queryParams.length}`;
          break;
        case "minimum_price_per_night":
          queryParams.push(`${options.minimum_price_per_night}`);
          queryString += ` cost_per_night >= $${queryParams.length}`;
          break;
        case "maximum_price_per_night":
          queryParams.push(`${options.maximum_price_per_night}`);
          queryString += ` cost_per_night <= $${queryParams.length}`;
          break;
        case "minimum_rating":
          queryParams.push(`${options.minimum_rating}`);
          queryString += ` avg(property_reviews.rating) >= $${queryParams.length}`;
          break;
      }
    }
  }
  // if we don't have rating in options, we need to add in the group by query
  if(!options.minimum_rating) queryString += " GROUP BY properties.id";

  queryParams.push(`${limit}`);
  queryString += ` ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;

  //returning promise object
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];

  return pool.
  query(queryString, queryParams)
  .then(result => result.rows[0])
  .catch(err => console.log(err));
}
exports.addProperty = addProperty;

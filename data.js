// In-memory data store (replace with a database in production)
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

// Sample user data (replace with a real database)
const users = [
  { id: 1, username: 'user1', password: '$2b$10$kgix/7wKMGMmqJYixdfvfugaj5W/iHKcjArX2H76DVIZmQzXr7/hJ' }, // Hashed password: "password1"
  { id: 2, username: 'user2', password: '$2b$10$kgix/7wKMGMmqJYixdfvfugaj5W/iHKcjArX2H76DVIZmQzXr7/hJ' }, // Hashed password: "password2"
  { id: 3, username: 'jonathan@test.com', password: '$2b$10$bubWeQbJxCKtiPQVzhRJDOsqZWFIwC.Xv4RBVgPTgH5NEAkiq2Xk2' }, // Hashed password: "1234566"
];

var findById = function(collection, _id, cb){
  var coll = collection.slice( 0 ); // create a clone

  (function _loop( data ) {
      if( data._id === _id ) {
          cb.apply( null, [ data ] );
      }
      else if( coll.length ) {
          setTimeout( _loop.bind( null, coll.shift() ), 25 );
      }
  }( coll.shift() ));
};

module.exports = {
  items,
  users,
  findById
};
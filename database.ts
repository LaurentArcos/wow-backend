// import mysql from 'mysql2';

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'wow'
// });

// connection.connect(error => {
//   if (error) throw error;
//   console.log("  🔗 Connected to the database.");
// });

// export default connection;


 import mysql from 'mysql2';

 const connection = mysql.createConnection({
   host: 'localhost',
   user: 'thryndil',
   password: 'DeepiKaynaat17!',
   database: 'wow'
 });

 connection.connect(error => {
   if (error) throw error;
   console.log("  🔗 Connected to the database.");
 });

 export default connection;

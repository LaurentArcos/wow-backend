import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wow'
});

connection.connect(error => {
  if (error) throw error;
  console.log("  🔗 Connected to the database.");
});

export default connection;

// import mysql from 'mysql2';
// import dotenv from 'dotenv';

// dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// connection.connect(error => {
//   if (error) {
//     console.error("❌ Database connection failed:", error);
//     throw error;
//   }
//   console.log("✅ Connected to the database.");
// });

// export default connection;
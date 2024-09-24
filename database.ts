 import mysql from 'mysql2';

 const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wow',
 });

 connection.connect(error => {
   if (error) throw error;
   console.log("  🔗 Connected to the database.");
 });

 export default connection;

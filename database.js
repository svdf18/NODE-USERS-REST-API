import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  database: "users_db",
  password: "databases",
  multipleStatements: true
});

export default connection;

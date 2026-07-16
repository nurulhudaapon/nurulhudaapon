import mysql from "mysql";

export function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "db",
    insecureAuth: true,
    port: 13306,
    multipleStatements: true,
  });
}

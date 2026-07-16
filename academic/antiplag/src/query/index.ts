import fs from "fs";
import { QueryNames } from "./index.type";
import { getConnection } from "./db";

const queryStr = fs.readFileSync("./src/query/query.sql").toString();

const queries = queryStr
  .split("-- ")
  .map((query) => query.trim())
  .filter(Boolean)
  .map((query) => "-- " + query);

export function getQuery(queryName: QueryNames) {
  const query = queries.find((query) =>
    query.startsWith("-- " + queryName + ":")
  );
  if (!query) throw new Error("Query not found with the name: " + queryName);

  return query;
}

const generateIndexTypeFile = () => {
  const queryNames = queries.map(
    (query) => query.split("-- ")[1].split(":")[0]
  );

  const file = `export type QueryNames = '${queryNames.join("' | '")}';`;
  fs.writeFileSync("./src/query/index.type.ts", file);
};

generateIndexTypeFile();

export function executeQuery<DataTypeT>(
  queryName: QueryNames,
  variables: object | any[] | undefined = []
): Promise<DataTypeT> {
  const connection = getConnection();

  const queryVariables =
    variables instanceof Array ? variables : Object.values(variables);

  return new Promise<DataTypeT>((resolve, reject) => {
    connection.query(getQuery(queryName), queryVariables, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

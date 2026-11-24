const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Hosted databases (Render, Neon, Supabase) need SSL; a local one usually does not.
const useSsl = process.env.DATABASE_SSL
  ? process.env.DATABASE_SSL === "true"
  : process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

// Create the table if missing and insert the seed records only when it is empty.
async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM records");
  if (rows[0].n === 0) {
    const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");
    await pool.query(seed);
    console.log("Seed records inserted.");
  }
}

module.exports = pool;
module.exports.initDb = initDb;

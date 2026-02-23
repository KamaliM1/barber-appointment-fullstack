const { Pool } = require ('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,                  // the maximum number of connections
    idleTimeoutMillis: 30000, // closes idle connections after 30s
    connectionTimeoutMillis: 10000, // return error after 10s if theres a problem connecting
});

// Test the connection
pool.on('connect', () => {
    console.log('Database connected successfully');   // successful database connection
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err); // unsuccessful database connection
    process.exit(-1);
});

// Helper function to query the database
const query = async (text, params) => {
    const start = Date.now();   // records current timestamp in milliseconds
    try {
        const res = await pool.query(text, params); // executes the database query
        const duration = Date.now() - start; // calculates how long query takes
        console.log('Expected query', {text, duration, rows: res.rowCount});  // logs query info
        return res;  // returns query result
    } catch (error) {  // handles errors if the query fails
        console.error('Database query error.', error);
        throw error;
    }
};

// Helper function to get a client from the pool for transactions
const getClient = async () => {
    const client = await pool.connect(); // checks a connection from the pool
    const query = client.query.bind(client);
    const release = client.release.bind(client);

    // Set a timeout to release connection
    const timeout = setTimeout (() => {
        console.error ('A client has been checked out for more than 5 seconds!')

    }, 5000);

    client.release = () => {  // overrides the release() method so it can cancel the timeout
        clearTimeout(timeout);
        client.release();
    };
    
    return {query, release}; // returns object with query and release methods
};

module.exports = { // exports these so that other files can use them if necessary
    pool,
    query,
    getClient
};
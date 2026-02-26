// load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require ('cors');

// import database connection
const { pool } = require('./config/database');

// initialize Express app
const app = express();

// get port from environment or use default
const PORT = process.env.PORT || 5000;

// -----------
// MIDDLEWARE
// -----------

// parse JSON request bodies
app.use(express.json());

// parse URL-encoded bodies
app.use(express.urlencoded({ extended: true}));

// enable CORS (handles cross-origin requests for future development)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://my-frontend-domain.com' // change in the future
        : 'http://localhost:3000',         // reacts default port
        credentials: true 
}));

// request logging middleware (captures and records details about incoming HTTP requests)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

//----------
// ROUTES
//----------

// health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// api root endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Barber Appointment API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            appointments: '/api/appointments',
            availability: '/api/avaialability'
        }
    });
});

// test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({
            success: true,
            message: 'Database connection successful',
            timestamp: result.rows[0].current_time
        });
    } catch (error){
        console.error('Database test failed:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// import route modules
const appointmentRoutes = require('./routes/appointments');
const availabilityRoutes = require('./routes/availability');
const { getAvailability } = require('./controllers/availabilityController');

// use route modules
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);


// ---------------
// ERROR HANDLING
// ---------------

// import error handler
const errorHandler = require('./middleware/errorHandler');

// 404 handler - has to be after all the other routes
app.use((req, res) => {
    res.status(404).json ({
        error: 'Not found',
        message: `Cannot ${req.method} ${req.path}`,
        availableEndpoints: ['/health', '/api', 'api/test-db']
    });
});

// global error handler - has to be last
app.use(errorHandler);

// -------------
// START SERVER
// -------------
const startServer = async () => {
    try{
        // test database connection before starting server
        await pool.query('SELECT NOW()');
        console.log('Database connection verified');

        //start listening (server actively accepts and processes incoming HTTP requests)
        app.listen(PORT, () => {
            console.log('');
            console.log('==================================================');
            console.log('Barber Appointment API Server');
            console.log('==================================================');
            console.log(` Environment: ${process.env.NODE_ENV}`);
            console.log(` Port: ${PORT}`);
            console.log(` Database: ${process.env.DB_NAME}`);
            console.log('');
            console.log(` Endpoints:`);
            console.log(`   Health check: http://localhost:${PORT}/healh`);
            console.log(`   API info:     http://localhost:${PORT}/api`);
            console.log(`   Test DB:      http://localhost:${PORT}/api/test-db`);
            console.log('===================================================');
            console.log('');
        });
    } catch {
        console.error('Failed to start server: ', error);
        process.exit(1);
    }
};

// handles shutdown gracefully
process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await pool.end();
    console.log('Database connections closed');
    process.exit(0);
});


process.on('SIGTERM', async () => {
    console.log('\nShutting down...');
    await pool.end();
    console.log('Database connections closed');
    process.exit(0);
});

// start the server
startServer();

// export app for testing
module.exports = app;
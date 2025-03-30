const logApi = (db) => {
    return (req, res, next) => {
      const user = req.user ? req.user.email : 'Unauthenticated'; // Log the email if authenticated
      const method = req.method;
      const endpoint = req.originalUrl;
      const timestamp = new Date().toISOString();
  
      // Log the request to the console or store it in a database
      console.log(`[${timestamp}] ${method} ${endpoint} - User: ${user}`);
  
      // Optionally store in a database for persistent logging
      db.logApiRequest({ user, method, endpoint, timestamp })
        .catch((error) => console.error('Error logging API request:', error));
  
      next();
    };
  };
  
  module.exports = { logApi };
  
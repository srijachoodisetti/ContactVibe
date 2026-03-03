// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express application
const app = express();

// Set the port number (default to 3000 if not specified in environment)
const PORT = process.env.PORT || 3000;

// Configure EJS as the templating engine
// This allows us to use .ejs files to render dynamic HTML
app.set('view engine', 'ejs');

// Set the directory where our EJS templates are located
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded data from form submissions
// extended: true allows for rich objects and arrays to be encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data (useful for API requests)
app.use(bodyParser.json());

// Serve static files from the 'public' directory
// This allows us to serve CSS, JavaScript, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Route: GET /
// Purpose: Render the homepage with the contact form
app.get('/', (req, res) => {
  // Render the index.ejs template
  res.render('index', {
    title: 'Contact Form'
  });
});

// Route: POST /submit
// Purpose: Handle form submission and display the results
app.post('/submit', (req, res) => {
  // Extract form data from the request body
  const { name, email, message } = req.body;

  // Basic validation to ensure all fields are filled
  if (!name || !email || !message) {
    // If any field is missing, send back an error
    return res.status(400).render('index', {
      title: 'Contact Form',
      error: 'All fields are required. Please fill out the entire form.'
    });
  }

  // Create a submission object with the form data
  const submission = {
    name: name,
    email: email,
    message: message,
    timestamp: new Date().toLocaleString()
  };

  // Render the result page with the submitted data
  res.render('result', {
    title: 'Submission Successful',
    submission: submission
  });
});

// Route: GET /submit
// Purpose: Redirect GET requests to the home page
// This prevents users from accessing /submit directly via browser URL
app.get('/submit', (req, res) => {
  res.redirect('/');
});

// 404 Error Handler
// This catches any requests to routes that don't exist
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});

// Export the app for testing purposes (optional)
module.exports = app;

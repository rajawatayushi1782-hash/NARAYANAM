const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Clean page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/apartments', (req, res) => {
  res.sendFile(path.join(__dirname, 'apartments.html'));
});

// Dynamic apartment detail pages for all 25 residences (011 - 224)
app.get('/apartments/:slug', (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, 'apartments_pages', `${slug}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.redirect('/apartments');
  }
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// API endpoints for interactive form handling
app.post(['/api/book-call', '/api/contact', '/contact'], (req, res) => {
  console.log('[Form Submission Received]:', req.body);
  res.json({
    success: true,
    message: "Thank you. Our sales manager will review your message and respond personally."
  });
});

// Fallback for any other HTML request
app.use((req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
  } else {
    next();
  }
});

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`ERA Residence Replica running at: http://localhost:${PORT}`);
  console.log(`- Home:        http://localhost:${PORT}/`);
  console.log(`- Apartments:  http://localhost:${PORT}/apartments`);
  console.log(`- Contact:     http://localhost:${PORT}/contact`);
  console.log(`==================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Error]: Port ${PORT} is already in use by another process.`);
    console.error(`You can free it by running: npx kill-port ${PORT}`);
    console.error(`Or run on another port: $env:PORT="${Number(PORT) + 1}"; npm start\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

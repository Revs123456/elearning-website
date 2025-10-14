const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static('.'));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server');
});

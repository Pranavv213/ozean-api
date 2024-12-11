
const express = require('express');


const app = express();


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get('/api/data', (req, res) => {
  const data = { message: 'This is a simple API response' };
  res.json(data);
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

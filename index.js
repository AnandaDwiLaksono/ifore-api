const express = require('express');

const PORT = process.env.PORT || 3002;

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

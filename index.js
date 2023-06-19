const express = require('express');

const userRouter = require('./routers/user.router');
const categoryRouter = require('./routers/category.router');

const PORT = process.env.PORT || 3002;

const app = express();

app.use(userRouter);
app.use(categoryRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

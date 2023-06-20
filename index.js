const express = require('express');

const userRouter = require('./routers/user.router');
const categoryRouter = require('./routers/category.router');
const paymentRouter = require('./routers/payment.router');
const inventoryRouter = require('./routers/inventory.router');
const transactionRouter = require('./routers/transaction.router');

const PORT = process.env.PORT || 3002;

const app = express();

app.use(userRouter);
app.use(categoryRouter);
app.use(paymentRouter);
app.use(inventoryRouter);
app.use(transactionRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

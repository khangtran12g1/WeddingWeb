const { PORT, BASE_URL } = require('./link');
const express = require('express');
const cors = require('cors');
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const userHeader = require('./routes/User/header')
const userHome = require('./routes/User/home')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/userHeader', userHeader);
app.use('/userHome', userHome);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại ${BASE_URL}`);
});
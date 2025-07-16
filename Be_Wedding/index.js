const { PORT, BASE_URL } = require('./link');
const express = require('express');
const cors = require('cors');
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const userHeader = require('./routes/User/header')
const userHome = require('./routes/User/home')
const userProduct = require('./routes/User/product')
const userProductDetail = require('./routes/User/productDetail')
const Order = require('./routes/order')
const About = require('./routes/about')
const vnpayRouter = require('./routes/vnpay');
const albumImage = require('./routes/albumImage');
const auth = require('./routes/auth');
const homeUser = require('./routes/HomeUser');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/userHeader', userHeader);
app.use('/userHome', userHome);
app.use('/userProduct', userProduct);
app.use('/userProductDetail', userProductDetail);
app.use('/Order', Order);
app.use('/About', About);
app.use('/vnpay', vnpayRouter);
app.use('/album', albumImage);
app.use('/auth', auth);
app.use('/homeUser', homeUser);



// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại ${BASE_URL}`);
});
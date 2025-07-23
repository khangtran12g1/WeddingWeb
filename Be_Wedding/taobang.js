const connectDB = require('./db');

const schema = `
  DROP TABLE IF EXISTS product_images;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS packages;
  DROP TABLE IF EXISTS subcategories;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS order_details;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS about;
  DROP TABLE IF EXISTS gallery;
  DROP TABLE IF EXISTS gallery_images;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS gioi_thieu;
  DROP TABLE IF EXISTS ly_do;
  DROP TABLE IF EXISTS video;

  CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE subcategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subcategory_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
  );

  CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subcategory_id INT NOT NULL,
    package_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price DECIMAL(10, 2),
    type ENUM('single', 'combo') NOT NULL DEFAULT 'single',
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
  );

  CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  wedding_date DATE,
  note TEXT,
  total_price INT NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  CREATE TABLE order_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price INT NOT NULL,
  quantity INT NOT NULL,
  total INT NOT NULL,
  product_image VARCHAR(500),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE

  CREATE TABLE about (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
CREATE TABLE gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gallery_id INT,
  image_url TEXT NOT NULL,
  FOREIGN KEY (gallery_id) REFERENCES gallery(id) ON DELETE CASCADE
);
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  birthday DATE,
  phone VARCHAR(20),
  role ENUM('admin', 'manager', 'staff') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gioi_thieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE ly_do (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    mo_ta TEXT NOT NULL,
    icon_url VARCHAR(255)
);

CREATE TABLE video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mo_ta TEXT NOT NULL,
    video_url VARCHAR(255)
);

`;

async function initDatabase() {
  const connection = await connectDB();

  try {
    await connection.query(schema);
    console.log('✅ Database tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    await connection.end();
  }
}

initDatabase();

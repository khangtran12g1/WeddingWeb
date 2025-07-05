const connectDB = require('./db');

const schema = `
  DROP TABLE IF EXISTS product_images;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS packages;
  DROP TABLE IF EXISTS subcategories;
  DROP TABLE IF EXISTS categories;

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

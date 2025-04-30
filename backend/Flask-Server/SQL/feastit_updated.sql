-- Drop and recreate the database
DROP DATABASE IF EXISTS feastit;
CREATE DATABASE feastit;
USE feastit;

-- Customers Table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL UNIQUE,
    customer_password VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(15),
    customer_address TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE admin_user (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    admin_role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors Table
CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_email VARCHAR(255) NOT NULL UNIQUE,
    vendor_phone VARCHAR(15),
    vendor_password VARCHAR(255) NOT NULL,
    vendor_description TEXT,
    vendor_taxId VARCHAR(50),
    vendor_address TEXT,
    vendor_status VARCHAR(20) DEFAULT 'pending',
    vendor_rejectedmessage TEXT,
    business_hours VARCHAR(100),
    registration_cert VARCHAR(255),
    supporting_docs VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE menu_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10,2),
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    customer_id INT,
    total_amount DECIMAL(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status ENUM('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    item_id INT,
    quantity INT,
    item_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE SET NULL
);

-- Customer Reviews Table
CREATE TABLE customer_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    vendor_id INT,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1.0 AND 5.0),
    comments TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);

-- Order Status History Table
CREATE TABLE order_status_history (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    status ENUM('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled') NOT NULL,
    status_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Vendor Review Queue Table
CREATE TABLE vendor_review_queue (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    reviewed_by INT,
    status ENUM('approved', 'rejected', 'pending') DEFAULT 'pending',
    reason TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (reviewed_by) REFERENCES admin_user(admin_id)
);

-- Customer Feedback Reports Table
CREATE TABLE customer_feedback_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    message TEXT,
    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (admin_id) REFERENCES admin_user(admin_id)
);

-- Vendor Feedback Reports Table
CREATE TABLE vendor_feedback_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    message TEXT,
    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (admin_id) REFERENCES admin_user(admin_id)
);

-- Analytics Summary Table
CREATE TABLE analytics_summary (
    date DATE PRIMARY KEY,
    total_orders INT DEFAULT 0,
    total_customers INT DEFAULT 0,
    total_vendors INT DEFAULT 0,
    active_offers INT DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00
);
------INSERTS
---Customer

INSERT INTO customers (customer_name, customer_email, customer_password, customer_phone, customer_address) VALUES
('Emily Carter', 'emily.carter@example.com', 'password123', '5551234567', '123 Maple Street, Springfield'),
('Liam Johnson', 'liam.johnson@example.com', 'securepass', '5552345678', '456 Oak Avenue, Lakeside'),
('Sophia Williams', 'sophia.williams@example.com', 'sophia@123', '5553456789', '789 Pine Road, Brookfield'),
('Noah Davis', 'noah.davis@example.com', 'ndavispass', '5554567890', '321 Birch Lane, Riverdale'),
('Ava Brown', 'ava.brown@example.com', 'ava2024', '5555678901', '654 Cedar Street, Greenfield'),
('Olivia Martin', 'olivia.martin@example.com', 'oliviapass', '5556789012', '87 Maple St, Hilltown'),
('Ethan Moore', 'ethan.moore@example.com', 'ethansecure', '5557890123', '22 Elm Ave, Stonebridge'),
('Mia Clark', 'mia.clark@example.com', 'miapass99', '5558901234', '99 Cherry Blvd, Ridgeway'),
('James Lewis', 'james.lewis@example.com', 'jameskey', '5559012345', '71 Forest Dr, Lakeview'),
('Isabella Walker', 'isabella.walker@example.com', 'isapass', '5550123456', '33 Garden Ln, Meadowbrook');


-- Admin Users
INSERT INTO admin_user (admin_name, admin_email, admin_password, admin_role) VALUES
('Sara Thompson', 'sara.thompson@feastit.com', 'adminpass1', 'super_admin'),
('John Reyes', 'john.reyes@feastit.com', 'adminpass2', 'moderator');



------INSERTS OF VENDOR DETAILS
INSERT INTO vendors (
    business_name, vendor_name, vendor_email, vendor_phone, vendor_password,
    vendor_description, vendor_taxId, vendor_address, business_hours,
    vendor_status, registration_cert, supporting_docs
) VALUES
('Frozen Delights', 'Sarah Williams', 'frozendelights@gmail.com', '(214) 555-1001', 'defaultpass1', 'Vegan and non-dairy frozen desserts.', 'GST001', '500 Ice Cream Blvd, Dallas, TX', '10 AM - 10 PM', 'approved', NULL, NULL),
('Burger Delight', 'Michael Johnson', 'burgerdelight@gmail.com', '(214) 555-1002', 'defaultpass2', 'Healthy and gourmet burger options.', 'GST002', '1201 Burger St, Dallas, TX', '10 AM - 10 PM', 'approved', NULL, NULL),
('Fresh Pressed Juices', 'Emma Roberts', 'freshjuices@gmail.com', '(469) 555-2003', 'defaultpass3', 'Organic, cold-pressed juices.', 'GST003', '450 Juice Ave, Dallas, TX', '8 AM - 10 PM', 'approved', NULL, NULL),
('Lunch Box Bowls', 'David Smith', 'lunchboxbowls@gmail.com', '(214) 555-3004', 'defaultpass4', 'Nutritious and customizable rice bowls.', 'GST004', '789 Healthy St, Dallas, TX', '11 AM - 10 PM', 'approved', NULL, NULL),
('Seoul Kitchen', 'Kevin Park', 'seoulkitchen@gmail.com', '(469) 555-5005', 'defaultpass5', 'Authentic Korean street food.', 'GST005', '102 Bibimbap Ln, Dallas, TX', '11 AM - 11 PM', 'approved', NULL, NULL),
('Arabian Bites', 'Layla Ahmed', 'arabianbites@gmail.com', '(214) 555-6006', 'defaultpass6', 'Traditional Middle Eastern cuisine.', 'GST006', '305 Shawarma Rd, Dallas, TX', '12 PM - 10 PM', 'approved', NULL, NULL),
('Thai Street Bites', 'Somchai Wong', 'thaistreetbites@gmail.com', '(469) 555-7007', 'defaultpass7', 'Authentic Thai flavors in street-style dishes.', 'GST007', '987 Pad Thai Blvd, Dallas, TX', '11 AM - 10 PM', 'approved', NULL, NULL),
('Classic Italian Pasta', 'Antonio Rossi', 'classicitalianpasta@gmail.com', '(469) 555-8008', 'defaultpass8', 'Handmade pasta with authentic Italian flavors.', 'GST008', '215 Roma St, Dallas, TX', '12 PM - 10 PM', 'approved', NULL, NULL),
('The Pickle Pantry', 'Nancy Cooper', 'picklepantry@gmail.com', '(469) 555-2222', 'defaultpass9', 'Homemade pickles and fermented delicacies.', 'GST009', '444 Pickle St, Dallas, TX', '10 AM - 8 PM', 'approved', NULL, NULL),
('The Sweet Crust Bakery', 'Susan Baker', 'sweetcrustbakery@gmail.com', '(214) 555-1919', 'defaultpass10', 'Handcrafted pastries and fresh-baked bread.', 'GST010', '777 Bakery Ave, Dallas, TX', '9 AM - 9 PM', 'approved', NULL, NULL);



------------ MENU_ITEMS
INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(1, 'Vegan Mango Sorbet', 'Mango sorbet made with natural sweeteners.', 'Vegan', 4.99, TRUE),
(1, 'Vegan Raspberry Lemon Sorbet', 'Raspberry lemon sorbet made with fresh fruit.', 'Vegan', 5.49, TRUE),
(1, 'Non-Dairy Salted Caramel Swirl', 'Almond milk-based ice cream with caramel.', 'Vegan', 5.99, TRUE),
(1, 'Vegan Coconut Milk Chocolate Chip', 'Coconut milk ice cream with chocolate chips.', 'Vegan', 5.25, TRUE),
(1, 'Strawberry Cheesecake Ice Cream', 'Cheesecake flavored ice cream with strawberries.', 'Non-Vegan', 6.00, TRUE),
(1, 'Vegan Chocolate Peanut Butter Swirl', 'Vegan ice cream with chocolate and peanut butter.', 'Vegan', 5.75, TRUE),
(1, 'Gluten-Free Cookies & Cream', 'Vanilla ice cream with gluten-free cookies.', 'Non-Vegan', 5.50, TRUE);
INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(2, 'Vegan BBQ Chickpea Burger', 'BBQ-marinated chickpeas with avocado and pickles on gluten-free bun.', 'Vegan', 8.49, TRUE),
(2, 'Grilled Chicken & Avocado Burger', 'Grilled chicken, avocado, spinach, tomato on whole-grain bun.', 'Non-Vegan', 9.99, TRUE),
(2, 'Gluten-Free Veggie Burger', 'Veggie patty with lettuce, avocado and vegan mayo on GF bun.', 'Vegan', 8.75, TRUE),
(2, 'Healthy Chicken & Veggie Burger', 'Lean chicken patty with vegetables and mustard dressing.', 'Non-Vegan', 9.25, TRUE),
(2, 'Sweet Potato & Black Bean Burger', 'Savory patty with sweet potato, black beans, salsa.', 'Vegan', 8.99, TRUE),
(2, 'Vegan Mushroom & Avocado Burger', 'Grilled mushroom cap with creamy avocado on gluten-free bun.', 'Vegan', 8.50, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(3, 'Green Power Detox Juice', 'Kale, spinach, cucumber, apple, lemon, and ginger blend.', 'Vegan', 4.50, TRUE),
(3, 'Tropical Immunity Boost Juice', 'Pineapple, orange, mango, and turmeric blend.', 'Vegan', 4.75, TRUE),
(3, 'Carrot Ginger Glow Juice', 'Carrots, ginger, lemon juice combo.', 'Vegan', 4.25, TRUE),
(3, 'Beetroot & Apple Energizer', 'Beetroot, apple, and lemon mix.', 'Vegan', 4.25, TRUE),
(3, 'Cucumber Mint Refresher', 'Cucumber, mint, lime juice.', 'Vegan', 4.00, TRUE),
(3, 'Pineapple & Coconut Hydration', 'Pineapple and coconut water blend.', 'Vegan', 4.75, TRUE),
(3, 'Watermelon & Basil Cooler', 'Watermelon, basil, lime.', 'Vegan', 4.25, TRUE),
(3, 'Apple Celery Green Juice', 'Apple, celery, spinach, lemon.', 'Vegan', 4.50, TRUE),
(3, 'Citrus Sunrise Juice', 'Orange, grapefruit, lemon.', 'Vegan', 4.60, TRUE),
(3, 'Ginger Lemonade Boost', 'Ginger, lemon, honey optional.', 'Vegan', 4.40, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(4, 'Vegan Sweet Potato & Chickpea Rice Bowl', 'Rice with roasted sweet potatoes, chickpeas, avocado, and tahini.', 'Vegan', 9.99, TRUE),
(4, 'Grilled Chicken Teriyaki Rice Bowl', 'Grilled chicken over jasmine rice with sautéed vegetables.', 'Non-Vegan', 10.49, TRUE),
(4, 'Spicy Tofu & Veggie Rice Bowl', 'Crispy tofu with bell peppers, onions, broccoli, and spicy sauce.', 'Vegan', 9.49, TRUE),
(4, 'Grilled Salmon & Avocado Rice Bowl', 'Grilled salmon with avocado, cucumber, and soy-sesame dressing.', 'Non-Vegan', 11.49, TRUE),
(4, 'Vegan Buddha Rice Bowl', 'Quinoa, roasted vegetables, avocado, chickpeas, lemon-tahini dressing.', 'Vegan', 10.99, TRUE),
(4, 'Lemon Herb Chicken & Brown Rice Bowl', 'Chicken breast with brown rice and lemon dressing.', 'Non-Vegan', 10.75, TRUE),
(4, 'Vegan Cauliflower & Lentil Rice Bowl', 'Cauliflower, lentils, spinach, and turmeric dressing over rice.', 'Vegan', 9.75, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(5, 'Bibimbap (Chicken or Tofu)', 'Mixed rice bowl with vegetables, protein, fried egg, and gochujang.', 'Mixed', 11.49, TRUE),
(5, 'Kimchi Fried Rice', 'Stir-fried rice with kimchi and egg.', 'Non-Vegan', 9.99, TRUE),
(5, 'Japchae (Glass Noodles)', 'Sweet potato noodles stir-fried with vegetables and soy.', 'Vegan', 9.50, TRUE),
(5, 'Tteokbokki', 'Spicy Korean rice cakes in gochujang sauce.', 'Vegan', 8.75, TRUE),
(5, 'Korean Fried Chicken', 'Double-fried chicken with spicy Korean glaze.', 'Non-Vegan', 10.99, TRUE),
(5, 'Hotteok', 'Sweet pancakes with brown sugar, cinnamon, and peanuts.', 'Vegetarian', 6.25, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(6, 'Falafel Wrap', 'Falafel in pita with tahini sauce.', 'Vegan', 8.49, TRUE),
(6, 'Shawarma Platter', 'Chicken or beef shawarma with rice and salad.', 'Non-Vegan', 9.99, TRUE),
(6, 'Hummus & Pita', 'Creamy chickpea hummus with warm pita.', 'Vegan', 6.50, TRUE),
(6, 'Lentil Soup', 'Spiced lentil soup with lemon.', 'Vegan', 5.25, TRUE),
(6, 'Baklava (Walnut & Honey)', 'Walnut-stuffed pastry with honey syrup.', 'Vegetarian', 5.99, TRUE),
(6, 'Stuffed Grape Leaves', 'Grape leaves filled with herbed rice.', 'Vegan', 6.25, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(7, 'Pad Thai', 'Rice noodles with vegetables and choice of protein.', 'Mixed', 10.49, TRUE),
(7, 'Som Tum', 'Green papaya salad with chili-lime dressing.', 'Vegan', 6.75, TRUE),
(7, 'Tom Yum Soup', 'Spicy-sour shrimp soup with lemongrass and lime leaves.', 'Non-Vegan', 9.25, TRUE),
(7, 'Mango Sticky Rice', 'Sticky rice with mango and coconut milk.', 'Vegan', 7.49, TRUE),
(7, 'Thai Basil Chicken', 'Stir-fried chicken with basil and chili.', 'Non-Vegan', 9.99, TRUE),
(7, 'Vegetable Spring Rolls', 'Fried spring rolls with sweet chili sauce.', 'Vegan', 6.25, TRUE);


INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(8, 'Garlic Bread with Cheese', 'Garlic butter toast topped with mozzarella.', 'Vegetarian', 4.50, TRUE),
(8, 'Spicy Chicken Wings', 'Wings marinated in spicy Italian herbs.', 'Non-Vegan', 6.99, TRUE),
(8, 'Bruschetta Italiano', 'Toasted bread with tomatoes, garlic, and basil.', 'Vegetarian', 5.25, TRUE),
(8, 'Creamy Alfredo Pasta', 'Butter, garlic, cream, and parmesan with pasta.', 'Vegetarian', 11.25, TRUE),
(8, 'Classic Chicken Bolognese', 'Chicken ragu over spaghetti.', 'Non-Vegan', 11.75, TRUE),
(8, 'Pesto Primavera Pasta', 'Basil pesto with sautéed veggies and spaghetti.', 'Vegetarian', 10.99, TRUE),
(8, 'Spicy Garlic Shrimp Pasta', 'Shrimp tossed in garlic butter and herbs.', 'Non-Vegan', 12.25, TRUE),
(8, 'Chocolate Lava Cake', 'Molten chocolate cake with vanilla ice cream.', 'Non-Vegan', 6.99, TRUE);


INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(9, 'Spicy Mango Pickle (Indian Style)', 'Mango pickle with mustard oil and Indian spices.', 'Vegan', 3.25, TRUE),
(9, 'Korean Kimchi', 'Fermented napa cabbage with garlic and gochujang.', 'Vegan', 3.50, TRUE),
(9, 'Garlic Dill Pickles', 'Cucumbers pickled with garlic and dill.', 'Vegan', 3.00, TRUE),
(9, 'Carrot and Radish Pickle', 'Indian-style pickle with carrots and radishes.', 'Vegan', 3.25, TRUE),
(9, 'Sweet and Sour Pineapple Pickle', 'Pineapple chunks pickled in sugar and vinegar.', 'Vegan', 3.50, TRUE),
(9, 'Non-Vegan Fish Pickle (Kerala Style)', 'South Indian fish pickle with mustard oil.', 'Non-Vegan', 4.50, TRUE),
(9, 'Chili Lemon Pickle', 'Lemon and chili pickle with mustard seeds.', 'Vegan', 3.25, TRUE),
(9, 'Turmeric Ginger Pickle', 'Pickle made with ginger, turmeric, and spices.', 'Vegan', 3.25, TRUE),
(9, 'Pickled Beets with Balsamic Vinegar', 'Beets pickled in balsamic with thyme.', 'Vegan', 3.75, TRUE),
(9, 'Spicy Tomato Chutney', 'Tomato chutney with chili and tamarind.', 'Vegan', 3.50, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10, 'Classic Apple Pie', 'Spiced apples in a flaky buttery crust.', 'Vegetarian', 5.99, TRUE),
(10, 'Vegan Chocolate Fudge Cake', 'Moist vegan chocolate cake with ganache.', 'Vegan', 6.50, TRUE),
(10, 'Chicken and Mushroom Pot Pie', 'Savory pie with chicken and mushrooms.', 'Non-Vegan', 6.99, TRUE),
(10, 'Lemon and Almond Cake', 'Lemon cake with almond flour.', 'Vegan', 6.25, TRUE),
(10, 'Chocolate Chip Cookies', 'Classic chewy cookies with chocolate chips.', 'Vegetarian', 4.50, TRUE),
(10, 'Sugar-Free Banana Bread', 'Naturally sweetened banana bread.', 'Vegan', 5.75, TRUE),
(10, 'Pecan Pie', 'Pie with roasted pecans and buttery filling.', 'Vegetarian', 6.25, TRUE);


---- ORDERS INSERTS

INSERT INTO orders (order_id, vendor_id, customer_id, total_amount, order_date, order_status) VALUES
(NULL, 1, 3, 52.8, NOW(), 'preparing'),
(NULL, 7, 5, 24.7, NOW(), 'confirmed'),
(NULL, 6, 6, 18.7, NOW(), 'delivered'),
(NULL, 7, 3, 20.3, NOW(), 'pending'),
(NULL, 3, 3, 38.7, NOW(), 'preparing'),
(NULL, 1, 5, 40.5, NOW(), 'out for delivery'),
(NULL, 10, 4, 20.1, NOW(), 'out for delivery'),
(NULL, 10, 2, 25.9, NOW(), 'out for delivery'),
(NULL, 2, 8, 53.4, NOW(), 'delivered'),
(NULL, 7, 10, 32.2, NOW(), 'preparing'),
(NULL, 5, 7, 22.1, NOW(), 'out for delivery'),
(NULL, 3, 7, 16.4, NOW(), 'preparing'),
(NULL, 7, 3, 41.3, NOW(), 'out for delivery'),
(NULL, 9, 3, 38.2, NOW(), 'pending'),
(NULL, 10, 2, 22.8, NOW(), 'confirmed');


INSERT INTO order_items (order_item_id, order_id, item_id, quantity, item_price) VALUES
(NULL, 1, 39, 3, 8.4),
(NULL, 1, 47, 3, 9.2),
(NULL, 2, 27, 2, 7.2),
(NULL, 2, 58, 1, 10.3),
(NULL, 3, 14, 2, 5.9),
(NULL, 3, 24, 1, 6.9),
(NULL, 4, 2, 3, 4.7),
(NULL, 4, 17, 1, 6.2),
(NULL, 5, 38, 3, 8.3),
(NULL, 5, 24, 2, 6.9),
(NULL, 6, 48, 3, 9.3),
(NULL, 6, 18, 2, 6.3),
(NULL, 7, 49, 1, 9.4),
(NULL, 7, 62, 1, 10.7),
(NULL, 8, 7, 3, 5.2),
(NULL, 8, 58, 1, 10.3),
(NULL, 9, 68, 3, 11.3),
(NULL, 9, 20, 3, 6.5),
(NULL, 10, 41, 3, 8.6),
(NULL, 10, 19, 1, 6.4),
(NULL, 11, 1, 3, 4.6),
(NULL, 11, 38, 1, 8.3),
(NULL, 12, 68, 1, 11.3),
(NULL, 12, 6, 1, 5.1),
(NULL, 13, 60, 3, 10.5),
(NULL, 13, 4, 2, 4.9),
(NULL, 14, 46, 3, 9.1),
(NULL, 14, 64, 1, 10.9),
(NULL, 15, 12, 2, 5.7),
(NULL, 15, 69, 1, 11.4);


INSERT INTO order_status_history (status_id, order_id, status, status_time) VALUES
(NULL, 1, 'pending', '2025-04-08 00:58:34'),
(NULL, 1, 'confirmed', '2025-04-08 02:58:34'),
(NULL, 1, 'preparing', '2025-04-08 04:58:34'),
(NULL, 2, 'out for delivery', '2025-04-10 00:58:34'),
(NULL, 3, 'pending', '2025-04-09 00:58:34'),
(NULL, 3, 'out for delivery', '2025-04-09 02:58:34'),
(NULL, 4, 'delivered', '2025-04-12 00:58:34'),
(NULL, 5, 'confirmed', '2025-04-11 00:58:34'),
(NULL, 5, 'preparing', '2025-04-11 02:58:34'),
(NULL, 5, 'out for delivery', '2025-04-11 04:58:34'),
(NULL, 6, 'out for delivery', '2025-04-14 00:58:34'),
(NULL, 6, 'delivered', '2025-04-14 02:58:34'),
(NULL, 7, 'pending', '2025-04-07 00:58:34'),
(NULL, 7, 'out for delivery', '2025-04-07 02:58:34'),
(NULL, 7, 'delivered', '2025-04-07 04:58:34'),
(NULL, 8, 'pending', '2025-04-11 00:58:34'),
(NULL, 8, 'preparing', '2025-04-11 02:58:34'),
(NULL, 9, 'pending', '2025-04-16 00:58:34'),
(NULL, 9, 'out for delivery', '2025-04-16 02:58:34'),
(NULL, 10, 'preparing', '2025-04-12 00:58:34'),
(NULL, 11, 'out for delivery', '2025-04-12 00:58:34'),
(NULL, 12, 'pending', '2025-04-09 00:58:34'),
(NULL, 12, 'confirmed', '2025-04-09 02:58:34'),
(NULL, 12, 'out for delivery', '2025-04-09 04:58:34'),
(NULL, 13, 'delivered', '2025-04-14 00:58:34'),
(NULL, 14, 'preparing', '2025-04-11 00:58:34'),
(NULL, 14, 'delivered', '2025-04-11 02:58:34'),
(NULL, 15, 'confirmed', '2025-04-11 00:58:34');

---Reviews

INSERT INTO customer_reviews (review_id, customer_id, vendor_id, rating, comments, review_date) VALUES
(NULL, 10, 7, 4.9, 'Very satisfied with the quality.', '2025-03-28 01:00:24'),
(NULL, 6, 7, 3.4, 'Very satisfied with the quality.', '2025-04-12 01:00:24'),
(NULL, 7, 6, 3.2, 'Mediocre experience overall.', '2025-04-12 01:00:24'),
(NULL, 6, 8, 3.2, 'Decent food, but a bit pricey.', '2025-04-15 01:00:24'),
(NULL, 5, 8, 3.6, 'Amazing taste and quick delivery!', '2025-04-16 01:00:24'),
(NULL, 5, 1, 4.9, 'Highly recommended!', '2025-03-20 01:00:24'),
(NULL, 10, 2, 4.7, 'Highly recommended!', '2025-04-06 01:00:24'),
(NULL, 1, 7, 4.2, 'Mediocre experience overall.', '2025-04-05 01:00:24'),
(NULL, 6, 9, 3.0, 'Amazing taste and quick delivery!', '2025-04-16 01:00:24'),
(NULL, 2, 2, 3.2, 'Great customer service!', '2025-04-12 01:00:24'),
(NULL, 10, 7, 3.4, 'Absolutely loved the freshness!', '2025-03-18 01:00:24'),
(NULL, 2, 9, 3.2, 'Absolutely loved the freshness!', '2025-03-23 01:00:24'),
(NULL, 6, 1, 3.3, 'Mediocre experience overall.', '2025-04-06 01:00:24'),
(NULL, 9, 3, 4.1, 'Absolutely loved the freshness!', '2025-03-30 01:00:24'),
(NULL, 1, 4, 4.4, 'Not as expected. Needs improvement.', '2025-04-09 01:00:24');



-------VENDOR Analytics

CREATE TABLE analytics_vendor_summary (
    vendor_id INT NOT NULL,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    avg_order_value DECIMAL(10,2) DEFAULT 0.00,
    total_menu_items INT DEFAULT 0,
    total_customers INT DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT NULL,
    PRIMARY KEY (vendor_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id)
);


INSERT INTO analytics_vendor_summary
(vendor_id, total_orders, total_revenue, avg_order_value, total_menu_items, total_customers, avg_rating)
VALUES
(1, 125, 1890.50, 15.12, 7, 98, 4.4),
(2, 103, 1485.75, 14.42, 5, 86, 4.2),
(3, 92, 1390.00, 15.11, 6, 72, 4.5),
(4, 108, 1650.25, 15.28, 6, 80, 4.1),
(5, 134, 2002.00, 14.94, 7, 110, 4.6),
(6, 76, 1105.40, 14.54, 5, 65, 4.0),
(7, 88, 1265.80, 14.38, 5, 70, 4.3),
(8, 97, 1358.10, 14.00, 6, 78, 4.4),
(9, 58, 845.30, 14.57, 4, 52, 4.0),
(10, 111, 1755.90, 15.81, 8, 93, 4.7);

SELECT * FROM customers;
SELECT * FROM vendors;
SELECT * FROM orders WHERE vendor_id = 1;
SELECT * FROM order_items;
SELECT * FROM menu_items;

UPDATE vendors 
SET vendor_status = 'rejected', 
    vendor_rejectedmessage = 'Your application was rejected because the provided business documentation was incomplete. Please resubmit with all required permits and licenses.' 
WHERE vendor_id = 11;

ALTER TABLE menu_items ADD nutritional_info TEXT;

ALTER TABLE order_status_history ADD COLUMN reason TEXT;

SELECT * FROM order_status_history;
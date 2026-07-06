/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './app/config';
import { UserModel } from './app/modules/auth/auth.model';
import { ProductModel } from './app/modules/product/product.model';
import { SaleModel } from './app/modules/sale/sale.model';

const seedMockData = async () => {
  try {
    if (!config.database_url) {
      throw new Error('DATABASE_URL is missing in the configuration.');
    }

    // Connect to database
    await mongoose.connect(config.database_url, { dbName: config.database_name });
    console.log('🌱 Database connected for mock seeding...');

    // Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await UserModel.deleteMany({});
    await ProductModel.deleteMany({});
    await SaleModel.deleteMany({});

    // 1. Seed Users (passwords will be hashed by Mongoose pre-save hook)
    console.log('👥 Seeding Users...');
    const adminPassword = config.admin_password ?? 'AdminPass123!';
    const defaultPassword = 'UserPass123!';

    const admin = await UserModel.create({
      name: 'System Administrator',
      email: config.admin_email ?? 'admin@classyerp.com',
      password: adminPassword,
      role: 'Admin',
      isActive: true,
    });

    const manager1 = await UserModel.create({
      name: 'Alice Vance',
      email: 'alice.manager@classyerp.com',
      password: defaultPassword,
      role: 'Manager',
      isActive: true,
    });

    const manager2 = await UserModel.create({
      name: 'Bob Stone',
      email: 'bob.manager@classyerp.com',
      password: defaultPassword,
      role: 'Manager',
      isActive: true,
    });

    const employee1 = await UserModel.create({
      name: 'Charlie Day',
      email: 'charlie.emp@classyerp.com',
      password: defaultPassword,
      role: 'Employee',
      isActive: true,
    });

    const employee2 = await UserModel.create({
      name: 'Diana Ross',
      email: 'diana.emp@classyerp.com',
      password: defaultPassword,
      role: 'Employee',
      isActive: true,
    });

    const _employee3 = await UserModel.create({
      name: 'Ethan Hunt',
      email: 'ethan.emp@classyerp.com',
      password: defaultPassword,
      role: 'Employee',
      isActive: false, // Inactive account for testing
    });

    console.log('✅ Users seeded.');

    // 2. Seed Products
    console.log('📦 Seeding Products...');
    const productsData = [
      // Electronics
      {
        name: 'Wireless ANC Headphones',
        sku: 'ELEC-HEAD-01',
        category: 'Electronics',
        purchasePrice: 120,
        sellingPrice: 199,
        stockQuantity: 40,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Minimalist Mechanical Keyboard',
        sku: 'ELEC-KEYB-02',
        category: 'Electronics',
        purchasePrice: 65,
        sellingPrice: 110,
        stockQuantity: 25,
        image:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Smart Fitness Watch v2',
        sku: 'ELEC-WATC-03',
        category: 'Electronics',
        purchasePrice: 90,
        sellingPrice: 149,
        stockQuantity: 15,
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Pro Streamer Microphone',
        sku: 'ELEC-MICR-04',
        category: 'Electronics',
        purchasePrice: 75,
        sellingPrice: 125,
        stockQuantity: 4, // Low Stock
        image:
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Premium UltraBook Laptop',
        sku: 'ELEC-LAPT-05',
        category: 'Electronics',
        purchasePrice: 850,
        sellingPrice: 1299,
        stockQuantity: 8,
        image:
          'https://images.unsplash.com/photo-1496181130204-7552cc145cdb?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Ergonomic Wireless Mouse',
        sku: 'ELEC-MOUS-06',
        category: 'Electronics',
        purchasePrice: 30,
        sellingPrice: 59,
        stockQuantity: 60,
        image:
          'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },

      // Apparel & Accessories
      {
        name: 'Classic Denim Jacket',
        sku: 'APPR-JACK-01',
        category: 'Apparel & Accessories',
        purchasePrice: 35,
        sellingPrice: 65,
        stockQuantity: 50,
        image:
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Retro Running Sneakers',
        sku: 'APPR-SNEA-02',
        category: 'Apparel & Accessories',
        purchasePrice: 50,
        sellingPrice: 95,
        stockQuantity: 20,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Canvas Commuter Backpack',
        sku: 'APPR-BACK-03',
        category: 'Apparel & Accessories',
        purchasePrice: 28,
        sellingPrice: 49,
        stockQuantity: 35,
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'RFID Blocking Leather Wallet',
        sku: 'APPR-WALL-04',
        category: 'Apparel & Accessories',
        purchasePrice: 15,
        sellingPrice: 29,
        stockQuantity: 45,
        image:
          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Polarized Retro Sunglasses',
        sku: 'APPR-GLAS-05',
        category: 'Apparel & Accessories',
        purchasePrice: 20,
        sellingPrice: 39,
        stockQuantity: 1, // Low stock
        image:
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Home & Kitchen
      {
        name: 'Espresso Coffee Maker',
        sku: 'HOME-COFF-01',
        category: 'Home & Kitchen',
        purchasePrice: 150,
        sellingPrice: 249,
        stockQuantity: 12,
        image:
          'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Countertop High-Speed Blender',
        sku: 'HOME-BLEN-02',
        category: 'Home & Kitchen',
        purchasePrice: 45,
        sellingPrice: 79,
        stockQuantity: 30,
        image:
          'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'HEPA Silent Air Purifier',
        sku: 'HOME-AIRP-03',
        category: 'Home & Kitchen',
        purchasePrice: 110,
        sellingPrice: 189,
        stockQuantity: 3, // Low stock
        image:
          'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Electric Gooseneck Kettle',
        sku: 'HOME-KETT-04',
        category: 'Home & Kitchen',
        purchasePrice: 25,
        sellingPrice: 49,
        stockQuantity: 22,
        image:
          'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Digital Touchscreen Air Fryer',
        sku: 'HOME-FRYE-05',
        category: 'Home & Kitchen',
        purchasePrice: 60,
        sellingPrice: 119,
        stockQuantity: 14,
        image:
          'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Sports & Fitness
      {
        name: 'Eco-Friendly TPE Yoga Mat',
        sku: 'SPOR-YOGA-01',
        category: 'Sports & Fitness',
        purchasePrice: 18,
        sellingPrice: 35,
        stockQuantity: 28,
        image:
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Adjustable Cast Iron Dumbbells',
        sku: 'SPOR-DUMB-02',
        category: 'Sports & Fitness',
        purchasePrice: 45,
        sellingPrice: 89,
        stockQuantity: 12,
        image:
          'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Insulated Sports Water Bottle',
        sku: 'SPOR-BOTT-03',
        category: 'Sports & Fitness',
        purchasePrice: 8,
        sellingPrice: 19,
        stockQuantity: 4, // Low stock
        image:
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: '4-Person Instant Camping Tent',
        sku: 'SPOR-TENT-04',
        category: 'Sports & Fitness',
        purchasePrice: 80,
        sellingPrice: 149,
        stockQuantity: 6,
        image:
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },

      // Beauty & Personal Care
      {
        name: 'Organic Retinol Face Serum',
        sku: 'BEAU-SERU-01',
        category: 'Beauty & Personal Care',
        purchasePrice: 15,
        sellingPrice: 28,
        stockQuantity: 25,
        image:
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Natural Oatmeal Bar Soap Pack',
        sku: 'BEAU-SOAP-02',
        category: 'Beauty & Personal Care',
        purchasePrice: 6,
        sellingPrice: 12,
        stockQuantity: 50,
        image:
          'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Electric Sonic Toothbrush',
        sku: 'BEAU-TOOT-03',
        category: 'Beauty & Personal Care',
        purchasePrice: 35,
        sellingPrice: 69,
        stockQuantity: 3, // Low stock
        image:
          'https://images.unsplash.com/photo-1559591937-e6b2103f6f66?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },

      // Office Supplies
      {
        name: 'Ergonomic Mesh Desk Chair',
        sku: 'OFFI-CHAI-01',
        category: 'Office Supplies',
        purchasePrice: 140,
        sellingPrice: 220,
        stockQuantity: 10,
        image:
          'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'LED Eye-Care Desk Lamp',
        sku: 'OFFI-LAMP-02',
        category: 'Office Supplies',
        purchasePrice: 22,
        sellingPrice: 39,
        stockQuantity: 2, // Low stock
        image:
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Executive Leather Planner',
        sku: 'OFFI-PLAN-03',
        category: 'Office Supplies',
        purchasePrice: 12,
        sellingPrice: 24,
        stockQuantity: 55,
        image:
          'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Books & Stationery
      {
        name: 'Hardcover Mixed Media Sketchbook',
        sku: 'BOOK-SKET-01',
        category: 'Books & Stationery',
        purchasePrice: 9,
        sellingPrice: 18,
        stockQuantity: 30,
        image:
          'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Classic Brass Fountain Pen Set',
        sku: 'BOOK-PENS-02',
        category: 'Books & Stationery',
        purchasePrice: 22,
        sellingPrice: 45,
        stockQuantity: 15,
        image:
          'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'A5 Dotted Bullet Journal',
        sku: 'BOOK-NOTE-03',
        category: 'Books & Stationery',
        purchasePrice: 8,
        sellingPrice: 15,
        stockQuantity: 40,
        image:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },

      // Grocery & Beverages
      {
        name: 'Organic Espresso Coffee Beans (1kg)',
        sku: 'GROC-COFF-01',
        category: 'Grocery & Beverages',
        purchasePrice: 14,
        sellingPrice: 26,
        stockQuantity: 35,
        image:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Premium Japanese Sencha Green Tea',
        sku: 'GROC-TEAS-02',
        category: 'Grocery & Beverages',
        purchasePrice: 11,
        sellingPrice: 22,
        stockQuantity: 28,
        image:
          'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Artisanal Cold Brew Glass Bottle (4-Pack)',
        sku: 'GROC-COLD-03',
        category: 'Grocery & Beverages',
        purchasePrice: 10,
        sellingPrice: 19,
        stockQuantity: 1, // Low stock
        image:
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },

      // Automotive
      {
        name: 'Heavy-Duty Car Air Compressor',
        sku: 'AUTO-COMP-01',
        category: 'Automotive',
        purchasePrice: 24,
        sellingPrice: 49,
        stockQuantity: 18,
        image:
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Dual-Lens Dashcam Recorder 4K',
        sku: 'AUTO-DASH-02',
        category: 'Automotive',
        purchasePrice: 55,
        sellingPrice: 99,
        stockQuantity: 12,
        image:
          'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Microfiber Car Detailing Wash Mitts',
        sku: 'AUTO-MITT-03',
        category: 'Automotive',
        purchasePrice: 5,
        sellingPrice: 11,
        stockQuantity: 50,
        image:
          'https://images.unsplash.com/photo-1607860108855-64cac207c74c?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },

      // Toys & Games
      {
        name: 'Handcrafted Wooden Chess Set',
        sku: 'TOYS-CHES-01',
        category: 'Toys & Games',
        purchasePrice: 30,
        sellingPrice: 59,
        stockQuantity: 16,
        image:
          'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Retro Handheld Gaming Console',
        sku: 'TOYS-HAND-02',
        category: 'Toys & Games',
        purchasePrice: 40,
        sellingPrice: 79,
        stockQuantity: 14,
        image:
          'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: '3D Wooden Brainteaser Assembly Puzzle',
        sku: 'TOYS-PUZZ-03',
        category: 'Toys & Games',
        purchasePrice: 8,
        sellingPrice: 16,
        stockQuantity: 2, // Low stock
        image:
          'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
    ];

    const seededProducts = await ProductModel.insertMany(productsData);
    console.log('✅ Products seeded.');

    // 3. Seed Sales History (20 Sales spanning the past 14 days)
    console.log('💰 Seeding Sales History...');
    const salesData = [
      {
        customer: 'Acme Corporation',
        items: [
          {
            product: seededProducts[0]._id, // Headphones
            productName: seededProducts[0].name,
            quantity: 3,
            unitPrice: seededProducts[0].sellingPrice,
            subtotal: seededProducts[0].sellingPrice * 3,
          },
          {
            product: seededProducts[1]._id, // Keyboard
            productName: seededProducts[1].name,
            quantity: 2,
            unitPrice: seededProducts[1].sellingPrice,
            subtotal: seededProducts[1].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[0].sellingPrice * 3 + seededProducts[1].sellingPrice * 2,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'TechSolutions Ltd',
        items: [
          {
            product: seededProducts[4]._id, // UltraBook
            productName: seededProducts[4].name,
            quantity: 1,
            unitPrice: seededProducts[4].sellingPrice,
            subtotal: seededProducts[4].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[4].sellingPrice,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Alice Vance (Self Service)',
        items: [
          {
            product: seededProducts[2]._id, // Fitness Watch
            productName: seededProducts[2].name,
            quantity: 1,
            unitPrice: seededProducts[2].sellingPrice,
            subtotal: seededProducts[2].sellingPrice * 1,
          },
          {
            product: seededProducts[8]._id, // Backpack
            productName: seededProducts[8].name,
            quantity: 1,
            unitPrice: seededProducts[8].sellingPrice,
            subtotal: seededProducts[8].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[2].sellingPrice + seededProducts[8].sellingPrice,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Urban Space Designs',
        items: [
          {
            product: seededProducts[23]._id, // Desk Chair
            productName: seededProducts[23].name,
            quantity: 2,
            unitPrice: seededProducts[23].sellingPrice,
            subtotal: seededProducts[23].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[23].sellingPrice * 2,
        soldBy: manager1._id,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Global Builders Inc',
        items: [
          {
            product: seededProducts[5]._id, // Mouse
            productName: seededProducts[5].name,
            quantity: 5,
            unitPrice: seededProducts[5].sellingPrice,
            subtotal: seededProducts[5].sellingPrice * 5,
          },
          {
            product: seededProducts[25]._id, // Executive Planner
            productName: seededProducts[25].name,
            quantity: 10,
            unitPrice: seededProducts[25].sellingPrice,
            subtotal: seededProducts[25].sellingPrice * 10,
          },
        ],
        grandTotal: seededProducts[5].sellingPrice * 5 + seededProducts[25].sellingPrice * 10,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'FitLife Gymnasium',
        items: [
          {
            product: seededProducts[16]._id, // Yoga Mat
            productName: seededProducts[16].name,
            quantity: 8,
            unitPrice: seededProducts[16].sellingPrice,
            subtotal: seededProducts[16].sellingPrice * 8,
          },
          {
            product: seededProducts[17]._id, // Dumbbells
            productName: seededProducts[17].name,
            quantity: 4,
            unitPrice: seededProducts[17].sellingPrice,
            subtotal: seededProducts[17].sellingPrice * 4,
          },
        ],
        grandTotal: seededProducts[16].sellingPrice * 8 + seededProducts[17].sellingPrice * 4,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Jonathan Carter',
        items: [
          {
            product: seededProducts[6]._id, // Denim Jacket
            productName: seededProducts[6].name,
            quantity: 1,
            unitPrice: seededProducts[6].sellingPrice,
            subtotal: seededProducts[6].sellingPrice * 1,
          },
          {
            product: seededProducts[7]._id, // Running Sneakers
            productName: seededProducts[7].name,
            quantity: 1,
            unitPrice: seededProducts[7].sellingPrice,
            subtotal: seededProducts[7].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[6].sellingPrice + seededProducts[7].sellingPrice,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'HomeStylers',
        items: [
          {
            product: seededProducts[11]._id, // Coffee Maker
            productName: seededProducts[11].name,
            quantity: 2,
            unitPrice: seededProducts[11].sellingPrice,
            subtotal: seededProducts[11].sellingPrice * 2,
          },
          {
            product: seededProducts[12]._id, // Blender
            productName: seededProducts[12].name,
            quantity: 1,
            unitPrice: seededProducts[12].sellingPrice,
            subtotal: seededProducts[12].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[11].sellingPrice * 2 + seededProducts[12].sellingPrice * 1,
        soldBy: manager2._id,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Alpha Studios',
        items: [
          {
            product: seededProducts[3]._id, // Microphone
            productName: seededProducts[3].name,
            quantity: 2,
            unitPrice: seededProducts[3].sellingPrice,
            subtotal: seededProducts[3].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[3].sellingPrice * 2,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Apex Fitness Co',
        items: [
          {
            product: seededProducts[18]._id, // Sports Water Bottle
            productName: seededProducts[18].name,
            quantity: 10,
            unitPrice: seededProducts[18].sellingPrice,
            subtotal: seededProducts[18].sellingPrice * 10,
          },
        ],
        grandTotal: seededProducts[18].sellingPrice * 10,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Vanguard Offices',
        items: [
          {
            product: seededProducts[23]._id, // Ergonomic Chair
            productName: seededProducts[23].name,
            quantity: 3,
            unitPrice: seededProducts[23].sellingPrice,
            subtotal: seededProducts[23].sellingPrice * 3,
          },
          {
            product: seededProducts[24]._id, // LED Desk Lamp
            productName: seededProducts[24].name,
            quantity: 5,
            unitPrice: seededProducts[24].sellingPrice,
            subtotal: seededProducts[24].sellingPrice * 5,
          },
        ],
        grandTotal: seededProducts[23].sellingPrice * 3 + seededProducts[24].sellingPrice * 5,
        soldBy: manager1._id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Camping Gear Outlet',
        items: [
          {
            product: seededProducts[19]._id, // Camping Tent
            productName: seededProducts[19].name,
            quantity: 2,
            unitPrice: seededProducts[19].sellingPrice,
            subtotal: seededProducts[19].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[19].sellingPrice * 2,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Studio Wellness',
        items: [
          {
            product: seededProducts[20]._id, // Retinol Serum
            productName: seededProducts[20].name,
            quantity: 5,
            unitPrice: seededProducts[20].sellingPrice,
            subtotal: seededProducts[20].sellingPrice * 5,
          },
        ],
        grandTotal: seededProducts[20].sellingPrice * 5,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'The Reader Haven',
        items: [
          {
            product: seededProducts[26]._id, // Sketchbook
            productName: seededProducts[26].name,
            quantity: 3,
            unitPrice: seededProducts[26].sellingPrice,
            subtotal: seededProducts[26].sellingPrice * 3,
          },
          {
            product: seededProducts[28]._id, // Bullet Journal
            productName: seededProducts[28].name,
            quantity: 4,
            unitPrice: seededProducts[28].sellingPrice,
            subtotal: seededProducts[28].sellingPrice * 4,
          },
        ],
        grandTotal: seededProducts[26].sellingPrice * 3 + seededProducts[28].sellingPrice * 4,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Car Care Specialists',
        items: [
          {
            product: seededProducts[32]._id, // Air Compressor
            productName: seededProducts[32].name,
            quantity: 1,
            unitPrice: seededProducts[32].sellingPrice,
            subtotal: seededProducts[32].sellingPrice * 1,
          },
          {
            product: seededProducts[34]._id, // Wash Mitts
            productName: seededProducts[34].name,
            quantity: 6,
            unitPrice: seededProducts[34].sellingPrice,
            subtotal: seededProducts[34].sellingPrice * 6,
          },
        ],
        grandTotal: seededProducts[32].sellingPrice * 1 + seededProducts[34].sellingPrice * 6,
        soldBy: manager2._id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Nirvana Coffee Bar',
        items: [
          {
            product: seededProducts[29]._id, // Coffee beans
            productName: seededProducts[29].name,
            quantity: 6,
            unitPrice: seededProducts[29].sellingPrice,
            subtotal: seededProducts[29].sellingPrice * 6,
          },
        ],
        grandTotal: seededProducts[29].sellingPrice * 6,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Hobby Lobbyist',
        items: [
          {
            product: seededProducts[35]._id, // Chess Set
            productName: seededProducts[35].name,
            quantity: 2,
            unitPrice: seededProducts[35].sellingPrice,
            subtotal: seededProducts[35].sellingPrice * 2,
          },
          {
            product: seededProducts[36]._id, // Game Console
            productName: seededProducts[36].name,
            quantity: 1,
            unitPrice: seededProducts[36].sellingPrice,
            subtotal: seededProducts[36].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[35].sellingPrice * 2 + seededProducts[36].sellingPrice * 1,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Alpha Car Detailing',
        items: [
          {
            product: seededProducts[33]._id, // Dashcam
            productName: seededProducts[33].name,
            quantity: 2,
            unitPrice: seededProducts[33].sellingPrice,
            subtotal: seededProducts[33].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[33].sellingPrice * 2,
        soldBy: manager1._id,
        createdAt: new Date(), // Today
      },
      {
        customer: 'Stationery Hub',
        items: [
          {
            product: seededProducts[27]._id, // Fountain Pen
            productName: seededProducts[27].name,
            quantity: 2,
            unitPrice: seededProducts[27].sellingPrice,
            subtotal: seededProducts[27].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[27].sellingPrice * 2,
        soldBy: employee1._id,
        createdAt: new Date(), // Today
      },
      {
        customer: 'Fit & Wellness Gym',
        items: [
          {
            product: seededProducts[16]._id, // Yoga mat
            productName: seededProducts[16].name,
            quantity: 5,
            unitPrice: seededProducts[16].sellingPrice,
            subtotal: seededProducts[16].sellingPrice * 5,
          },
        ],
        grandTotal: seededProducts[16].sellingPrice * 5,
        soldBy: employee2._id,
        createdAt: new Date(), // Today
      },
    ];

    await SaleModel.insertMany(salesData);
    console.log('✅ Sales history seeded.');

    console.log('🎉 Extended development mock data seeding successfully completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

void seedMockData();

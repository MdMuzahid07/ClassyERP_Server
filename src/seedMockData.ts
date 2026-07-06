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
    await mongoose.connect(config.database_url);
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
      {
        name: 'Portable Bluetooth Speaker',
        sku: 'ELEC-SPEA-07',
        category: 'Electronics',
        purchasePrice: 45,
        sellingPrice: 89,
        stockQuantity: 18,
        image:
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Home & Kitchen Appliances
      {
        name: 'Espresso Coffee Maker',
        sku: 'APPL-COFF-01',
        category: 'Appliances',
        purchasePrice: 150,
        sellingPrice: 249,
        stockQuantity: 12,
        image:
          'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Countertop High-Speed Blender',
        sku: 'APPL-BLEN-02',
        category: 'Appliances',
        purchasePrice: 45,
        sellingPrice: 79,
        stockQuantity: 30,
        image:
          'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'HEPA Silent Air Purifier',
        sku: 'APPL-AIRP-03',
        category: 'Appliances',
        purchasePrice: 110,
        sellingPrice: 189,
        stockQuantity: 3, // Low stock
        image:
          'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Electric Gooseneck Kettle',
        sku: 'APPL-KETT-04',
        category: 'Appliances',
        purchasePrice: 25,
        sellingPrice: 49,
        stockQuantity: 22,
        image:
          'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: 'Digital Touchscreen Air Fryer',
        sku: 'APPL-FRYE-05',
        category: 'Appliances',
        purchasePrice: 60,
        sellingPrice: 119,
        stockQuantity: 14,
        image:
          'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Apparel & Accessories
      {
        name: 'Classic Denim Jacket',
        sku: 'APPR-JACK-01',
        category: 'Apparel',
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
        category: 'Apparel',
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
        category: 'Apparel',
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
        category: 'Apparel',
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
        category: 'Apparel',
        purchasePrice: 20,
        sellingPrice: 39,
        stockQuantity: 1, // Low stock
        image:
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Office Supplies
      {
        name: 'Ergonomic Mesh Desk Chair',
        sku: 'OFFI-CHAI-01',
        category: 'Office',
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
        category: 'Office',
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
        category: 'Office',
        purchasePrice: 12,
        sellingPrice: 24,
        stockQuantity: 55,
        image:
          'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },

      // Fitness & Outdoors
      {
        name: 'Eco-Friendly TPE Yoga Mat',
        sku: 'FITN-YOGA-01',
        category: 'Fitness',
        purchasePrice: 18,
        sellingPrice: 35,
        stockQuantity: 28,
        image:
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
      {
        name: 'Adjustable Cast Iron Dumbbells',
        sku: 'FITN-DUMB-02',
        category: 'Fitness',
        purchasePrice: 45,
        sellingPrice: 89,
        stockQuantity: 12,
        image:
          'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&auto=format&fit=crop',
        createdBy: manager2._id,
      },
      {
        name: 'Insulated Sports Water Bottle',
        sku: 'FITN-BOTT-03',
        category: 'Fitness',
        purchasePrice: 8,
        sellingPrice: 19,
        stockQuantity: 4, // Low stock
        image:
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
        createdBy: manager1._id,
      },
      {
        name: '4-Person Instant Camping Tent',
        sku: 'FITN-TENT-04',
        category: 'Fitness',
        purchasePrice: 80,
        sellingPrice: 149,
        stockQuantity: 6,
        image:
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop',
        createdBy: admin._id,
      },
    ];

    const seededProducts = await ProductModel.insertMany(productsData);
    console.log('✅ Products seeded.');

    // 3. Seed Sales History (12 Sales spanning the past 14 days)
    console.log('💰 Seeding Sales History...');
    const salesData = [
      {
        customer: 'Acme Corporation',
        items: [
          {
            product: seededProducts[0]._id, // ANC Headphones
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
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Dr. Sarah Jenkins',
        items: [
          {
            product: seededProducts[2]._id, // Fitness Watch
            productName: seededProducts[2].name,
            quantity: 1,
            unitPrice: seededProducts[2].sellingPrice,
            subtotal: seededProducts[2].sellingPrice * 1,
          },
          {
            product: seededProducts[14]._id, // Backpack
            productName: seededProducts[14].name,
            quantity: 1,
            unitPrice: seededProducts[14].sellingPrice,
            subtotal: seededProducts[14].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[2].sellingPrice + seededProducts[14].sellingPrice,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Urban Space Designs',
        items: [
          {
            product: seededProducts[17]._id, // Mesh Desk Chair
            productName: seededProducts[17].name,
            quantity: 2,
            unitPrice: seededProducts[17].sellingPrice,
            subtotal: seededProducts[17].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[17].sellingPrice * 2,
        soldBy: manager1._id,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
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
            product: seededProducts[19]._id, // Executive Planner
            productName: seededProducts[19].name,
            quantity: 10,
            unitPrice: seededProducts[19].sellingPrice,
            subtotal: seededProducts[19].sellingPrice * 10,
          },
        ],
        grandTotal: seededProducts[5].sellingPrice * 5 + seededProducts[19].sellingPrice * 10,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'FitLife Gymnasium',
        items: [
          {
            product: seededProducts[20]._id, // Yoga Mat
            productName: seededProducts[20].name,
            quantity: 8,
            unitPrice: seededProducts[20].sellingPrice,
            subtotal: seededProducts[20].sellingPrice * 8,
          },
          {
            product: seededProducts[21]._id, // Dumbbells
            productName: seededProducts[21].name,
            quantity: 4,
            unitPrice: seededProducts[21].sellingPrice,
            subtotal: seededProducts[21].sellingPrice * 4,
          },
        ],
        grandTotal: seededProducts[20].sellingPrice * 8 + seededProducts[21].sellingPrice * 4,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Jonathan Carter',
        items: [
          {
            product: seededProducts[12]._id, // Denim Jacket
            productName: seededProducts[12].name,
            quantity: 1,
            unitPrice: seededProducts[12].sellingPrice,
            subtotal: seededProducts[12].sellingPrice * 1,
          },
          {
            product: seededProducts[13]._id, // Running Sneakers
            productName: seededProducts[13].name,
            quantity: 1,
            unitPrice: seededProducts[13].sellingPrice,
            subtotal: seededProducts[13].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[12].sellingPrice + seededProducts[13].sellingPrice,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'HomeStylers',
        items: [
          {
            product: seededProducts[7]._id, // Coffee Maker
            productName: seededProducts[7].name,
            quantity: 2,
            unitPrice: seededProducts[7].sellingPrice,
            subtotal: seededProducts[7].sellingPrice * 2,
          },
          {
            product: seededProducts[8]._id, // Blender
            productName: seededProducts[8].name,
            quantity: 1,
            unitPrice: seededProducts[8].sellingPrice,
            subtotal: seededProducts[8].sellingPrice * 1,
          },
        ],
        grandTotal: seededProducts[7].sellingPrice * 2 + seededProducts[8].sellingPrice * 1,
        soldBy: manager2._id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
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
          {
            product: seededProducts[6]._id, // Bluetooth Speaker
            productName: seededProducts[6].name,
            quantity: 3,
            unitPrice: seededProducts[6].sellingPrice,
            subtotal: seededProducts[6].sellingPrice * 3,
          },
        ],
        grandTotal: seededProducts[3].sellingPrice * 2 + seededProducts[6].sellingPrice * 3,
        soldBy: employee1._id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Apex Fitness Co',
        items: [
          {
            product: seededProducts[22]._id, // Sports Water Bottle
            productName: seededProducts[22].name,
            quantity: 10,
            unitPrice: seededProducts[22].sellingPrice,
            subtotal: seededProducts[22].sellingPrice * 10,
          },
        ],
        grandTotal: seededProducts[22].sellingPrice * 10,
        soldBy: employee2._id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customer: 'Vanguard Offices',
        items: [
          {
            product: seededProducts[17]._id, // Ergonomic Chair
            productName: seededProducts[17].name,
            quantity: 3,
            unitPrice: seededProducts[17].sellingPrice,
            subtotal: seededProducts[17].sellingPrice * 3,
          },
          {
            product: seededProducts[18]._id, // LED Desk Lamp
            productName: seededProducts[18].name,
            quantity: 5,
            unitPrice: seededProducts[18].sellingPrice,
            subtotal: seededProducts[18].sellingPrice * 5,
          },
        ],
        grandTotal: seededProducts[17].sellingPrice * 3 + seededProducts[18].sellingPrice * 5,
        soldBy: manager1._id,
        createdAt: new Date(), // Today
      },
      {
        customer: 'Camping Gear Outlet',
        items: [
          {
            product: seededProducts[23]._id, // Camping Tent
            productName: seededProducts[23].name,
            quantity: 2,
            unitPrice: seededProducts[23].sellingPrice,
            subtotal: seededProducts[23].sellingPrice * 2,
          },
        ],
        grandTotal: seededProducts[23].sellingPrice * 2,
        soldBy: employee1._id,
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

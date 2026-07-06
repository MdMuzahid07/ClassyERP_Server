# ClassyERP Server - Inventory & Sales Management System

A robust, enterprise-grade modular monolith backend for the Mini ERP system. Built with Node.js, Express, TypeScript, MongoDB, and Socket.io.

---

## 💻 Tech Stack

- **Runtime**: Node.js & Express.js
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose (with ACID Transactions)
- **Real-Time**: Socket.io
- **Validation**: Zod
- **Security**: Helmet, HPP, Express-Rate-Limit, BCrypt, JWT Handshake Checks

---

## 🚀 Installation & Setup

1. **Clone the repository** and navigate to the `server/` directory:

   ```bash
   cd server/
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables:
   - `DB_URL`: MongoDB connection string (Requires Replica Set/Atlas for transaction support)
   - `PORT`: Port number (default `5000`)
   - `JWT_ACCESS_SECRET_KEY` & `JWT_REFRESH_SECRET_KEY`: JWT Signing Secrets
   - `LOW_STOCK_THRESHOLD`: Threshold for low stock warning triggers (default `5`)

4. **Seed Database (Production Admin)**:
   Create the default Administrator account in MongoDB:

   ```bash
   yarn seed
   ```

5. **Seed Database (Development Mock Data)**:
   Populate the database with multiple test users, products, and sales transactions:

   ```bash
   yarn seed:mock
   ```

6. **Run Development Server**:

   ```bash
   yarn dev
   ```

7. **Build for Production**:
   ```bash
   yarn build
   ```

---

## 🔌 Real-time Events (Socket.io)

The backend features real-time Socket.io updates for inventory operations. To ensure security, **all connection handshakes require a valid JWT access token**. Unauthenticated connections are rejected at the connection middleware layer.

### Client Connection Example

To connect a client to the real-time server:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_access_token_here', // Must match JWT token retrieved from REST /login
  },
});

socket.on('connect', () => {
  console.log('Connected to ClassyERP WebSocket!');
});

socket.on('connect_error', (err) => {
  console.error('Connection failed:', err.message); // e.g. "Authentication required"
});
```

---

### Real-Time Event Mappings

| Event Name          | Role Audience             | Trigger Condition                                                        | Payload Shape                                                               |
| :------------------ | :------------------------ | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **`newSale`**       | `Admin`, `Manager`        | Fired when a sale transaction is successfully committed to the database. | `{ saleId: string, grandTotal: number, soldBy: string, itemCount: number }` |
| **`stockUpdated`**  | All authenticated clients | Fired when product stock quantities decrement due to a sale.             | `{ productId: string, name: string, stockQuantity: number }`                |
| **`lowStockAlert`** | `Admin`, `Manager`        | Fired when a product's stock falls below `config.low_stock_threshold`.   | `{ productId: string, name: string, stockQuantity: number }`                |

---

## 🛠️ API Documentation (REST endpoints)

All endpoints require JWT authorization guard protection via headers (`Authorization: Bearer <token>`).

### 🔑 Authentication Module

- `POST /api/v1/auth/login` - Public login endpoint. Returns `{ token, user }`.
- `POST /api/v1/auth/users` - Admin only. Create Manager/Employee accounts.
- `GET /api/v1/auth/users` - Admin only. Search, filter, and paginate accounts.
- `PATCH /api/v1/auth/users/:id` - Admin only. Enable/disable user accounts or modify roles.
- `GET /api/v1/auth/me` - Authenticated users. Retrieve current user profile.

### 📦 Product Module

- `POST /api/v1/products` - Admin, Manager. Create product with image uploads.
- `GET /api/v1/products` - All authenticated roles. QueryBuilder-driven listing.
- `PATCH /api/v1/products/:id` - Admin, Manager. Update product.
- `DELETE /api/v1/products/:id` - Admin, Manager. Deletes product and removes disk asset.

### 💰 Sales Module

- `POST /api/v1/sales` - All authenticated roles. Create transactional sale record.
- `GET /api/v1/sales` - Admin, Manager. Retrieve paginated sales history.

### 📊 Dashboard Module

- `GET /api/v1/dashboard` - Admin, Manager. Retrieve total stats (products count, sales count, low stock warnings).

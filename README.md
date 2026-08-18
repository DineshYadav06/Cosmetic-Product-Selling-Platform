# Cosmetic Product Selling Platform

A modern e-commerce platform for cosmetic products with comprehensive features for both customers and administrators.

## 📋 Features

### Customer Features
- **User Authentication**: Secure registration, login, and password reset.
- **Product Discovery**:
  - Browse products by category.
  - Search products by name.
  - Detailed product pages with images, descriptions, and reviews.
- **Shopping Cart**:
  - Add/remove products.
  - Update quantities.
  - Automatic price calculation.
- **Order Management**:
  - Place orders with shipping information.
  - Track order status (Pending, Processing, Shipped, Delivered, Cancelled).
  - View order history.
- **User Profile**:
  - Update profile information.
  - Manage shipping addresses.
- **Product Interaction**:
  - Add products to wishlist.
  - Write and view product reviews and ratings.

### Admin Features
- **Admin Dashboard**: Overview of sales, orders, and products.
- **Product Management**:
  - Create, update, and delete products.
  - Upload product images.
  - Manage product categories.
- **Order Management**:
  - View all orders.
  - Update order status.
  - Manage cancellations.
- **User Management**:
  - View and manage customer accounts.
- **Review Management**:
  - Moderate and manage product reviews.

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
- Node.js (v14 or higher)
- npm (or yarn)
- MongoDB instance running locally or a MongoDB Atlas connection string

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cosmetic-Product-Selling-Platform
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

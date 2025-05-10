# Cosmetics E-commerce Platform

This is a full-featured e-commerce platform for selling cosmetics, built with Spring Boot (backend) and designed to work with a React frontend.

## Features

- **Authentication & Authorization**
  - JWT-based secure authentication
  - Role-based access control (Admin & Customer)
  - User registration and login

- **Product Management**
  - Categories and products
  - Product search and filtering
  - Inventory management

- **Shopping Experience**
  - Shopping cart functionality
  - Checkout process
  - Order tracking

- **Administration**
  - Dashboard for administrators
  - Order management
  - Sales analytics

## Technology Stack

- **Backend**
  - Spring Boot 3.x
  - Spring Security with JWT Authentication
  - Spring Data JPA
  - MySQL Database
  - Maven

- **Development Tools**
  - Java 21
  - XAMPP (for MySQL)

## Getting Started

### Prerequisites

- Java 21
- Maven
- XAMPP (or MySQL 8.x)

### Database Setup

1. Start XAMPP and ensure MySQL service is running on port 3306
2. The application will automatically create the database `cosmetics_db` on first run

### Running the Application

1. Clone the repository
2. Navigate to the project root directory
3. Build the project:
   ```
   mvn clean install
   ```
4. Run the application:
   ```
   mvn spring-boot:run
   ```
5. The API will be available at `http://localhost:8080`

## API Documentation

Detailed API documentation is available in the [API.txt](API.txt) file, which includes:
- All endpoints with full URL paths
- HTTP methods
- Request parameters
- Example response formats
- Authorization requirements

## Initial Admin Setup

On first run, an admin user will be created with the following credentials:
- Username: admin
- Password: admin123

It is recommended to change these credentials immediately after first login.

## Future Enhancements

- Integration with payment gateways
- Customer reviews and ratings
- Wishlist functionality
- Product recommendations
- Email notifications 
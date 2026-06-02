# Hotel Management System

A full-stack hotel management system built using:

- React.js
- Django
- Django REST Framework
- PostgreSQL

## Features

- Room booking
- Food ordering
- Function hall booking
- Vehicle booking
- Driver allocation
- Payments
- Admin dashboard

## Assignment Alignment

This project demonstrates the core requirements from the backend developer intern brief:

- User registration and login with hashed passwords and JWT authentication
- Role-based access for customer and admin-like users
- CRUD APIs for rooms and food items
- React frontend for login, protected dashboard, and entity management
- Swagger/OpenAPI documentation endpoint
- Versioned API namespace under `/api/v1/` with a legacy `/api/` alias
- Postman collection export in `docs/postman_collection.json`

## Scalability Note

The backend is organized as modular Django apps, which makes it straightforward to add new domains like bookings, payments, or support tools without coupling everything into one module.

For future scaling, the next practical steps are:

- Versioned API namespace is implemented under `/api/v1/`
- A Postman collection export is included in `docs/postman_collection.json`
- Introduce Redis caching for frequent reads like rooms and menu items
- Add structured logging and Docker-based deployment
- Export a Postman collection for easier API sharing and testing

## Project Structure

frontend/
backend/
docs/


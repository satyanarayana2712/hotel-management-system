# Project vs Assignment Checklist

This checklist compares the current Hotel Management System against the backend intern assignment brief.

## Legend
- [x] Done in the current project
- [~] Partial or needs confirmation
- [ ] Not implemented yet

## Backend Core
- [x] User registration API with password hashing
- [x] User login API with JWT authentication
- [x] Role-based access for user vs admin-like accounts
- [x] CRUD API for rooms
- [x] CRUD API for food items
- [x] Validation and error responses in the main auth/CRUD flows
- [x] Swagger/OpenAPI docs endpoint
- [x] PostgreSQL-backed schema and models
- [x] API versioning
  - Current routes are exposed under `/api/v1/...`
  - Legacy `/api/...` paths are still available for backward compatibility

## Frontend Support UI
- [x] Register screen
- [x] Login screen
- [x] JWT-protected dashboard
- [x] Admin dashboard view
- [x] Room CRUD UI for admin users
- [x] Food CRUD UI for admin users
- [x] Success and error messaging from API responses
- [x] Customer booking and food ordering flows remain available

## Security and Scalability
- [x] JWT stored and used for authenticated requests
- [x] Passwords are hashed through Django auth
- [x] Input validation exists in the API layer
- [~] Scalable module structure
  - Project is modular by app, but could still be tightened further with shared service/permission helpers
- [ ] Redis caching
- [ ] Structured logging
- [ ] Docker deployment files

## Deliverables
- [x] Backend project structure in GitHub workspace
- [x] Working authentication APIs
- [x] Working CRUD APIs for the entity layer
- [x] Basic frontend UI connected to APIs
- [x] Swagger docs route available
- [ ] Short scalability note in README
- [x] Postman collection export

## Quick Gap Summary
- Biggest remaining gaps: Redis/logging/Docker
- API versioning is now implemented with a `/api/v1/` namespace
- Postman collection is available at `docs/postman_collection.json`
- Main assignment requirements are otherwise covered by the current codebase

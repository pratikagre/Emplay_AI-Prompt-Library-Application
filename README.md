# AI Prompt Library

A full-stack web application designed to manage, archive, and display AI Image Generation Prompts.



## 📸 Screenshots

<img width="1917" height="865" alt="image" src="https://github.com/user-attachments/assets/59df7136-c520-4662-9690-663a2885a9e2" /><img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/f3f3310d-b7a0-451e-b680-a38a728f5a1a" /><img width="1902" height="867" alt="image" src="https://github.com/user-attachments/assets/872f4760-e7a2-489c-8e9d-bcbd13e98d67" />

## Architecture & Tech Stack

This project is built using:
- **Frontend**: React 18, TypeScript, Vite, React Router, custom CSS variables for design.
- **Backend**: Python, Django 4.x (Core Django without DRF as requested).
- **Database**: PostgreSQL for persistent prompt storage.
- **Cache / Counter**: Redis cache to keep track of real-time view counts efficiently.
- **Containerization**: Docker & Docker Compose to simplify local environment setup.

## Setup Instructions

### Prerequisites
Make sure you have Docker and Docker Compose installed on your system.

### Running Locally
To run the full stack locally with only one command:
```bash
docker-compose up --build
```

Wait a few moments for the database to start, the Django backend to apply initial migrations, and the frontend to compile using Vite.

Once everything is up and running, you can access the application components:
- **Frontend interface**: http://localhost:5173
- **Backend API endpoints**: http://localhost:8000/api/prompts/

## Endpoints Summary

- `GET /api/prompts/` - Returns a JSON array containing all available prompts (ordered by most recent).
- `POST /api/prompts/` - Creates a new prompt based on JSON payload `{title, content, complexity}`. Enforces data validation according to rules.
- `GET /api/prompts/:id/` - Retrieves a single prompt by its UUID. Automatically increments the read counter on Redis and serves back the live `view_count` on response.

## Assumptions & Trade-offs
- Used React/Vite in place of Angular to bootstrap a very lightweight SPA while maintaining TS static typing.
- Kept UI minimalistic but modern, leveraging glassmorphism and subtle gradients instead of heavier component libraries, for a premium look with raw CSS.
- Added a fallback on Redis incrementer, where if Redis instance is unavailable, the user can still be served a view count of 0 without crashing the view.

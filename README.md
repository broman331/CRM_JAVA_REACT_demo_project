# PrimeCRM (Demo Project)

A Modular Monolith CRM application built with **Spring Boot** (Backend) and **React** (Frontend).

## 🚀 Features

### **Authentication & Security**
- **JWT Authentication** with stateless session management.
- **Role-Based Access Control (RBAC)**:
    - **Admin**: Full access, including deletion and user management.
    - **Sales Rep**: Standard access to contacts, deals, and activities.
- Secure password handling with BCrypt.

### **Core Modules**
1.  **Contacts Management**:
    - Create, Read, Update, Delete (CRUD) contacts.
    - Associate contacts with Companies.
    - Advanced filtering (Search by name, email, etc.).
2.  **Company Management**:
    - Manage business entities with industry, website, and contact details.
3.  **Sales Pipeline (Deals)**:
    - Kanban-style pipeline stages (Lead -> Qualified -> Closed Won).
    - Track deal value and probability.
    - Loose coupling with Contacts via UUID references.
4.  **Activity Timeline**:
    - Track calls, meetings, and tasks.
    - Visual timeline on Contact/Deal pages.
5.  **Analytics Dashboard**:
    - Real-time charts for Revenue, Pipeline distribution, and Activity volume.
    - **Optimization**: Cached statistics for sub-100ms load times.

### **Performance Optimizations (Phase 5)**
- **Backend**:
    - **Database Indexing**: Optimized frequently queried columns.
    - **Caching**: Caffeine integrations for dashboard stats.
    - **Query Tuning**: Solved N+1 problems using `@EntityGraph`.
- **Frontend**:
    - **Lazy Loading**: Route-based code splitting using `React.lazy` and `Suspense`.
    - **Bundle Optimization**: Minimized initial load size.
    - **Benchmarks**: Page Load < 150ms, FCP < 500ms.

---

## 🛠️ Tech Stack

### **Backend**
- **Language**: Java 21
- **Framework**: Spring Boot 3.2 (Modular Monolith architecture with Spring Modulith)
- **Database**: PostgreSQL 16
- **Testing**: JUnit 5, Mockito, Testcontainers

### **Frontend**
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **UI Component Library**: Shadcn UI (Tailwind CSS)
- **Testing**: Playwright (E2E & Component)

---

## 🏁 Getting Started

### **Prerequisites**
- Java 21+
- Node.js 18+
- Docker & Docker Compose

### **1. Clone the Repository**
```bash
git clone https://github.com/broman331/CRM_JAVA_REACT_demo_project.git
cd CRM_JAVA_REACT_demo_project
```

### **2. Run with Docker (Recommended)**
The entire application (Database + Backend + Frontend) can be run with a single command:
```bash
docker-compose up --build -d
```
- **Frontend**: http://localhost
- **Backend API**: http://localhost:9090
- **Database**: Port 5433

### **3. Run Locally (Manual)**
Run each component separately for development.

**Database**:
```bash
docker-compose up db -d
```

**Backend**:
Navigate to the `backend` folder:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

**Frontend**:
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests

### **Backend Tests**
Run unit and integration tests using Maven:
```bash
cd backend
./mvnw test
```

### **Frontend & E2E Tests**
Run Playwright tests for end-to-end flows:
```bash
cd frontend
npx playwright test
```

### **Performance Tests**
Run the automated benchmark suite:
```bash
cd frontend
npx playwright test tests/performance/benchmark.spec.ts
```

### **Load Testing (Locust)**
A Python Locust script is available in `performance/locustfile.py`.

---

## 👤 Default Credentials

The system comes seeded with an Admin user for testing:

- **Email**: `admin@example.com`
- **Password**: `admin123`

To reset/seed data manually:
```bash
curl -X POST http://localhost:9090/api/test/seed-admin
```
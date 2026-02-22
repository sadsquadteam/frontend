# Architecture Document: Lost and Found

| **Document Title** | Lost and Found University Platform - Architecture Document |
| ------------------ | ---------------------------------------------------------- |
| **Version**        | 1.0                                                        |
| **Date**           | 2026                                                       |
| **Status**         | Draft                                                      |

---

## 1. Introduction

### 1.1 Purpose

This document describes the software architecture of the Lost and Found System. It provides a comprehensive overview of the system, including its components, interactions, technologies, and design decisions. The document is intended for developers, project managers, testers, and maintainers of the system.

### 1.3 Scope

This architecture document covers:

- Overall system architecture and design principles
- Frontend architecture, components, and technologies
- Backend API integration points
- Data flow and state management
- Security considerations
- Deployment architecture
- Key technical decisions and trade-offs

### 1.4 Definitions and Acronyms

| **Term** | **Definition**                    |
| -------- | --------------------------------- |
| API      | Application Programming Interface |
| JWT      | JSON Web Token                    |
| OTP      | One-Time Password                 |
| SPA      | Single Page Application           |
| UI/UX    | User Interface / User Experience  |
| CSR      | Client-Side Rendering             |

---

## 2. Project Overview

### 2.1 Project Goal

The Lost and Found University System aims to replace traditional Telegram groups for finding lost items within the university environment by providing a centralized, map-based, intelligent system. The platform structures information and streamlines the search process through an interactive map, smart search, and automated monitoring. The purpose of this project is to design and implement a map-based web platform to replace informal messaging groups used for locating lost and found items within a university environment. The system structures lost-item information, improves discoverability, and accelerates the recovery process through spatial visualization.

### 2.2 System Goals

Provide a centralized platform for lost and found items

Enable location-based discovery using an interactive map

Reduce item discovery time

### 2.3 Key Features & Project Scope

- **Interactive Map Module**:
  - Item location display with pin clustering
  - Visual filtering capabilities
  - New item registration via map hold gesture
  - Zoom functionality with dynamic pin scaling
  - Offline map support

- **Content and User Management Module**:
  - Personal advertisement management panel
  - Two-factor authentication (OTP) for registration
  - Automated reporting system (content removal after 5 violation reports)

- **Interaction Module**:
  - Commenting on items
  - Standardized tagging system

- **Out of Scope**:
  - Native mobile application
  - Integration with university central authentication system
  - AI search

### 2.4 Stakeholders

- **Primary Users**:
  - University students
  - Academic staff
  - University employees

- **Internal Stakeholders**:
  - Development Team
  - Project Supervisor / Client

### 2.5 Functional Requirements

- Users can register and authenticate securely.
- Users can create lost or found item entries.
- Users can search items using map.
- Users can interact through comments.
- Users can report inappropriate content.
- System automatically moderates reported items.

### 2.6 Non-Functional Requirements

- Performance: Search results returned < 30 seconds
- Usability: Map-first intuitive interface
- Reliability: Continuous map availability
- Security: OTP authentication & moderated content

---

## 3. System Architecture Overview

### 3.1 High-Level Architecture

The system follows a modern client-server architecture with a clear separation between frontend and backend components:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   React     │  │   Leaflet   │  │   Service   │          │
│  │    SPA      │  │     Maps    │  │   Worker    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              │ JSON
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Server                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Django    │  │   Django    │  │   Database  │          │
│  │   REST API  │  │    Auth     │  │   (SQLite)  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Architecture Characteristics

| **Characteristic**    | **Approach**                         |
| --------------------- | ------------------------------------ |
| **Deployment**        | Separated frontend/backend           |
| **Frontend**          | Single Page Application (SPA)        |
| **Rendering**         | Client-Side Rendering (CSR)          |
| **State Management**  | Component-level state + localStorage |
| **API Communication** | REST over HTTPS                      |
| **Authentication**    | JWT-based with token refresh         |

#### Architectural Style

The system adopts:

- **Layered Architecture**
- **Service-Oriented Backend**
- **Map-Centric Interaction Model**

This approach enables:

- Independent evolution of services
- Maintainable feature expansion

### 3.3 System Architecture Overview

#### Frontend Application

**Responsibilities:**

- Map visualization
- User interaction
- Item submission workflows

#### Backend Services

**Responsibilities:**

- Business logic processing
- Authentication & authorization
- Item management
- Reporting & moderation
- API exposure

#### Database

**Responsibilities:**

- User data storage
- Item metadata
- Location information
- Interaction records

#### Map Service

**Responsibilities:**

- Geographic rendering
- Location indexing
- Spatial queries

#### Data Architecture

Stored entities include:

- Users
- Items (Lost / Found)
- Locations
- Reports
- Comments
- Tags

Each item contains geospatial coordinates enabling spatial search and clustering.

#### Authentication & Authorization

- OTP-based authentication during registration
- Secure session/token management
- Role-based access control for moderation actions

#### Interaction & Moderation Flow

- User publishes item
- Other users interact or comment
- Reports are submitted
- System automatically removes content after threshold violations

#### Performance & Scalability Strategy

- **Map pin clustering** reduces rendering load
- **Search optimization** prioritizes relevant results
- **Modular services** allow independent scaling
- **Cached frequently accessed** map data

#### Deployment Overview

**Initial deployment target:**

- Web-based deployment
- Cloud-hosted backend services
- Centralized database
- Continuous deployment support

_(Environment separation planned: Development / Production)_

#### Risks & Technical Challenges

- **High map rendering load** during peak usage
- **Moderation false positives**
- **Location data consistency**

#### Future Evolution

**Planned future extensions:**

- AI search
- Advanced recommendation system

---

## 4. Frontend Architecture

### 4.1 Technology Stack

| **Category**        | **Technology**        | **Version** | **Purpose**                                       |
| ------------------- | --------------------- | ----------- | ------------------------------------------------- |
| **Core Framework**  | React                 | 19.2.0      | UI library for building component-based interface |
| **Routing**         | React Router DOM      | 7.11.0      | Client-side navigation and route management       |
| **Maps**            | Leaflet               | 1.9.4       | Interactive map rendering                         |
|                     | React-Leaflet         | 5.0.0       | React bindings for Leaflet                        |
|                     | Leaflet.markercluster | 1.5.3       | Marker clustering for performance                 |
| **Styling**         | Bootstrap             | 5.3.8       | CSS framework for responsive design               |
|                     | React-Bootstrap       | 2.10.10     | React components for Bootstrap                    |
|                     | Custom CSS            | -           | Component-specific styling                        |
| **Icons**           | React Icons           | 5.5.0       | Icon library                                      |
|                     | Font Awesome          | 7.1.0       | Icon set                                          |
| **Build Tool**      | Vite                  | 7.2.4       | Fast development server and build tool            |
| **Linting**         | ESLint                | 9.39.1      | Code quality and consistency                      |
| **Offline Support** | Service Worker        | -           | Map tile caching for offline use                  |

### 4.2 Project Structure

```
src/
├── assets/
│   └── images/           # SVG icons, logos, animations
├── components/
│   ├── Header/           # Header component with search
|   |   ├── Header.jsx
|   |   ├── SearchBar.jsx
│   ├── Items/            # Item-related components
│   │   ├── AddItemForm.jsx
│   │   ├── FilterItemForm.jsx
│   │   ├── ItemCard.jsx
│   │   ├── ItemDetail.jsx
│   │   └── ItemsGrid.jsx
│   ├── Map/              # Map components
│   │   ├── Map.jsx
│   │   ├── MapComponents.jsx
│   │   ├── mapUtils.js
│   │   └── useHoldToAddMarker.js
│   └── Sidebar/          # Navigation sidebar
│       ├── Sidebar.jsx
│       └── SidebarNav.jsx
├── pages/
│   ├── Auth/             # Authentication pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Items/            # Item management pages
│   │   ├── AddItemPage.jsx
│   │   ├── EditItemPage.jsx
│   │   ├── ItemDetailPage.jsx
│   │   └── ItemsPage.jsx
│   └── Dashboard.jsx     # Main dashboard with map
├── services/
│   ├── api.js            # API client and services
│   └── service-worker.js # Offline caching
├── styles/               # CSS modules and global styles
├── App.jsx               # Main application component
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

### 4.3 Component Architecture

The frontend follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                             │
│                      (Router Setup)                         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Dashboard   │    │  ItemsPage    │    │   Auth Pages  │
│   (Map View)  │    │  (Grid View)  │    │ (Login/Reg)   │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌───────────────┐
│   Sidebar     │    │    Header     │
│  (Navigation) │    │   (Search)    │
└───────────────┘    └───────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌───────────────┐
│   SimpleMap   │    │  ItemsGrid    │
│ (Interactive) │    │   (Cards)     │
└───────────────┘    └───────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌───────────────┐
│Map Components │    │  ItemCard     │
│  (Modal/Menu) │    │   (Detail)    │
└───────────────┘    └───────────────┘
```

### 4.4 Key Component Responsibilities

| **Component**          | **Responsibilities**                                                     |
| ---------------------- | ------------------------------------------------------------------------ |
| **App.jsx**            | Route configuration, global layout setup                                 |
| **Dashboard**          | Main layout with map, authentication state management                    |
| **Sidebar**            | Navigation, filter modal trigger, logout functionality                   |
| **Header**             | Search input handling, authentication-based rendering                    |
| **SimpleMap**          | Core map functionality, marker management, clustering, location services |
| **MapComponents**      | UI overlays for map (modals, side menus, full-screen views)              |
| **useHoldToAddMarker** | Custom hook for long-press marker creation (5-second hold)               |
| **ItemsGrid**          | Grid display of all items with cards                                     |
| **ItemCard**           | Individual item preview with navigation to details                       |
| **ItemDetail**         | Full item details with edit/delete capabilities                          |
| **AddItemForm**        | Form for creating/editing items with tag selection, image upload         |
| **FilterItemForm**     | Filter interface for tags and status                                     |
| **Auth Pages**         | User registration (with OTP) and login                                   |

### 4.5 State Management

The application uses a hybrid approach to state management:

| **State Type**     | **Management Approach**    | **Location**                                |
| ------------------ | -------------------------- | ------------------------------------------- |
| **Authentication** | localStorage + React state | App-level, propagated via props             |
| **User Profile**   | localStorage + React state | Dashboard, passed to children               |
| **Map Markers**    | React useState             | SimpleMap component                         |
| **Search Query**   | React useState             | Dashboard → Header → Map                    |
| **Filters**        | React useState             | Dashboard → SidebarNav → Map                |
| **Form Data**      | React useState             | Individual form components                  |
| **UI State**       | React useState             | Component-specific (modal open/close, etc.) |

### 4.6 Authentication Flow

```
┌──────────┐     ┌────────────┐     ┌──────────┐     ┌──────────┐
│ Register │───▶│  OTP       │───▶│  Login   │───▶│Dashboard │
│  (Email) │     │Verification│     │ (JWT)    │     │          │
└──────────┘     └────────────┘     └──────────┘     └──────────┘
                                                          │
                                                          ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Token   │◀───│  Token   │◀───│   API    │◀───│   User   │
│ Refresh  │     │  Storage │     │  Request │     │  Action  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### 4.7 API Integration Layer

The `services/api.js` provides a centralized API client with:

- **Base API Request Function**: Handles HTTP methods, headers, error parsing
- **Token Service**: Manages JWT storage and retrieval from localStorage
- **Authentication API**: Registration (2-step OTP), login, profile, logout, token refresh
- **Items API**: CRUD operations with authentication wrapper (`withAuth`)
- **Automatic Token Refresh**: Intercepts 401 responses and attempts refresh

```javascript
// API Request Flow
apiRequest(endpoint, method, data, token)
    └─► fetch with appropriate headers
        └─► Response handling
            ├─► Success → return parsed JSON
            └─► Error → parse error message, throw
```

### 4.8 Map Module Architecture

The map module is the core feature of the application:

```
┌─────────────────────────────────────────────────────────────┐
│                        SimpleMap                            │
├─────────────────────────────────────────────────────────────┤
│ - markers: Array                                            │
│ - selectedItem: Object                                      │
│ - userLocation: [lat, lng]                                  │
│ - currentZoom: number                                       │
├─────────────────────────────────────────────────────────────┤
│ + loadExistingItems()                                       │
│ + handleMarkerClick()                                       │
│ + goToMyLocation()                                          │
│ + handleMapMouseDown() (starts hold)                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ LocationMarker│    │MapController  │    │ClusterEventHandler
│ (Geolocation) │    │Center Control │    │(Zoom Tracking)│
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌───────────────────┐
                    │ MarkerClusterGroup│
                    │ (with clustering  │
                    │  and custom icons)│
                    └───────────────────┘
```

#### Key Map Features

- **Marker Clustering:** Dynamic cluster radius based on zoom level
- **Custom Cluster Icons:** Color-coded borders showing status distribution
- **Status-based Markers:** Blue (found), Red (lost), Green (delivered)
- **Long-press Creation:** 5-second hold on map to add new item
- **User Geolocation:** Real-time location tracking with blue dot
- **Offline Support:** Service worker caches map tiles

### 4.9 Custom Hook: useHoldToAddMarker

```javascript
useHoldToAddMarker
├── State: holdProgress, pendingMarkerPosition, showAddItemModal
├── startHold(lat, lng)
│ ├── Sets hold start time
│ ├── Starts progress interval (updates every 100ms)
│ └── Sets timeout for 5000ms to show modal
├── cancelHold()
│ ├── Clears timers
│ └── Resets progress
└── handleItemCreated()
└── Adds new marker to map
```

### 4.10 Routing Structure

| Route             | Component                | Description                  |
| ----------------- | ------------------------ | ---------------------------- |
| `/`               | Navigate to `/dashboard` | Root redirect                |
| `/dashboard`      | `Dashboard`              | Main map interface           |
| `/items`          | `ItemsPage`              | Grid view of all items       |
| `/items/:id`      | `ItemDetailPage`         | Single item details          |
| `/items/:id/edit` | `EditItemPage`           | Edit existing item           |
| `/add-item`       | `AddItemPage`            | Create new item              |
| `/register`       | `Register`               | User registration (with OTP) |
| `/login`          | `Login`                  | User login                   |
| `*`               | Navigate to `/dashboard` | 404 fallback                 |

---

### 5. Backend Architecture

TODO

### 6. Security Considerations

### 6.1 Authentication Security

- **JWT Tokens:** Stored in localStorage (accessible to JavaScript)
- **Token Refresh:** Automatic refresh mechanism to maintain sessions
- **OTP Verification:** Two-step registration process
- **Logout:** Tokens invalidated on backend via logout endpoint

### 6.2 Data Security

- **HTTPS:** All API communications should be over HTTPS
- **Input Validation:** Frontend validation with backend double-checking
- **File Uploads:** Image uploads with proper validation

### 6.3 Content Moderation

- **Reporting System:** Content auto-removal after 5 reports (as per requirements)
- **User-based Actions:** Edit/delete restricted to item owners

### 7. Performance Considerations

### 7.1 Map Performance Optimizations

| Optimization           | Implementation                                            |
| ---------------------- | --------------------------------------------------------- |
| Marker Clustering      | `Leaflet.markercluster` with dynamic radius based on zoom |
| Chunked Loading        | `chunkedLoading: true` for large marker sets              |
| Zoom-based Clustering  | Disable clustering at zoom level 18+                      |
| Custom Cluster Icons   | Lightweight div icons instead of images                   |
| Service Worker Caching | Offline tile caching for repeat visits                    |

### 7.2 Bundle Optimization

- **Vite Build Tool:** Fast builds and optimized production bundles
- **Code Splitting:** React Router handles route-based code splitting
- **Lazy Loading:** Potential for implementing lazy loading on routes

### 8. Future Considerations

### 8.1 Scalability Improvements

- Implement Redux or Context API for global state management
- Add pagination/infinite scroll for items grid
- Implement WebSocket for real-time updates
- Move to cloud storage for images (S3, Cloudinary)

### 8.2 Feature Additions

- Image-based search via chatbot
- Push notifications
- Advanced analytics dashboard

### 8.3 Performance Enhancements

- Implement `React.lazy` for route-based code splitting
- Add image optimization and lazy loading
- Implement virtual scrolling for large marker sets
- Add performance monitoring

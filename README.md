# Appoi - Doctor Appointment Booking System

## Overview

Appoi is a modern doctor appointment booking system built with Next.js, Prisma, and PostgreSQL. It provides a seamless experience for patients to book appointments with doctors without requiring user registration, while offering powerful management tools for doctors, secretaries, and administrators.

## Features

### For Patients
- **No Registration Required**: Book appointments with just a name and phone number
- **Real-time Availability**: See available slots in real-time
- **Doctor Search**: Find doctors by city, specialty, or name
- **SEO-Optimized Pages**: Each doctor has a dedicated page optimized for search engines

### For Doctors & Secretaries
- **Appointment Management**: View, confirm, or cancel appointments
- **Slot Management**: Create and manage availability slots
- **Dashboard**: View statistics and upcoming appointments

### For Administrators
- **User Management**: Create and manage users (doctors, secretaries, admins)
- **City & Clinic Management**: Manage cities and clinics in the system
- **System Overview**: Access comprehensive analytics

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT and role-based access
- **State Management**: React Context API
- **UI/UX**: Responsive design with dark/light mode support
- **Date Handling**: Day.js with Jalali (Persian) calendar support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Yarn package manager

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` (if not already present) and configure:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/appoi?schema=public"
   AUTH_SECRET="your-generated-secret-here"
   ```

### Installation

```bash
# Install dependencies
yarn

# Generate Prisma client
yarn prisma generate

# Run database migrations
yarn prisma migrate dev

# Seed the database with initial data
yarn db:seed

# Start the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── actions/      # Server Actions
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── api/          # API routes
│   │   ├── doctors/      # Doctor listing and detail pages
│   ├── components/       # React components
│   │   ├── secretary/    # Secretary-specific components
│   │   ├── ui/           # UI components (shadcn/ui)
│   ├── lib/              # Utility functions and shared code
│   │   ├── store/        # State management
│   ├── types/            # TypeScript type definitions
├── auth.ts               # NextAuth configuration
```

## Authentication and Authorization

The application uses NextAuth.js for authentication with the following roles:
- **SECRETARY**: Manages appointments for assigned doctors
- **DOCTOR**: Views their own appointments and profile
- **ADMIN**: Manages users, cities, and clinics
- **SUPERADMIN**: Full system access

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- **User**: Authentication and role management
- **Doctor**: Doctor profiles with specialties and clinic association
- **Secretary**: Manages appointments for doctors
- **Clinic**: Physical locations grouped by city
- **City**: Geographical organization of clinics
- **AvailabilitySlot**: Time slots when doctors are available
- **Appointment**: Booked appointments with patient information

## Remaining Tasks for Production Readiness

1. **Security Enhancements**:
   - [ ] Implement rate limiting for appointment booking API endpoints
   - [ ] Add CSRF protection to all forms
   - [ ] Configure Content Security Policy headers
   - [ ] Secure the AUTH_SECRET in production using environment variables
   - [ ] Implement proper error handling that doesn't expose sensitive information
   - [ ] Add input validation for all user inputs
   - [ ] Set up security headers (X-Content-Type-Options, X-Frame-Options, etc.)
   - [ ] Implement proper CORS configuration

2. **Performance Optimization**:
   - [ ] Implement caching for doctor listings and availability data
   - [ ] Add pagination for large data sets (doctors, appointments, etc.)
   - [ ] Optimize database queries with proper indexing
   - [ ] Configure proper Next.js caching strategies
   - [ ] Implement image optimization for doctor profiles
   - [ ] Add lazy loading for components below the fold
   - [ ] Set up a CDN for static assets
   - [ ] Optimize bundle size with code splitting

3. **Feature Completion**:
   - [ ] Implement online payment integration
   - [ ] Add email/SMS notifications for appointments (confirmation, reminder, cancellation)
   - [ ] Create a patient portal for appointment history and management
   - [ ] Add reporting and analytics features for admins
   - [ ] Implement doctor rating and review system
   - [ ] Add search filters for finding doctors by specialty, location, and availability
   - [ ] Create a waitlist feature for fully booked doctors
   - [ ] Implement a rescheduling workflow for appointments

4. **DevOps Setup**:
   - [ ] Configure CI/CD pipeline with GitHub Actions or similar
   - [ ] Set up monitoring and logging with tools like Sentry or LogRocket
   - [ ] Create backup and disaster recovery plan for the database
   - [ ] Implement staging environment for testing before production
   - [ ] Set up automated database migrations in deployment pipeline
   - [ ] Configure health checks and auto-scaling if needed
   - [ ] Implement infrastructure as code using Terraform or similar
   - [ ] Set up proper environment variable management

5. **Testing**:
   - [ ] Add unit tests for critical components and utilities
   - [ ] Implement integration tests for booking flow
   - [ ] Set up end-to-end testing with Cypress or Playwright
   - [ ] Perform security audits and penetration testing
   - [ ] Add load testing for high-traffic scenarios
   - [ ] Implement API tests for all endpoints
   - [ ] Set up visual regression testing
   - [ ] Create test fixtures and mocks for development

6. **Documentation**:
   - [ ] Create API documentation with Swagger or similar
   - [ ] Add inline code documentation for complex functions
   - [ ] Create user manuals for different roles (admin, doctor, secretary)
   - [ ] Document database schema and relationships
   - [ ] Create deployment and environment setup guide
   - [ ] Add contributing guidelines for developers
   - [ ] Document testing procedures and requirements
   - [ ] Create troubleshooting guide for common issues

7. **Localization**:
   - [ ] Complete Persian (Farsi) translations for all UI elements
   - [ ] Add support for multiple languages (English, Arabic, etc.)
   - [ ] Implement RTL layout support for Arabic and Persian
   - [ ] Create a language switcher component
   - [ ] Ensure date/time formats are localized correctly
   - [ ] Localize error messages and notifications
   - [ ] Add culture-specific formatting for phone numbers
   - [ ] Test UI with different language content lengths

8. **Accessibility**:
   - [ ] Ensure WCAG 2.1 AA compliance
   - [ ] Improve keyboard navigation throughout the application
   - [ ] Add screen reader support with proper ARIA attributes
   - [ ] Ensure sufficient color contrast for all UI elements
   - [ ] Add focus indicators for interactive elements
   - [ ] Implement skip navigation links
   - [ ] Test with screen readers and assistive technologies
   - [ ] Create an accessibility statement page

9. **Mobile Optimization**:
   - [ ] Ensure responsive design works on all device sizes
   - [ ] Optimize touch targets for mobile users
   - [ ] Implement mobile-specific UI improvements
   - [ ] Test on various mobile devices and browsers
   - [ ] Add offline capabilities for basic functionality
   - [ ] Optimize performance on low-end devices
   - [ ] Consider developing a Progressive Web App (PWA)
   - [ ] Add mobile-specific features (click-to-call, maps integration)

10. **Business Continuity**:
    - [ ] Create a data retention and privacy policy
    - [ ] Implement GDPR and other privacy regulation compliance
    - [ ] Set up automated backups with point-in-time recovery
    - [ ] Create a business continuity plan for outages
    - [ ] Implement audit logging for sensitive operations
    - [ ] Set up uptime monitoring and alerting
    - [ ] Create incident response procedures
    - [ ] Document system dependencies and failure modes

## License

[MIT](LICENSE)

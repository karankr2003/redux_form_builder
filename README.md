# Redux Form Builder

A powerful form builder application built with Next.js, React, Redux Toolkit, and Material-UI. Create and manage dynamic forms with ease, complete with validation rules and custom field types.

## Features

- 📋 Multiple field types (text, number, textarea, select, radio, checkbox, date)
- 🔍 Real-time form preview
- ✅ Form validation with custom rules
- 🎨 Material-UI based UI components
- 🔄 Redux-powered state management
- 📱 Responsive design

## Tech Stack

- **Frontend Framework**: Next.js 15.4.6 (App Router)
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit
- **Form Handling**: Custom form builder components
- **Type Safety**: TypeScript
- **Styling**: Emotion (via MUI)

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager

## Live Demo

Check out the live demo of the application: [Redux Form Builder on Netlify](https://redux-form-builder.netlify.app/)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/karankr2003/redux_form_builder.git
   cd redux_form_builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  app/                  # Next.js 13+ App Router
    create/             # Form creation page
    page.tsx            # Home page
  components/           # Reusable components
    form-builder/       # Form builder components
  types/                # TypeScript type definitions
  store/                # Redux store configuration
  utils/                # Utility functions
```

## Dependencies

### Main Dependencies
- `next`: 15.4.6
- `react`: 19.1.0
- `react-dom`: 19.1.0
- `@reduxjs/toolkit`: ^2.8.2
- `react-redux`: ^9.2.0
- `@mui/material`: ^7.3.1
- `@mui/icons-material`: ^7.3.1
- `@mui/x-date-pickers`: ^8.10.0

### Development Dependencies
- `typescript`: ^5
- `@types/node`: ^20
- `@types/react`: ^19
- `@types/react-dom`: ^19
- `tailwindcss`: ^4

# Fellini164 - React Boilerplate 🚀

A modern, production-ready React + Redux + Tailwind CSS boilerplate with best practices, feature-rich setup, and comprehensive documentation.

## ✨ Features

- **React 19.2.0** - Latest React with concurrent features and hooks
- **Redux Toolkit 2.11.2** - Simplified Redux state management with async thunks
- **Tailwind CSS 4.1.18** - Utility-first CSS framework for rapid UI development
- **Vite 7.2.4** - Lightning-fast build tool and development server with HMR
- **React Router v7.11.0** - Latest client-side routing with data APIs
- **ESLint & Prettier** - Code quality and formatting tools with best practices
- **Axios 1.13.2** - Promise-based HTTP client with interceptors
- **Lucide React** - Modern icon library
- **Modular Architecture** - Feature-based structure for scalability
- **Comprehensive Documentation** - 15,000+ lines of detailed documentation
- **Production-Ready** - Enterprise-grade code standards and patterns

## � Comprehensive Documentation

**NEW!** Complete documentation suite available in the `/docs` folder:

- 📋 [**Project Overview**](./docs/PROJECT_OVERVIEW.md) - Complete project introduction
- 🏗️ [**Architecture**](./docs/ARCHITECTURE.md) - System design and patterns
- 🔌 [**API Documentation**](./docs/API_DOCUMENTATION.md) - API services guide
- 🎨 [**Component Library**](./docs/COMPONENT_LIBRARY.md) - UI components reference
- 🚀 [**Development Guide**](./docs/DEVELOPMENT_GUIDE.md) - Setup and workflow
- 📐 [**Code Standards**](./docs/CODE_STANDARDS.md) - Coding conventions
- 🔍 [**Project Assessment**](./docs/PROJECT_ASSESSMENT.md) - Quality evaluation
- 📖 [**Documentation Index**](./docs/README.md) - Start here!

**Total Documentation**: 8 files, 15,000+ lines, 100% project coverage

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm 8+ or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fellini164/fellini164.git
cd fellini164
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

For detailed setup instructions, see [Development Guide](./docs/DEVELOPMENT_GUIDE.md)

## 📦 Available Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
fellini164/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── layout/          # Layout components
│   │   │   ├── admin/       # Admin layouts
│   │   │   ├── auth/        # Auth layouts
│   │   │   └── public/      # Public layouts
│   │   └── ui/              # Reusable UI components
│   ├── config/              # Configuration files
│   │   ├── constants.js     # App constants
│   │   └── env.js          # Environment config
│   ├── features/            # Redux features
│   │   ├── store.js        # Redux store
│   │   └── products/       # Example feature
│   ├── pages/              # Page components
│   │   ├── auth/          # Auth pages
│   │   ├── error/         # Error pages
│   │   ├── private/       # Protected pages
│   │   └── public/        # Public pages
│   ├── router/            # Routing configuration
│   ├── services/          # API services
│   │   ├── axiosInstance.js
│   │   ├── httpEndpoint.js
│   │   └── httpMethods.js
│   └── utils/             # Utility functions
├── docs/                  # Comprehensive documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── COMPONENT_LIBRARY.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── CODE_STANDARDS.md
│   ├── PROJECT_ASSESSMENT.md
│   └── README.md
├── eslint.config.js       # ESLint configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies

For detailed structure explanation, see [Project Overview](./docs/PROJECT_OVERVIEW.md)

## 🔧 Configuration

### Tailwind CSS

The Tailwind CSS configuration is located in `tailwind.config.js`. Customize your design tokens here:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { /* ... */ },
      spacing: { /* ... */ },
    },
  },
  darkMode: 'class',
};
```

### Redux Store

Redux slices are located in `src/store/slices/`. Create new slices for different features:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = { /* ... */ };

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Add your reducers here
  },
});

export const { /* actions */ } = featureSlice.actions;
export default featureSlice.reducer;
```

Then register the slice in `src/store/store.js`:

```javascript
import featureReducer from './slices/featureSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    feature: featureReducer,
  },
});
```

## 📝 Usage Examples

### Using Redux State

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/appSlice';

export default function Component() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Current theme: {theme}
    </button>
  );
}
```

### Using UI Components

```javascript
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Example() {
  return (
    <Card>
      <h2 className="text-xl font-bold">Welcome</h2>
      <p className="mt-2 text-gray-600">Hello, World!</p>
      <Button variant="primary" size="md" className="mt-4">
        Click Me
      </Button>
    </Card>
  );
}
```

### Styling with Tailwind CSS

```javascript
export default function Component() {
  return (
    <div className="flex items-center justify-center rounded-lg bg-blue-500 px-6 py-4 text-white shadow-lg hover:bg-blue-600 dark:bg-blue-900">
      Tailwind styled component
    </div>
  );
}
```

## 🎨 Component Library

### Button

Versatile button component with multiple variants and sizes.

```javascript
<Button variant="primary" size="md">
  Primary Button
</Button>
<Button variant="secondary" size="sm">
  Secondary Button
</Button>
<Button variant="danger" size="lg">
  Danger Button
</Button>
```

**Props:**
- `variant`: `'primary'` | `'secondary'` | `'danger'` (default: `'primary'`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `className`: Additional CSS classes
- All standard HTML button attributes

### Card

Container component for grouping content.

```javascript
<Card className="max-w-md">
  <h3 className="font-bold">Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `children`: Card content
- `className`: Additional CSS classes

### ThemeToggle

Component to switch between light and dark modes.

```javascript
<ThemeToggle />
```

## 🌙 Dark Mode

Dark mode is built-in using Tailwind's class-based dark mode. To enable dark mode:

```javascript
// In your component
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Content
</div>
```

The `ThemeToggle` component is already integrated and manages the theme state via Redux.

## 📚 Dependencies

### Core Dependencies
- **react** - UI library
- **react-dom** - DOM rendering
- **react-redux** - Redux bindings for React
- **@reduxjs/toolkit** - Redux state management

### Styling
- **tailwindcss** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind CSS
- **clsx** - Utility for constructing className strings

### Routing & HTTP
- **react-router-dom** - Client-side routing
- **axios** - HTTP client

### UI & Notifications
- **react-toastify** - Toast notifications

### Development Tools
- **vite** - Build tool
- **eslint** - Code quality
- **prettier** - Code formatter
- **prettier-plugin-tailwindcss** - Tailwind CSS class sorting

## 🛠️ Best Practices

1. **Component Organization** - Keep components modular and focused on single responsibility
2. **Redux Slices** - Use Redux Toolkit slices for cleaner state management
3. **Styling** - Prefer Tailwind CSS utility classes over custom CSS
4. **Type Safety** - Consider using TypeScript for larger projects
5. **Performance** - Use React.memo and useMemo for performance optimization
6. **Testing** - Add tests using Jest and React Testing Library
7. **Code Quality** - Run ESLint and Prettier regularly
8. **Environment Variables** - Use `.env` files for sensitive data

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This generates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 📖 Resources

### Documentation
- 📚 [Complete Documentation Suite](./docs/README.md) - Start here!
- 📋 [Project Overview](./docs/PROJECT_OVERVIEW.md) - High-level project introduction
- 🏗️ [Architecture Guide](./docs/ARCHITECTURE.md) - System design and patterns
- 🚀 [Development Guide](./docs/DEVELOPMENT_GUIDE.md) - Setup and workflow

### Official Documentation
- [React 19 Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com)
- [Vite 7 Documentation](https://vitejs.dev)
- [React Router v7 Documentation](https://reactrouter.com)

## 🎯 Project Status

**Grade**: B+ (7.35/10)  
**Status**: Active Development  
**Production Ready**: With recommended enhancements

See [Project Assessment](./docs/PROJECT_ASSESSMENT.md) for detailed evaluation.

### ✅ Implemented
- Core architecture and structure
- Redux Toolkit state management
- React Router v7 routing
- Axios API integration
- Layout system
- ESLint & Prettier

### 🚧 In Progress
- Complete UI components
- Performance monitoring
- Testing framework
- Authentication flow

See [Project Overview](./docs/PROJECT_OVERVIEW.md) for full status.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Read [Code Standards](./docs/CODE_STANDARDS.md)
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Follow [Development Guide](./docs/DEVELOPMENT_GUIDE.md) conventions
5. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

For detailed guidelines, see [Code Standards](./docs/CODE_STANDARDS.md).

## 💡 Best Practices

- ✅ Follow SOLID principles
- ✅ Use ESLint and Prettier
- ✅ Write meaningful commit messages
- ✅ Create reusable components
- ✅ Implement proper error handling
- ✅ Write unit tests (target 80%+ coverage)
- ✅ Use TypeScript for type safety (recommended)
- ✅ Optimize for performance (Code splitting, lazy loading)

See [Code Standards](./docs/CODE_STANDARDS.md) for complete guidelines.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Tailwind Classes Not Working
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

For more troubleshooting, see [Development Guide](./docs/DEVELOPMENT_GUIDE.md#troubleshooting).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 What's Next?

1. **Explore Documentation**: Start with [Documentation Index](./docs/README.md)
2. **Set Up Environment**: Follow [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
3. **Understand Architecture**: Read [Architecture Guide](./docs/ARCHITECTURE.md)
4. **Build Components**: Reference [Component Library](./docs/COMPONENT_LIBRARY.md)
5. **Write Quality Code**: Follow [Code Standards](./docs/CODE_STANDARDS.md)

---

**Built with ❤️ using React 19, Redux Toolkit, Tailwind CSS 4, and Vite 7**

**Version**: 1.0.0  
**Last Updated**: December 25, 2025  
**Maintained By**: Fellini164 Team
# **App Name**: Akista Admin Panel

## Core Features:

- Login Authentication: Secure user login using Firebase Authentication with email and password, redirecting to the dashboard upon successful login.
- Route Guard: Protect routes, ensuring that unauthenticated users are redirected to the login page, thus securing the admin panel.
- Sidebar Navigation: Implement a fixed sidebar for easy navigation between different sections of the admin panel: Dashboard, Stores, Products, Users, and Logout.
- Stores CRUD: Create, Read, Update, and Delete operations for managing store data from the 'stores' collection in Firestore, including a modal for creating new stores.
- Products Read: Display products from the 'products' collection, offering only read operations (no create, update, or delete).
- Users Read: Display a read-only table listing users from the 'users' collection to review registered user information.
- Loading States: Show loading indicators while fetching data from Firestore to provide a better user experience.

## Style Guidelines:

- Primary color: Vibrant green (#19e680) for the main interactive elements to align with Akista's branding. 
- Background color: Light gray (#F5F5F5) to provide a clean and modern backdrop for the admin interface.
- Accent color: A slightly darker shade of green (#14B35A) used for highlighting active navigation links and important actions, creating visual interest.
- Body and headline font: 'Inter' sans-serif font known for its readability and modern appearance.
- Use Lucide-React icons, maintaining a consistent style across the interface for improved user experience.
- Employ a clean and responsive layout using Tailwind CSS, ensuring the admin panel is accessible and visually appealing on various devices.
- Implement subtle animations (e.g., fade-in effects, smooth transitions) to enhance interactivity and user engagement.
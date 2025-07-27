# Exhibition Booking System

A modern, responsive web application for managing exhibition booth bookings. Built with React.js, this single-page application provides a comprehensive booking system with form validation, booking management, and admin capabilities.

## 🚀 Features

### Core Functionality
- **Exhibitor Booking Form**: Complete form with all required fields and validation
- **Real-time Form Validation**: Client-side validation with inline feedback using Yup
- **Booking Summary**: Detailed confirmation page with booking details
- **Data Persistence**: Local storage implementation for booking data
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Form Fields
- Company Name (required)
- Contact Person Name (required)
- Email Address (required, with validation)
- Phone Number (required)
- Booth Type Selection (Standard, Premium, Custom)
- Number of Booths (1-10, required)
- Preferred Booth Location (dropdown selection)

### Admin Features
- **Admin Panel**: View all bookings in a comprehensive table
- **Search & Filter**: Search by company, contact, email, or booking ID
- **Status Filtering**: Filter by booking status (confirmed, pending, cancelled)
- **Booth Type Filtering**: Filter by booth type (standard, premium, custom)
- **Location Filtering**: Filter by booth location
- **Booking Management**: Update booking status and delete bookings
- **Data Export**: Export bookings to CSV format
- **Statistics Dashboard**: View booking statistics and revenue
- **Detailed Booking View**: View comprehensive booking details in modal

### Additional Features
- **Cost Calculation**: Real-time cost estimation based on booth type and quantity
- **PDF Generation**: Download booking details as professional PDF documents
- **Email Integration**: Send confirmation emails with PDF attachments via mailto links
- **Double Booking Prevention**: Prevents duplicate bookings by company, email, or phone
- **Booking Management**: Update booking status and delete bookings in admin panel
- **Modern UI/UX**: Professional design with smooth interactions and responsive layout
- **Accessibility**: WCAG 2.1 compliant design
- **Demo Data**: Pre-loaded sample bookings for demonstration

## 🛠️ Technology Stack

- **Frontend Framework**: React.js 19+ with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS v4 for responsive design
- **Form Handling**: React Hook Form with Yup validation
- **PDF Generation**: jsPDF for client-side PDF creation
- **Icons**: Lucide React for consistent iconography
- **State Management**: React useState and useEffect hooks
- **Data Storage**: localStorage for client-side persistence
- **Package Manager**: npm

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd exhibition-booking-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## 📱 Usage

### For Exhibitors
1. **Fill out the booking form** with your company and contact information
2. **Select booth type** (Standard, Premium, or Custom)
3. **Choose number of booths** (1-10)
4. **Select preferred location** from available options
5. **Review estimated cost** displayed in real-time
6. **Submit booking** to receive confirmation
7. **Download booking details as PDF** or send email confirmation with PDF attachment

### For Administrators
1. **Click "Admin Panel"** in the header to access admin features
2. **View all bookings** in a comprehensive table
3. **Search bookings** by company name, contact, email, or booking ID
4. **Filter by status** (confirmed, pending, cancelled)
5. **Filter by booth type** (standard, premium, custom)
6. **Filter by location** to see bookings in specific areas
7. **Update booking status** or delete bookings as needed
8. **View detailed booking information** in modal popup
9. **Export data** to CSV format for external analysis
10. **View statistics** including total bookings, booths, and revenue

## 🏗️ Project Structure

```
exhibition-booking-system/
├── public/
├── src/
│   ├── components/
│   │   ├── BookingForm.jsx      # Main booking form component
│   │   ├── BookingSummary.jsx   # Booking confirmation component
│   │   └── AdminPanel.jsx       # Admin panel component
│   ├── utils/
│   │   └── demoData.js          # Demo data and utility functions
│   ├── App.jsx                  # Main application component
│   ├── index.css               # Global styles and Tailwind imports
│   └── main.jsx                # Application entry point
├── index.html
├── package.json
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Used for buttons and links
- **Secondary**: Gray (#6B7280) - Used for secondary actions
- **Success**: Green (#10B981) - Used for confirmations
- **Warning**: Yellow (#F59E0B) - Used for alerts
- **Error**: Red (#EF4444) - Used for errors

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weight for readability

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Rounded corners with hover states
- **Forms**: Consistent input styling with focus states
- **Tables**: Clean, readable design for admin panel

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be modified in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Form Validation
Validation is handled by Yup schemas in `BookingForm.jsx`. Modify the schema to add or change validation rules:

```javascript
const schema = yup.object({
  companyName: yup.string().required('Company name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  // ... other fields
})
```

## 📊 Data Structure

### Booking Object
```javascript
{
  id: "1703123456789",
  companyName: "Example Corp",
  contactPersonName: "John Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  boothType: "premium",
  numberOfBooths: 2,
  preferredLocation: "main-hall",
  createdAt: "2024-01-15T10:30:00.000Z",
  status: "confirmed"
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure build settings if needed

### Other Platforms
The application can be deployed to any static hosting service:
- GitHub Pages
- AWS S3
- Firebase Hosting
- Surge.sh

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form validation works correctly
- [ ] All required fields are enforced
- [ ] Email validation accepts valid emails
- [ ] Phone number validation works (7-15 digits)
- [ ] Booth type selection works
- [ ] Number of booths validation (1-10)
- [ ] Location selection works
- [ ] Cost calculation is accurate
- [ ] Double booking prevention works
- [ ] Booking submission creates new booking
- [ ] Booking summary displays correctly
- [ ] PDF download functionality works
- [ ] Email confirmation with PDF opens mail client
- [ ] Admin panel displays all bookings
- [ ] Search functionality works
- [ ] Filtering works correctly (status, booth type, location)
- [ ] Booking status updates work
- [ ] Booking deletion works
- [ ] Export functionality works
- [ ] Detailed booking view modal works
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Responsive design works on desktop

## 🔒 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📞 Support

For support or questions about this project, please open an issue on GitHub or contact the development team.

## 🎯 Roadmap

### Future Enhancements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Payment processing integration
- [ ] Email service integration
- [ ] Advanced analytics dashboard
- [ ] Booth availability management
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Real-time notifications
- [ ] API documentation

---

**Built with ❤️ using React.js and Tailwind CSS**

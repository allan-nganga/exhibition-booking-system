// Demo data for the exhibition booking system
export const demoBookings = [
  {
    id: "1703123456789",
    companyName: "TechCorp Solutions",
    contactPersonName: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phoneNumber: "+1-555-0123",
    boothType: "premium",
    numberOfBooths: 2,
    preferredLocation: "main-hall",
    createdAt: "2024-01-15T10:30:00.000Z",
    status: "confirmed"
  },
  {
    id: "1703123456790",
    companyName: "Innovate Labs",
    contactPersonName: "Michael Chen",
    email: "michael.chen@innovatelabs.com",
    phoneNumber: "+1-555-0124",
    boothType: "standard",
    numberOfBooths: 1,
    preferredLocation: "side-hall",
    createdAt: "2024-01-16T14:20:00.000Z",
    status: "confirmed"
  },
  {
    id: "1703123456791",
    companyName: "Global Exhibitions",
    contactPersonName: "Emily Rodriguez",
    email: "emily.rodriguez@globalexhibitions.com",
    phoneNumber: "+1-555-0125",
    boothType: "custom",
    numberOfBooths: 3,
    preferredLocation: "main-hall-north",
    createdAt: "2024-01-17T09:15:00.000Z",
    status: "confirmed"
  },
  {
    id: "1703123456792",
    companyName: "Startup Ventures",
    contactPersonName: "David Kim",
    email: "david.kim@startupventures.com",
    phoneNumber: "+1-555-0126",
    boothType: "standard",
    numberOfBooths: 1,
    preferredLocation: "outdoor",
    createdAt: "2024-01-18T16:45:00.000Z",
    status: "pending"
  },
  {
    id: "1703123456793",
    companyName: "Enterprise Solutions",
    contactPersonName: "Lisa Thompson",
    email: "lisa.thompson@enterprisesolutions.com",
    phoneNumber: "+1-555-0127",
    boothType: "premium",
    numberOfBooths: 4,
    preferredLocation: "main-hall-south",
    createdAt: "2024-01-19T11:30:00.000Z",
    status: "confirmed"
  }
]

// Function to load demo data into localStorage
export const loadDemoData = () => {
  const existingBookings = localStorage.getItem('exhibitionBookings')
  if (!existingBookings) {
    localStorage.setItem('exhibitionBookings', JSON.stringify(demoBookings))
    return demoBookings
  }
  return JSON.parse(existingBookings)
}

// Function to clear all data
export const clearAllData = () => {
  localStorage.removeItem('exhibitionBookings')
}

// Function to reset to demo data
export const resetToDemoData = () => {
  localStorage.setItem('exhibitionBookings', JSON.stringify(demoBookings))
  return demoBookings
} 
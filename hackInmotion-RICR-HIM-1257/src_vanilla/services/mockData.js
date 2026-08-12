export const MOCK_ISSUES = [
  {
    id: "BH-10241",
    title: "Deep pothole in MP Nagar",
    category: "Infrastructure",
    description: "Deep pothole near Zone 1 causing severe traffic issues and vehicle damage during peak hours.",
    status: "In Progress",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    location: "MP Nagar Zone 1, Bhopal",
    imageUrl: null,
    priority: "High"
  },
  {
    id: "BH-10198",
    title: "Streetlight not working",
    category: "Electricity",
    description: "Pole number 45 near Arera Colony E-3 is completely dark.",
    status: "Resolved",
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    location: "Arera Colony E-3, Bhopal",
    imageUrl: null,
    priority: "Medium"
  },
  {
    id: "BH-10305",
    title: "Garbage overflow",
    category: "Sanitation",
    description: "Garbage bins are overflowing outside the public park.",
    status: "Under Review",
    reportedAt: new Date().toISOString(), // Now
    location: "Shahpura Lake, Bhopal",
    imageUrl: null,
    priority: "High"
  }
];

export const MOCK_USER = {
  name: "Rajesh Kumar",
  role: "Citizen",
  avatar: null
};

import type { Issue } from '../types';

export const MOCK_INITIAL_ISSUES: Issue[] = [
  {
    "id": "iss-bpl-01",
    "trackingId": "CFX-2026-8A72",
    "title": "Hazardous Potholes on Main Road near DB City Mall",
    "description": "Multiple deep potholes created after recent heavy rains causing severe traffic slowdown and risk to two-wheeler riders near Zone-I entrance.",
    "category": "roads",
    "department": "roads-infra",
    "status": "In Progress",
    "priority": "High",
    "lat": 23.2332,
    "lng": 77.4345,
    "address": "Zone-I, Maharana Pratap Nagar, Bhopal, MP 462011",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Siddhi Rai",
    "reportedAt": "2026-08-12T10:47:24.765Z",
    "updatedAt": "2026-08-13T22:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T10:47:24.766Z",
        "updatedBy": "Siddhi Rai"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-12T22:47:24.766Z",
        "updatedBy": "Roads & Infra Team"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-13T22:47:24.766Z",
        "updatedBy": "Eng. R. K. Sharma",
        "note": "Asphalt cold-mix batch dispatched to location."
      }
    ],
    "upvotes": 34,
    "upvotedBy": [
      "usr-citizen-01",
      "usr-citizen-02",
      "usr-citizen-03"
    ],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-02",
    "trackingId": "CFX-2026-3B19",
    "title": "Garbage Dump Overflow outside 10 No. Market",
    "description": "Commercial waste bin hasn't been cleared for 3 days. Severe stench and stray dogs gathering near food stalls.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Reported",
    "priority": "Critical",
    "lat": 23.2185,
    "lng": 77.4281,
    "address": "E-4, Arera Colony, 10 No. Market, Bhopal, MP 462016",
    "photoUrl": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Vikram Mehta",
    "reportedAt": "2026-08-10T10:47:24.766Z",
    "updatedAt": "2026-08-10T10:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T10:47:24.766Z",
        "updatedBy": "Vikram Mehta"
      }
    ],
    "upvotes": 52,
    "upvotedBy": [
      "usr-citizen-01",
      "usr-citizen-04"
    ],
    "escalated": true,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-03",
    "trackingId": "CFX-2026-9C44",
    "title": "Broken Streetlight Poles causing Dark Alley near TT Nagar Stadium",
    "description": "Three consecutive streetlights are out along the pedestrian walkway leading to the sports complex. Poses safety hazard at night.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Acknowledged",
    "priority": "Medium",
    "lat": 23.2389,
    "lng": 77.4012,
    "address": "Stadium Road, TT Nagar, Bhopal, MP 462003",
    "photoUrl": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Ananya Deshmukh",
    "reportedAt": "2026-08-13T14:47:24.766Z",
    "updatedAt": "2026-08-14T02:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T14:47:24.766Z",
        "updatedBy": "Ananya Deshmukh"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-14T02:47:24.766Z",
        "updatedBy": "MPCZ Electricity Dispatch"
      }
    ],
    "upvotes": 18,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-04",
    "trackingId": "CFX-2026-1F55",
    "title": "Major Underground Pipeline Leak wasting Drinking Water",
    "description": "Clean municipal water leaking heavily onto Hoshangabad Road near Ashima Mall. Thousands of liters wasted daily.",
    "category": "water",
    "department": "water-supply",
    "status": "In Progress",
    "priority": "Critical",
    "lat": 23.1894,
    "lng": 77.4521,
    "address": "NH-46, Hoshangabad Rd, Misrod, Bhopal, MP 462026",
    "photoUrl": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Rajesh Kumar",
    "reportedAt": "2026-08-13T20:47:24.766Z",
    "updatedAt": "2026-08-14T06:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T20:47:24.766Z",
        "updatedBy": "Rajesh Kumar"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-14T00:47:24.766Z",
        "updatedBy": "Bhopal Water Board"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-14T06:47:24.766Z",
        "updatedBy": "Sub-Divisional Officer",
        "note": "Emergency line isolation in effect; pipe repair team on site."
      }
    ],
    "upvotes": 67,
    "upvotedBy": [
      "usr-citizen-01"
    ],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-05",
    "trackingId": "CFX-2026-7D81",
    "title": "Vandalized & Broken Bus Shelter Glass Panel",
    "description": "Glass panels shattered at Kolar Road Bus Stop #4. Glass shards on pavement pose risk to commuters.",
    "category": "public-property",
    "department": "public-works",
    "status": "Resolved",
    "priority": "Medium",
    "lat": 23.1762,
    "lng": 77.4189,
    "address": "Main Road, Kolar Rd, Lalita Nagar, Bhopal, MP 462042",
    "photoUrl": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    "resolutionPhotoUrl": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    "resolutionNotes": "Shattered glass cleared, poly-carbonate replacement panel fitted and secured with metal brackets.",
    "reportedBy": "Pooja Verma",
    "reportedAt": "2026-08-11T10:47:24.766Z",
    "updatedAt": "2026-08-14T04:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T10:47:24.766Z",
        "updatedBy": "Pooja Verma"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-12T10:47:24.766Z",
        "updatedBy": "PWD Inspector"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-13T10:47:24.766Z",
        "updatedBy": "PWD Maintenance Team"
      },
      {
        "status": "Resolved",
        "timestamp": "2026-08-14T04:47:24.766Z",
        "updatedBy": "Senior Engineer, PWD",
        "photoUrl": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
        "note": "Replaced shattered panel with high-impact acrylic sheet."
      }
    ],
    "upvotes": 21,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-06",
    "trackingId": "CFX-2026-4E12",
    "title": "Severe Sewage Drain Overflow near Shahpura Lake Circle",
    "description": "Blocked drain causing dark foul water to flood the walking track and adjacent service road.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Verified",
    "priority": "High",
    "lat": 23.1988,
    "lng": 77.4312,
    "address": "Shahpura Promenade, Sector-B, Shahpura, Bhopal, MP 462039",
    "photoUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "resolutionPhotoUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "resolutionNotes": "High-pressure jetting machine de-clogged main sewer line; disinfectant sprayed.",
    "reportedBy": "Amitabh Sen",
    "reportedAt": "2026-08-09T10:47:24.766Z",
    "updatedAt": "2026-08-14T00:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T10:47:24.766Z",
        "updatedBy": "Amitabh Sen"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-10T10:47:24.766Z",
        "updatedBy": "Sanitation Officer"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-12T10:47:24.766Z",
        "updatedBy": "Drainage Crew"
      },
      {
        "status": "Resolved",
        "timestamp": "2026-08-13T10:47:24.766Z",
        "updatedBy": "BMC Drainage Supervisor"
      },
      {
        "status": "Verified",
        "timestamp": "2026-08-14T00:47:24.766Z",
        "updatedBy": "Siddhi Rai (Citizen Verified)"
      }
    ],
    "upvotes": 45,
    "upvotedBy": [
      "usr-citizen-01"
    ],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-07",
    "trackingId": "CFX-2026-6A33",
    "title": "Recurrent Pothole Cluster near MP Nagar Zone-II Bank Square",
    "description": "Road surface completely broken down; 5 consecutive deep pits causing vehicles to swerve into oncoming lane.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Reopened",
    "priority": "High",
    "lat": 23.2351,
    "lng": 77.4389,
    "address": "Zone-II, MP Nagar near Axis Bank, Bhopal, MP 462011",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Kavita Joshi",
    "reportedAt": "2026-08-08T14:47:24.766Z",
    "updatedAt": "2026-08-14T08:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T14:47:24.766Z",
        "updatedBy": "Kavita Joshi"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-09T10:47:24.766Z",
        "updatedBy": "Roads Dept"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-10T10:47:24.766Z",
        "updatedBy": "Contractor Team"
      },
      {
        "status": "Resolved",
        "timestamp": "2026-08-13T04:47:24.766Z",
        "updatedBy": "Contractor Supervisor"
      },
      {
        "status": "Reopened",
        "timestamp": "2026-08-14T08:47:24.766Z",
        "updatedBy": "Siddhi Rai",
        "note": "Patchwork washed away in overnight rain; hole is open again."
      }
    ],
    "upvotes": 41,
    "upvotedBy": [
      "usr-citizen-01"
    ],
    "escalated": true,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-08",
    "trackingId": "CFX-2026-2C88",
    "title": "Dangerous Hanging High-Voltage Wire near New Market Gate",
    "description": "Electric wire snapped off pole and hanging 5 feet above busy footpath near Top N Town ice cream parlor.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "In Progress",
    "priority": "Critical",
    "lat": 23.2421,
    "lng": 77.4019,
    "address": "New Market, Malviya Nagar, Bhopal, MP 462003",
    "photoUrl": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Deepak Sharma",
    "reportedAt": "2026-08-14T04:47:24.766Z",
    "updatedAt": "2026-08-14T09:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-14T04:47:24.766Z",
        "updatedBy": "Deepak Sharma"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-14T06:47:24.766Z",
        "updatedBy": "Electricity Control Room"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-14T09:47:24.766Z",
        "updatedBy": "Lineman Duty Crew",
        "note": "Feeder shut off; wire re-tensioning underway."
      }
    ],
    "upvotes": 89,
    "upvotedBy": [
      "usr-citizen-01"
    ],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-09",
    "trackingId": "CFX-2026-5F90",
    "title": "Uncleared Construction Debris blocking Footpath",
    "description": "Large pile of bricks, sand and concrete blocks dumped on sidewalk blocking school children from walking safely.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Reported",
    "priority": "Low",
    "lat": 23.2112,
    "lng": 77.4421,
    "address": "Near Campion School, E-7 Arera Colony, Bhopal, MP 462016",
    "photoUrl": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Sunita Rao",
    "reportedAt": "2026-08-13T19:47:24.766Z",
    "updatedAt": "2026-08-13T19:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T19:47:24.766Z",
        "updatedBy": "Sunita Rao"
      }
    ],
    "upvotes": 8,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bpl-10",
    "trackingId": "CFX-2026-8B11",
    "title": "Missing Manhole Cover on Bairagarh Main Road",
    "description": "Open sewer manhole without warning sign or barricade in high-traffic shopping market area.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "In Progress",
    "priority": "Critical",
    "lat": 23.2654,
    "lng": 77.3456,
    "address": "Main Market Road, Bairagarh, Bhopal, MP 462030",
    "photoUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Manish Gwalia",
    "reportedAt": "2026-08-13T16:47:24.766Z",
    "updatedAt": "2026-08-14T07:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T16:47:24.766Z",
        "updatedBy": "Manish Gwalia"
      },
      {
        "status": "Acknowledged",
        "timestamp": "2026-08-13T22:47:24.766Z",
        "updatedBy": "Bairagarh Ward Office"
      },
      {
        "status": "In Progress",
        "timestamp": "2026-08-14T07:47:24.766Z",
        "updatedBy": "Ward Inspector",
        "note": "Temporary red hazard cone placed; heavy-duty cast iron lid being brought."
      }
    ],
    "upvotes": 43,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-mum-11",
    "trackingId": "CFX-2026-UWVN",
    "title": "Electricity issue in Mumbai",
    "description": "A reported electricity problem in the Mumbai area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Verified",
    "priority": "Low",
    "lat": 19.058248639867422,
    "lng": 72.87438188311451,
    "address": "Mumbai, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-14T01:47:24.766Z",
    "updatedAt": "2026-08-14T06:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-14T01:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 46,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  {
    "id": "iss-mum-12",
    "trackingId": "CFX-2026-2AGK",
    "title": "Drainage issue in Mumbai",
    "description": "A reported drainage problem in the Mumbai area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Reported",
    "priority": "Low",
    "lat": 19.05511433995455,
    "lng": 72.90194753440518,
    "address": "Mumbai, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T22:47:24.766Z",
    "updatedAt": "2026-08-13T16:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T22:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 41,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  {
    "id": "iss-pun-13",
    "trackingId": "CFX-2026-WLCQ",
    "title": "Public-property issue in Pune",
    "description": "A reported public-property problem in the Pune area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Reopened",
    "priority": "Medium",
    "lat": 18.51375171954366,
    "lng": 73.84306897046771,
    "address": "Pune, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T07:47:24.766Z",
    "updatedAt": "2026-08-13T09:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T07:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 15,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Pune",
    "state": "Maharashtra"
  },
  {
    "id": "iss-pun-14",
    "trackingId": "CFX-2026-MOEI",
    "title": "Water issue in Pune",
    "description": "A reported water problem in the Pune area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "Verified",
    "priority": "Low",
    "lat": 18.529233943982238,
    "lng": 73.84559230310984,
    "address": "Pune, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-13T07:47:24.766Z",
    "updatedAt": "2026-08-13T21:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T07:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 64,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Pune",
    "state": "Maharashtra"
  },
  {
    "id": "iss-pun-15",
    "trackingId": "CFX-2026-DP5W",
    "title": "Roads issue in Pune",
    "description": "A reported roads problem in the Pune area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Reopened",
    "priority": "High",
    "lat": 18.539572596301497,
    "lng": 73.83236844977674,
    "address": "Pune, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T13:47:24.766Z",
    "updatedAt": "2026-08-13T12:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T13:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 78,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Pune",
    "state": "Maharashtra"
  },
  {
    "id": "iss-pun-16",
    "trackingId": "CFX-2026-I4QW",
    "title": "Drainage issue in Pune",
    "description": "A reported drainage problem in the Pune area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Resolved",
    "priority": "Critical",
    "lat": 18.51946925040656,
    "lng": 73.85871823345103,
    "address": "Pune, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-06T23:47:24.766Z",
    "updatedAt": "2026-08-10T17:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-06T23:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 6,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Pune",
    "state": "Maharashtra"
  },
  {
    "id": "iss-nag-17",
    "trackingId": "CFX-2026-UF12",
    "title": "Drainage issue in Nagpur",
    "description": "A reported drainage problem in the Nagpur area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Reopened",
    "priority": "Critical",
    "lat": 21.13655610549161,
    "lng": 79.09778732227541,
    "address": "Nagpur, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T17:47:24.766Z",
    "updatedAt": "2026-08-13T14:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T17:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 26,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Nagpur",
    "state": "Maharashtra"
  },
  {
    "id": "iss-nag-18",
    "trackingId": "CFX-2026-TDLD",
    "title": "Electricity issue in Nagpur",
    "description": "A reported electricity problem in the Nagpur area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Resolved",
    "priority": "Critical",
    "lat": 21.16356928350832,
    "lng": 79.09140296736503,
    "address": "Nagpur, Maharashtra",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T05:47:24.766Z",
    "updatedAt": "2026-08-10T20:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T05:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 1,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Nagpur",
    "state": "Maharashtra"
  },
  {
    "id": "iss-ben-19",
    "trackingId": "CFX-2026-EK53",
    "title": "Public-property issue in Bengaluru",
    "description": "A reported public-property problem in the Bengaluru area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Acknowledged",
    "priority": "High",
    "lat": 12.993308283648851,
    "lng": 77.60399389825442,
    "address": "Bengaluru, Karnataka",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T00:47:24.766Z",
    "updatedAt": "2026-08-10T17:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T00:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 26,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bengaluru",
    "state": "Karnataka"
  },
  {
    "id": "iss-ben-20",
    "trackingId": "CFX-2026-Z4GZ",
    "title": "Public-property issue in Bengaluru",
    "description": "A reported public-property problem in the Bengaluru area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Resolved",
    "priority": "Medium",
    "lat": 12.97827074903836,
    "lng": 77.57222456946809,
    "address": "Bengaluru, Karnataka",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T11:47:24.766Z",
    "updatedAt": "2026-08-11T11:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T11:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 58,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bengaluru",
    "state": "Karnataka"
  },
  {
    "id": "iss-ben-21",
    "trackingId": "CFX-2026-JTJ3",
    "title": "Sanitation issue in Bengaluru",
    "description": "A reported sanitation problem in the Bengaluru area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Acknowledged",
    "priority": "Critical",
    "lat": 12.95659590153435,
    "lng": 77.5930375064242,
    "address": "Bengaluru, Karnataka",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-10T06:47:24.766Z",
    "updatedAt": "2026-08-12T08:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T06:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 86,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bengaluru",
    "state": "Karnataka"
  },
  {
    "id": "iss-ben-22",
    "trackingId": "CFX-2026-3FRK",
    "title": "Water issue in Bengaluru",
    "description": "A reported water problem in the Bengaluru area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "In Progress",
    "priority": "Medium",
    "lat": 12.967415128809542,
    "lng": 77.59994301609225,
    "address": "Bengaluru, Karnataka",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T09:47:24.766Z",
    "updatedAt": "2026-08-10T22:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T09:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 16,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bengaluru",
    "state": "Karnataka"
  },
  {
    "id": "iss-koc-23",
    "trackingId": "CFX-2026-6SGU",
    "title": "Sanitation issue in Kochi",
    "description": "A reported sanitation problem in the Kochi area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Verified",
    "priority": "Critical",
    "lat": 9.952024924661467,
    "lng": 76.2512717551162,
    "address": "Kochi, Kerala",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-10T00:47:24.766Z",
    "updatedAt": "2026-08-12T05:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T00:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 28,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Kochi",
    "state": "Kerala"
  },
  {
    "id": "iss-koc-24",
    "trackingId": "CFX-2026-XAPI",
    "title": "Drainage issue in Kochi",
    "description": "A reported drainage problem in the Kochi area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Acknowledged",
    "priority": "Critical",
    "lat": 9.917726868330496,
    "lng": 76.29185142247306,
    "address": "Kochi, Kerala",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T00:47:24.766Z",
    "updatedAt": "2026-08-11T05:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T00:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 43,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Kochi",
    "state": "Kerala"
  },
  {
    "id": "iss-koc-25",
    "trackingId": "CFX-2026-XDLA",
    "title": "Drainage issue in Kochi",
    "description": "A reported drainage problem in the Kochi area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Reported",
    "priority": "Critical",
    "lat": 9.92406429345764,
    "lng": 76.28312252217141,
    "address": "Kochi, Kerala",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T13:47:24.766Z",
    "updatedAt": "2026-08-13T12:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T13:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 77,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Kochi",
    "state": "Kerala"
  },
  {
    "id": "iss-che-26",
    "trackingId": "CFX-2026-9UMI",
    "title": "Public-property issue in Chennai",
    "description": "A reported public-property problem in the Chennai area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "In Progress",
    "priority": "Low",
    "lat": 13.061411893322934,
    "lng": 80.27610405426206,
    "address": "Chennai, Tamil Nadu",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T09:47:24.766Z",
    "updatedAt": "2026-08-11T10:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T09:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 90,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Chennai",
    "state": "Tamil Nadu"
  },
  {
    "id": "iss-che-27",
    "trackingId": "CFX-2026-7ZTD",
    "title": "Electricity issue in Chennai",
    "description": "A reported electricity problem in the Chennai area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "In Progress",
    "priority": "Critical",
    "lat": 13.07029715598603,
    "lng": 80.27258797410894,
    "address": "Chennai, Tamil Nadu",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T14:47:24.766Z",
    "updatedAt": "2026-08-13T12:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T14:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 68,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Chennai",
    "state": "Tamil Nadu"
  },
  {
    "id": "iss-hyd-28",
    "trackingId": "CFX-2026-C1QF",
    "title": "Sanitation issue in Hyderabad",
    "description": "A reported sanitation problem in the Hyderabad area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Reported",
    "priority": "Low",
    "lat": 17.39702627933432,
    "lng": 78.49498748822809,
    "address": "Hyderabad, Telangana",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-11T12:47:24.766Z",
    "updatedAt": "2026-08-12T23:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T12:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 89,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Hyderabad",
    "state": "Telangana"
  },
  {
    "id": "iss-hyd-29",
    "trackingId": "CFX-2026-CROL",
    "title": "Public-property issue in Hyderabad",
    "description": "A reported public-property problem in the Hyderabad area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Resolved",
    "priority": "Low",
    "lat": 17.37440984435055,
    "lng": 78.50873051827318,
    "address": "Hyderabad, Telangana",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-11T01:47:24.766Z",
    "updatedAt": "2026-08-12T18:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T01:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 27,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Hyderabad",
    "state": "Telangana"
  },
  {
    "id": "iss-hyd-30",
    "trackingId": "CFX-2026-T9HT",
    "title": "Roads issue in Hyderabad",
    "description": "A reported roads problem in the Hyderabad area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "In Progress",
    "priority": "Low",
    "lat": 17.363023383559113,
    "lng": 78.49051630816366,
    "address": "Hyderabad, Telangana",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-09T15:47:24.766Z",
    "updatedAt": "2026-08-12T01:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T15:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 28,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Hyderabad",
    "state": "Telangana"
  },
  {
    "id": "iss-hyd-31",
    "trackingId": "CFX-2026-G8ZL",
    "title": "Sanitation issue in Hyderabad",
    "description": "A reported sanitation problem in the Hyderabad area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "In Progress",
    "priority": "Medium",
    "lat": 17.393956232562772,
    "lng": 78.4886951148354,
    "address": "Hyderabad, Telangana",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T17:47:24.766Z",
    "updatedAt": "2026-08-11T14:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T17:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 98,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Hyderabad",
    "state": "Telangana"
  },
  {
    "id": "iss-del-32",
    "trackingId": "CFX-2026-DSB0",
    "title": "Electricity issue in Delhi",
    "description": "A reported electricity problem in the Delhi area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Reported",
    "priority": "Medium",
    "lat": 28.617090263595966,
    "lng": 77.1936211057091,
    "address": "Delhi, Delhi",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-13T22:47:24.766Z",
    "updatedAt": "2026-08-14T04:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T22:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 34,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Delhi",
    "state": "Delhi"
  },
  {
    "id": "iss-del-33",
    "trackingId": "CFX-2026-CJZT",
    "title": "Public-property issue in Delhi",
    "description": "A reported public-property problem in the Delhi area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Acknowledged",
    "priority": "High",
    "lat": 28.593301142372543,
    "lng": 77.23314512349947,
    "address": "Delhi, Delhi",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T05:47:24.766Z",
    "updatedAt": "2026-08-10T20:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T05:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 62,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Delhi",
    "state": "Delhi"
  },
  {
    "id": "iss-ahm-34",
    "trackingId": "CFX-2026-3EVU",
    "title": "Electricity issue in Ahmedabad",
    "description": "A reported electricity problem in the Ahmedabad area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Verified",
    "priority": "Critical",
    "lat": 23.02553150794729,
    "lng": 72.5530428840331,
    "address": "Ahmedabad, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-06T09:47:24.766Z",
    "updatedAt": "2026-08-10T10:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-06T09:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 7,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Ahmedabad",
    "state": "Gujarat"
  },
  {
    "id": "iss-ahm-35",
    "trackingId": "CFX-2026-4ZJJ",
    "title": "Water issue in Ahmedabad",
    "description": "A reported water problem in the Ahmedabad area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "Verified",
    "priority": "High",
    "lat": 22.99981972249605,
    "lng": 72.59639388582923,
    "address": "Ahmedabad, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T04:47:24.766Z",
    "updatedAt": "2026-08-11T07:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T04:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 50,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Ahmedabad",
    "state": "Gujarat"
  },
  {
    "id": "iss-ahm-36",
    "trackingId": "CFX-2026-YZ46",
    "title": "Drainage issue in Ahmedabad",
    "description": "A reported drainage problem in the Ahmedabad area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Verified",
    "priority": "Low",
    "lat": 23.00089823412276,
    "lng": 72.54877058760255,
    "address": "Ahmedabad, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T17:47:24.766Z",
    "updatedAt": "2026-08-13T14:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T17:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 58,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Ahmedabad",
    "state": "Gujarat"
  },
  {
    "id": "iss-ahm-37",
    "trackingId": "CFX-2026-BQ4K",
    "title": "Electricity issue in Ahmedabad",
    "description": "A reported electricity problem in the Ahmedabad area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Reopened",
    "priority": "Medium",
    "lat": 23.02932520285652,
    "lng": 72.58273895020108,
    "address": "Ahmedabad, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-09T03:47:24.766Z",
    "updatedAt": "2026-08-11T19:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T03:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 93,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Ahmedabad",
    "state": "Gujarat"
  },
  {
    "id": "iss-sur-38",
    "trackingId": "CFX-2026-NEJK",
    "title": "Electricity issue in Surat",
    "description": "A reported electricity problem in the Surat area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Resolved",
    "priority": "Low",
    "lat": 21.146632559717293,
    "lng": 72.83927847125837,
    "address": "Surat, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T20:47:24.766Z",
    "updatedAt": "2026-08-11T15:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T20:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 70,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Surat",
    "state": "Gujarat"
  },
  {
    "id": "iss-sur-39",
    "trackingId": "CFX-2026-UR7V",
    "title": "Roads issue in Surat",
    "description": "A reported roads problem in the Surat area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Verified",
    "priority": "Low",
    "lat": 21.189951807862972,
    "lng": 72.81921151718974,
    "address": "Surat, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-09T07:47:24.766Z",
    "updatedAt": "2026-08-11T21:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T07:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 39,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Surat",
    "state": "Gujarat"
  },
  {
    "id": "iss-sur-40",
    "trackingId": "CFX-2026-5NML",
    "title": "Water issue in Surat",
    "description": "A reported water problem in the Surat area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "Resolved",
    "priority": "High",
    "lat": 21.1600035957051,
    "lng": 72.82214790719691,
    "address": "Surat, Gujarat",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-10T13:47:24.766Z",
    "updatedAt": "2026-08-12T12:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T13:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 55,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Surat",
    "state": "Gujarat"
  },
  {
    "id": "iss-bho-41",
    "trackingId": "CFX-2026-2X6I",
    "title": "Public-property issue in Bhopal",
    "description": "A reported public-property problem in the Bhopal area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Verified",
    "priority": "High",
    "lat": 23.266967024653862,
    "lng": 77.40639785230361,
    "address": "Bhopal, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T08:47:24.766Z",
    "updatedAt": "2026-08-10T21:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T08:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 99,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bho-42",
    "trackingId": "CFX-2026-T8IG",
    "title": "Public-property issue in Bhopal",
    "description": "A reported public-property problem in the Bhopal area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Verified",
    "priority": "Low",
    "lat": 23.259916331573827,
    "lng": 77.40565472582963,
    "address": "Bhopal, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T08:47:24.766Z",
    "updatedAt": "2026-08-10T21:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T08:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 62,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-bho-43",
    "trackingId": "CFX-2026-CGYC",
    "title": "Electricity issue in Bhopal",
    "description": "A reported electricity problem in the Bhopal area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Verified",
    "priority": "Medium",
    "lat": 23.24350259377474,
    "lng": 77.38800639113013,
    "address": "Bhopal, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-09T09:47:24.766Z",
    "updatedAt": "2026-08-11T22:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T09:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 11,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhopal",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-ind-44",
    "trackingId": "CFX-2026-2IEU",
    "title": "Public-property issue in Indore",
    "description": "A reported public-property problem in the Indore area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "In Progress",
    "priority": "Critical",
    "lat": 22.70355741645575,
    "lng": 75.84480536766337,
    "address": "Indore, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T08:47:24.766Z",
    "updatedAt": "2026-08-13T09:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T08:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 29,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Indore",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-ind-45",
    "trackingId": "CFX-2026-QX7A",
    "title": "Roads issue in Indore",
    "description": "A reported roads problem in the Indore area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Reported",
    "priority": "High",
    "lat": 22.70308537459863,
    "lng": 75.83362320331214,
    "address": "Indore, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-11T05:47:24.766Z",
    "updatedAt": "2026-08-12T20:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T05:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 68,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Indore",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-ind-46",
    "trackingId": "CFX-2026-W7XL",
    "title": "Water issue in Indore",
    "description": "A reported water problem in the Indore area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "Resolved",
    "priority": "Low",
    "lat": 22.74266629014465,
    "lng": 75.85478324418087,
    "address": "Indore, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-09T14:47:24.766Z",
    "updatedAt": "2026-08-12T00:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T14:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 64,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Indore",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-ind-47",
    "trackingId": "CFX-2026-NN4Y",
    "title": "Roads issue in Indore",
    "description": "A reported roads problem in the Indore area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "In Progress",
    "priority": "Low",
    "lat": 22.705291104279368,
    "lng": 75.83449532783251,
    "address": "Indore, Madhya Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-10T18:47:24.766Z",
    "updatedAt": "2026-08-12T14:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T18:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 66,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Indore",
    "state": "Madhya Pradesh"
  },
  {
    "id": "iss-jai-48",
    "trackingId": "CFX-2026-UDWY",
    "title": "Sanitation issue in Jaipur",
    "description": "A reported sanitation problem in the Jaipur area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Acknowledged",
    "priority": "Medium",
    "lat": 26.924042627665195,
    "lng": 75.78177849484769,
    "address": "Jaipur, Rajasthan",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T07:47:24.766Z",
    "updatedAt": "2026-08-11T09:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T07:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 79,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Jaipur",
    "state": "Rajasthan"
  },
  {
    "id": "iss-jai-49",
    "trackingId": "CFX-2026-7DQB",
    "title": "Water issue in Jaipur",
    "description": "A reported water problem in the Jaipur area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "Reopened",
    "priority": "Medium",
    "lat": 26.891864315158994,
    "lng": 75.80354277133746,
    "address": "Jaipur, Rajasthan",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-14T08:47:24.766Z",
    "updatedAt": "2026-08-14T09:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-14T08:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 65,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Jaipur",
    "state": "Rajasthan"
  },
  {
    "id": "iss-jai-50",
    "trackingId": "CFX-2026-IIZ2",
    "title": "Drainage issue in Jaipur",
    "description": "A reported drainage problem in the Jaipur area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Resolved",
    "priority": "High",
    "lat": 26.911562460498125,
    "lng": 75.78460836102256,
    "address": "Jaipur, Rajasthan",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-09T17:47:24.766Z",
    "updatedAt": "2026-08-12T02:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-09T17:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 79,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Jaipur",
    "state": "Rajasthan"
  },
  {
    "id": "iss-jai-51",
    "trackingId": "CFX-2026-YJ9K",
    "title": "Drainage issue in Jaipur",
    "description": "A reported drainage problem in the Jaipur area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "In Progress",
    "priority": "Critical",
    "lat": 26.88756083646636,
    "lng": 75.79440071646488,
    "address": "Jaipur, Rajasthan",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T07:47:24.766Z",
    "updatedAt": "2026-08-13T09:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T07:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 58,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Jaipur",
    "state": "Rajasthan"
  },
  {
    "id": "iss-luc-52",
    "trackingId": "CFX-2026-IK6Z",
    "title": "Drainage issue in Lucknow",
    "description": "A reported drainage problem in the Lucknow area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "In Progress",
    "priority": "Medium",
    "lat": 26.842837539424913,
    "lng": 80.92641337038631,
    "address": "Lucknow, Uttar Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T13:47:24.766Z",
    "updatedAt": "2026-08-13T12:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T13:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 48,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Lucknow",
    "state": "Uttar Pradesh"
  },
  {
    "id": "iss-luc-53",
    "trackingId": "CFX-2026-XF3Q",
    "title": "Sanitation issue in Lucknow",
    "description": "A reported sanitation problem in the Lucknow area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Reported",
    "priority": "Critical",
    "lat": 26.869340588489322,
    "lng": 80.9314207669836,
    "address": "Lucknow, Uttar Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T21:47:24.766Z",
    "updatedAt": "2026-08-13T16:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T21:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 71,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Lucknow",
    "state": "Uttar Pradesh"
  },
  {
    "id": "iss-luc-54",
    "trackingId": "CFX-2026-3ESY",
    "title": "Drainage issue in Lucknow",
    "description": "A reported drainage problem in the Lucknow area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Reopened",
    "priority": "Medium",
    "lat": 26.847685564344534,
    "lng": 80.924846224143,
    "address": "Lucknow, Uttar Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-08T11:47:24.766Z",
    "updatedAt": "2026-08-11T11:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-08T11:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 25,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Lucknow",
    "state": "Uttar Pradesh"
  },
  {
    "id": "iss-luc-55",
    "trackingId": "CFX-2026-PKMR",
    "title": "Drainage issue in Lucknow",
    "description": "A reported drainage problem in the Lucknow area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Acknowledged",
    "priority": "Critical",
    "lat": 26.846451389547813,
    "lng": 80.96078001501422,
    "address": "Lucknow, Uttar Pradesh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-11T21:47:24.766Z",
    "updatedAt": "2026-08-13T04:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T21:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 43,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Lucknow",
    "state": "Uttar Pradesh"
  },
  {
    "id": "iss-cha-56",
    "trackingId": "CFX-2026-QX93",
    "title": "Sanitation issue in Chandigarh",
    "description": "A reported sanitation problem in the Chandigarh area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Resolved",
    "priority": "High",
    "lat": 30.738561738965668,
    "lng": 76.757968597866,
    "address": "Chandigarh, Chandigarh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-10T15:47:24.766Z",
    "updatedAt": "2026-08-12T13:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T15:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 12,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Chandigarh",
    "state": "Chandigarh"
  },
  {
    "id": "iss-cha-57",
    "trackingId": "CFX-2026-T6M9",
    "title": "Roads issue in Chandigarh",
    "description": "A reported roads problem in the Chandigarh area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Verified",
    "priority": "Critical",
    "lat": 30.7391917875634,
    "lng": 76.77852313053127,
    "address": "Chandigarh, Chandigarh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T16:47:24.766Z",
    "updatedAt": "2026-08-11T01:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T16:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 42,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Chandigarh",
    "state": "Chandigarh"
  },
  {
    "id": "iss-cha-58",
    "trackingId": "CFX-2026-DGOF",
    "title": "Roads issue in Chandigarh",
    "description": "A reported roads problem in the Chandigarh area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Verified",
    "priority": "Low",
    "lat": 30.745819111069196,
    "lng": 76.77998061854407,
    "address": "Chandigarh, Chandigarh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T02:47:24.766Z",
    "updatedAt": "2026-08-10T18:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T02:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 29,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Chandigarh",
    "state": "Chandigarh"
  },
  {
    "id": "iss-cha-59",
    "trackingId": "CFX-2026-K89N",
    "title": "Water issue in Chandigarh",
    "description": "A reported water problem in the Chandigarh area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "Resolved",
    "priority": "High",
    "lat": 30.750299981822003,
    "lng": 76.80397100054205,
    "address": "Chandigarh, Chandigarh",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-06T21:47:24.766Z",
    "updatedAt": "2026-08-10T16:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-06T21:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 32,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Chandigarh",
    "state": "Chandigarh"
  },
  {
    "id": "iss-kol-60",
    "trackingId": "CFX-2026-OHKA",
    "title": "Electricity issue in Kolkata",
    "description": "A reported electricity problem in the Kolkata area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Resolved",
    "priority": "High",
    "lat": 22.585316968597045,
    "lng": 88.36752214108189,
    "address": "Kolkata, West Bengal",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-06T09:47:24.766Z",
    "updatedAt": "2026-08-10T10:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-06T09:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 29,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Kolkata",
    "state": "West Bengal"
  },
  {
    "id": "iss-kol-61",
    "trackingId": "CFX-2026-JGD2",
    "title": "Electricity issue in Kolkata",
    "description": "A reported electricity problem in the Kolkata area requiring attention.",
    "category": "electricity",
    "department": "electricity-board",
    "status": "Acknowledged",
    "priority": "High",
    "lat": 22.58084379411572,
    "lng": 88.37115704903569,
    "address": "Kolkata, West Bengal",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-11T14:47:24.766Z",
    "updatedAt": "2026-08-13T00:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T14:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 64,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Kolkata",
    "state": "West Bengal"
  },
  {
    "id": "iss-pat-62",
    "trackingId": "CFX-2026-LGAV",
    "title": "Public-property issue in Patna",
    "description": "A reported public-property problem in the Patna area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Verified",
    "priority": "High",
    "lat": 25.5934684224649,
    "lng": 85.11538941460533,
    "address": "Patna, Bihar",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-06T12:47:24.766Z",
    "updatedAt": "2026-08-10T11:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-06T12:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 89,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Patna",
    "state": "Bihar"
  },
  {
    "id": "iss-pat-63",
    "trackingId": "CFX-2026-PV1I",
    "title": "Roads issue in Patna",
    "description": "A reported roads problem in the Patna area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Verified",
    "priority": "Medium",
    "lat": 25.57514680469592,
    "lng": 85.12570014040897,
    "address": "Patna, Bihar",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-13T01:47:24.766Z",
    "updatedAt": "2026-08-13T18:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-13T01:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 78,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Patna",
    "state": "Bihar"
  },
  {
    "id": "iss-pat-64",
    "trackingId": "CFX-2026-TDMF",
    "title": "Drainage issue in Patna",
    "description": "A reported drainage problem in the Patna area requiring attention.",
    "category": "drainage",
    "department": "drainage-sewerage",
    "status": "Resolved",
    "priority": "Medium",
    "lat": 25.61323758099446,
    "lng": 85.15496760356068,
    "address": "Patna, Bihar",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-12T05:47:24.766Z",
    "updatedAt": "2026-08-13T08:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-12T05:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 15,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Patna",
    "state": "Bihar"
  },
  {
    "id": "iss-bhu-65",
    "trackingId": "CFX-2026-GZW2",
    "title": "Sanitation issue in Bhubaneswar",
    "description": "A reported sanitation problem in the Bhubaneswar area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Acknowledged",
    "priority": "Low",
    "lat": 20.279013390069267,
    "lng": 85.84128190652132,
    "address": "Bhubaneswar, Odisha",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-10T00:47:24.766Z",
    "updatedAt": "2026-08-12T05:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-10T00:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 4,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Bhubaneswar",
    "state": "Odisha"
  },
  {
    "id": "iss-bhu-66",
    "trackingId": "CFX-2026-OZN4",
    "title": "Public-property issue in Bhubaneswar",
    "description": "A reported public-property problem in the Bhubaneswar area requiring attention.",
    "category": "public-property",
    "department": "public-works",
    "status": "Acknowledged",
    "priority": "Medium",
    "lat": 20.292606918723322,
    "lng": 85.8400676412425,
    "address": "Bhubaneswar, Odisha",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-11T01:47:24.766Z",
    "updatedAt": "2026-08-12T18:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-11T01:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 44,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Bhubaneswar",
    "state": "Odisha"
  },
  {
    "id": "iss-guw-67",
    "trackingId": "CFX-2026-Q86I",
    "title": "Roads issue in Guwahati",
    "description": "A reported roads problem in the Guwahati area requiring attention.",
    "category": "roads",
    "department": "roads-infra",
    "status": "Resolved",
    "priority": "Medium",
    "lat": 26.104965393524303,
    "lng": 91.69007549315427,
    "address": "Guwahati, Assam",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T12:47:24.766Z",
    "updatedAt": "2026-08-10T23:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T12:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 5,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Guwahati",
    "state": "Assam"
  },
  {
    "id": "iss-guw-68",
    "trackingId": "CFX-2026-PLSD",
    "title": "Water issue in Guwahati",
    "description": "A reported water problem in the Guwahati area requiring attention.",
    "category": "water",
    "department": "water-supply",
    "status": "In Progress",
    "priority": "Medium",
    "lat": 26.100683584501837,
    "lng": 91.7334082377795,
    "address": "Guwahati, Assam",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-07T22:47:24.766Z",
    "updatedAt": "2026-08-11T04:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-07T22:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 24,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Guwahati",
    "state": "Assam"
  },
  {
    "id": "iss-deh-69",
    "trackingId": "CFX-2026-OV9N",
    "title": "Sanitation issue in Dehradun",
    "description": "A reported sanitation problem in the Dehradun area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Acknowledged",
    "priority": "Critical",
    "lat": 30.33145368860829,
    "lng": 78.05078707731485,
    "address": "Dehradun, Uttarakhand",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-14T08:47:24.766Z",
    "updatedAt": "2026-08-14T09:47:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-14T08:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 95,
    "upvotedBy": [],
    "escalated": true,
    "language": "en",
    "city": "Dehradun",
    "state": "Uttarakhand"
  },
  {
    "id": "iss-deh-70",
    "trackingId": "CFX-2026-J16J",
    "title": "Sanitation issue in Dehradun",
    "description": "A reported sanitation problem in the Dehradun area requiring attention.",
    "category": "sanitation",
    "department": "sanitation-dept",
    "status": "Acknowledged",
    "priority": "Critical",
    "lat": 30.329923447907085,
    "lng": 78.03363675011641,
    "address": "Dehradun, Uttarakhand",
    "photoUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "reportedBy": "Citizen",
    "reportedAt": "2026-08-14T09:47:24.766Z",
    "updatedAt": "2026-08-14T10:17:24.766Z",
    "statusHistory": [
      {
        "status": "Reported",
        "timestamp": "2026-08-14T09:47:24.766Z",
        "updatedBy": "Citizen"
      }
    ],
    "upvotes": 18,
    "upvotedBy": [],
    "escalated": false,
    "language": "en",
    "city": "Dehradun",
    "state": "Uttarakhand"
  }
];

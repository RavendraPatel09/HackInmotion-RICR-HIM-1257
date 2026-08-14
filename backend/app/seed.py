import os
import sys
from datetime import datetime, timezone, timedelta

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SyncSessionLocal
from app.core.security import hash_password
from app.models.location import State, City, Ward
from app.models.department import Department, Category
from app.models.user import User, UserSettings
from app.models.report import Report, StatusHistoryItem, ReportVote

# Indian locations from frontend
INDIAN_CITIES = [
    {"name": "Mumbai", "district": "Mumbai City", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "wards": [
        {"id": "mum-ward-01", "name": "Colaba (Ward A)", "name_hi": "कुलाबा (वॉर्ड A)", "officer_name": "Anil Deshmukh", "officer_phone": "+91 22 2202 0001"},
        {"id": "mum-ward-02", "name": "Bandra West (Ward H-West)", "name_hi": "बांद्रा वेस्ट (वॉर्ड H-वेस्ट)", "officer_name": "Sunita Rao", "officer_phone": "+91 22 2202 0002"},
        {"id": "mum-ward-03", "name": "Andheri East (Ward K-East)", "name_hi": "अंधेरी ईस्ट (वॉर्ड K-ईस्ट)", "officer_name": "Vikram Sawant", "officer_phone": "+91 22 2202 0003"}
    ]},
    {"name": "Pune", "district": "Pune District", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "wards": [
        {"id": "pne-ward-01", "name": "Kothrud Area", "name_hi": "कोथरुड परिसर", "officer_name": "Mahesh Shinde", "officer_phone": "+91 20 2550 1101"},
        {"id": "pne-ward-02", "name": "Shivaji Nagar", "name_hi": "शिवाजी नगर", "officer_name": "Kirti Joshi", "officer_phone": "+91 20 2550 1102"}
    ]},
    {"name": "Bhopal", "district": "Bhopal District", "state": "Madhya Pradesh", "lat": 23.2599, "lng": 77.4126, "wards": [
        {"id": "bpl-ward-01", "name": "Zone I — MP Nagar", "name_hi": "ज़ोन I — एमपी नगर", "officer_name": "Rajendra Patel", "officer_phone": "+91 755 401 0001"},
        {"id": "bpl-ward-02", "name": "Zone II — Arera Colony", "name_hi": "ज़ोन II — अरेरा कॉलोनी", "officer_name": "Meena Sharma", "officer_phone": "+91 755 401 0002"},
        {"id": "bpl-ward-03", "name": "Zone III — TT Nagar", "name_hi": "ज़ोन III — टीटी नगर", "officer_name": "Arjun Singh", "officer_phone": "+91 755 401 0003"},
        {"id": "bpl-ward-04", "name": "Zone IV — Shahpura", "name_hi": "ज़ोन IV — शाहपुरा", "officer_name": "Kavita Joshi", "officer_phone": "+91 755 401 0004"},
        {"id": "bpl-ward-05", "name": "Zone V — Kolar Road", "name_hi": "ज़ोन V — कोलार रोड", "officer_name": "Vikram Mehta", "officer_phone": "+91 755 401 0005"}
    ]}
]

DEPARTMENTS = [
    {"id": "roads-infra", "name": "Roads & Infrastructure", "name_hi": "सड़क और बुनियादी ढांचा"},
    {"id": "sanitation-dept", "name": "Sanitation & Waste Management", "name_hi": "स्वच्छता और अपशिष्ट प्रबंधन"},
    {"id": "electricity-board", "name": "Electricity Board", "name_hi": "विद्युत मंडल / बिजली बोर्ड"},
    {"id": "water-supply", "name": "Water Supply & Sewage", "name_hi": "जल आपूर्ति और जल निकास"},
    {"id": "sewerage-drainage", "name": "Sewerage & Drainage", "name_hi": "सीवेज और नाली सफाई"},
    {"id": "traffic-transport", "name": "Traffic & Transportation", "name_hi": "यातायात और परिवहन"},
    {"id": "parks-horticulture", "name": "Parks & Horticulture", "name_hi": "पार्क और उद्यान"},
    {"id": "forest-horticulture", "name": "Forest & Environment", "name_hi": "वन और पर्यावरण"},
    {"id": "pollution-control", "name": "Pollution Control Board", "name_hi": "प्रदूषण नियंत्रण बोर्ड"},
    {"id": "municipal-enforcement", "name": "Municipal Enforcement", "name_hi": "नगर निगम प्रवर्तन"},
    {"id": "fire-emergency", "name": "Fire & Emergency Services", "name_hi": "अग्निशमन और आपातकालीन सेवाएं"},
    {"id": "health-dept", "name": "Health Department", "name_hi": "स्वास्थ्य विभाग"},
    {"id": "education-dept", "name": "Education Department", "name_hi": "शिक्षा विभाग"},
    {"id": "public-safety-dept", "name": "Public Safety & Security", "name_hi": "सार्वजनिक सुरक्षा विभाग"},
    {"id": "general-admin", "name": "General Administration", "name_hi": "सामान्य प्रशासन"}
]

CATEGORIES = [
    {"id": "roads-potholes", "label": "Roads & Potholes", "label_hi": "सड़कें और गड्ढे", "icon_name": "Construction", "department_id": "roads-infra", "description": "Potholes, broken roads, damaged asphalt, craters, or road alignment issues.", "description_hi": "सड़क के गड्ढे, टूटी सड़कें, उखड़ा कोलतार, या सड़क संरेखण की समस्या।", "color": "#6366F1", "bg_gradient": "from-orange-500/20 to-amber-500/10"},
    {"id": "streetlights", "label": "Streetlights", "label_hi": "स्ट्रीटलाइट्स", "icon_name": "Zap", "department_id": "electricity-board", "description": "Non-functional streetlights, dark stretches, or faulty automatic timers.", "description_hi": "बंद स्ट्रीटलाइट्स, सड़कों पर अंधेरा, या दोषपूर्ण ऑटोमैटिक टाइमर।", "color": "#EAB308", "bg_gradient": "from-yellow-500/20 to-amber-500/10"},
    {"id": "traffic-signals", "label": "Traffic Signals", "label_hi": "यातायात सिग्नल", "icon_name": "AlertTriangle", "department_id": "traffic-transport", "description": "Faulty or non-operational traffic lights and timer countdown boards.", "description_hi": "खराब या बंद ट्रैफिक लाइट और टाइमर काउंटडाउन बोर्ड।", "color": "#3B82F6", "bg_gradient": "from-blue-500/20 to-indigo-500/10"},
    {"id": "public-transport", "label": "Public Transport", "label_hi": "सार्वजनिक परिवहन", "icon_name": "Bus", "department_id": "traffic-transport", "description": "Bus delays, poor bus conditions, routes, or ticketing machine issues.", "description_hi": "बसों में देरी, खराब बसें, रूट, या टिकट मशीन की समस्याएं।", "color": "#6366F1", "bg_gradient": "from-indigo-500/20 to-blue-500/10"},
    {"id": "garbage-waste", "label": "Garbage & Waste", "label_hi": "कचरा और अपशिष्ट", "icon_name": "Trash2", "department_id": "sanitation-dept", "description": "Overflowing dustbins, uncollected household waste, or littering in public.", "description_hi": "कचरे के डब्बे का भरना, बिना उठा कचरा, या सार्वजनिक स्थलों पर गंदगी।", "color": "#138808", "bg_gradient": "from-emerald-500/20 to-green-500/10"},
    {"id": "sanitation", "label": "Sanitation", "label_hi": "स्वच्छता", "icon_name": "Activity", "department_id": "sanitation-dept", "description": "General cleaning, sweeping of roads, or cleaning of public spaces.", "description_hi": "सामान्य साफ-सफाई, सड़कों की बुहारी, या सार्वजनिक स्थानों की सफाई।", "color": "#10B981", "bg_gradient": "from-emerald-500/20 to-teal-500/10"},
    {"id": "drainage", "label": "Drainage", "label_hi": "नाली सफाई", "icon_name": "Droplet", "department_id": "sewerage-drainage", "description": "Choked storm water drains, open gutters, or broken drain cover slabs.", "description_hi": "बंद नालियां, खुले नाले, या नाले के टूटे हुए स्लैब।", "color": "#06B6D4", "bg_gradient": "from-cyan-500/20 to-sky-500/10"},
    {"id": "water-supply", "label": "Water Supply", "label_hi": "पानी की आपूर्ति", "icon_name": "Droplets", "department_id": "water-supply", "description": "Low water pressure, contaminated water, or leakage in pipeline lines.", "description_hi": "कम पानी का दबाव, गंदा पानी, या मुख्य पानी की लाइन में रिसाव।", "color": "#2563EB", "bg_gradient": "from-blue-600/20 to-cyan-500/10"},
    {"id": "sewage", "label": "Sewage", "label_hi": "सीवेज / गंदा पानी", "icon_name": "Droplet", "department_id": "sewerage-drainage", "description": "Overflowing sewer manholes, sewage pipeline leaks, or backflow in houses.", "description_hi": "सीवर मैनहोल का बहना, सीवेज लाइन का रिसाव, या घरों में गंदे पानी की वापसी।", "color": "#0891B2", "bg_gradient": "from-cyan-600/20 to-teal-500/10"},
    {"id": "electricity", "label": "Electricity", "label_hi": "बिजली / विद्युत", "icon_name": "Zap", "department_id": "electricity-board", "description": "Faulty transformers, high voltage issues, or municipal power cut queries.", "description_hi": "खराब ट्रांसफार्मर, हाई वोल्टेज की समस्या, या बिजली कटौती की शिकायत।", "color": "#F59E0B", "bg_gradient": "from-amber-500/20 to-yellow-500/10"}
]

def seed_db():
    db = SyncSessionLocal()
    try:
        # Clear existing data to be clean
        db.query(ReportVote).delete()
        db.query(StatusHistoryItem).delete()
        db.query(Report).delete()
        db.query(Category).delete()
        db.query(Department).delete()
        db.query(UserSettings).delete()
        db.query(User).delete()
        db.query(Ward).delete()
        db.query(City).delete()
        db.query(State).delete()
        db.commit()
        
        # 1. Seed States, Cities, and Wards
        state_codes = {
            "Maharashtra": "MH",
            "Karnataka": "KA",
            "Madhya Pradesh": "MP",
            "Kerala": "KL",
            "Tamil Nadu": "TN",
            "Telangana": "TG",
            "Delhi": "DL",
            "Gujarat": "GJ",
            "Rajasthan": "RJ",
            "Uttar Pradesh": "UP",
            "West Bengal": "WB",
            "Bihar": "BR",
            "Odisha": "OD",
            "Assam": "AS",
            "Uttarakhand": "UK",
            "Chandigarh": "CH"
        }
        state_cache = {}
        city_cache = {}
        for city_data in INDIAN_CITIES:
            state_name = city_data["state"]
            if state_name not in state_cache:
                code = state_codes.get(state_name, state_name[:2].upper())
                db_state = State(name=state_name, code=code)
                db.add(db_state)
                db.commit()
                state_cache[state_name] = db_state.id
            
            db_city = City(
                name=city_data["name"],
                state_id=state_cache[state_name],
                lat=city_data["lat"],
                lng=city_data["lng"]
            )
            db.add(db_city)
            db.commit()
            city_cache[city_data["name"]] = db_city.id
            
            for ward_data in city_data["wards"]:
                db_ward = Ward(
                    id=ward_data["id"],
                    name=ward_data["name"],
                    name_hi=ward_data["name_hi"],
                    city_id=db_city.id,
                    officer_name=ward_data["officer_name"],
                    officer_phone=ward_data["officer_phone"],
                    officer_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                    center_lat=city_data["lat"],
                    center_lng=city_data["lng"],
                    color="#4F46E5"
                )
                db.add(db_ward)
            db.commit()
            
        # 2. Seed Departments
        for dept_data in DEPARTMENTS:
            db_dept = Department(
                id=dept_data["id"],
                name=dept_data["name"],
                name_hi=dept_data["name_hi"]
            )
            db.add(db_dept)
        db.commit()
        
        # 3. Seed Categories
        for cat_data in CATEGORIES:
            db_cat = Category(
                id=cat_data["id"],
                label=cat_data["label"],
                label_hi=cat_data["label_hi"],
                icon_name=cat_data["icon_name"],
                department_id=cat_data["department_id"],
                description=cat_data["description"],
                description_hi=cat_data["description_hi"],
                color=cat_data["color"],
                bg_gradient=cat_data["bg_gradient"]
            )
            db.add(db_cat)
        db.commit()
        
        # 4. Seed Admin and Citizen Custom / Demo Users
        admin_user = User(
            id="usr-admin-demo",
            name="Admin Demo",
            email="admin@nagarsathi.demo",
            password_hash=hash_password("password123"),
            role="admin",
            phone="+91 98765 43210",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            points=0,
            badges=[],
            is_verified=True
        )
        db.add(admin_user)
        
        admin_settings = UserSettings(
            user_id="usr-admin-demo",
            email_notifications=True,
            push_notifications=True,
            language_preference="en",
            accessibility_reduced_motion=False,
            city_preference="Bhopal"
        )
        db.add(admin_settings)
        
        citizen_user = User(
            id="usr-citizen-demo",
            name="Citizen Demo",
            email="citizen@nagarsathi.demo",
            password_hash=hash_password("password123"),
            role="citizen",
            phone="+91 98765 43210",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            points=42,
            badges=["badge-first-report", "badge-five-reports"],
            is_verified=True
        )
        db.add(citizen_user)
        
        citizen_settings = UserSettings(
            user_id="usr-citizen-demo",
            email_notifications=True,
            push_notifications=True,
            language_preference="en",
            accessibility_reduced_motion=False,
            city_preference="Bhopal"
        )
        db.add(citizen_settings)
        db.commit()
        
        # 5. Seed Mock Issues
        sample_reports = [
            {
                "id": "iss-bpl-01",
                "tracking_id": "CFX-2026-8A72",
                "title": "Severe Pothole Cluster on Main Road",
                "description": "A group of deep potholes has developed near the intersection, causing traffic blockages and posing risk to motorbikes.",
                "category": "roads-potholes",
                "department": "roads-infra",
                "status": "In Progress",
                "priority": "High",
                "lat": 23.2510,
                "lng": 77.4190,
                "address": "Near Chetak Bridge, MP Nagar, Bhopal, Madhya Pradesh",
                "photo_url": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80"
            },
            {
                "id": "iss-bpl-02",
                "tracking_id": "CFX-2026-3B19",
                "title": "Overflowing Public Dustbin",
                "description": "Garbage dump container has not been cleared for 3 days. Foul odor spreading and stray animals scattering plastic waste.",
                "category": "garbage-waste",
                "department": "sanitation-dept",
                "status": "Reported",
                "priority": "Critical",
                "lat": 23.2420,
                "lng": 77.4310,
                "address": "Arera Colony Sector E, Bhopal, Madhya Pradesh",
                "photo_url": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80"
            },
            {
                "id": "iss-bpl-03",
                "tracking_id": "CFX-2026-4E12",
                "title": "Major Water Pipeline Leakage",
                "description": "Large amount of clean drinking water gushing out onto the street from a broken underground pipe joint.",
                "category": "water-supply",
                "department": "water-supply",
                "status": "Resolved",
                "priority": "High",
                "lat": 23.2380,
                "lng": 77.4150,
                "address": "Shahpura Sector 3, Bhopal, Madhya Pradesh",
                "photo_url": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
                "resolution_notes": "Main supply valve isolated. Defective pipe casing cut and replaced with new heavy-duty collar.",
                "resolution_photo_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
            }
        ]
        
        for rep in sample_reports:
            db_rep = Report(
                id=rep["id"],
                tracking_id=rep["tracking_id"],
                title=rep["title"],
                description=rep["description"],
                category=rep["category"],
                department=rep["department"],
                status=rep["status"],
                priority=rep["priority"],
                lat=rep["lat"],
                lng=rep["lng"],
                address=rep["address"],
                state="Madhya Pradesh",
                district="Bhopal District",
                city="Bhopal",
                ward_id="bpl-ward-01" if rep["id"] == "iss-bpl-01" else "bpl-ward-02",
                photo_url=rep["photo_url"],
                resolution_notes=rep.get("resolution_notes"),
                resolution_photo_url=rep.get("resolution_photo_url"),
                reported_by="usr-citizen-demo",
                language="en",
                upvotes=15 if rep["id"] == "iss-bpl-01" else 5
            )
            db.add(db_rep)
            
            # Initial history record
            db_history1 = StatusHistoryItem(
                report_id=rep["id"],
                status="Reported",
                note="Issue filed and routed.",
                updated_by="Citizen Demo",
                timestamp=datetime.now(timezone.utc) - timedelta(days=2)
            )
            db.add(db_history1)
            
            if rep["status"] in ["In Progress", "Resolved"]:
                db_history2 = StatusHistoryItem(
                    report_id=rep["id"],
                    status="Acknowledged",
                    note="Department assigned and site inspection scheduled.",
                    updated_by="Admin Demo",
                    timestamp=datetime.now(timezone.utc) - timedelta(days=1, hours=18)
                )
                db.add(db_history2)
                
                db_history3 = StatusHistoryItem(
                    report_id=rep["id"],
                    status="In Progress",
                    note="Repair crew deployed to location.",
                    updated_by="Admin Demo",
                    timestamp=datetime.now(timezone.utc) - timedelta(days=1)
                )
                db.add(db_history3)
                
            if rep["status"] == "Resolved":
                db_history4 = StatusHistoryItem(
                    report_id=rep["id"],
                    status="Resolved",
                    note=rep.get("resolution_notes"),
                    updated_by="Admin Demo",
                    photo_url=rep.get("resolution_photo_url"),
                    timestamp=datetime.now(timezone.utc) - timedelta(hours=6)
                )
                db.add(db_history4)
                
        db.commit()
        print("Database seeded successfully with states, cities, wards, categories, departments, demo users, and mock issues!")
        
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

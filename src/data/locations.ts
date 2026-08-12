export interface WardInfo {
  id: string;
  name: string;
  nameHi: string;
  officerName: string;
  officerPhone: string;
}

export interface CityInfo {
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  wards: WardInfo[];
}

export interface DistrictInfo {
  name: string;
  cities: string[];
}

export interface StateInfo {
  name: string;
  districts: DistrictInfo[];
}

export const INDIAN_LOCATIONS: CityInfo[] = [
  {
    name: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    wards: [
      { id: 'mum-ward-01', name: 'Colaba (Ward A)', nameHi: 'कुलाबा (वॉर्ड A)', officerName: 'Anil Deshmukh', officerPhone: '+91 22 2202 0001' },
      { id: 'mum-ward-02', name: 'Bandra West (Ward H-West)', nameHi: 'बांद्रा वेस्ट (वॉर्ड H-वेस्ट)', officerName: 'Sunita Rao', officerPhone: '+91 22 2202 0002' },
      { id: 'mum-ward-03', name: 'Andheri East (Ward K-East)', nameHi: 'अंधेरी ईस्ट (वॉर्ड K-ईस्ट)', officerName: 'Vikram Sawant', officerPhone: '+91 22 2202 0003' },
      { id: 'mum-ward-04', name: 'Borivali (Ward R-Central)', nameHi: 'बोरीवली (वॉर्ड R-सेंट्रल)', officerName: 'Priya Patil', officerPhone: '+91 22 2202 0004' },
      { id: 'mum-ward-05', name: 'Dadar (Ward G-North)', nameHi: 'दादर (वॉर्ड G-नॉर्थ)', officerName: 'Ramesh Kadam', officerPhone: '+91 22 2202 0005' },
    ]
  },
  {
    name: 'Pune',
    district: 'Pune District',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    wards: [
      { id: 'pne-ward-01', name: 'Kothrud Area', nameHi: 'कोथरुड परिसर', officerName: 'Mahesh Shinde', officerPhone: '+91 20 2550 1101' },
      { id: 'pne-ward-02', name: 'Shivaji Nagar', nameHi: 'शिवाजी नगर', officerName: 'Kirti Joshi', officerPhone: '+91 20 2550 1102' },
      { id: 'pne-ward-03', name: 'Viman Nagar', nameHi: 'विमान नगर', officerName: 'Sanjay More', officerPhone: '+91 20 2550 1103' },
      { id: 'pne-ward-04', name: 'Hinjawadi IT Park', nameHi: 'हिंजवडी आईटी पार्क', officerName: 'Rahul Jagtap', officerPhone: '+91 20 2550 1104' },
      { id: 'pne-ward-05', name: 'Hadapsar', nameHi: 'हडपसर', officerName: 'Nisha Tambe', officerPhone: '+91 20 2550 1105' },
    ]
  },
  {
    name: 'Nagpur',
    district: 'Nagpur District',
    state: 'Maharashtra',
    lat: 21.1458,
    lng: 79.0882,
    wards: [
      { id: 'ngp-ward-01', name: 'Dharampeth', nameHi: 'धरमपेठ', officerName: 'Satish Vyas', officerPhone: '+91 712 256 0011' },
      { id: 'ngp-ward-02', name: 'Sadar Area', nameHi: 'सदर परिसर', officerName: 'Amit Gokhale', officerPhone: '+91 712 256 0012' },
      { id: 'ngp-ward-03', name: 'Manish Nagar', nameHi: 'मनीष नगर', officerName: 'Prashant Naik', officerPhone: '+91 712 256 0013' },
    ]
  },
  {
    name: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    wards: [
      { id: 'blr-ward-01', name: 'Indiranagar (Ward 80)', nameHi: 'इंदिरानगर (वॉर्ड 80)', officerName: 'Kishore Kumar', officerPhone: '+91 80 2221 0001' },
      { id: 'blr-ward-02', name: 'Koramangala (Ward 151)', nameHi: 'कोरामंगला (वॉर्ड 151)', officerName: 'Divya Reddy', officerPhone: '+91 80 2221 0002' },
      { id: 'blr-ward-03', name: 'Whitefield (Ward 84)', nameHi: 'व्हाइटफील्ड (वॉर्ड 84)', officerName: 'Arjun Gowda', officerPhone: '+91 80 2221 0003' },
      { id: 'blr-ward-04', name: 'HSR Layout (Ward 174)', nameHi: 'एचएसआर लेआउट (वॉर्ड 174)', officerName: 'Meghana Rao', officerPhone: '+91 80 2221 0004' },
      { id: 'blr-ward-05', name: 'Jayanagar (Ward 153)', nameHi: 'जयनगर (वॉर्ड 153)', officerName: 'Prakash Shetty', officerPhone: '+91 80 2221 0005' },
    ]
  },
  {
    name: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    wards: [
      { id: 'koc-ward-01', name: 'Fort Kochi', nameHi: 'फोर्ट कोच्चि', officerName: 'Antony Joseph', officerPhone: '+91 484 236 0021' },
      { id: 'koc-ward-02', name: 'Kakkanad Infopark', nameHi: 'कक्कनाड इन्फोपार्क', officerName: 'Sheela Thomas', officerPhone: '+91 484 236 0022' },
      { id: 'koc-ward-03', name: 'Edappally Area', nameHi: 'इडप्पल्ली परिसर', officerName: 'Manoj Pillai', officerPhone: '+91 484 236 0023' },
    ]
  },
  {
    name: 'Chennai',
    district: 'Chennai District',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    wards: [
      { id: 'chn-ward-01', name: 'Adyar (Zone 13)', nameHi: 'अड्यार (ज़ोन 13)', officerName: 'R. Subramanian', officerPhone: '+91 44 2530 0001' },
      { id: 'chn-ward-02', name: 'T. Nagar (Zone 10)', nameHi: 'टी. नगर (ज़ोन 10)', officerName: 'S. Lakshmi', officerPhone: '+91 44 2530 0002' },
      { id: 'chn-ward-03', name: 'Anna Nagar (Zone 8)', nameHi: 'अन्ना नगर (ज़ोन 8)', officerName: 'V. Murugan', officerPhone: '+91 44 2530 0003' },
      { id: 'chn-ward-04', name: 'Mylapore Area', nameHi: 'मायलापुर परिसर', officerName: 'K. Srinivasan', officerPhone: '+91 44 2530 0004' },
    ]
  },
  {
    name: 'Hyderabad',
    district: 'Hyderabad District',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    wards: [
      { id: 'hyd-ward-01', name: 'Gachibowli IT Hub', nameHi: 'गच्चीबोवली आईटी हब', officerName: 'P. Srinivas', officerPhone: '+91 40 2322 0011' },
      { id: 'hyd-ward-02', name: 'Jubilee Hills', nameHi: 'जुबली हिल्स', officerName: 'K. Anuradha', officerPhone: '+91 40 2322 0012' },
      { id: 'hyd-ward-03', name: 'Madhapur Area', nameHi: 'माधापुर परिसर', officerName: 'M. A. Raoof', officerPhone: '+91 40 2322 0013' },
      { id: 'hyd-ward-04', name: 'Secunderabad Zone', nameHi: 'सिकंदराबाद ज़ोन', officerName: 'T. Narsimha', officerPhone: '+91 40 2322 0014' },
    ]
  },
  {
    name: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    wards: [
      { id: 'del-ward-01', name: 'Saket (South Zone)', nameHi: 'साकेत (साउथ ज़ोन)', officerName: 'Rajesh Meena', officerPhone: '+91 11 2338 0001' },
      { id: 'del-ward-02', name: 'Connaught Place', nameHi: 'कनॉट प्लेस', officerName: 'Sunil Kumar', officerPhone: '+91 11 2338 0002' },
      { id: 'del-ward-03', name: 'Karol Bagh (West Zone)', nameHi: 'करोल बाग (वेस्ट ज़ोन)', officerName: 'Deepa Verma', officerPhone: '+91 11 2338 0003' },
      { id: 'del-ward-04', name: 'Dwarka Sector 10', nameHi: 'द्वारका सेक्टर 10', officerName: 'Vikas Sharma', officerPhone: '+91 11 2338 0004' },
      { id: 'del-ward-05', name: 'Hauz Khas Area', nameHi: 'हौज खास परिसर', officerName: 'Sonia Gandhi', officerPhone: '+91 11 2338 0005' },
    ]
  },
  {
    name: 'Ahmedabad',
    district: 'Ahmedabad District',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    wards: [
      { id: 'ahd-ward-01', name: 'Navrangpura', nameHi: 'नवरंगपुरा', officerName: 'Jignesh Patel', officerPhone: '+91 79 2755 0001' },
      { id: 'ahd-ward-02', name: 'Satellite Area', nameHi: 'सैटेलाइट परिसर', officerName: 'Bhavna Shah', officerPhone: '+91 79 2755 0002' },
      { id: 'ahd-ward-03', name: 'Vastrapur Circle', nameHi: 'वस्त्रापुर सर्कल', officerName: 'Sanjay Rawal', officerPhone: '+91 79 2755 0003' },
    ]
  },
  {
    name: 'Surat',
    district: 'Surat District',
    state: 'Gujarat',
    lat: 21.1702,
    lng: 72.8311,
    wards: [
      { id: 'srt-ward-01', name: 'Adajan Zone', nameHi: 'अडाजण ज़ोन', officerName: 'Mehul Mehta', officerPhone: '+91 261 242 0011' },
      { id: 'srt-ward-02', name: 'Piplod Road', nameHi: 'पिपलोद रोड', officerName: 'Aarti Patel', officerPhone: '+91 261 242 0012' },
    ]
  },
  {
    name: 'Bhopal',
    district: 'Bhopal District',
    state: 'Madhya Pradesh',
    lat: 23.2599,
    lng: 77.4126,
    wards: [
      { id: 'bpl-ward-01', name: 'Zone I — MP Nagar', nameHi: 'ज़ोन I — एमपी नगर', officerName: 'Rajendra Patel', officerPhone: '+91 755 401 0001' },
      { id: 'bpl-ward-02', name: 'Zone II — Arera Colony', nameHi: 'ज़ोन II — अरेरा कॉलोनी', officerName: 'Meena Sharma', officerPhone: '+91 755 401 0002' },
      { id: 'bpl-ward-03', name: 'Zone III — TT Nagar', nameHi: 'ज़ोन III — टीटी नगर', officerName: 'Arjun Singh', officerPhone: '+91 755 401 0003' },
      { id: 'bpl-ward-04', name: 'Zone IV — Shahpura', nameHi: 'ज़ोन IV — शाहपुरा', officerName: 'Kavita Joshi', officerPhone: '+91 755 401 0004' },
      { id: 'bpl-ward-05', name: 'Zone V — Kolar Road', nameHi: 'ज़ोन V — कोलार रोड', officerName: 'Vikram Mehta', officerPhone: '+91 755 401 0005' },
    ]
  },
  {
    name: 'Indore',
    district: 'Indore District',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lng: 75.8577,
    wards: [
      { id: 'ind-ward-01', name: 'Vijay Nagar', nameHi: 'विजय नगर', officerName: 'Anupam Mishra', officerPhone: '+91 731 243 0001' },
      { id: 'ind-ward-02', name: 'Palasia Area', nameHi: 'पलासिया परिसर', officerName: 'Priya Sharma', officerPhone: '+91 731 243 0002' },
      { id: 'ind-ward-03', name: 'Rajwada Market', nameHi: 'राजवाड़ा संकेत', officerName: 'Harish Jain', officerPhone: '+91 731 243 0003' },
    ]
  },
  {
    name: 'Jaipur',
    district: 'Jaipur District',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    wards: [
      { id: 'jpr-ward-01', name: 'Vaishali Nagar', nameHi: 'वैशाली नगर', officerName: 'Rakesh Sharma', officerPhone: '+91 141 274 0011' },
      { id: 'jpr-ward-02', name: 'Malviya Nagar Jaipur', nameHi: 'मालवीय नगर जयपुर', officerName: 'Shalini Gupta', officerPhone: '+91 141 274 0012' },
      { id: 'jpr-ward-03', name: 'C-Scheme Area', nameHi: 'सी-स्कीम परिसर', officerName: 'Yashwant Singh', officerPhone: '+91 141 274 0013' },
    ]
  },
  {
    name: 'Lucknow',
    district: 'Lucknow District',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    wards: [
      { id: 'lko-ward-01', name: 'Hazratganj Circle', nameHi: 'हज़रतगंज सर्कल', officerName: 'Alok Srivastava', officerPhone: '+91 522 222 0011' },
      { id: 'lko-ward-02', name: 'Gomti Nagar', nameHi: 'गोमती नगर', officerName: 'Neelam Tewari', officerPhone: '+91 522 222 0012' },
      { id: 'lko-ward-03', name: 'Aliganj Area', nameHi: 'अलीगंज परिसर', officerName: 'Sanjay Mishra', officerPhone: '+91 522 222 0013' },
    ]
  },
  {
    name: 'Chandigarh',
    district: 'Chandigarh District',
    state: 'Chandigarh',
    lat: 30.7333,
    lng: 76.7794,
    wards: [
      { id: 'chd-ward-01', name: 'Sector 17 Market', nameHi: 'सेक्टर 17 मार्केट', officerName: 'Gurpreet Singh', officerPhone: '+91 172 270 0001' },
      { id: 'chd-ward-02', name: 'Sector 35 Area', nameHi: 'सेक्टर 35 परिसर', officerName: 'Navjot Kaur', officerPhone: '+91 172 270 0002' },
    ]
  },
  {
    name: 'Kolkata',
    district: 'Kolkata District',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    wards: [
      { id: 'kol-ward-01', name: 'Salt Lake Sector V', nameHi: 'सॉल्ट लेक सेक्टर V', officerName: 'Subhasish Banerjee', officerPhone: '+91 33 2248 0001' },
      { id: 'kol-ward-02', name: 'Park Street Area', nameHi: 'पार्क स्ट्रीट परिसर', officerName: 'Debolina Roy', officerPhone: '+91 33 2248 0002' },
      { id: 'kol-ward-03', name: 'Ballygunge Circle', nameHi: 'बालीगंज सर्कल', officerName: 'Rajat Sen', officerPhone: '+91 33 2248 0003' },
    ]
  },
  {
    name: 'Patna',
    district: 'Patna District',
    state: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
    wards: [
      { id: 'pat-ward-01', name: 'Kankarbagh Sector 1', nameHi: 'कंकड़बाग सेक्टर 1', officerName: 'Shambhu Yadav', officerPhone: '+91 612 220 0011' },
      { id: 'pat-ward-02', name: 'Boring Road Crossing', nameHi: 'बोरिंग रोड चौराहा', officerName: 'Archana Sinha', officerPhone: '+91 612 220 0012' },
    ]
  },
  {
    name: 'Bhubaneswar',
    district: 'Khordha District',
    state: 'Odisha',
    lat: 20.2961,
    lng: 85.8245,
    wards: [
      { id: 'bbs-ward-01', name: 'Saheed Nagar', nameHi: 'शहीद नगर', officerName: 'Prafulla Mohanty', officerPhone: '+91 674 253 0021' },
      { id: 'bbs-ward-02', name: 'Patia Area', nameHi: 'पटिया परिसर', officerName: 'Soumya Patnaik', officerPhone: '+91 674 253 0022' },
    ]
  },
  {
    name: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    lat: 26.1158,
    lng: 91.7086,
    wards: [
      { id: 'gwt-ward-01', name: 'Paltan Bazaar', nameHi: 'पलटन बाज़ार', officerName: 'Bipul Baruah', officerPhone: '+91 361 254 0011' },
      { id: 'gwt-ward-02', name: 'Dispur Secretariat', nameHi: 'दिसपुर सचिवालय', officerName: 'Jahnvi Saikia', officerPhone: '+91 361 254 0012' },
    ]
  },
  {
    name: 'Dehradun',
    district: 'Dehradun District',
    state: 'Uttarakhand',
    lat: 30.3165,
    lng: 78.0322,
    wards: [
      { id: 'ddn-ward-01', name: 'Rajpur Road Jakhan', nameHi: 'राजपुर रोड जाखन', officerName: 'Sanjay Negi', officerPhone: '+91 135 271 0011' },
      { id: 'ddn-ward-02', name: 'Patel Nagar Zone', nameHi: 'पटेल नगर ज़ोन', officerName: 'Mamta Rawat', officerPhone: '+91 135 271 0012' },
    ]
  }
];

export const LOCATION_STORAGE_KEY = 'nagarsathi_current_location';

export function getSelectedLocation(): CityInfo {
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error parsing stored location:', e);
  }
  // Default fallback: Pune, Maharashtra
  return INDIAN_LOCATIONS.find((c) => c.name === 'Pune') || INDIAN_LOCATIONS[1];
}

export function saveSelectedLocation(city: CityInfo): void {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(city));
  } catch (e) {
    console.error('Error saving location:', e);
  }
}

export function getCityWards(cityName: string): WardInfo[] {
  const city = INDIAN_LOCATIONS.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
  return city ? city.wards : [];
}

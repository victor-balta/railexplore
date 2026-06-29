import { CategoryType, TrainDeal, ChatMessage, Accommodation, Activity } from './types';

export const BERLIN_COORDS = { lat: 52.5200, lng: 13.4050 };

const baseDestinations: TrainDeal[] = [
  {
    id: 'prague',
    destinationName: 'Prague',
    destinationCountry: 'Czechia',
    originName: 'Berlin',
    category: CategoryType.City,
    description: 'The City of a Hundred Spires, famous for its Old Town Square and baroque buildings.',
    location: { lat: 50.0755, lng: 14.4378 },
    duration: '4h 20m',
    price: 29,
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'EuroCity (EC)',
    transfers: 0,
    weather: [
      { date: 'Apr 7', temp: 16, condition: 'sunny' },
      { date: 'Apr 8', temp: 18, condition: 'sunny' },
      { date: 'Apr 9', temp: 15, condition: 'cloudy' }
    ]
  },
  {
    id: 'warsaw',
    destinationName: 'Warsaw',
    destinationCountry: 'Poland',
    originName: 'Berlin',
    category: CategoryType.Historical,
    description: 'A dynamic city with a beautifully restored Old Town and rich history.',
    location: { lat: 52.2297, lng: 21.0122 },
    duration: '5h 30m',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'EuroCity (EC)',
    transfers: 0,
    weather: [
      { date: 'Apr 7', temp: 14, condition: 'cloudy' },
      { date: 'Apr 8', temp: 15, condition: 'sunny' },
      { date: 'Apr 9', temp: 13, condition: 'rainy' }
    ]
  },
  {
    id: 'amsterdam',
    destinationName: 'Amsterdam',
    destinationCountry: 'Netherlands',
    originName: 'Berlin',
    category: CategoryType.City,
    description: 'Famous for its canals, beautiful houses, and vibrant cultural scene.',
    location: { lat: 52.3676, lng: 4.9041 },
    duration: '6h 10m',
    price: 49,
    imageUrl: 'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'Intercity (IC)',
    transfers: 0,
    weather: [
      { date: 'Apr 7', temp: 12, condition: 'rainy' },
      { date: 'Apr 8', temp: 14, condition: 'cloudy' },
      { date: 'Apr 9', temp: 15, condition: 'sunny' }
    ]
  },
  {
    id: 'copenhagen',
    destinationName: 'Copenhagen',
    destinationCountry: 'Denmark',
    originName: 'Berlin',
    category: CategoryType.City,
    description: 'A charming coastal city known for its design, cycling culture, and Nyhavn.',
    location: { lat: 55.6761, lng: 12.5683 },
    duration: '7h 15m',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c311a071f9?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'DSB / DB',
    transfers: 1,
    weather: [
      { date: 'Apr 7', temp: 10, condition: 'cloudy' },
      { date: 'Apr 8', temp: 12, condition: 'sunny' },
      { date: 'Apr 9', temp: 11, condition: 'rainy' }
    ]
  },
  {
    id: 'munich',
    destinationName: 'Munich',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    description: 'Bavarian capital known for its annual Oktoberfest and beer halls.',
    location: { lat: 48.1351, lng: 11.5820 },
    duration: '3h 55m',
    price: 39,
    imageUrl: 'https://images.unsplash.com/photo-1595867985827-0466318535a2?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'ICE',
    transfers: 0,
    weather: [
      { date: 'Apr 7', temp: 15, condition: 'sunny' },
      { date: 'Apr 8', temp: 17, condition: 'sunny' },
      { date: 'Apr 9', temp: 16, condition: 'cloudy' }
    ]
  },
  {
    id: 'vienna',
    destinationName: 'Vienna',
    destinationCountry: 'Austria',
    originName: 'Berlin',
    category: CategoryType.Historical,
    description: 'Imperial architecture, coffee house culture, and classical music legacy.',
    location: { lat: 48.2082, lng: 16.3738 },
    duration: '7h 45m',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1563804099-77e80f6dc8c8?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'ICE / Railjet',
    transfers: 1,
    weather: [
      { date: 'Apr 7', temp: 15, condition: 'sunny' },
      { date: 'Apr 8', temp: 16, condition: 'cloudy' },
      { date: 'Apr 9', temp: 14, condition: 'rainy' }
    ]
  },
  {
    id: 'zurich',
    destinationName: 'Zurich',
    destinationCountry: 'Switzerland',
    originName: 'Berlin',
    category: CategoryType.Lakeside,
    description: 'A global center for banking and finance, set at the north end of Lake Zurich.',
    location: { lat: 47.3769, lng: 8.5417 },
    duration: '8h 30m',
    price: 89,
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'ICE',
    transfers: 0,
    weather: [
      { date: 'Apr 7', temp: 13, condition: 'cloudy' },
      { date: 'Apr 8', temp: 15, condition: 'sunny' },
      { date: 'Apr 9', temp: 14, condition: 'sunny' }
    ]
  },
  {
    id: 'paris',
    destinationName: 'Paris',
    destinationCountry: 'France',
    originName: 'Berlin',
    category: CategoryType.Romantic,
    description: 'The City of Light, world-famous for art, fashion, gastronomy and culture.',
    location: { lat: 48.8566, lng: 2.3522 },
    duration: '8h 15m',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'ICE / TGV',
    transfers: 1,
    weather: [
      { date: 'Apr 7', temp: 18, condition: 'cloudy' },
      { date: 'Apr 8', temp: 20, condition: 'sunny' },
      { date: 'Apr 9', temp: 19, condition: 'sunny' }
    ]
  },
  {
    id: 'brussels',
    destinationName: 'Brussels',
    destinationCountry: 'Belgium',
    originName: 'Berlin',
    category: CategoryType.City,
    description: 'The capital of the EU, famous for its chocolates, waffles, and Grand-Place.',
    location: { lat: 50.8503, lng: 4.3517 },
    duration: '6h 45m',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'ICE',
    transfers: 1,
    weather: [
      { date: 'Apr 7', temp: 14, condition: 'rainy' },
      { date: 'Apr 8', temp: 16, condition: 'cloudy' },
      { date: 'Apr 9', temp: 15, condition: 'sunny' }
    ]
  },
  {
    id: 'budapest',
    destinationName: 'Budapest',
    destinationCountry: 'Hungary',
    originName: 'Berlin',
    category: CategoryType.Historical,
    description: 'Bisected by the River Danube, known for its thermal baths and stunning Parliament.',
    location: { lat: 47.4979, lng: 19.0402 },
    duration: '11h 20m',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 11',
    trainOperator: 'EuroCity (EC) / Nightjet',
    transfers: 0,
    weather: [
      { date: 'Apr 7', temp: 17, condition: 'sunny' },
      { date: 'Apr 8', temp: 19, condition: 'sunny' },
      { date: 'Apr 9', temp: 18, condition: 'cloudy' }
    ]
  }
];

const generateMoreDestinations = (): TrainDeal[] => {
  const more: TrainDeal[] = [];
  
  const richCities = [
    { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, img: '1552832232098-c326d4d50f23', desc: 'The Eternal City, home to the Colosseum, Pantheon, and Vatican City.', cat: CategoryType.Historical },
    { name: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.1900, img: '1533227260856-23b6b23bfa99', desc: 'A global capital of fashion and design, featuring the magnificent Duomo.', cat: CategoryType.City },
    { name: 'Venice', country: 'Italy', lat: 45.4408, lng: 12.3155, img: '1514890547357-a9ee288728e0', desc: 'Built on more than 100 small islands, famous for its romantic canals.', cat: CategoryType.Romantic },
    { name: 'Florence', country: 'Italy', lat: 43.7696, lng: 11.2558, img: '1543429776-278263259837', desc: 'The cradle of the Renaissance, rich with art and architectural masterpieces.', cat: CategoryType.Historical },
    { name: 'Naples', country: 'Italy', lat: 40.8518, lng: 14.2681, img: '1537233250-7117431e5323', desc: 'Birthplace of pizza, situated near the iconic Mount Vesuvius.', cat: CategoryType.City },
    { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, img: '1539037116271-8b067a9082b2', desc: 'A city of elegant boulevards and expansive, manicured parks.', cat: CategoryType.City },
    { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, img: '1583422409516-a715f7028ceb', desc: 'Known for its art and architecture, notably the fantastical Sagrada Família.', cat: CategoryType.Beaches },
    { name: 'Valencia', country: 'Spain', lat: 39.4699, lng: -0.3774, img: '1555883641-7681335b7190', desc: 'Famed for its City of Arts and Sciences and beautiful sandy beaches.', cat: CategoryType.Beaches },
    { name: 'Seville', country: 'Spain', lat: 37.3891, lng: -5.9845, img: '1559560410-6c9fa1c74163', desc: 'Famous for flamenco dancing and striking Moorish architecture.', cat: CategoryType.Historical },
    { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, img: '1589330687116-3e818817a00d', desc: 'A coastal capital known for pastel-colored buildings and vibrant nightlife.', cat: CategoryType.City },
    { name: 'Porto', country: 'Portugal', lat: 41.1579, lng: -8.6291, img: '1560938507-66a7b7a13f01', desc: 'Famous for its stately bridges and port wine production.', cat: CategoryType.Romantic },
    { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, img: '1513635269975-59663e0ac1ad', desc: 'A 21st-century city with history stretching back to Roman times.', cat: CategoryType.City },
    { name: 'Edinburgh', country: 'UK', lat: 55.9533, lng: -3.1883, img: '1532822178206-bd5662a5b678', desc: 'Scotland\'s hilly capital, known for its historic castle and Old Town.', cat: CategoryType.Historical },
    { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, img: '1586716035889-40b540679803', desc: 'A literary city famous for its lively pubs and the historic Trinity College.', cat: CategoryType.City },
    { name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, img: '1579298539-7a0e363b9fec', desc: 'Surrounded by green hills and mountains, famous for maritime history.', cat: CategoryType.Nature },
    { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, img: '1509353982425-4c07d3902930', desc: 'Encompasses 14 islands and more than 50 bridges on an extensive Baltic Sea archipelago.', cat: CategoryType.Lakeside },
    { name: 'Helsinki', country: 'Finland', lat: 60.1695, lng: 24.9354, img: '1530378037303-3daeef8a57eb', desc: 'A modern, eco-friendly city situated on a beautiful peninsula.', cat: CategoryType.Nature },
    { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, img: '1603565815387-a2c72b22bb35', desc: 'The heart of Ancient Greece, dominated by the majestic Acropolis.', cat: CategoryType.Historical },
    { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, img: '1524231757712-2f64ed342a77', desc: 'A vibrant metropolis where Europe meets Asia across the Bosphorus Strait.', cat: CategoryType.Historical },
    { name: 'Salzburg', country: 'Austria', lat: 47.8095, lng: 13.0550, img: '1591871207137-0cf3c8861e60', desc: 'Birthplace of Mozart, featuring stunning alpine backdrops and baroque architecture.', cat: CategoryType.Mountains },
    { name: 'Bordeaux', country: 'France', lat: 44.8378, lng: -0.5792, img: '1598424160408-56f7ef57d745', desc: 'The wine capital of the world, dotted with 18th-century mansions.', cat: CategoryType.Romantic },
    { name: 'Lyon', country: 'France', lat: 45.7640, lng: 4.8357, img: '1596700889146-24ba0fc74900', desc: 'A historic city famous for its gastronomy, Roman ruins, and Renaissance districts.', cat: CategoryType.Historical },
    { name: 'Cologne', country: 'Germany', lat: 50.9375, lng: 6.9603, img: '1599879793132-73a70f3fde52', desc: 'Famed for its twin-spired Gothic cathedral and the romantic Rhine River.', cat: CategoryType.City },
    { name: 'Hamburg', country: 'Germany', lat: 53.5511, lng: 9.9937, img: '1551221434-2e21b71cb61d', desc: 'A major port city in northern Germany, known for hundreds of canals and elegant brickwork.', cat: CategoryType.City },
    { name: 'Strasbourg', country: 'France', lat: 48.5734, lng: 7.7521, img: '1606733221980-fc02a9b31d4e', desc: 'A blend of French and German cultures, featuring a beautiful Gothic cathedral.', cat: CategoryType.Romantic },
    { name: 'Krakow', country: 'Poland', lat: 50.0647, lng: 19.9450, img: '1600109968846-978d3810a97c', desc: 'Known for its well-preserved medieval core and Jewish quarter.', cat: CategoryType.Historical },
    { name: 'Ljubljana', country: 'Slovenia', lat: 46.0569, lng: 14.5058, img: '1576785641774-8848db6e5be7', desc: 'A green and highly walkable capital city with a lively outdoor cafe culture.', cat: CategoryType.Nature },
    { name: 'Zagreb', country: 'Croatia', lat: 45.8150, lng: 15.9819, img: '1628108502573-030999de4293', desc: 'Distinguished by its 18th- and 19th-century Austro-Hungarian architecture.', cat: CategoryType.City },
    { name: 'Bratislava', country: 'Slovakia', lat: 48.1486, lng: 17.1077, img: '1631557348924-f7b539fb0421', desc: 'Set along the Danube River, featuring a pedestrian-only, 18th-century old town.', cat: CategoryType.Historical },
    { name: 'Tallinn', country: 'Estonia', lat: 59.4370, lng: 24.7536, img: '1583344600122-349c89ce46ee', desc: 'Boasts one of the best-preserved medieval city centers in Europe.', cat: CategoryType.Historical },
    
    // Additional Cities
    { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, img: '1550974641-523da05e451b', desc: 'A central German city, known as a major financial hub with a stunning skyline.', cat: CategoryType.City },
    { name: 'Dusseldorf', country: 'Germany', lat: 51.2277, lng: 6.7735, img: '1573059492196-857502cfa913', desc: 'Renowned for its art and fashion scene, divided by the Rhine River.', cat: CategoryType.City },
    { name: 'Leipzig', country: 'Germany', lat: 51.3397, lng: 12.3731, img: '1635338167822-1d5964f43c39', desc: 'A vibrant arts city, deeply connected to classical musicians like Bach and Wagner.', cat: CategoryType.Historical },
    { name: 'Dresden', country: 'Germany', lat: 51.0504, lng: 13.7373, img: '1576426364027-ad71c35c8b74', desc: 'Rebuilt from ruins, featuring classic architecture and world-class museums.', cat: CategoryType.Historical },
    { name: 'Nuremberg', country: 'Germany', lat: 49.4521, lng: 11.0767, img: '1615556272545-2e6dd052d91b', desc: 'Famous for its medieval architecture, fortified old town, and historical significance.', cat: CategoryType.Historical },
    { name: 'Stuttgart', country: 'Germany', lat: 48.7758, lng: 9.1829, img: '1583802958467-f4955b252062', desc: 'The cradle of the automobile, surrounded by vineyards and beautiful parks.', cat: CategoryType.City },
    { name: 'Hannover', country: 'Germany', lat: 52.3759, lng: 9.7320, img: '1612984577553-61b8f52edc8b', desc: 'Home to extensive green spaces and the magnificent Herrenhausen Gardens.', cat: CategoryType.Nature },
    { name: 'Bremen', country: 'Germany', lat: 53.0793, lng: 8.8017, img: '1618684443722-13ccf3659223', desc: 'A Hanseatic city known for its maritime heritage and the Town Musicians statue.', cat: CategoryType.Historical },
    
    { name: 'Geneva', country: 'Switzerland', lat: 46.2044, lng: 6.1432, img: '1581457173874-ce4f2fb9f6c7', desc: 'A global hub for diplomacy and banking, set on the picturesque Lake Geneva.', cat: CategoryType.Lakeside },
    { name: 'Basel', country: 'Switzerland', lat: 47.5596, lng: 7.5886, img: '1586546377308-3a95c91b5c2a', desc: 'Located on the Rhine River, known for its rich art scene and medieval old town.', cat: CategoryType.Historical },
    { name: 'Bern', country: 'Switzerland', lat: 46.9480, lng: 7.4474, img: '1608670154086-fb7c9c0f9977', desc: 'The capital of Switzerland, boasting a well-preserved medieval city center.', cat: CategoryType.Historical },
    { name: 'Lucerne', country: 'Switzerland', lat: 47.0502, lng: 8.3093, img: '1527668612-421712a201b1', desc: 'A stunning lakeside city surrounded by snow-capped mountains.', cat: CategoryType.Lakeside },
    
    { name: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698, img: '1568216391483-363f8ce3040c', desc: 'A bustling port city in southern France, rich with history and maritime culture.', cat: CategoryType.City },
    { name: 'Nice', country: 'France', lat: 43.7102, lng: 7.2620, img: '1540324867161-008be59681fb', desc: 'The capital of the French Riviera, known for its pebbled shores and sunshine.', cat: CategoryType.Beaches },
    { name: 'Toulouse', country: 'France', lat: 43.6047, lng: 1.4442, img: '1602410712792-75d1d6a6552a', desc: 'The Pink City, famous for its terracotta-brick architecture and aerospace industry.', cat: CategoryType.City },
    { name: 'Nantes', country: 'France', lat: 47.2184, lng: -1.5536, img: '1588673739775-4081c7f9999a', desc: 'A creative and green city on the Loire River, home to the Machines of the Isle.', cat: CategoryType.City },
    { name: 'Lille', country: 'France', lat: 50.6292, lng: 3.0573, img: '1611139454157-8178d120a1ce', desc: 'A cultural hub in northern France with strong Flemish influences.', cat: CategoryType.City },
    
    { name: 'Bruges', country: 'Belgium', lat: 51.2093, lng: 3.2247, img: '1552554625-3652f1e62688', desc: 'A fairy-tale medieval town with cobbled streets and charming canals.', cat: CategoryType.Romantic },
    { name: 'Ghent', country: 'Belgium', lat: 51.0500, lng: 3.7167, img: '1567117565-316a7a0b82df', desc: 'A vibrant university town featuring stunning medieval architecture.', cat: CategoryType.Historical },
    { name: 'Antwerp', country: 'Belgium', lat: 51.2194, lng: 4.4025, img: '1589114406155-225439401815', desc: 'The diamond capital of the world, known for its fashion and historic port.', cat: CategoryType.City },
    
    { name: 'Rotterdam', country: 'Netherlands', lat: 51.9225, lng: 4.4792, img: '1524317666270-b3b3a32506e5', desc: 'A major port city famous for its striking, modern architecture and maritime heritage.', cat: CategoryType.City },
    { name: 'Utrecht', country: 'Netherlands', lat: 52.0907, lng: 5.1214, img: '1610486665798-e304f3263df6', desc: 'A lively city with a medieval center and tree-lined canals with sunken cellars.', cat: CategoryType.Historical },
    { name: 'The Hague', country: 'Netherlands', lat: 52.0705, lng: 4.3007, img: '1554522437-02554df7d6e6', desc: 'The seat of the Dutch government and home to the UN\'s International Court of Justice.', cat: CategoryType.City },
    
    { name: 'Gothenburg', country: 'Sweden', lat: 57.7089, lng: 11.9746, img: '1540307842602-5dc5a796bc75', desc: 'A relaxed coastal city known for its Dutch-style canals and leafy boulevards.', cat: CategoryType.City },
    { name: 'Malmo', country: 'Sweden', lat: 55.6049, lng: 13.0038, img: '1580210741270-13b9cc245bbf', desc: 'A diverse and eco-friendly city connected to Copenhagen via the Øresund Bridge.', cat: CategoryType.City },
    
    { name: 'Verona', country: 'Italy', lat: 45.4384, lng: 10.9916, img: '1580838384247-4cf0de3de516', desc: 'A medieval old town built between the meandering Adige River, famously setting for Romeo and Juliet.', cat: CategoryType.Romantic },
    { name: 'Bologna', country: 'Italy', lat: 44.4949, lng: 11.3426, img: '1564756598501-c89b8849bbf9', desc: 'The historic capital of the Emilia-Romagna region, famous for its incredible food and arcades.', cat: CategoryType.City },
    { name: 'Turin', country: 'Italy', lat: 45.0703, lng: 7.6869, img: '1563604859039-ec9edbe60934', desc: 'Known for its refined architecture and cuisine, set against the backdrop of the Alps.', cat: CategoryType.City },
    { name: 'Genoa', country: 'Italy', lat: 44.4056, lng: 8.9463, img: '1571520623348-18e5ec9c412e', desc: 'A historic port city with a labyrinth of narrow streets and grand palaces.', cat: CategoryType.City },
    
    // UK and Ireland
    { name: 'Manchester', country: 'UK', lat: 53.4808, lng: -2.2426, img: '1515586611323-95b0606b04eb', desc: 'A major city in the northwest of England with a rich industrial heritage.', cat: CategoryType.City },
    { name: 'Birmingham', country: 'UK', lat: 52.4862, lng: -1.8904, img: '1571439268395-cb41b18d2f78', desc: 'A major city in England’s West Midlands region, with multiple Industrial Revolution-era landmarks.', cat: CategoryType.City },
    { name: 'Liverpool', country: 'UK', lat: 53.4084, lng: -2.9916, img: '1564750871-31620c3bcf52', desc: 'A maritime city in northwest England, famously the hometown of The Beatles.', cat: CategoryType.City },
    { name: 'Glasgow', country: 'UK', lat: 55.8642, lng: -4.2518, img: '1591503932782-b7e1ce79d201', desc: 'A port city on the River Clyde in Scotland\'s western Lowlands, famed for its Victorian and art nouveau architecture.', cat: CategoryType.Historical },
    { name: 'Belfast', country: 'UK', lat: 54.5973, lng: -5.9301, img: '1574320253488-825000572111', desc: 'Northern Ireland’s capital, known as the birthplace of the RMS Titanic.', cat: CategoryType.City },
    { name: 'Cork', country: 'Ireland', lat: 51.8985, lng: -8.4756, img: '1590483863417-64010be550e5', desc: 'A university city in southwest Ireland, known for its lively center and historic English Market.', cat: CategoryType.City },
    { name: 'Galway', country: 'Ireland', lat: 53.2707, lng: -9.0568, img: '1611145330364-c2c62c4749f7', desc: 'A harbor city on Ireland’s west coast, known for its vibrant lifestyle and numerous festivals.', cat: CategoryType.City },
    
    // Eastern Europe
    { name: 'Sofia', country: 'Bulgaria', lat: 42.6977, lng: 23.3219, img: '1597505232675-6e47bebd0561', desc: 'Bulgaria’s capital, reflecting over 2,000 years of history, including Greek, Roman, Ottoman and Soviet occupation.', cat: CategoryType.Historical },
    { name: 'Bucharest', country: 'Romania', lat: 44.4268, lng: 26.1025, img: '1587327339121-65c26b84339f', desc: 'A sprawling city filled with iconic landmarks and a rich, complex history.', cat: CategoryType.City },
    { name: 'Belgrade', country: 'Serbia', lat: 44.7866, lng: 20.4489, img: '1604510006277-2e1d7cf9d1a3', desc: 'The capital of Serbia, sitting at the confluence of the Sava and Danube rivers.', cat: CategoryType.City },
    { name: 'Sarajevo', country: 'Bosnia and Herzegovina', lat: 43.8563, lng: 18.4131, img: '1611244081033-640960a5e783', desc: 'A compact city on the Miljacka River, surrounded by the Dinaric Alps.', cat: CategoryType.Historical },
    { name: 'Riga', country: 'Latvia', lat: 56.9496, lng: 24.1052, img: '1581452140685-61875e5b306a', desc: 'Set on the Baltic Sea at the mouth of the River Daugava, considered a cultural center with many museums and concert halls.', cat: CategoryType.City },
    { name: 'Vilnius', country: 'Lithuania', lat: 54.6872, lng: 25.2797, img: '1611234975583-9b04856f6c24', desc: 'The capital of Lithuania, known for its baroque architecture, seen especially in its medieval Old Town.', cat: CategoryType.Historical },
    
    // Spain and Portugal
    { name: 'Malaga', country: 'Spain', lat: 36.7213, lng: -4.4214, img: '1539265882672-04fc59be432e', desc: 'A port city on southern Spain’s Costa del Sol, known for its high-rise hotels and resorts jutting up from yellow-sand beaches.', cat: CategoryType.Beaches },
    { name: 'Zaragoza', country: 'Spain', lat: 41.6488, lng: -0.8891, img: '1628109015964-b03478950f15', desc: 'The capital of northeastern Spain\'s Aragon region, overlooking the Ebro River in the city center is baroque Nuestra Señora del Pilar basilica.', cat: CategoryType.Historical },
    { name: 'Alicante', country: 'Spain', lat: 38.3452, lng: -0.4810, img: '1618302170327-017fb2be9418', desc: 'A port city on Spain’s southeastern Costa Blanca, and the capital of the Alicante province.', cat: CategoryType.Beaches },
    { name: 'Faro', country: 'Portugal', lat: 37.0194, lng: -7.9304, img: '1624891157147-380d603a110a', desc: 'The capital of southern Portugal’s Algarve region, offering a marina, well-maintained parks and plazas, and a picturesque old town.', cat: CategoryType.Beaches }
  ];
 
  const operators = ['ICE', 'TGV', 'Eurostar', 'Railjet', 'Frecciarossa', 'Thalys', 'DB', 'SNCF', 'Trenitalia', 'Renfe', 'SBB', 'NS'];
  const conditions: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'cloudy', 'rainy'];
 
  richCities.forEach((city, i) => {
    const operator = operators[i % operators.length];
    // Keep it realistic for testing
    const duration = `${Math.floor(Math.random() * 8) + 2}h ${Math.floor(Math.random() * 60)}m`;
    const price = Math.floor(Math.random() * 120) + 30;
    const transfers = Math.floor(Math.random() * 2);
    
    // Slight seasonal variation
    const temp1 = Math.floor(Math.random() * 10) + 12;
    const temp2 = temp1 + Math.floor(Math.random() * 4) - 2;
    const temp3 = temp1 + Math.floor(Math.random() * 4) - 2;
    const cond1 = conditions[Math.floor(Math.random() * 3)];
    const cond2 = conditions[Math.floor(Math.random() * 3)];
    const cond3 = conditions[Math.floor(Math.random() * 3)];
    
    // Use unique city imagery
    const imageUrl = `https://images.unsplash.com/photo-${city.img}?auto=format&fit=crop&w=800&q=80`;
 
    more.push({
      id: `dest-${city.name.toLowerCase()}`,
      destinationName: city.name,
      destinationCountry: city.country,
      originName: 'Berlin',
      category: city.cat,
      description: city.desc,
      location: { lat: city.lat, lng: city.lng },
      duration: duration,
      price: price,
      imageUrl: imageUrl,
      outboundDate: 'Apr 7',
      returnDate: 'Apr 11',
      trainOperator: operator,
      transfers: transfers,
      weather: [
        { date: 'Apr 7', temp: temp1, condition: cond1 },
        { date: 'Apr 8', temp: temp2, condition: cond2 },
        { date: 'Apr 9', temp: temp3, condition: cond3 }
      ]
    });
  });
 
  return more;
};
 
export const EURAIL_GRAPH: Record<string, string[]> = {
  'Berlin': ['Prague', 'Warsaw', 'Amsterdam', 'Copenhagen', 'Munich', 'Hamburg', 'Hannover', 'Leipzig', 'Frankfurt', 'Cologne', 'Dresden', 'Vienna', 'Paris', 'Zurich', 'Brussels', 'Stockholm', 'Oslo', 'Krakow', 'Budapest', 'Bratislava', 'Riga'],
  'Prague': ['Vienna', 'Budapest', 'Munich', 'Berlin', 'Krakow', 'Bratislava', 'Dresden', 'Leipzig', 'Nuremberg'],
  'Vienna': ['Prague', 'Budapest', 'Munich', 'Salzburg', 'Bratislava', 'Ljubljana', 'Graz', 'Linz', 'Venice', 'Zurich', 'Berlin'],
  'Budapest': ['Vienna', 'Prague', 'Belgrade', 'Zagreb', 'Bratislava', 'Bucharest', 'Krakow'],
  'Munich': ['Berlin', 'Prague', 'Vienna', 'Zurich', 'Salzburg', 'Stuttgart', 'Nuremberg', 'Innsbruck', 'Frankfurt', 'Verona'],
  'Zurich': ['Munich', 'Paris', 'Milan', 'Innsbruck', 'Stuttgart', 'Frankfurt', 'Lyon', 'Basel', 'Lucerne', 'Geneva', 'Bern', 'Vienna', 'Berlin'],
  'Paris': ['London', 'Brussels', 'Lyon', 'Strasbourg', 'Zurich', 'Bordeaux', 'Lille', 'Rennes', 'Tours', 'Nantes', 'Frankfurt', 'Geneva', 'Amsterdam', 'Berlin', 'Marseille', 'Toulouse', 'Madrid', 'Barcelona', 'Milan'],
  'Brussels': ['Paris', 'Amsterdam', 'Cologne', 'London', 'Lille', 'Frankfurt', 'Antwerp', 'Bruges', 'Ghent', 'Rotterdam', 'Berlin'],
  'Amsterdam': ['Brussels', 'Berlin', 'Cologne', 'London', 'Frankfurt', 'Hannover', 'Rotterdam', 'The Hague', 'Utrecht', 'Paris', 'Antwerp', 'Copenhagen'],
  'Warsaw': ['Berlin', 'Krakow', 'Gdansk', 'Poznan', 'Wroclaw', 'Vilnius', 'Prague'],
  'Copenhagen': ['Berlin', 'Stockholm', 'Oslo', 'Hamburg', 'Gothenburg', 'Malmo', 'Amsterdam'],
  
  'London': ['Paris', 'Brussels', 'Edinburgh', 'Manchester', 'Amsterdam', 'Lille', 'Birmingham', 'Liverpool', 'Glasgow', 'Dublin'],
  'Edinburgh': ['London', 'Manchester', 'Glasgow'],
  'Dublin': ['Belfast', 'Cork', 'Galway'], 
  
  'Rome': ['Milan', 'Florence', 'Naples', 'Venice', 'Bologna', 'Turin', 'Genoa'],
  'Milan': ['Zurich', 'Rome', 'Venice', 'Lyon', 'Florence', 'Turin', 'Genoa', 'Bologna', 'Verona', 'Geneva', 'Paris'],
  'Venice': ['Milan', 'Rome', 'Florence', 'Vienna', 'Ljubljana', 'Verona', 'Bologna'],
  'Florence': ['Rome', 'Milan', 'Venice', 'Naples', 'Bologna', 'Genoa', 'Turin'],
  'Naples': ['Rome', 'Florence', 'Salerno'],
  
  'Madrid': ['Barcelona', 'Valencia', 'Seville', 'Lisbon', 'Zaragoza', 'Malaga', 'Alicante', 'Paris', 'Porto'],
  'Barcelona': ['Madrid', 'Valencia', 'Toulouse', 'Lyon', 'Paris', 'Zaragoza', 'Montpellier', 'Zaragoza', 'Alicante'],
  'Valencia': ['Madrid', 'Barcelona', 'Alicante'],
  'Seville': ['Madrid', 'Cordoba', 'Malaga'],
  'Lisbon': ['Madrid', 'Porto', 'Faro'],
  'Porto': ['Lisbon', 'Coimbra', 'Vigo'],
  
  'Oslo': ['Stockholm', 'Copenhagen', 'Bergen', 'Trondheim', 'Gothenburg'],
  'Stockholm': ['Oslo', 'Copenhagen', 'Gothenburg', 'Malmo'],
  'Helsinki': ['Tampere', 'Turku', 'St Petersburg'],
  'Tallinn': ['Riga', 'Tartu'],
  
  'Athens': ['Thessaloniki', 'Patras'],
  'Istanbul': ['Sofia', 'Ankara', 'Izmir'],
  'Zagreb': ['Ljubljana', 'Belgrade', 'Budapest', 'Split', 'Rijeka', 'Vienna'],
  'Ljubljana': ['Zagreb', 'Vienna', 'Venice', 'Graz', 'Trieste', 'Salzburg'],
  'Bratislava': ['Vienna', 'Prague', 'Budapest', 'Kosice'],
  
  'Krakow': ['Warsaw', 'Prague', 'Wroclaw', 'Katowice', 'Budapest', 'Vienna'],
  'Gdansk': ['Warsaw', 'Poznan', 'Bydgoszcz'],
  'Wroclaw': ['Warsaw', 'Krakow', 'Poznan', 'Prague', 'Berlin'],
  'Poznan': ['Warsaw', 'Berlin', 'Wroclaw', 'Gdansk'],
  
  'Hamburg': ['Berlin', 'Copenhagen', 'Bremen', 'Hannover', 'Frankfurt', 'Cologne', 'Dusseldorf', 'Munich'],
  'Frankfurt': ['Munich', 'Berlin', 'Cologne', 'Stuttgart', 'Brussels', 'Paris', 'Amsterdam', 'Zurich', 'Hannover', 'Leipzig', 'Nuremberg', 'Dusseldorf', 'Basel'],
  'Cologne': ['Frankfurt', 'Brussels', 'Amsterdam', 'Dusseldorf', 'Munich', 'Berlin', 'Hamburg', 'Stuttgart', 'Basel'],
  'Stuttgart': ['Munich', 'Frankfurt', 'Zurich', 'Karlsruhe', 'Strasbourg', 'Cologne'],
  'Dusseldorf': ['Cologne', 'Frankfurt', 'Essen', 'Dortmund', 'Amsterdam', 'Hamburg'],
  'Leipzig': ['Berlin', 'Dresden', 'Frankfurt', 'Nuremberg', 'Prague'],
  'Dresden': ['Leipzig', 'Berlin', 'Prague'],
  'Nuremberg': ['Munich', 'Frankfurt', 'Leipzig', 'Wurzburg', 'Prague'],
  'Hannover': ['Berlin', 'Hamburg', 'Bremen', 'Frankfurt', 'Amsterdam', 'Cologne'],
  'Bremen': ['Hamburg', 'Hannover', 'Osnabruck'],
  
  'Lyon': ['Paris', 'Marseille', 'Geneva', 'Turin', 'Milan', 'Barcelona', 'Montpellier', 'Strasbourg', 'Dijon'],
  'Marseille': ['Lyon', 'Nice', 'Montpellier', 'Toulon', 'Paris', 'Genoa'],
  'Toulouse': ['Bordeaux', 'Montpellier', 'Barcelona', 'Paris', 'Lyon'],
  'Nice': ['Marseille', 'Cannes', 'Antibes', 'Genoa', 'Milan', 'Paris'],
  'Nantes': ['Paris', 'Rennes', 'Angers', 'Bordeaux'],
  'Strasbourg': ['Paris', 'Stuttgart', 'Karlsruhe', 'Basel', 'Lyon', 'Frankfurt', 'Mulhouse', 'Metz'],
  'Montpellier': ['Marseille', 'Toulouse', 'Lyon', 'Barcelona', 'Nimes', 'Beziers', 'Perpignan'],
  'Bordeaux': ['Paris', 'Toulouse', 'Nantes', 'Hendaye'],
  'Lille': ['Paris', 'Brussels', 'London', 'Calais'],
  'Rennes': ['Paris', 'Nantes', 'Le Mans'],
  'Reims': ['Paris', 'Strasbourg', 'Metz'],
  
  'Geneva': ['Paris', 'Lyon', 'Milan', 'Zurich', 'Bern', 'Lausanne'],
  'Basel': ['Strasbourg', 'Zurich', 'Bern', 'Frankfurt', 'Cologne', 'Mulhouse', 'Freiburg'],
  'Bern': ['Zurich', 'Basel', 'Geneva', 'Lausanne', 'Milan'],
  'Lucerne': ['Zurich', 'Bern', 'Milan', 'Lugano'],
  'Lausanne': ['Geneva', 'Bern', 'Milan', 'Dijon'],
  
  'Bruges': ['Brussels', 'Ghent', 'Antwerp'],
  'Ghent': ['Brussels', 'Bruges', 'Antwerp', 'Lille'],
  'Antwerp': ['Brussels', 'Rotterdam', 'Amsterdam', 'Ghent'],
  
  'Rotterdam': ['Amsterdam', 'Antwerp', 'Brussels', 'The Hague', 'Utrecht'],
  'The Hague': ['Rotterdam', 'Amsterdam', 'Utrecht'],
  'Utrecht': ['Amsterdam', 'Rotterdam', 'The Hague', 'Arnhem'],
  
  'Gothenburg': ['Stockholm', 'Oslo', 'Copenhagen', 'Malmo'],
  'Malmo': ['Copenhagen', 'Gothenburg', 'Stockholm'],
  
  'Verona': ['Milan', 'Venice', 'Munich', 'Innsbruck', 'Bologna', 'Florence'],
  'Bologna': ['Milan', 'Florence', 'Venice', 'Rome', 'Verona'],
  'Turin': ['Milan', 'Lyon', 'Rome', 'Genoa'],
  'Genoa': ['Milan', 'Turin', 'Nice', 'Rome', 'Florence'],
  
  'Manchester': ['London', 'Edinburgh', 'Liverpool', 'Birmingham', 'Glasgow'],
  'Birmingham': ['London', 'Manchester', 'Liverpool', 'Edinburgh'],
  'Liverpool': ['Manchester', 'Birmingham', 'London'],
  'Glasgow': ['Edinburgh', 'Manchester', 'London'],
  'Belfast': ['Dublin'],
  'Cork': ['Dublin'],
  'Galway': ['Dublin'],
  
  'Sofia': ['Istanbul', 'Belgrade', 'Bucharest', 'Thessaloniki'],
  'Bucharest': ['Sofia', 'Budapest', 'Cluj-Napoca', 'Constanta', 'Belgrade'],
  'Belgrade': ['Budapest', 'Sofia', 'Zagreb', 'Sarajevo', 'Podgorica', 'Bucharest'],
  'Sarajevo': ['Belgrade', 'Zagreb'],
  'Riga': ['Tallinn', 'Vilnius', 'Kaunas'],
  'Vilnius': ['Riga', 'Warsaw', 'Kaunas'],
  
  'Malaga': ['Madrid', 'Seville', 'Cordoba'],
  'Zaragoza': ['Madrid', 'Barcelona'],
  'Alicante': ['Valencia', 'Madrid'],
  'Faro': ['Lisbon'],
  
  'Salzburg': ['Munich', 'Vienna', 'Linz', 'Innsbruck', 'Ljubljana'],
  'Innsbruck': ['Munich', 'Salzburg', 'Zurich', 'Verona'],
  'Graz': ['Vienna', 'Ljubljana', 'Maribor', 'Linz'],
  'Linz': ['Vienna', 'Salzburg', 'Graz', 'Passau']
};

// Fallback distance calculation if graph doesn't cover a city well
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
};

export const getConnectedCities = (cityName: string, allDestinations: TrainDeal[]): string[] => {
  const normalizedSearch = cityName.toLowerCase().trim();
  
  // 1. Try to find the exact city in destinations by matching name partially
  const cityMatch = allDestinations.find(d => d.destinationName.toLowerCase().includes(normalizedSearch) || normalizedSearch.includes(d.destinationName.toLowerCase()));
  
  const matchedCityName = cityMatch ? cityMatch.destinationName : (Object.keys(EURAIL_GRAPH).find(k => k.toLowerCase() === normalizedSearch) || cityName);

  if (EURAIL_GRAPH[matchedCityName]) {
    // If it's in our hardcoded graph, return those connections
    return EURAIL_GRAPH[matchedCityName];
  }
  
  // Fallback: If city not in graph, find 15 closest cities
  if (!cityMatch) return [];

  const others = allDestinations.filter(d => d.destinationName !== cityMatch.destinationName);
  others.sort((a, b) => {
    const distA = getDistance(cityMatch.location.lat, cityMatch.location.lng, a.location.lat, a.location.lng);
    const distB = getDistance(cityMatch.location.lat, cityMatch.location.lng, b.location.lat, b.location.lng);
    return distA - distB;
  });

  return others.slice(0, 15).map(d => d.destinationName);
};

export const INITIAL_DESTINATIONS: TrainDeal[] = [...baseDestinations, ...generateMoreDestinations()];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: '1',
    role: 'model',
    text: "Hi! I'm your Travel Notes AI assistant. Looking for a scenic train journey, a weekend city break, or want to generate a multi-city itinerary? Just ask!"
  }
];

export const MOCK_ACCOMMODATION: Record<string, Accommodation[]> = {
  default: [
    { id: '1', name: 'Grand Central Hotel', rating: 4.5, price: 120, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'City Center Hostel', rating: 4.0, price: 45, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80' },
    { id: '3', name: 'Boutique Loft', rating: 4.8, price: 180, image: 'https://images.unsplash.com/photo-1522771753035-0a1529140558?auto=format&fit=crop&w=200&q=80' },
    { id: '4', name: 'The Station Inn', rating: 3.8, price: 85, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80' },
    { id: '5', name: 'Luxury River View', rating: 4.9, price: 250, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=200&q=80' },
  ]
};

export const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  default: [
    { id: '1', title: 'Historic City Walk', duration: '2h', price: 15, rating: 4.7, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80' },
    { id: '2', title: 'Museum Pass', duration: '1 day', price: 25, rating: 4.5, image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=300&q=80' },
    { id: '3', title: 'Food Tasting Tour', duration: '3h', price: 60, rating: 4.9, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80' },
  ]
};

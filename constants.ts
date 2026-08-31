import { CategoryType, TrainDeal, ChatMessage, Accommodation, Activity } from './types';

export const BERLIN_COORDS = { lat: 52.5200, lng: 13.4050 };

export const BERLIN_DESTINATIONS: TrainDeal[] = [
  // ==========================================
  // RING 1: MICRO & DAY TRIPS (< 2h from Berlin)
  // ==========================================
  {
    id: 'potsdam',
    destinationName: 'Potsdam',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Prussian royal residence famous for the lavish Sanssouci Palace, baroque gardens, and Dutch Quarter.',
    location: { lat: 52.3906, lng: 13.0645 },
    stationName: 'Potsdam Hbf',
    duration: '0h 25m',
    price: 6,
    imageUrl: 'https://images.unsplash.com/photo-1596700889146-24ba0fc74900?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'S-Bahn / Regional (RE1)',
    transfers: 0,
    frequency: 'Every 10 mins',
    scenicRating: 4,
    scenicHighlight: 'Passing through Wannsee lakes and forested Havel riverbanks.',
    co2Kg: 2,
    co2SavingsPercent: 95,
    weather: [{ date: 'Apr 7', temp: 17, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 16, condition: 'cloudy' }]
  },
  {
    id: 'spreewald',
    destinationName: 'Spreewald (Lübbenau)',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Nature,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'UNESCO biosphere reserve of tranquil forested waterways, canoe trails, and traditional punt boats.',
    location: { lat: 51.8689, lng: 13.9697 },
    stationName: 'Lübbenau (Spreewald)',
    duration: '0h 55m',
    price: 14,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'Regional Express (RE2)',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 5,
    scenicHighlight: 'Gliding past lush pine forests and riverside wooden lodges.',
    co2Kg: 4,
    co2SavingsPercent: 94,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'cloudy' }]
  },
  {
    id: 'leipzig',
    destinationName: 'Leipzig',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Vibrant cultural hub known for Bach, booming creative arts at the Spinnerei, and trendy canal-side cafes.',
    location: { lat: 51.3397, lng: 12.3731 },
    stationName: 'Leipzig Hbf',
    duration: '1h 12m',
    price: 19,
    imageUrl: 'https://images.unsplash.com/photo-1600109968846-978d3810a97c?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Every 30 mins',
    scenicRating: 3,
    scenicHighlight: 'Smooth 200 km/h high-speed rail glide arriving into Europe’s largest terminus station.',
    co2Kg: 8,
    co2SavingsPercent: 90,
    weather: [{ date: 'Apr 7', temp: 17, condition: 'sunny' }, { date: 'Apr 8', temp: 19, condition: 'sunny' }, { date: 'Apr 9', temp: 16, condition: 'cloudy' }]
  },
  {
    id: 'dresden',
    destinationName: 'Dresden',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'The "Florence on the Elbe", famed for the baroque Frauenkirche, Zwinger Palace, and riverside promenades.',
    location: { lat: 51.0504, lng: 13.7373 },
    stationName: 'Dresden Hbf',
    duration: '1h 45m',
    price: 22,
    imageUrl: 'https://images.unsplash.com/photo-1587327339121-65c26b84339f?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'EuroCity (EC) / ICE',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'Rolling Saxon countryside leading to the historic Elbe riverfront.',
    co2Kg: 10,
    co2SavingsPercent: 89,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 17, condition: 'sunny' }, { date: 'Apr 9', temp: 14, condition: 'cloudy' }]
  },
  {
    id: 'rostock',
    destinationName: 'Rostock & Warnemünde',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Beaches,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Baltic seaside resort with wide white-sand beaches, historic lighthouse, and fresh fish harbour.',
    location: { lat: 54.0924, lng: 12.0991 },
    stationName: 'Rostock Hbf / Warnemünde',
    duration: '2h 05m',
    price: 24,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'ICE / IC',
    transfers: 0,
    frequency: 'Every 2 hours',
    scenicRating: 4,
    scenicHighlight: 'Mecklenburg lake plateau and approaching the Baltic coastal dunes.',
    co2Kg: 12,
    co2SavingsPercent: 91,
    weather: [{ date: 'Apr 7', temp: 13, condition: 'cloudy' }, { date: 'Apr 8', temp: 15, condition: 'sunny' }, { date: 'Apr 9', temp: 14, condition: 'sunny' }]
  },
  {
    id: 'schwerin',
    destinationName: 'Schwerin',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Lakeside,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'City of Seven Lakes crowned by the fairytale Schwerin Castle set on its own picturesque island.',
    location: { lat: 53.6355, lng: 11.4012 },
    stationName: 'Schwerin Hbf',
    duration: '1h 50m',
    price: 21,
    imageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'Regional Express (RE8) / IC',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'Sweeping lake vistas and castle spires upon approach.',
    co2Kg: 9,
    co2SavingsPercent: 92,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'sunny' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 13, condition: 'cloudy' }]
  },
  {
    id: 'wittenberg',
    destinationName: 'Lutherstadt Wittenberg',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Cradle of the Protestant Reformation where Martin Luther posted his 95 Theses.',
    location: { lat: 51.8739, lng: 12.6444 },
    stationName: 'Lutherstadt Wittenberg Hbf',
    duration: '0h 45m',
    price: 16,
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Every 30 mins',
    scenicRating: 3,
    scenicHighlight: 'Lightning-fast ICE dash across the Brandenburg plains.',
    co2Kg: 5,
    co2SavingsPercent: 96,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'sunny' }]
  },
  {
    id: 'weimar',
    destinationName: 'Weimar',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Enlightenment epicenter of Goethe, Schiller, and the revolutionary Bauhaus design movement.',
    location: { lat: 50.9803, lng: 11.3290 },
    stationName: 'Weimar',
    duration: '1h 50m',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1543429776-278263259837?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'ICE',
    transfers: 1,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'Passing through Thuringian vineyard hills and Ilm valley.',
    co2Kg: 11,
    co2SavingsPercent: 91,
    weather: [{ date: 'Apr 7', temp: 15, condition: 'sunny' }, { date: 'Apr 8', temp: 17, condition: 'sunny' }, { date: 'Apr 9', temp: 14, condition: 'cloudy' }]
  },
  {
    id: 'saxon-switzerland',
    destinationName: 'Saxon Switzerland (Bad Schandau)',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Mountains,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Dramatic sandstone rock towers, Bastei Bridge, and deep canyon hiking trails along the Elbe.',
    location: { lat: 50.9177, lng: 14.1566 },
    stationName: 'Bad Schandau',
    duration: '2h 10m',
    price: 27,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'EuroCity (EC)',
    transfers: 0,
    frequency: 'Every 2 hours',
    scenicRating: 5,
    scenicHighlight: 'Direct train hugs the Elbe River with towering sandstone cliff faces on the right.',
    co2Kg: 13,
    co2SavingsPercent: 92,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'cloudy' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 13, condition: 'rainy' }]
  },
  {
    id: 'quedlinburg',
    destinationName: 'Quedlinburg (Harz)',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'UNESCO medieval timber-framed town with 2,000 preserved half-timbered houses and castle hill.',
    location: { lat: 51.7895, lng: 11.1489 },
    stationName: 'Quedlinburg',
    duration: '2h 30m',
    price: 26,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'Regional Express (RE11)',
    transfers: 0,
    frequency: 'Every 2 hours (Direct Harz-Berlin Express)',
    scenicRating: 4,
    scenicHighlight: 'Approaching the rolling forested foothills of the Harz mountain range.',
    co2Kg: 12,
    co2SavingsPercent: 90,
    weather: [{ date: 'Apr 7', temp: 13, condition: 'sunny' }, { date: 'Apr 8', temp: 15, condition: 'sunny' }, { date: 'Apr 9', temp: 12, condition: 'rainy' }]
  },

  // ==========================================
  // RING 2: WEEKEND BREAKS (2h to 4.5h from Berlin)
  // ==========================================
  {
    id: 'prague',
    destinationName: 'Prague',
    destinationCountry: 'Czechia',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Fairy-tale bridges, vibrant bohemian cafes, and Gothic Old Town architecture along the Vltava.',
    location: { lat: 50.0755, lng: 14.4378 },
    stationName: 'Praha hlavní nádraží',
    duration: '4h 15m',
    price: 29,
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'České Dráhy / DB EuroCity',
    transfers: 0,
    frequency: 'Every 2 hours',
    scenicRating: 5,
    scenicHighlight: 'Spectacular 1-hour canyon gorge ride along the Elbe & Vltava rivers.',
    co2Kg: 22,
    co2SavingsPercent: 88,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'cloudy' }]
  },
  {
    id: 'hamburg',
    destinationName: 'Hamburg',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Vibrant harbor metropolis of brick warehouse districts (Speicherstadt) and Elbphilharmonie.',
    location: { lat: 53.5511, lng: 9.9937 },
    stationName: 'Hamburg Hbf',
    duration: '1h 45m',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1551221434-2e21b71cb61d?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Every 30 mins',
    scenicRating: 3,
    scenicHighlight: 'Crossing the historic Elbe river railway bridges entering Hamburg.',
    co2Kg: 14,
    co2SavingsPercent: 89,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'cloudy' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'sunny' }]
  },
  {
    id: 'wroclaw',
    destinationName: 'Wrocław',
    destinationCountry: 'Poland',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'City of 100 bridges and whimsical bronze dwarfs, featuring a pastel-colored Gothic Rynek.',
    location: { lat: 51.1079, lng: 17.0385 },
    stationName: 'Wrocław Główny',
    duration: '4h 10m',
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'PKP Intercity / DB',
    transfers: 0,
    frequency: 'Direct daily trains',
    scenicRating: 4,
    scenicHighlight: 'Passing through Lower Silesian pine forests and arriving into castle-like station.',
    co2Kg: 20,
    co2SavingsPercent: 87,
    weather: [{ date: 'Apr 7', temp: 15, condition: 'sunny' }, { date: 'Apr 8', temp: 17, condition: 'sunny' }, { date: 'Apr 9', temp: 14, condition: 'rainy' }]
  },
  {
    id: 'szczecin',
    destinationName: 'Szczecin',
    destinationCountry: 'Poland',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Baltic harbor city on the Oder River known for the Pomeranian Dukes Castle and Parisian star-plazas.',
    location: { lat: 53.4285, lng: 14.5528 },
    stationName: 'Szczecin Główny',
    duration: '1h 55m',
    price: 18,
    imageUrl: 'https://images.unsplash.com/photo-1581452140685-61875e5b306a?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'Regional Express (RE66 / RB66)',
    transfers: 0,
    frequency: 'Every 2 hours',
    scenicRating: 4,
    scenicHighlight: 'Crossing the lower Oder Valley National Park wetlands.',
    co2Kg: 9,
    co2SavingsPercent: 93,
    weather: [{ date: 'Apr 7', temp: 13, condition: 'cloudy' }, { date: 'Apr 8', temp: 15, condition: 'sunny' }, { date: 'Apr 9', temp: 12, condition: 'rainy' }]
  },
  {
    id: 'munich',
    destinationName: 'Munich',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Bavarian capital of festive beer halls, expansive English Garden surfing, and alpine proximity.',
    location: { lat: 48.1351, lng: 11.5820 },
    stationName: 'München Hbf',
    duration: '3h 55m',
    price: 39,
    imageUrl: 'https://images.unsplash.com/photo-1595867985827-0466318535a2?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE Sprinter (300 km/h)',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'High-speed blast through the Thuringian Forest tunnels and Franconian hills.',
    co2Kg: 24,
    co2SavingsPercent: 88,
    weather: [{ date: 'Apr 7', temp: 15, condition: 'sunny' }, { date: 'Apr 8', temp: 17, condition: 'sunny' }, { date: 'Apr 9', temp: 16, condition: 'cloudy' }]
  },
  {
    id: 'nuremberg',
    destinationName: 'Nuremberg',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Imperial castle towering over medieval city walls, gingerbread traditions, and craft breweries.',
    location: { lat: 49.4521, lng: 11.0767 },
    stationName: 'Nürnberg Hbf',
    duration: '2h 55m',
    price: 32,
    imageUrl: 'https://images.unsplash.com/photo-1599879793132-73a70f3fde52?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 3,
    scenicHighlight: 'Passing through the scenic Pegnitz river meadows.',
    co2Kg: 18,
    co2SavingsPercent: 89,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'cloudy' }]
  },
  {
    id: 'hanover',
    destinationName: 'Hanover',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Green capital of Lower Saxony featuring the majestic Herrenhausen royal baroque gardens.',
    location: { lat: 52.3759, lng: 9.7320 },
    stationName: 'Hannover Hbf',
    duration: '1h 40m',
    price: 22,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Every 30 mins',
    scenicRating: 3,
    scenicHighlight: 'High-speed glide through Lower Saxony farmland.',
    co2Kg: 11,
    co2SavingsPercent: 91,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'sunny' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'cloudy' }]
  },
  {
    id: 'cologne',
    destinationName: 'Cologne',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Famed for its twin-spired Gothic cathedral directly outside the station and lively Rhine promenades.',
    location: { lat: 50.9375, lng: 6.9603 },
    stationName: 'Köln Hbf',
    duration: '4h 15m',
    price: 39,
    imageUrl: 'https://images.unsplash.com/photo-1599879793132-73a70f3fde52?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'Crossing the Hohenzollern Bridge lined with love locks directly into the cathedral shadows.',
    co2Kg: 26,
    co2SavingsPercent: 86,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 17, condition: 'cloudy' }]
  },
  {
    id: 'frankfurt',
    destinationName: 'Frankfurt',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Mainhattan skyline blending soaring modern glass skyscrapers with historic timbered Römer square.',
    location: { lat: 50.1109, lng: 8.6821 },
    stationName: 'Frankfurt(Main)Hbf',
    duration: '3h 50m',
    price: 37,
    imageUrl: 'https://images.unsplash.com/photo-1533227260856-23b6b23bfa99?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 3,
    scenicHighlight: 'Sweeping view of the Main river skyline as the train curves into town.',
    co2Kg: 23,
    co2SavingsPercent: 87,
    weather: [{ date: 'Apr 7', temp: 17, condition: 'sunny' }, { date: 'Apr 8', temp: 19, condition: 'sunny' }, { date: 'Apr 9', temp: 16, condition: 'cloudy' }]
  },
  {
    id: 'poznan',
    destinationName: 'Poznań',
    destinationCountry: 'Poland',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Vibrant university town featuring colorful renaissance houses and clock-tower mechanical goats.',
    location: { lat: 52.4064, lng: 16.9252 },
    stationName: 'Poznań Główny',
    duration: '2h 45m',
    price: 24,
    imageUrl: 'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'Berlin-Warszawa-Express (PKP/DB)',
    transfers: 0,
    frequency: 'Every 2 hours',
    scenicRating: 3,
    scenicHighlight: 'Smooth international direct ride crossing the Oder river into Wielkopolska.',
    co2Kg: 14,
    co2SavingsPercent: 90,
    weather: [{ date: 'Apr 7', temp: 15, condition: 'sunny' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 13, condition: 'rainy' }]
  },
  {
    id: 'gdansk',
    destinationName: 'Gdańsk',
    destinationCountry: 'Poland',
    originName: 'Berlin',
    category: CategoryType.Beaches,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Baltic jewel of amber merchants, towering Dutch-mannerist merchant houses, and seaside promenades.',
    location: { lat: 54.3520, lng: 18.6466 },
    stationName: 'Gdańsk Główny',
    duration: '5h 45m',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1581452140685-61875e5b306a?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'EuroCity (EC)',
    transfers: 0,
    frequency: 'Direct daily trains',
    scenicRating: 4,
    scenicHighlight: 'Pomeranian lake district views ending at the Baltic Sea.',
    co2Kg: 28,
    co2SavingsPercent: 85,
    weather: [{ date: 'Apr 7', temp: 12, condition: 'cloudy' }, { date: 'Apr 8', temp: 14, condition: 'sunny' }, { date: 'Apr 9', temp: 13, condition: 'rainy' }]
  },
  {
    id: 'bremen',
    destinationName: 'Bremen',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Fairytale town of the Town Musicians, UNESCO Gothic Town Hall, and winding Schnoor alleys.',
    location: { lat: 53.0793, lng: 8.8017 },
    stationName: 'Bremen Hbf',
    duration: '2h 55m',
    price: 29,
    imageUrl: 'https://images.unsplash.com/photo-1551221434-2e21b71cb61d?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 3,
    scenicHighlight: 'Passing through the Weser river plains.',
    co2Kg: 17,
    co2SavingsPercent: 89,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'cloudy' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'sunny' }]
  },
  {
    id: 'erfurt',
    destinationName: 'Erfurt',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Day Trip',
    travelRing: 'day_trip',
    description: 'Stunning medieval capital with the Krämerbrücke (Europe’s longest inhabited bridge) and cathedral hill.',
    location: { lat: 50.9848, lng: 11.0299 },
    stationName: 'Erfurt Hbf',
    duration: '1h 35m',
    price: 24,
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 7',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Every 30 mins',
    scenicRating: 4,
    scenicHighlight: 'Ultra-fast 300 km/h ICE mountain transit arriving right in the city center.',
    co2Kg: 10,
    co2SavingsPercent: 92,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'cloudy' }]
  },
  {
    id: 'bamberg',
    destinationName: 'Bamberg',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'UNESCO old town built on seven hills, featuring an island town hall and historic smoked beer breweries.',
    location: { lat: 49.8988, lng: 10.9028 },
    stationName: 'Bamberg',
    duration: '2h 40m',
    price: 34,
    imageUrl: 'https://images.unsplash.com/photo-1543429776-278263259837?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE',
    transfers: 0,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'Franconian Switzerland limestone valleys and river bridges.',
    co2Kg: 16,
    co2SavingsPercent: 90,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 14, condition: 'cloudy' }]
  },
  {
    id: 'goslar',
    destinationName: 'Goslar',
    destinationCountry: 'Germany',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Weekend Break',
    travelRing: 'weekend',
    description: 'Imperial Romanesque palace town nestled beneath the brooding Harz mountains.',
    location: { lat: 51.9060, lng: 10.4289 },
    stationName: 'Goslar',
    duration: '2h 25m',
    price: 26,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 10',
    trainOperator: 'ICE + Regional',
    transfers: 1,
    frequency: 'Hourly',
    scenicRating: 4,
    scenicHighlight: 'Passing through Harz mountain forests and silver mining streams.',
    co2Kg: 13,
    co2SavingsPercent: 90,
    weather: [{ date: 'Apr 7', temp: 13, condition: 'sunny' }, { date: 'Apr 8', temp: 15, condition: 'sunny' }, { date: 'Apr 9', temp: 12, condition: 'rainy' }]
  },

  // ==========================================
  // RING 3: EXTENDED JOURNEYS & NIGHTJETS (5h+ or Sleepers)
  // ==========================================
  {
    id: 'vienna',
    destinationName: 'Vienna',
    destinationCountry: 'Austria',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Imperial architecture, coffee house culture, and classical music legacy along the Blue Danube.',
    location: { lat: 48.2082, lng: 16.3738 },
    stationName: 'Wien Hauptbahnhof',
    duration: '7h 45m',
    price: 49,
    imageUrl: 'https://images.unsplash.com/photo-1563804099-77e80f6dc8c8?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'ICE / ÖBB Nightjet',
    transfers: 0,
    frequency: 'Direct daytime Railjet + Direct Nightjet sleeper',
    scenicRating: 4,
    scenicHighlight: 'Passing through Bohemia, Moravia, and the Austrian Danube basin.',
    co2Kg: 38,
    co2SavingsPercent: 86,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'cloudy' }]
  },
  {
    id: 'amsterdam',
    destinationName: 'Amsterdam',
    destinationCountry: 'Netherlands',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Famous for its picturesque canal rings, gabled merchant houses, and cycling culture.',
    location: { lat: 52.3676, lng: 4.9041 },
    stationName: 'Amsterdam Centraal',
    duration: '5h 50m',
    price: 49,
    imageUrl: 'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'Direct Intercity (IC)',
    transfers: 0,
    frequency: 'Every 2 hours direct',
    scenicRating: 3,
    scenicHighlight: 'Rolling Dutch windmill countryside arriving directly into Amsterdam Centraal on the water.',
    co2Kg: 32,
    co2SavingsPercent: 85,
    weather: [{ date: 'Apr 7', temp: 13, condition: 'rainy' }, { date: 'Apr 8', temp: 15, condition: 'cloudy' }, { date: 'Apr 9', temp: 16, condition: 'sunny' }]
  },
  {
    id: 'paris',
    destinationName: 'Paris',
    destinationCountry: 'France',
    originName: 'Berlin',
    category: CategoryType.Romantic,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'The City of Light, world-famous for art, gastronomy, Eiffel Tower, and Seine river walks.',
    location: { lat: 48.8566, lng: 2.3522 },
    stationName: 'Paris Gare de l’Est',
    duration: '8h 15m',
    price: 69,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'Direct ICE / TGV / Nightjet',
    transfers: 0,
    frequency: 'Direct daytime high-speed + Direct Nightjet sleeper',
    scenicRating: 4,
    scenicHighlight: 'Gliding across Champagne vineyards at 320 km/h into Paris.',
    co2Kg: 42,
    co2SavingsPercent: 87,
    weather: [{ date: 'Apr 7', temp: 18, condition: 'cloudy' }, { date: 'Apr 8', temp: 20, condition: 'sunny' }, { date: 'Apr 9', temp: 19, condition: 'sunny' }]
  },
  {
    id: 'zurich',
    destinationName: 'Zurich',
    destinationCountry: 'Switzerland',
    originName: 'Berlin',
    category: CategoryType.Lakeside,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Pristine lakeside metropolis with snowy Alpine views, clear swimming quays, and old town charm.',
    location: { lat: 47.3769, lng: 8.5417 },
    stationName: 'Zürich HB',
    duration: '8h 30m',
    price: 69,
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'Direct ICE / ÖBB Nightjet',
    transfers: 0,
    frequency: 'Direct daily ICE + Direct Nightjet sleeper',
    scenicRating: 5,
    scenicHighlight: 'Waking up to Lake Zurich and snow-capped Swiss Alpine peaks outside your cabin window.',
    co2Kg: 44,
    co2SavingsPercent: 88,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'sunny' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 15, condition: 'sunny' }]
  },
  {
    id: 'budapest',
    destinationName: 'Budapest',
    destinationCountry: 'Hungary',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Danube pearl famous for ornate thermal baths, majestic Parliament, and bohemian ruin bars.',
    location: { lat: 47.4979, lng: 19.0402 },
    stationName: 'Budapest-Keleti',
    duration: '11h 20m',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'EuroCity (EC) / Nightjet',
    transfers: 0,
    frequency: 'Direct daily EuroCity Hungaria + Direct sleeper',
    scenicRating: 5,
    scenicHighlight: 'Passing through the Danube Bend (Dunakanyar) castle hills into Budapest.',
    co2Kg: 49,
    co2SavingsPercent: 86,
    weather: [{ date: 'Apr 7', temp: 17, condition: 'sunny' }, { date: 'Apr 8', temp: 19, condition: 'sunny' }, { date: 'Apr 9', temp: 18, condition: 'cloudy' }]
  },
  {
    id: 'copenhagen',
    destinationName: 'Copenhagen',
    destinationCountry: 'Denmark',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Design capital of colorful Nyhavn harbor, Tivoli Gardens, and world-class New Nordic dining.',
    location: { lat: 55.6761, lng: 12.5683 },
    stationName: 'København H',
    duration: '7h 15m',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c311a071f9?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'DSB / DB',
    transfers: 1,
    frequency: 'Every 2 hours',
    scenicRating: 4,
    scenicHighlight: 'Crossing the epic Great Belt suspension bridges over the Baltic sea straits.',
    co2Kg: 36,
    co2SavingsPercent: 86,
    weather: [{ date: 'Apr 7', temp: 11, condition: 'cloudy' }, { date: 'Apr 8', temp: 13, condition: 'sunny' }, { date: 'Apr 9', temp: 12, condition: 'rainy' }]
  },
  {
    id: 'salzburg',
    destinationName: 'Salzburg',
    destinationCountry: 'Austria',
    originName: 'Berlin',
    category: CategoryType.Mountains,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Birthplace of Mozart, featuring dramatic alpine fortress views and baroque palaces.',
    location: { lat: 47.8095, lng: 13.0550 },
    stationName: 'Salzburg Hbf',
    duration: '5h 30m',
    price: 49,
    imageUrl: 'https://images.unsplash.com/photo-1591871207137-0cf3c8861e60?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'ICE / Railjet',
    transfers: 1,
    frequency: 'Hourly',
    scenicRating: 5,
    scenicHighlight: 'Snow-capped Bavarian Alps suddenly towering over the tracks as you approach.',
    co2Kg: 30,
    co2SavingsPercent: 87,
    weather: [{ date: 'Apr 7', temp: 14, condition: 'sunny' }, { date: 'Apr 8', temp: 16, condition: 'sunny' }, { date: 'Apr 9', temp: 13, condition: 'cloudy' }]
  },
  {
    id: 'krakow',
    destinationName: 'Kraków',
    destinationCountry: 'Poland',
    originName: 'Berlin',
    category: CategoryType.Historical,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Preserved medieval royal capital with Wawel Castle, huge Rynek square, and atmospheric Kazimierz.',
    location: { lat: 50.0647, lng: 19.9450 },
    stationName: 'Kraków Główny',
    duration: '7h 15m',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1600109968846-978d3810a97c?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'EuroCity (EC Wawel)',
    transfers: 0,
    frequency: 'Direct daily EuroCity',
    scenicRating: 4,
    scenicHighlight: 'Direct train journey across the historic heart of Southern Poland.',
    co2Kg: 35,
    co2SavingsPercent: 87,
    weather: [{ date: 'Apr 7', temp: 15, condition: 'sunny' }, { date: 'Apr 8', temp: 17, condition: 'sunny' }, { date: 'Apr 9', temp: 14, condition: 'cloudy' }]
  },
  {
    id: 'innsbruck',
    destinationName: 'Innsbruck',
    destinationCountry: 'Austria',
    originName: 'Berlin',
    category: CategoryType.Mountains,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Capital of the Alps with dramatic 2,000m peaks rising directly behind the imperial old town.',
    location: { lat: 47.2692, lng: 11.4041 },
    stationName: 'Innsbruck Hbf',
    duration: '6h 30m',
    price: 59,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'ICE / ÖBB Nightjet',
    transfers: 1,
    frequency: 'Direct daytime ICE + Direct Nightjet sleeper',
    scenicRating: 5,
    scenicHighlight: 'Dramatic Alpine climb up the Inn river valley surrounded by jagged peaks.',
    co2Kg: 34,
    co2SavingsPercent: 88,
    weather: [{ date: 'Apr 7', temp: 12, condition: 'sunny' }, { date: 'Apr 8', temp: 14, condition: 'sunny' }, { date: 'Apr 9', temp: 11, condition: 'cloudy' }]
  },
  {
    id: 'basel',
    destinationName: 'Basel',
    destinationCountry: 'Switzerland',
    originName: 'Berlin',
    category: CategoryType.City,
    tripType: 'Grand Rail',
    travelRing: 'extended',
    description: 'Cultural hub where Switzerland, France, and Germany meet along the Rhine river.',
    location: { lat: 47.5596, lng: 7.5886 },
    stationName: 'Basel SBB',
    duration: '7h 05m',
    price: 59,
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80',
    outboundDate: 'Apr 7',
    returnDate: 'Apr 12',
    trainOperator: 'Direct ICE (300 km/h)',
    transfers: 0,
    frequency: 'Direct ICE every 2 hours',
    scenicRating: 4,
    scenicHighlight: 'Gliding along the Black Forest foothills into the Swiss border tri-point.',
    co2Kg: 39,
    co2SavingsPercent: 87,
    weather: [{ date: 'Apr 7', temp: 16, condition: 'sunny' }, { date: 'Apr 8', temp: 18, condition: 'sunny' }, { date: 'Apr 9', temp: 16, condition: 'cloudy' }]
  }
];

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
  
  // 1. Try the multi-origin network first — this gives the richest connections
  const networkKey = Object.keys(multiOriginData.networkByOrigin).find(
    k => k === normalizedSearch || normalizedSearch.includes(k) || k.includes(normalizedSearch)
  );
  if (networkKey) {
    const networkDests = (multiOriginData.networkByOrigin as Record<string, TrainDeal[]>)[networkKey];
    if (networkDests && networkDests.length > 0) {
      return networkDests.slice(0, 25).map(d => d.destinationName);
    }
  }

  // 2. Try the hardcoded EURAIL_GRAPH as fallback
  const cityMatch = allDestinations.find(d => d.destinationName.toLowerCase().includes(normalizedSearch) || normalizedSearch.includes(d.destinationName.toLowerCase()));
  const matchedCityName = cityMatch ? cityMatch.destinationName : (Object.keys(EURAIL_GRAPH).find(k => k.toLowerCase() === normalizedSearch) || cityName);

  if (EURAIL_GRAPH[matchedCityName]) {
    return EURAIL_GRAPH[matchedCityName];
  }
  
  // 3. Fallback: find 20 closest cities by distance
  if (!cityMatch) return [];

  const others = allDestinations.filter(d => d.destinationName !== cityMatch.destinationName);
  others.sort((a, b) => {
    const distA = getDistance(cityMatch.location.lat, cityMatch.location.lng, a.location.lat, a.location.lng);
    const distB = getDistance(cityMatch.location.lat, cityMatch.location.lng, b.location.lat, b.location.lng);
    return distA - distB;
  });

  return others.slice(0, 20).map(d => d.destinationName);
};

import multiOriginData from './data/multi_origin_rail_network.json';

export const EUROPEAN_HUBS = multiOriginData.hubs;

export const ALL_BERLIN_DESTINATIONS: TrainDeal[] = (multiOriginData.networkByOrigin['berlin'] || BERLIN_DESTINATIONS) as TrainDeal[];

export const INITIAL_DESTINATIONS: TrainDeal[] = ALL_BERLIN_DESTINATIONS;

export const getOriginCoordinates = (originName: string) => {
  const norm = originName.toLowerCase().trim();
  const hub = EUROPEAN_HUBS.find(h => h.name.toLowerCase() === norm || h.id === norm);
  if (hub) return { lat: hub.lat, lng: hub.lng };
  return BERLIN_COORDS;
};

export const getDestinationsForOrigin = (originName: string): TrainDeal[] => {
  const norm = originName.toLowerCase().trim();
  
  // 1. Exact match in multi-origin network
  const network = (multiOriginData.networkByOrigin as Record<string, TrainDeal[]>)[norm];
  if (network && network.length > 0) {
    return network;
  }

  // 2. Partial match on hub name (e.g. 'Salzburg Hbf' -> 'salzburg')
  const matchedKey = Object.keys(multiOriginData.networkByOrigin).find(k => k === norm || norm.includes(k) || k.includes(norm));
  if (matchedKey && (multiOriginData.networkByOrigin as Record<string, TrainDeal[]>)[matchedKey]) {
    return (multiOriginData.networkByOrigin as Record<string, TrainDeal[]>)[matchedKey];
  }

  // 3. Fallback for smaller towns: find closest European hub
  const originCoord = getOriginCoordinates(originName);
  let closestHub = EUROPEAN_HUBS[0];
  let minDistance = Infinity;
  for (const hub of EUROPEAN_HUBS) {
    const d = Math.hypot(hub.lat - originCoord.lat, hub.lng - originCoord.lng);
    if (d < minDistance) {
      minDistance = d;
      closestHub = hub;
    }
  }
  const fallbackNetwork = (multiOriginData.networkByOrigin as Record<string, TrainDeal[]>)[closestHub.id];
  if (fallbackNetwork && fallbackNetwork.length > 0) {
    return fallbackNetwork;
  }

  return ALL_BERLIN_DESTINATIONS;
};

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: '1',
    role: 'model',
    text: "👋 I'm **TrainExplore AI**, your personal European train travel copilot! What kind of journey are you dreaming of? I can search routes across Europe, filter by price and duration, optimize multi-city loops, or curate detailed day-by-day itineraries.",
    quickReplies: [
      "🍷 Romantic wine weekend under $100",
      "🏔️ Alpine scenic trains with mountain views",
      "⚡ Fast direct getaways (<3h)",
      "🏰 Prague & Vienna 4-day loop"
    ]
  }
];

export const generateMockSchedules = (origin: string, dest: TrainDeal): TrainScheduleOption[] => {
  let durationHours = 4;
  let durationMins = 30;
  const hMatch = dest.duration.match(/(\d+)h/);
  const mMatch = dest.duration.match(/(\d+)m/);
  if (hMatch) durationHours = parseInt(hMatch[1], 10);
  if (mMatch) durationMins = parseInt(mMatch[1], 10);

  const departures = [
    { hour: 7, min: 15, isFastest: true, isBest: true, transferExtra: 0, class: '2nd Class' as const },
    { hour: 9, min: 42, isCheapest: true, transferExtra: 0, class: '2nd Class' as const },
    { hour: 13, min: 20, isFastest: false, transferExtra: dest.transfers > 0 ? 1 : 0, class: '2nd Class' as const },
    { hour: 17, min: 35, isFastest: false, transferExtra: 0, class: '1st Class' as const },
    { hour: 21, min: 10, isFastest: false, transferExtra: 0, class: '2nd Class' as const, isNightjet: true }
  ];

  return departures.map((d, index) => {
    const startHour = d.hour;
    const startMin = d.min;
    
    let totalDurMins = durationHours * 60 + durationMins + (d.transferExtra ? 25 : 0);
    let endHour = (startHour + Math.floor((startMin + totalDurMins) / 60)) % 24;
    let endMin = (startMin + totalDurMins) % 60;

    const formatTime = (h: number, m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const durHours = Math.floor(totalDurMins / 60);
    const durRestMins = totalDurMins % 60;

    let price = dest.price;
    if (d.isCheapest) price = Math.max(19, dest.price - 10);
    else if (d.class === '1st Class') price = Math.round(dest.price * 1.5);
    else if (index === 0) price = dest.price + 5;

    const op = d.isNightjet ? 'ÖBB Nightjet' : dest.trainOperator;
    const trainNum = d.isNightjet ? `NJ ${400 + index * 10}` : `${op.split(' ')[0]} ${1200 + index * 150}`;

    return {
      id: `sched-${dest.id}-${index}`,
      departureTime: formatTime(startHour, startMin),
      arrivalTime: formatTime(endHour, endMin),
      duration: `${durHours}h ${durRestMins}m`,
      originStation: origin.includes('Hbf') || origin.includes('Station') ? origin : `${origin} Hbf`,
      destinationStation: dest.destinationName.includes('Hbf') || dest.destinationName.includes('Station') ? dest.destinationName : `${dest.destinationName} Hbf`,
      trainNumber: trainNum,
      operator: op,
      transfers: d.transferExtra ? 1 : dest.transfers,
      transferStation: d.transferExtra ? 'Hannover Hbf' : undefined,
      price,
      seatClass: d.class,
      amenities: d.isNightjet ? ['power', 'dining', 'quiet'] : ['wifi', 'power', 'dining', 'quiet', 'bikes'],
      co2Kg: dest.co2Kg || 12,
      isBest: d.isBest,
      isCheapest: d.isCheapest,
      isFastest: d.isFastest
    };
  });
};

export const getPriceInsightForDeal = (dest: TrainDeal): PriceInsight => {
  const typicalMin = Math.round(dest.price * 1.15);
  const typicalMax = Math.round(dest.price * 1.6);
  const isLow = dest.price <= typicalMin;

  return {
    status: isLow ? 'low' : 'typical',
    currentPrice: dest.price,
    typicalMin,
    typicalMax,
    savingsVsTypical: Math.max(0, typicalMin - dest.price),
    advice: isLow 
      ? `Prices are currently $${typicalMin - dest.price} lower than usual for this route. Great time to book!` 
      : `Prices are normal for ${dest.outboundDate}. Booking 2 weeks ahead locks in lowest rate.`
  };
};

export const MOCK_ACCOMMODATION: Record<string, Accommodation[]> = {
  default: [
    { id: '1', name: 'Grand Central Hotel', rating: 4.5, price: 120, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80', neighborhood: 'City Center' },
    { id: '2', name: 'City Center Hostel', rating: 4.0, price: 45, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80', neighborhood: 'Station District' },
    { id: '3', name: 'Boutique Loft', rating: 4.8, price: 180, image: 'https://images.unsplash.com/photo-1522771753035-0a1529140558?auto=format&fit=crop&w=200&q=80', neighborhood: 'Old Town' },
    { id: '4', name: 'The Station Inn', rating: 3.8, price: 85, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80', neighborhood: 'Station District' },
    { id: '5', name: 'Luxury River View', rating: 4.9, price: 250, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=200&q=80', neighborhood: 'Riverside' },
  ]
};

export const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  default: [
    { id: '1', title: 'Historic City Walk', duration: '2h', price: 15, rating: 4.7, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80' },
    { id: '2', title: 'Museum Pass', duration: '1 day', price: 25, rating: 4.5, image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=300&q=80' },
    { id: '3', title: 'Food Tasting Tour', duration: '3h', price: 60, rating: 4.9, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80' },
  ]
};

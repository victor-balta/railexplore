import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allRoutesPath = path.resolve(__dirname, '../data/all_direct_routes.json');
const outputPath = path.resolve(__dirname, '../data/multi_origin_rail_network.json');

console.log('🚀 Loading core European GTFS direct routes...');
const directRoutes = JSON.parse(fs.readFileSync(allRoutesPath, 'utf8'));
console.log(`Loaded ${directRoutes.length} direct routes.`);

// 45 Major European Hubs with accurate coordinates & aliases
export const HUBS = [
  // Germany
  { id: 'berlin', name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, aliases: ['Berlin Hbf', 'Berlin Ostbahnhof', 'Berlin Südkreuz', 'Berlin Gesundbrunnen', 'Berlin-Spandau', 'Berlin Zoologischer Garten', 'Berlin Ostkreuz', 'Berlin Alexanderplatz'] },
  { id: 'munich', name: 'Munich', country: 'Germany', lat: 48.1351, lon: 11.5820, aliases: ['München Hbf', 'München-Pasing', 'München Ost', 'Munich Hbf'] },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany', lat: 50.1109, lon: 8.6821, aliases: ['Frankfurt(Main)Hbf', 'Frankfurt(Main)Süd', 'Frankfurt(M) Flughafen Fernbf', 'Frankfurt(Main)West', 'Frankfurt Hbf'] },
  { id: 'hamburg', name: 'Hamburg', country: 'Germany', lat: 53.5511, lon: 9.9937, aliases: ['Hamburg Hbf', 'Hamburg-Altona', 'Hamburg Dammtor', 'Hamburg-Harburg'] },
  { id: 'cologne', name: 'Cologne', country: 'Germany', lat: 50.9375, lon: 6.9603, aliases: ['Köln Hbf', 'Köln Messe/Deutz', 'Köln/Bonn Flughafen', 'Cologne Hbf'] },
  { id: 'leipzig', name: 'Leipzig', country: 'Germany', lat: 51.3397, lon: 12.3731, aliases: ['Leipzig Hbf', 'Leipzig/Halle Flughafen'] },
  { id: 'dresden', name: 'Dresden', country: 'Germany', lat: 51.0504, lon: 13.7373, aliases: ['Dresden Hbf', 'Dresden-Neustadt'] },
  { id: 'stuttgart', name: 'Stuttgart', country: 'Germany', lat: 48.7758, lon: 9.1829, aliases: ['Stuttgart Hbf', 'Stuttgart-Bad Cannstatt'] },
  { id: 'hanover', name: 'Hanover', country: 'Germany', lat: 52.3759, lon: 9.7320, aliases: ['Hannover Hbf', 'Hanover Hbf'] },
  { id: 'nuremberg', name: 'Nuremberg', country: 'Germany', lat: 49.4521, lon: 11.0767, aliases: ['Nürnberg Hbf', 'Nuremberg Hbf'] },
  { id: 'dusseldorf', name: 'Düsseldorf', country: 'Germany', lat: 51.2277, lon: 6.7735, aliases: ['Düsseldorf Hbf', 'Düsseldorf Flughafen'] },
  { id: 'mannheim', name: 'Mannheim', country: 'Germany', lat: 49.4875, lon: 8.4660, aliases: ['Mannheim Hbf'] },
  { id: 'karlsruhe', name: 'Karlsruhe', country: 'Germany', lat: 49.0069, lon: 8.4037, aliases: ['Karlsruhe Hbf', 'Karlsruhe-Durlach'] },
  { id: 'bremen', name: 'Bremen', country: 'Germany', lat: 53.0793, lon: 8.8017, aliases: ['Bremen Hbf'] },
  { id: 'erfurt', name: 'Erfurt', country: 'Germany', lat: 50.9848, lon: 11.0299, aliases: ['Erfurt Hbf'] },
  { id: 'freiburg', name: 'Freiburg', country: 'Germany', lat: 47.9990, lon: 7.8421, aliases: ['Freiburg(Breisgau) Hbf', 'Freiburg Hauptbahnhof'] },
  
  // Austria
  { id: 'vienna', name: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, aliases: ['Wien Hbf', 'Wien Meidling', 'Wien Hauptbahnhof', 'Vienna Hbf', 'Wien Westbahnhof'] },
  { id: 'salzburg', name: 'Salzburg', country: 'Austria', lat: 47.8095, lon: 13.0550, aliases: ['Salzburg Hbf'] },
  { id: 'innsbruck', name: 'Innsbruck', country: 'Austria', lat: 47.2692, lon: 11.4041, aliases: ['Innsbruck Hbf'] },
  { id: 'graz', name: 'Graz', country: 'Austria', lat: 47.0707, lon: 15.4395, aliases: ['Graz Hbf'] },
  { id: 'linz', name: 'Linz', country: 'Austria', lat: 48.3064, lon: 14.2858, aliases: ['Linz Hbf'] },
  
  // Switzerland
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417, aliases: ['Zürich HB', 'Zurich HB', 'Zürich Oerlikon'] },
  { id: 'basel', name: 'Basel', country: 'Switzerland', lat: 47.5596, lon: 7.5886, aliases: ['Basel SBB', 'Basel Bad Bf'] },
  { id: 'geneva', name: 'Geneva', country: 'Switzerland', lat: 46.2044, lon: 6.1432, aliases: ['Genève', 'Geneva', 'Genève-Cornavin'] },
  { id: 'bern', name: 'Bern', country: 'Switzerland', lat: 46.9480, lon: 7.4474, aliases: ['Bern', 'Berne'] },
  { id: 'lausanne', name: 'Lausanne', country: 'Switzerland', lat: 46.5197, lon: 6.6323, aliases: ['Lausanne'] },
  { id: 'lucerne', name: 'Lucerne', country: 'Switzerland', lat: 47.0502, lon: 8.3093, aliases: ['Luzern', 'Lucerne'] },
  
  // France & UK
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, aliases: ['Paris Est', 'Paris Gare de l’Est', 'Paris Nord', 'Paris Gare de Lyon', 'Paris Montparnasse'] },
  { id: 'lyon', name: 'Lyon', country: 'France', lat: 45.7640, lon: 4.8357, aliases: ['Lyon Part Dieu', 'Lyon Perrache'] },
  { id: 'marseille', name: 'Marseille', country: 'France', lat: 43.2965, lon: 5.3698, aliases: ['Marseille Saint-Charles'] },
  { id: 'nice', name: 'Nice', country: 'France', lat: 43.7102, lon: 7.2620, aliases: ['Nice Ville'] },
  { id: 'strasbourg', name: 'Strasbourg', country: 'France', lat: 48.5734, lon: 7.7521, aliases: ['Strasbourg', 'Strasbourg Ville'] },
  { id: 'lille', name: 'Lille', country: 'France', lat: 50.6292, lon: 3.0573, aliases: ['Lille Europe', 'Lille Flandres'] },
  { id: 'bordeaux', name: 'Bordeaux', country: 'France', lat: 44.8378, lon: -0.5792, aliases: ['Bordeaux Saint-Jean'] },
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, aliases: ['London St Pancras', 'London St Pancras Int.', 'London Kings Cross'] },
  
  // Italy
  { id: 'milan', name: 'Milan', country: 'Italy', lat: 45.4642, lon: 9.1900, aliases: ['Milano Centrale', 'Milano Porta Garibaldi', 'Milano Rogoredo'] },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, aliases: ['Roma Termini', 'Roma Tiburtina'] },
  { id: 'florence', name: 'Florence', country: 'Italy', lat: 43.7696, lon: 11.2558, aliases: ['Firenze Santa Maria Novella', 'Firenze S.M.N.', 'Firenze Campo di Marte'] },
  { id: 'venice', name: 'Venice', country: 'Italy', lat: 45.4408, lon: 12.3155, aliases: ['Venezia Santa Lucia', 'Venezia Mestre'] },
  { id: 'bologna', name: 'Bologna', country: 'Italy', lat: 44.4949, lon: 11.3426, aliases: ['Bologna Centrale'] },
  { id: 'verona', name: 'Verona', country: 'Italy', lat: 45.4384, lon: 10.9916, aliases: ['Verona Porta Nuova'] },
  
  // Spain
  { id: 'madrid', name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, aliases: ['Madrid-Puerta de Atocha', 'Madrid-Chamartín', 'Madrid Atocha'] },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', lat: 41.3879, lon: 2.1699, aliases: ['Barcelona Sants', 'Barcelona-Estació de França'] },
  { id: 'valencia', name: 'Valencia', country: 'Spain', lat: 39.4699, lon: -0.3763, aliases: ['Valencia Joaquín Sorolla', 'Valencia Nord'] },
  { id: 'seville', name: 'Seville', country: 'Spain', lat: 37.3891, lon: -5.9845, aliases: ['Sevilla-Santa Justa'] },
  
  // Benelux
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, aliases: ['Amsterdam Centraal', 'Amsterdam Zuid'] },
  { id: 'rotterdam', name: 'Rotterdam', country: 'Netherlands', lat: 51.9244, lon: 4.4777, aliases: ['Rotterdam Centraal'] },
  { id: 'brussels', name: 'Brussels', country: 'Belgium', lat: 50.8503, lon: 4.3517, aliases: ['Bruxelles Midi', 'Brussel-Zuid', 'Bruxelles Central', 'Bruxelles-Nord'] },
  { id: 'antwerp', name: 'Antwerp', country: 'Belgium', lat: 51.2194, lon: 4.4025, aliases: ['Antwerpen-Centraal'] },
  { id: 'luxembourg', name: 'Luxembourg', country: 'Luxembourg', lat: 49.8153, lon: 6.1296, aliases: ['Luxembourg', 'Luxembourg Gare Centrale'] },
  
  // Central & Eastern Europe
  { id: 'prague', name: 'Prague', country: 'Czechia', lat: 50.0755, lon: 14.4378, aliases: ['Praha hl.n.', 'Praha-Holesovice', 'Praha hlavní nádraží', 'Prague'] },
  { id: 'krakow', name: 'Kraków', country: 'Poland', lat: 50.0647, lon: 19.9450, aliases: ['Krakow Glowny', 'Kraków Główny', 'Krakow Plaszow'] },
  { id: 'wroclaw', name: 'Wrocław', country: 'Poland', lat: 51.1079, lon: 17.0385, aliases: ['Wroclaw Glowny', 'Wrocław Główny'] },
  { id: 'warsaw', name: 'Warsaw', country: 'Poland', lat: 52.2297, lon: 21.0122, aliases: ['Warszawa Centralna', 'Warszawa Wschodnia', 'Warszawa Zachodnia'] },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', lat: 47.4979, lon: 19.0402, aliases: ['Budapest-Keleti', 'Budapest-Nyugati', 'Budapest-Déli'] },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683, aliases: ['København H', 'Copenhagen Central'] }
];

// Top Transfer Hubs for 1-Stop Connections
const TRANSFER_HUBS = HUBS.slice(0, 20);

// Curated European Whitelist (~500 Travel-Worthy Cities & Gems)
export const DESTINATION_WHITELIST = new Set([
  // Germany
  'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leipzig', 'Dresden', 'Stuttgart', 'Hanover',
  'Nuremberg', 'Düsseldorf', 'Mannheim', 'Karlsruhe', 'Bremen', 'Erfurt', 'Freiburg', 'Augsburg',
  'Potsdam', 'Würzburg', 'Regensburg', 'Bamberg', 'Heidelberg', 'Lübeck', 'Rostock', 'Stralsund',
  'Schwerin', 'Weimar', 'Eisenach', 'Görlitz', 'Garmisch-Partenkirchen', 'Berchtesgaden', 'Füssen',
  'Lindau', 'Konstanz', 'Baden-Baden', 'Trier', 'Koblenz', 'Mainz', 'Wiesbaden', 'Münster', 'Aachen',
  'Bonn', 'Kiel', 'Flensburg', 'Magdeburg', 'Jena', 'Braunschweig', 'Göttingen', 'Kassel', 'Ulm',
  'Ingolstadt', 'Passau', 'Cottbus', 'Coburg', 'Bayreuth', 'Quedlinburg', 'Wernigerode', 'Goslar',
  'Celle', 'Lüneburg', 'Warnemünde', 'Binz', 'Westerland', 'Oberstdorf', 'Mittenwald', 'Rosenheim',

  // Austria
  'Vienna', 'Wien', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Klagenfurt', 'Villach', 'Bregenz',
  'Feldkirch', 'Dornbirn', 'Wels', 'Steyr', 'St. Pölten', 'Wiener Neustadt', 'Eisenstadt', 'Kufstein',
  'Wörgl', 'Kitzbühel', 'Zell am See', 'Bad Gastein', 'Hallstatt', 'Bad Ischl', 'Gmunden',
  'Attnang-Puchheim', 'Bischofshofen', 'Schwarzach', 'Jenbach', 'Seefeld', 'St. Anton am Arlberg',

  // Switzerland
  'Zurich', 'Zürich', 'Basel', 'Bern', 'Geneva', 'Genève', 'Lausanne', 'Luzern', 'Lucerne',
  'Interlaken', 'Thun', 'Biel', 'Winterthur', 'St. Gallen', 'Schaffhausen', 'Chur', 'Davos',
  'St. Moritz', 'Zermatt', 'Montreux', 'Lugano', 'Locarno', 'Bellinzona', 'Olten', 'Aarau', 'Baden',
  'Grindelwald', 'Lauterbrunnen', 'Spiez', 'Brienz', 'Vevey', 'Neuchâtel', 'Sion', 'Brig',

  // France
  'Paris', 'Strasbourg', 'Lyon', 'Marseille', 'Nice', 'Lille', 'Metz', 'Nancy', 'Mulhouse',
  'Colmar', 'Reims', 'Dijon', 'Besançon', 'Bordeaux', 'Toulouse', 'Montpellier', 'Nîmes',
  'Avignon', 'Aix-en-Provence', 'Cannes', 'Antibes', 'Monaco', 'Rouen', 'Rennes', 'Nantes',
  'Tours', 'Biarritz', 'Bayonne', 'Grenoble', 'Annecy', 'Chamonix',

  // United Kingdom
  'London', 'Brighton', 'Oxford', 'Cambridge', 'Bath', 'Bristol', 'Birmingham', 'Manchester',
  'Liverpool', 'York', 'Edinburgh', 'Glasgow',

  // Italy
  'Milan', 'Milano', 'Rome', 'Roma', 'Florence', 'Firenze', 'Venice', 'Venezia', 'Bologna',
  'Verona', 'Turin', 'Torino', 'Naples', 'Napoli', 'Genoa', 'Genova', 'Pisa', 'Siena', 'Lucca',
  'Padua', 'Padova', 'Trieste', 'Bolzano', 'Bozen', 'Trento', 'Como', 'Bergamo', 'Brescia',
  'Parma', 'Modena', 'Ravenna', 'Rimini', 'Perugia', 'Salerno', 'Sorrento', 'Cinque Terre',
  'La Spezia', 'Monterosso', 'Riomaggiore', 'Vernazza', 'Corniglia', 'Manarola',

  // Spain
  'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Sevilla', 'Zaragoza', 'Malaga', 'Málaga',
  'Cordoba', 'Córdoba', 'Alicante', 'Bilbao', 'San Sebastián', 'Donostia', 'Granada', 'Toledo',
  'Segovia', 'Salamanca', 'Santiago de Compostela', 'Cadiz', 'Cádiz', 'Girona', 'Tarragona',

  // Netherlands & Belgium
  'Amsterdam', 'Rotterdam', 'Den Haag', 'The Hague', 'Utrecht', 'Eindhoven', 'Arnhem', 'Groningen',
  'Maastricht', 'Nijmegen', 'Haarlem', 'Delft', 'Leiden', 'Amersfoort', 'Deventer', 'Zwolle',
  'Breda', 'Tilburg', 'Brussels', 'Bruxelles', 'Bruges', 'Brugge', 'Ghent', 'Gent', 'Antwerp',
  'Antwerpen', 'Liège', 'Leuven', 'Mechelen', 'Namur', 'Ostend', 'Oostende', 'Mons',

  // Central & Eastern Europe
  'Prague', 'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Pilsen', 'Olomouc', 'Liberec', 'České Budějovice',
  'Karlovy Vary', 'Hradec Králové', 'Ústí nad Labem', 'Děčín', 'Pardubice', 'Kraków', 'Krakow',
  'Warsaw', 'Warszawa', 'Wrocław', 'Wroclaw', 'Gdańsk', 'Gdansk', 'Poznań', 'Poznan', 'Łódź',
  'Szczecin', 'Katowice', 'Lublin', 'Toruń', 'Copenhagen', 'København', 'Aarhus', 'Odense',
  'Budapest', 'Bratislava', 'Ljubljana', 'Maribor', 'Zagreb', 'Luxembourg'
]);

function isKnownDestination(cleanedName) {
  if (DESTINATION_WHITELIST.has(cleanedName)) return true;
  const stripped = cleanedName.replace(/\s*Hbf$/i, '').replace(/\s*Hauptbahnhof$/i, '').replace(/\s*Centraal\b/i, '').replace(/\s*Centrale\b/i, '').replace(/\s*Station\b/i, '').trim();
  if (DESTINATION_WHITELIST.has(stripped)) return true;
  return false;
}

const ALWAYS_EXCLUDE_PATTERNS = [
  /flughafen/i, /airport/i, /aeropuerto/i, /aeroporto/i, /terminal/i, /besucherpark/i,
  /str\./i, /straße/i, /strasse/i, /rue/i, /via\s/i, /calle/i,
  /vorpl\./i, /vorplatz/i,
  /^ZOB\s/i, /\sZOB$/i, /^P\+R\s/i,
  /\//,
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function cleanStationName(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*\(Main\)\s*/g, ' ')
    .replace(/\s*\(Breisgau\)\s*/g, ' ')
    .replace(/\s*\(Elbe\)\s*/g, ' ')
    .replace(/\s*\(Saale\)\s*/g, ' ')
    .replace(/\s*\(Holst\)\s*/g, ' ')
    .replace(/\s*\(Oldb\)\s*/g, ' ')
    .replace(/\s*\(Westf\)\s*/g, ' ')
    .replace(/\s*\(Neckar\)\s*/g, ' ')
    .replace(/\s*\(Allgäu\)\s*/g, ' ')
    .replace(/\s*\(Donau\)\s*/g, ' ')
    .replace(/\s*\(Bodensee\)\s*/g, ' ')
    .replace(/\s*\(Ostsee\)\s*/g, ' ')
    .replace(/\s*\(Oberfr\)\s*/g, ' ')
    .replace(/\s*\(Bay\)\s*/g, ' ')
    .replace(/\s*\(Rhein\)\s*/g, ' ')
    .replace(/\s*\(Ruhr\)\s*/g, ' ')
    .replace(/\s*\(Sachs\)\s*/g, ' ')
    .replace(/\s*\(Thür\)\s*/g, ' ')
    .replace(/\s*Hbf\b/g, '')
    .replace(/\s*Hauptbahnhof\b/g, '')
    .replace(/\s*Centraal\b/g, '')
    .replace(/\s*Centrale\b/g, '')
    .replace(/\s*Gare de l’Est\b/g, '')
    .replace(/\s*Gare de Lyon\b/g, '')
    .replace(/\s*Gare du Nord\b/g, '')
    .replace(/\s*hl\.n\.\b/g, '')
    .replace(/\s*Główny\b/g, '')
    .replace(/\s*Central\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferCategory(name, country, lat, lon) {
  const n = name.toLowerCase();
  if (['garmisch-partenkirchen', 'oberstdorf', 'mittenwald', 'berchtesgaden', 'innsbruck', 'kitzbühel', 'st. anton am arlberg', 'zermatt', 'st. moritz', 'davos', 'interlaken', 'grindelwald', 'chamonix', 'seefeld'].includes(n)) {
    return 'Skiing';
  }
  if (['zell am see', 'bad gastein', 'hallstatt', 'bad ischl', 'chur', 'brig', 'bolzano', 'bozen', 'trento', 'füssen', 'bischofshofen', 'cortina'].includes(n)) {
    return 'Mountain';
  }
  if (['lindau', 'konstanz', 'bregenz', 'gmunden', 'thun', 'spiez', 'brienz', 'luzern', 'lucerne', 'lugano', 'locarno', 'como', 'montreux', 'annecy', 'schwerin'].includes(n)) {
    return 'Lakeside';
  }
  if (['rostock', 'warnemünde', 'stralsund', 'binz', 'westerland', 'flensburg', 'kiel', 'nice', 'cannes', 'antibes', 'monaco', 'marseille', 'cinque terre', 'monterosso', 'riomaggiore', 'sorrento', 'naples', 'napoli', 'rimini', 'barcelona', 'valencia', 'malaga', 'cadiz', 'san sebastián', 'biarritz', 'ostend'].includes(n)) {
    return 'Beaches';
  }
  if (['heidelberg', 'bamberg', 'regensburg', 'rothenburg', 'würzburg', 'quedlinburg', 'weimar', 'eisenach', 'görlitz', 'lübeck', 'trier', 'salzburg', 'graz', 'florence', 'firenze', 'rome', 'roma', 'siena', 'pisa', 'verona', 'toledo', 'seville', 'cordoba', 'granada', 'bruges', 'ghent', 'prague', 'kraków'].includes(n)) {
    return 'Historical';
  }
  if (['paris', 'venice', 'venezia', 'vienna', 'wien', 'florence', 'budapest', 'prague', 'salzburg', 'colmar', 'strasbourg', 'amsterdam', 'bruges', 'lucerne'].includes(n)) {
    return 'Romantic';
  }
  if (['baden-baden', 'bad gastein', 'bad ischl', 'aix-en-provence', 'karlovy vary'].includes(n)) {
    return 'Wellness';
  }
  if (['berlin', 'munich', 'frankfurt', 'hamburg', 'cologne', 'london', 'madrid', 'barcelona', 'milan', 'rome', 'brussels', 'amsterdam', 'warsaw', 'lyon'].includes(n)) {
    return 'City Break';
  }
  return 'Nature';
}

function calculatePrice(distanceKm, durationMinutes, isDirect, isHub) {
  let price = Math.round(14 + (distanceKm * 0.08) + (durationMinutes * 0.04));
  if (!isDirect) price = Math.round(price * 1.15);
  if (isHub) price = Math.round(price * 0.9);
  return Math.max(14, Math.min(price, 145));
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m < 10 ? '0' : ''}${m}m`;
}

function getImagesForCity(city) {
  const images = {
    'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80',
    'Salzburg': 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=800&q=80',
    'Innsbruck': 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
    'Zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    'Milan': 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80',
    'Florence': 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
    'Venice': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
    'Madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    'Amsterdam': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
    'Brussels': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
    'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
    'Kraków': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=800&q=80',
    'Warsaw': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=800&q=80',
    'Budapest': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80'
  };
  return images[city] || 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80';
}

function deduplicateDestinations(destinations) {
  const sorted = [...destinations].sort((a, b) => {
    if (a.isDirect !== b.isDirect) return a.isDirect ? -1 : 1;
    if (a.minDurationMinutes !== b.minDurationMinutes) return a.minDurationMinutes - b.minDurationMinutes;
    return a.price - b.price;
  });

  const unique = [];
  for (const d of sorted) {
    const isDup = unique.some(u => {
      if (u.destinationName.toLowerCase() === d.destinationName.toLowerCase()) return true;
      const dist = calculateDistance(u.location.lat, u.location.lng, d.location.lat, d.location.lng);
      return dist < 15;
    });
    if (!isDup) {
      unique.push(d);
    }
  }
  return unique;
}

console.log('⚡ Indexing Direct Routes across all hubs...');
const directRoutesByHub = new Map();
HUBS.forEach(h => directRoutesByHub.set(h.id, []));

// 1. Ingest Direct GTFS routes
for (const r of directRoutes) {
  const originClean = cleanStationName(r.origin_name);
  const destClean = cleanStationName(r.destination_name);

  if (ALWAYS_EXCLUDE_PATTERNS.some(p => p.test(r.destination_name) || p.test(destClean))) continue;
  if (!isKnownDestination(destClean)) continue;

  const durationMin = r.duration_min;
  if (durationMin < 20 || durationMin > 720) continue;

  for (const hub of HUBS) {
    const isOriginMatch = hub.aliases.some(a => r.origin_name.includes(a) || r.origin_name.toLowerCase() === a.toLowerCase()) ||
                          originClean.toLowerCase() === hub.name.toLowerCase() ||
                          calculateDistance(hub.lat, hub.lon, r.origin_lat, r.origin_lon) < 18;

    if (isOriginMatch) {
      const dist = calculateDistance(hub.lat, hub.lon, r.destination_lat, r.destination_lon);
      if (dist < 40) continue;

      const isDestHub = HUBS.some(h => h.name.toLowerCase() === destClean.toLowerCase());
      const cat = inferCategory(destClean, r.destination_country, r.destination_lat, r.destination_lon);
      const price = calculatePrice(dist, durationMin, true, isDestHub);

      const deal = {
        id: `${hub.id}_${destClean.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        destinationName: destClean,
        stationName: r.destination_name,
        destinationCountry: r.destination_country || 'Europe',
        originName: hub.name,
        category: cat,
        tripType: durationMin <= 150 ? 'Day Trip' : (durationMin <= 300 ? 'Weekend Break' : 'Grand Rail'),
        travelRing: durationMin <= 150 ? 'day_trip' : (durationMin <= 300 ? 'weekend' : 'extended'),
        description: `Direct high-speed train journey from ${hub.name} to ${destClean} in ${formatDuration(durationMin)}.`,
        location: { lat: r.destination_lat, lng: r.destination_lon },
        duration: formatDuration(durationMin),
        minDurationMinutes: durationMin,
        price: price,
        transfers: 0,
        isDirect: true,
        trainOperator: r.train_types?.join(', ') || 'ICE / Railjet',
        frequency: `${r.daily_trips || 8} direct departures daily`,
        scenicRating: cat === 'Mountain' || cat === 'Skiing' || cat === 'Lakeside' ? 5 : 4,
        scenicHighlight: `Scenic rail corridor from ${hub.name} to ${destClean}.`,
        co2Kg: Math.round(dist * 0.035),
        co2SavingsPercent: Math.min(94, Math.max(75, Math.round(85 + (dist / 100)))),
        imageUrl: getImagesForCity(destClean),
        outboundDate: 'Apr 7',
        returnDate: 'Apr 7',
        weather: [
          { date: 'Apr 7', temp: 17, condition: 'sunny' },
          { date: 'Apr 8', temp: 19, condition: 'sunny' },
          { date: 'Apr 9', temp: 16, condition: 'cloudy' }
        ]
      };

      directRoutesByHub.get(hub.id).push(deal);
    }
  }
}

// 2. Synthesize High-Speed Corridors between European Hubs
console.log('🔗 Synthesizing Pan-European Hub Connections...');
for (const hubA of HUBS) {
  for (const hubB of HUBS) {
    if (hubA.id === hubB.id) continue;
    const dist = calculateDistance(hubA.lat, hubA.lon, hubB.lat, hubB.lon);
    if (dist < 50 || dist > 1400) continue;

    const existing = directRoutesByHub.get(hubA.id).find(d => d.destinationName.toLowerCase() === hubB.name.toLowerCase());
    if (!existing) {
      const durationMin = Math.round((dist / 140) * 60 + 35);
      if (durationMin <= 660) {
        const cat = inferCategory(hubB.name, hubB.country, hubB.lat, hubB.lon);
        const deal = {
          id: `${hubA.id}_${hubB.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          destinationName: hubB.name,
          stationName: `${hubB.name} Central Station`,
          destinationCountry: hubB.country,
          originName: hubA.name,
          category: cat,
          tripType: durationMin <= 150 ? 'Day Trip' : (durationMin <= 300 ? 'Weekend Break' : 'Grand Rail'),
          travelRing: durationMin <= 150 ? 'day_trip' : (durationMin <= 300 ? 'weekend' : 'extended'),
          description: `Fast EuroCity / High-Speed train connection from ${hubA.name} to ${hubB.name} in ${formatDuration(durationMin)}.`,
          location: { lat: hubB.lat, lng: hubB.lon },
          duration: formatDuration(durationMin),
          minDurationMinutes: durationMin,
          price: calculatePrice(dist, durationMin, true, true),
          transfers: dist > 500 ? 1 : 0,
          isDirect: dist <= 500,
          trainOperator: 'Eurostar / TGV / ICE / Railjet',
          frequency: 'Frequent daily departures',
          scenicRating: 4,
          scenicHighlight: `Scenic cross-border railway line from ${hubA.name} to ${hubB.name}.`,
          co2Kg: Math.round(dist * 0.035),
          co2SavingsPercent: 90,
          imageUrl: getImagesForCity(hubB.name),
          outboundDate: 'Apr 7',
          returnDate: 'Apr 7',
          weather: [
            { date: 'Apr 7', temp: 18, condition: 'sunny' },
            { date: 'Apr 8', temp: 20, condition: 'sunny' },
            { date: 'Apr 9', temp: 17, condition: 'cloudy' }
          ]
        };
        directRoutesByHub.get(hubA.id).push(deal);
      }
    }
  }
}

// 3. Build 1-Transfer Connections & Final Network Dataset
console.log('🔄 Building complete multi-origin network...');
const networkByOrigin = {};

for (const hub of HUBS) {
  const directList = deduplicateDestinations(directRoutesByHub.get(hub.id));
  const combined = [...directList];

  for (const transferHub of TRANSFER_HUBS) {
    if (transferHub.id === hub.id) continue;
    const leg1 = directList.find(d => d.destinationName.toLowerCase() === transferHub.name.toLowerCase());
    if (!leg1) continue;

    const leg2Destinations = directRoutesByHub.get(transferHub.id) || [];
    for (const leg2 of leg2Destinations) {
      if (leg2.destinationName.toLowerCase() === hub.name.toLowerCase()) continue;
      if (leg2.destinationName.toLowerCase() === transferHub.name.toLowerCase()) continue;

      const totalDurationMin = leg1.minDurationMinutes + leg2.minDurationMinutes + 25;
      if (totalDurationMin > 660) continue;

      const dist = calculateDistance(hub.lat, hub.lon, leg2.location.lat, leg2.location.lng);
      if (dist < 60) continue;

      const transferDeal = {
        id: `${hub.id}_${leg2.destinationName.toLowerCase().replace(/[^a-z0-9]/g, '-')}_via_${transferHub.id}`,
        destinationName: leg2.destinationName,
        stationName: leg2.stationName,
        destinationCountry: leg2.destinationCountry,
        originName: hub.name,
        category: leg2.category,
        tripType: totalDurationMin <= 240 ? 'Weekend Break' : 'Grand Rail',
        travelRing: totalDurationMin <= 240 ? 'weekend' : 'extended',
        description: `Smooth 1-transfer train journey from ${hub.name} to ${leg2.destinationName} via ${transferHub.name}.`,
        location: leg2.location,
        duration: formatDuration(totalDurationMin),
        minDurationMinutes: totalDurationMin,
        price: Math.round((leg1.price + leg2.price) * 0.85),
        transfers: 1,
        isDirect: false,
        transferStation: transferHub.name,
        trainOperator: `${leg1.trainOperator || 'ICE'} + ${leg2.trainOperator || 'TGV'}`,
        frequency: `Hourly connection (via ${transferHub.name})`,
        scenicRating: Math.max(leg1.scenicRating || 3, leg2.scenicRating || 3),
        scenicHighlight: `Scenic transfer route via ${transferHub.name}.`,
        co2Kg: Math.round(dist * 0.038),
        co2SavingsPercent: Math.min(92, Math.max(70, Math.round(80 + (dist / 120)))),
        imageUrl: leg2.imageUrl || getImagesForCity(leg2.destinationName),
        outboundDate: 'Apr 7',
        returnDate: 'Apr 7',
        weather: leg2.weather || [
          { date: 'Apr 7', temp: 17, condition: 'sunny' },
          { date: 'Apr 8', temp: 19, condition: 'sunny' },
          { date: 'Apr 9', temp: 16, condition: 'cloudy' }
        ]
      };

      combined.push(transferDeal);
    }
  }

  const finalDeduped = deduplicateDestinations(combined).slice(0, 160);
  networkByOrigin[hub.id] = finalDeduped;
  console.log(` ✅ ${hub.name} (${hub.country}): ${finalDeduped.length} destinations`);
}

const finalOutput = {
  hubs: HUBS.map(h => ({ id: h.id, name: h.name, country: h.country, lat: h.lat, lng: h.lon })),
  networkByOrigin
};

fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2));
console.log(`\n🎉 Successfully generated Pan-European Rail Network dataset!`);
console.log(`Saved to ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);

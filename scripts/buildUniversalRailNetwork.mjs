import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allRoutesPath = path.resolve(__dirname, '../data/all_direct_routes.json');
console.log('🚀 Loading European GTFS routes...');
const directRoutes = JSON.parse(fs.readFileSync(allRoutesPath, 'utf8'));
console.log(`Loaded ${directRoutes.length} direct routes.`);

// European Major Hubs
const HUBS = [
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
  { id: 'prague', name: 'Prague', country: 'Czechia', lat: 50.0755, lon: 14.4378, aliases: ['Praha hl.n.', 'Praha-Holesovice', 'Praha hlavní nádraží', 'Prague'] },
  { id: 'vienna', name: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, aliases: ['Wien Hbf', 'Wien Meidling', 'Wien Hauptbahnhof', 'Vienna Hbf'] },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, aliases: ['Amsterdam Centraal', 'Amsterdam Zuid'] },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417, aliases: ['Zürich HB', 'Zurich HB'] },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, aliases: ['Paris Est', 'Paris Gare de l’Est', 'Paris Nord', 'Paris Gare de Lyon'] },
  { id: 'basel', name: 'Basel', country: 'Switzerland', lat: 47.5596, lon: 7.5886, aliases: ['Basel SBB', 'Basel Bad Bf'] },
  { id: 'salzburg', name: 'Salzburg', country: 'Austria', lat: 47.8095, lon: 13.0550, aliases: ['Salzburg Hbf'] },
  { id: 'innsbruck', name: 'Innsbruck', country: 'Austria', lat: 47.2692, lon: 11.4041, aliases: ['Innsbruck Hbf'] },
  { id: 'krakow', name: 'Kraków', country: 'Poland', lat: 50.0647, lon: 19.9450, aliases: ['Krakow Glowny', 'Kraków Główny', 'Krakow Plaszow'] },
  { id: 'wroclaw', name: 'Wrocław', country: 'Poland', lat: 51.1079, lon: 17.0385, aliases: ['Wroclaw Glowny', 'Wrocław Główny'] },
  { id: 'bremen', name: 'Bremen', country: 'Germany', lat: 53.0793, lon: 8.8017, aliases: ['Bremen Hbf'] },
  { id: 'erfurt', name: 'Erfurt', country: 'Germany', lat: 50.9848, lon: 11.0299, aliases: ['Erfurt Hbf', 'Erfurt Central Station (FlixTrain)'] },
  { id: 'freiburg', name: 'Freiburg', country: 'Germany', lat: 47.9990, lon: 7.8421, aliases: ['Freiburg(Breisgau) Hbf', 'Freiburg Hauptbahnhof'] }
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('sylt') || lower.includes('ostsee') || lower.includes('nordsee') || lower.includes('warnemünde') || lower.includes('rostock') || lower.includes('stralsund') || lower.includes('rügen') || lower.includes('usedom') || lower.includes('binz')) return 'Beaches';
  if (lower.includes('schweiz') || lower.includes('harz') || lower.includes('schandau') || lower.includes('thüringen') || lower.includes('alpen') || lower.includes('innsbruck') || lower.includes('salzburg') || lower.includes('garmisch')) return 'Mountain';
  if (lower.includes('schwerin') || lower.includes('see') || lower.includes('spreewald') || lower.includes('plau') || lower.includes('müritz') || lower.includes('zurich') || lower.includes('bodensee') || lower.includes('konstanz')) return 'Lakeside';
  if (lower.includes('wittenberg') || lower.includes('weimar') || lower.includes('erfurt') || lower.includes('potsdam') || lower.includes('dresden') || lower.includes('nürnberg') || lower.includes('prag') || lower.includes('praha') || lower.includes('wien') || lower.includes('wroclaw') || lower.includes('krakow') || lower.includes('bamberg') || lower.includes('quedlinburg') || lower.includes('goslar') || lower.includes('heidelberg') || lower.includes('rothenburg')) return 'Historical';
  if (lower.includes('paris') || lower.includes('verona') || lower.includes('venice') || lower.includes('bruges') || lower.includes('florence') || lower.includes('strasbourg')) return 'Romantic';
  if (lower.includes('wald') || lower.includes('natur') || lower.includes('park') || lower.includes('nationalpark') || lower.includes('biosphäre') || lower.includes('schwarzwald')) return 'Nature';
  return 'City Break';
}

function inferCountry(name) {
  const lower = name.toLowerCase();
  if (lower.includes('praha') || lower.includes('prag') || lower.includes('decín') || lower.includes('usti') || lower.includes('brno') || lower.includes('pilsen')) return 'Czechia';
  if (lower.includes('amsterdam') || lower.includes('utrecht') || lower.includes('amersfoort') || lower.includes('rotterdam') || lower.includes('hague') || lower.includes('arnhem') || lower.includes('deventer') || lower.includes('hengelo')) return 'Netherlands';
  if (lower.includes('wien') || lower.includes('vienna') || lower.includes('salzburg') || lower.includes('innsbruck') || lower.includes('linz') || lower.includes('graz') || lower.includes('kufstein')) return 'Austria';
  if (lower.includes('zürich') || lower.includes('zurich') || lower.includes('basel') || lower.includes('bern') || lower.includes('genf') || lower.includes('geneva')) return 'Switzerland';
  if (lower.includes('paris') || lower.includes('strasbourg') || lower.includes('lyon') || lower.includes('metz') || lower.includes('mulhouse')) return 'France';
  if (lower.includes('wroclaw') || lower.includes('szczecin') || lower.includes('poznan') || lower.includes('warszawa') || lower.includes('gdansk') || lower.includes('krakow')) return 'Poland';
  if (lower.includes('københavn') || lower.includes('copenhagen') || lower.includes('aarhus') || lower.includes('odense')) return 'Denmark';
  if (lower.includes('bruxelles') || lower.includes('brussels') || lower.includes('antwerpen') || lower.includes('liège')) return 'Belgium';
  return 'Germany';
}

function cleanCityName(name) {
  return name
    .replace(/\s*Hauptbahnhof/i, '')
    .replace(/\s*Bahnhof/i, '')
    .replace(/,\s*Hbf/i, '')
    .replace(/\s+Hbf$/i, '')
    .replace(/,\s*Bahnhof/i, '')
    .replace(/\s*\(.*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Minimum distance from origin to qualify as a travel destination (km)
const MIN_DESTINATION_DISTANCE_KM = 50;

// Maximum destinations per origin (after dedup + filtering)
const MAX_DESTINATIONS_PER_ORIGIN = 150;

// Deduplication radius: if two destinations are within this distance, keep only the best one
const DEDUP_RADIUS_KM = 15;

// ============================================================================
// WHITELIST APPROACH: Only include real cities/towns that are actual travel
// destinations. This is how Google Flights, Rome2Rio, Omio, etc. work.
// A GTFS stop only becomes a destination if its cleaned name matches a known
// city. Everything else (random villages, rural halts, suburban stops) is
// ignored.
// ============================================================================
const DESTINATION_WHITELIST = new Set([
  // === GERMANY — Major Cities ===
  'Berlin', 'Munich', 'München', 'Frankfurt', 'Hamburg', 'Cologne', 'Köln',
  'Düsseldorf', 'Stuttgart', 'Leipzig', 'Dresden', 'Hanover', 'Hannover',
  'Nuremberg', 'Nürnberg', 'Bremen', 'Dortmund', 'Essen', 'Duisburg',
  'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Mannheim',
  'Karlsruhe', 'Augsburg', 'Wiesbaden', 'Aachen', 'Braunschweig',
  'Kiel', 'Magdeburg', 'Freiburg', 'Lübeck', 'Erfurt', 'Rostock',
  'Mainz', 'Kassel', 'Hagen', 'Saarbrücken', 'Potsdam', 'Osnabrück',
  'Ludwigshafen', 'Oldenburg', 'Leverkusen', 'Solingen', 'Darmstadt',
  'Heidelberg', 'Regensburg', 'Ingolstadt', 'Würzburg', 'Wolfsburg',
  'Ulm', 'Heilbronn', 'Göttingen', 'Pforzheim', 'Reutlingen', 'Koblenz',
  'Trier', 'Jena', 'Hildesheim', 'Cottbus', 'Gera', 'Wilhelmshaven',

  // === GERMANY — Regional & Tourist Towns ===
  'Rosenheim', 'Passau', 'Bamberg', 'Bayreuth', 'Coburg', 'Schwerin',
  'Stralsund', 'Greifswald', 'Wismar', 'Warnemünde', 'Binz', 'Rügen',
  'Sylt', 'Westerland', 'Konstanz', 'Lindau', 'Friedrichshafen',
  'Garmisch-Partenkirchen', 'Berchtesgaden', 'Bad Reichenhall',
  'Oberstdorf', 'Füssen', 'Mittenwald', 'Rothenburg ob der Tauber',
  'Quedlinburg', 'Goslar', 'Wernigerode', 'Bad Harzburg',
  'Stendal', 'Lutherstadt Wittenberg', 'Wittenberg',
  'Brandenburg', 'Neustrelitz', 'Waren', 'Neubrandenburg',
  'Lübben', 'Lübbenau', 'Eberswalde', 'Rathenow',
  'Angermünde', 'Prenzlau', 'Templin', 'Ludwigslust', 'Wittenberge',
  'Güstrow', 'Bad Doberan', 'Kühlungsborn', 'Bergen auf Rügen',
  'Aschaffenburg', 'Fulda', 'Marburg', 'Gießen', 'Limburg',
  'Bad Homburg', 'Offenbach', 'Hanau', 'Bad Nauheim',
  'Schweinfurt', 'Landshut', 'Deggendorf', 'Straubing',
  'Memmingen', 'Kempten', 'Kaufbeuren', 'Donauwörth',
  'Traunstein', 'Bad Tölz', 'Murnau', 'Starnberg', 'Prien',
  'Lüneburg', 'Celle', 'Wolfenbüttel', 'Hameln', 'Minden',
  'Paderborn', 'Detmold', 'Gütersloh', 'Herford', 'Siegen',
  'Wetzlar', 'Bingen', 'Bad Kreuznach', 'Idar-Oberstein',
  'Bad Ems', 'Cochem', 'Andernach', 'Remagen', 'Bad Honnef',
  'Kleve', 'Wesel', 'Emmerich', 'Xanten', 'Moers',
  'Schwäbisch Hall', 'Tübingen', 'Esslingen', 'Sindelfingen',
  'Baden-Baden', 'Offenburg', 'Donaueschingen', 'Villingen-Schwenningen',
  'Singen', 'Ravensburg', 'Biberach', 'Heidenheim',
  'Görlitz', 'Bautzen', 'Meißen', 'Pirna', 'Zwickau', 'Chemnitz',
  'Plauen', 'Dessau', 'Halle', 'Naumburg', 'Weimar', 'Eisenach',
  'Gotha', 'Suhl', 'Nordhausen', 'Mühlhausen',
  'Speyer', 'Worms', 'Neustadt an der Weinstraße', 'Landau',
  'Kaiserslautern', 'Pirmasens', 'Zweibrücken',
  'Flensburg', 'Husum', 'Neumünster', 'Rendsburg', 'Eckernförde',
  'Heide', 'Niebüll', 'Schleswig',
  'Emden', 'Aurich', 'Leer', 'Norderney', 'Borkum',
  'Cuxhaven', 'Stade', 'Buxtehude', 'Uelzen', 'Soltau',
  'Gifhorn', 'Salzgitter', 'Clausthal-Zellerfeld',
  'Schwerte', 'Iserlohn', 'Lüdenscheid', 'Altena',
  'Bitterfeld', 'Wittenberg', 'Dessau-Roßlau',
  'Senftenberg', 'Spremberg', 'Forst', 'Guben',
  'Bad Schandau', 'Sächsische Schweiz',
  'Sassnitz', 'Sellin', 'Göhren', 'Heringsdorf', 'Ahlbeck',
  'Travemünde', 'Timmendorfer Strand', 'Scharbeutz',
  'St. Peter-Ording', 'Büsum', 'Wyk auf Föhr',
  'Mühldorf', 'Wasserburg', 'Bad Aibling',
  'Günzburg', 'Nördlingen', 'Treuchtlingen',
  'Ansbach', 'Neumarkt', 'Amberg', 'Weiden',
  'Schwandorf', 'Cham', 'Hof', 'Selb', 'Marktredwitz',

  // === AUSTRIA ===
  'Vienna', 'Wien', 'Salzburg', 'Innsbruck', 'Graz', 'Linz',
  'Klagenfurt', 'Villach', 'Bregenz', 'Feldkirch', 'Dornbirn',
  'Wels', 'Steyr', 'St. Pölten', 'Wiener Neustadt', 'Eisenstadt',
  'Kufstein', 'Wörgl', 'Kitzbühel', 'Zell am See', 'Bad Gastein',
  'Hallstatt', 'Bad Ischl', 'Gmunden', 'Attnang-Puchheim',
  'Bischofshofen', 'Schwarzach', 'Jenbach', 'Seefeld',

  // === SWITZERLAND ===
  'Zurich', 'Zürich', 'Basel', 'Bern', 'Geneva', 'Genève',
  'Lausanne', 'Luzern', 'Lucerne', 'Interlaken', 'Thun',
  'Biel', 'Winterthur', 'St. Gallen', 'Schaffhausen', 'Chur',
  'Davos', 'St. Moritz', 'Zermatt', 'Montreux', 'Lugano',
  'Locarno', 'Bellinzona', 'Olten', 'Aarau', 'Baden',

  // === FRANCE ===
  'Paris', 'Strasbourg', 'Lyon', 'Marseille', 'Lille', 'Metz',
  'Nancy', 'Mulhouse', 'Colmar', 'Reims', 'Dijon', 'Besançon',

  // === NETHERLANDS ===
  'Amsterdam', 'Rotterdam', 'Den Haag', 'The Hague', 'Utrecht',
  'Eindhoven', 'Arnhem', 'Groningen', 'Maastricht', 'Nijmegen',
  'Haarlem', 'Delft', 'Leiden', 'Amersfoort', 'Deventer',
  'Zwolle', 'Enschede', 'Breda', 'Tilburg', 'Hengelo',

  // === BELGIUM ===
  'Brussels', 'Bruxelles', 'Bruges', 'Brugge', 'Ghent', 'Gent',
  'Antwerp', 'Antwerpen', 'Liège', 'Leuven', 'Mechelen', 'Namur',
  'Ostend', 'Oostende', 'Mons', 'Charleroi',

  // === CZECH REPUBLIC ===
  'Prague', 'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Pilsen',
  'Olomouc', 'Liberec', 'České Budějovice', 'Karlovy Vary',
  'Hradec Králové', 'Ústí nad Labem', 'Děčín', 'Pardubice',

  // === POLAND ===
  'Kraków', 'Krakow', 'Warsaw', 'Warszawa', 'Wrocław', 'Wroclaw',
  'Gdańsk', 'Gdansk', 'Poznań', 'Poznan', 'Łódź', 'Lodz',
  'Szczecin', 'Katowice', 'Lublin', 'Toruń', 'Opole',
  'Częstochowa', 'Bydgoszcz', 'Rzeszów', 'Olsztyn', 'Białystok',

  // === DENMARK ===
  'Copenhagen', 'København', 'Aarhus', 'Odense', 'Aalborg',

  // === ITALY (border) ===
  'Verona', 'Venice', 'Venezia', 'Bologna', 'Milan', 'Milano',
  'Bolzano', 'Bozen', 'Trento', 'Brenner', 'Brennero',

  // === LUXEMBOURG ===
  'Luxembourg',

  // === HUNGARY (border) ===
  'Budapest',

  // Germany — HalleHbf cleanup
  'HalleHbf', 'Halle',
  // LandshutHbf cleanup
  'LandshutHbf',
  // SchwedtMitte cleanup
  'SchwedtMitte',
]);

// Function to check if a cleaned destination name is a whitelisted travel destination
function isKnownDestination(cleanedName) {
  if (DESTINATION_WHITELIST.has(cleanedName)) return true;
  // Also check without trailing "Hbf" or leading/trailing spaces
  const stripped = cleanedName.replace(/\s*Hbf$/i, '').replace(/\s*Hauptbahnhof$/i, '').trim();
  if (DESTINATION_WHITELIST.has(stripped)) return true;
  return false;
}

// Blacklist patterns that always disqualify a station name regardless of whitelist
const ALWAYS_EXCLUDE_PATTERNS = [
  /flughafen/i, /airport/i, /terminal/i, /besucherpark/i,
  /str\./i, /straße/i, /strasse/i,
  /vorpl\./i, /vorplatz/i,
  /^ZOB\s/i, /\sZOB$/i, /^P\+R\s/i,
  /\//,
];

function deduplicateDestinations(destinations) {
  // Sort by: isDirect first, then lowest duration, then lowest price
  const sorted = [...destinations].sort((a, b) => {
    if (a.isDirect !== b.isDirect) return a.isDirect ? -1 : 1;
    if (a.minDurationMinutes !== b.minDurationMinutes) return a.minDurationMinutes - b.minDurationMinutes;
    return a.price - b.price;
  });

  const kept = [];
  for (const dest of sorted) {
    const tooClose = kept.some(k =>
      calculateDistance(k.location.lat, k.location.lng, dest.location.lat, dest.location.lng) < DEDUP_RADIUS_KM
    );
    if (!tooClose) {
      kept.push(dest);
    }
  }
  return kept;
}

const photoCollection = [
  'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551221434-2e21b71cb61d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596700889146-24ba0fc74900?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600109968846-978d3810a97c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587327339121-65c26b84339f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543429776-278263259837?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595867985827-0466318535a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1599879793132-73a70f3fde52?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533227260856-23b6b23bfa99?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581452140685-61875e5b306a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1563804099-77e80f6dc8c8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80'
];

console.log('Indexing direct routes...');
const directMap = new Map();

for (const r of directRoutes) {
  const key = `${r.origin.toLowerCase()}__${r.destination.toLowerCase()}`;
  if (!directMap.has(key) || r.minDurationMinutes < directMap.get(key).minDurationMinutes) {
    directMap.set(key, r);
  }
}

function findDirectRoute(originHub, destHub) {
  let best = null;
  for (const oAlias of originHub.aliases) {
    for (const dAlias of destHub.aliases) {
      const key = `${oAlias.toLowerCase()}__${dAlias.toLowerCase()}`;
      const r = directMap.get(key);
      if (r) {
        if (!best || r.minDurationMinutes < best.minDurationMinutes) {
          best = r;
        }
      }
    }
  }
  return best;
}

const TRANSFER_HUBS = HUBS.slice(0, 15);

console.log('Building universal multi-origin routes...');
const networkByOrigin = {};

for (const originHub of HUBS) {
  const destMap = new Map();

  // 1. Direct GTFS destinations from this origin
  for (const r of directRoutes) {
    const origMatch = originHub.aliases.some(a => a.toLowerCase() === r.origin.toLowerCase());
    if (!origMatch) continue;

    const destName = cleanCityName(r.destination);
    const distKm = calculateDistance(originHub.lat, originHub.lon, r.destinationLat, r.destinationLon);
    
    // Skip intra-city & commuter-range stops
    if (distKm < MIN_DESTINATION_DISTANCE_KM) continue;
    if (r.destination.toLowerCase().includes(originHub.name.toLowerCase())) continue;
    
    // Always exclude airport/street/platform sub-stops
    if (ALWAYS_EXCLUDE_PATTERNS.some(p => p.test(r.destination))) continue;
    
    // WHITELIST CHECK: Only include if the cleaned name is a known travel destination
    if (!isKnownDestination(destName)) continue;

    const id = destName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const price = Math.max(10, Math.round(distKm * 0.11 + 8));

    const item = {
      id: `${originHub.id}_${id}`,
      destinationName: destName,
      stationName: r.destination,
      destinationCountry: inferCountry(r.destination),
      originName: originHub.name,
      category: inferCategory(r.destination),
      tripType: r.minDurationMinutes <= 120 ? 'Day Trip' : (r.minDurationMinutes <= 270 ? 'Weekend Break' : 'Grand Rail'),
      travelRing: r.minDurationMinutes <= 120 ? 'day_trip' : (r.minDurationMinutes <= 270 ? 'weekend' : 'extended'),
      description: `Direct train journey from ${originHub.name} to ${destName} in ${r.fastestDuration}.`,
      location: { lat: r.destinationLat, lng: r.destinationLon },
      duration: r.fastestDuration,
      minDurationMinutes: r.minDurationMinutes,
      price: price,
      transfers: 0,
      isDirect: true,
      trainOperator: r.trainTypes.slice(0, 3).join(', '),
      frequency: `${r.tripCount} direct departures daily`,
      scenicRating: 4,
      scenicHighlight: `Scenic direct railway route on ${r.trainTypes[0] || 'ICE'}.`,
      co2Kg: Math.round(distKm * 0.035),
      co2SavingsPercent: Math.min(95, Math.max(82, 86 + Math.floor((r.destinationLat * 5) % 9)))
    };

    if (!destMap.has(id) || r.minDurationMinutes < destMap.get(id).minDurationMinutes) {
      destMap.set(id, item);
    }
  }

  // 2. Connect to all other European Hubs (Direct or 1-Transfer)
  for (const destHub of HUBS) {
    if (destHub.id === originHub.id) continue;
    const id = destHub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (destMap.has(id)) continue; // Already covered directly

    const distKm = calculateDistance(originHub.lat, originHub.lon, destHub.lat, destHub.lon);

    // Direct check across all aliases
    const direct = findDirectRoute(originHub, destHub);
    if (direct) {
      const price = Math.max(15, Math.round(distKm * 0.11 + 9));
      destMap.set(id, {
        id: `${originHub.id}_${destHub.id}`,
        destinationName: destHub.name,
        stationName: direct.destination,
        destinationCountry: destHub.country,
        originName: originHub.name,
        category: inferCategory(destHub.name),
        tripType: direct.minDurationMinutes <= 120 ? 'Day Trip' : (direct.minDurationMinutes <= 270 ? 'Weekend Break' : 'Grand Rail'),
        travelRing: direct.minDurationMinutes <= 120 ? 'day_trip' : (direct.minDurationMinutes <= 270 ? 'weekend' : 'extended'),
        description: `Direct high-speed connection from ${originHub.name} to ${destHub.name}.`,
        location: { lat: destHub.lat, lng: destHub.lon },
        duration: direct.fastestDuration,
        minDurationMinutes: direct.minDurationMinutes,
        price: price,
        transfers: 0,
        isDirect: true,
        trainOperator: direct.trainTypes.slice(0, 3).join(', '),
        frequency: `${direct.tripCount} direct trips daily`,
        scenicRating: 4,
        scenicHighlight: `Direct railway connection on ${direct.trainTypes[0] || 'ICE'}.`,
        co2Kg: Math.round(distKm * 0.035),
        co2SavingsPercent: Math.min(95, Math.max(82, 86 + Math.floor((destHub.lat * 5) % 8)))
      });
      continue;
    }

    // 1-Transfer Check via Transfer Hubs
    let bestTransfer = null;
    for (const hub of TRANSFER_HUBS) {
      if (hub.id === originHub.id || hub.id === destHub.id) continue;
      const leg1 = findDirectRoute(originHub, hub);
      const leg2 = findDirectRoute(hub, destHub);

      if (leg1 && leg2) {
        const totalMinutes = leg1.minDurationMinutes + 25 + leg2.minDurationMinutes;
        if (!bestTransfer || totalMinutes < bestTransfer.totalMinutes) {
          bestTransfer = { hubName: hub.name, totalMinutes, leg1, leg2 };
        }
      }
    }

    if (bestTransfer) {
      const price = Math.max(19, Math.round(distKm * 0.12 + 12));
      const op1 = bestTransfer.leg1.trainTypes[0] || 'ICE';
      const op2 = bestTransfer.leg2.trainTypes[0] || 'ICE';
      destMap.set(id, {
        id: `${originHub.id}_${destHub.id}`,
        destinationName: destHub.name,
        stationName: `${destHub.name} (via ${bestTransfer.hubName})`,
        destinationCountry: destHub.country,
        originName: originHub.name,
        category: inferCategory(destHub.name),
        tripType: bestTransfer.totalMinutes <= 150 ? 'Day Trip' : (bestTransfer.totalMinutes <= 300 ? 'Weekend Break' : 'Grand Rail'),
        travelRing: bestTransfer.totalMinutes <= 150 ? 'day_trip' : (bestTransfer.totalMinutes <= 300 ? 'weekend' : 'extended'),
        description: `Smooth 1-transfer train journey from ${originHub.name} to ${destHub.name} via ${bestTransfer.hubName}.`,
        location: { lat: destHub.lat, lng: destHub.lon },
        duration: formatMinutes(bestTransfer.totalMinutes),
        minDurationMinutes: bestTransfer.totalMinutes,
        price: price,
        transfers: 1,
        isDirect: false,
        transferStation: bestTransfer.hubName,
        trainOperator: `${op1} ➔ ${op2}`,
        frequency: `Hourly connection (via ${bestTransfer.hubName})`,
        scenicRating: 4,
        scenicHighlight: `Scenic transfer route via ${bestTransfer.hubName}.`,
        co2Kg: Math.round(distKm * 0.035),
        co2SavingsPercent: Math.min(94, Math.max(80, 84 + Math.floor((destHub.lat * 4) % 8)))
      });
    }
  }

  let rawList = Array.from(destMap.values());
  
  // Apply spatial deduplication (keeps best connection when two stations are within 8km)
  let dedupedList = deduplicateDestinations(rawList);

  // Sort by travel appeal: shortest journeys first, then by price
  dedupedList.sort((a, b) => a.minDurationMinutes - b.minDurationMinutes);

  // Cap at max destinations per origin
  if (dedupedList.length > MAX_DESTINATIONS_PER_ORIGIN) {
    dedupedList = dedupedList.slice(0, MAX_DESTINATIONS_PER_ORIGIN);
  }

  const list = dedupedList.map((d, index) => ({
    ...d,
    imageUrl: photoCollection[index % photoCollection.length],
    outboundDate: 'Apr 7',
    returnDate: d.tripType === 'Day Trip' ? 'Apr 7' : 'Apr 11',
    weather: [
      { date: 'Apr 7', temp: 16, condition: 'sunny' },
      { date: 'Apr 8', temp: 18, condition: 'sunny' },
      { date: 'Apr 9', temp: 15, condition: 'cloudy' }
    ]
  }));

  networkByOrigin[originHub.name.toLowerCase()] = list;
  networkByOrigin[originHub.id] = list;

  const filtered = rawList.length - dedupedList.length;
  console.log(`  • ${originHub.name.padEnd(14)}: ${list.length} destinations (${list.filter(d => d.isDirect).length} direct, ${list.filter(d => !d.isDirect).length} connecting) [${filtered} duplicates removed]`);
}

const outPath = path.resolve(__dirname, '../data/multi_origin_rail_network.json');
fs.writeFileSync(outPath, JSON.stringify({
  hubs: HUBS.map(h => ({ id: h.id, name: h.name, country: h.country, lat: h.lat, lng: h.lon })),
  networkByOrigin
}, null, 2));

console.log(`\n🎉 Successfully exported complete multi-origin European rail network to: ${outPath}`);

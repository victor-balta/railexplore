import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawGtfsPath = path.resolve(__dirname, '../data/berlin_direct_destinations.json');
const rawDestinations = JSON.parse(fs.readFileSync(rawGtfsPath, 'utf8'));

// Helper to determine category
function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('sylt') || lower.includes('ostsee') || lower.includes('nordsee') || lower.includes('warnemünde') || lower.includes('rostock') || lower.includes('stralsund') || lower.includes('rügen') || lower.includes('usedom') || lower.includes('binz')) {
    return 'Beaches';
  }
  if (lower.includes('schweiz') || lower.includes('harz') || lower.includes('schandau') || lower.includes('thüringen') || lower.includes('alpen') || lower.includes('innsbruck') || lower.includes('salzburg')) {
    return 'Mountain';
  }
  if (lower.includes('schwerin') || lower.includes('see') || lower.includes('spreewald') || lower.includes('plau') || lower.includes('müritz') || lower.includes('zurich')) {
    return 'Lakeside';
  }
  if (lower.includes('wittenberg') || lower.includes('weimar') || lower.includes('erfurt') || lower.includes('potsdam') || lower.includes('dresden') || lower.includes('nürnberg') || lower.includes('prag') || lower.includes('praha') || lower.includes('wien') || lower.includes('wroclaw') || lower.includes('krakow') || lower.includes('bamberg') || lower.includes('quedlinburg') || lower.includes('goslar')) {
    return 'Historical';
  }
  if (lower.includes('paris') || lower.includes('verona') || lower.includes('venice') || lower.includes('bruges') || lower.includes('florence')) {
    return 'Romantic';
  }
  if (lower.includes('wald') || lower.includes('natur') || lower.includes('park') || lower.includes('nationalpark') || lower.includes('biosphäre')) {
    return 'Nature';
  }
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

// Clean display names
function cleanCityName(name) {
  return name
    .replace(/\s*Hauptbahnhof/i, ' Hbf')
    .replace(/\s*Bahnhof/i, '')
    .replace(/,\s*Hbf/i, ' Hbf')
    .replace(/,\s*Bahnhof/i, '')
    .replace(/\s*\(.*\)/g, '')
    .trim();
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

const enrichedDestinations = rawDestinations.map((d, index) => {
  const cleanName = cleanCityName(d.destination);
  const country = inferCountry(d.destination);
  const category = inferCategory(d.destination);
  const id = d.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const operatorString = d.trainTypes.slice(0, 3).join(', ');
  const freqString = d.dailyDepartures > 1 
    ? `${d.dailyDepartures} direct departures daily` 
    : 'Direct service';

  const co2Savings = Math.min(96, Math.max(82, 86 + Math.floor((d.location.lat * 5) % 9)));
  const img = photoCollection[index % photoCollection.length];

  return {
    id: id,
    destinationName: cleanName,
    stationName: d.stationName,
    destinationCountry: country,
    originName: 'Berlin',
    category: category,
    tripType: d.tripType,
    travelRing: d.travelRing,
    description: `Direct train journey from ${d.originStation} to ${d.stationName} in ${d.duration}.`,
    location: d.location,
    duration: d.duration,
    price: d.estimatedPrice,
    imageUrl: img,
    outboundDate: 'Apr 7',
    returnDate: d.tripType === 'Day Trip' ? 'Apr 7' : 'Apr 11',
    trainOperator: operatorString,
    transfers: 0,
    frequency: freqString,
    scenicRating: Math.floor(Math.random() * 2) + 4,
    scenicHighlight: `Direct railway connection on ${operatorString} through regional landscapes.`,
    co2Kg: Math.round(d.distanceKm * 0.035),
    co2SavingsPercent: co2Savings,
    weather: [
      { date: 'Apr 7', temp: 16, condition: 'sunny' },
      { date: 'Apr 8', temp: 18, condition: 'sunny' },
      { date: 'Apr 9', temp: 15, condition: 'cloudy' }
    ]
  };
});

// Output clean JS/JSON export
const outPath = path.resolve(__dirname, '../data/enriched_gtfs_destinations.json');
fs.writeFileSync(outPath, JSON.stringify(enrichedDestinations, null, 2));
console.log(`✅ Created enriched dataset with ${enrichedDestinations.length} destinations at ${outPath}`);

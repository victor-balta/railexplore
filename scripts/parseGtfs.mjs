import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '../data/gtfs');

function parseTimeStringToMinutes(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length < 2) return null;
  const hours = parts[0];
  const minutes = parts[1];
  return hours * 60 + minutes;
}

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

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

function normalizeStationName(name) {
  if (!name) return '';
  return name
    .replace(/^"|"$/g, '')
    .replace(/, /g, ' ')
    .replace(/\s*\(tief\)/i, '')
    .replace(/\s*\(S\)/i, '')
    .replace(/\s*\(Gr\)/i, '')
    .trim();
}

async function loadStops(stopsFile) {
  const stops = new Map();
  const fileStream = fs.createReadStream(stopsFile, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headerMap = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    if (!headerMap) {
      headerMap = {};
      parts.forEach((col, idx) => {
        headerMap[col.trim()] = idx;
      });
      continue;
    }

    const stopId = parts[headerMap['stop_id']]?.trim();
    const stopName = parts[headerMap['stop_name']]?.trim();
    const parentStation = parts[headerMap['parent_station']]?.trim();
    const lat = parseFloat(parts[headerMap['stop_lat']]);
    const lon = parseFloat(parts[headerMap['stop_lon']]);

    if (stopId) {
      stops.set(stopId, {
        id: stopId,
        name: normalizeStationName(stopName),
        parentStation: parentStation || null,
        lat,
        lon
      });
    }
  }

  return stops;
}

async function loadRoutes(routesFile) {
  const routes = new Map();
  const fileStream = fs.createReadStream(routesFile, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headerMap = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (!headerMap) {
      headerMap = {};
      parts.forEach((col, idx) => {
        headerMap[col.trim()] = idx;
      });
      continue;
    }

    const routeId = parts[headerMap['route_id']]?.trim();
    const routeShortName = parts[headerMap['route_short_name']]?.trim() || '';
    const routeLongName = parts[headerMap['route_long_name']]?.trim() || '';

    if (routeId) {
      routes.set(routeId, {
        id: routeId,
        shortName: routeShortName,
        longName: routeLongName
      });
    }
  }

  return routes;
}

async function loadTrips(tripsFile) {
  const trips = new Map();
  const fileStream = fs.createReadStream(tripsFile, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headerMap = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (!headerMap) {
      headerMap = {};
      parts.forEach((col, idx) => {
        headerMap[col.trim()] = idx;
      });
      continue;
    }

    const tripId = parts[headerMap['trip_id']]?.trim();
    const routeId = parts[headerMap['route_id']]?.trim();

    if (tripId) {
      trips.set(tripId, { routeId });
    }
  }

  return trips;
}

async function processGtfsFolder(folderName) {
  const folderPath = path.join(BASE_DIR, folderName);
  console.log(`\n📦 Processing GTFS feed: ${folderName}...`);

  const stopsFile = path.join(folderPath, 'stops.txt');
  const routesFile = path.join(folderPath, 'routes.txt');
  const tripsFile = path.join(folderPath, 'trips.txt');
  const stopTimesFile = path.join(folderPath, 'stop_times.txt');

  if (!fs.existsSync(stopTimesFile)) {
    console.log(`⚠️ stop_times.txt missing in ${folderPath}`);
    return [];
  }

  const stops = await loadStops(stopsFile);
  const routes = await loadRoutes(routesFile);
  const trips = await loadTrips(tripsFile);

  console.log(`   Loaded ${stops.size} stops, ${routes.size} routes, ${trips.size} trips.`);

  console.log(`   Parsing stop_times.txt (streaming)...`);
  const tripStopTimes = new Map();

  const fileStream = fs.createReadStream(stopTimesFile, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headerMap = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (!headerMap) {
      headerMap = {};
      parts.forEach((col, idx) => {
        headerMap[col.trim()] = idx;
      });
      continue;
    }

    const tripId = parts[headerMap['trip_id']]?.trim();
    const stopId = parts[headerMap['stop_id']]?.trim();
    const arrStr = parts[headerMap['arrival_time']]?.trim();
    const depStr = parts[headerMap['departure_time']]?.trim();
    const seq = parseInt(parts[headerMap['stop_sequence']], 10);

    if (!tripId || !stopId) continue;

    if (!tripStopTimes.has(tripId)) {
      tripStopTimes.set(tripId, []);
    }

    const depMins = parseTimeStringToMinutes(depStr);
    const arrMins = parseTimeStringToMinutes(arrStr);

    tripStopTimes.get(tripId).push({
      stopId,
      sequence: seq,
      depMins,
      arrMins
    });
  }

  console.log(`   Indexed ${tripStopTimes.size} scheduled trips. Extracting direct route pairs...`);

  const directRoutes = new Map();

  for (const [tripId, stopList] of tripStopTimes) {
    stopList.sort((a, b) => a.sequence - b.sequence);

    const tripInfo = trips.get(tripId);
    const routeInfo = tripInfo ? routes.get(tripInfo.routeId) : null;
    const trainType = routeInfo?.shortName || routeInfo?.longName || (folderName === 'long-distance' ? 'ICE/IC' : 'Regional');

    for (let i = 0; i < stopList.length; i++) {
      const origStopData = stopList[i];
      const origStop = stops.get(origStopData.stopId);
      if (!origStop || !origStop.name) continue;

      for (let j = i + 1; j < stopList.length; j++) {
        const destStopData = stopList[j];
        const destStop = stops.get(destStopData.stopId);
        if (!destStop || !destStop.name) continue;

        const origName = origStop.name;
        const destName = destStop.name;

        if (origName === destName) continue;

        let durationMins = destStopData.arrMins - origStopData.depMins;
        if (durationMins < 0) durationMins += 24 * 60;

        if (durationMins <= 0 || durationMins > 24 * 60) continue;

        const pairKey = `${origName}__${destName}`;

        if (!directRoutes.has(pairKey)) {
          directRoutes.set(pairKey, {
            origin: origName,
            originLat: origStop.lat,
            originLon: origStop.lon,
            destination: destName,
            destinationLat: destStop.lat,
            destinationLon: destStop.lon,
            minDurationMinutes: durationMins,
            fastestDuration: formatMinutes(durationMins),
            trainTypes: new Set([trainType]),
            tripCount: 1,
            category: folderName
          });
        } else {
          const entry = directRoutes.get(pairKey);
          entry.tripCount += 1;
          entry.trainTypes.add(trainType);
          if (durationMins < entry.minDurationMinutes) {
            entry.minDurationMinutes = durationMins;
            entry.fastestDuration = formatMinutes(durationMins);
          }
        }
      }
    }
  }

  const results = Array.from(directRoutes.values()).map(r => ({
    ...r,
    trainTypes: Array.from(r.trainTypes)
  }));

  console.log(`   Found ${results.length} direct route pairs in ${folderName}.`);
  return results;
}

async function main() {
  console.log('🚀 Starting European GTFS Railway Parser...');
  
  const longDistRoutes = await processGtfsFolder('long-distance');
  const regionalRoutes = await processGtfsFolder('regional');

  const allRoutesMap = new Map();

  for (const r of [...longDistRoutes, ...regionalRoutes]) {
    const key = `${r.origin}__${r.destination}`;
    if (!allRoutesMap.has(key)) {
      allRoutesMap.set(key, r);
    } else {
      const existing = allRoutesMap.get(key);
      existing.tripCount += r.tripCount;
      r.trainTypes.forEach(t => {
        if (!existing.trainTypes.includes(t)) existing.trainTypes.push(t);
      });
      if (r.minDurationMinutes < existing.minDurationMinutes) {
        existing.minDurationMinutes = r.minDurationMinutes;
        existing.fastestDuration = r.fastestDuration;
      }
    }
  }

  const allRoutes = Array.from(allRoutesMap.values());
  console.log(`\n🎉 Total combined unique direct train routes across Germany & Europe: ${allRoutes.length}`);

  const BERLIN_CENTER = { lat: 52.5200, lon: 13.4050 };
  const berlinOrigins = ['Berlin Hbf', 'Berlin Ostbahnhof', 'Berlin Südkreuz', 'Berlin Gesundbrunnen', 'Berlin-Spandau', 'Berlin Zoologischer Garten', 'Berlin-Lichtenberg', 'Berlin Ostkreuz', 'Berlin Alexanderplatz'];
  
  const berlinDirectRoutes = allRoutes.filter(r => 
    berlinOrigins.some(b => r.origin.toLowerCase() === b.toLowerCase())
  );

  const destinationMap = new Map();

  for (const r of berlinDirectRoutes) {
    const destName = r.destination;
    
    // Filter out intra-Berlin stations (within 18km of center)
    const distFromCenter = calculateDistance(BERLIN_CENTER.lat, BERLIN_CENTER.lon, r.destinationLat, r.destinationLon);
    if (distFromCenter < 18) continue;
    if (destName.toLowerCase().startsWith('berlin')) continue;

    // Estimate price baseline (distance * €0.10 + €8)
    const estimatedPrice = Math.max(7, Math.round(distFromCenter * 0.10 + 8));

    // Determine travel ring
    let travelRing = 'day_trip';
    let tripType = 'Day Trip';
    if (r.minDurationMinutes > 300) {
      travelRing = 'extended';
      tripType = 'Grand Rail';
    } else if (r.minDurationMinutes > 120) {
      travelRing = 'weekend';
      tripType = 'Weekend Break';
    }

    const item = {
      destination: destName,
      stationName: destName,
      location: { lat: r.destinationLat, lng: r.destinationLon },
      distanceKm: Math.round(distFromCenter),
      minDurationMinutes: r.minDurationMinutes,
      duration: r.fastestDuration,
      estimatedPrice: estimatedPrice,
      tripType: tripType,
      travelRing: travelRing,
      trainTypes: r.trainTypes,
      dailyDepartures: r.tripCount,
      originStation: r.origin
    };

    if (!destinationMap.has(destName) || r.minDurationMinutes < destinationMap.get(destName).minDurationMinutes) {
      destinationMap.set(destName, item);
    }
  }

  const travelDestinations = Array.from(destinationMap.values());
  travelDestinations.sort((a, b) => a.minDurationMinutes - b.minDurationMinutes);

  console.log(`\n🇩🇪 Direct getaway destinations outside Berlin: ${travelDestinations.length}`);
  
  console.log('\n--- 🌲 Sample Day Trips (< 2h) ---');
  travelDestinations.filter(d => d.travelRing === 'day_trip').slice(0, 8).forEach(d => {
    console.log(`  • ${d.destination.padEnd(25)} | ${d.duration.padEnd(8)} | ~$${d.estimatedPrice} | ${d.trainTypes.slice(0, 3).join(', ')}`);
  });

  console.log('\n--- 🏙️ Sample Weekend Breaks (2h - 5h) ---');
  travelDestinations.filter(d => d.travelRing === 'weekend').slice(0, 8).forEach(d => {
    console.log(`  • ${d.destination.padEnd(25)} | ${d.duration.padEnd(8)} | ~$${d.estimatedPrice} | ${d.trainTypes.slice(0, 3).join(', ')}`);
  });

  console.log('\n--- 🚆 Sample Extended / Grand Rail (5h+) ---');
  travelDestinations.filter(d => d.travelRing === 'extended').slice(0, 8).forEach(d => {
    console.log(`  • ${d.destination.padEnd(25)} | ${d.duration.padEnd(8)} | ~$${d.estimatedPrice} | ${d.trainTypes.slice(0, 3).join(', ')}`);
  });

  const outDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const berlinOutFile = path.join(outDir, 'berlin_direct_destinations.json');
  fs.writeFileSync(berlinOutFile, JSON.stringify(travelDestinations, null, 2));

  console.log(`\n💾 Saved ${travelDestinations.length} direct travel destinations to: ${berlinOutFile}`);
}

main().catch(err => {
  console.error('❌ Error parsing GTFS:', err);
});

import React, { useEffect, useRef } from 'react';
import { TrainDeal } from '../types';
import { BERLIN_COORDS } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const L: any;

interface ItineraryMapProps {
  destinations: TrainDeal[];
}

const ItineraryMap: React.FC<ItineraryMapProps> = ({ destinations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // Disable scroll zoom so it doesn't interfere with page scrolling
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear existing layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const points = [
      [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
      ...destinations.map(d => [d.location.lat, d.location.lng])
    ];

    // Draw route line
    L.polyline(points, { color: '#16a34a', weight: 4, dashArray: '8, 8', opacity: 0.8, lineCap: 'round' }).addTo(map);

    // Draw origin marker (Berlin)
    const originIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #1e293b; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    L.marker([BERLIN_COORDS.lat, BERLIN_COORDS.lng], { icon: originIcon }).addTo(map);

    // Draw destination markers
    destinations.forEach((dest, i) => {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #2563eb; color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; font-family: sans-serif;">${i + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([dest.location.lat, dest.location.lng], { icon }).addTo(map);
    });

    // Fit map to show all points with some padding
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [destinations]);

  return <div ref={mapRef} className="w-full h-full z-0 outline-none bg-slate-100"></div>;
};

export default ItineraryMap;

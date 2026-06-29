<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { TrainDeal } from '../types';
import { BERLIN_COORDS } from '../constants';

// Leaflet is loaded from a CDN globally in index.html
declare const L: any;

const props = defineProps<{
  destinations: TrainDeal[];
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: any = null;
let markersLayer: any = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  // Initial draw
  drawRoute();

  // Handle dynamic size changes
  resizeObserver = new ResizeObserver(() => {
    if (map) {
      map.invalidateSize();
      // Refit bounds after container size recalculates
      const points = [
        [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
        ...props.destinations.map(d => [d.location.lat, d.location.lng])
      ];
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  });
  resizeObserver.observe(mapContainer.value);
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (map) {
    map.remove();
    map = null;
  }
});

const drawRoute = () => {
  if (!map || !markersLayer) return;

  // Clear existing markers/polyline
  markersLayer.clearLayers();

  const points = [
    [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
    ...props.destinations.map(d => [d.location.lat, d.location.lng])
  ];

  // Draw route line
  L.polyline(points, { color: '#16a34a', weight: 4, dashArray: '8, 8', opacity: 0.8, lineCap: 'round' }).addTo(markersLayer);

  // Draw origin marker (Berlin)
  const originIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #1e293b; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  L.marker([BERLIN_COORDS.lat, BERLIN_COORDS.lng], { icon: originIcon }).addTo(markersLayer);

  // Draw destination markers
  props.destinations.forEach((dest, i) => {
    // If it's a dummy return-to-origin entry, skip or draw differently
    if (dest.id === 'return-origin') return;
    
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #2563eb; color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; font-family: sans-serif;">${i + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker([dest.location.lat, dest.location.lng], { icon }).addTo(markersLayer);
  });

  // Fit map to show all points with some padding
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, { padding: [50, 50] });
};

watch(() => props.destinations, () => {
  drawRoute();
}, { deep: true });
</script>

<template>
  <div ref="mapContainer" class="w-full h-full z-0 outline-none bg-slate-100"></div>
</template>

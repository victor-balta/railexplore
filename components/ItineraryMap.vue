<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { TrainDeal } from '../types';
import { BERLIN_COORDS, getOriginCoordinates } from '../constants';

// Leaflet is loaded from a CDN globally in index.html
declare const L: any;

const props = defineProps<{
  destinations: TrainDeal[];
  originCoords?: { lat: number; lng: number };
  originName?: string;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: any = null;
let markersLayer: any = null;
let resizeObserver: ResizeObserver | null = null;

const getEffectiveOriginLocation = () => {
  if (props.originCoords && props.originCoords.lat && props.originCoords.lng) {
    return props.originCoords;
  }
  if (props.originName) {
    return getOriginCoordinates(props.originName);
  }
  return BERLIN_COORDS;
};

onMounted(() => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
  });

  // MapTiler Basic (OpenStreetMap data with clean, modern MapTiler Basic styling)
  L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
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
      const originLocation = getEffectiveOriginLocation();
      const points = [
        [originLocation.lat, originLocation.lng],
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

  const originLocation = getEffectiveOriginLocation();
  const points = [
    [originLocation.lat, originLocation.lng],
    ...props.destinations.map(d => [d.location.lat, d.location.lng])
  ];

  // Draw route line
  L.polyline(points, { color: '#01879C', weight: 4, dashArray: '6, 6', opacity: 0.9, lineCap: 'round' }).addTo(markersLayer);

  // Draw origin marker
  const originIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #01306A; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.35);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
  L.marker([originLocation.lat, originLocation.lng], { icon: originIcon }).addTo(markersLayer);

  // Draw destination markers
  props.destinations.forEach((dest, i) => {
    if (dest.id === 'return-origin') return;
    
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #01879C; color: white; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; font-family: sans-serif;">${i + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker([dest.location.lat, dest.location.lng], { icon }).addTo(markersLayer);
  });

  // Fit map to show all points with some padding
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, { padding: [50, 50] });
};

watch([() => props.destinations, () => props.originCoords, () => props.originName], () => {
  drawRoute();
}, { deep: true });
</script>

<template>
  <div ref="mapContainer" class="w-full h-full z-0 outline-none bg-slate-100"></div>
</template>

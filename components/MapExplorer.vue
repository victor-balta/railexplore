<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { CategoryType, TrainDeal, FilterState } from '../types';
import { BERLIN_COORDS } from '../constants';
import { 
  Clock, Euro, Mountain, Heart, Tent, Palmtree, Castle, Snowflake, Building2, Trees, Sparkles, ChevronLeft, ChevronRight, Train
} from '@lucide/vue';

declare const L: any;

const props = defineProps<{
  destinations: TrainDeal[];
  selectedDestination: TrainDeal | null;
  selectedCategory: CategoryType | 'All';
  filters: FilterState;
  itineraryDestinations: TrainDeal[];
}>();

const emit = defineEmits<{
  (e: 'select-destination', dest: TrainDeal): void;
  (e: 'select-category', cat: CategoryType | 'All'): void;
  (e: 'update-filters', filters: FilterState): void;
}>();

const categories = [
  { type: CategoryType.Anywhere, icon: Train, label: 'Anywhere' },
  { type: CategoryType.City, icon: Building2, label: 'City Break' },
  { type: CategoryType.Historical, icon: Castle, label: 'Historical' },
  { type: CategoryType.Nature, icon: Trees, label: 'Nature' },
  { type: CategoryType.Mountains, icon: Mountain, label: 'Mountain' },
  { type: CategoryType.Skiing, icon: Snowflake, label: 'Skiing' },
  { type: CategoryType.Lakeside, icon: Tent, label: 'Lakeside' },
  { type: CategoryType.Beaches, icon: Palmtree, label: 'Beaches' },
  { type: CategoryType.Romantic, icon: Heart, label: 'Romantic' },
  { type: CategoryType.Wellness, icon: Sparkles, label: 'Wellness' },
];

const activeFilter = ref<'price' | 'duration' | null>(null);
const mapZoom = ref(4);
const mapBounds = ref<any>(null);
const mapRef = ref<HTMLDivElement | null>(null);
let mapInstance: any = null;
let markersLayer: any = null;
let resizeObserver: ResizeObserver | null = null;

// Scroll Logic for Categories
const categoriesRef = ref<HTMLDivElement | null>(null);
const showLeftScroll = ref(false);
const showRightScroll = ref(true);

const checkScroll = () => {
  if (!categoriesRef.value) return;
  const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.value;
  showLeftScroll.value = scrollLeft > 10;
  showRightScroll.value = scrollLeft < scrollWidth - clientWidth - 10;
};

const scrollCategories = (direction: 'left' | 'right') => {
  if (categoriesRef.value) {
    const scrollAmount = 300;
    categoriesRef.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
};

onMounted(() => {
  checkScroll();
  window.addEventListener('resize', checkScroll);

  if (!mapRef.value) return;

  mapInstance = L.map(mapRef.value, {
    center: [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
    zoom: 4,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapInstance);

  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // Custom Berlin Marker
  const berlinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #1a73e8; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  L.marker([BERLIN_COORDS.lat, BERLIN_COORDS.lng], { icon: berlinIcon, interactive: false }).addTo(mapInstance);

  mapInstance.on('moveend', () => {
    mapZoom.value = mapInstance.getZoom();
    mapBounds.value = mapInstance.getBounds();
  });

  // Set initial state
  mapZoom.value = mapInstance.getZoom();
  mapBounds.value = mapInstance.getBounds();

  markersLayer = L.layerGroup().addTo(mapInstance);

  updateMarkers();

  // ResizeObserver to trigger Leaflet size recalcs on layout flexes
  resizeObserver = new ResizeObserver(() => {
    if (mapInstance) {
      mapInstance.invalidateSize();
      mapBounds.value = mapInstance.getBounds();
    }
  });
  resizeObserver.observe(mapRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScroll);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});

const updateMarkers = () => {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();

  let visibleDestinations = [...props.destinations];

  // Filter by bounds if available
  if (mapBounds.value) {
    visibleDestinations = visibleDestinations.filter(dest => {
      return mapBounds.value.contains(L.latLng(dest.location.lat, dest.location.lng));
    });
  }

  // Determine max markers based on zoom level
  let maxMarkers = 100;
  if (mapZoom.value <= 4) maxMarkers = 15;
  else if (mapZoom.value === 5) maxMarkers = 30;
  else if (mapZoom.value === 6) maxMarkers = 50;
  else if (mapZoom.value >= 7) maxMarkers = 100;

  visibleDestinations = visibleDestinations.slice(0, maxMarkers);

  // Always ensure the selected destination is visible
  if (props.selectedDestination && !visibleDestinations.find(d => d.id === props.selectedDestination!.id)) {
    visibleDestinations.push(props.selectedDestination);
  }

  // Always ensure itinerary destinations are visible
  props.itineraryDestinations.forEach(d => {
    if (!visibleDestinations.find(vd => vd.id === d.id)) {
      visibleDestinations.push(d);
    }
  });

  // Draw the itinerary polyline
  if (props.itineraryDestinations.length > 0) {
    const routeLatLngs = [
      [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
      ...props.itineraryDestinations.map(d => [d.location.lat, d.location.lng])
    ];
    L.polyline(routeLatLngs, { color: '#16a34a', weight: 3, dashArray: '6, 6', opacity: 0.8, lineCap: 'round' }).addTo(markersLayer);
  }

  visibleDestinations.forEach(dest => {
    const isSelected = props.selectedDestination?.id === dest.id;
    const isInItinerary = props.itineraryDestinations.some(d => d.id === dest.id);
    
    let markerBg = 'bg-white text-slate-800 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200';
    if (isSelected) markerBg = 'bg-blue-600 text-white border-blue-700';
    else if (isInItinerary) markerBg = 'bg-green-600 text-white border-green-700';

    const html = `
      <div class="group relative flex flex-col items-center justify-center transition-all duration-300 ${isSelected || isInItinerary ? 'z-50 scale-110' : 'z-10 hover:z-20 hover:scale-110'}">
         <div class="
            flex items-center gap-1 px-3 py-1.5 rounded-full shadow-md border cursor-pointer font-sans transition-all
            ${markerBg}
         ">
           <span class="text-sm font-bold whitespace-nowrap">$${dest.price}</span>
         </div>
      </div>
    `;

    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: html,
      iconSize: [60, 30],
      iconAnchor: [30, 15]
    });

    const marker = L.marker([dest.location.lat, dest.location.lng], { icon }).addTo(markersLayer);
    
    marker.on('click', () => {
      emit('select-destination', dest);
      mapInstance.flyTo([dest.location.lat, dest.location.lng], 6, { duration: 1.2 });
    });

    if (isSelected && !isInItinerary) {
      const lastPoint = props.itineraryDestinations.length > 0 
        ? props.itineraryDestinations[props.itineraryDestinations.length - 1].location 
        : BERLIN_COORDS;
      const latlngs = [[lastPoint.lat, lastPoint.lng], [dest.location.lat, dest.location.lng]];
      L.polyline(latlngs, { color: '#1a73e8', weight: 2, dashArray: '4, 8', opacity: 0.6, lineCap: 'round' }).addTo(markersLayer);
    }
  });
};

watch(() => props.selectedDestination, (newDest) => {
  if (newDest && mapInstance) {
    mapInstance.flyTo([newDest.location.lat, newDest.location.lng], 6, { duration: 1.2 });
  }
});

watch([
  () => props.destinations,
  () => props.selectedDestination,
  () => mapZoom.value,
  () => mapBounds.value,
  () => props.itineraryDestinations
], () => {
  updateMarkers();
}, { deep: true });

const updateMaxPrice = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update-filters', { ...props.filters, maxPrice: parseInt(target.value) });
};

const updateMaxDuration = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update-filters', { ...props.filters, maxDuration: parseFloat(target.value) });
};
</script>

<template>
  <div class="relative h-full w-full bg-slate-50 group flex-1 flex flex-col">
    
    <!-- Floating UI Container -->
    <div class="absolute top-6 left-1/2 -translate-x-1/2 z-[400] w-full max-w-3xl flex flex-col items-center gap-4 px-4 pointer-events-none">
      
      <!-- 1. Primary Filters (Price & Duration) -->
      <div class="flex items-center gap-2 pointer-events-auto shadow-md rounded-full p-1 bg-white border border-slate-200">
         
         <div class="relative">
            <button 
              @click="activeFilter = activeFilter === 'price' ? null : 'price'"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
              :class="activeFilter === 'price' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'"
            >
              <span>Price: Under ${{ filters.maxPrice }}</span>
            </button>
            
            <div v-if="activeFilter === 'price'" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
               <div class="flex justify-between text-sm font-medium text-slate-700 mb-3">
                   <span>Max Price</span>
                   <span>${{ filters.maxPrice }}</span>
               </div>
               <input 
                  type="range" min="50" max="1000" step="50"
                  :value="filters.maxPrice"
                  @input="updateMaxPrice"
                  class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
         </div>

         <div class="w-px h-6 bg-slate-200"></div>

         <div class="relative">
            <button 
              @click="activeFilter = activeFilter === 'duration' ? null : 'duration'"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
              :class="activeFilter === 'duration' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'"
            >
              <span>Duration: Under {{ filters.maxDuration }}h</span>
            </button>

            <div v-if="activeFilter === 'duration'" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
               <div class="flex justify-between text-sm font-medium text-slate-700 mb-3">
                   <span>Travel Time</span>
                   <span>{{ filters.maxDuration }}h</span>
               </div>
               <input 
                  type="range" min="1" max="24" step="1"
                  :value="filters.maxDuration"
                  @input="updateMaxDuration"
                  class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
         </div>

      </div>

      <!-- 2. Categories Scroll Bar -->
      <div class="relative w-full max-w-xl pointer-events-auto group/cat">
          
          <button 
              @click="scrollCategories('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 p-1.5 rounded-full bg-white shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200"
              :class="showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
              <ChevronLeft :size="16" />
          </button>

          <div 
              ref="categoriesRef" 
              @scroll="checkScroll"
              class="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-2 mx-1 scroll-smooth"
          >
              <button
                  v-for="cat in categories"
                  :key="cat.label"
                  @click="emit('select-category', cat.type)"
                  class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all border"
                  :class="(selectedCategory === cat.type || (selectedCategory === 'All' && cat.type === CategoryType.Anywhere)) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
              >
                  <component :is="cat.icon" :size="16" :class="(selectedCategory === cat.type || (selectedCategory === 'All' && cat.type === CategoryType.Anywhere)) ? 'text-blue-600' : 'text-slate-400'" />
                  {{ cat.label }}
              </button>
          </div>

           <button 
              @click="scrollCategories('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 p-1.5 rounded-full bg-white shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200"
              :class="showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
              <ChevronRight :size="16" />
          </button>
      </div>

    </div>

    <div ref="mapRef" class="w-full flex-1 z-0 outline-none bg-slate-100"></div>
  </div>
</template>

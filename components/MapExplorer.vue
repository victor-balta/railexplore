<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { CategoryType, TrainDeal, FilterState } from '../types';
import { BERLIN_COORDS, EUROPEAN_HUBS, getOriginCoordinates } from '../constants';
import { 
  Clock, Euro, Mountain, Heart, Tent, Palmtree, Castle, Snowflake, 
  Building2, Trees, Sparkles, ChevronLeft, ChevronRight, ChevronDown, 
  ChevronUp, Train, Check, X, SlidersHorizontal, Leaf, Moon, Eye, RotateCcw
} from '@lucide/vue';

declare const L: any;

const props = defineProps<{
  destinations: TrainDeal[];
  selectedDestination: TrainDeal | null;
  selectedCategory: CategoryType | 'All';
  filters: FilterState;
  itineraryDestinations: TrainDeal[];
  originCoords?: { lat: number; lng: number };
  originName?: string;
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

const operatorOptions = [
  { id: 'ice', label: 'High Speed (ICE / TGV / RJ)' },
  { id: 'ic_ec', label: 'InterCity & EuroCity (IC / EC)' },
  { id: 'regional', label: 'Regional (RE / RB / S-Bahn)' },
  { id: 'nightjet', label: 'Night Trains (ÖBB Nightjet)' },
  { id: 'flixtrain', label: 'FlixTrain & Private' }
];

const activeFilter = ref<'stops' | 'price' | 'duration' | 'operators' | 'more' | null>(null);
const mapZoom = ref(4);
const mapBounds = ref<any>(null);
const mapRef = ref<HTMLDivElement | null>(null);
let mapInstance: any = null;
let markersLayer: any = null;
let resizeObserver: ResizeObserver | null = null;

// Active filters count
const activeFilterCount = computed(() => {
  let count = 0;
  if (props.filters.maxPrice < 500) count++;
  if ((props.filters.maxDuration ?? 12) < 12) count++;
  if (props.filters.directOnly) count++;
  if ((props.filters.operators || []).length > 0) count++;
  if (props.filters.scenicOnly) count++;
  if (props.filters.nightTrainOnly) count++;
  if (props.selectedCategory !== 'All' && props.selectedCategory !== CategoryType.Anywhere) count++;
  return count;
});

const toggleOperator = (opId: string) => {
  const current = props.filters.operators ? [...props.filters.operators] : [];
  const idx = current.indexOf(opId);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(opId);
  }
  updateFilterProp('operators', current);
};

const resetAll = () => {
  emit('update-filters', {
    maxDuration: 12,
    maxPrice: 500,
    directOnly: false,
    operators: [],
    selectedOperator: '',
    scenicOnly: false,
    nightTrainOnly: false,
    sortBy: 'best'
  });
  emit('select-category', 'All');
  activeFilter.value = null;
};

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

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.filter-popover-container')) {
    activeFilter.value = null;
  }
};

const toggleFilter = (name: 'stops' | 'price' | 'duration' | 'operators' | 'more') => {
  activeFilter.value = activeFilter.value === name ? null : name;
};

onMounted(() => {
  checkScroll();
  window.addEventListener('resize', checkScroll);
  window.addEventListener('click', handleClickOutside);

  if (!mapRef.value) return;

  const initialCoords = props.originCoords || BERLIN_COORDS;

  mapInstance = L.map(mapRef.value, {
    center: [initialCoords.lat, initialCoords.lng],
    zoom: 5,
    zoomControl: false,
    attributionControl: false
  });

  // MapTiler Basic (OpenStreetMap data with clean, modern MapTiler Basic styling)
  L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 19
  }).addTo(mapInstance);

  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  const handleMapChange = () => {
    if (!mapInstance) return;
    mapZoom.value = mapInstance.getZoom();
    mapBounds.value = mapInstance.getBounds();
    updateMarkers();
  };

  mapInstance.on('click', () => {
    activeFilter.value = null;
  });

  mapInstance.on('moveend', handleMapChange);
  mapInstance.on('zoomend', handleMapChange);
  mapInstance.on('viewreset', handleMapChange);
  mapInstance.on('resize', handleMapChange);

  // Set initial state
  mapZoom.value = mapInstance.getZoom();
  mapBounds.value = mapInstance.getBounds();

  markersLayer = L.layerGroup().addTo(mapInstance);

  setTimeout(() => {
    if (mapInstance) {
      mapInstance.invalidateSize();
      handleMapChange();
    }
  }, 100);

  resizeObserver = new ResizeObserver(() => {
    if (mapInstance) {
      mapInstance.invalidateSize();
      handleMapChange();
    }
  });
  resizeObserver.observe(mapRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScroll);
  window.removeEventListener('click', handleClickOutside);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const intersects = (a: BoundingBox, b: BoundingBox): boolean => {
  return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
};

const updateMarkers = () => {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();

  const currentZoom = mapInstance.getZoom();
  const currentBounds = mapInstance.getBounds();

  // ALWAYS use the prop origin coords or name — never fall back to Berlin unless explicitly set
  const originLocation = props.originCoords && props.originCoords.lat && props.originCoords.lng
    ? props.originCoords
    : (props.originName ? getOriginCoordinates(props.originName) : BERLIN_COORDS);
  const originPoint = mapInstance.latLngToContainerPoint([originLocation.lat, originLocation.lng]);
  
  const placedBoxes: BoundingBox[] = [];

  // 1. Reserve generous bounding box for Origin Pin
  const originW = 56;
  const originH = 56;
  const originMargin = 18;
  placedBoxes.push({
    minX: originPoint.x - (originW / 2) - originMargin,
    minY: originPoint.y - (originH / 2) - originMargin,
    maxX: originPoint.x + (originW / 2) + originMargin,
    maxY: originPoint.y + (originH / 2) + originMargin
  });

  // Draw origin marker — simple pin dot with label, visually distinct from destinations
  const originHtml = `
    <div class="flex flex-col items-center gap-0.5">
      <div class="w-8 h-8 rounded-full bg-[#01306A] border-[3px] border-white shadow-xl flex items-center justify-center ring-2 ring-[#01879C]/50">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
      </div>
      <div class="px-2 py-0.5 rounded-md bg-[#01306A] text-white text-[10px] font-bold tracking-wide shadow-md whitespace-nowrap">
        ${props.originName || 'Origin'}
      </div>
    </div>
  `;
  const originIcon = L.divIcon({ className: 'custom-div-icon', html: originHtml, iconSize: [80, 54], iconAnchor: [40, 27] });
  L.marker([originLocation.lat, originLocation.lng], { icon: originIcon, zIndexOffset: 3000 }).addTo(markersLayer);

  // 2. Draw Itinerary polyline and Waypoint Markers
  if (props.itineraryDestinations.length > 0) {
    const routeLatLngs = [
      [originLocation.lat, originLocation.lng],
      ...props.itineraryDestinations.map(d => [d.location.lat, d.location.lng])
    ];
    L.polyline(routeLatLngs, { color: '#01879C', weight: 3.5, dashArray: '6, 6', opacity: 0.9, lineCap: 'round' }).addTo(markersLayer);

    // Render Waypoint Markers for each Itinerary Stop
    props.itineraryDestinations.forEach((stop, idx) => {
      const stopPoint = mapInstance.latLngToContainerPoint([stop.location.lat, stop.location.lng]);
      const stopW = 64;
      const stopH = 52;
      placedBoxes.push({
        minX: stopPoint.x - (stopW / 2) - 10,
        minY: stopPoint.y - (stopH / 2) - 10,
        maxX: stopPoint.x + (stopW / 2) + 10,
        maxY: stopPoint.y + (stopH / 2) + 10
      });

      const isLastStop = idx === props.itineraryDestinations.length - 1;
      const isReturn = stop.id === 'return-origin';

      const waypointHtml = `
        <div class="flex flex-col items-center gap-0.5 cursor-pointer group">
          <div class="w-7 h-7 rounded-full ${isReturn ? 'bg-[#01306A]' : 'bg-[#01879C]'} border-[2.5px] border-white shadow-xl flex items-center justify-center text-white text-xs font-black ring-2 ${isLastStop ? 'ring-emerald-400' : 'ring-[#01879C]/40'} transition-transform group-hover:scale-110">
            ${isReturn ? '🏁' : (idx + 1)}
          </div>
          <div class="px-2 py-0.5 rounded-md ${isReturn ? 'bg-[#01306A]' : 'bg-[#01879C]'} text-white text-[10px] font-bold tracking-tight shadow-md whitespace-nowrap">
            ${isReturn ? 'Return' : stop.destinationName}
          </div>
        </div>
      `;

      const waypointIcon = L.divIcon({
        className: 'custom-div-icon',
        html: waypointHtml,
        iconSize: [80, 52],
        iconAnchor: [40, 26]
      });

      const waypointMarker = L.marker([stop.location.lat, stop.location.lng], {
        icon: waypointIcon,
        zIndexOffset: 2500
      });

      waypointMarker.on('click', () => {
        emit('select-destination', stop);
      });

      waypointMarker.addTo(markersLayer);
    });
  }

  // 3. Filter destinations within current map bounds
  let candidates = [...props.destinations];
  if (currentBounds) {
    candidates = candidates.filter(dest => {
      return currentBounds.contains(L.latLng(dest.location.lat, dest.location.lng));
    });
  }

  // 4. Calculate Importance Score for hierarchical filtering
  const getScore = (dest: TrainDeal) => {
    if (props.selectedDestination?.id === dest.id) return 5000;
    if (props.itineraryDestinations.some(d => d.id === dest.id)) return 3000;
    
    let score = 50;

    const isHub = EUROPEAN_HUBS.some(h => h.name.toLowerCase() === dest.destinationName.toLowerCase());
    if (isHub) score += 600;

    if (dest.isDirect !== false && dest.transfers === 0) score += 120;

    if (dest.price <= 20) score += 60;
    else if (dest.price <= 35) score += 30;

    if (dest.scenicRating && dest.scenicRating >= 4) score += 40;

    if (dest.destinationName.includes('Hbf') || dest.destinationName.includes('-')) score -= 30;

    return score;
  };

  candidates.sort((a, b) => getScore(b) - getScore(a));

  // Collision parameters
  const pillW = 120;
  const pillH = 32;
  const marginX = currentZoom <= 5 ? 20 : (currentZoom <= 6 ? 16 : 12);
  const marginY = currentZoom <= 5 ? 16 : (currentZoom <= 6 ? 12 : 10);
  const maxPills = currentZoom <= 4 ? 14 : (currentZoom <= 5 ? 22 : (currentZoom <= 6 ? 32 : (currentZoom <= 7 ? 48 : 70)));

  const pillsToRender: TrainDeal[] = [];

  for (const dest of candidates) {
    const isSelected = props.selectedDestination?.id === dest.id;
    const isInItinerary = props.itineraryDestinations.some(d => d.id === dest.id);

    const pt = mapInstance.latLngToContainerPoint([dest.location.lat, dest.location.lng]);
    const box: BoundingBox = {
      minX: pt.x - (pillW / 2) - marginX,
      minY: pt.y - (pillH / 2) - marginY,
      maxX: pt.x + (pillW / 2) + marginX,
      maxY: pt.y + (pillH / 2) + marginY
    };

    const hasCollision = placedBoxes.some(b => intersects(box, b));

    if (isSelected || isInItinerary || (!hasCollision && pillsToRender.length < maxPills)) {
      placedBoxes.push(box);
      pillsToRender.push(dest);
    }
  }

  // 5. Render destination pills
  pillsToRender.forEach(dest => {
    const isSelected = props.selectedDestination?.id === dest.id;
    const isInItinerary = props.itineraryDestinations.some(d => d.id === dest.id);
    const isGreatDeal = dest.price <= 25;
    
    let markerClasses = 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-400 hover:shadow-lg shadow-sm';
    let priceClasses = isGreatDeal 
      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60' 
      : 'bg-slate-100 text-slate-900 font-bold';

    if (isSelected) {
      markerClasses = 'bg-[#01306A] text-white border-transparent shadow-xl ring-2 ring-white scale-110';
      priceClasses = 'text-[#01306A] bg-white font-bold';
    } else if (isInItinerary) {
      markerClasses = 'bg-[#01879C] text-white border-transparent shadow-xl ring-2 ring-white scale-110';
      priceClasses = 'text-[#01879C] bg-white font-bold';
    }

    const html = `
      <div class="group relative flex flex-col items-center justify-center transition-transform duration-200 ${isSelected || isInItinerary ? 'z-50' : 'z-10 hover:z-40 hover:scale-105'}">
         <div class="
            flex items-center gap-1.5 px-2.5 py-1 rounded-full border cursor-pointer font-sans transition-all
            ${markerClasses}
         ">
           <span class="text-xs font-semibold whitespace-nowrap truncate max-w-[80px] tracking-tight">${dest.destinationName}</span>
           <span class="text-[11px] px-1.5 py-0.5 rounded-full ${priceClasses}">$${dest.price}</span>
         </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: html,
      iconSize: [120, 32],
      iconAnchor: [60, 16]
    });

    const marker = L.marker([dest.location.lat, dest.location.lng], { 
      icon: customIcon,
      zIndexOffset: isSelected || isInItinerary ? 1000 : 100
    });
    
    marker.on('click', () => {
      emit('select-destination', dest);
      mapInstance.flyTo([dest.location.lat, dest.location.lng], 6, { duration: 1.2 });
    });
    
    marker.addTo(markersLayer);

    // Draw dashed line from last itinerary stop (or origin) to the selected destination
    if (isSelected && !isInItinerary) {
      const lastPoint = props.itineraryDestinations.length > 0 
        ? props.itineraryDestinations[props.itineraryDestinations.length - 1].location 
        : originLocation;
      const latlngs = [[lastPoint.lat, lastPoint.lng], [dest.location.lat, dest.location.lng]];
      L.polyline(latlngs, { color: '#01306A', weight: 2.5, dashArray: '4, 6', opacity: 0.8, lineCap: 'round' }).addTo(markersLayer);
    }
  });
};

watch(() => props.selectedDestination, (newDest) => {
  if (newDest && mapInstance) {
    mapInstance.flyTo([newDest.location.lat, newDest.location.lng], 6, { duration: 1.2 });
  }
});

watch(() => props.originCoords, (newCoords) => {
  if (newCoords && mapInstance) {
    mapInstance.setView([newCoords.lat, newCoords.lng], 5);
    mapBounds.value = mapInstance.getBounds();
    mapZoom.value = mapInstance.getZoom();
  }
  nextTick(() => {
    updateMarkers();
  });
}, { deep: true });

watch(() => props.itineraryDestinations, (newItinerary, oldItinerary) => {
  if (newItinerary && newItinerary.length > 0 && mapInstance) {
    if (!oldItinerary || newItinerary.length > oldItinerary.length) {
      const latestStop = newItinerary[newItinerary.length - 1];
      if (latestStop && latestStop.location && latestStop.id !== 'return-origin') {
        mapInstance.flyTo([latestStop.location.lat, latestStop.location.lng], 6, { duration: 1.0 });
      }
    }
  }
}, { deep: true });

watch([
  () => props.destinations,
  () => props.selectedDestination,
  () => mapZoom.value,
  () => mapBounds.value,
  () => props.itineraryDestinations
], () => {
  updateMarkers();
}, { deep: true });

const updateFilterProp = (key: keyof FilterState, val: any) => {
  emit('update-filters', { ...props.filters, [key]: val });
};
</script>

<template>
  <div class="relative h-full w-full bg-slate-50 group flex-1 flex flex-col">
    
    <!-- Google Flights Style Floating Filter Bar -->
    <div class="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[1200] w-full max-w-4xl flex flex-col items-center gap-2 px-3 pointer-events-none filter-popover-container">
      
      <!-- 1. Multi-Filter Pill Bar (Google Flights Rounded Pills) -->
      <div class="flex items-center gap-1.5 pointer-events-auto shadow-lg rounded-full p-1 bg-white border border-slate-200 max-w-full overflow-x-auto scrollbar-hide">
        
        <!-- Filter: Stops -->
        <div class="relative flex-none">
          <button 
            @click="toggleFilter('stops')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border filter-button"
            :class="filters.directOnly 
              ? 'bg-[#01306A] text-white border-transparent' 
              : activeFilter === 'stops' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'"
          >
            <span>{{ filters.directOnly ? 'Nonstop only' : 'Stops: All' }}</span>
            <ChevronDown :size="12" :class="activeFilter === 'stops' ? 'rotate-180 transition-transform' : ''" />
          </button>

          <!-- Stops Popover -->
          <div 
            v-if="activeFilter === 'stops'"
            class="absolute top-full mt-2 left-0 w-52 bg-white rounded-2xl p-2.5 shadow-2xl border border-slate-200 z-[2200] pointer-events-auto animate-in fade-in zoom-in-95 duration-150 text-xs font-medium space-y-1"
          >
            <div class="font-bold text-slate-900 pb-1 mb-1 border-b border-slate-100 text-xs px-2">
              Train Stops
            </div>
            <button 
              @click="updateFilterProp('directOnly', false); activeFilter = null"
              class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors"
              :class="!filters.directOnly ? 'text-[#01306A] font-bold bg-slate-100' : 'text-slate-700'"
            >
              <span>Any number of stops</span>
              <Check v-if="!filters.directOnly" :size="14" class="text-[#01306A]" />
            </button>
            <button 
              @click="updateFilterProp('directOnly', true); activeFilter = null"
              class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors"
              :class="filters.directOnly ? 'text-[#01306A] font-bold bg-slate-100' : 'text-slate-700'"
            >
              <span>Nonstop only</span>
              <Check v-if="filters.directOnly" :size="14" class="text-[#01306A]" />
            </button>
          </div>
        </div>

        <!-- Filter: Price -->
        <div class="relative flex-none">
          <button 
            @click="toggleFilter('price')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border filter-button"
            :class="filters.maxPrice < 500 
              ? 'bg-[#01306A] text-white border-transparent' 
              : activeFilter === 'price' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'"
          >
            <span>{{ filters.maxPrice < 500 ? `≤ $${filters.maxPrice}` : 'Price: All' }}</span>
            <ChevronDown :size="12" :class="activeFilter === 'price' ? 'rotate-180 transition-transform' : ''" />
          </button>

          <!-- Price Popover -->
          <div 
            v-if="activeFilter === 'price'"
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-64 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-[2200] pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="flex justify-between items-center text-xs font-bold text-slate-900 mb-3">
              <span>Max Ticket Price</span>
              <span class="text-sm font-bold text-[#01306A]">${{ filters.maxPrice }}</span>
            </div>
            
            <!-- Quick Chips -->
            <div class="grid grid-cols-4 gap-1.5 mb-3">
              <button 
                v-for="p in [35, 50, 100, 250]" 
                :key="p"
                @click="updateFilterProp('maxPrice', p)"
                class="py-1 rounded-lg text-xs font-semibold transition-all border text-center"
                :class="filters.maxPrice === p ? 'bg-[#01306A] text-white border-transparent' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'"
              >
                ${{ p }}
              </button>
            </div>

            <input 
              type="range" 
              min="20" 
              max="500" 
              step="5" 
              :value="filters.maxPrice" 
              @input="updateFilterProp('maxPrice', Number(($event.target as HTMLInputElement).value))"
              class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#01306A]"
            />
            
            <div class="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
              <span>$20</span>
              <span>$500+</span>
            </div>
          </div>
        </div>

        <!-- Filter: Duration -->
        <div class="relative flex-none">
          <button 
            @click="toggleFilter('duration')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border filter-button"
            :class="(filters.maxDuration ?? 12) < 12 
              ? 'bg-[#01306A] text-white border-transparent' 
              : activeFilter === 'duration' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'"
          >
            <span>{{ (filters.maxDuration ?? 12) < 12 ? `≤ ${filters.maxDuration}h` : 'Duration: Any' }}</span>
            <ChevronDown :size="12" :class="activeFilter === 'duration' ? 'rotate-180 transition-transform' : ''" />
          </button>

          <!-- Duration Popover -->
          <div 
            v-if="activeFilter === 'duration'"
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-60 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-[2200] pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="flex justify-between items-center text-xs font-bold text-slate-900 mb-3">
              <span>Max Travel Time</span>
              <span class="text-sm font-bold text-[#01306A]">{{ filters.maxDuration ?? 12 }} hours</span>
            </div>
            
            <!-- Quick Chips -->
            <div class="grid grid-cols-3 gap-1.5 mb-3">
              <button 
                v-for="h in [3, 5, 8]" 
                :key="h"
                @click="updateFilterProp('maxDuration', h)"
                class="py-1 rounded-lg text-xs font-semibold transition-all border text-center"
                :class="filters.maxDuration === h ? 'bg-[#01306A] text-white border-transparent' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'"
              >
                &lt; {{ h }}h
              </button>
            </div>

            <input 
              type="range" 
              min="1" 
              max="12" 
              step="0.5" 
              :value="filters.maxDuration ?? 12" 
              @input="updateFilterProp('maxDuration', Number(($event.target as HTMLInputElement).value))"
              class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#01306A]"
            />
            
            <div class="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
              <span>1h</span>
              <span>12h+</span>
            </div>
          </div>
        </div>

        <!-- Filter: Operators -->
        <div class="relative flex-none">
          <button 
            @click="toggleFilter('operators')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border filter-button"
            :class="(filters.operators || []).length > 0 
              ? 'bg-[#01306A] text-white border-transparent' 
              : activeFilter === 'operators' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'"
          >
            <span>{{ (filters.operators || []).length > 0 ? `Operators (${filters.operators!.length})` : 'Operators' }}</span>
            <ChevronDown :size="12" :class="activeFilter === 'operators' ? 'rotate-180 transition-transform' : ''" />
          </button>

          <!-- Operators Popover -->
          <div 
            v-if="activeFilter === 'operators'"
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-56 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 z-[2200] pointer-events-auto animate-in fade-in zoom-in-95 duration-150 text-xs space-y-1"
          >
            <div class="font-bold text-slate-900 pb-1.5 mb-1 border-b border-slate-100 flex justify-between items-center px-1">
              <span>Train Operator</span>
              <button 
                v-if="(filters.operators || []).length > 0"
                @click="updateFilterProp('operators', [])"
                class="text-[10px] text-[#01306A] hover:underline font-semibold"
              >
                Clear
              </button>
            </div>
            <label 
              v-for="op in operatorOptions" 
              :key="op.id"
              class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <span class="text-slate-800 font-medium">{{ op.label }}</span>
              <input 
                type="checkbox" 
                :checked="(filters.operators || []).includes(op.id)" 
                @change="toggleOperator(op.id)"
                class="w-4 h-4 rounded text-[#01306A] focus:ring-[#01306A] accent-[#01306A]"
              />
            </label>
          </div>
        </div>

        <!-- Filter: More (Scenic / Nightjet) -->
        <div class="relative flex-none">
          <button 
            @click="toggleFilter('more')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border filter-button"
            :class="(filters.scenicOnly || filters.nightTrainOnly) 
              ? 'bg-[#01306A] text-white border-transparent' 
              : activeFilter === 'more' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'"
          >
            <span>More</span>
            <ChevronDown :size="12" :class="activeFilter === 'more' ? 'rotate-180 transition-transform' : ''" />
          </button>

          <!-- More Popover -->
          <div 
            v-if="activeFilter === 'more'"
            class="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 z-[2200] pointer-events-auto animate-in fade-in zoom-in-95 duration-150 text-xs space-y-2"
          >
            <div class="font-bold text-slate-900 pb-1 border-b border-slate-100 px-1">
              Special Route Types
            </div>

            <!-- Toggle: Scenic routes -->
            <label class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
              <div class="flex items-center gap-2">
                <span class="text-base">🌄</span>
                <div>
                  <div class="text-xs font-semibold text-slate-800">Scenic routes only</div>
                  <div class="text-[10px] text-slate-400">Panoramic alpine / river views</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                :checked="filters.scenicOnly" 
                @change="updateFilterProp('scenicOnly', !filters.scenicOnly)"
                class="w-4 h-4 rounded text-[#01306A] focus:ring-[#01306A] accent-[#01306A]"
              />
            </label>

            <!-- Toggle: Night trains -->
            <label class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
              <div class="flex items-center gap-2">
                <Moon :size="15" class="text-slate-500" />
                <div>
                  <div class="text-xs font-semibold text-slate-800">Night trains / Sleepers</div>
                  <div class="text-[10px] text-slate-400">ÖBB Nightjet & couchette cars</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                :checked="filters.nightTrainOnly" 
                @change="updateFilterProp('nightTrainOnly', !filters.nightTrainOnly)"
                class="w-4 h-4 rounded text-[#01306A] focus:ring-[#01306A] accent-[#01306A]"
              />
            </label>
          </div>
        </div>

        <!-- Reset Filters Button (When active) -->
        <button 
          v-if="activeFilterCount > 0"
          @click="resetAll"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex-none shadow-xs"
          title="Reset all active filters"
        >
          <RotateCcw :size="11" />
          <span>Reset ({{ activeFilterCount }})</span>
        </button>

      </div>

      <!-- 2. Categories Vibe Scroll Bar (Google Flights Explore Pill Chips) -->
      <div class="relative w-full max-w-2xl pointer-events-auto group/cat">
          
        <button 
          @click="scrollCategories('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 p-1.5 rounded-full bg-white shadow-md text-slate-700 hover:text-slate-900 transition-all border border-slate-200"
          :class="showLeftScroll ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'"
        >
          <ChevronLeft :size="14" />
        </button>

        <div 
          ref="categoriesRef" 
          @scroll="checkScroll"
          class="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-1 mx-1 scroll-smooth"
        >
          <button
            v-for="cat in categories"
            :key="cat.label"
            @click="emit('select-category', cat.type)"
            class="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs"
            :class="(selectedCategory === cat.type || (selectedCategory === 'All' && cat.type === CategoryType.Anywhere)) 
              ? 'bg-[#01306A] text-white border-transparent' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'"
          >
            <component 
              :is="cat.icon" 
              :size="13" 
              :class="(selectedCategory === cat.type || (selectedCategory === 'All' && cat.type === CategoryType.Anywhere)) ? 'text-white' : 'text-slate-500'" 
            />
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <button 
          @click="scrollCategories('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 p-1.5 rounded-full bg-white shadow-md text-slate-700 hover:text-slate-900 transition-all border border-slate-200"
          :class="showRightScroll ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'"
        >
          <ChevronRight :size="14" />
        </button>
      </div>

    </div>

    <div ref="mapRef" class="w-full flex-1 z-0 outline-none bg-slate-100"></div>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  :deep(.leaflet-bottom.leaflet-right) {
    bottom: 95px !important;
  }
}
</style>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { CategoryType, TrainDeal, FilterState } from '../types';
import { BERLIN_COORDS } from '../constants';
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
  'Deutsche Bahn (ICE)',
  'SNCF (TGV)',
  'Eurostar',
  'ÖBB Nightjet',
  'Trenitalia',
  'EuroCity (EC)'
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

const toggleOperator = (op: string) => {
  const current = props.filters.operators ? [...props.filters.operators] : [];
  const idx = current.indexOf(op);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(op);
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

onMounted(() => {
  checkScroll();
  window.addEventListener('resize', checkScroll);
  window.addEventListener('click', handleClickOutside);

  if (!mapRef.value) return;

  mapInstance = L.map(mapRef.value, {
    center: [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
    zoom: 4,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapInstance);

  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // Custom Berlin Marker (Origin)
  const berlinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #01306A; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);"></div>`,
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
  window.removeEventListener('click', handleClickOutside);
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

  if (props.selectedDestination && !visibleDestinations.find(d => d.id === props.selectedDestination!.id)) {
    visibleDestinations.push(props.selectedDestination);
  }

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
    L.polyline(routeLatLngs, { color: '#01879C', weight: 3.5, dashArray: '6, 6', opacity: 0.9, lineCap: 'round' }).addTo(markersLayer);
  }

  visibleDestinations.forEach(dest => {
    const isSelected = props.selectedDestination?.id === dest.id;
    const isInItinerary = props.itineraryDestinations.some(d => d.id === dest.id);
    const isDeal = dest.price <= 35;
    
    let markerBg = 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:shadow-md';
    let priceBg = isDeal ? 'text-slate-900 bg-emerald-100/70 font-bold' : 'text-slate-900 bg-slate-100 font-bold';

    if (isSelected) {
      markerBg = 'bg-[#01306A] text-white border-transparent shadow-lg ring-2 ring-white scale-110';
      priceBg = 'text-[#01306A] bg-white font-bold';
    } else if (isInItinerary) {
      markerBg = 'bg-[#01879C] text-white border-transparent shadow-lg ring-2 ring-white scale-110';
      priceBg = 'text-[#01879C] bg-white font-bold';
    }

    const html = `
      <div class="group relative flex flex-col items-center justify-center transition-all duration-200 ${isSelected || isInItinerary ? 'z-50' : 'z-10 hover:z-40 hover:scale-105'}">
         <div class="
            flex items-center gap-1.5 px-3 py-1 rounded-full shadow-md border cursor-pointer font-sans transition-all
            ${markerBg}
         ">
           <span class="text-xs font-medium whitespace-nowrap truncate max-w-[80px]">${dest.destinationName}</span>
           <span class="text-xs px-1.5 py-0.5 rounded-full ${priceBg}">$${dest.price}</span>
         </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: html,
      iconSize: [120, 36],
      iconAnchor: [60, 18]
    });

    const marker = L.marker([dest.location.lat, dest.location.lng], { icon: customIcon });
    
    marker.on('click', () => {
      emit('select-destination', dest);
      mapInstance.flyTo([dest.location.lat, dest.location.lng], 6, { duration: 1.2 });
    });
    
    marker.addTo(markersLayer);

    if (isSelected && !isInItinerary) {
      const lastPoint = props.itineraryDestinations.length > 0 
        ? props.itineraryDestinations[props.itineraryDestinations.length - 1].location 
        : BERLIN_COORDS;
      const latlngs = [[lastPoint.lat, lastPoint.lng], [dest.location.lat, dest.location.lng]];
      L.polyline(latlngs, { color: '#01306A', weight: 2, dashArray: '4, 6', opacity: 0.6, lineCap: 'round' }).addTo(markersLayer);
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

const updateFilterProp = (key: keyof FilterState, val: any) => {
  emit('update-filters', { ...props.filters, [key]: val });
};
</script>

<template>
  <div class="relative h-full w-full bg-slate-50 group flex-1 flex flex-col">
    
    <!-- Google Flights Style Floating Filter Bar -->
    <div class="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[400] w-full max-w-4xl flex flex-col items-center gap-2 px-3 pointer-events-none filter-popover-container">
      
      <!-- 1. Multi-Filter Pill Bar (Google Flights Rounded Pills) -->
      <div class="flex items-center gap-1.5 pointer-events-auto shadow-md rounded-full p-1 bg-white border border-slate-200 max-w-full overflow-x-auto scrollbar-hide">
        
        <!-- Filter: Stops -->
        <div class="relative flex-none">
          <button 
            @click.stop="activeFilter = activeFilter === 'stops' ? null : 'stops'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border"
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
            @click.stop
            class="absolute top-full mt-2 left-0 w-52 bg-white rounded-2xl p-2.5 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs font-medium space-y-1"
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
            @click.stop="activeFilter = activeFilter === 'price' ? null : 'price'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border"
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
            @click.stop
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150"
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
            @click.stop="activeFilter = activeFilter === 'duration' ? null : 'duration'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border"
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
            @click.stop
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-60 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150"
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
            @click.stop="activeFilter = activeFilter === 'operators' ? null : 'operators'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border"
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
            @click.stop
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-56 bg-white rounded-2xl p-3 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs space-y-1"
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
              :key="op"
              class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <span class="text-slate-800 font-medium">{{ op }}</span>
              <input 
                type="checkbox" 
                :checked="(filters.operators || []).includes(op)" 
                @change="toggleOperator(op)"
                class="w-4 h-4 rounded text-[#01306A] focus:ring-[#01306A] accent-[#01306A]"
              />
            </label>
          </div>
        </div>

        <!-- Filter: More (Scenic / Nightjet) -->
        <div class="relative flex-none">
          <button 
            @click.stop="activeFilter = activeFilter === 'more' ? null : 'more'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border"
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
            @click.stop
            class="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl p-3 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs space-y-2"
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


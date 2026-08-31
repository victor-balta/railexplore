<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import MapExplorer from './components/MapExplorer.vue';
import ItineraryOnePager from './components/ItineraryOnePager.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import PriceTrackerModal from './components/PriceTrackerModal.vue';
import { INITIAL_DESTINATIONS, getConnectedCities, EUROPEAN_HUBS, getDestinationsForOrigin, getOriginCoordinates } from './constants';
import { CategoryType, TrainDeal, FilterState, DateFlexibility } from './types';
import { 
  X, Train, Calendar, Users, Search, MapPin, ArrowRight, 
  Plus, Check, Loader2, Navigation, ArrowLeftRight, SlidersHorizontal, 
  Leaf, Euro, Zap, List, Bell
} from '@lucide/vue';

const searchOrigin = ref("Berlin");
const destinations = ref<TrainDeal[]>(INITIAL_DESTINATIONS);
const selectedDestinationId = ref<string | null>(null);
const selectedCategory = ref<CategoryType | 'All'>('All');
const isLocating = ref(false);
const searchDestination = ref("Anywhere");
const searchQuery = ref("Anywhere");
const itineraryDestinations = ref<TrainDeal[]>([]);
const isOnePagerOpen = ref(false);
const isGlobalPriceTrackerOpen = ref(false);

// Origin Autocomplete state
const isOriginDropdownOpen = ref(false);

const originSuggestions = computed(() => {
  const q = searchOrigin.value.trim().toLowerCase();
  if (!q) return EUROPEAN_HUBS.slice(0, 10);
  return EUROPEAN_HUBS.filter(h => 
    h.name.toLowerCase().includes(q) || 
    h.country.toLowerCase().includes(q)
  ).slice(0, 10);
});

const selectOriginSuggestion = (hub: { name: string }) => {
  searchOrigin.value = hub.name;
  isOriginDropdownOpen.value = false;
  destinations.value = getDestinationsForOrigin(hub.name);
  itineraryDestinations.value = [];
  selectedDestinationId.value = null;
};

const handleBlurOrigin = () => {
  setTimeout(() => {
    isOriginDropdownOpen.value = false;
  }, 200);
};

const originCoords = computed(() => {
  return getOriginCoordinates(searchOrigin.value);
});

// Watch for searchOrigin changes
watch(searchOrigin, (newOrigin) => {
  if (newOrigin && newOrigin.trim()) {
    destinations.value = getDestinationsForOrigin(newOrigin);
    itineraryDestinations.value = [];
    selectedDestinationId.value = null;
  }
});

// Mobile View Mode & Details Overlay State
const mobileViewMode = ref<'map' | 'list'>('map');
const isMobileDetailsOpen = ref(false);
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    isDesktop.value = window.innerWidth >= 768;
  });

  window.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.search-origin-container')) {
      isOriginDropdownOpen.value = false;
    }
    if (!target.closest('.search-dest-container')) {
      isDestDropdownOpen.value = false;
    }
  });
}

const setMobileViewMode = (mode: 'map' | 'list') => {
  mobileViewMode.value = mode;
  if (mode === 'map') {
    nextTick(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }
};

const sortBy = ref<'best' | 'price' | 'duration' | 'co2'>('best');

const filters = ref<FilterState>({
  maxDuration: 12,
  maxPrice: 500,
  directOnly: false,
  operators: [],
  selectedOperator: '',
  scenicOnly: false,
  nightTrainOnly: false,
  sortBy: 'best'
});

const clearAllFilters = () => {
  filters.value = {
    maxDuration: 12,
    maxPrice: 500,
    directOnly: false,
    operators: [],
    selectedOperator: '',
    scenicOnly: false,
    nightTrainOnly: false,
    sortBy: 'best'
  };
  selectedCategory.value = 'All';
  searchDestination.value = "Anywhere";
  searchQuery.value = "Anywhere";
};

const isDestDropdownOpen = ref(false);

const searchSuggestions = computed(() => {
  const q = searchDestination.value.trim().toLowerCase();
  if (!q || q === 'anywhere') {
    return currentPoolDestinations.value.slice(0, 10);
  }
  return currentPoolDestinations.value
    .filter(d => 
      d.destinationName.toLowerCase().includes(q) ||
      (d.stationName && d.stationName.toLowerCase().includes(q)) ||
      d.destinationCountry.toLowerCase().includes(q)
    )
    .slice(0, 10);
});

const selectSuggestion = (dest: TrainDeal) => {
  searchDestination.value = dest.destinationName;
  searchQuery.value = dest.destinationName;
  selectedDestinationId.value = dest.id;
  isDestDropdownOpen.value = false;
  if (!isDesktop.value) {
    isMobileDetailsOpen.value = true;
  }
};

const handleSearch = () => {
  searchQuery.value = searchDestination.value;
  isDestDropdownOpen.value = false;
  const match = destinations.value.find(d => 
    d.destinationName.toLowerCase() === searchDestination.value.trim().toLowerCase() ||
    d.stationName?.toLowerCase() === searchDestination.value.trim().toLowerCase()
  );
  if (match) {
    selectedDestinationId.value = match.id;
  }
};

const handleBlurSearch = () => {
  setTimeout(() => {
    isDestDropdownOpen.value = false;
  }, 200);
};

const selectedDestination = computed(() => {
  if (!selectedDestinationId.value) return null;
  // 1. Search in active onward leg destinations pool
  const fromPool = currentPoolDestinations.value.find(d => d.id === selectedDestinationId.value);
  if (fromPool) return fromPool;
  // 2. Search in itinerary destinations (waypoints)
  const fromItinerary = itineraryDestinations.value.find(d => d.id === selectedDestinationId.value);
  if (fromItinerary) return fromItinerary;
  // 3. Fallback to main origin destinations
  return destinations.value.find(d => d.id === selectedDestinationId.value) || null;
});

const handleSelectDestination = (id: string) => {
  selectedDestinationId.value = id;
  if (!isDesktop.value) {
    isMobileDetailsOpen.value = true;
  }
};

const handleMapSelection = (dest: TrainDeal) => {
  selectedDestinationId.value = dest.id;
  if (!isDesktop.value) {
    isMobileDetailsOpen.value = true;
  }
};

const handleCloseDetails = () => {
  isMobileDetailsOpen.value = false;
  if (isDesktop.value) {
    selectedDestinationId.value = null;
  }
};

const handleSwapOriginDest = () => {
  if (selectedDestination.value) {
    const temp = searchOrigin.value;
    searchOrigin.value = selectedDestination.value.destinationName;
    searchDestination.value = temp;
    searchQuery.value = temp;
  }
};

const handleGeolocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  isLocating.value = true;
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.state || "Current Location";
      searchOrigin.value = city;
    } catch (error) {
      console.error("Error fetching location name:", error);
      searchOrigin.value = "Current Location";
    } finally {
      isLocating.value = false;
    }
  }, (error) => {
    console.error("Geolocation error:", error);
    isLocating.value = false;
  });
};

const activeLegOrigin = computed(() => {
  if (itineraryDestinations.value.length > 0) {
    const last = itineraryDestinations.value[itineraryDestinations.value.length - 1];
    if (last && last.destinationName !== 'return-origin') {
      return last.destinationName;
    }
  }
  return searchOrigin.value;
});

const currentPoolDestinations = computed(() => {
  if (itineraryDestinations.value.length > 0) {
    const last = itineraryDestinations.value[itineraryDestinations.value.length - 1];
    if (last && last.destinationName !== 'return-origin') {
      const onward = getDestinationsForOrigin(last.destinationName);
      // Exclude destinations already visited in itinerary (except allow returning to main origin)
      const visited = new Set(
        itineraryDestinations.value
          .map(d => d.destinationName.toLowerCase())
          .filter(name => name !== searchOrigin.value.toLowerCase())
      );
      return onward.filter(d => !visited.has(d.destinationName.toLowerCase()));
    }
  }
  return destinations.value;
});

const parseDurationHours = (durationStr: string): number => {
  if (!durationStr) return 0;
  let durationHours = 0;
  const hMatch = durationStr.match(/(\d+)h/);
  if (hMatch) durationHours += parseInt(hMatch[1], 10);
  const mMatch = durationStr.match(/(\d+)m/);
  if (mMatch) durationHours += parseInt(mMatch[1], 10) / 60;
  return durationHours;
};

const matchesOperatorFilter = (trainOperator: string, selectedOps?: string[], selectedSingleOp?: string) => {
  const activeOps = (selectedOps && selectedOps.length > 0) 
    ? selectedOps 
    : (selectedSingleOp ? [selectedSingleOp] : []);
  
  if (activeOps.length === 0) return true;
  const opStr = (trainOperator || '').toLowerCase();

  return activeOps.some(selected => {
    const s = selected.toLowerCase();
    if (s === 'ice' || s.includes('ice') || s.includes('high speed') || s.includes('tgv') || s.includes('railjet')) {
      return opStr.includes('ice') || opStr.includes('tgv') || opStr.includes('railjet') || opStr.includes('rj') || opStr.includes('eurostar');
    }
    if (s === 'ic_ec' || s.includes('intercity') || s.includes('eurocity') || s === 'ec' || s === 'ic') {
      return opStr.includes('ic') || opStr.includes('ec') || opStr.includes('eurocity') || opStr.includes('intercity');
    }
    if (s === 'regional' || s.includes('re') || s.includes('rb') || s.includes('regional') || s.includes('s-bahn')) {
      return opStr.includes('re') || opStr.includes('rb') || opStr.includes('regional') || opStr.includes('s-bahn') || opStr.includes('27n') || opStr.includes('drf') || opStr.includes('hbx');
    }
    if (s === 'nightjet' || s.includes('night') || s.includes('sleeper')) {
      return opStr.includes('nightjet') || opStr.includes('nj') || opStr.includes('night') || opStr.includes('sleeper') || opStr.includes('en');
    }
    if (s === 'flixtrain' || s.includes('flix')) {
      return opStr.includes('flixtrain') || opStr.includes('flx');
    }
    return opStr.includes(s);
  });
};

const filteredDestinations = computed(() => {
  return currentPoolDestinations.value.filter(d => {
    // 1. Category / Vibe Filter
    const matchesCategory = !selectedCategory.value || 
                            selectedCategory.value === 'All' || 
                            selectedCategory.value === CategoryType.Anywhere || 
                            d.category === selectedCategory.value;

    // 2. Price Filter (if maxPrice < 500, apply limit)
    const maxP = filters.value.maxPrice ?? 500;
    const matchesPrice = maxP >= 500 ? true : d.price <= maxP;

    // 3. Search Query Filter (matches city name, country, station name, category)
    const q = (searchQuery.value || '').trim().toLowerCase();
    const matchesSearch = !q || q === 'anywhere' 
      ? true 
      : (d.destinationName.toLowerCase().includes(q) || 
         d.destinationCountry.toLowerCase().includes(q) || 
         (d.stationName && d.stationName.toLowerCase().includes(q)) ||
         d.category.toLowerCase().includes(q));

    // 4. Duration Filter (if maxDuration < 12, apply limit)
    const durationHours = parseDurationHours(d.duration);
    const maxDur = filters.value.maxDuration ?? 12;
    const matchesDuration = maxDur >= 12 ? true : durationHours <= maxDur;

    // 5. Direct Nonstop Only
    const matchesDirect = !filters.value.directOnly || (d.isDirect === true || d.transfers === 0);

    // 6. Operator Filter
    const matchesOperator = matchesOperatorFilter(d.trainOperator, filters.value.operators, filters.value.selectedOperator);

    // 7. Scenic Route Filter
    const matchesScenic = !filters.value.scenicOnly || 
                          (d.scenicRating && d.scenicRating >= 4) || 
                          d.category === CategoryType.Mountains || 
                          d.category === CategoryType.Nature;

    // 8. Night Train Filter
    const matchesNightTrain = !filters.value.nightTrainOnly || 
                              d.trainOperator.toLowerCase().includes('nightjet') || 
                              d.trainOperator.toLowerCase().includes('night') || 
                              durationHours >= 7;

    return matchesCategory && matchesPrice && matchesSearch && matchesDuration && 
           matchesDirect && matchesOperator && matchesScenic && matchesNightTrain;
  });
});

const sortedFilteredDestinations = computed(() => {
  const list = [...filteredDestinations.value];
  
  if (sortBy.value === 'price') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'duration') {
    list.sort((a, b) => parseDurationHours(a.duration) - parseDurationHours(b.duration));
  } else if (sortBy.value === 'co2') {
    list.sort((a, b) => (b.co2SavingsPercent || 0) - (a.co2SavingsPercent || 0));
  } else {
    // Best Deals (price, scenic, direct priority)
    list.sort((a, b) => {
      if (a.id === selectedDestinationId.value) return -1;
      if (b.id === selectedDestinationId.value) return 1;
      const scoreA = (a.isDirect ? 20 : 0) + (a.scenicRating ? a.scenicRating * 5 : 0) - (a.price * 0.4);
      const scoreB = (b.isDirect ? 20 : 0) + (b.scenicRating ? b.scenicRating * 5 : 0) - (b.price * 0.4);
      return scoreB - scoreA;
    });
  }

  return list;
});

const toggleItineraryDestination = (dest: TrainDeal) => {
  if (itineraryDestinations.value.find(d => d.id === dest.id)) {
    itineraryDestinations.value = itineraryDestinations.value.filter(d => d.id !== dest.id);
  } else {
    itineraryDestinations.value = [...itineraryDestinations.value, dest];
    // Reset search query and destination input so onward destinations from the new stop are instantly available!
    searchDestination.value = 'Anywhere';
    searchQuery.value = 'Anywhere';
    isDestDropdownOpen.value = false;
    selectedDestinationId.value = null;
    if (!isDesktop.value) {
      isMobileDetailsOpen.value = false;
    }
  }
};

const handleUpdateItinerary = (newItinerary: TrainDeal[]) => {
  const isAdding = newItinerary.length > itineraryDestinations.value.length;
  itineraryDestinations.value = newItinerary;
  if (isAdding) {
    searchDestination.value = 'Anywhere';
    searchQuery.value = 'Anywhere';
    isDestDropdownOpen.value = false;
    selectedDestinationId.value = null;
    isMobileDetailsOpen.value = false;
  }
};

watch(selectedDestinationId, (newId) => {
  if (newId) {
    nextTick(() => {
      const el = document.getElementById(`deal-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});

const addReturnToOrigin = () => {
  const returnDest: TrainDeal = {
    id: 'return-origin',
    destinationName: searchOrigin.value,
    destinationCountry: '',
    originName: itineraryDestinations.value[itineraryDestinations.value.length - 1]?.destinationName || searchOrigin.value,
    category: CategoryType.Anywhere,
    description: 'Return trip to origin.',
    location: { lat: originCoords.value.lat, lng: originCoords.value.lng },
    duration: 'N/A',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=400&q=80',
    outboundDate: 'TBD',
    returnDate: 'TBD',
    trainOperator: 'Various',
    transfers: 0,
    weather: [{ date: 'TBD', temp: 20, condition: 'sunny' }]
  };
  if (!itineraryDestinations.value.some(d => d.id === 'return-origin')) {
    itineraryDestinations.value = [...itineraryDestinations.value, returnDest];
  }
};
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-white font-sans text-slate-900 overflow-hidden">
    
    <!-- TrainExplore Top Navigation & Search Bar (Google Flights Minimalist Style) -->
    <header class="flex-none bg-white border-b border-slate-200 z-50 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between relative gap-2 sm:gap-4">
      
      <!-- Brand Logo -->
      <div class="flex items-center gap-2 flex-none cursor-pointer" @click="clearAllFilters">
        <img src="/logo.png" alt="TrainExplore" class="h-9 sm:h-11 md:h-12 w-auto object-contain hover:opacity-90 transition-opacity" />
      </div>
      
      <!-- Unified Search Input Cluster -->
      <div class="flex-1 max-w-4xl mx-1 sm:mx-2 flex items-center bg-slate-100/70 border border-slate-200 rounded-full p-1 gap-1 text-xs sm:text-sm relative z-50">
        
        <!-- Origin Input with Autocomplete Dropdown -->
        <div class="search-origin-container relative flex-1 min-w-[140px]">
          <div class="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <MapPin :size="14" class="text-[#01879C] flex-none" />
            <input 
              v-model="searchOrigin" 
              @focus="isOriginDropdownOpen = true"
              @input="isOriginDropdownOpen = true"
              type="text" 
              placeholder="From where?" 
              class="bg-transparent font-semibold text-slate-900 outline-none w-full truncate text-xs sm:text-sm"
            />
            <button 
              @click="handleGeolocation" 
              :disabled="isLocating"
              class="text-slate-400 hover:text-slate-700 transition-colors flex-none"
              title="Use current location"
            >
              <Loader2 v-if="isLocating" :size="12" class="animate-spin" />
              <Navigation v-else :size="12" />
            </button>
          </div>

          <!-- Floating Origin Dropdown -->
          <div 
            v-if="isOriginDropdownOpen && originSuggestions.length > 0"
            class="absolute top-full left-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[999] max-h-80 overflow-y-auto scrollbar-hide py-1.5"
          >
            <div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Departure Hubs
            </div>
            <div 
              v-for="hub in originSuggestions" 
              :key="hub.name"
              @mousedown.stop.prevent="selectOriginSuggestion(hub)"
              class="px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center justify-between gap-2 border-b border-slate-100 last:border-0 transition-colors"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm">🚆</span>
                <div>
                  <div class="text-xs font-bold text-slate-900">{{ hub.name }}</div>
                  <div class="text-[10px] text-slate-500">{{ hub.country }}</div>
                </div>
              </div>
              <span class="text-[9px] font-semibold text-[#01306A] bg-slate-100 px-2 py-0.5 rounded-full">
                Select
              </span>
            </div>
          </div>
        </div>

        <!-- Swap Icon Button -->
        <button 
          @click="handleSwapOriginDest"
          class="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors flex-none shadow-2xs"
          title="Swap cities"
        >
          <ArrowLeftRight :size="12" />
        </button>

        <!-- Destination Input with Autocomplete Dropdown -->
        <div class="search-dest-container relative flex-1 min-w-[140px]">
          <div class="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <Search :size="14" class="text-slate-400 flex-none" />
            <input 
              v-model="searchDestination" 
              @focus="isDestDropdownOpen = true; if (searchDestination === 'Anywhere') searchDestination = ''"
              @input="isDestDropdownOpen = true; searchQuery = searchDestination"
              @keydown.enter="handleSearch" 
              type="text" 
              :placeholder="itineraryDestinations.length > 0 ? `Next stop from ${activeLegOrigin}?` : 'Where to? (Explore anywhere)'" 
              class="bg-transparent font-semibold text-slate-900 outline-none w-full truncate placeholder:text-slate-400 text-xs sm:text-sm"
            />
            <button 
              v-if="searchDestination && searchDestination.toLowerCase() !== 'anywhere'" 
              @mousedown.stop.prevent="searchDestination = 'Anywhere'; searchQuery = 'Anywhere'; isDestDropdownOpen = false"
              class="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              <X :size="13" />
            </button>
          </div>

          <!-- Floating Autocomplete Dropdown -->
          <div 
            v-if="isDestDropdownOpen && searchSuggestions.length > 0"
            class="absolute top-full left-0 mt-2 w-72 sm:w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[999] max-h-80 overflow-y-auto scrollbar-hide py-1.5"
          >
            <div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Destinations from {{ activeLegOrigin }}
            </div>
            <div 
              v-for="dest in searchSuggestions" 
              :key="dest.id"
              @mousedown.stop.prevent="selectSuggestion(dest)"
              class="px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center justify-between gap-2 border-b border-slate-100 last:border-0 transition-colors"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-slate-900 truncate">{{ dest.destinationName }}</span>
                  <span 
                    class="text-[9px] font-bold px-1.5 py-0.2 rounded"
                    :class="dest.isDirect !== false && dest.transfers === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ dest.isDirect !== false && dest.transfers === 0 ? 'Nonstop' : '1 stop' }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                  <span>{{ dest.destinationCountry }}</span>
                  <span>•</span>
                  <span>{{ dest.duration }}</span>
                </div>
              </div>
              <div class="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg flex-none">
                ${{ dest.price }}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="flex items-center gap-2 flex-none">
        <!-- Journey Summary Header Button (Always accessible when stops exist) -->
        <button 
          v-if="itineraryDestinations.length > 0"
          @click="isOnePagerOpen = true"
          class="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md flex-none bg-[#01879C] hover:bg-[#01306A] text-white animate-in fade-in"
        >
          <Train :size="14" />
          <span>Journey Summary ({{ itineraryDestinations.length }})</span>
        </button>

        <!-- Track Prices Header Button (Google Flights style) -->
        <button 
          @click="isGlobalPriceTrackerOpen = true"
          class="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs flex-none bg-white border border-slate-300 text-[#01306A] hover:bg-slate-50 hover:border-slate-400"
        >
          <Bell :size="14" class="text-[#01879C]" />
          <span class="hidden sm:inline">Track Prices</span>
        </button>
      </div>
    </header>

    <!-- Mobile Sub-Header: Segmented View Mode Switcher -->
    <div class="md:hidden flex-none bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 z-40">
      <div class="flex-1 flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
        <button 
          @click="setMobileViewMode('list')"
          class="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
          :class="mobileViewMode === 'list' ? 'bg-white text-[#01306A] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
        >
          <List :size="13" />
          <span>Journeys ({{ sortedFilteredDestinations.length }})</span>
        </button>
        <button 
          @click="setMobileViewMode('map')"
          class="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
          :class="mobileViewMode === 'map' ? 'bg-white text-[#01306A] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
        >
          <MapPin :size="13" />
          <span>Map Explorer</span>
        </button>
      </div>
    </div>

    <!-- Main Workspace Split Layout -->
    <div class="flex flex-col md:flex-row flex-1 overflow-hidden relative">
      
      <!-- Left Sidebar: Train Deals List (Full screen on mobile when mobileViewMode is 'list', Sidebar on desktop) -->
      <div 
        class="w-full md:w-[380px] lg:w-[420px] flex-none bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-col z-30 h-full"
        :class="mobileViewMode === 'list' ? 'flex flex-1' : 'hidden md:flex'"
      >
        
        <!-- Header Controls & Sort -->
        <div class="px-4 py-3 border-b border-slate-200 bg-white flex-none flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>Train Journeys</span>
            <span class="text-xs text-slate-500 font-normal">({{ sortedFilteredDestinations.length }})</span>
          </h2>
          
          <!-- Sort Selector -->
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-medium text-slate-500 hidden sm:inline">Sort by:</span>
            <select 
              v-model="sortBy"
              class="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 outline-none cursor-pointer transition-colors"
            >
              <option value="best">Best Price & Route</option>
              <option value="price">Lowest Price</option>
              <option value="duration">Fastest Duration</option>
              <option value="co2">Lowest Emissions</option>
            </select>
          </div>
        </div>
        
        <!-- Deals List Stream -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide bg-slate-50/50 pb-20 md:pb-4">
          <div 
            v-for="dest in sortedFilteredDestinations"
            :key="dest.id"
            :id="`deal-${dest.id}`"
            @click="handleSelectDestination(dest.id)"
            class="group flex gap-3 p-3 rounded-xl cursor-pointer transition-all border"
            :class="selectedDestinationId === dest.id 
              ? 'bg-white border-[#01306A] shadow-sm ring-2 ring-[#01306A]/10' 
              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'"
          >
            <div class="w-20 h-20 rounded-lg overflow-hidden flex-none relative">
              <img 
                :src="dest.imageUrl" 
                :alt="dest.destinationName" 
                @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80'" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div class="absolute bottom-1 right-1 bg-black/75 backdrop-blur text-[9px] font-semibold px-1.5 py-0.5 rounded text-white">
                {{ dest.duration }}
              </div>
            </div>
            <div class="flex-1 py-0.5 flex flex-col justify-between min-w-0">
              <div>
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-slate-900 text-sm truncate">{{ dest.destinationName }}</h3>
                  <div class="text-base font-bold text-slate-900">${{ dest.price }}</div>
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span v-if="dest.tripType" class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-[#01306A] border border-slate-200/80">
                    {{ dest.tripType }}
                  </span>
                  <span class="text-xs text-slate-500 truncate">{{ dest.destinationCountry }} • {{ dest.category }}</span>
                </div>
                <div class="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                  <span 
                    class="font-semibold px-1.5 py-0.2 rounded text-[10px]"
                    :class="dest.isDirect !== false && dest.transfers === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                  >
                    {{ dest.isDirect !== false && dest.transfers === 0 ? '⚡ Nonstop' : (dest.transferStation ? `1 stop (${dest.transferStation})` : `${dest.transfers} transfer`) }}
                  </span>
                  <span>•</span>
                  <span class="truncate">{{ dest.trainOperator }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100">
                <span v-if="dest.co2SavingsPercent" class="text-[10px] font-medium text-slate-500 flex items-center gap-0.5">
                  <Leaf :size="10" class="text-emerald-600" /> -{{ dest.co2SavingsPercent }}% CO₂ vs flight
                </span>
                <button
                  @click.stop="toggleItineraryDestination(dest)"
                  class="px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ml-auto shadow-2xs"
                  :class="itineraryDestinations.some(d => d.id === dest.id) 
                    ? 'bg-[#01306A] text-white hover:bg-[#002D67]' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'"
                >
                  <template v-if="itineraryDestinations.some(d => d.id === dest.id)">
                    <Check :size="12" /> Added
                  </template>
                  <template v-else>
                    <Plus :size="12" /> Add
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Area: TrainExplore Map Explorer (Full screen on mobile when mobileViewMode is 'map') -->
      <div 
        class="flex-1 min-w-0 h-full relative bg-slate-100 flex-col z-0"
        :class="mobileViewMode === 'map' ? 'flex flex-1' : 'hidden md:flex'"
      >
        <MapExplorer 
          :destinations="filteredDestinations"
          :selectedDestination="selectedDestination"
          @select-destination="handleMapSelection"
          :selectedCategory="selectedCategory"
          @select-category="selectedCategory = $event"
          :filters="filters"
          @update-filters="filters = $event"
          :itineraryDestinations="itineraryDestinations"
          :originCoords="originCoords"
          :originName="searchOrigin"
        />

        <!-- Floating Multi-City Trip Builder Bar -->
        <div 
          v-if="itineraryDestinations.length > 0" 
          class="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[1300] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-2.5 flex items-center gap-2 md:gap-3 w-[95%] sm:w-[90%] md:w-auto max-w-2xl"
        >
          <div class="flex items-center gap-2 font-bold text-[#002D67] pl-2 md:pl-3 flex-1 overflow-x-auto scrollbar-hide whitespace-nowrap text-xs sm:text-sm">
            <span class="text-[#01879C] flex-none"><Train :size="16" /></span>
            {{ searchOrigin }}
            
            <template v-for="d in itineraryDestinations" :key="d.id">
              <ArrowRight :size="14" class="text-slate-400 flex-none" />
              <span>{{ d.destinationName }}</span>
            </template>
            
            <button 
              @click="addReturnToOrigin"
              class="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-[#01306A] transition-colors bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-full flex-none ml-1 border border-slate-200"
            >
              <Plus :size="10" /> Return to {{ searchOrigin }}
            </button>
          </div>

          <!-- Journey Summary Button -->
          <button 
            @click="isOnePagerOpen = true"
            class="bg-[#01879C] hover:bg-[#01306A] text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 flex-none shadow-md"
          >
            <Train :size="15" /> 
            <span>Journey Summary</span>
          </button>

          <button 
            @click="itineraryDestinations = []"
            class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors flex-none"
            title="Clear Trip"
          >
            <X :size="15" />
          </button>
        </div>
      </div>

      <!-- Details Panel (Right Sidebar on Desktop / Full Screen Modal Drawer on Mobile) -->
      <div 
        v-if="selectedDestination && (isMobileDetailsOpen || isDesktop)" 
        class="fixed inset-0 md:static md:inset-auto w-full md:w-[400px] lg:w-[440px] flex-none bg-white md:border-l border-slate-200 z-[80] md:z-auto shadow-2xl md:shadow-none flex flex-col overflow-hidden transition-all duration-300"
      >
        <DetailsPanel 
          :destination="selectedDestination"
          :itineraryDestinations="itineraryDestinations"
          @update-itinerary="handleUpdateItinerary"
          @close="handleCloseDetails"
          @open-one-pager="isOnePagerOpen = true; isMobileDetailsOpen = false"
        />
      </div>

    </div>

    <!-- Mobile Selected Destination Bottom Card Preview (Google Explore / Airbnb Style) -->
    <div 
      v-if="selectedDestination && mobileViewMode === 'map' && !isMobileDetailsOpen"
      class="md:hidden fixed bottom-4 left-3 right-3 z-50 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-3 duration-200"
    >
      <div class="flex gap-3 items-center">
        <img 
          :src="selectedDestination.imageUrl" 
          :alt="selectedDestination.destinationName" 
          @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=400&q=80'"
          class="rounded-xl object-cover flex-none shadow-xs"
          style="width: 76px; height: 76px;"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <div class="min-w-0 pr-2">
              <h3 class="font-bold text-slate-900 text-base truncate">{{ selectedDestination.destinationName }}</h3>
              <p class="text-xs text-slate-500 truncate">{{ selectedDestination.destinationCountry }} • {{ selectedDestination.duration }}</p>
            </div>
            <div class="text-right flex-none">
              <div class="text-base font-bold text-slate-900">${{ selectedDestination.price }}</div>
              <span class="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                {{ selectedDestination.transfers === 0 ? 'Direct' : `${selectedDestination.transfers} stop` }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
            <button 
              @click="isMobileDetailsOpen = true"
              class="flex-1 py-1.5 px-3 bg-[#01306A] text-white rounded-lg text-xs font-semibold hover:bg-[#002D67] transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>View Schedule</span>
              <ArrowRight :size="12" />
            </button>
            <button 
              @click.stop="toggleItineraryDestination(selectedDestination)"
              class="py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border"
              :class="itineraryDestinations.some(d => d.id === selectedDestination.id) ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'"
            >
              <Check v-if="itineraryDestinations.some(d => d.id === selectedDestination.id)" :size="12" />
              <Plus v-else :size="12" />
              <span>{{ itineraryDestinations.some(d => d.id === selectedDestination.id) ? 'Added' : 'Add' }}</span>
            </button>
            <button 
              @click.stop="selectedDestinationId = null"
              class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Close preview"
            >
              <X :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Price Tracker Modal -->
    <PriceTrackerModal 
      v-if="isGlobalPriceTrackerOpen && selectedDestination"
      :destination="selectedDestination"
      :originName="searchOrigin"
      @close="isGlobalPriceTrackerOpen = false"
    />

    <!-- Itinerary OnePager Dashboard / Journey Summary -->
    <ItineraryOnePager 
      v-if="isOnePagerOpen"
      :destinations="itineraryDestinations" 
      :searchOrigin="searchOrigin"
      @close="isOnePagerOpen = false" 
    />
  </div>
</template>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>


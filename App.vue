<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import MapExplorer from './components/MapExplorer.vue';
import ItineraryOnePager from './components/ItineraryOnePager.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import AiCopilotDrawer from './components/AiCopilotDrawer.vue';
import { INITIAL_DESTINATIONS, INITIAL_CHAT, getConnectedCities } from './constants';
import { CategoryType, TrainDeal, FilterState, ChatMessage, CopilotAction, DateFlexibility } from './types';
import { 
  Sparkles, X, Train, Calendar, Users, Search, MapPin, ArrowRight, 
  Plus, Check, Loader2, Navigation, ArrowLeftRight, SlidersHorizontal, 
  Bot, Wand2, Leaf, Euro, Zap
} from '@lucide/vue';
import { parseItineraryQuery, optimizeTripRoute } from './services/aiService';

const destinations = ref<TrainDeal[]>(INITIAL_DESTINATIONS);
const selectedDestinationId = ref<string | null>(INITIAL_DESTINATIONS[0]?.id || '1');
const selectedCategory = ref<CategoryType | 'All'>('All');
const searchOrigin = ref("Berlin");
const isLocating = ref(false);
const searchDestination = ref("Anywhere");
const searchQuery = ref("Anywhere");
const itineraryDestinations = ref<TrainDeal[]>([]);
const isOnePagerOpen = ref(false);
const isCopilotOpen = ref(false);
const isOptimizingRoute = ref(false);
const chatMessages = ref<ChatMessage[]>(INITIAL_CHAT);

const dateOptions: DateFlexibility[] = [
  { mode: 'flexible', label: 'Flexible: Next 6 months' },
  { mode: 'weekend', label: 'Weekend Getaway' },
  { mode: '1week', label: '1-Week Rail Pass' },
  { mode: 'exact', label: 'Apr 7 - Apr 11' }
];
const selectedDateOption = ref<DateFlexibility>(dateOptions[0]);
const showDateDropdown = ref(false);

const passengerCount = ref(1);
const showPassengerDropdown = ref(false);

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

const selectedDestination = computed(() => {
  return destinations.value.find(d => d.id === selectedDestinationId.value) || null;
});

const handleSelectDestination = (id: string) => {
  selectedDestinationId.value = id;
};

const handleMapSelection = (dest: TrainDeal) => {
  selectedDestinationId.value = dest.id;
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

const lastItineraryDest = computed(() => {
  if (itineraryDestinations.value.length > 0) {
    const last = itineraryDestinations.value[itineraryDestinations.value.length - 1];
    return last.destinationName;
  }
  return searchOrigin.value;
});

const connectedCities = computed(() => {
  if (lastItineraryDest.value && lastItineraryDest.value !== 'return-origin') {
    const list = getConnectedCities(lastItineraryDest.value, destinations.value);
    return list.length === 0 ? null : list;
  }
  return null;
});

const filteredDestinations = computed(() => {
  return destinations.value.filter(d => {
    const matchesCategory = selectedCategory.value === 'All' || d.category === selectedCategory.value;
    const matchesPrice = d.price <= filters.value.maxPrice;
    const matchesSearch = searchQuery.value.toLowerCase() === 'anywhere' || searchQuery.value.trim() === '' || 
                          d.destinationName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesConnection = connectedCities.value === null || 
                               connectedCities.value.includes(d.destinationName) || 
                               itineraryDestinations.value.some(it => it.id === d.id);
    
    // Parse duration string (e.g., "2h 30m") to hours
    let durationHours = 0;
    const hMatch = d.duration.match(/(\d+)h/);
    if (hMatch) durationHours += parseInt(hMatch[1], 10);
    const mMatch = d.duration.match(/(\d+)m/);
    if (mMatch) durationHours += parseInt(mMatch[1], 10) / 60;
    
    const matchesDuration = durationHours <= filters.value.maxDuration;
    const matchesDirect = !filters.value.directOnly || d.transfers === 0;
    const matchesOperator = !filters.value.selectedOperator || filters.value.selectedOperator === '' || 
                            d.trainOperator.toLowerCase().includes(filters.value.selectedOperator.toLowerCase());
    const matchesScenic = !filters.value.scenicOnly || (d.scenicRating && d.scenicRating >= 4);
    const matchesNightTrain = !filters.value.nightTrainOnly || d.trainOperator.toLowerCase().includes('nightjet');

    return matchesCategory && matchesPrice && matchesSearch && matchesDuration && 
           matchesDirect && matchesConnection && matchesOperator && matchesScenic && matchesNightTrain;
  });
});

const sortedFilteredDestinations = computed(() => {
  const list = [...filteredDestinations.value];
  
  if (sortBy.value === 'price') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'duration') {
    const getMins = (dur: string) => {
      const h = dur.match(/(\d+)h/);
      const m = dur.match(/(\d+)m/);
      return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
    };
    list.sort((a, b) => getMins(a.duration) - getMins(b.duration));
  } else if (sortBy.value === 'co2') {
    list.sort((a, b) => (b.co2SavingsPercent || 0) - (a.co2SavingsPercent || 0));
  } else {
    // Best Deals (price * duration score)
    list.sort((a, b) => {
      if (a.id === selectedDestinationId.value) return -1;
      if (b.id === selectedDestinationId.value) return 1;
      return a.price - b.price;
    });
  }

  return list;
});

const handleSearch = () => {
  searchQuery.value = searchDestination.value;
};

const handleOptimizeRoute = async () => {
  if (itineraryDestinations.value.length <= 1 || isOptimizingRoute.value) return;
  
  isOptimizingRoute.value = true;
  try {
    const optimized = await optimizeTripRoute(searchOrigin.value, itineraryDestinations.value);
    itineraryDestinations.value = optimized;
  } catch (err) {
    console.error("Optimization failed:", err);
  } finally {
    isOptimizingRoute.value = false;
  }
};

const handleCopilotAction = (action: CopilotAction) => {
  if (action.type === 'SET_FILTERS') {
    if (action.payload?.maxPrice) filters.value.maxPrice = action.payload.maxPrice;
    if (action.payload?.maxDuration) filters.value.maxDuration = action.payload.maxDuration;
    if (action.payload?.directOnly !== undefined) filters.value.directOnly = action.payload.directOnly;
    if (action.payload?.category) selectedCategory.value = action.payload.category as CategoryType;
  } else if (action.type === 'ADD_TO_TRIP') {
    const ids: string[] = action.payload?.destinationIds || [];
    ids.forEach(id => {
      const found = destinations.value.find(d => d.id === id);
      if (found && !itineraryDestinations.value.some(d => d.id === id)) {
        itineraryDestinations.value.push(found);
      }
    });
  } else if (action.type === 'SELECT_DESTINATION') {
    if (action.payload?.id) {
      selectedDestinationId.value = action.payload.id;
    }
  } else if (action.type === 'OPTIMIZE_ROUTE') {
    handleOptimizeRoute();
  } else if (action.type === 'SET_ORIGIN') {
    if (action.payload?.origin) {
      searchOrigin.value = action.payload.origin;
    }
  } else if (action.type === 'GENERATE_ITINERARY') {
    if (itineraryDestinations.value.length > 0) {
      isOnePagerOpen.value = true;
    }
  } else if (action.type === 'RESET_FILTERS') {
    filters.value = { maxDuration: 12, maxPrice: 500, directOnly: false };
    selectedCategory.value = 'All';
  }
};

const toggleItineraryDestination = (dest: TrainDeal) => {
  if (itineraryDestinations.value.find(d => d.id === dest.id)) {
    itineraryDestinations.value = itineraryDestinations.value.filter(d => d.id !== dest.id);
  } else {
    itineraryDestinations.value = [...itineraryDestinations.value, dest];
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
    location: { lat: 52.5200, lng: 13.4050 },
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
      <div class="flex-1 max-w-4xl mx-1 sm:mx-2 flex items-center bg-slate-100/70 border border-slate-200 rounded-full p-1 gap-1 overflow-x-auto scrollbar-hide text-xs sm:text-sm">
        
        <!-- Origin Input -->
        <div class="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs flex-none min-w-[130px] sm:min-w-[160px]">
          <MapPin :size="14" class="text-slate-400 flex-none" />
          <input 
            v-model="searchOrigin" 
            type="text" 
            placeholder="From where?" 
            class="bg-transparent font-semibold text-slate-900 outline-none w-full truncate"
          />
          <button 
            @click="handleGeolocation" 
            :disabled="isLocating"
            class="text-slate-400 hover:text-slate-700 transition-colors"
            title="Use current location"
          >
            <Loader2 v-if="isLocating" :size="12" class="animate-spin" />
            <Navigation v-else :size="12" />
          </button>
        </div>

        <!-- Swap Icon Button -->
        <button 
          @click="handleSwapOriginDest"
          class="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors flex-none shadow-2xs"
          title="Swap cities"
        >
          <ArrowLeftRight :size="12" />
        </button>

        <!-- Destination Input -->
        <div class="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs flex-1 min-w-[140px]">
          <Search :size="14" class="text-slate-400 flex-none" />
          <input 
            v-model="searchDestination" 
            @keydown.enter="handleSearch" 
            type="text" 
            placeholder="Where to? (Explore anywhere)" 
            class="bg-transparent font-semibold text-slate-900 outline-none w-full truncate placeholder:text-slate-400"
          />
        </div>

        <!-- Flexible Dates Dropdown -->
        <div class="relative flex-none hidden lg:block">
          <button 
            @click="showDateDropdown = !showDateDropdown"
            class="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs text-slate-700 font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Calendar :size="14" class="text-slate-400" />
            <span>{{ selectedDateOption.label }}</span>
          </button>
          
          <div 
            v-if="showDateDropdown" 
            class="absolute top-full mt-1.5 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-[100] w-52 space-y-1"
          >
            <button 
              v-for="(opt, idx) in dateOptions" 
              :key="idx"
              @click="selectedDateOption = opt; showDateDropdown = false"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#01306A] transition-colors flex items-center justify-between"
            >
              <span>{{ opt.label }}</span>
              <Check v-if="selectedDateOption.label === opt.label" :size="14" class="text-[#01306A]" />
            </button>
          </div>
        </div>

        <!-- Passengers Dropdown -->
        <div class="relative flex-none hidden md:block">
          <button 
            @click="showPassengerDropdown = !showPassengerDropdown"
            class="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs text-slate-700 font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Users :size="14" class="text-slate-400" />
            <span>{{ passengerCount }} {{ passengerCount === 1 ? 'Adult' : 'Adults' }}</span>
          </button>

          <div 
            v-if="showPassengerDropdown" 
            class="absolute top-full mt-1.5 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-[100] w-48 space-y-2"
          >
            <div class="text-xs font-bold text-slate-800">Passengers</div>
            <div class="flex items-center justify-between pt-1">
              <span class="text-xs font-semibold text-slate-600">Adults (18+)</span>
              <div class="flex items-center gap-2">
                <button 
                  @click="passengerCount = Math.max(1, passengerCount - 1)" 
                  class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                >-</button>
                <span class="text-xs font-bold text-[#002D67] w-4 text-center">{{ passengerCount }}</span>
                <button 
                  @click="passengerCount = Math.min(9, passengerCount + 1)" 
                  class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                >+</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- TrainExplore AI Copilot Trigger Button -->
      <button 
        @click="isCopilotOpen = !isCopilotOpen"
        class="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs flex-none"
        :class="isCopilotOpen 
          ? 'bg-[#01306A] text-white' 
          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'"
      >
        <Sparkles :size="14" class="text-[#01879C]" />
        <span class="hidden sm:inline">AI Copilot</span>
      </button>
    </header>

    <!-- Main Workspace Split Layout -->
    <div class="flex flex-col md:flex-row flex-1 overflow-hidden relative">
      
      <!-- Left Sidebar: Train Deals List -->
      <div class="w-full md:w-[380px] lg:w-[420px] flex-none bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col z-40 h-[48vh] md:h-full">
        
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
        <div class="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide bg-slate-50/50">
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
                <p class="text-xs text-slate-500 mt-0.5">{{ dest.destinationCountry }} • {{ dest.category }}</p>
                <div class="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                  <span class="font-medium text-slate-700">{{ dest.transfers === 0 ? 'Nonstop' : `${dest.transfers} transfer` }}</span>
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

      <!-- Right Area: TrainExplore Map Explorer -->
      <div class="flex-1 min-w-0 h-full relative bg-slate-100 flex flex-col z-0">
        <MapExplorer 
          :destinations="filteredDestinations"
          :selectedDestination="selectedDestination"
          @select-destination="handleMapSelection"
          :selectedCategory="selectedCategory"
          @select-category="selectedCategory = $event"
          :filters="filters"
          @update-filters="filters = $event"
          :itineraryDestinations="itineraryDestinations"
        />

        <!-- Floating Multi-City Trip Builder & AI Route Optimizer Bar -->
        <div v-if="itineraryDestinations.length > 0" class="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 flex items-center gap-2 md:gap-3 w-[95%] sm:w-[90%] md:w-auto max-w-2xl">
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

          <!-- AI Route Optimizer Button (Active when 2+ stops) -->
          <button 
            v-if="itineraryDestinations.length >= 2"
            @click="handleOptimizeRoute"
            :disabled="isOptimizingRoute"
            class="bg-slate-100 hover:bg-slate-200 text-[#002D67] border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-none shadow-xs disabled:opacity-50"
            title="AI orders stops to minimize train travel time"
          >
            <Loader2 v-if="isOptimizingRoute" :size="13" class="animate-spin text-[#01879C]" />
            <Wand2 v-else :size="13" class="text-[#01879C]" />
            <span class="hidden sm:inline">AI Optimize</span>
          </button>

          <!-- Generate Trip Button -->
          <button 
            @click="isOnePagerOpen = true"
            class="bg-[#01879C] hover:bg-[#01306A] text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 flex-none shadow-md"
          >
            <Sparkles :size="15" /> 
            <span>Generate Trip</span>
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

      <!-- Details Panel (Right Sidebar on Desktop / Modal Drawer on Mobile) -->
      <div 
        v-if="selectedDestination" 
        class="fixed inset-y-0 right-0 top-14 sm:top-16 md:static md:inset-auto w-full md:w-[400px] lg:w-[440px] flex-none bg-white border-l border-slate-200 z-[70] md:z-auto shadow-2xl md:shadow-none flex flex-col overflow-hidden transition-all duration-300"
      >
        <DetailsPanel 
          :destination="selectedDestination"
          :itineraryDestinations="itineraryDestinations"
          @update-itinerary="itineraryDestinations = $event"
          @close="selectedDestinationId = null"
          @open-one-pager="isOnePagerOpen = true"
        />
      </div>

    </div>

    <!-- TrainExplore AI Copilot Drawer -->
    <AiCopilotDrawer 
      :isOpen="isCopilotOpen"
      :destinations="destinations"
      :searchOrigin="searchOrigin"
      :itineraryDestinations="itineraryDestinations"
      :messages="chatMessages"
      @close="isCopilotOpen = false"
      @update-messages="chatMessages = $event"
      @trigger-action="handleCopilotAction"
      @select-destination="selectedDestinationId = $event"
      @toggle-destination="toggleItineraryDestination"
    />

    <!-- Itinerary OnePager Dashboard with TrainExplore AI Assistant -->
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


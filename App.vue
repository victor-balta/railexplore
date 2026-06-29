<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import MapExplorer from './components/MapExplorer.vue';
import ItineraryOnePager from './components/ItineraryOnePager.vue';
import { INITIAL_DESTINATIONS, getConnectedCities } from './constants';
import { CategoryType, TrainDeal, FilterState } from './types';
import { Sparkles, X, Train, Calendar, Users, Search, MapPin, ArrowRight, Plus, Check, Loader2, Navigation } from '@lucide/vue';
import { parseItineraryQuery } from './services/aiService';
import DetailsPanel from './components/DetailsPanel.vue';

const destinations = ref<TrainDeal[]>(INITIAL_DESTINATIONS);
const selectedDestinationId = ref<string | null>(null);
const selectedCategory = ref<CategoryType | 'All'>('All');
const aiInput = ref('');
const isAiLoading = ref(false);
const searchOrigin = ref("Berlin");
const isLocating = ref(false);
const searchDestination = ref("Anywhere");
const searchQuery = ref("Anywhere");
const itineraryDestinations = ref<TrainDeal[]>([]);
const isOnePagerOpen = ref(false);
const filters = ref<FilterState>({
  maxDuration: 12,
  maxPrice: 500,
  directOnly: false
});

const selectedDestination = computed(() => {
  return destinations.value.find(d => d.id === selectedDestinationId.value) || null;
});

const handleSelectDestination = (id: string) => {
  selectedDestinationId.value = id;
};

const handleMapSelection = (dest: TrainDeal) => {
  selectedDestinationId.value = dest.id;
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

    return matchesCategory && matchesPrice && matchesSearch && matchesDuration && matchesDirect && matchesConnection;
  });
});

const sortedFilteredDestinations = computed(() => {
  return [...filteredDestinations.value].sort((a, b) => {
    if (a.id === selectedDestinationId.value) return -1;
    if (b.id === selectedDestinationId.value) return 1;
    return 0;
  });
});

const handleSearch = () => {
  searchQuery.value = searchDestination.value;
};

const handleAiSubmit = async () => {
  if (!aiInput.value.trim()) return;
  
  isAiLoading.value = true;
  
  try {
    const cityNames = await parseItineraryQuery(aiInput.value, destinations.value);
    
    if (cityNames && cityNames.length > 0) {
      // Map city names back to TrainDeal objects
      const matchedDestinations: TrainDeal[] = [];
      
      for (const cityName of cityNames) {
        const match = destinations.value.find(d => 
          d.destinationName.toLowerCase() === cityName.toLowerCase()
        );
        if (match) {
          matchedDestinations.push(match);
        }
      }
      
      if (matchedDestinations.length > 0) {
        itineraryDestinations.value = matchedDestinations;
        isOnePagerOpen.value = true;
        aiInput.value = '';
      } else {
        alert("Couldn't find those destinations. Please try different cities.");
      }
    } else {
      alert("Couldn't understand the itinerary. Please try describing it differently.");
    }
  } catch (error) {
    console.error("Error generating trip:", error);
    alert("Something went wrong while generating your trip.");
  } finally {
    isAiLoading.value = false;
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
    location: { lat: 52.5200, lng: 13.4050 }, // Default fallback
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
    
    <!-- Top Navigation / Search Bar -->
    <header class="flex-none bg-white border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between shadow-sm relative">
      <div class="flex items-center gap-2 text-blue-600 font-medium text-xl tracking-tight">
        <Train class="fill-current" :size="24" />
        <span class="text-slate-700 hidden sm:inline-block">Travel Notes</span> 
        <span class="hidden sm:inline-block">AI</span> 
        <span class="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 font-bold hidden md:inline-block">Deals (beta)</span>
      </div>
      
      <div class="flex-1 max-w-2xl mx-2 sm:mx-4 md:mx-8 relative">
        <div class="flex items-center gap-2 bg-slate-100 pl-3 pr-1.5 sm:pl-4 sm:pr-1.5 h-10 sm:h-11 rounded-full shadow-inner border border-slate-200/60 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
          <Sparkles :size="16" class="text-blue-500 flex-none sm:w-[16px] sm:h-[16px]" />
          <input 
            type="text" 
            v-model="aiInput"
            @keydown.enter="handleAiSubmit"
            :disabled="isAiLoading"
            class="text-xs sm:text-sm font-medium bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-500 disabled:opacity-50 h-full"
            placeholder="Describe your dream itinerary..."
          />
          <button 
            v-if="aiInput"
            @click="handleAiSubmit" 
            :disabled="isAiLoading"
            class="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors flex-none"
          >
            <template v-if="isAiLoading">
              <Loader2 :size="14" class="animate-spin" /> 
              <span class="hidden sm:inline">Generating...</span>
            </template>
            <template v-else>
              <span class="hidden sm:inline">Generate my trip</span>
              <span class="sm:hidden">Go</span> 
              <ArrowRight :size="14" />
            </template>
          </button>
        </div>
      </div>

      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 flex-none">
        AI
      </div>
    </header>

    <div class="flex flex-col md:flex-row flex-1 overflow-hidden relative">
      
      <!-- Left Sidebar: Deals List -->
      <div class="w-full md:w-[400px] lg:w-[450px] flex-none bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-[50vh] md:h-full">
        <div class="p-4 border-b border-slate-100 flex-none">
          <h2 class="text-lg font-medium text-slate-800 mb-4">Explore train journeys</h2>
          
          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Starting Point</label>
            <div class="relative flex items-center">
              <div class="absolute left-3 text-slate-400">
                <MapPin :size="16" />
              </div>
              <input 
                type="text" 
                v-model="searchOrigin"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-10 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                placeholder="Where are you starting?"
              />
              <button 
                @click="handleGeolocation"
                :disabled="isLocating"
                class="absolute right-2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                title="Use current location"
              >
                <Loader2 v-if="isLocating" :size="16" class="animate-spin" />
                <Navigation v-else :size="16" />
              </button>
            </div>
          </div>

          <p class="text-sm text-slate-500 mb-3">Train travel • 1 passenger</p>
          <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button 
              @click="filters.maxDuration = filters.maxDuration === 3 ? 12 : 3"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border"
              :class="filters.maxDuration === 3 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            >
              ⚡ Quick Escapes (&lt;3h)
            </button>
            <button 
              @click="filters.directOnly = !filters.directOnly"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border"
              :class="filters.directOnly ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            >
              Direct Trains Only
            </button>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          <div 
            v-for="dest in sortedFilteredDestinations"
            :key="dest.id"
            :id="`deal-${dest.id}`"
            @click="handleSelectDestination(dest.id)"
            class="group flex gap-4 p-3 rounded-2xl cursor-pointer transition-all border"
            :class="selectedDestinationId === dest.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'"
          >
            <div class="w-24 h-24 rounded-xl overflow-hidden flex-none relative">
              <img :src="dest.imageUrl" :alt="dest.destinationName" @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-1 right-1 bg-white/90 backdrop-blur text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-700">
                {{ dest.duration }}
              </div>
            </div>
            <div class="flex-1 py-1 flex flex-col justify-between">
              <div>
                <h3 class="font-medium text-slate-900 leading-tight">{{ dest.destinationName }}</h3>
                <p class="text-xs text-slate-500 mt-0.5">{{ dest.outboundDate }} - {{ dest.returnDate }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ dest.transfers === 0 ? 'Direct' : `${dest.transfers} transfer(s)` }} • {{ dest.trainOperator }}</p>
              </div>
              <div class="flex justify-between items-end mt-2">
                <div class="text-lg font-medium text-slate-900">
                  ${{ dest.price }}
                </div>
                <button
                  @click.stop="toggleItineraryDestination(dest)"
                  class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                  :class="itineraryDestinations.some(d => d.id === dest.id) ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
                >
                  <template v-if="itineraryDestinations.some(d => d.id === dest.id)">
                    <Check :size="14" /> Added
                  </template>
                  <template v-else>
                    <Plus :size="14" /> Add to Trip
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Area: Map Explorer -->
      <div class="flex-1 w-full relative bg-slate-100 flex flex-col z-0">
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
      </div>

      <!-- Floating Trip Builder Bar -->
      <div v-if="itineraryDestinations.length > 0" class="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white rounded-full shadow-2xl border border-slate-200 p-2 flex items-center gap-2 md:gap-4 animate-in slide-in-from-bottom-10 w-[95%] sm:w-[90%] md:w-auto max-w-2xl">
        <div class="flex items-center gap-2 font-medium text-slate-700 pl-3 md:pl-4 flex-1 overflow-x-auto scrollbar-hide whitespace-nowrap text-sm">
          <span class="text-blue-600 flex-none"><Train :size="18" /></span>
          {{ searchOrigin }}
          
          <template v-for="d in itineraryDestinations" :key="d.id">
            <ArrowRight :size="16" class="text-slate-400 flex-none" />
            <span>{{ d.destinationName }}</span>
          </template>
          
          <button 
            @click="addReturnToOrigin"
            class="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded-full flex-none ml-2"
          >
            <Plus :size="12" /> Return to {{ searchOrigin }}
          </button>
        </div>
        <button 
          @click="isOnePagerOpen = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 md:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 flex-none shadow-md"
        >
          <Sparkles :size="16" /> <span>Generate my trip</span>
        </button>
        <button 
          @click="itineraryDestinations = []"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors mr-1 flex-none"
          title="Clear Trip"
        >
          <X :size="16" />
        </button>
      </div>

    </div>

    <!-- Details Overlay Panel (Shows when a deal is selected) -->
    <div v-if="selectedDestination" class="absolute top-16 right-0 bottom-0 w-full md:w-[450px] lg:w-[500px] bg-white border-l border-slate-200 z-[70] shadow-2xl animate-in slide-in-from-right duration-300">
      <DetailsPanel 
        :destination="selectedDestination"
        :itineraryDestinations="itineraryDestinations"
        @update-itinerary="itineraryDestinations = $event"
        @close="selectedDestinationId = null"
        @open-one-pager="isOnePagerOpen = true"
      />
    </div>

    <!-- Itinerary OnePager Dashboard -->
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

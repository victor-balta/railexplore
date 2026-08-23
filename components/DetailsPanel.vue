<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { TrainDeal, Accommodation, Activity, TrainScheduleOption, PriceInsight } from '../types';
import { generateTripAdvice, getAccommodations, getActivities } from '../services/aiService';
import { MOCK_ACCOMMODATION, MOCK_ACTIVITIES, generateMockSchedules, getPriceInsightForDeal } from '../constants';
import { 
  X, Plus, Check, Train, Sun, Cloud, CloudRain, 
  Clock, Star, ArrowRight, RefreshCw, 
  Thermometer, Building2, Camera, Info, Leaf, 
  Sparkles, Wifi, Zap, Coffee, MapPin, Utensils, 
  Compass, Luggage
} from '@lucide/vue';

const props = defineProps<{
  destination: TrainDeal;
  itineraryDestinations: TrainDeal[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update-itinerary', destinations: TrainDeal[]): void;
  (e: 'open-one-pager'): void;
  (e: 'ask-copilot', prompt: string): void;
}>();

// Active Tab: 'trains' | 'sights' | 'stays' | 'guide'
const activeTab = ref<'trains' | 'sights' | 'stays' | 'guide'>('trains');

const aiTip = ref("");
const loadingTip = ref(false);
const stays = ref<Accommodation[] | null>(null);
const activities = ref<Activity[] | null>(null);
const loadingStays = ref(false);
const loadingActivities = ref(false);

const schedules = computed<TrainScheduleOption[]>(() => {
  return generateMockSchedules(props.destination.originName, props.destination);
});

const priceInsight = computed<PriceInsight>(() => {
  return getPriceInsightForDeal(props.destination);
});

const isInItinerary = computed(() => 
  props.itineraryDestinations.some(d => d.id === props.destination.id)
);

const itineraryIndex = computed(() => {
  const idx = props.itineraryDestinations.findIndex(d => d.id === props.destination.id);
  return idx >= 0 ? idx + 1 : null;
});

const toggleItinerary = () => {
  if (isInItinerary.value) {
    emit('update-itinerary', props.itineraryDestinations.filter(d => d.id !== props.destination.id));
  } else {
    emit('update-itinerary', [...props.itineraryDestinations, props.destination]);
  }
};

const handleImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80';
};

const loadTripAdvice = () => {
  loadingTip.value = true;
  aiTip.value = "";
  
  generateTripAdvice(props.destination, "")
    .then(tip => {
      aiTip.value = tip;
    })
    .catch(() => {
      aiTip.value = "A captivating European destination easily accessible via scenic high-speed and regional rail lines.";
    })
    .finally(() => {
      loadingTip.value = false;
    });
};

const loadStays = () => {
  if (stays.value) return;
  loadingStays.value = true;
  getAccommodations(props.destination)
    .then(data => {
      if (data.length > 0) stays.value = data;
      else stays.value = MOCK_ACCOMMODATION[props.destination.id] || MOCK_ACCOMMODATION['default'];
    })
    .catch(() => {
      stays.value = MOCK_ACCOMMODATION[props.destination.id] || MOCK_ACCOMMODATION['default'];
    })
    .finally(() => {
      loadingStays.value = false;
    });
};

const loadActivities = () => {
  if (activities.value) return;
  loadingActivities.value = true;
  getActivities(props.destination)
    .then(data => {
      if (data.length > 0) activities.value = data;
      else activities.value = MOCK_ACTIVITIES[props.destination.id] || MOCK_ACTIVITIES['default'];
    })
    .catch(() => {
      activities.value = MOCK_ACTIVITIES[props.destination.id] || MOCK_ACTIVITIES['default'];
    })
    .finally(() => {
      loadingActivities.value = false;
    });
};

const handleTabChange = (tab: 'trains' | 'sights' | 'stays' | 'guide') => {
  activeTab.value = tab;
  if (tab === 'sights') loadActivities();
  if (tab === 'stays') loadStays();
};

watch(() => props.destination, () => {
  stays.value = null;
  activities.value = null;
  activeTab.value = 'trains';
  loadTripAdvice();
}, { immediate: true });

const getTemperatureHeight = (temp: number) => {
  const percentage = Math.max(20, Math.min(100, (temp / 32) * 100));
  return `${percentage}%`;
};

const getTemperatureColor = (temp: number) => {
  return temp > 18 ? 'bg-amber-400' : 'bg-blue-400';
};

// Current weather summary for hero pill
const currentWeather = computed(() => {
  if (props.destination.weather && props.destination.weather.length > 0) {
    return props.destination.weather[0];
  }
  return { temp: 21, condition: 'sunny' };
});

const getLocalFoodTip = (cityName: string) => {
  const map: Record<string, { dish: string; note: string }> = {
    'Prague': { dish: 'Svíčková & Pilsner Urquell', note: 'Braised beef in creamy vegetable sauce with bread dumplings' },
    'Vienna': { dish: 'Wiener Schnitzel & Sachertorte', note: 'Iconic golden veal schnitzel paired with classic Viennese coffee' },
    'Amsterdam': { dish: 'Warm Stroopwafels & Bitterballen', note: 'Fresh street stroopwafels and crispy savory croquettes' },
    'Paris': { dish: 'Fresh Croissants & Duck Confit', note: 'Artisanal buttery bakery goods and classic Parisian bistro dining' },
    'Munich': { dish: 'Weißwurst & Pretzel', note: 'Traditional Bavarian breakfast served with sweet mustard' },
    'Zurich': { dish: 'Zürcher Geschnetzeltes & Fondue', note: 'Sliced veal in white wine cream sauce with crispy Rösti' }
  };
  return map[cityName] || { dish: 'Local Regional Delicacy', note: 'Authentic regional dishes from local markets and historic taverns' };
};
</script>

<template>
  <div class="h-full flex flex-col bg-white overflow-hidden w-full font-sans">
    
    <!-- 1. Hero Header Banner -->
    <div class="relative h-[180px] flex-none overflow-hidden">
      <img 
        :src="destination.imageUrl" 
        :alt="destination.destinationName" 
        @error="handleImgError" 
        class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#002D67]/95 via-[#01306A]/60 to-transparent"></div>
      
      <!-- Close Button -->
      <button 
        @click="emit('close')"
        class="absolute top-3.5 right-3.5 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all z-50 shadow-lg border border-white/10"
        title="Close Panel"
      >
        <X :size="16" />
      </button>

      <!-- City Info & Hero Badges -->
      <div class="absolute bottom-3.5 left-4 right-4 text-white">
        <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span class="bg-[#01879C]/90 backdrop-blur-md text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            {{ destination.category }}
          </span>
          <span v-if="destination.co2SavingsPercent" class="bg-[#259DAD]/90 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-white shadow-xs">
            <Leaf :size="10" /> -{{ destination.co2SavingsPercent }}% CO₂
          </span>
          <!-- Weather Pill -->
          <span class="bg-black/40 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-[#8DDCDE] border border-white/10">
            <Sun v-if="currentWeather.condition === 'sunny'" :size="10" class="text-amber-300" />
            <Cloud v-else :size="10" class="text-slate-300" />
            {{ currentWeather.temp }}°C
          </span>
        </div>
        
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight drop-shadow-xs">
              {{ destination.destinationName }}
            </h2>
            <p class="text-xs text-slate-300 font-medium mt-0.5">
              {{ destination.destinationCountry }} • From ${{ destination.price }} direct
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Google Flights Style Underline Tab Navigation -->
    <div class="flex-none bg-white border-b border-slate-200 px-4 flex gap-6 overflow-x-auto scrollbar-hide text-xs font-semibold">
      <button 
        @click="handleTabChange('trains')"
        class="py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'trains' 
          ? 'border-[#01306A] text-[#01306A] font-bold' 
          : 'border-transparent text-slate-500 hover:text-slate-900'"
      >
        <Train :size="14" />
        <span>Trains</span>
      </button>

      <button 
        @click="handleTabChange('sights')"
        class="py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'sights' 
          ? 'border-[#01306A] text-[#01306A] font-bold' 
          : 'border-transparent text-slate-500 hover:text-slate-900'"
      >
        <Camera :size="14" />
        <span>Sights & Food</span>
      </button>

      <button 
        @click="handleTabChange('stays')"
        class="py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'stays' 
          ? 'border-[#01306A] text-[#01306A] font-bold' 
          : 'border-transparent text-slate-500 hover:text-slate-900'"
      >
        <Building2 :size="14" />
        <span>Stays</span>
      </button>

      <button 
        @click="handleTabChange('guide')"
        class="py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'guide' 
          ? 'border-[#01306A] text-[#01306A] font-bold' 
          : 'border-transparent text-slate-500 hover:text-slate-900'"
      >
        <Sun :size="14" />
        <span>Weather & Info</span>
      </button>
    </div>

    <!-- 3. Scrollable Tab Contents -->
    <div class="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 bg-white">

      <!-- ================= TAB 1: TRAINS & TIMETABLE ================= -->
      <div v-if="activeTab === 'trains'" class="space-y-3 animate-in fade-in duration-200">
        
        <!-- Google Flights Style Price Insights Card -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-slate-900">Price Insights</span>
            <span 
              class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              :class="priceInsight.status === 'low' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'"
            >
              {{ priceInsight.status === 'low' ? 'Prices currently low' : 'Prices typical' }}
            </span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            {{ priceInsight.advice }}
          </p>
          <div class="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Typical: ${{ priceInsight.typicalMin }} – ${{ priceInsight.typicalMax }}</span>
            <span class="font-bold text-slate-900">Current from ${{ priceInsight.currentPrice }}</span>
          </div>
        </div>

        <!-- Scenic Tip Card -->
        <div v-if="destination.scenicHighlight" class="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
          <span class="text-base">🪟</span>
          <div class="text-xs text-slate-700 leading-relaxed">
            <span class="font-semibold text-slate-900">Scenic Route:</span> {{ destination.scenicHighlight }}
          </div>
        </div>

        <!-- Departures Header -->
        <div class="flex items-center justify-between pt-1">
          <h3 class="text-xs font-bold text-slate-900">
            Departing Trains Today
          </h3>
          <span class="text-xs text-slate-500">{{ schedules.length }} departures</span>
        </div>

        <!-- Schedule Options List (Google Flights style rows) -->
        <div class="space-y-2">
          <div 
            v-for="sched in schedules" 
            :key="sched.id"
            class="bg-white rounded-xl p-3 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all relative group"
          >
            <!-- Badge: Best / Cheapest / Fastest -->
            <div v-if="sched.isBest || sched.isCheapest || sched.isFastest" class="mb-1.5 flex gap-1.5">
              <span v-if="sched.isBest" class="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">Best Option</span>
              <span v-if="sched.isCheapest" class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">Cheapest</span>
              <span v-if="sched.isFastest" class="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">Fastest</span>
            </div>

            <!-- Schedule times & pricing -->
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-bold text-slate-900">
                  {{ sched.departureTime }} – {{ sched.arrivalTime }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ sched.originStation }} → {{ sched.destinationStation }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-base font-bold text-slate-900">${{ sched.price }}</div>
                <span class="text-xs text-slate-500">{{ sched.seatClass }}</span>
              </div>
            </div>

            <!-- Operator, transfers, duration -->
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-slate-800">{{ sched.operator }}</span>
                <span>•</span>
                <span class="text-slate-500">{{ sched.trainNumber }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs">
                <span class="font-medium text-slate-700">{{ sched.duration }}</span>
                <span>•</span>
                <span :class="sched.transfers === 0 ? 'text-emerald-700 font-semibold' : 'text-slate-500'">
                  {{ sched.transfers === 0 ? 'Nonstop' : `${sched.transfers} stop` }}
                </span>
              </div>
            </div>

            <!-- Onboard amenities -->
            <div class="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-slate-50 text-slate-400 text-[11px]">
              <span class="flex items-center gap-1 text-slate-500"><Wifi :size="11" /> WiFi</span>
              <span class="flex items-center gap-1 text-slate-500"><Zap :size="11" /> Power</span>
              <span class="flex items-center gap-1 text-slate-500"><Coffee :size="11" /> Bistro</span>
              <span class="flex items-center gap-1 text-slate-500 ml-auto font-medium">
                <Leaf :size="11" class="text-emerald-600" /> {{ sched.co2Kg }} kg CO₂
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 2: SIGHTS & FOOD ================= -->
      <div v-else-if="activeTab === 'sights'" class="space-y-3.5 animate-in fade-in duration-200">
        
        <!-- AI City Highlight Spark -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
          <div class="flex items-center gap-1.5 mb-1.5 text-slate-900 font-bold text-xs">
            <Sparkles :size="14" class="text-[#01879C]" />
            <span>Why You'll Love {{ destination.destinationName }}</span>
          </div>
          <div v-if="loadingTip" class="flex items-center gap-2 text-xs text-slate-500 py-1">
            <RefreshCw :size="12" class="animate-spin" /> Loading insights...
          </div>
          <p v-else class="text-xs text-slate-600 leading-relaxed">
            {{ aiTip }}
          </p>
        </div>

        <!-- Local Food Spark -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-start gap-2.5">
          <div class="p-1.5 bg-slate-200/80 rounded-lg text-slate-700 flex-none">
            <Utensils :size="15" />
          </div>
          <div>
            <div class="text-xs font-bold text-slate-900">Local Food & Drink</div>
            <div class="text-xs font-semibold text-slate-800 mt-0.5">{{ getLocalFoodTip(destination.destinationName).dish }}</div>
            <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ getLocalFoodTip(destination.destinationName).note }}</p>
          </div>
        </div>

        <!-- Sights Header -->
        <div class="flex items-center justify-between pt-1">
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1">
            <Camera :size="12" /> Top Attractions
          </h3>
          <span v-if="activities" class="text-xs text-slate-500">{{ activities.length }} spots</span>
        </div>

        <!-- Sights Loading State -->
        <div v-if="loadingActivities" class="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
          <RefreshCw :size="24" class="animate-spin text-[#01306A]" />
          <span class="text-xs font-medium">Curating top experiences...</span>
        </div>

        <!-- Sights List -->
        <div v-else-if="activities" class="space-y-2">
          <div 
            v-for="act in activities" 
            :key="act.id" 
            class="flex gap-3 bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all group"
          >
            <img 
              :src="act.image" 
              @error="handleImgError" 
              class="w-18 h-18 rounded-lg object-cover flex-none group-hover:scale-105 transition-transform duration-300" 
            />
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h4 class="text-xs font-bold text-slate-900 truncate">{{ act.title }}</h4>
                <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span class="flex items-center gap-1 font-medium"><Clock :size="10" /> {{ act.duration }}</span>
                  <span>•</span>
                  <span class="flex items-center gap-0.5 font-bold text-amber-600">
                    <Star :size="10" class="fill-amber-400 text-amber-400" /> {{ act.rating }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-900">
                  {{ act.price > 0 ? `$${act.price}` : 'Free Entry' }}
                </span>
                <span class="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  Must-see
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 3: WHERE TO STAY ================= -->
      <div v-else-if="activeTab === 'stays'" class="space-y-3 animate-in fade-in duration-200">
        
        <!-- Rail Traveler Stay Tip -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-start gap-2.5">
          <div class="p-1.5 bg-slate-200/80 rounded-lg text-slate-700 flex-none">
            <Compass :size="15" />
          </div>
          <div>
            <div class="text-xs font-bold text-slate-900">Neighborhood Advice</div>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Stay in the <strong>Historic Old Town</strong> for scenic walkability, or within a <strong>5–10 min walk of the Central Train Station</strong> for seamless early departures.
            </p>
          </div>
        </div>

        <!-- Stays Header -->
        <div class="flex items-center justify-between pt-1">
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1">
            <Building2 :size="12" /> Top Rated Stays
          </h3>
          <span v-if="stays" class="text-xs text-slate-500">{{ stays.length }} options</span>
        </div>

        <!-- Stays Loading State -->
        <div v-if="loadingStays" class="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
          <RefreshCw :size="24" class="animate-spin text-[#01306A]" />
          <span class="text-xs font-medium">Finding best rail-friendly hotels...</span>
        </div>

        <!-- Stays List -->
        <div v-else-if="stays" class="space-y-2">
          <div 
            v-for="acc in stays" 
            :key="acc.id" 
            class="flex gap-3 bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all group"
          >
            <img 
              :src="acc.image" 
              @error="handleImgError" 
              class="w-18 h-18 rounded-lg object-cover flex-none group-hover:scale-105 transition-transform duration-300" 
            />
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h4 class="text-xs font-bold text-slate-900 truncate">{{ acc.name }}</h4>
                <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span class="flex items-center gap-0.5 font-semibold text-slate-700">
                    <Star :size="10" class="fill-amber-400 text-amber-400" /> {{ acc.rating }}
                  </span>
                  <span>•</span>
                  <span class="text-emerald-700 font-medium">
                    &lt;10m to Station
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-900">
                  ${{ acc.price }} <span class="font-normal text-[10px] text-slate-400">/ night</span>
                </span>
                <span class="text-xs text-[#01306A] font-semibold hover:underline">
                  View stay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 4: WEATHER & TRAVEL GUIDE ================= -->
      <div v-else-if="activeTab === 'guide'" class="space-y-3 animate-in fade-in duration-200">
        
        <!-- 5-Day Forecast Strip -->
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Thermometer :size="14" class="text-slate-500" /> 5-Day Forecast
            </h3>
            <span class="text-xs font-semibold text-slate-700">Current: {{ currentWeather.temp }}°C</span>
          </div>

          <div class="flex gap-2 justify-between items-end h-28 pt-2">
            <div v-for="(w, idx) in destination.weather" :key="idx" class="flex flex-col items-center justify-end h-full gap-1.5 w-full">
              <Sun v-if="w.condition === 'sunny'" :size="16" class="text-amber-400 fill-amber-400" />
              <Cloud v-else-if="w.condition === 'cloudy'" :size="16" class="text-slate-400 fill-slate-100" />
              <CloudRain v-else-if="w.condition === 'rainy'" :size="16" class="text-blue-400" />
              
              <div 
                class="w-3 rounded-t-full relative flex-none transition-all duration-500 bg-slate-300" 
                :style="{ height: getTemperatureHeight(w.temp) }"
              ></div>
              <span class="text-xs font-bold text-slate-800">{{ w.temp }}°</span>
              <span class="text-[10px] text-slate-400 font-bold uppercase">{{ w.date.split(' ')[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Best Time to Visit Card -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-start gap-2.5">
          <div class="p-1.5 bg-slate-200/80 rounded-lg text-slate-700 flex-none">
            <Sun :size="15" />
          </div>
          <div>
            <div class="text-xs font-bold text-slate-900">Prime Season to Visit</div>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
              <strong>May through October</strong> offers comfortable weather for walking tours, outdoor terraces, and scenic vistas.
            </p>
          </div>
        </div>

        <!-- Packing & Transit Tips -->
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
          <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Luggage :size="14" class="text-slate-600" /> Train Traveler Quick Tips
          </div>
          <ul class="text-xs text-slate-600 space-y-1.5 pl-1">
            <li class="flex items-start gap-1.5">
              <span class="text-[#01306A] font-bold">•</span>
              <span><strong>Station Lockers:</strong> Luggage lockers available at central station.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-[#01306A] font-bold">•</span>
              <span><strong>Local Transit:</strong> City center connected by direct tram/metro lines.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-[#01306A] font-bold">•</span>
              <span><strong>Power Outlets:</strong> Europlug Type C/F onboard trains and hotels.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>

    <!-- 4. Google Flights Style Bottom Action Footer -->
    <div class="p-3.5 border-t border-slate-200 bg-white flex-none flex items-center gap-2.5 z-20">
      
      <!-- Add / Remove from Trip Button -->
      <button 
        @click="toggleItinerary"
        class="flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        :class="isInItinerary 
          ? 'bg-[#01306A] text-white hover:bg-[#002D67]' 
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
      >
        <template v-if="isInItinerary">
          <Check :size="15" /> Added to Trip (Stop #{{ itineraryIndex }})
        </template>
        <template v-else>
          <Plus :size="15" /> Add to Trip
        </template>
      </button>

      <!-- Generate Itinerary Button -->
      <button 
        @click="emit('open-one-pager')"
        class="flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold bg-[#01879C] hover:bg-[#01306A] text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Sparkles :size="15" />
        <span>Generate Plan</span>
      </button>

    </div>

  </div>
</template>


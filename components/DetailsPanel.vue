<script setup lang="ts">
import { ref, computed } from 'vue';
import { TrainDeal, TrainScheduleOption, PriceInsight } from '../types';
import { generateMockSchedules, getPriceInsightForDeal } from '../constants';
import PriceTrackerModal from './PriceTrackerModal.vue';
import { 
  X, Plus, Check, Train, Sun, Cloud, 
  ArrowRight, ArrowLeft, Leaf, 
  Sparkles, Wifi, Zap, Coffee, MapPin, 
  Bell, TrendingDown, ExternalLink, ShieldCheck
} from '@lucide/vue';

const props = defineProps<{
  destination: TrainDeal;
  itineraryDestinations: TrainDeal[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update-itinerary', destinations: TrainDeal[]): void;
  (e: 'open-one-pager'): void;
}>();

const isPriceTrackerOpen = ref(false);
const isTrackingActive = ref(false);

// Check if route is already tracked in localStorage
const checkTrackingStatus = () => {
  if (typeof window !== 'undefined') {
    const key = `trainexplore_alert_${props.destination.originName}_${props.destination.destinationName}`;
    isTrackingActive.value = !!localStorage.getItem(key);
  }
};
checkTrackingStatus();

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

const currentWeather = computed(() => {
  if (props.destination.weather && props.destination.weather.length > 0) {
    return props.destination.weather[0];
  }
  return { temp: 21, condition: 'sunny' };
});
</script>

<template>
  <div class="h-full flex flex-col bg-white overflow-hidden text-slate-800">
    
    <!-- 1. Hero Destination Image & Info Header -->
    <div class="relative h-44 sm:h-52 flex-none overflow-hidden group">
      <img 
        :src="destination.imageUrl" 
        :alt="destination.destinationName" 
        @error="handleImgError" 
        class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#002D67]/95 via-[#01306A]/60 to-transparent"></div>
      
      <!-- Mobile Back Button -->
      <button 
        @click="emit('close')"
        class="md:hidden absolute top-3.5 left-3.5 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all z-50 shadow-lg border border-white/10"
        title="Back"
      >
        <ArrowLeft :size="16" />
      </button>

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
            Train Deal
          </span>
          <span v-if="destination.co2SavingsPercent" class="bg-[#259DAD]/90 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-white shadow-xs">
            <Leaf :size="10" /> -{{ destination.co2SavingsPercent }}% CO₂ vs flight
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
              {{ destination.destinationCountry }} • From ${{ destination.price }} {{ destination.isDirect !== false && destination.transfers === 0 ? 'direct' : (destination.transferStation ? `via ${destination.transferStation}` : 'connecting') }} • {{ destination.duration }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Google Flights Style Price Tracking Bar -->
    <div class="flex-none bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <div class="p-1.5 bg-white border border-slate-200 rounded-lg text-[#01306A] shadow-2xs">
          <Bell :size="14" />
        </div>
        <div class="min-w-0">
          <span class="text-xs font-bold text-slate-900 block truncate">Track train prices</span>
          <span class="text-[11px] text-slate-500 block truncate">Get email alerts when fares drop</span>
        </div>
      </div>

      <button 
        @click="isPriceTrackerOpen = true"
        class="px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs flex-none"
        :class="isTrackingActive 
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
          : 'bg-white hover:bg-slate-100 text-[#01306A] border border-slate-200'"
      >
        <Check v-if="isTrackingActive" :size="12" />
        <Bell v-else :size="12" />
        <span>{{ isTrackingActive ? 'Tracking On' : 'Track Prices' }}</span>
      </button>
    </div>

    <!-- 3. Scrollable Train Content Body -->
    <div class="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3.5 bg-white">

      <!-- Destination Pitch & Station Info Card -->
      <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
        <p class="text-xs text-slate-700 leading-relaxed font-medium">
          {{ destination.description }}
        </p>
        <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
          <span v-if="destination.stationName" class="flex items-center gap-1 font-semibold text-slate-800">
            <MapPin :size="12" class="text-[#01879C]" /> {{ destination.stationName }}
          </span>
          <span v-if="destination.frequency" class="flex items-center gap-1 text-slate-600">
            <Train :size="12" class="text-slate-400" /> {{ destination.frequency }}
          </span>
          <span v-if="destination.tripType" class="bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold text-[#01306A]">
            {{ destination.tripType }}
          </span>
        </div>
      </div>

      <!-- Google Flights Style Price Insights Card -->
      <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-1.5">
            <TrendingDown :size="14" class="text-emerald-700" />
            <span class="text-xs font-bold text-slate-900">Price Insights</span>
          </div>
          <span 
            class="text-[10px] font-bold px-2 py-0.5 rounded-full"
            :class="priceInsight.status === 'low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'"
          >
            {{ priceInsight.status === 'low' ? 'Prices currently low' : 'Prices typical' }}
          </span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ priceInsight.advice }}
        </p>
        <div class="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>Typical range: ${{ priceInsight.typicalMin }} – ${{ priceInsight.typicalMax }}</span>
          <span class="font-bold text-slate-900">Lowest: ${{ priceInsight.currentPrice }}</span>
        </div>
      </div>

      <!-- Scenic Tip Card -->
      <div v-if="destination.scenicHighlight" class="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-start gap-2.5">
        <span class="text-base">🪟</span>
        <div class="text-xs text-slate-700 leading-relaxed">
          <span class="font-semibold text-slate-900">Scenic Corridor:</span> {{ destination.scenicHighlight }}
        </div>
      </div>

      <!-- Departures Header -->
      <div class="flex items-center justify-between pt-1">
        <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Train :size="14" class="text-[#01306A]" />
          <span>Available Train Departures</span>
        </h3>
        <span class="text-xs text-slate-500">{{ schedules.length }} departures</span>
      </div>

      <!-- Schedule Options List (Google Flights style rows) -->
      <div class="space-y-2.5">
        <div 
          v-for="sched in schedules" 
          :key="sched.id"
          class="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all relative group"
        >
          <!-- Badge: Best / Cheapest / Fastest -->
          <div v-if="sched.isBest || sched.isCheapest || sched.isFastest" class="mb-2 flex gap-1.5">
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
              <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin :size="11" class="text-slate-400" />
                <span>{{ sched.originStation }} → {{ sched.destinationStation }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-base font-bold text-slate-900">${{ sched.price }}</div>
              <span class="text-[11px] text-slate-500 font-medium">{{ sched.seatClass }}</span>
            </div>
          </div>

          <!-- Operator, transfers, duration -->
          <div class="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
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

          <!-- Amenities & Virail Deep-link Booking CTA -->
          <div class="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div class="flex items-center gap-2 text-slate-400">
              <span title="Free Wi-Fi" class="flex items-center gap-0.5"><Wifi :size="12" /> Wi-Fi</span>
              <span title="Power Sockets" class="flex items-center gap-0.5"><Zap :size="12" /> Power</span>
              <span title="Bistro / Restaurant" class="flex items-center gap-0.5"><Coffee :size="12" /> Bistro</span>
            </div>
            
            <a 
              href="https://www.virail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-xs font-bold text-[#01879C] hover:text-[#01306A] flex items-center gap-1 transition-colors"
            >
              <span>Book Ticket</span>
              <ExternalLink :size="12" />
            </a>
          </div>
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

      <!-- Journey Summary Button -->
      <button 
        @click="emit('open-one-pager')"
        class="flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold bg-[#01879C] hover:bg-[#01306A] text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Train :size="15" />
        <span>Journey Summary</span>
      </button>

    </div>

    <!-- Price Tracker Modal Dialog -->
    <PriceTrackerModal 
      v-if="isPriceTrackerOpen"
      :destination="destination"
      :originName="destination.originName"
      @close="isPriceTrackerOpen = false"
      @alert-saved="isTrackingActive = true"
    />

  </div>
</template>

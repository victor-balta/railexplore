<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { TrainDeal, Accommodation, Activity } from '../types';
import { 
  Train, MapPin, Calendar, Building, Ticket, ArrowRight, Download, Share2, X, Sun, Cloud, CloudRain, Clock, Euro, Sparkles, BedDouble, Navigation, Play, MessageCircle, Quote, Camera, Search, Users 
} from '@lucide/vue';
import { MOCK_ACCOMMODATION, MOCK_ACTIVITIES } from '../constants';
import ItineraryMap from './ItineraryMap.vue';

const props = defineProps<{
  destinations: TrainDeal[];
  searchOrigin: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const getMockSocialData = (destination: string, origin: string) => {
  return {
    trainTip: `The train ride from ${origin} to ${destination} is known for its scenic stretches. Grab a window seat and enjoy the changing landscapes!`,
    redditQuote: `Just got back from ${destination} and it blew my mind. Skip the tourist traps and just get lost in the side streets. Best trip ever.`,
    redditUser: `u/traveler_${destination.toLowerCase().substring(0,4)}99`,
    videoTitle: `48 Hours in ${destination} - A Cinematic VLOG`,
    videoThumb: `https://picsum.photos/seed/${destination.toLowerCase()}vlog/600/400`,
    highlights: [
      `Iconic architecture`,
      `Local culinary scene`,
      `Hidden neighborhood cafes`
    ]
  };
};

const generateMockConnections = (origin: string, dest: TrainDeal, date: string) => {
  let durationHours = 4;
  let durationMins = 30;
  const hMatch = dest.duration.match(/(\d+)h/);
  const mMatch = dest.duration.match(/(\d+)m/);
  if (hMatch) durationHours = parseInt(hMatch[1], 10);
  if (mMatch) durationMins = parseInt(mMatch[1], 10);

  return [8, 9, 11, 12, 13, 14, 15, 17].map(hour => {
    const startHour = hour;
    const startMin = 42;
    
    let endHour = startHour + durationHours;
    let endMin = startMin + durationMins;
    if (endMin >= 60) {
      endHour += Math.floor(endMin / 60);
      endMin = endMin % 60;
    }
    
    const formatTime = (h: number, m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    
    return {
      id: `${hour}`,
      departureTime: formatTime(startHour, startMin),
      arrivalTime: formatTime(endHour, endMin),
      originStation: origin.includes('Hbf') ? origin : `${origin} Hbf`,
      destStation: dest.destinationName.includes('Hbf') ? dest.destinationName : `${dest.destinationName} Hbf`,
      trainNumber: `${dest.trainOperator.split(' ')[0]} ${1000 + hour * 100 + 9}`,
      duration: dest.duration,
      transfers: dest.transfers === 0 ? 'direct' : `${dest.transfers} change(s)`,
      operator: dest.trainOperator,
      price: dest.price + (hour % 3) * 10
    };
  });
};

const loading = ref(true);
const editingSearchIndex = ref<number | null>(null);
const passengers = ref(1);
const refineInput = ref('');
const isRefining = ref(false);
const userRefinements = ref<string[]>([]);

// Simulate a quick AI generation/loading state for effect
watch(() => props.destinations, () => {
  if (props.destinations.length === 0) return;
  loading.value = true;
  const timer = setTimeout(() => {
    loading.value = false;
  }, 1200);
}, { immediate: true });

const handleRefine = () => {
  if (!refineInput.value.trim() || isRefining.value) return;
  const prompt = refineInput.value.trim();
  refineInput.value = '';
  isRefining.value = true;
  
  setTimeout(() => {
    userRefinements.value.push(prompt);
    isRefining.value = false;
  }, 900);
};

const handlePrint = () => {
  window.print();
};

const totalDays = computed(() => props.destinations.length * 2 + 1);
const totalPrice = computed(() => props.destinations.reduce((sum, dest) => sum + dest.price, 0));
const totalCo2Saved = computed(() => props.destinations.length * 52);
const estimatedStayTotal = computed(() => props.destinations.length * 115);
</script>

<template>
  <div v-if="destinations.length > 0" class="fixed inset-0 z-[1000] bg-[#F7F7F5] overflow-y-auto flex flex-col font-sans">
    <!-- Header Bar -->
    <div class="sticky top-0 z-50 bg-[#FAFBFB]/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2.5">
        <img src="/logo.png" alt="TrainExplore" class="h-9 sm:h-11 w-auto object-contain" />
        <span class="text-[#01879C] font-black text-[11px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 hidden sm:inline shadow-2xs">AI Itinerary</span>
      </div>
      <div class="flex items-center gap-2 sm:gap-3">
        <button @click="handlePrint" class="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-slate-200 hover:bg-[#E2F7F8] text-[#002D67] rounded-full text-xs sm:text-sm font-bold transition-colors shadow-xs whitespace-nowrap">
          <Download :size="16" class="text-[#01879C]" /> <span class="hidden sm:inline">Export PDF</span>
        </button>
        <button class="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-[#01879C] hover:bg-[#01306A] text-white rounded-full text-xs sm:text-sm font-bold transition-colors shadow-xs whitespace-nowrap">
          <Share2 :size="16" /> <span class="hidden sm:inline">Share Link</span>
        </button>
        <div class="w-px h-6 bg-slate-200 mx-0 sm:mx-1 hidden sm:block"></div>
        <button @click="emit('close')" class="p-2 sm:px-3 sm:py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full transition-colors shadow-xs flex-shrink-0 flex items-center justify-center">
          <X class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center">
      <div class="relative w-24 h-24 mb-8">
        <div class="absolute inset-0 border-4 border-[#8DDCDE]/40 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#01879C] rounded-full border-t-transparent animate-spin"></div>
        <img src="/logo-icon.png" class="absolute inset-0 m-auto w-12 h-12 object-contain" />
      </div>
      <h2 class="text-3xl font-black text-[#002D67] mb-3 tracking-tight">Crafting your journey...</h2>
      <p class="text-slate-500 text-lg flex items-center gap-2">
        <Sparkles :size="20" class="text-[#01879C]" />
        TrainExplore AI is sequencing optimal rail connections, stays, and scenic gems.
      </p>
    </div>

    <div v-else class="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-32">
      
      <!-- Hero Section -->
      <div class="mb-8 md:mb-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-[#002D67] border border-slate-200 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles :size="15" class="text-[#01879C]" />
          TrainExplore AI Curated Rail Journey
        </div>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-[#002D67] mb-4 tracking-tight leading-tight">
          The Great European <br class="hidden sm:block" /> Train Escape
        </h1>
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-600 text-sm sm:text-base font-medium">
          <div class="flex items-center gap-1.5"><MapPin :size="16" class="text-[#01879C]"/> {{ destinations.length }} Destinations</div>
          <div class="flex items-center gap-1.5"><Calendar :size="16" class="text-[#01879C]"/> ~{{ totalDays }} Days</div>
          <div class="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
            🌱 -88% CO₂ (~{{ totalCo2Saved }} kg saved vs flying)
          </div>
          <div class="flex items-center gap-1.5 font-black text-[#002D67] bg-[#FAFBFB] px-2.5 py-1 rounded-full border border-slate-200">
            💰 ~${{ totalPrice + estimatedStayTotal }} Est. Total
          </div>
        </div>
      </div>

      <!-- TrainExplore AI Interactive Refine Bar -->
      <div class="bg-gradient-to-r from-[#002D67] via-[#01306A] to-[#01879C] rounded-2xl p-4 sm:p-5 shadow-lg text-white mb-8">
        <div class="flex items-center gap-2 mb-2.5">
          <Sparkles :size="18" class="text-[#8DDCDE]" />
          <h3 class="font-bold text-sm sm:text-base">Refine this itinerary with TrainExplore AI</h3>
        </div>
        <form @submit.prevent="handleRefine" class="flex items-center gap-2">
          <input 
            v-model="refineInput"
            type="text"
            placeholder="e.g., 'Add a food tour on Day 2', 'Find budget hostels', 'Make it slower-paced'..."
            class="flex-1 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-slate-200 outline-none focus:bg-white focus:text-[#002D67] focus:placeholder:text-slate-400 transition-all shadow-inner"
            :disabled="isRefining"
          />
          <button 
            type="submit"
            :disabled="!refineInput.trim() || isRefining"
            class="px-4 py-2 bg-[#01879C] hover:bg-[#01306A] text-white disabled:opacity-50 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 flex-none shadow-md"
          >
            <RefreshCw v-if="isRefining" :size="14" class="animate-spin" />
            <span v-else>Update</span>
          </button>
        </form>

        <!-- Active Applied Refinements -->
        <div v-if="userRefinements.length > 0" class="mt-3 flex flex-wrap gap-1.5">
          <span 
            v-for="(refine, rIdx) in userRefinements" 
            :key="rIdx"
            class="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"
          >
            ✨ {{ refine }}
          </span>
        </div>
      </div>

      <!-- Route Overview -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-200 mb-10 md:mb-16 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <h3 class="text-lg sm:text-xl font-bold text-slate-800 mb-6 sm:mb-8 flex items-center gap-2">
          <Navigation class="text-blue-500" :size="20" />
          Journey Overview
        </h3>
        
        <div class="flex flex-wrap items-center gap-y-4 mb-8">
          <div class="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
            <div class="w-3 h-3 rounded-full bg-slate-800"></div>
            <span class="font-bold text-slate-800">{{ searchOrigin }}</span>
          </div>
          
          <template v-for="(dest, i) in destinations" :key="dest.id">
            <div class="flex-1 min-w-[40px] h-0.5 bg-slate-300 mx-2 relative">
              <ArrowRight :size="16" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 bg-white px-1" />
            </div>
            <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-full border-2 border-blue-100 shadow-sm">
              <div class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">{{ i + 1 }}</div>
              <span class="font-bold text-slate-800">{{ dest.destinationName }}</span>
            </div>
          </template>
        </div>

        <!-- Map Container -->
        <div class="w-full h-[180px] sm:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
          <ItineraryMap :destinations="destinations" />
        </div>
      </div>

      <!-- Legs of the Journey -->
      <div class="space-y-10 md:space-y-16">
        <div v-for="(dest, index) in destinations" :key="dest.id" class="relative">
          
          <!-- Connection / Travel Block -->
          <div class="flex items-stretch gap-0 md:gap-6 mb-8">
            <!-- Vertical Line Container - Hidden on mobile -->
            <div class="hidden md:flex flex-col items-center w-8 md:w-12">
              <div class="w-8 h-8 md:w-12 md:h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md z-10">
                <Train :size="18" class="md:w-6 md:h-6" />
              </div>
              <div class="w-1 flex-1 bg-slate-200 my-2 rounded-full"></div>
            </div>
            
            <div class="flex-1 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
              <!-- Search Header -->
              <div 
                @click="editingSearchIndex = index"
                class="bg-white border border-slate-200 rounded-lg p-3 mb-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-2 sm:gap-0"
              >
                <div class="flex items-start sm:items-center gap-3">
                  <Search :size="16" class="text-slate-400 mt-1 sm:mt-0 flex-shrink-0" />
                  <div>
                    <div class="text-xs text-slate-500 font-medium">Your search</div>
                    <div class="text-sm text-slate-800 font-bold flex flex-wrap items-center gap-1">
                      <span>{{ index === 0 ? searchOrigin : destinations[index - 1].destinationName }} to {{ dest.destinationName }}</span>
                      <span class="text-slate-400 font-normal hidden sm:inline">•</span>
                      <span class="text-slate-400 font-normal sm:hidden">|</span>
                      <span>{{ dest.outboundDate || 'Sat 28 Mar' }}</span>
                      <span class="text-slate-400 font-normal hidden sm:inline">•</span>
                      <span class="text-slate-400 font-normal sm:hidden">|</span>
                      <span>{{ passengers }} Adult{{ passengers > 1 ? 's' : '' }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-md self-start sm:self-auto">Edit</div>
              </div>

              <div class="flex items-center gap-2 text-slate-800 font-bold mb-3 text-sm">
                <div class="md:hidden w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Train :size="12" />
                </div>
                <ArrowRight :size="16" class="text-blue-600 hidden md:block" />
                Outbound {{ dest.outboundDate || 'Sat 28 Mar' }}
              </div>

              <div class="space-y-2">
                <a 
                  v-for="conn in generateMockConnections(index === 0 ? searchOrigin : destinations[index - 1].destinationName, dest, dest.outboundDate || 'Sat 28 Mar').slice(0, 3)"
                  :key="conn.id"
                  :href="`https://www.raileurope.com/en/destinations/${(index === 0 ? searchOrigin : destinations[index - 1].destinationName).toLowerCase().replace(' ', '-')}-${dest.destinationName.toLowerCase().replace(' ', '-')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition-all bg-white group/card"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-start gap-2 sm:gap-4">
                      <div class="w-16 sm:w-24">
                        <div class="text-sm sm:text-base font-black text-slate-900">{{ conn.departureTime }}</div>
                        <div class="text-[10px] sm:text-xs text-slate-500 truncate">{{ conn.originStation }}</div>
                      </div>
                      <div class="pt-1">
                        <ArrowRight :size="14" class="text-slate-400 group-hover/card:text-blue-500 transition-colors" />
                      </div>
                      <div class="w-16 sm:w-24">
                        <div class="text-sm sm:text-base font-black text-slate-900">{{ conn.arrivalTime }}</div>
                        <div class="text-[10px] sm:text-xs text-slate-500 truncate">{{ conn.destStation }}</div>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      <div class="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        {{ conn.operator.substring(0, 2).toUpperCase() }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center text-xs text-slate-500">
                    <div>{{ conn.trainNumber }}</div>
                    <div>{{ conn.duration }} • {{ conn.transfers }}</div>
                  </div>
                </a>
                
                <a 
                  :href="`https://www.raileurope.com/en/destinations/${(index === 0 ? searchOrigin : destinations[index - 1].destinationName).toLowerCase().replace(' ', '-')}-${dest.destinationName.toLowerCase().replace(' ', '-')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full py-2.5 mt-2 bg-slate-50 hover:bg-slate-100 text-blue-600 text-sm font-bold text-center rounded-lg border border-slate-200 transition-colors"
                >
                  See all connections
                </a>
              </div>

              <div class="mt-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                  <MessageCircle :size="18" class="text-blue-700" />
                </div>
                <div>
                  <p class="text-sm text-slate-700 italic font-medium">"{{ getMockSocialData(dest.destinationName, index === 0 ? searchOrigin : destinations[index - 1].destinationName).trainTip }}"</p>
                  <p class="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">— Train Enthusiast Forum</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Destination Block -->
          <div class="flex items-stretch gap-0 md:gap-6">
            <!-- Destination Marker - Hidden on mobile -->
            <div class="hidden md:flex flex-col items-center w-8 md:w-12">
              <div class="w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm z-10 border-2 border-white">
                <MapPin :size="18" class="md:w-6 md:h-6" />
              </div>
              <div v-if="index !== destinations.length - 1" class="w-1 flex-1 bg-slate-200 my-2 rounded-full"></div>
            </div>

            <div class="flex-1 space-y-6">
              <!-- Destination Hero -->
              <div class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <div class="h-48 sm:h-64 w-full relative">
                  <img :src="dest.imageUrl" :alt="dest.destinationName" @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 md:to-transparent"></div>
                  
                  <!-- Mobile Map Pin Badge -->
                  <div class="md:hidden absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <MapPin :size="12" class="fill-current" />
                    Stop {{ index + 1 }}
                  </div>

                  <div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0">
                    <div>
                      <h2 class="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2">{{ dest.destinationName }}</h2>
                      <p class="text-white/90 font-medium text-sm sm:text-base">{{ dest.destinationCountry }}</p>
                    </div>
                    <div v-if="dest.weather && dest.weather[0]" class="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 border border-white/30 self-start sm:self-auto">
                      <Sun v-if="dest.weather[0].condition === 'sunny'" :size="24" class="text-amber-300 fill-amber-300 sm:w-7 sm:h-7" />
                      <Cloud v-else-if="dest.weather[0].condition === 'cloudy'" :size="24" class="text-slate-200 fill-slate-200 sm:w-7 sm:h-7" />
                      <CloudRain v-else-if="dest.weather[0].condition === 'rainy'" :size="24" class="text-blue-300 sm:w-7 sm:h-7" />
                      <div>
                        <div class="text-white font-black text-lg sm:text-xl leading-none">{{ dest.weather[0].temp }}°</div>
                        <div class="text-white/80 text-[10px] sm:text-xs font-bold uppercase mt-1">{{ dest.weather[0].condition }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="p-4 sm:p-6">
                  <div class="flex items-start gap-2 sm:gap-3 mb-4">
                    <Sparkles class="text-blue-500 mt-1 flex-shrink-0" :size="20" />
                    <p class="text-slate-700 text-sm sm:text-lg leading-relaxed">
                      {{ dest.description }} Our AI suggests spending 2-3 days here to fully experience the local culture, cuisine, and historical landmarks.
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2 ml-6 sm:ml-8">
                    <span 
                      v-for="(h, idx) in getMockSocialData(dest.destinationName, index === 0 ? searchOrigin : destinations[index - 1].destinationName).highlights" 
                      :key="idx" 
                      class="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border border-blue-100 flex items-center gap-1"
                    >
                      <Camera :size="12" /> {{ h }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Inspiration & Social Proof -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Video -->
                <div class="col-span-1 relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm border border-slate-200 aspect-video md:aspect-auto">
                  <img :src="getMockSocialData(dest.destinationName, index === 0 ? searchOrigin : destinations[index - 1].destinationName).videoThumb" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Video thumbnail" />
                  <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                      <Play :size="20" class="text-slate-900" />
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p class="text-white font-bold text-sm leading-tight mb-1">{{ getMockSocialData(dest.destinationName, index === 0 ? searchOrigin : destinations[index - 1].destinationName).videoTitle }}</p>
                    <p class="text-white/80 text-xs font-medium">YouTube • 120K views</p>
                  </div>
                </div>
                
                <!-- Reddit Review -->
                <div class="col-span-1 md:col-span-2 bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-center relative overflow-hidden">
                  <Quote :size="80" class="absolute -top-4 -right-4 text-slate-200/50 rotate-12" />
                  <div class="flex items-center gap-2 mb-3 relative z-10">
                    <div class="w-6 h-6 bg-[#FF4500] rounded-full flex items-center justify-center">
                      <MessageCircle :size="12" class="text-white" />
                    </div>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Spotted on Reddit</span>
                  </div>
                  <p class="text-slate-700 font-medium italic mb-3 relative z-10 text-lg">"{{ getMockSocialData(dest.destinationName, index === 0 ? searchOrigin : destinations[index - 1].destinationName).redditQuote }}"</p>
                  <p class="text-sm text-slate-500 font-bold relative z-10">— {{ getMockSocialData(dest.destinationName, index === 0 ? searchOrigin : destinations[index - 1].destinationName).redditUser }}</p>
                </div>
              </div>

              <!-- Stays & Experiences Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Stays -->
                <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
                  <div class="flex items-center justify-between mb-4 sm:mb-6">
                    <div class="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg">
                      <BedDouble :size="18" class="text-blue-600" />
                      Where to Stay
                    </div>
                    <span class="text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-md">Booking.com</span>
                  </div>
                  <div class="space-y-4">
                    <div 
                      v-for="hotel in MOCK_ACCOMMODATION['default'].slice(0, 3)" 
                      :key="hotel.id" 
                      class="flex gap-3 sm:gap-4 group cursor-pointer"
                    >
                      <img :src="hotel.image" :alt="hotel.name" class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover group-hover:opacity-90 transition-opacity" />
                      <div class="flex-1 py-1">
                        <h5 class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 text-sm sm:text-base">{{ hotel.name }}</h5>
                        <div class="flex items-center gap-1 text-xs sm:text-sm text-amber-500 font-bold my-1">
                          ★ {{ hotel.rating }}
                        </div>
                        <div class="text-xs sm:text-sm font-medium text-slate-500">From ${{ hotel.price }}/night</div>
                      </div>
                    </div>
                  </div>
                  <button class="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100 text-blue-700 font-bold rounded-xl transition-colors border border-slate-200 text-sm sm:text-base">
                    See all {{ dest.destinationName }} stays
                  </button>
                </div>

                <!-- Activities -->
                <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
                  <div class="flex items-center justify-between mb-4 sm:mb-6">
                    <div class="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg">
                      <Ticket :size="18" class="text-orange-500" />
                      Experiences
                    </div>
                    <span class="text-[10px] sm:text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-md">GetYourGuide</span>
                  </div>
                  <div class="space-y-4">
                    <div 
                      v-for="activity in MOCK_ACTIVITIES['default'].slice(0, 3)" 
                      :key="activity.id" 
                      class="flex gap-3 sm:gap-4 group cursor-pointer"
                    >
                      <img :src="activity.image" :alt="activity.title" class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover group-hover:opacity-90 transition-opacity" />
                      <div class="flex-1 py-1">
                        <h5 class="font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight text-sm sm:text-base">{{ activity.title }}</h5>
                        <div class="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-500 mt-2">
                          <span class="flex items-center gap-1"><Clock :size="12"/> {{ activity.duration }}</span>
                          <span>•</span>
                          <span class="text-slate-700 font-bold">${{ activity.price }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100 text-orange-700 font-bold rounded-xl transition-colors border border-slate-200 text-sm sm:text-base">
                    See all experiences
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Edit Modal -->
      <div v-if="editingSearchIndex !== null" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="flex justify-between items-center p-4 border-b border-slate-100">
            <h3 class="font-bold text-slate-800">Edit Search</h3>
            <button @click="editingSearchIndex = null" class="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <X :size="20" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Origin</label>
              <div class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 font-medium">
                {{ editingSearchIndex === 0 ? searchOrigin : destinations[editingSearchIndex - 1].destinationName }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Destination</label>
              <div class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 font-medium">
                {{ destinations[editingSearchIndex].destinationName }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date</label>
              <input type="date" class="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" defaultValue="2026-03-28" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Passengers</label>
              <div class="relative">
                <Users :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  class="w-full border border-slate-200 rounded-lg p-2.5 pl-9 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                  v-model="passengers"
                >
                  <option :value="1">1 Adult</option>
                  <option :value="2">2 Adults</option>
                  <option :value="3">3 Adults</option>
                  <option :value="4">4 Adults</option>
                  <option :value="5">5 Adults</option>
                </select>
              </div>
            </div>
            <button 
              @click="editingSearchIndex = null" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 mt-2 transition-colors flex items-center justify-center gap-2"
            >
              <Search :size="16" /> Update Search
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

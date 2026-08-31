<script setup lang="ts">
import { ref, computed } from 'vue';
import { TrainDeal, TrainScheduleOption } from '../types';
import { 
  Train, MapPin, Calendar, ArrowRight, Share2, X, Clock, 
  Leaf, Wifi, Zap, Coffee, ExternalLink, Search, Users, Check, FileText
} from '@lucide/vue';
import { generateMockSchedules, getOriginCoordinates } from '../constants';
import ItineraryMap from './ItineraryMap.vue';

const props = defineProps<{
  destinations: TrainDeal[];
  searchOrigin?: string;
  originName?: string;
  originCoords?: { lat: number; lng: number };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const effectiveOriginName = computed(() => props.originName || props.searchOrigin || 'Origin');

const editingSearchIndex = ref<number | null>(null);
const passengers = ref(1);

// Summary metrics (train only)
const totalPrice = computed(() => props.destinations.reduce((sum, dest) => sum + dest.price, 0));

const totalCo2Saved = computed(() => {
  return props.destinations.reduce((sum, dest) => sum + (dest.co2Kg ? Math.round(dest.co2Kg * 3.5) : 52), 0);
});

const totalDurationFormatted = computed(() => {
  let totalMins = 0;
  props.destinations.forEach(d => {
    const hMatch = d.duration.match(/(\d+)h/);
    const mMatch = d.duration.match(/(\d+)m/);
    if (hMatch) totalMins += parseInt(hMatch[1], 10) * 60;
    if (mMatch) totalMins += parseInt(mMatch[1], 10);
  });
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
});

const getLegOrigin = (index: number) => {
  return index === 0 ? effectiveOriginName.value : props.destinations[index - 1].destinationName;
};

const getLegSchedules = (index: number, dest: TrainDeal): TrainScheduleOption[] => {
  const origin = getLegOrigin(index);
  return generateMockSchedules(origin, dest);
};
</script>

<template>
  <div v-if="destinations.length > 0" class="fixed inset-0 z-[1000] bg-[#F8FAFC] overflow-y-auto flex flex-col font-sans text-slate-900">
    
    <!-- Top Header Bar -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2.5">
        <img src="/logo.png" alt="TrainExplore" class="h-9 sm:h-10 w-auto object-contain" />
        <span class="text-[#01306A] font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 hidden sm:inline shadow-2xs">
          Journey Summary
        </span>
      </div>
      
      <div class="flex items-center gap-2 sm:gap-3">
        <button 
          class="flex items-center gap-1.5 px-3.5 py-2 bg-[#01879C] hover:bg-[#01306A] text-white rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-2xs whitespace-nowrap"
        >
          <Share2 :size="15" /> 
          <span class="hidden sm:inline">Share Link</span>
        </button>
        <div class="w-px h-6 bg-slate-200 mx-0.5 hidden sm:block"></div>
        <button 
          @click="emit('close')" 
          class="p-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-full transition-colors shadow-2xs flex items-center justify-center"
          title="Close Summary"
        >
          <X class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-32 space-y-8">
      
      <!-- Hero / Summary Header -->
      <section class="text-center pt-2 sm:pt-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50 text-[#01306A] border border-blue-200/80 rounded-full text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
          <Train :size="14" class="text-[#01879C]" />
          Rail Journey Summary
        </div>
        
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          {{ searchOrigin }}
          <template v-for="dest in destinations" :key="dest.id">
            <span class="text-slate-400 font-normal mx-1 sm:mx-2">→</span>
            <span>{{ dest.destinationName }}</span>
          </template>
        </h1>

        <!-- High-level Stats Cards -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold mt-4">
          <div class="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-slate-700">
            <MapPin :size="15" class="text-[#01879C]" />
            <span>{{ destinations.length }} {{ destinations.length === 1 ? 'Train Leg' : 'Train Legs' }}</span>
          </div>

          <div class="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-slate-700">
            <Clock :size="15" class="text-[#01879C]" />
            <span>~{{ totalDurationFormatted }} Total Travel</span>
          </div>

          <div class="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-xs font-bold">
            <Leaf :size="15" class="text-emerald-600" />
            <span>-88% CO₂ (~{{ totalCo2Saved }} kg saved vs flying)</span>
          </div>

          <div class="flex items-center gap-1.5 bg-[#01306A] text-white px-4 py-2 rounded-xl shadow-xs font-bold">
            <span>Total Train Fare: ${{ totalPrice }}</span>
          </div>
        </div>
      </section>

      <!-- Visual Route & Interactive Map Overview -->
      <section class="bg-white rounded-3xl p-4 sm:p-7 shadow-xs border border-slate-200 overflow-hidden">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Train :size="18" class="text-[#01306A]" />
            <span>Route Map & Stop Sequence</span>
          </h2>
          <span class="text-xs text-slate-500 font-medium">{{ destinations.length }} connected {{ destinations.length === 1 ? 'stop' : 'stops' }}</span>
        </div>
        
        <!-- Sequence Badges Flow -->
        <div class="flex flex-wrap items-center gap-2 mb-6 text-xs sm:text-sm">
          <div class="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 font-bold text-slate-800">
            <div class="w-2.5 h-2.5 rounded-full bg-[#01306A]"></div>
            <span>{{ effectiveOriginName }}</span>
          </div>
          
          <template v-for="(dest, i) in destinations" :key="dest.id">
            <ArrowRight :size="14" class="text-slate-400 flex-none" />
            <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-300 font-bold text-slate-900 shadow-2xs">
              <div class="w-4 h-4 rounded-full bg-[#01879C] text-white flex items-center justify-center text-[10px] font-black">
                {{ i + 1 }}
              </div>
              <span>{{ dest.destinationName }}</span>
            </div>
          </template>
        </div>

        <!-- Map Container -->
        <div class="w-full h-[200px] sm:h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
          <ItineraryMap 
            :destinations="destinations" 
            :originCoords="originCoords || getOriginCoordinates(effectiveOriginName)" 
            :originName="effectiveOriginName" 
          />
        </div>
      </section>

      <!-- Leg by Leg Train Schedules Stream -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar :size="18" class="text-[#01306A]" />
            <span>Train Legs & Schedules</span>
          </h2>
          <span class="text-xs text-slate-500 font-medium">Timetables & Departures</span>
        </div>

        <div 
          v-for="(dest, index) in destinations" 
          :key="dest.id" 
          class="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200 space-y-5"
        >
          <!-- Leg Header Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-[#01306A] text-white flex items-center justify-center text-xs font-black flex-none">
                {{ index + 1 }}
              </div>
              <div>
                <div class="text-xs font-semibold text-[#01879C] uppercase tracking-wider">
                  Leg {{ index + 1 }}
                </div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{{ getLegOrigin(index) }}</span>
                  <ArrowRight :size="14" class="text-slate-400" />
                  <span>{{ dest.destinationName }}</span>
                </h3>
              </div>
            </div>

            <!-- Outbound Date & Edit Trigger -->
            <div class="flex items-center gap-2 self-start sm:self-auto">
              <div class="text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                <Calendar :size="13" class="text-slate-400" />
                <span>{{ dest.outboundDate || 'Sat 28 Mar' }}</span>
                <span class="text-slate-300">•</span>
                <Users :size="13" class="text-slate-400" />
                <span>{{ passengers }} Adult{{ passengers > 1 ? 's' : '' }}</span>
              </div>
              <button 
                @click="editingSearchIndex = index"
                class="text-xs font-semibold text-[#01306A] hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors"
              >
                Change Date
              </button>
            </div>
          </div>

          <!-- Scenic Highlight Banner if available -->
          <div v-if="dest.scenicHighlight" class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <span class="text-base">🌄</span>
            <div class="leading-relaxed">
              <span class="font-bold text-amber-950">Scenic Route Note:</span> {{ dest.scenicHighlight }}
            </div>
          </div>

          <!-- Available Departures List -->
          <div class="space-y-2.5">
            <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Recommended Departures</span>
              <span class="text-slate-400 font-normal">Direct & Fastest Connections</span>
            </div>

            <div 
              v-for="sched in getLegSchedules(index, dest).slice(0, 3)"
              :key="sched.id"
              class="border border-slate-200 hover:border-slate-300 rounded-2xl p-4 bg-slate-50/40 hover:bg-white transition-all space-y-3"
            >
              <!-- Top Row: Departure / Arrival & Operator -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 sm:gap-6">
                  <!-- Times & Stations -->
                  <div>
                    <div class="text-base font-black text-slate-900">{{ sched.departureTime }}</div>
                    <div class="text-xs text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">{{ sched.originStation }}</div>
                  </div>

                  <div class="flex flex-col items-center px-1">
                    <span class="text-[10px] text-slate-400 font-medium">{{ sched.duration }}</span>
                    <div class="w-16 sm:w-24 h-0.5 bg-slate-300 my-1 relative">
                      <div class="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-0 -top-0.5"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-slate-400 absolute right-0 -top-0.5"></div>
                    </div>
                    <span class="text-[10px] font-semibold" :class="sched.transfers === 0 ? 'text-emerald-700' : 'text-slate-500'">
                      {{ sched.transfers === 0 ? 'Direct' : `${sched.transfers} stop` }}
                    </span>
                  </div>

                  <div>
                    <div class="text-base font-black text-slate-900">{{ sched.arrivalTime }}</div>
                    <div class="text-xs text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">{{ sched.destinationStation }}</div>
                  </div>
                </div>

                <!-- Price & Booking Button -->
                <div class="text-right flex items-center gap-3">
                  <div>
                    <div class="text-base font-black text-slate-900">${{ sched.price }}</div>
                    <span class="text-[10px] text-slate-500 font-medium block">{{ sched.seatClass }}</span>
                  </div>

                  <a 
                    :href="`https://www.virail.com`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hidden sm:inline-flex items-center gap-1 bg-[#01306A] hover:bg-[#002D67] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>Book</span>
                    <ExternalLink :size="12" />
                  </a>
                </div>
              </div>

              <!-- Bottom Row: Operator, Badges & Amenities -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-800">{{ sched.operator }}</span>
                  <span>•</span>
                  <span>{{ sched.trainNumber }}</span>
                  
                  <!-- Option Badges -->
                  <span v-if="sched.isBest" class="bg-blue-50 text-[#01306A] text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-200/80">Best Choice</span>
                  <span v-if="sched.isCheapest" class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200/80">Cheapest</span>
                </div>

                <!-- Amenities Icons -->
                <div class="flex items-center gap-2 text-slate-400">
                  <span title="Free Wi-Fi" class="flex items-center gap-0.5 text-[11px]"><Wifi :size="12" /> Wi-Fi</span>
                  <span title="Power Outlet" class="flex items-center gap-0.5 text-[11px]"><Zap :size="12" /> Power</span>
                  <span title="Dining Bistro" class="flex items-center gap-0.5 text-[11px]"><Coffee :size="12" /> Bistro</span>
                </div>
              </div>

              <!-- Mobile Book Button -->
              <a 
                :href="`https://www.virail.com`"
                target="_blank"
                rel="noopener noreferrer"
                class="sm:hidden w-full flex items-center justify-center gap-1.5 bg-[#01306A] hover:bg-[#002D67] text-white py-2 rounded-xl text-xs font-semibold transition-colors shadow-2xs mt-2"
              >
                <span>Book Ticket on Virail</span>
                <ExternalLink :size="12" />
              </a>
            </div>
          </div>

          <!-- Deep-link link to search on Rail Europe / Virail -->
          <div class="pt-2 text-center">
            <a 
              :href="`https://www.raileurope.com/en/destinations/${getLegOrigin(index).toLowerCase().replace(' ', '-')}-${dest.destinationName.toLowerCase().replace(' ', '-')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-[#01879C] hover:text-[#01306A] transition-colors py-1 px-3 rounded-lg hover:bg-slate-50"
            >
              <span>View all available timetables for this route</span>
              <ExternalLink :size="12" />
            </a>
          </div>
        </div>
      </section>

      <!-- Overall Trip Summary Footnote Box -->
      <section class="bg-gradient-to-r from-slate-900 to-[#01306A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-xl font-bold mb-1">Ready to explore Europe by rail?</h3>
          <p class="text-slate-300 text-xs sm:text-sm">
            {{ destinations.length }} legs • ~{{ totalDurationFormatted }} travel time • ${{ totalPrice }} estimated train fare
          </p>
        </div>

        <div class="flex items-center gap-3 flex-none">
          <button 
            @click="emit('close')"
            class="px-6 py-2.5 bg-[#01879C] hover:bg-[#259DAD] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </section>

    </main>

    <!-- Simple Search Edit Date Modal -->
    <div v-if="editingSearchIndex !== null" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[1100] flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
        <div class="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 class="font-bold text-slate-900 text-sm">Update Travel Date</h3>
          <button @click="editingSearchIndex = null" class="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X :size="18" />
          </button>
        </div>
        
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Route</label>
            <div class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800">
              {{ getLegOrigin(editingSearchIndex) }} → {{ destinations[editingSearchIndex].destinationName }}
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Departure Date</label>
            <input 
              type="date" 
              class="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-medium text-slate-800 focus:border-[#01306A] outline-none" 
              defaultValue="2026-04-07" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Passengers</label>
            <select 
              class="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-medium text-slate-800 focus:border-[#01306A] outline-none bg-white"
              v-model="passengers"
            >
              <option :value="1">1 Adult</option>
              <option :value="2">2 Adults</option>
              <option :value="3">3 Adults</option>
              <option :value="4">4 Adults</option>
            </select>
          </div>

          <button 
            @click="editingSearchIndex = null" 
            class="w-full bg-[#01306A] hover:bg-[#002D67] text-white font-bold rounded-xl py-3 text-xs sm:text-sm transition-colors mt-2"
          >
            Apply Date Change
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

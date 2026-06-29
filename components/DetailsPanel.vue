<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { TrainDeal, Accommodation, Activity } from '../types';
import { 
  Calendar, Sun, Cloud, CloudRain, Ticket, Star, Clock, ArrowRight, RefreshCw, Train, MapPin, Wifi, X, ExternalLink, Map, Plus, Check 
} from '@lucide/vue';
import { generateTripAdvice, getAccommodations, getActivities, generateItinerary } from '../services/aiService';
import { MOCK_ACCOMMODATION, MOCK_ACTIVITIES } from '../constants';
import { marked } from 'marked';

const props = defineProps<{
  destination: TrainDeal;
  itineraryDestinations: TrainDeal[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update-itinerary', destinations: TrainDeal[]): void;
  (e: 'open-one-pager'): void;
}>();

type TabType = 'trains' | 'accommodation' | 'things_to_do' | 'itinerary';

const aiTip = ref("");
const loadingTip = ref(false);
const activeTab = ref<TabType>('trains');

// Dynamic Data States
const stays = ref<Accommodation[] | null>(null);
const activities = ref<Activity[] | null>(null);
const itinerary = ref<string | null>(null);
const loadingStays = ref(false);
const loadingActivities = ref(false);
const loadingItinerary = ref(false);

const isInItinerary = computed(() => 
  props.itineraryDestinations.some(d => d.id === props.destination.id)
);

const renderedItinerary = computed(() => {
  if (!itinerary.value) return '';
  return marked.parse(itinerary.value);
});

const loadTripAdvice = () => {
  loadingTip.value = true;
  aiTip.value = "";
  activeTab.value = 'trains';
  stays.value = null;
  activities.value = null;
  itinerary.value = null;

  generateTripAdvice(props.destination, "")
    .then(tip => {
      aiTip.value = tip;
    })
    .catch(() => {
      aiTip.value = "The travel guide is currently offline, but the destination is beautiful.";
    })
    .finally(() => {
      loadingTip.value = false;
    });
};

// Watch destination prop to reload insights
watch(() => props.destination, () => {
  loadTripAdvice();
}, { immediate: true });

// Lazy load tab data
watch([activeTab, () => props.destination], () => {
  if (activeTab.value === 'accommodation' && !stays.value && !loadingStays.value) {
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
  }

  if (activeTab.value === 'things_to_do' && !activities.value && !loadingActivities.value) {
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
  }

  if (activeTab.value === 'itinerary' && !itinerary.value && !loadingItinerary.value) {
    loadingItinerary.value = true;
    const destsToGenerate = props.itineraryDestinations.length > 0 ? props.itineraryDestinations : [props.destination];
    generateItinerary(destsToGenerate)
      .then(data => {
        itinerary.value = data;
      })
      .catch(() => {
        itinerary.value = "Failed to load itinerary.";
      })
      .finally(() => {
        loadingItinerary.value = false;
      });
  }
});

const toggleItinerary = () => {
  if (isInItinerary.value) {
    emit('update-itinerary', props.itineraryDestinations.filter(d => d.id !== props.destination.id));
  } else {
    emit('update-itinerary', [...props.itineraryDestinations, props.destination]);
  }
};
</script>

<template>
  <div class="h-full flex flex-col bg-white overflow-hidden">
      <!-- Header Image & Close -->
      <div class="relative h-48 flex-none">
          <img :src="destination.imageUrl" :alt="destination.destinationName" @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          <button 
              @click="emit('close')"
              class="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all z-50"
          >
              <X :size="20" />
          </button>

          <div class="absolute bottom-4 left-4 text-white">
              <span class="bg-blue-600/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  {{ destination.category }}
              </span>
              <div class="flex items-end gap-2 mt-1">
                  <h2 class="text-3xl font-bold leading-none">{{ destination.destinationName }}</h2>
              </div>
          </div>

          <div class="absolute bottom-4 right-4 z-50">
              <button 
                  @click="toggleItinerary"
                  class="px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md transition-all flex items-center gap-2"
                  :class="isInItinerary ? 'bg-green-500/90 text-white hover:bg-green-600' : 'bg-white/90 text-slate-800 hover:bg-white'"
              >
                  <template v-if="isInItinerary">
                    <Check :size="16" /> Added to Trip
                  </template>
                  <template v-else>
                    <Plus :size="16" /> Add to Trip
                  </template>
              </button>
          </div>
      </div>

      <!-- Sticky Tabs & Weather -->
      <div class="flex-none bg-white z-20 shadow-sm border-b border-slate-100">
           <div class="flex px-4 pt-4 pb-2 gap-4 overflow-x-auto scrollbar-hide">
              <button 
                  @click="activeTab = 'trains'"
                  class="pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap"
                  :class="activeTab === 'trains' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'"
              >
                  Trains
              </button>
              <button 
                  @click="activeTab = 'accommodation'"
                  class="pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap"
                  :class="activeTab === 'accommodation' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'"
              >
                  Stays
              </button>
              <button 
                  @click="activeTab = 'things_to_do'"
                  class="pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap"
                  :class="activeTab === 'things_to_do' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'"
              >
                  Experiences
              </button>
              <button 
                  @click="activeTab = 'itinerary'"
                  class="pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap"
                  :class="activeTab === 'itinerary' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'"
              >
                  Itinerary
              </button>
          </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto min-h-0 relative bg-slate-50/50">
          
          <!-- AI Insight Card -->
          <div class="px-4 py-4">
               <div class="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <div class="flex items-center gap-2 mb-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span class="text-xs font-bold text-blue-900 uppercase tracking-wide">AI Recommendation</span>
                      <RefreshCw v-if="loadingTip" :size="10" class="animate-spin text-blue-400" />
                  </div>
                  <p class="text-sm text-slate-600 leading-relaxed italic">
                      "{{ loadingTip ? "Analysing best travel times..." : aiTip }}"
                  </p>
              </div>
          </div>

          <div class="px-4 space-y-6 pb-12">
              
              <div v-if="activeTab === 'trains'" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <!-- Weather Row -->
                  <div>
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Forecast</h4>
                      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          <div v-for="(w, idx) in destination.weather" :key="idx" class="flex-none flex flex-col items-center min-w-[60px] p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                              <span class="text-[10px] text-slate-400 font-bold uppercase">{{ w.date.split(' ')[1] }}</span>
                              <div class="my-1">
                                  <Sun v-if="w.condition === 'sunny'" :size="18" class="text-amber-400 fill-amber-400" />
                                  <Cloud v-else-if="w.condition === 'cloudy'" :size="18" class="text-slate-400 fill-slate-100" />
                                  <CloudRain v-else-if="w.condition === 'rainy'" :size="18" class="text-blue-400" />
                              </div>
                              <span class="text-xs font-bold text-slate-700">{{ w.temp }}°</span>
                          </div>
                      </div>
                  </div>

                  <!-- Tickets -->
                  <div>
                      <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Train Details</h4>
                      <div class="space-y-3">
                          <!-- Primary Option -->
                          <div class="group bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden">
                              <div class="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">GREAT DEAL</div>
                              <div class="flex justify-between items-start mb-4">
                                  <div>
                                      <div class="text-lg font-bold text-slate-800">{{ destination.originName }} <span class="text-slate-300 font-normal">→</span> {{ destination.destinationName }}</div>
                                      <div class="text-xs text-slate-500 font-medium mt-1">{{ destination.transfers === 0 ? 'Direct' : `${destination.transfers} Transfer(s)` }} • {{ destination.duration }}</div>
                                      <div class="text-xs text-slate-500 font-medium mt-1">{{ destination.outboundDate }} - {{ destination.returnDate }}</div>
                                  </div>
                                  <div class="text-right pr-2 pt-1">
                                      <div class="text-xl font-bold text-green-600">${{ destination.price }}</div>
                                  </div>
                              </div>
                              <div class="flex items-center gap-3 pt-3 border-t border-slate-50">
                                  <Train :size="14" class="text-slate-400" />
                                  <span class="text-xs text-slate-500 font-medium">{{ destination.trainOperator }}</span>
                                  <div class="flex-1"></div>
                                  <button class="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                      View Trains <ArrowRight :size="12" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div v-if="activeTab === 'accommodation'" class="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div v-if="loadingStays" class="flex flex-col items-center justify-center py-10 opacity-50">
                      <RefreshCw :size="24" class="animate-spin mb-2 text-slate-400" />
                      <span class="text-xs text-slate-400">Loading hotels...</span>
                  </div>
                  <template v-else>
                     <div v-for="acc in stays" :key="acc.id" class="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer group">
                        <div class="w-20 h-20 rounded-lg overflow-hidden flex-none">
                            <img :src="acc.image" :alt="acc.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div class="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                                <h4 class="text-sm font-bold text-slate-800 leading-tight mb-1">{{ acc.name }}</h4>
                                <div class="flex gap-2">
                                    <span class="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">
                                        <Star :size="8" fill="currentColor" /> {{ acc.rating }}
                                    </span>
                                    <span class="text-[10px] text-slate-400">0.5km from center</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-end">
                                <div class="text-sm font-bold text-slate-900">${{ acc.price }} <span class="text-xs font-normal text-slate-400">/ night</span></div>
                                <div class="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <ArrowRight :size="12" />
                                </div>
                            </div>
                        </div>
                     </div>
                  </template>
              </div>

              <div v-if="activeTab === 'things_to_do'" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div v-if="loadingActivities" class="flex flex-col items-center justify-center py-10 opacity-50">
                      <RefreshCw :size="24" class="animate-spin mb-2 text-slate-400" />
                      <span class="text-xs text-slate-400">Loading experiences...</span>
                   </div>
                   <template v-else>
                     <div v-for="act in activities" :key="act.id" class="relative aspect-video rounded-xl overflow-hidden group shadow-sm cursor-pointer">
                         <img :src="act.image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" :alt="act.title" />
                         <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                         <div class="absolute bottom-0 left-0 right-0 p-3">
                             <h4 class="text-white font-bold text-sm mb-1">{{ act.title }}</h4>
                             <div class="flex items-center justify-between">
                                 <div class="flex gap-2 text-[10px] text-white/80 font-medium">
                                     <span class="flex items-center gap-1"><Clock :size="10" /> {{ act.duration }}</span>
                                     <span class="flex items-center gap-1"><Star :size="10" class="text-amber-400 fill-amber-400" /> {{ act.rating }}</span>
                                 </div>
                                 <span class="text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">${{ act.price }}</span>
                             </div>
                         </div>
                     </div>
                  </template>
              </div>

              <div v-if="activeTab === 'itinerary'" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div class="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <div>
                          <h4 class="text-sm font-bold text-blue-900">Your Trip</h4>
                          <p class="text-xs text-blue-700">{{ itineraryDestinations.length }} destinations selected</p>
                      </div>
                      <div class="flex gap-2">
                          <button 
                              v-if="itineraryDestinations.length > 0"
                              @click="emit('open-one-pager')"
                              class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                              <ExternalLink :size="14" /> Generate Report
                          </button>
                      </div>
                  </div>

                  <div v-if="loadingItinerary" class="flex flex-col items-center justify-center py-10 opacity-50">
                      <RefreshCw :size="24" class="animate-spin mb-2 text-slate-400" />
                      <span class="text-xs text-slate-400">Generating multi-city itinerary...</span>
                  </div>
                  <div v-else class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600" v-html="renderedItinerary">
                  </div>
              </div>

          </div>
      </div>
  </div>
</template>

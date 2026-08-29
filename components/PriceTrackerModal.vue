<script setup lang="ts">
import { ref, computed } from 'vue';
import { TrainDeal } from '../types';
import { Bell, X, Check, Mail, TrendingDown, ArrowRight, ShieldCheck, Train } from '@lucide/vue';

const props = defineProps<{
  destination: TrainDeal;
  originName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'alert-saved', email: string): void;
}>();

const email = ref('');
const isSaved = ref(false);
const targetPrice = ref(props.destination.price);
const notifyOnAnyDrop = ref(true);

const storageKey = computed(() => `trainexplore_alert_${props.originName}_${props.destination.destinationName}`);

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('trainexplore_user_email');
  if (saved) email.value = saved;
}

const handleSaveAlert = () => {
  if (!email.value || !email.value.includes('@')) return;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('trainexplore_user_email', email.value);
    localStorage.setItem(storageKey.value, JSON.stringify({
      origin: props.originName,
      destination: props.destination.destinationName,
      targetPrice: targetPrice.value,
      email: email.value,
      createdAt: new Date().toISOString()
    }));
  }
  
  isSaved.value = true;
  emit('alert-saved', email.value);
  setTimeout(() => {
    emit('close');
  }, 1800);
};
</script>

<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full bg-[#01306A] text-white flex items-center justify-center shadow-xs">
            <Bell :size="18" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-base">Track Train Prices</h3>
            <p class="text-xs text-slate-500">Google Flights style price drop alerts</p>
          </div>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-5">
        
        <!-- Route Banner -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
          <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Train :size="16" class="text-[#01879C]" />
            <span>{{ originName }}</span>
            <ArrowRight :size="14" class="text-slate-400" />
            <span>{{ destination.destinationName }}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Current Lowest</span>
            <span class="text-lg font-black text-[#01306A]">${{ destination.price }}</span>
          </div>
        </div>

        <!-- Price Insight Note -->
        <div class="flex items-start gap-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-900">
          <TrendingDown :size="18" class="text-emerald-700 flex-none mt-0.5" />
          <div>
            <strong class="font-bold text-emerald-800">Current fares are typical to low.</strong>
            <p class="text-emerald-700 mt-0.5">We track Virail schedules continuously. If prices drop below ${{ destination.price }}, we'll alert you immediately.</p>
          </div>
        </div>

        <!-- Target Price Selection -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 block">Alert threshold</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button"
              @click="notifyOnAnyDrop = true; targetPrice = destination.price"
              class="p-3 rounded-xl border text-left text-xs transition-all"
              :class="notifyOnAnyDrop 
                ? 'border-[#01306A] bg-[#01306A]/5 font-bold text-[#01306A] ring-1 ring-[#01306A]' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
            >
              <div>Any price drop</div>
              <span class="text-[11px] text-slate-500 font-normal mt-0.5 block">&lt; ${{ destination.price }}</span>
            </button>
            <button 
              type="button"
              @click="notifyOnAnyDrop = false; targetPrice = Math.max(15, Math.round(destination.price * 0.8))"
              class="p-3 rounded-xl border text-left text-xs transition-all"
              :class="!notifyOnAnyDrop 
                ? 'border-[#01306A] bg-[#01306A]/5 font-bold text-[#01306A] ring-1 ring-[#01306A]' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
            >
              <div>Steep drop (-20%)</div>
              <span class="text-[11px] text-slate-500 font-normal mt-0.5 block">&lt; ${{ Math.max(15, Math.round(destination.price * 0.8)) }}</span>
            </button>
          </div>
        </div>

        <!-- Email Input Form -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 block">Your email address</label>
          <div class="relative">
            <Mail :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="email" 
              type="email" 
              placeholder="e.g. name@example.com" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:border-[#01306A] focus:bg-white transition-all"
            />
          </div>
          <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
            <ShieldCheck :size="13" class="text-slate-400" /> No spam. Unsubscribe in one click anytime.
          </p>
        </div>

      </div>

      <!-- Action Footer -->
      <div class="p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
        <button 
          @click="emit('close')"
          class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white transition-colors"
        >
          Cancel
        </button>

        <button 
          @click="handleSaveAlert"
          :disabled="!email || !email.includes('@')"
          class="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
          :class="isSaved 
            ? 'bg-emerald-600 text-white' 
            : 'bg-[#01306A] hover:bg-[#002D67] text-white'"
        >
          <template v-if="isSaved">
            <Check :size="15" />
            <span>Price Alert Activated!</span>
          </template>
          <template v-else>
            <Bell :size="15" />
            <span>Activate Price Tracking</span>
          </template>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { ChatMessage, CopilotAction, TrainDeal } from '../types';
import { chatWithCopilot } from '../services/aiService';
import { 
  Sparkles, Send, X, Bot, User, ArrowRight, Plus, Check, 
  MapPin, SlidersHorizontal, Wand2, RefreshCw, Train, Compass, Zap
} from '@lucide/vue';
import { marked } from 'marked';

const props = defineProps<{
  isOpen: boolean;
  destinations: TrainDeal[];
  searchOrigin: string;
  itineraryDestinations: TrainDeal[];
  messages: ChatMessage[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update-messages', messages: ChatMessage[]): void;
  (e: 'trigger-action', action: CopilotAction): void;
  (e: 'select-destination', id: string): void;
  (e: 'toggle-destination', dest: TrainDeal): void;
}>();

const inputText = ref('');
const isTyping = ref(false);
const chatContainerRef = ref<HTMLDivElement | null>(null);

const presetPrompts = [
  { label: "🍷 Romantic Wine Trip", query: "Show me romantic wine and river routes under $100" },
  { label: "🏔️ Swiss Alpine Rails", query: "Find scenic mountain train journeys with panoramic views" },
  { label: "⚡ Fast Escapes (<3h)", query: "Show me quick direct escapes under 3 hours" },
  { label: "🏰 4-Day Castle Loop", query: "Plan a 4-day multi-city trip with castles and historic towns" }
];

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

watch(() => props.messages.length, () => {
  scrollToBottom();
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    scrollToBottom();
  }
});

const handleSend = async (customQuery?: string) => {
  const query = (customQuery || inputText.value).trim();
  if (!query || isTyping.value) return;

  inputText.value = '';

  const userMsg: ChatMessage = {
    id: `user-${Date.now()}`,
    role: 'user',
    text: query,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updatedMessages = [...props.messages, userMsg];
  emit('update-messages', updatedMessages);
  isTyping.value = true;
  scrollToBottom();

  try {
    const response = await chatWithCopilot(
      updatedMessages.map(m => ({ role: m.role, text: m.text })),
      query,
      props.destinations,
      props.searchOrigin,
      props.itineraryDestinations
    );

    const modelMsg: ChatMessage = {
      id: `model-${Date.now()}`,
      role: 'model',
      text: response.message,
      actions: response.actions as CopilotAction[],
      destinationIds: response.destinationIds,
      quickReplies: response.quickReplies,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    emit('update-messages', [...updatedMessages, modelMsg]);
  } catch (error) {
    console.error("Copilot error:", error);
    const errorMsg: ChatMessage = {
      id: `model-${Date.now()}`,
      role: 'model',
      text: "I had trouble processing that request. Try asking about a specific city or budget!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    emit('update-messages', [...updatedMessages, errorMsg]);
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const handleActionClick = (action: CopilotAction) => {
  emit('trigger-action', action);
};

const getDestinationById = (id: string): TrainDeal | undefined => {
  return props.destinations.find(d => d.id === id);
};

const getRecommendedDestinations = (ids: string[]): TrainDeal[] => {
  return ids
    .map(id => props.destinations.find(d => d.id === id))
    .filter((d): d is TrainDeal => !!d);
};

const renderMarkdown = (text: string) => {
  try {
    return marked.parse(text);
  } catch (e) {
    return text;
  }
};
</script>

<template>
  <div 
    v-if="isOpen"
    class="fixed inset-y-0 right-0 z-[80] w-full sm:w-[460px] md:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 font-sans"
  >
    <!-- Header -->
    <div class="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#002D67] via-[#01306A] to-[#01879C] text-white flex items-center justify-between flex-none shadow-md">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 shadow-inner overflow-hidden p-1 flex-none">
          <img src="/logo-icon.png" alt="TrainExplore" class="w-full h-full object-contain" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-bold text-base tracking-tight">TrainExplore AI Copilot</h2>
            <span class="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Smart Travel</span>
          </div>
          <p class="text-xs text-[#8DDCDE] flex items-center gap-1.5 mt-0.5">
            <span class="w-2 h-2 rounded-full bg-[#8DDCDE] animate-ping inline-block"></span>
            Connected to European rail network & real-time schedules
          </p>
        </div>
      </div>
      
      <button 
        @click="emit('close')"
        class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        title="Close Copilot"
      >
        <X :size="18" />
      </button>
    </div>

    <!-- Preset Prompt Chips -->
    <div class="px-4 py-2.5 bg-[#FAFBFB] border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-hide flex-none">
      <button 
        v-for="(p, idx) in presetPrompts"
        :key="idx"
        @click="handleSend(p.query)"
        class="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 whitespace-nowrap transition-all shadow-xs flex items-center gap-1"
      >
        {{ p.label }}
      </button>
    </div>

    <!-- Chat Messages Stream -->
    <div 
      ref="chatContainerRef"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFBFD] scroll-smooth"
    >
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="flex flex-col"
        :class="msg.role === 'user' ? 'items-end' : 'items-start'"
      >
        <!-- Role badge / Avatar -->
        <div class="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-slate-400 px-1">
          <template v-if="msg.role === 'user'">
            <span>You</span>
            <span>•</span>
            <span>{{ msg.timestamp || 'Now' }}</span>
          </template>
          <template v-else>
            <Sparkles :size="12" class="text-[#01879C]" />
            <span class="font-bold text-[#01879C]">TrainExplore AI</span>
            <span>•</span>
            <span>{{ msg.timestamp || 'Now' }}</span>
          </template>
        </div>

        <!-- Bubble -->
        <div 
          class="max-w-[90%] rounded-2xl p-4 shadow-xs text-sm"
          :class="msg.role === 'user' 
            ? 'bg-[#01306A] text-white rounded-br-none' 
            : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-xs'"
        >
          <!-- Markdown Rendered Content -->
          <div 
            class="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed markdown-content"
            :class="msg.role === 'user' ? 'text-white' : 'text-slate-700'"
            v-html="renderMarkdown(msg.text)"
          ></div>

          <!-- Embedded Destination Recommendation Cards -->
          <div v-if="msg.destinationIds && msg.destinationIds.length > 0" class="mt-3.5 pt-3 border-t border-slate-100/80 space-y-2">
            <div class="text-[11px] font-extrabold uppercase tracking-wider text-[#002D67]">
              Recommended Stops
            </div>
            <div class="grid grid-cols-1 gap-2">
              <div 
                v-for="d in getRecommendedDestinations(msg.destinationIds)"
                :key="d.id"
                @click="emit('select-destination', d.id)"
                class="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors group/card"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <img 
                    :src="d.imageUrl" 
                    :alt="d.destinationName" 
                    class="w-11 h-11 rounded-lg object-cover flex-none"
                    @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=400&q=80'"
                  />
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-[#002D67] truncate">{{ d.destinationName }}</div>
                    <div class="text-[10px] text-slate-500 truncate">{{ d.duration }} • ${{ d.price }}</div>
                  </div>
                </div>
                
                <button 
                  @click.stop="emit('toggle-destination', d)"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 shadow-xs flex-none ml-2"
                  :class="itineraryDestinations.some(it => it.id === d.id) 
                    ? 'bg-[#01306A] text-white' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-[#01879C] hover:text-white'"
                >
                  <Check v-if="itineraryDestinations.some(it => it.id === d.id)" :size="10" />
                  <Plus v-else :size="10" />
                  {{ itineraryDestinations.some(it => it.id === d.id) ? 'Added' : 'Add' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Executable Action Buttons Generated by Copilot -->
          <div v-if="msg.actions && msg.actions.length > 0" class="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
            <button
              v-for="(act, aIdx) in msg.actions"
              :key="aIdx"
              @click="emit('trigger-action', act)"
              class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-[#002D67] hover:bg-[#01306A] hover:text-white border border-slate-200 transition-all flex items-center gap-1 shadow-xs"
            >
              <Zap :size="11" class="text-amber-500" />
              <span>{{ act.label }}</span>
            </button>
          </div>
        </div>

        <!-- Quick Reply Suggestions -->
        <div v-if="msg.quickReplies && msg.quickReplies.length > 0" class="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
          <button
            v-for="(qr, qIdx) in msg.quickReplies"
            :key="qIdx"
            @click="handleSend(qr)"
            class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
          >
            💬 {{ qr }}
          </button>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex items-center gap-2 text-xs text-slate-500 p-2.5 bg-white rounded-2xl border border-slate-100 max-w-[200px] shadow-xs">
        <Sparkles :size="14" class="text-[#01879C] animate-spin" />
        <span>TrainExplore AI is thinking...</span>
      </div>
    </div>

    <!-- Input Footer -->
    <div class="p-3 border-t border-slate-200 bg-white flex-none">
      <form @submit.prevent="handleSend()" class="flex items-center gap-2 bg-[#FAFBFB] border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-[#01879C] focus-within:bg-white transition-all shadow-inner">
        <input 
          v-model="inputText"
          type="text"
          placeholder="Ask TrainExplore: 'Find weekend trips under $80'..."
          class="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm font-medium text-[#002D67] placeholder:text-slate-400 outline-none"
          :disabled="isTyping"
        />
        <button 
          type="submit"
          :disabled="!inputText.trim() || isTyping"
          class="w-9 h-9 rounded-xl bg-[#01879C] hover:bg-[#01306A] disabled:bg-slate-300 text-white flex items-center justify-center transition-colors flex-none shadow-xs"
        >
          <Send :size="15" />
        </button>
      </form>
      <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
        <span>⚡ AI controls map filters & multi-city routes</span>
        <span class="font-bold text-[#01879C]">trainexplore.com</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-content :deep(p) {
  margin-bottom: 0.5rem;
}
.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}
.markdown-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.markdown-content :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}
</style>

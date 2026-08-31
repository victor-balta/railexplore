export interface TrainDeal {
  id: string;
  destinationName: string;
  destinationCountry: string;
  originName: string;
  category: CategoryType;
  description: string;
  location: { lat: number; lng: number };
  duration: string; // e.g., "4h 30m"
  price: number;
  imageUrl: string;
  outboundDate: string;
  returnDate: string;
  trainOperator: string;
  transfers: number;
  isDirect?: boolean;
  transferStation?: string;
  co2Kg?: number;
  co2SavingsPercent?: number; // e.g. 88% less CO2 than flight
  scenicRating?: number; // 1-5
  scenicHighlight?: string; // e.g. "Rhine River valley views on left side"
  tripType?: 'Day Trip' | 'Weekend Break' | 'Grand Rail' | string;
  frequency?: string; // e.g. "Every 1h" or "Direct Nightjet"
  stationName?: string; // e.g. "Praha hlavní nádraží"
  travelRing?: 'day_trip' | 'weekend' | 'extended';
  weather: { date: string; temp: number; condition: 'sunny' | 'cloudy' | 'rainy' }[];
}

export enum CategoryType {
  Historical = 'Historical',
  Romantic = 'Romantic',
  Beaches = 'Beaches',
  Mountains = 'Mountain',
  Skiing = 'Skiing',
  Lakeside = 'Lakeside',
  Countryside = 'Countryside',
  City = 'City Break',
  Nature = 'Nature',
  Wellness = 'Wellness',
  Anywhere = 'Anywhere'
}

export interface TrainScheduleOption {
  id: string;
  departureTime: string; // e.g., "08:15"
  arrivalTime: string;   // e.g., "12:35"
  duration: string;      // e.g., "4h 20m"
  originStation: string;
  destinationStation: string;
  trainNumber: string;   // e.g. "ICE 1705"
  operator: string;      // e.g. "Deutsche Bahn"
  transfers: number;
  transferStation?: string;
  price: number;
  seatClass: '2nd Class' | '1st Class';
  amenities: ('wifi' | 'power' | 'dining' | 'quiet' | 'bikes')[];
  co2Kg: number;
  isBest?: boolean;
  isCheapest?: boolean;
  isFastest?: boolean;
}

export interface PriceInsight {
  status: 'low' | 'typical' | 'high';
  currentPrice: number;
  typicalMin: number;
  typicalMax: number;
  savingsVsTypical: number;
  advice: string;
}

export type CopilotActionType = 
  | 'SET_FILTERS'
  | 'ADD_TO_TRIP'
  | 'REMOVE_FROM_TRIP'
  | 'SELECT_DESTINATION'
  | 'OPTIMIZE_ROUTE'
  | 'SET_ORIGIN'
  | 'GENERATE_ITINERARY'
  | 'RESET_FILTERS';

export interface CopilotAction {
  type: CopilotActionType;
  label: string;
  icon?: string;
  payload?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
  timestamp?: string;
  actions?: CopilotAction[];
  destinationIds?: string[];
  quickReplies?: string[];
}

export interface FilterState {
  maxDuration: number; // hours
  maxPrice: number; // USD
  directOnly: boolean;
  operators?: string[];
  selectedOperator?: string;
  scenicOnly?: boolean;
  nightTrainOnly?: boolean;
  sortBy?: 'best' | 'price' | 'duration' | 'co2';
}

export interface DateFlexibility {
  mode: 'exact' | 'weekend' | '1week' | 'flexible';
  month?: string;
  startDate?: string;
  endDate?: string;
  label: string;
}

export interface Accommodation {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
  neighborhood?: string;
  tags?: string[];
}

export interface Activity {
  id: string;
  title: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  category?: string;
}

export interface ItineraryDay {
  day: number;
  location: string;
  theme: string;
  trainDetails: string;
  hotelSuggestion: string;
  activities: string[];
  diningHighlight?: string;
  stationTransferTip?: string;
}

export interface StructuredItinerary {
  title: string;
  summary: string;
  totalEstimatedCost?: number;
  totalDurationDays?: number;
  totalCo2SavingsKg?: number;
  days: ItineraryDay[];
}
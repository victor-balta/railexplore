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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export interface FilterState {
  maxDuration: number; // hours
  maxPrice: number; // USD
  directOnly: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
}

export interface Activity {
  id: string;
  title: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
}

export interface ItineraryDay {
  day: number;
  location: string;
  theme: string;
  trainDetails: string;
  hotelSuggestion: string;
  activities: string[];
}

export interface StructuredItinerary {
  title: string;
  summary: string;
  days: ItineraryDay[];
}
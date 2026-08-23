import { TrainDeal, Accommodation, Activity, StructuredItinerary } from "../types";

// High-quality fallback images to make the UI look good
const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522771753035-0a1529140558?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'
];

const ACTIVITY_IMAGES = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544098485-0587950e3494?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=400&q=80'
];

// Helper to call DeepSeek Chat API via the Vite proxy
const callDeepSeek = async (
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  jsonMode: boolean = false
): Promise<string> => {
  try {
    const response = await fetch('/api/deepseek/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error("DeepSeek API request failed:", error);
    throw error;
  }
};

export const parseItineraryQuery = async (query: string, availableDestinations: TrainDeal[]): Promise<string[]> => {
  try {
    const destNames = availableDestinations.map(d => d.destinationName).join(', ');
    
    const systemPrompt = "You are a helpful travel assistant. You parse user travel queries and return structured JSON.";
    const userPrompt = `
      The user wants to plan a trip. Based on their query, identify the cities they want to visit in order.
      User query: "${query}"
      
      Available cities: ${destNames}
      
      Return a JSON object containing a "cities" array of the exact city names from the available cities list that match the user's request:
      {
        "cities": ["City1", "City2"]
      }
      Maintain the order of the trip. If a city isn't in the available list, find the closest match or omit it.
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true);

    if (resultText) {
      const parsed = JSON.parse(resultText);
      return parsed.cities || [];
    }
    return [];
  } catch (error) {
    console.error("Error parsing itinerary query:", error);
    return [];
  }
};

export const generateTripAdvice = async (
  destination: TrainDeal,
  currentChat: string
): Promise<string> => {
  try {
    const systemPrompt = "You are a helpful travel assistant specialized in European train travel.";
    const userPrompt = `
      The user is interested in a train deal to ${destination.destinationName}, ${destination.destinationCountry}.
      
      Context:
      - Category: ${destination.category}
      - Train Duration from ${destination.originName}: ${destination.duration}
      - Price estimate: $${destination.price}
      - Train Operator: ${destination.trainOperator}
      
      User's last message/context: "${currentChat}"
      
      Provide a short, enthusiastic, and specific paragraph (max 40 words) about why this train deal is a great choice for a ${destination.category} trip. Mention one specific hidden gem at the destination.
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], false);

    return resultText || "Explore the beauty of this destination!";
  } catch (error: any) {
    console.error("Error generating trip advice:", error);
    return "The travel guide is currently offline, but the destination is beautiful.";
  }
};

export const generateGeneralChat = async (
  history: { role: string; text: string }[],
  message: string
): Promise<string> => {
  try {
    const systemInstruction = "You are a train travel expert called Travel Notes AI Deals. You help people find the best train deals and plan multi-city itineraries across Europe. Keep answers short, punchy, and focused on logistics (time, price, trains) and vibes. Use emojis sparingly.";
    
    const formattedMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemInstruction }
    ];

    history.forEach(h => {
      formattedMessages.push({
        role: h.role === 'assistant' || h.role === 'model' ? 'assistant' : 'user',
        content: h.text
      });
    });

    formattedMessages.push({ role: 'user', content: message });

    const resultText = await callDeepSeek(formattedMessages, false);
    return resultText || "I didn't quite catch that.";
  } catch (error: any) {
    console.error("Error generating general chat:", error);
    return "I'm having trouble connecting to the network right now. Please try again.";
  }
};

// Helper to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export interface CopilotResponse {
  message: string;
  actions: { type: string; label: string; payload?: any }[];
  destinationIds: string[];
  quickReplies: string[];
}

export const chatWithCopilot = async (
  history: { role: string; text: string }[],
  userMessage: string,
  availableDestinations: TrainDeal[],
  currentOrigin: string,
  currentTrip: TrainDeal[]
): Promise<CopilotResponse> => {
  try {
    const destSummary = availableDestinations.slice(0, 30).map(d => ({
      id: d.id,
      name: d.destinationName,
      country: d.destinationCountry,
      category: d.category,
      price: d.price,
      duration: d.duration,
      transfers: d.transfers
    }));

    const systemPrompt = `You are TrainExplore AI (trainexplore.com), an intelligent, enthusiastic, and highly knowledgeable European train travel copilot.
Your mission is to help travelers discover scenic train journeys, find rail deals, build multi-city train loops, and compare timetables and travel options.

You must respond in JSON format with:
1. "message": A warm, inspiring, and concise markdown message (use bullet points and bold highlights).
2. "actions": Array of executable UI actions you want to offer to the user. Valid action types:
   - "SET_FILTERS": payload { maxPrice?: number, maxDuration?: number, directOnly?: boolean, category?: string }
   - "ADD_TO_TRIP": payload { destinationIds: string[] }
   - "SELECT_DESTINATION": payload { id: string }
   - "OPTIMIZE_ROUTE": payload {}
   - "SET_ORIGIN": payload { origin: string }
   - "GENERATE_ITINERARY": payload {}
   - "RESET_FILTERS": payload {}
   Each action must have a user-friendly "label" (e.g., "🎯 Filter under $50", "➕ Add Prague to Trip", "✨ Generate Itinerary").
3. "destinationIds": Array of matching destination IDs to highlight on the map.
4. "quickReplies": 2-4 short contextual suggestions the user might ask next.

Available Destinations Sample:
${JSON.stringify(destSummary)}

Current User State:
Origin: ${currentOrigin}
Current Trip in Builder: ${currentTrip.map(t => t.destinationName).join(' -> ') || 'None'}
`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(h => ({
        role: (h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: h.text
      })),
      { role: 'user' as const, content: userMessage }
    ];

    const resultText = await callDeepSeek(messages, true);
    if (resultText) {
      const parsed = JSON.parse(resultText);
      return {
        message: parsed.message || "Here are some great options for your train adventure!",
        actions: parsed.actions || [],
        destinationIds: parsed.destinationIds || [],
        quickReplies: parsed.quickReplies || ["Tell me more", "Find hotels", "Show cheaper dates"]
      };
    }
  } catch (error) {
    console.warn("DeepSeek copilot failed, fallback to local intelligent parser:", error);
  }

  // Robust Local Fallback Intent Parser
  const lower = userMessage.toLowerCase();
  const matchedActions: any[] = [];
  const matchedDestIds: string[] = [];
  let reply = "";
  let quickReplies = ["Show scenic routes", "Direct trains only", "Plan a 3-day loop"];

  if (lower.includes("cheap") || lower.includes("budget") || lower.includes("under") || lower.includes("$")) {
    const priceMatch = lower.match(/\$?(\d+)/);
    const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : 50;
    const cheapDests = availableDestinations.filter(d => d.price <= maxPrice);
    
    cheapDests.slice(0, 4).forEach(d => matchedDestIds.push(d.id));
    matchedActions.push({
      type: 'SET_FILTERS',
      label: `⚡ Filter under $${maxPrice}`,
      payload: { maxPrice }
    });
    if (cheapDests.length > 0) {
      matchedActions.push({
        type: 'ADD_TO_TRIP',
        label: `➕ Add ${cheapDests[0].destinationName} to Trip`,
        payload: { destinationIds: [cheapDests[0].id] }
      });
    }

    reply = `I found **${cheapDests.length} great train deals** under **$${maxPrice}** from ${currentOrigin}! Top picks include **${cheapDests.slice(0, 3).map(d => `${d.destinationName} ($${d.price})`).join(', ')}**.`;
  } else if (lower.includes("mountain") || lower.includes("alps") || lower.includes("ski") || lower.includes("nature")) {
    const natureDests = availableDestinations.filter(d => 
      d.category === 'Mountain' || d.category === 'Nature' || d.category === 'Skiing'
    );
    natureDests.slice(0, 4).forEach(d => matchedDestIds.push(d.id));
    matchedActions.push({
      type: 'SET_FILTERS',
      label: '🏔️ Show Mountains & Nature',
      payload: { category: 'Mountain' }
    });
    if (natureDests.length > 0) {
      matchedActions.push({
        type: 'ADD_TO_TRIP',
        label: `➕ Add ${natureDests[0].destinationName} to Trip`,
        payload: { destinationIds: [natureDests[0].id] }
      });
    }
    reply = `Europe has incredible scenic mountain rails! Check out **${natureDests.slice(0, 3).map(d => d.destinationName).join(', ')}** for panoramic window routes, fresh alpine air, and stunning trails.`;
  } else if (lower.includes("romantic") || lower.includes("wine") || lower.includes("couple")) {
    const romanticDests = availableDestinations.filter(d => d.category === 'Romantic' || d.category === 'City Break');
    romanticDests.slice(0, 4).forEach(d => matchedDestIds.push(d.id));
    matchedActions.push({
      type: 'SET_FILTERS',
      label: '🍷 Show Romantic Journeys',
      payload: { category: 'Romantic' }
    });
    reply = `For a romantic journey, I highly recommend historic cities with river views and charming old towns. **${romanticDests.slice(0, 3).map(d => d.destinationName).join(', ')}** are magical by rail!`;
  } else if (lower.includes("fast") || lower.includes("quick") || lower.includes("weekend") || lower.includes("<3h") || lower.includes("short")) {
    matchedActions.push({
      type: 'SET_FILTERS',
      label: '⚡ Quick Escapes (<3h, Direct)',
      payload: { maxDuration: 3, directOnly: true }
    });
    reply = `Looking for a fast getaway? I've prepared direct high-speed connections under **3 hours** so you can maximize your time exploring!`;
  } else {
    // City match search
    const foundCities = availableDestinations.filter(d => 
      lower.includes(d.destinationName.toLowerCase())
    );
    if (foundCities.length > 0) {
      foundCities.forEach(c => matchedDestIds.push(c.id));
      matchedActions.push({
        type: 'ADD_TO_TRIP',
        label: `➕ Add ${foundCities.map(c => c.destinationName).join(' & ')} to Trip`,
        payload: { destinationIds: foundCities.map(c => c.id) }
      });
      matchedActions.push({
        type: 'SELECT_DESTINATION',
        label: `📍 View ${foundCities[0].destinationName}`,
        payload: { id: foundCities[0].id }
      });
      reply = `**${foundCities.map(c => c.destinationName).join(', ')}** is a fantastic choice! The train journey features scenic stretches, comfortable seating, and drops you right in the city center.`;
    } else {
      reply = `I can help you find the best train routes across Europe! Try asking for **"Romantic wine routes"**, **"Direct trains under 4h"**, or **"Trips under $50"**.`;
    }
  }

  return {
    message: reply,
    actions: matchedActions,
    destinationIds: matchedDestIds,
    quickReplies
  };
};

export const optimizeTripRoute = async (
  originName: string,
  destinations: TrainDeal[]
): Promise<TrainDeal[]> => {
  if (destinations.length <= 1) return destinations;

  try {
    const destList = destinations.map(d => `${d.destinationName} (${d.location.lat}, ${d.location.lng})`).join(', ');
    const systemPrompt = "You are a European rail network routing optimizer. You order a list of cities into the most efficient rail sequence starting from an origin to avoid backtracking.";
    const userPrompt = `
      Origin: ${originName}
      Selected Cities: ${destList}

      Return a JSON array containing the ordered city names that minimizes total travel distance:
      {
        "orderedCities": ["CityA", "CityB", "CityC"]
      }
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true);

    if (resultText) {
      const parsed = JSON.parse(resultText);
      const orderedNames: string[] = parsed.orderedCities || [];
      const reordered: TrainDeal[] = [];
      
      orderedNames.forEach(name => {
        const found = destinations.find(d => d.destinationName.toLowerCase() === name.toLowerCase());
        if (found && !reordered.some(r => r.id === found.id)) {
          reordered.push(found);
        }
      });

      // Add any remaining destinations
      destinations.forEach(d => {
        if (!reordered.some(r => r.id === d.id)) reordered.push(d);
      });

      if (reordered.length === destinations.length) {
        return reordered;
      }
    }
  } catch (err) {
    console.warn("AI route optimization fallback to nearest-neighbor TSP:", err);
  }

  // Fallback: Nearest Neighbor Heuristic
  const unvisited = [...destinations];
  const ordered: TrainDeal[] = [];
  
  // Start from origin (approximate Berlin or first destination)
  let currentLat = destinations[0].location.lat;
  let currentLng = destinations[0].location.lng;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(currentLat, currentLng, unvisited[i].location.lat, unvisited[i].location.lng);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    const nextCity = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(nextCity);
    currentLat = nextCity.location.lat;
    currentLng = nextCity.location.lng;
  }

  return ordered;
};

export const refineItineraryDay = async (
  currentDay: any,
  userInstruction: string
): Promise<any> => {
  try {
    const systemPrompt = "You are a personalized travel itinerary designer. Modify this specific day's schedule according to the user's preference.";
    const userPrompt = `
      Current Day Schedule:
      ${JSON.stringify(currentDay)}

      User's requested modification: "${userInstruction}"

      Return updated JSON for this day in the exact same schema:
      {
        "day": ${currentDay.day},
        "location": "${currentDay.location}",
        "theme": "Updated Theme",
        "trainDetails": "Train details",
        "hotelSuggestion": "Updated hotel suggestion",
        "activities": ["Activity 1", "Activity 2", "Activity 3"],
        "diningHighlight": "Specific restaurant or culinary specialty"
      }
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true);

    if (resultText) {
      return JSON.parse(resultText);
    }
  } catch (error) {
    console.error("Error refining day:", error);
  }
  
  // Fallback update
  return {
    ...currentDay,
    theme: `${currentDay.theme} (Customized)`,
    activities: [
      ...currentDay.activities.slice(0, 2),
      `⭐ Custom AI Pick: ${userInstruction}`
    ]
  };
};

export const getAccommodations = async (destination: TrainDeal): Promise<Accommodation[]> => {
  try {
    const systemPrompt = "You are a travel database assistant. You suggest hotels and lodging in JSON format.";
    const userPrompt = `
      Recommend 5 real, existing accommodation options in ${destination.destinationName}, ${destination.destinationCountry}. 
      Include a mix of hostels, boutique hotels, and one luxury option.
      Provide realistic prices in USD per night and neighborhood.
      
      Return a JSON object containing an "accommodations" array:
      {
        "accommodations": [
          {
            "name": "Hotel Name",
            "rating": 4.5,
            "price": 150,
            "neighborhood": "Old Town"
          }
        ]
      }
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true);

    const parsed = JSON.parse(resultText || "{}");
    const rawData = parsed.accommodations || [];
    
    return rawData.map((item: any, index: number) => ({
      id: `ai-stay-${index}-${Date.now()}`,
      name: item.name,
      rating: item.rating,
      price: item.price,
      neighborhood: item.neighborhood || 'City Center',
      image: HOTEL_IMAGES[index % HOTEL_IMAGES.length]
    }));
  } catch (error) {
    console.error("Error getting accommodations:", error);
    return [];
  }
};

export const getActivities = async (destination: TrainDeal): Promise<Activity[]> => {
  try {
    const systemPrompt = "You are a local tour guide assistant. You suggest activities and landmarks in JSON format.";
    const userPrompt = `
      Recommend 5 specific things to do in ${destination.destinationName}, ${destination.destinationCountry}.
      Focus on cultural, fun, or unique experiences.
      Provide realistic prices in USD (0 if free) and duration.
      
      Return a JSON object containing an "activities" array:
      {
        "activities": [
          {
            "title": "Activity Title",
            "duration": "2h",
            "price": 25,
            "rating": 4.8,
            "category": "Sightseeing"
          }
        ]
      }
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true);

    const parsed = JSON.parse(resultText || "{}");
    const rawData = parsed.activities || [];

    return rawData.map((item: any, index: number) => ({
      id: `ai-act-${index}-${Date.now()}`,
      title: item.title,
      duration: item.duration,
      price: item.price,
      rating: item.rating,
      category: item.category || 'Experience',
      image: ACTIVITY_IMAGES[index % ACTIVITY_IMAGES.length]
    }));
  } catch (error) {
    console.error("Error getting activities:", error);
    return [];
  }
};

export const generateStructuredItinerary = async (destinations: TrainDeal[]): Promise<StructuredItinerary | null> => {
  try {
    const destNames = destinations.map(d => d.destinationName).join(', ');
    
    const systemPrompt = "You are an expert European train travel planner. You generate structured multi-city itineraries in JSON format.";
    const userPrompt = `
      The user wants to plan a multi-city train itinerary starting from their selected origin and visiting the following cities: ${destNames}.
      
      Create a detailed, day-by-day itinerary. For each day, provide:
      - The location (city).
      - A daily theme or vibe.
      - Train travel details (if moving between cities that day, mention the train operator, duration, and departure recommendation).
      - A specific hotel/accommodation suggestion (real hotel + neighborhood).
      - 2-3 specific activities or tours.
      - Dining highlight or local culinary dish to try.
      - Station transfer tip (e.g., luggage storage, navigation tip).
      
      Return a JSON object in this format:
      {
        "title": "A catchy title for the trip",
        "summary": "A 2-3 sentence overview of the entire journey",
        "totalEstimatedCost": 450,
        "totalDurationDays": ${destinations.length * 2},
        "totalCo2SavingsKg": ${destinations.reduce((s, d) => s + (d.co2Kg || 15), 0) * 3},
        "days": [
          {
            "day": 1,
            "location": "City Name",
            "theme": "Theme",
            "trainDetails": "Details",
            "hotelSuggestion": "Hotel Name",
            "activities": ["Activity 1", "Activity 2"],
            "diningHighlight": "Try local specialty at Old Market",
            "stationTransferTip": "Luggage lockers located near platform 12"
          }
        ]
      }
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true);

    if (resultText) {
      return JSON.parse(resultText) as StructuredItinerary;
    }
    return null;
  } catch (error) {
    console.error("Error generating structured itinerary:", error);
    return null;
  }
};

export const generateItinerary = async (destinations: TrainDeal[]): Promise<string> => {
  try {
    const destNames = destinations.map(d => d.destinationName).join(', ');
    
    const systemPrompt = "You are an expert European train travel planner. You write inspiring itineraries in Markdown.";
    const userPrompt = `
      The user wants to plan a multi-city train itinerary starting from their selected origin and visiting the following cities: ${destNames}.
      
      Please generate a logical, day-by-day itinerary. For each stop, include:
      - The train journey details (estimated time, train type).
      - A recommended area or type of accommodation to stay in.
      - 2-3 must-do experiences or sights.
      
      Format the response in clean Markdown with headings, bullet points, and bold text for readability. Keep it inspiring but practical. Do not output HTML.
    `;

    const resultText = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], false);

    return resultText || "Failed to generate itinerary.";
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    return "Sorry, I'm having trouble generating your itinerary right now.";
  }
};

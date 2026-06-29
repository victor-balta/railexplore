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

export const getAccommodations = async (destination: TrainDeal): Promise<Accommodation[]> => {
  try {
    const systemPrompt = "You are a travel database assistant. You suggest hotels and lodging in JSON format.";
    const userPrompt = `
      Recommend 5 real, existing accommodation options in ${destination.destinationName}, ${destination.destinationCountry}. 
      Include a mix of hostels, boutique hotels, and one luxury option.
      Provide realistic prices in USD per night.
      
      Return a JSON object containing an "accommodations" array:
      {
        "accommodations": [
          {
            "name": "Hotel Name",
            "rating": 4.5,
            "price": 150
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
            "rating": 4.8
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
      - Train travel details (if moving between cities that day, mention the train operator and duration. If staying in the same city, just say "Local exploration").
      - A specific hotel/accommodation suggestion (name a real, highly-rated hotel or neighborhood).
      - 2-3 specific activities or tours (name real attractions or tours that could be booked on GetYourGuide).
      
      Return a JSON object in this format:
      {
        "title": "A catchy title for the trip",
        "summary": "A 2-3 sentence overview of the entire journey",
        "days": [
          {
            "day": 1,
            "location": "City Name",
            "theme": "Theme",
            "trainDetails": "Details",
            "hotelSuggestion": "Hotel Name",
            "activities": ["Activity 1", "Activity 2"]
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

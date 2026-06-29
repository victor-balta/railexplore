# RailExplore AI - Project Documentation

## Overview
RailExplore AI (also referred to as Travel Notes AI) is an interactive, AI-powered web application designed to help users discover, plan, and generate European train travel itineraries. Users can explore destinations on an interactive map, filter by travel constraints, and use Google's Gemini AI to generate a detailed, day-by-day travel report.

## Core Features
1. **Interactive Map Exploration:** A dynamic Leaflet map displaying train destinations across Europe.
2. **Smart Filtering:** Users can filter destinations by category (Historical, City Break, Nature, etc.), maximum price, and maximum travel duration.
3. **AI Itinerary Generation:** Integration with Google Gemini API to generate custom, day-by-day itineraries based on selected destinations.
4. **Trip Builder:** A floating action bar that allows users to sequence multiple destinations into a single trip.
5. **Geolocation & Custom Origin:** Users can manually set their starting point or use browser geolocation to start their journey from their current city.
6. **Responsive "One-Pager" Report:** A beautifully designed, printable itinerary report that includes AI-generated daily plans, mock hotel/activity suggestions, and a dedicated route map.

## Tech Stack
* **Frontend Framework:** React 18 with TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Maps:** Leaflet & React-Leaflet
* **AI Integration:** `@google/genai` (Google Gemini API)
* **Routing:** Single Page Application (state-based routing for modals/reports)

## Project Structure
* `/src/App.tsx`: Main application component, layout, and state management.
* `/src/components/MapExplorer.tsx`: Interactive Leaflet map component.
* `/src/components/ItineraryOnePager.tsx`: The generated AI report modal.
* `/src/components/ItineraryMap.tsx`: The static route map shown inside the generated report.
* `/src/services/geminiService.ts`: Handles communication with the Gemini API for itinerary generation.
* `/src/constants.ts`: Mock data for destinations, hotels, and activities.
* `/src/types.ts`: TypeScript interfaces and types.

## Environment Variables
* `GEMINI_API_KEY`: Required to generate AI itineraries.

## Current State
The application is currently in a functional MVP (Minimum Viable Product) state. It successfully demonstrates the core user flow: Origin Selection -> Destination Discovery -> Trip Sequencing -> AI Report Generation.

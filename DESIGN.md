# Design Documentation

## Design Philosophy
RailExplore AI is designed to evoke the excitement of travel while maintaining a clean, modern, and highly usable interface. The design prioritizes content (maps, destination imagery) and uses whitespace and subtle shadows to create depth.

## Color Palette
* **Primary Brand (Blue):** `blue-600` (#2563eb) - Used for primary actions, active states, and branding. Represents trust and the classic color of European rail networks.
* **Secondary/Accent (Orange):** `orange-500` (#f97316) - Used for experiences and highlights to draw attention.
* **Success (Green):** `green-500` (#22c55e) - Used to indicate a destination has been successfully added to the trip.
* **Neutrals (Slate):** `slate-50` to `slate-900` - Used for backgrounds, borders, and typography. Slate provides a softer, more premium feel compared to pure grays.
* **Background:** `#F7F7F5` - A warm off-white used for the report background to resemble high-quality paper.

## Typography
* **Primary Font:** `Inter` (or system sans-serif fallback).
* **Hierarchy:**
  * **Headers:** Bold, tight tracking (`tracking-tight`), slate-800.
  * **Body:** Medium weight, slate-600/700 for readability.
  * **Microcopy/Labels:** Uppercase, bold, wide tracking (`tracking-wider`), slate-500.

## Layout Structure
1. **Header:** Sleek, compact search bar with a fixed height to prevent layout shifts. Contains the AI prompt input and primary "Generate" action.
2. **Left Sidebar (Deals List):** Fixed width on desktop, full width on mobile. Contains origin selection, quick filters, and scrollable destination cards.
3. **Main Content (Map):** Takes up the remaining viewport. Uses a clean, light map tile style (Carto Voyager) to ensure custom markers stand out.
4. **Trip Builder (Floating Bar):** Appears at the bottom center when a trip is being built. Uses a heavy shadow (`shadow-2xl`) to float above the map.

## Responsiveness
* **Mobile-First Adjustments:** Padding, margins, and font sizes are scaled down on smaller screens (`sm:` and `md:` breakpoints).
* **Component Adaptation:** Buttons adapt their text (e.g., "Generate Trip" becomes "Go") to save space on mobile.
* **Report Layout:** The generated itinerary shifts from a multi-column grid to a single-column stack on mobile devices.

## UI Components
* **Cards:** Rounded corners (`rounded-2xl` or `rounded-3xl`), subtle borders, and hover effects (scale up images, change border color).
* **Inputs:** Pill-shaped (`rounded-full`) or softly rounded (`rounded-xl`) with inner shadows and focus rings (`focus:ring-blue-500`).
* **Map Markers:** Custom HTML markers using standard brand colors, with a distinct style for the origin vs. destinations.

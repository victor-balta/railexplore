import React, { useState, useEffect, useRef } from 'react';
import { CategoryType, TrainDeal, FilterState } from '../types';
import { BERLIN_COORDS } from '../constants';
import { 
  Clock, Euro, Mountain, Heart, Tent, Palmtree, Castle, Snowflake, Building2, Trees, Sparkles, ChevronLeft, ChevronRight, Train
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const L: any;

interface MapExplorerProps {
  destinations: TrainDeal[];
  selectedDestination: TrainDeal | null;
  onSelectDestination: (dest: TrainDeal) => void;
  selectedCategory: CategoryType | 'All';
  onSelectCategory: (cat: CategoryType | 'All') => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  itineraryDestinations: TrainDeal[];
}

const categories = [
  { type: CategoryType.Anywhere, icon: Train, label: 'Anywhere' },
  { type: CategoryType.City, icon: Building2, label: 'City Break' },
  { type: CategoryType.Historical, icon: Castle, label: 'Historical' },
  { type: CategoryType.Nature, icon: Trees, label: 'Nature' },
  { type: CategoryType.Mountains, icon: Mountain, label: 'Mountain' },
  { type: CategoryType.Skiing, icon: Snowflake, label: 'Skiing' },
  { type: CategoryType.Lakeside, icon: Tent, label: 'Lakeside' },
  { type: CategoryType.Beaches, icon: Palmtree, label: 'Beaches' },
  { type: CategoryType.Romantic, icon: Heart, label: 'Romantic' },
  { type: CategoryType.Wellness, icon: Sparkles, label: 'Wellness' },
];

const MapExplorer: React.FC<MapExplorerProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  selectedCategory,
  onSelectCategory,
  filters,
  setFilters,
  itineraryDestinations
}) => {
  const [activeFilter, setActiveFilter] = useState<'price' | 'duration' | null>(null);
  const [mapZoom, setMapZoom] = useState(4);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  
  // Scroll Logic
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScroll = () => {
    if (!categoriesRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
    setShowLeftScroll(scrollLeft > 10);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 300;
      categoriesRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
      zoom: 4,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom Berlin Marker
    const berlinIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #1a73e8; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker([BERLIN_COORDS.lat, BERLIN_COORDS.lng], { icon: berlinIcon, interactive: false }).addTo(map);

    map.on('moveend', () => {
      setMapZoom(map.getZoom());
      setMapBounds(map.getBounds());
    });

    // Set initial state
    setMapZoom(map.getZoom());
    setMapBounds(map.getBounds());

    mapInstance.current = map;
    markersLayer.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    let visibleDestinations = destinations;

    // Filter by bounds if available
    if (mapBounds) {
      visibleDestinations = visibleDestinations.filter(dest => {
        return mapBounds.contains(L.latLng(dest.location.lat, dest.location.lng));
      });
    }

    // Determine max markers based on zoom level
    let maxMarkers = 100;
    if (mapZoom <= 4) maxMarkers = 15;
    else if (mapZoom === 5) maxMarkers = 30;
    else if (mapZoom === 6) maxMarkers = 50;
    else if (mapZoom >= 7) maxMarkers = 100;

    visibleDestinations = visibleDestinations.slice(0, maxMarkers);

    // Always ensure the selected destination is visible
    if (selectedDestination && !visibleDestinations.find(d => d.id === selectedDestination.id)) {
      visibleDestinations.push(selectedDestination);
    }

    // Always ensure itinerary destinations are visible
    itineraryDestinations.forEach(d => {
      if (!visibleDestinations.find(vd => vd.id === d.id)) {
        visibleDestinations.push(d);
      }
    });

    // Draw the itinerary polyline
    if (itineraryDestinations.length > 0) {
      const routeLatLngs = [
        [BERLIN_COORDS.lat, BERLIN_COORDS.lng],
        ...itineraryDestinations.map(d => [d.location.lat, d.location.lng])
      ];
      L.polyline(routeLatLngs, { color: '#16a34a', weight: 3, dashArray: '6, 6', opacity: 0.8, lineCap: 'round' }).addTo(markersLayer.current);
    }

    visibleDestinations.forEach(dest => {
      const isSelected = selectedDestination?.id === dest.id;
      const isInItinerary = itineraryDestinations.some(d => d.id === dest.id);
      
      let markerBg = 'bg-white text-slate-800 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200';
      if (isSelected) markerBg = 'bg-blue-600 text-white border-blue-700';
      else if (isInItinerary) markerBg = 'bg-green-600 text-white border-green-700';

      const html = `
        <div class="group relative flex flex-col items-center justify-center transition-all duration-300 ${isSelected || isInItinerary ? 'z-50 scale-110' : 'z-10 hover:z-20 hover:scale-110'}">
           <div class="
              flex items-center gap-1 px-3 py-1.5 rounded-full shadow-md border cursor-pointer font-sans transition-all
              ${markerBg}
           ">
             <span class="text-sm font-bold whitespace-nowrap">$${dest.price}</span>
           </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: html,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });

      const marker = L.marker([dest.location.lat, dest.location.lng], { icon }).addTo(markersLayer.current);
      
      marker.on('click', () => {
        onSelectDestination(dest);
        mapInstance.current.flyTo([dest.location.lat, dest.location.lng], 6, { duration: 1.2 });
      });

      if (isSelected && !isInItinerary) {
        const lastPoint = itineraryDestinations.length > 0 
          ? itineraryDestinations[itineraryDestinations.length - 1].location 
          : BERLIN_COORDS;
        const latlngs = [[lastPoint.lat, lastPoint.lng], [dest.location.lat, dest.location.lng]];
        L.polyline(latlngs, { color: '#1a73e8', weight: 2, dashArray: '4, 8', opacity: 0.6, lineCap: 'round' }).addTo(markersLayer.current);
      }
    });

  }, [destinations, selectedDestination, onSelectDestination, mapZoom, mapBounds, itineraryDestinations]);

  return (
    <div className="relative h-full w-full bg-slate-50 group flex-1 flex flex-col">
      
      {/* --- Floating UI Container --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] w-full max-w-3xl flex flex-col items-center gap-4 px-4 pointer-events-none">
        
        {/* 1. Primary Filters (Price & Duration) */}
        <div className="flex items-center gap-2 pointer-events-auto shadow-md rounded-full p-1 bg-white border border-slate-200">
           
           <div className="relative">
              <button 
                onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'price' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                <span>Price: Under ${filters.maxPrice}</span>
              </button>
              
              {activeFilter === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                   <div className="flex justify-between text-sm font-medium text-slate-700 mb-3">
                       <span>Max Price</span>
                       <span>${filters.maxPrice}</span>
                   </div>
                   <input 
                      type="range" min="50" max="1000" step="50"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({...prev, maxPrice: parseInt(e.target.value)}))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
              )}
           </div>

           <div className="w-px h-6 bg-slate-200"></div>

           <div className="relative">
              <button 
                onClick={() => setActiveFilter(activeFilter === 'duration' ? null : 'duration')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'duration' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                <span>Duration: Under {filters.maxDuration}h</span>
              </button>

              {activeFilter === 'duration' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                   <div className="flex justify-between text-sm font-medium text-slate-700 mb-3">
                       <span>Travel Time</span>
                       <span>{filters.maxDuration}h</span>
                   </div>
                   <input 
                      type="range" min="1" max="24" step="1"
                      value={filters.maxDuration}
                      onChange={(e) => setFilters(prev => ({...prev, maxDuration: parseFloat(e.target.value)}))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
              )}
           </div>

        </div>

        {/* 2. Categories Scroll Bar */}
        <div className="relative w-full max-w-xl pointer-events-auto group/cat">
            
            <button 
                onClick={() => scrollCategories('left')}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 p-1.5 rounded-full bg-white shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200 ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <ChevronLeft size={16} />
            </button>

            <div 
                ref={categoriesRef} 
                onScroll={checkScroll}
                className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-2 mx-1 scroll-smooth"
            >
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.type || (selectedCategory === 'All' && cat.type === CategoryType.Anywhere);
                    return (
                        <button
                            key={cat.label}
                            onClick={() => onSelectCategory(cat.type)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all border ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            <Icon size={16} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

             <button 
                onClick={() => scrollCategories('right')}
                className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 p-1.5 rounded-full bg-white shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200 ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <ChevronRight size={16} />
            </button>
        </div>

      </div>

      <div ref={mapRef} className="w-full flex-1 z-0 outline-none bg-slate-100"></div>
    </div>
  );
};

export default MapExplorer;
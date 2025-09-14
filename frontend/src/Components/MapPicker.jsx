import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaTimes } from "react-icons/fa";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component for marker placement (only one marker)
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); // replaces old marker
    },
  });
  return position ? <Marker position={position} /> : null;
};

// Component to control map programmatically
const MapController = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13); // auto-zoom when a result is selected
    }
  }, [position, map]);
  return null;
};

const MapPicker = ({ onClose, onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const provider = new OpenStreetMapProvider();

  // Auto-search when user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const results = await provider.search({ query: searchQuery });
      setSearchResults(results);
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // When selecting a search result
  const handleSelectResult = (result) => {
    const loc = { lat: result.y, lng: result.x };
    setPosition(loc);
    setSearchResults([]);
    setSearchQuery(result.label); // set selected text in input
  };

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
        <h3 className="text-lg font-semibold">Select Location</h3>
        <button onClick={onClose}>
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Search bar */}
      <div className="p-3 bg-gray-900 flex gap-2 relative z-[1000]">
        <div className="w-full relative">
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Search city or place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white text-black rounded shadow-lg max-h-40 overflow-y-auto z-[1001]">
              {searchResults.map((r, idx) => (
                <div
                  key={idx}
                  className="p-2 hover:bg-gray-200 cursor-pointer truncate"
                  title={r.label} // show full text on hover
                  onClick={() => handleSelectResult(r)}
                >
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={[30.3753, 69.3451]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false} // disable default zoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapController position={position} />
          <ZoomControl position="bottomright" /> {/* moved zoom buttons */}
        </MapContainer>
      </div>

      {/* Footer buttons */}
      <div className="p-3 bg-gray-800 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!position}
          className="px-4 py-2 bg-amber-500 text-white rounded disabled:opacity-50"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default MapPicker;

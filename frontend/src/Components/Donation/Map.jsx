import React, { useEffect, useState } from "react";
import api from "../../../api/api"; // adjust path
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, MapPin } from "lucide-react";

// Custom icons
const restaurantIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ngoIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NearbyNGOs = () => {
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [ngosNearby, setNgosNearby] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch logged-in restaurant and NGOs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1️⃣ Get logged-in user location
        const userRes = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.data.success) {
          toast.error("Failed to fetch user location");
          return;
        }

        console.log(userRes)

        const user = userRes.data.user;

        if (!user.location?.coordinates || user.location.coordinates.length !== 2) {
          toast.error("Restaurant location not found");
          return;
        }

        const [lng, lat] = user.location.coordinates; // GeoJSON order
        const restaurant = { lat, lng };
        setRestaurantLocation(restaurant);

        // 2️⃣ Fetch all NGOs
        const { data } = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ngos = data.filter((u) => u.userType === "ngo");

        // Filter nearby NGOs within 40 km
        const nearby = ngos
          .map((ngo) => {
            if (ngo.ngo_location?.coordinates?.length === 2) {
              const [lng, lat] = ngo.ngo_location.coordinates;
              const distance = getDistanceFromLatLonInKm(
                restaurant.lat,
                restaurant.lng,
                lat,
                lng
              );
              return {
                id: ngo._id,
                name: ngo.ngo_name,
                phone: ngo.ngo_phone,
                lat,
                lng,
                distance: distance.toFixed(2),
              };
            }
            return null;
          })
          .filter((ngo) => ngo && parseFloat(ngo.distance) <= 40);

        setNgosNearby(nearby);
      } catch (error) {
        toast.error("Failed to fetch nearby NGOs.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!restaurantLocation) {
    return <p className="text-center text-gray-500">Loading restaurant location...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Nearby NGOs</h2>

      {/* Map */}
      <div className="h-96 w-full mb-6 rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[restaurantLocation.lat, restaurantLocation.lng]}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Restaurant Marker */}
          <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
            <Popup>🍴 <b>Your Restaurant</b></Popup>
          </Marker>

          {/* NGO Markers */}
          {ngosNearby.map((ngo) => (
            <Marker key={ngo.id} position={[ngo.lat, ngo.lng]} icon={ngoIcon}>
              <Popup>
                <b>{ngo.name}</b>
                <br />
                📞 {ngo.phone}
                <br />
                📍 {ngo.distance} km away
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* NGO List */}
      <div className="bg-white p-6 shadow-lg rounded-2xl">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : ngosNearby.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {ngosNearby.map((ngo) => (
              <div
                key={ngo.id}
                className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md flex justify-between items-center hover:shadow-xl transition"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-500" />
                    {ngo.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Phone size={14} className="text-green-600" /> {ngo.phone}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded-full mb-2">
                    {ngo.distance} km
                  </span>
                  <button
                    onClick={() => alert(`Contact ${ngo.name} at ${ngo.phone}`)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No NGOs found within 40 km.</p>
        )}
      </div>
    </div>
  );
};

export default NearbyNGOs;

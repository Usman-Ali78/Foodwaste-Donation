import React, { useState, useEffect} from "react";
import api from "../../api/api";



import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// Custom icons
// Custom icons
const ngoIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  iconSize: [20, 32], // Reduced size
  iconAnchor: [10, 32], // Adjusted anchor
  popupAnchor: [0, -30],
  shadowSize: [32, 32], // Adjusted shadow size
});

const restaurantIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  iconSize: [20, 32], // Reduced size
  iconAnchor: [10, 32], // Adjusted anchor
  popupAnchor: [0, -30],
  shadowSize: [32, 32], // Adjusted shadow size
});

function SearchControl() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const map = useMap();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched users:", JSON.stringify(data, null, 2));
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch users.");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Add geocoder control
  useEffect(() => {
    if (!map) return;

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        L.marker(center).addTo(map);
        map.setView(center, 14);
      })
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map]);

  return (
    <>
      {isLoading && <div>Loading users...</div>}
      {users.map((user) => {
        let coordinates = null;
        let locationSource = "";
        if (user.userType === "ngo" && user.ngo_location?.coordinates) {
          coordinates = user.ngo_location.coordinates;
          locationSource = "ngo_location";
        } else if (user.userType === "restaurant") {
          if (user.location?.coordinates) {
            coordinates = user.location.coordinates;
            locationSource = "location";
          } else if (user.restaurant_location?.coordinates) {
            coordinates = user.restaurant_location.coordinates;
            locationSource = "restaurant_location";
          } else if (user.rest_location?.coordinates) {
            coordinates = user.rest_location.coordinates;
            locationSource = "rest_location";
          }
        }

        if (!coordinates) {
          console.log(
            `Skipping user ${user._id} (${
              user.userType
            }): No valid coordinates in ${JSON.stringify(
              {
                ngo_location: user.ngo_location,
                restaurant_location: user.restaurant_location,
                location: user.location,
                rest_location: user.rest_location,
              },
              null,
              2
            )}`
          );
          return null;
        }

        if (
          coordinates.length === 2 &&
          !isNaN(coordinates[0]) &&
          !isNaN(coordinates[1]) &&
          coordinates[0] !== null &&
          coordinates[1] !== null
        ) {
          const [lng, lat] = coordinates;
          console.log(
            `Adding marker for ${user.userType} ${user._id} at [${lat}, ${lng}] from ${locationSource}`
          );
          return (
            <Marker
              key={user._id}
              position={[lat, lng]}
              icon={user.userType === "ngo" ? ngoIcon : restaurantIcon}
            >
              <Popup>
                <div>
                  <h3>{user.ngo_name || user.name || "Unknown"}</h3>
                  <p>Type: {user.userType}</p>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.ngo_phone || user.phone || "N/A"}</p>
                  {user.registration_number && (
                    <p>Registration: {user.registration_number}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        } else {
          console.log(
            `Invalid coordinates for user ${user._id} (${user.userType}):`,
            coordinates
          );
          return null;
        }
      })}
    </>
  );
}

function MapView() {
  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Map View</h2>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow z-[1000] my-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">NGOs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Restaurants</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <MapContainer
            center={[33.5204, 73.3587]}
            zoom={8}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SearchControl />
          </MapContainer>
        </div>
      </div>
    </>
  );
}


export default MapView;

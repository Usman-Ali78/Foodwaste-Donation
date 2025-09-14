import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";

// custom icons
const ngoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  iconSize: [35, 35],
});

// haversine distance (km)
const haversine = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const [lat1, lng1] = coords1;
  const [lat2, lng2] = coords2;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const DonationMap = ({ ngoLocation, availableDonations, myActiveClaims }) => {
  return (
    <section className="mt-6 h-[600px]">
      {ngoLocation?.coordinates?.length === 2 ? (
        <MapContainer
          center={[
            ngoLocation.coordinates[1],
            ngoLocation.coordinates[0],
          ]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* NGO marker */}
          <Marker
            position={[
              ngoLocation.coordinates[1],
              ngoLocation.coordinates[0],
            ]}
            icon={ngoIcon}
          >
            <Popup>Your NGO Location</Popup>
          </Marker>

          {/* Show ALL available donations */}
          {availableDonations.map((donation) => {
            if (!donation?.pickup_location?.coordinates) return null;

            const restaurantCoords = [
              donation.pickup_location.coordinates[1],
              donation.pickup_location.coordinates[0],
            ];
            const ngoCoords = [
              ngoLocation.coordinates[1],
              ngoLocation.coordinates[0],
            ];

            return (
              <Marker
                key={donation._id}
                position={restaurantCoords}
                icon={restaurantIcon}
              >
                <Popup>
                  <strong>{donation.item}</strong> <br />
                  Donor: {donation.donor?.restaurant_name || "Unknown"} <br />
                  Quantity: {donation.quantity} {donation.unit} <br />
                  Distance: {haversine(ngoCoords, restaurantCoords).toFixed(2)} km
                </Popup>
              </Marker>
            );
          })}

          {/* Show claimed donations with line */}
          {myActiveClaims.map((claim) => {
            if (!claim.donation?.pickup_location?.coordinates) return null;

            const restaurantCoords = [
              claim.donation.pickup_location.coordinates[1],
              claim.donation.pickup_location.coordinates[0],
            ];
            const ngoCoords = [
              ngoLocation.coordinates[1],
              ngoLocation.coordinates[0],
            ];

            return (
              <React.Fragment key={claim._id}>
                <Marker
                  position={restaurantCoords}
                  icon={restaurantIcon}
                >
                  <Popup>
                    <strong>{claim.donation.item}</strong> <br />
                    Donor: {claim.donation.donor?.restaurant_name || "Unknown"} <br />
                    Distance: {haversine(ngoCoords, restaurantCoords).toFixed(2)} km
                  </Popup>
                </Marker>

                {/* Route line NGO → Restaurant */}
                <Polyline
                  positions={[ngoCoords, restaurantCoords]}
                  color="blue"
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      ) : (
        <p className="text-gray-500">
          Set your NGO location in Profile Settings to view map.
        </p>
      )}
    </section>
  );
};

export default DonationMap;
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapLocation = ({ position }) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`;

  return (
    <div className="w-full">
      <div className="h-[400px] w-full">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Tooltip>Our Company Location</Tooltip>
          </Marker>
        </MapContainer>
      </div>
      <div className="flex justify-center mt-4">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-wisdomOrange text-white px-6 py-2 rounded hover:bg-wisdomDarkOrange transition"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
};

export default MapLocation;
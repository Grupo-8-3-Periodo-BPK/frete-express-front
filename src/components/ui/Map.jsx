// src/components/ui/Map.jsx

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Flag, Package, Truck } from "lucide-react";

// FUNÇÃO AUXILIAR para criar ícones personalizados com Lucide
// Isso nos permite usar nossos ícones React diretamente no mapa Leaflet.
const createCustomIcon = (iconComponent, className) => {
  return L.divIcon({
    html: renderToStaticMarkup(iconComponent),
    className: `leaflet-custom-icon ${className}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Ícone para a Origem (um pacote)
const originIcon = createCustomIcon(
  <Package size={20} color="#fff" />,
  "bg-green-500" // Fundo verde para indicar o início
);

// Ícone para o Destino (uma bandeira)
const destinationIcon = createCustomIcon(
  <Flag size={20} color="#fff" />,
  "bg-red-500" // Fundo vermelho para indicar o fim
);

// Ícone para o veículo em trânsito (NOVO)
const truckIcon = createCustomIcon(
  <Truck size={20} color="#fff" />,
  "bg-blue-500" // Fundo azul para rastreamento
);

// Componente que ajusta os limites do mapa para encaixar a rota
const MapUpdater = ({ origin, destination, route, position }) => {
  const map = useMap();

  useEffect(() => {
    // 1. Caso mais completo: mostrar rota e a posição do motorista nela.
    if (route && route.length > 0 && position && position.coords) {
      const bounds = L.latLngBounds(route).extend(position.coords);
      map.fitBounds(bounds, { padding: [60, 60] });

      // 2. Caso de rota estática (sem rastreio em tempo real).
    } else if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });

      // 3. Caso de apenas origem e destino, sem rota traçada.
    } else if (origin && origin.coords && destination && destination.coords) {
      const bounds = L.latLngBounds([origin.coords, destination.coords]);
      map.fitBounds(bounds, { padding: [70, 70] });

      // 4. Caso de rastreamento de um único ponto, sem rota.
    } else if (position && position.coords) {
      map.setView(position.coords, 15);

      // 5. Caso de apenas um ponto de origem.
    } else if (origin && origin.coords) {
      map.setView(origin.coords, 11);
    }
  }, [origin, destination, route, position, map]);

  return null;
};

const Map = ({ origin, destination, route, position }) => {
  // Define a URL do mapa com base no tema
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // Tema claro

  const tileAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Posição padrão caso nenhuma coordenada seja fornecida
  const defaultPosition = [-15.793889, -47.882778]; // Brasília

  // Define o centro com base nas props
  const center =
    position && position.coords
      ? position.coords
      : origin && origin.coords
      ? origin.coords
      : defaultPosition;

  // Define o zoom com base nas props
  const zoom =
    position && position.coords ? 15 : origin && origin.coords ? 13 : 5;

  return (
    // Usamos a 'key' para forçar a recriação do MapContainer se a posição padrão mudar, evitando bugs.
    <MapContainer
      key={position ? "map-tracking" : origin ? "map-route" : "map-default"}
      center={center}
      zoom={zoom}
      style={{ height: "450px", width: "100%", zIndex: 1 }}
    >
      <TileLayer url={tileUrl} attribution={tileAttribution} />

      {/* Rota (Polilinha) */}
      {route && route.length > 0 && (
        <Polyline positions={route} color="#3b82f6" weight={5} opacity={0.8} />
      )}

      {/* Marcador de Posição Atual (Rastreamento) */}
      {origin && origin.coords && (
        <Marker position={origin.coords} icon={truckIcon}>
          <Popup>{origin.label || "Localização atual"}</Popup>
        </Marker>
      )}

      {/* Marcador de Origem */}
      {origin && origin.coords && (
        <Marker position={origin.coords} icon={originIcon}>
          <Popup>
            <b>Origem:</b>
            <br />
            {origin.label}
          </Popup>
        </Marker>
      )}

      {/* Marcador de Destino */}
      {destination && destination.coords && (
        <Marker position={destination.coords} icon={destinationIcon}>
          <Popup>
            <b>Destino:</b>
            <br />
            {destination.label}
          </Popup>
        </Marker>
      )}

      {/* Componente para centralizar e dar zoom no mapa automaticamente */}
      <MapUpdater
        origin={origin}
        destination={destination}
        route={route}
        position={position}
      />
    </MapContainer>
  );
};

export default Map;

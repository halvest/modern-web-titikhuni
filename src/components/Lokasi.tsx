"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  Navigation,
  MousePointer2,
  Zap,
} from "lucide-react";

// --- Leaflet Imports ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- CUSTOM VIBRANT ICON ---
const customIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const projects = [
  {
    id: 1,
    name: "Candibinangun",
    region: "Pakem, Sleman",
    status: "Ready Stock",
    coords: [-7.6521, 110.4182] as [number, number],
    desc: "Hunian sejuk dengan view Merapi langsung dari jendela rumah Anda.",
    dotColor: "bg-neutral-900",
  },
  {
    id: 2,
    name: "Tirtomartani",
    region: "Kalasan, Sleman",
    status: "Progress",
    coords: [-7.7612, 110.4789] as [number, number],
    desc: "Akses emas dekat Candi Kalasan, Bandara, dan pusat perbelanjaan.",
    dotColor: "bg-neutral-400",
  },
  {
    id: 3,
    name: "Bangunjiwo",
    region: "Kasihan, Bantul",
    status: "Sold Out",
    coords: [-7.8465, 110.3245] as [number, number],
    desc: "Kawasan seni dan budaya yang asri dengan desain material jujur.",
    dotColor: "bg-neutral-200",
  },
  {
    id: 4,
    name: "Trirenggo",
    region: "Bantul Kota",
    status: "Coming Soon",
    coords: [-7.8921, 110.3356] as [number, number],
    desc: "Eksklusivitas di jantung Bantul Kota untuk privasi keluarga Anda.",
    dotColor: "bg-neutral-300",
  },
];

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export const Lokasi = () => {
  const [activeCoords, setActiveCoords] = useState<[number, number] | null>(
    null,
  );
  const [mapReady, setMapReady] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <section id="lokasi" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-900 rounded-full mb-4"
          >
            <Zap size={10} fill="currentColor" />
            <span className="text-[9px] font-archivo uppercase tracking-[0.2em] font-bold">
              Project Network
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-6xl font-archivo uppercase leading-none tracking-tighter text-neutral-900">
            Akses <span className="text-neutral-300">Yogyakarta</span>{" "}
            <br className="hidden md:block" />
            Tanpa Batas.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* List Selector - Responsive Stack/Scroll */}
          <div className="lg:col-span-4 space-y-3 order-2 lg:order-1 max-h-[400px] lg:max-h-none overflow-y-auto lg:overflow-visible pr-1 md:pr-0">
            {projects.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveCoords(loc.coords);
                  setIsInteracting(true);
                  if (window.innerWidth < 1024) {
                    document
                      .getElementById("map-view")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`w-full text-left p-5 md:p-6 transition-all duration-500 relative rounded-xl border ${
                  activeCoords === loc.coords
                    ? "bg-neutral-900 border-neutral-900 shadow-xl scale-[1.01]"
                    : "bg-white border-neutral-100 hover:border-neutral-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${activeCoords === loc.coords ? "bg-white" : loc.dotColor} animate-pulse`}
                    />
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest ${activeCoords === loc.coords ? "text-neutral-400" : "text-neutral-500"}`}
                    >
                      {loc.status}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`transition-transform duration-500 ${
                      activeCoords === loc.coords
                        ? "rotate-[-45deg] text-white"
                        : "text-neutral-300"
                    }`}
                  />
                </div>
                <h4
                  className={`text-lg md:text-xl font-archivo uppercase tracking-tight mb-1 ${activeCoords === loc.coords ? "text-white" : "text-neutral-900"}`}
                >
                  {loc.name}
                </h4>
                <p
                  className={`text-xs font-light tracking-wide ${activeCoords === loc.coords ? "text-neutral-400" : "text-neutral-500"}`}
                >
                  {loc.region}
                </p>
              </button>
            ))}
          </div>

          {/* Map Display - Integrated Theme */}
          <div
            id="map-view"
            className="lg:col-span-8 h-[350px] md:h-[500px] lg:h-full relative order-1 lg:order-2"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border border-neutral-100 shadow-sm relative bg-neutral-50">
              {/* Interaction Overlay for Mobile */}
              {!isInteracting && (
                <div
                  onClick={() => setIsInteracting(true)}
                  className="absolute inset-0 z-[1000] bg-black/5 backdrop-blur-[1px] lg:hidden flex items-center justify-center cursor-pointer"
                >
                  <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-[9px] font-archivo uppercase tracking-widest font-bold border border-white/50">
                    <MousePointer2 size={12} /> Ketuk untuk Navigasi
                  </div>
                </div>
              )}

              {mapReady && (
                <MapContainer
                  center={[-7.7956, 110.3695]}
                  zoom={11}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                  style={{ zIndex: 1 }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap"
                  />

                  {projects.map((loc) => (
                    <Marker
                      key={loc.id}
                      position={loc.coords}
                      icon={customIcon}
                    >
                      <Popup minWidth={200}>
                        <div className="p-1 text-center font-archivo">
                          <h5 className="font-bold text-sm uppercase tracking-tight text-neutral-900">
                            {loc.name}
                          </h5>
                          <p className="text-[10px] text-neutral-500 my-2 leading-relaxed">
                            {loc.desc}
                          </p>
                          <a
                            href={`https://wa.me/6289509888404?text=Halo Titik Huni, lokasi ${loc.name} presisinya dimana ya?`}
                            target="_blank"
                            className="bg-neutral-900 text-white px-3 py-2 text-[9px] font-bold uppercase block tracking-widest transition-colors hover:bg-black mt-2"
                          >
                            Dapatkan Lokasi
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <FlyToLocation coords={activeCoords} />
                </MapContainer>
              )}

              {/* Float Card Info - Desktop Only */}
              <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 hidden md:flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                  <Navigation size={16} />
                </div>
                <div>
                  <p className="text-[8px] font-archivo uppercase tracking-widest text-neutral-400">
                    Map Preview
                  </p>
                  <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-tighter">
                    Yogyakarta Area
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

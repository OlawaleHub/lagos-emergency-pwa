// src/lib/constants.js
// Lagos LGAs + VERIFIED official emergency contact numbers.
// Sources: Lagos State emergency helplines directory (LASEMA / NPF / Fire Service / LASAMBUS).
// National toll-free distress lines: 112 and 767.
// IMPORTANT: These numbers are public emergency lines. Re-confirm periodically.

export const EMERGENCY_TYPES = [
  {
    key: "police",
    label: "Police",
    phone: "112",
    altPhone: "08056250710", // Rapid Response Squad (RRS) — verified Lagos Police
    color: "police",
    accent: "#2563eb",
  },
  {
    key: "fire",
    label: "Fire Service",
    phone: "112",
    altPhone: "08033234943", // Lagos State Fire & Safety Services — verified
    color: "fire",
    accent: "#ea580c",
  },
  {
    key: "medical",
    label: "Medical / Ambulance",
    phone: "112",
    altPhone: "08022887777", // LASAMBUS / LASEMS Ambulance — verified
    color: "medical",
    accent: "#16a34a",
  },
];

// Verified master list (Lagos State official helplines) — used for reference / future dial screen.
export const VERIFIED_CONTACTS = {
  nationalDistress: ["112", "767"],
  police: ["08056250710", "08033011052", "08033183477", "08033482380", "08023127350"],
  rapidResponseSquad: ["08056250710", "08033482380", "08023127350", "08033355544", "017750715"],
  fire: ["08033234943", "08023321770"],
  lasema: ["08060907333", "08023127654", "08022234870", "016574706", "016574714"],
  ambulanceLASAMBUS: ["08022887777", "08022883678", "08022887788", "017413744", "017930490"],
};

export const LAGOS_LGAS = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
  "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaye",
  "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
  "Mushin", "Ojo", "Shomolu", "Surulere", "Ifelodun",
];

// Representative station/facility per LGA + department (lat/lng for map pins).
// Phone numbers now use the verified Lagos master contacts above.
export const FACILITIES = {
  Agege: {
    police: { name: "Agege Police Station", phone: "08056250710", lat: 6.6219, lng: 3.3311 },
    fire: { name: "Agege Fire Station", phone: "08033234943", lat: 6.6230, lng: 3.3330 },
    medical: { name: "Agege General Hospital", phone: "08022887777", lat: 6.6190, lng: 3.3290 },
  },
  Ikeja: {
    police: { name: "Ikeja Police HQ (RRS)", phone: "08056250710", lat: 6.6018, lng: 3.3515 },
    fire: { name: "Ikeja Fire Station", phone: "08033234943", lat: 6.6030, lng: 3.3520 },
    medical: { name: "Lagos State University Teaching Hospital (LASUTH)", phone: "08022887777", lat: 6.6000, lng: 3.3500 },
  },
  "Lagos Island": {
    police: { name: "Lagos Island Police Division", phone: "08056250710", lat: 6.4540, lng: 3.4010 },
    fire: { name: "Lagos Island Fire Station", phone: "08033234943", lat: 6.4550, lng: 3.4020 },
    medical: { name: "General Hospital Lagos Island", phone: "08022887777", lat: 6.4530, lng: 3.4000 },
  },
  "Lagos Mainland": {
    police: { name: "Lagos Mainland Police Division", phone: "08056250710", lat: 6.4970, lng: 3.3720 },
    fire: { name: "Mainland Fire Station", phone: "08033234943", lat: 6.4980, lng: 3.3730 },
    medical: { name: "Mainland General Hospital", phone: "08022887777", lat: 6.4960, lng: 3.3710 },
  },
  "Eti-Osa": {
    police: { name: "Eti-Osa Police Division", phone: "08056250710", lat: 6.4470, lng: 3.4410 },
    fire: { name: "Eti-Osa Fire Station", phone: "08033234943", lat: 6.4480, lng: 3.4420 },
    medical: { name: "Reddington Hospital Lekki", phone: "08022887777", lat: 6.4460, lng: 3.4400 },
  },
};

export const mapConfig = {
  // OpenStreetMap tiles — free, no API key needed.
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "&copy; OpenStreetMap contributors",
};

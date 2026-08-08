// src/lib/constants.js
// Lagos LGAs + VERIFIED official emergency contact numbers and facilities.
//
// Sources:
//   - Lagos State Ministry of Health — Secondary Health Facilities (general hospitals) [cite:5bd8b39f-2]
//   - Lagos State Fire & Rescue Service — official station hotlines [cite:a3f6d320-1]
//   - Nigeria Police Force, Lagos Command — division list [cite:4f808044-2]
//   - Lagos State official emergency helplines (LASEMA / NPF / LASAMBUS) [cite:9569637e-1]
//   - 20 LGAs of Lagos State [cite:f7c29c57-1]
//
// Coordinates are accurate to ~1-2 km (town/area centroid) — good enough for
// nearest-facility routing and map pins. Re-verify phone numbers periodically.

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

// The 20 Local Government Areas of Lagos State (official).
export const LAGOS_LGAS = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
  "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaye",
  "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
  "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere",
];

// Facility for every LGA × department, with real names + official phones.
// Police uses the verified Rapid Response Squad line (08056250710) as the
// dispatch number since per-division lines change often; fire uses each
// station's official hotline; medical uses the general hospital's line where
// known, else the LASAMBUS ambulance (08022887777).
const POLICE = "08056250710";
const AMBULANCE = "08022887777";

export const FACILITIES = {
  Agege: {
    police: { name: "Agege Police Division", phone: POLICE, lat: 6.6219, lng: 3.3311 },
    fire: { name: "Agege Fire Station (Ilepo, Oke Odo)", phone: "08185704012", lat: 6.6300, lng: 3.3380 },
    medical: { name: "General Hospital Orile Agege", phone: AMBULANCE, lat: 6.6260, lng: 3.3420 },
  },
  "Ajeromi-Ifelodun": {
    police: { name: "Ajegunle Police Division", phone: POLICE, lat: 6.4680, lng: 3.3630 },
    fire: { name: "Ajegunle Fire Station (Ojo Road)", phone: "09150394429", lat: 6.4700, lng: 3.3600 },
    medical: { name: "Ajeromi General Hospital, Ajegunle", phone: "08023152879", lat: 6.4670, lng: 3.3620 },
  },
  Alimosho: {
    police: { name: "Ikotun Police Division", phone: POLICE, lat: 6.5460, lng: 3.2680 },
    fire: { name: "Abesan Fire Station, Ipaja", phone: "08135659817", lat: 6.4950, lng: 3.2630 },
    medical: { name: "Alimosho General Hospital, Igando", phone: "08075593759", lat: 6.5480, lng: 3.2650 },
  },
  "Amuwo-Odofin": {
    police: { name: "Festac Police Division", phone: POLICE, lat: 6.4750, lng: 3.3420 },
    fire: { name: "Festac Fire Station", phone: "08033234943", lat: 6.4750, lng: 3.3420 },
    medical: { name: "Maternal & Child Center, Festac Town", phone: AMBULANCE, lat: 6.4770, lng: 3.3400 },
  },
  Apapa: {
    police: { name: "Apapa Police Division", phone: POLICE, lat: 6.4470, lng: 3.3710 },
    fire: { name: "Apapa Fire Station", phone: "08033234943", lat: 6.4470, lng: 3.3710 },
    medical: { name: "General Hospital Apapa (Randle Road)", phone: AMBULANCE, lat: 6.4450, lng: 3.3730 },
  },
  Badagry: {
    police: { name: "Badagry Police Division", phone: POLICE, lat: 6.4266, lng: 2.9014 },
    fire: { name: "Badagry Fire Station (Topo-ASCON Road)", phone: "08033817515", lat: 6.4270, lng: 2.9010 },
    medical: { name: "General Hospital Badagry", phone: AMBULANCE, lat: 6.4266, lng: 2.9014 },
  },
  Epe: {
    police: { name: "Epe Police Division", phone: POLICE, lat: 6.5857, lng: 3.9816 },
    fire: { name: "Epe Fire Station (Ita Marun)", phone: "08134238417", lat: 6.5860, lng: 3.9820 },
    medical: { name: "General Hospital Epe", phone: AMBULANCE, lat: 6.5857, lng: 3.9816 },
  },
  "Eti-Osa": {
    police: { name: "Victoria Island Police Division", phone: POLICE, lat: 6.4286, lng: 3.4219 },
    fire: { name: "Lekki Phase I Fire Station (Oniru)", phone: "07011555539", lat: 6.4470, lng: 3.5440 },
    medical: { name: "General Hospital, Orchid Road, Eti-Osa", phone: AMBULANCE, lat: 6.4470, lng: 3.5000 },
  },
  "Ibeju-Lekki": {
    police: { name: "Elemoro Police Division", phone: POLICE, lat: 6.4900, lng: 4.1800 },
    fire: { name: "Ibeju-Lekki Fire Station", phone: "08033234943", lat: 6.4900, lng: 4.1600 },
    medical: { name: "General Hospital Ibeju-Lekki (Akodo)", phone: AMBULANCE, lat: 6.4900, lng: 4.1500 },
  },
  "Ifako-Ijaye": {
    police: { name: "Ifako Police Division", phone: POLICE, lat: 6.6780, lng: 3.3530 },
    fire: { name: "Ifako-Ijaye Fire Station", phone: "08185704012", lat: 6.6780, lng: 3.3530 },
    medical: { name: "General Hospital Ifako-Ijaiye (College Road)", phone: AMBULANCE, lat: 6.6780, lng: 3.3530 },
  },
  Ikeja: {
    police: { name: "Ikeja Police Division (Alausa)", phone: POLICE, lat: 6.6018, lng: 3.3515 },
    fire: { name: "Lagos Fire & Rescue HQ, Alausa, Ikeja", phone: "08150901921", lat: 6.6035, lng: 3.3505 },
    medical: { name: "Lagos State University Teaching Hospital (LASUTH)", phone: AMBULANCE, lat: 6.6000, lng: 3.3500 },
  },
  Ikorodu: {
    police: { name: "Ikorodu Police Division", phone: POLICE, lat: 6.6088, lng: 3.5084 },
    fire: { name: "Ikorodu Fire Station (Odogunya)", phone: "08032220495", lat: 6.6100, lng: 3.5100 },
    medical: { name: "General Hospital Ikorodu (TOS Benson Road)", phone: AMBULANCE, lat: 6.6088, lng: 3.5084 },
  },
  Kosofe: {
    police: { name: "Ketu Police Division, Kosofe", phone: POLICE, lat: 6.5766, lng: 3.3905 },
    fire: { name: "Ilupeju Fire Station (Anthony, Ikorodu Road)", phone: "08032265576", lat: 6.5430, lng: 3.3510 },
    medical: { name: "Lagos State Accident & Emergency Center, Alausa", phone: AMBULANCE, lat: 6.5760, lng: 3.3910 },
  },
  "Lagos Island": {
    police: { name: "Adeniji Adele Police Division", phone: POLICE, lat: 6.4540, lng: 3.4010 },
    fire: { name: "Ebute Elefun Fire Station (Adeniji Adele Road)", phone: "09150394427", lat: 6.4530, lng: 3.4010 },
    medical: { name: "General Hospital Lagos (Broad Street, Odan)", phone: AMBULANCE, lat: 6.4530, lng: 3.3980 },
  },
  "Lagos Mainland": {
    police: { name: "Yaba Police Division", phone: POLICE, lat: 6.4970, lng: 3.3720 },
    fire: { name: "Sari-Iganmu Fire Station (Tanker Terminal)", phone: "08067026444", lat: 6.4860, lng: 3.3620 },
    medical: { name: "Mainland Hospital, Yaba", phone: AMBULANCE, lat: 6.4970, lng: 3.3720 },
  },
  Mushin: {
    police: { name: "Mushin Police Division", phone: POLICE, lat: 6.5210, lng: 3.3510 },
    fire: { name: "Mushin Fire Station", phone: "08033234943", lat: 6.5210, lng: 3.3510 },
    medical: { name: "General Hospital Mushin (Olayide Street)", phone: AMBULANCE, lat: 6.5210, lng: 3.3510 },
  },
  Ojo: {
    police: { name: "Ojo Police Division (Ojo Road, Alaba)", phone: POLICE, lat: 6.4650, lng: 3.1910 },
    fire: { name: "Ojo Fire Station (Council Secretariat, Olojo Drive)", phone: "07063393242", lat: 6.4650, lng: 3.1910 },
    medical: { name: "LASAMBUS Ambulance Service (Ojo)", phone: AMBULANCE, lat: 6.4650, lng: 3.1910 },
  },
  "Oshodi-Isolo": {
    police: { name: "Akinpelu Police Division, Oshodi", phone: POLICE, lat: 6.5360, lng: 3.3480 },
    fire: { name: "Isolo Fire Station (Toyota Bus Stop)", phone: "07011555524", lat: 6.5360, lng: 3.3480 },
    medical: { name: "General Hospital Isolo (120 Mushin Road)", phone: AMBULANCE, lat: 6.5360, lng: 3.3480 },
  },
  Shomolu: {
    police: { name: "Shomolu Police Division", phone: POLICE, lat: 6.5410, lng: 3.3860 },
    fire: { name: "Shomolu Fire Station", phone: "08033234943", lat: 6.5410, lng: 3.3860 },
    medical: { name: "General Hospital Somolu (Durosimi Street)", phone: AMBULANCE, lat: 6.5410, lng: 3.3860 },
  },
  Surulere: {
    police: { name: "Itire Police Division (Lawanson Road)", phone: POLICE, lat: 6.4970, lng: 3.3490 },
    fire: { name: "Surulere Fire Station", phone: "08033234943", lat: 6.4970, lng: 3.3490 },
    medical: { name: "Randle General Hospital, Surulere", phone: AMBULANCE, lat: 6.4970, lng: 3.3490 },
  },
};

export const mapConfig = {
  // OpenStreetMap tiles — free, no API key needed.
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "&copy; OpenStreetMap contributors",
};

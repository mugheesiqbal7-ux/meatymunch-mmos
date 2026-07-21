// All content is ported verbatim from the MeatyMunch design handoff (Operations Manual Vol. 1 & 2).
// Manual/SOP content stays in German by design (original source documents).

// Base-aware asset URL so images resolve under the GitHub Pages sub-path too.
const asset = (p) => import.meta.env.BASE_URL + p;

export function getChecklists(lang, t) {
  return [
    {
      id: 'oeffnen', title: lang === 'de' ? 'Öffnungsablauf' : t.cl_oeffnen, accent: '#f07f13',
      desc: 'Vor dem ersten Gast: Stationen aufbauen und einsatzbereit machen.', items: [
        { id: 'a', text: 'Hände waschen & Schürze anlegen' },
        { id: 'b', text: 'Stationen aufbauen — jeder Platz identisch (Sauce, Gewürze, Zange, Handschuhe)' },
        { id: 'c', text: 'Salattheke auffüllen & Frische prüfen (2–7 °C)' },
        { id: 'd', text: 'Bain Marie einschalten, Currysoße einfüllen & aufwärmen' },
        { id: 'e', text: 'Fritteuse & Grill vorheizen' },
        { id: 'f', text: 'Kasse hochfahren & Bonrolle prüfen' },
        { id: 'g', text: 'Arbeitsflächen kontrollieren — sauber & frei' },
        { id: 'h', text: 'Bereit-Check: alles aufgefüllt, sauber, vorbereitet' },
      ],
    },
    {
      id: 'schliessen', title: 'Schließablauf', accent: '#7C3AED',
      desc: 'Nach Betriebsende: reinigen, sichern, sauber übergeben.', items: [
        { id: 'a', text: 'Grill, Fritteuse, Herd ausschalten & reinigen' },
        { id: 'b', text: 'Bain Marie leeren — keine Speisen über Nacht' },
        { id: 'c', text: 'Salattheke abwischen & abdecken' },
        { id: 'd', text: 'Reste korrekt lagern (FIFO) oder entsorgen' },
        { id: 'e', text: 'Müll rausbringen' },
        { id: 'f', text: 'Böden wischen' },
        { id: 'g', text: 'Kasse abrechnen & abschließen' },
        { id: 'h', text: 'Licht aus, abschließen, Übergabe dokumentieren' },
      ],
    },
    {
      id: 'salattheke', title: 'Reinigung Salattheke', accent: '#2e9e57',
      desc: 'Täglich jeden Abend — SOP 9.',
      weekly: 'Samstags: alle Behälter entnehmen, mit warmem Wasser & Spülmittel reinigen, abtrocknen, Theke innen & außen gründlich reinigen.', items: [
        { id: 'a', text: 'Salattheke mit sauberem Lappen gründlich abwischen' },
        { id: 'b', text: 'Alle Flächen frei von Rückständen' },
        { id: 'c', text: 'Verfallsdaten der Saucen & Marinaden prüfen' },
        { id: 'd', text: 'Kühlkette kontrollieren: 2–7 °C' },
        { id: 'e', text: 'Arbeitsbereich sauber & ordentlich hinterlassen' },
      ],
    },
    {
      id: 'bainmarie', title: 'Reinigung Bain Marie', accent: '#e8631a',
      desc: 'Currysoße-Behälter Di/Do/Sa — SOP 10.',
      weekly: 'Erster Mittwoch im Monat: gesamte Bain Marie gründlich reinigen und Wasser komplett wechseln.', items: [
        { id: 'a', text: 'Speisen umrühren & Temperatur prüfen' },
        { id: 'b', text: 'Currysoße-Behälter reinigen (Di / Do / Sa)' },
        { id: 'c', text: 'Behälter abdecken, wenn nicht in Gebrauch' },
        { id: 'd', text: 'Wasser frisch einfüllen' },
        { id: 'e', text: 'Sauberkeit & Temperatur dokumentieren' },
      ],
    },
    {
      id: 'station', title: 'Stations-Qualitätscheck', accent: '#b8912e',
      desc: 'Vor der Ausgabe — Qualität sichern.', items: [
        { id: 'a', text: 'Optik: Aufbau exakt nach Build Card' },
        { id: 'b', text: 'Temperatur: Patty durch, Soßen warm' },
        { id: 'c', text: 'Portionsgrößen korrekt (80 g Bun · 110 g Patty)' },
        { id: 'd', text: 'Verpackung vollständig' },
        { id: 'e', text: 'Arbeitsplatz sauber (3-Schritte-Regel)' },
        { id: 'f', text: 'Handschuhe & Handhygiene ok' },
      ],
    },
  ];
}

export const sops = [
  { id: 'salattheke', no: '9', title: 'Salattheke', img: asset('assets/sop-salattheke.jpeg'), summary: 'Inhalt, Frische & tägliche/wöchentliche Reinigung.', points: ['Inhalt: Gurken, Tomaten, Jalapeños, Eisbergsalat, Zwiebeln, Chicken- & Haupt-Marinade', 'Täglich abends: Theke abwischen, Flächen frei von Rückständen', 'Wöchentlich (Sa): alle Behälter entnehmen & gründlich reinigen', 'Kühlkette 2–7 °C einhalten'], important: 'Nur frische, einwandfreie Produkte verwenden. Verfallsdaten der Saucen & Marinaden regelmäßig kontrollieren.' },
  { id: 'bainmarie', no: '10', title: 'Bain Marie', img: asset('assets/sop-bainmarie.jpeg'), summary: 'Currysoße & Fertigspeisen konstant warm halten.', points: ['Vorderer Behälter: Currysoße, jederzeit warm halten', 'Zwei hintere Behälter: Fertigspeisen warmhalten', 'Reinigung Currysoße-Behälter: Di / Do / Sa', 'Gesamte Bain Marie: erster Mittwoch im Monat, Wasser wechseln'], important: 'Speisen regelmäßig umrühren & Temperatur prüfen. Keine Speisen über Nacht stehen lassen. Behälter abdecken, wenn nicht in Gebrauch.' },
  { id: 'kasse', no: '11', title: 'Kasse', img: asset('assets/sop-kasse.jpeg'), summary: 'Kassenvorgang, Sätze & Geldhandling.', points: ['Kunde kommt: nicht am Handy sein, immer aufstehen', 'Bestellung vollständig aufnehmen, Extras nachfragen, wiederholen', 'Bestellung kontrollieren & an Küche weitergeben', 'Kassenschublade geschlossen halten, nur autorisierte MA'], important: 'Immer freundlich & professionell. Keine Bestellung ohne Bezahlung herausgeben. Kasse nie unbeaufsichtigt offen lassen.' },
];

export const recipes = [
  {
    id: 'classic', name: 'Classic Smash', img: asset('assets/recipe-classicsmash.jpeg'), bun: 'Bun 80 g', patty: 'Patty 110 g', steps: [
      'Bun (Boden)', 'Ketchup', '3× Gurkenscheiben', 'Eisbergsalat', '110 g Smash Patty', 'Cheddar Käse (1 Scheibe)', 'Karamellisierte Zwiebeln', 'Tomate (1 Scheibe)', 'Mayo', 'Bun (Deckel)'],
  },
  {
    id: 'chilli', name: 'Chilli Milli', img: asset('assets/recipe-chillimilli.jpeg'), bun: 'Bun 80 g', patty: 'Patty 110 g', steps: [
      'Bun (Boden)', 'Ketchup', '3× Gurkenscheiben', 'Eisbergsalat', '110 g Smash Patty', 'Cheddar Käse (1 Scheibe)', 'Karamellisierte Zwiebeln', 'Tomate (1 Scheibe)', 'Jalapeños', 'Chili-Cheese-Soße', 'Bun (Deckel)'],
  },
];

export const chapters = [
  { no: '01', title: 'Erscheinungsbild & Auftreten', desc: 'Kleidung, Hygiene, Körpersprache, Handyregel', read: 'ca. 12 Min', status: 'done', lead: 'Der erste Eindruck entscheidet. Wie wir aussehen und auftreten, ist Teil des Produkts.', points: ['Saubere, vollständige Arbeitskleidung & Schürze', 'Persönliche Hygiene: Hände, Nägel, Haare', 'Freundliche, aufrechte Körpersprache', 'Handy nicht am Arbeitsplatz — nur in der Pause'] },
  { no: '02', title: 'Organisation, Rollen & Verantwortlichkeiten', desc: 'Organigramm, Rollen, Eskalationsweg', read: 'ca. 14 Min', status: 'done', lead: 'Jeder weiß, was seine Aufgabe ist — und wer worüber entscheidet.', points: ['Jede Aufgabe hat genau einen Verantwortlichen', 'Struktur: Inhaber → Schichtleiter → Team', 'Eskalation: selbst lösen → Schichtleiter → Geschäftsführung', 'Bei Gefahr: kein Stufenweg, sofort handeln & melden'] },
  { no: '03', title: 'Hygiene & Lebensmittelsicherheit', desc: 'Händehygiene, Temperaturen, FIFO, HACCP, Halal', read: 'ca. 16 Min', status: 'done', lead: 'Sauberkeit ist kein Zustand, sondern ständige Arbeit. Halal ohne Kompromisse.', points: ['Händehygiene: regelmäßig & nach jedem Wechsel', 'Kühlkette 2–7 °C, Bain Marie >63 °C', 'FIFO: First In, First Out', 'Halal-Trennung strikt einhalten'] },
  { no: '04', title: 'Öffnungs- & Schließablauf', desc: 'Tagesroutine, Stationen, Schichtübergabe', read: 'ca. 13 Min', status: 'done', lead: 'Der Tag beginnt und endet nach festem Ablauf — jede Schicht gleich.', points: ['Öffnen: Stationen aufbauen, auffüllen, vorheizen', 'Schließen: reinigen, sichern, dokumentieren', 'Saubere Schichtübergabe', 'Checklisten nutzen (siehe Tab Checklisten)'] },
  { no: '05', title: 'Kommunikation, Verhalten & Premium-Service', desc: 'Gastkontakt, Reklamationen, Servicehaltung', read: 'ca. 12 Min', status: 'plan', lead: 'Wir verkaufen ein Erlebnis. Der Ton macht die Marke.', points: ['Freundlich begrüßen & verabschieden', 'Reklamationen ruhig & lösungsorientiert', 'Nie vor dem Gast diskutieren', 'Premium-Haltung auch unter Stress'] },
  { no: '06', title: 'Stationen & Arbeitsabläufe', desc: 'Übersicht & Verweis auf SOP-Karten', read: 'ca. 10 Min', status: 'plan', lead: 'Jede Station hat klare Abläufe. Details auf den SOP-Karten.', points: ['Grill, Chicken, Fritteuse, Burger Build', 'Herd, Verpackung, Spülstation', 'Kurze Wege: ideal 3 Schritte', 'SOP-Karten im Tab Wissen'] },
  { no: '07', title: 'Qualitätskontrolle & Standards', desc: 'Prüfkriterien, Optik, Temperatur, Verpackung', read: 'ca. 11 Min', status: 'plan', lead: 'Qualität vor Geschwindigkeit — jedes Produkt wird geprüft.', points: ['Optik nach Build Card', 'Temperatur & Frische', 'Portionsgrößen einhalten', 'Verpackung vollständig & sauber'] },
  { no: '08', title: 'Bestellung, Lieferanten & Inventur', desc: 'MIN/MAX-System, Bestellkalender, Lager', read: 'ca. 12 Min', status: 'plan', lead: 'Nie zu viel, nie zu wenig. Das MIN/MAX-System steuert den Einkauf.', points: ['Bestand gegen MIN/MAX prüfen', 'Unter MIN → nachbestellen', 'FIFO im Lager', 'Inventur im Tab Betrieb'] },
  { no: '09', title: 'Arbeitszeiten, Pausen & Krankmeldung', desc: 'Schichten, Pausenregeln, Abwesenheit', read: 'ca. 9 Min', status: 'plan', lead: 'Einsatzbereit statt nur anwesend. Klare Regeln für Zeit & Abwesenheit.', points: ['Öffnungszeiten Mo–Sa 10:30–20:00', 'Schichtbeginn = einsatzbereit', 'Pausen nach Regelung', 'Krankmeldung rechtzeitig (Tab Betrieb)'] },
  { no: '10', title: 'Notfälle & Arbeitsschutz', desc: 'Erste Hilfe, Feuer, Unfall, Sicherheit', read: 'ca. 11 Min', status: 'plan', lead: 'Sicherheit geht vor. Im Notfall zählt schnelles, richtiges Handeln.', points: ['Erste-Hilfe-Kasten & Fluchtwege kennen', 'Feuerlöscher-Standort kennen', 'Unfälle sofort melden', 'Bei Gefahr: sofort handeln'] },
  { no: '11', title: 'Verhalten, Regeln & Konsequenzen', desc: 'Was nicht akzeptiert wird, 3-Stufen-Modell', read: 'ca. 10 Min', status: 'plan', lead: 'Klare Regeln schützen das Team und die Marke.', points: ['Respekt gegenüber allen', 'Kein Diebstahl, keine Unehrlichkeit', '3-Stufen-Modell bei Verstößen', 'Standard vor Gefühl'] },
  { no: '12', title: 'Schulung, Karriere & Abschluss', desc: 'Schulungsplan, Prüfung, Unterschrift', read: 'ca. 10 Min', status: 'plan', lead: 'Wer Standards lebt, wächst mit uns — vom Team zum Partner.', points: ['Strukturierte Einarbeitung', 'Prüfung & Empfangsbestätigung', 'Karriereweg: SL → RL → Franchise', 'Onboarding im Tab Betrieb'] },
];

export const inventory = [
  { name: 'Buns (80 g)', min: 120, max: 400, current: 90 },
  { name: 'Smash Patties (110 g)', min: 150, max: 500, current: 420 },
  { name: 'Cheddar Käse', min: 80, max: 250, current: 70 },
  { name: 'Gurken (Eimer)', min: 4, max: 12, current: 5 },
  { name: 'Tomaten (kg)', min: 6, max: 20, current: 15 },
  { name: 'Eisbergsalat (Kopf)', min: 8, max: 25, current: 8 },
  { name: 'Currysoße (L)', min: 5, max: 18, current: 12 },
  { name: 'Pommes TK (kg)', min: 20, max: 60, current: 18 },
];

export const shifts = [
  { day: 'Montag', date: '21.07.', slots: [{ name: 'Yusuf', time: '11:30–19:30' }, { name: 'Aylin', time: '16:30–20:30' }] },
  { day: 'Dienstag', date: '22.07.', slots: [{ name: 'Mohtasim', time: '10:30–18:00' }, { name: 'Yusuf', time: '16:30–20:30' }] },
  { day: 'Mittwoch', date: '23.07.', slots: [{ name: 'Aylin', time: '11:30–19:30' }] },
  { day: 'Donnerstag', date: '24.07.', slots: [{ name: 'Yusuf', time: '11:30–19:30' }, { name: 'Deniz', time: '16:30–20:30' }] },
  { day: 'Freitag', date: '25.07.', slots: [{ name: 'Mughees', time: '10:30–20:00' }, { name: 'Yusuf', time: '11:30–19:30' }] },
  { day: 'Samstag', date: '26.07.', slots: [{ name: 'Alle', time: 'ganztägig' }] },
];

export const modules = [
  { id: 'm1', title: 'Werte, Mission & DNA verstanden', day: 'Tag 1' },
  { id: 'm2', title: 'Erscheinungsbild & Hygiene', day: 'Tag 1' },
  { id: 'm3', title: 'Kasse & Gastkontakt (SOP 11)', day: 'Tag 2' },
  { id: 'm4', title: 'Salattheke & Bain Marie (SOP 9/10)', day: 'Tag 3' },
  { id: 'm5', title: 'Build Cards: Classic Smash & Chilli Milli', day: 'Tag 4' },
  { id: 'm6', title: 'Öffnungs- & Schließablauf selbstständig', day: 'Tag 5' },
];

export const kpis = [
  { label: 'Umsatz heute', value: '2.840 €', delta: '+12% vs. Vortag' },
  { label: 'Bestellungen', value: '187', delta: '+8%' },
  { label: 'Ø Bon', value: '15,20 €', delta: '+3%' },
  { label: 'Qualität', value: '96%', delta: 'Standard erfüllt' },
];

export const standorteRaw = [
  { name: 'Container · Idar-Oberstein', status: 'aktiv', on: true },
  { name: 'Restaurant · geplant', status: 'in Planung', on: false },
  { name: 'Filiale 3 · Vision', status: 'Ziel 100+', on: false },
];

export const team = [
  { name: 'Mughees Iqbal', role: 'Inhaber', initial: 'M', color: '#f07f13' },
  { name: 'Mohtasim Iqbal', role: 'Inhaber', initial: 'M', color: '#f5a11f' },
  { name: 'Aylin', role: 'Schichtleiter', initial: 'A', color: '#a879f5' },
  { name: 'Yusuf', role: 'Mitarbeiter', initial: 'Y', color: '#7fd39b' },
  { name: 'Deniz', role: 'Aushilfe', initial: 'D', color: '#d8b45c' },
];

export const baseMeld = [
  { text: 'Pommes-TK unter MIN — nachbestellen', meta: 'vor 20 Min · Inventur', sev: 'warn' },
  { text: 'Bain Marie Currysoße fast leer', meta: 'vor 40 Min · Küche', sev: 'warn' },
  { text: 'Eisbergsalat Bestand niedrig', meta: 'heute 11:05 · Inventur', sev: 'info' },
];

export const roleColors = { ma: '#f07f13', sl: '#a879f5', mgmt: '#d8b45c' };
export const userNames = { ma: 'Yusuf', sl: 'Aylin', mgmt: 'Mughees' };

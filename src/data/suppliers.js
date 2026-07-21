// Lieferanten & Bestellkalender — Inhalt aus Operations Manual Band 1, Kapitel 08.
// Reine Referenzdaten (ändern sich selten). Aktionstypen steuern die Hervorhebung.

export const suppliers = [
  {
    id: 'aldi', name: 'ALDI', color: '#2b7fb8',
    rhythm: 'Täglich · Frische', order: 'Selbst-Einkauf (kein Vorlauf)',
    products: ['Brötchen', 'Salat', 'Tomaten', 'Gurken / Pickles', 'Käse', 'Küchenrolle', 'Zitronen-Extrakt'],
  },
  {
    id: 'winters', name: 'Firma Winters', color: '#f07f13',
    rhythm: 'Lieferung Mo · Mi · Do · Fr', order: 'Am Vorabend der Lieferung bestellen',
    products: ['Pommes', 'Ketchup', 'Servietten', 'Currypulver', 'Pommes-Salz', 'Folie', 'Knoblauchsoße',
      'Getränke: Cola, Mezzo Mix, Fuze Tea ×2, Fanta Exotic, Fanta, Sprite, Vio still & spritzig'],
  },
  {
    id: 'cc', name: 'Firma C&C', color: '#7C3AED',
    rhythm: 'Wöchentlich', order: 'Di Abend bestellen · Anruf Mi vor 12:00',
    products: ['Mozzarella-Sticks', 'Chili-Cheese-Soße', 'Sweet-&-Sour-Soße', 'Mayo', 'Frittieröl', 'Jalapeños',
      'Verpackung / Einweg', 'Süßkartoffel-Pommes', 'Röstzwiebeln', 'Pfeffer', 'Paprika'],
  },
  {
    id: 'km', name: 'KM Frischdienst', color: '#2e9e57',
    rhythm: 'Alle 1–2 Wochen · nach Bedarf', order: 'Selbstabholung · Abholtermin einplanen',
    products: ['Hähnchenbrust (~30 kg)', 'Hackfleisch (60–80 kg)', 'Würste', 'Zwiebeln', 'Eier'],
  },
];

// Bestellkalender Mo–Sa. type: 'order' = Aktion nötig (bestellen/anrufen),
// 'delivery' = Lieferung kommt, 'buy' = täglicher Fricheeinkauf.
export const orderCalendar = [
  { day: 'Montag', short: 'Mo', dow: 1, tasks: [
    { supplierId: 'aldi', text: 'Frische einkaufen', type: 'buy' },
    { supplierId: 'winters', text: 'Lieferung kommt', type: 'delivery' },
  ]},
  { day: 'Dienstag', short: 'Di', dow: 2, tasks: [
    { supplierId: 'aldi', text: 'Frische einkaufen', type: 'buy' },
    { supplierId: 'winters', text: 'Bestellen für Mittwoch', type: 'order' },
    { supplierId: 'cc', text: 'Bestellen (Vorabend)', type: 'order' },
  ]},
  { day: 'Mittwoch', short: 'Mi', dow: 3, tasks: [
    { supplierId: 'aldi', text: 'Frische einkaufen', type: 'buy' },
    { supplierId: 'winters', text: 'Lieferung kommt', type: 'delivery' },
    { supplierId: 'winters', text: 'Bestellen für Donnerstag', type: 'order' },
    { supplierId: 'cc', text: 'Anrufen vor 12:00 Uhr', type: 'order' },
  ]},
  { day: 'Donnerstag', short: 'Do', dow: 4, tasks: [
    { supplierId: 'aldi', text: 'Frische einkaufen', type: 'buy' },
    { supplierId: 'winters', text: 'Lieferung kommt', type: 'delivery' },
    { supplierId: 'winters', text: 'Bestellen für Freitag', type: 'order' },
  ]},
  { day: 'Freitag', short: 'Fr', dow: 5, tasks: [
    { supplierId: 'aldi', text: 'Frische einkaufen', type: 'buy' },
    { supplierId: 'winters', text: 'Lieferung kommt', type: 'delivery' },
  ]},
  { day: 'Samstag', short: 'Sa', dow: 6, tasks: [
    { supplierId: 'aldi', text: 'Frische einkaufen', type: 'buy' },
  ]},
];

export const supplierById = Object.fromEntries(suppliers.map((s) => [s.id, s]));

// Offene Punkte aus dem Handbuch (noch festzulegen):
export const openPoints = [
  'Winters-Lieferung am Montag: Vorabend ist Sonntag (geschlossen) — Bestellzeitpunkt festlegen.',
  'KM Frischdienst: alle 1–2 Wochen nach MIN-Bestand, Abholtermin fix einplanen.',
];

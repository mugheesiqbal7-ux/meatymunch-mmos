// SOP-Karten — Inhalt aus den MeatyMunch SOP-Blättern (1–11).
// Struktur: sections[{ heading, blocks[] }]; Blocktypen: p, ul, steps, box, table.
// SOP 1–8 aus den Poster-Blättern (Text); Bilder folgen als Dateien.
// SOP 9–11 mit vorhandenen Poster-Bildern in public/assets.

const asset = (p) => import.meta.env.BASE_URL + p;

export const sops = [
  {
    id: 'oeffnung', no: '1', title: 'Öffnung — Checkliste', accent: '#f07f13',
    summary: 'Täglicher Ablauf 09:00–11:00 Uhr.',
    sections: [
      { heading: '09:00–09:30 · ALDI-Einkauf', blocks: [
        { t: 'ul', items: ['Einkaufsliste mitnehmen', 'Frische Ware kaufen'] },
      ]},
      { heading: '09:30–09:40 · Hochfahren', blocks: [
        { t: 'ul', items: ['Licht einschalten', 'Wasser aufdrehen', 'Smashburger-Grill an', 'Fritteuse an', 'Currysoße auffüllen (jeden 2. Tag)', 'Currysoße rauslegen (jeden Tag)', 'Selbstbedienungsterminal an', 'Würstchen auflegen'] },
      ]},
      { heading: '09:40–10:00 · Salate & Toppings vorbereiten', blocks: [
        { t: 'ul', items: ['Icebergsalat schneiden', 'Tomaten schneiden', 'Gurken schneiden', 'Zwiebeln schneiden', 'Jalapeños schneiden', 'Käse auffüllen'] },
      ]},
      { heading: '10:00–10:20 · Panierung vorbereiten', blocks: [
        { t: 'ul', items: ['Hähnchenmarinade vorbereiten', 'Dipmarinade vorbereiten', 'Paniermehl / Panade vorbereiten', 'Wechsel: jeden 2. Tag', 'Rezepte im Rezeptbuch beachten'] },
      ]},
      { heading: '10:20–10:30 · Fleischbällchen vorbereiten', blocks: [
        { t: 'ul', items: ['Fleischbällchen formen (105–110 g pro Stück)', 'Neue nach hinten', 'Alte nach vorne (FIFO)'] },
      ]},
      { heading: '10:30 · Container öffnen', blocks: [
        { t: 'ul', items: ['Klappe nach oben öffnen', 'Außentische reinigen', 'Alles aufstellen', 'Container ist jetzt geöffnet!'] },
      ]},
      { heading: '10:40–11:00 · Letzte Vorbereitungen', blocks: [
        { t: 'ul', items: ['Brötchen schneiden', 'Servietten, Gabeln, Papier & Verpackungen bereitlegen', 'Getränke auffüllen & kühlen', 'Alles Mögliche prüfen & bereitstellen'] },
      ]},
      { heading: '10:00–11:00 · Lieferungen', blocks: [
        { t: 'ul', items: ['Lieferungen können jederzeit kommen', 'Ware annehmen & prüfen', 'Kühlware sofort einräumen', 'Rechnung kontrollieren & ablegen'] },
      ]},
      { heading: 'Temperaturen (Richtwerte)', blocks: [
        { t: 'table', rows: [['Kühlschrank', '≤ 7 °C'], ['Fleisch', '≤ 4 °C'], ['Tiefkühler', '≤ -18 °C']] },
        { t: 'box', label: 'Wichtiger Hinweis', text: 'Temperaturen morgens beim Hochfahren und abends beim Schließen messen und in die Temperaturliste eintragen.' },
      ]},
    ],
  },
  {
    id: 'schliessung', no: '2', title: 'Schließung — Checkliste', accent: '#7C3AED',
    summary: 'Täglicher Ablauf 19:50–20:30 Uhr.',
    sections: [
      { heading: '19:30–19:50 · Vorbereiten (täglich)', blocks: [
        { t: 'ul', items: ['Saucen kontrollieren & auffüllen', 'Fleisch rauslegen: Hackfleisch für Patties (gefroren) zum Auftauen nachts rauslegen, damit es morgen aufgetaut ist', 'Hähnchenbrust nachschneiden und in den Behälter mit Marinade legen, damit sie bis morgen saftig ist'] },
      ]},
      { heading: '19:50–20:30 · Reinigung (allgemein)', blocks: [
        { t: 'steps', items: [
          { n: 1, title: 'Würstchen-Grill reinigen', text: 'Grillplatte reinigen · lose Rückstände entfernen' },
          { n: 2, title: 'Würstmaschine reinigen', text: 'Maschine ausschalten · zerlegen · reinigen · zusammensetzen' },
          { n: 3, title: 'Arbeitsfläche reinigen', text: 'Arbeitsfläche reinigen · Spachteln reinigen · Fritteuse Öl abwischen' },
          { n: 4, title: 'Salattheke sauber machen', text: 'Lappen abwischen · Arbeitsfläche reinigen · Behälter ordentlich zurückstellen' },
          { n: 5, title: 'Smashburger-Grill reinigen', text: 'Grillplatte reinigen · Fett entfernen · Arbeitsfläche sauber machen' },
          { n: 6, title: 'Boden reinigen', text: 'Boden kehren · wischen · trocknen lassen' },
          { n: 7, title: 'Kasse machen', text: 'Kasse zählen & Abrechnung durchführen · Kasse aufräumen · Unterlagen & Belege ordnen' },
        ]},
        { t: 'box', label: 'Spezialreinigung (an bestimmten Tagen)', text: 'Salattheke komplett reinigen: immer Samstag. Ölwechsel: Pommesöl immer Dienstag · Chickenöl immer Dienstag und Freitag.' },
      ]},
      { heading: '20:30 · Schließung', blocks: [
        { t: 'ul', items: ['Klappen schließen (vorne & Seitenklappe)', 'Wasser komplett aus', 'Kühlschränke prüfen: Licht aus, alles verstaut, nichts draußen', 'Fritteusen aus', 'Grills aus', 'Lichter alle aus', 'Container abschließen'] },
      ]},
      { heading: 'Wichtig', blocks: [
        { t: 'ul', items: ['Sauberkeit steht an erster Stelle', 'Alles für den nächsten Tag vorbereiten', 'Nichts offen oder ungesichert lassen', 'Bei Problemen den Vorgesetzten informieren'] },
      ]},
    ],
  },
  {
    id: 'spezialreinigung', no: '3', title: 'Spezialreinigung', accent: '#2e9e57',
    summary: 'Feste Sonderaufgaben nach Wochentagen.',
    sections: [
      { heading: 'Montag · Glas, Spiegel & Schränke', blocks: [
        { t: 'ul', items: ['Spiegel reinigen', 'Kassensystem reinigen', 'Selbstbedienungseinheiten reinigen', 'Schränke außen reinigen', 'Schränke oben reinigen', 'Staub entfernen'] },
      ]},
      { heading: 'Dienstag · Ölwechsel & Currysoße', blocks: [
        { t: 'ul', items: ['Pommesöl wechseln', 'Fritteuse reinigen', 'Chickenöl wechseln', 'Chicken-Fritteuse reinigen', 'Currysoße-Behälter reinigen'] },
      ]},
      { heading: 'Donnerstag · Currysoße', blocks: [
        { t: 'ul', items: ['Behälter leeren', 'Behälter reinigen', 'Behälter trocknen'] },
      ]},
      { heading: 'Freitag · Chickenöl', blocks: [
        { t: 'ul', items: ['Chickenöl wechseln', 'Fritteuse reinigen', 'Umgebung reinigen'] },
      ]},
      { heading: 'Samstag · Salattheke & Currysoße', blocks: [
        { t: 'ul', items: ['Eisbergsalat, Tomaten & Zwiebeln entsorgen', 'GN-Behälter ausbauen', 'GN-Behälter spülen', 'Salattheke komplett reinigen', 'Behälter wieder einsetzen', 'Currysoße-Behälter reinigen'] },
      ]},
      { heading: 'Alle 2 Wochen · Außenbereich & Tische (jeder 2. Montag, ungerade Woche)', blocks: [
        { t: 'ul', items: ['Außenbereich komplett kehren', 'Tische und Sitzflächen gründlich reinigen', 'Müllbereich kontrollieren'] },
      ]},
      { heading: 'Monatlich · erster Mittwoch des Monats', blocks: [
        { t: 'ul', items: ['Abzugshaube reinigen', 'Fettfilter reinigen', 'Bain-Marie reinigen', 'Außenflächen reinigen'] },
      ]},
      { heading: 'Quartalsreinigung · erster Montag im Quartal (Jan/Apr/Jul/Okt)', blocks: [
        { t: 'ul', items: ['Wände reinigen', 'Lampen reinigen', 'Schränke reinigen', 'Hinter Geräte reinigen', 'Alle Ecken reinigen', 'Grundreinigung Container'] },
      ]},
      { heading: 'Kühlschrank-Grundreinigung · erster Montag im Januar & Juli', blocks: [
        { t: 'ul', items: ['Kühlschrank ausräumen', 'Eis entfernen', 'Dichtungen reinigen', 'Innenraum desinfizieren', 'Lüftung reinigen'] },
      ]},
      { heading: 'Wichtig', blocks: [
        { t: 'ul', items: ['Spezialreinigungen dürfen nicht übersprungen werden', 'Nach jeder Spezialreinigung abhaken', 'Bei Problemen Schichtleitung informieren', 'Fotos vor und nach der Reinigung machen'] },
      ]},
    ],
  },
  {
    id: 'burger', no: '4', title: 'Burger Station — Smashburger', accent: '#e8631a',
    summary: 'Zubereitung & Grillplatten-Reinigung. Grill 250 °C.',
    sections: [
      { heading: 'Zubereitung (Grill 250 °C)', blocks: [
        { t: 'steps', items: [
          { n: 1, title: 'Zwiebel karamellisieren', text: 'Zwiebeln in Scheiben schneiden, mit Öl auf den Grill geben und karamellisieren.' },
          { n: 2, title: 'Brötchen auflegen & anrösten', text: 'Brötchen mit der Schnittfläche nach unten auf den Grill legen und von oben und unten anrösten.' },
          { n: 3, title: 'Patty auflegen', text: 'Fleischball auf den heißen Grill legen.' },
          { n: 4, title: 'Patty smashen', text: 'Mit dem Smasher das Patty kräftig flach drücken.' },
          { n: 5, title: 'Würzen', text: 'Patty mit Salz & Pfeffer würzen.' },
          { n: 6, title: 'Nach 1 Minute: wenden', text: 'Nach ca. 1 Minute das Patty wenden.' },
          { n: 7, title: 'Wieder würzen & Käse drauf', text: 'Nach dem Wenden erneut würzen und Käse auf das Patty legen.' },
          { n: 8, title: 'Zwiebeln drauf & viel Belag', text: 'Die karamellisierten Zwiebeln auf den Käse geben und nach Wunsch mit viel frischem Belag belegen.' },
          { n: 9, title: 'Fertig!', text: 'Oberen Bun draufsetzen und genießen!' },
        ]},
      ]},
      { heading: 'Smash-Platte reinigen (Grill 250 °C)', blocks: [
        { t: 'steps', items: [
          { n: 1, title: 'Wasser auftragen', text: 'Grillplatte vollständig mit Wasser ablöschen.' },
          { n: 2, title: 'Kruste entfernen', text: 'Mit dem Spachtel die gesamte angebrannte Kruste entfernen.' },
          { n: 3, title: 'Fettlöser auftragen', text: 'Fettlöser gleichmäßig auftragen.' },
          { n: 4, title: 'Einwirken lassen', text: 'Fettlöser einige Minuten einwirken lassen (2–5 Min).' },
          { n: 5, title: 'Wasser & schrubben', text: 'Wasser auftragen und mit Schaber oder Metallbürste kräftig schrubben.' },
          { n: 6, title: 'Schmutzwasser entsorgen', text: 'Schmutziges Wasser in den Ausguss ablassen und entsorgen.' },
          { n: 7, title: 'Trocknen', text: 'Mit Tuch gründlich trocknen und sauber wischen.' },
          { n: 8, title: 'Öl auftragen', text: 'Etwas Öl aufsprühen oder auftragen und mit Tuch verteilen. Platte leicht einölen für den nächsten Tag.' },
        ]},
        { t: 'box', label: 'Merke', text: 'Sauberer Grill = besserer Geschmack. Saubere Platte = besserer Smash.' },
      ]},
    ],
  },
  {
    id: 'friteuse', no: '5', title: 'Friteusen Station', accent: '#b8912e',
    summary: 'Öl STAND 130 °C · BETRIEB 170 °C.',
    sections: [
      { heading: 'Linke Friteuse — Pommes', blocks: [
        { t: 'p', text: 'Hauptsächlich: Pommes. Im Notfall auch: Mozzarella-Sticks, Süßkartoffeln.' },
        { t: 'box', label: 'Reinigung', text: 'Jeden Dienstag.' },
      ]},
      { heading: 'Rechte Friteuse — Allrounder', blocks: [
        { t: 'p', text: 'Für: Chicken-Burger, Nuggets, Mozzarella-Sticks, Süßkartoffeln.' },
        { t: 'box', label: 'Reinigung', text: 'Jeden Dienstag & Freitag.' },
      ]},
      { heading: 'Öl-Temperatur', blocks: [
        { t: 'table', rows: [['STAND (immer)', '130 °C'], ['BETRIEB (Bestellung)', '170 °C']] },
        { t: 'box', label: 'Wichtig', text: 'Immer STAND 130 °C — nur bei Bestellungen auf 170 °C hochdrehen!' },
      ]},
      { heading: 'Reinigung der Friteuse — Schritt für Schritt', blocks: [
        { t: 'steps', items: [
          { n: 1, title: 'Ausschalten & Stecker ziehen', text: '' },
          { n: 2, title: 'Korb & Deckel entfernen', text: '' },
          { n: 3, title: 'Friteuse ausleeren (Öl ablassen)', text: '' },
          { n: 4, title: 'Innen reinigen', text: '' },
          { n: 5, title: 'Trocknen & zusammenbauen', text: '' },
        ]},
      ]},
    ],
  },
  {
    id: 'wurstgrill', no: '6', title: 'Wurstgrill Station', accent: '#2b7fb8',
    summary: 'Zubereitung, Temperaturen & Reinigung.',
    sections: [
      { heading: 'Zubereitung', blocks: [
        { t: 'ul', items: ['Stoßzeiten: immer mindestens 6 Würstchen auf dem Grill', 'Abends: immer mindestens 2–3 Würstchen auf dem Grill'] },
        { t: 'box', label: 'Temperatur', text: 'Wenn die Würstchen gekocht werden müssen: 130–150 °C. Wenn die Würstchen gekocht sind: immer 2 Würstchen auf der Pfanne bei 100 °C warmhalten.' },
      ]},
      { heading: 'Reinigung Wurstgrill', blocks: [
        { t: 'steps', items: [
          { n: 1, title: 'Wasser drauf', text: 'Grill mit Wasser bedecken.' },
          { n: 2, title: 'Abreiben mit Spachtel', text: 'Rückstände mit Spachtel gründlich entfernen.' },
          { n: 3, title: 'Wieder Wasser drauf', text: 'Nochmals mit Wasser nachspülen.' },
          { n: 4, title: 'Wasser leeren', text: 'Wasser ablassen und Grill trocken wischen.' },
        ]},
      ]},
      { heading: 'Currymaschine & Arbeitsfläche', blocks: [
        { t: 'ul', items: ['Currymaschine: täglich sauber machen', 'Tisch / Arbeitsfläche: nach jeder Nutzung reinigen'] },
      ]},
      { heading: 'Wichtig', blocks: [
        { t: 'ul', items: ['Station immer ordentlich und sauber halten', 'Qualität und Sauberkeit stehen an erster Stelle', 'Bei Fragen den Schichtleiter informieren'] },
      ]},
    ],
  },
  {
    id: 'getraenke', no: '7', title: 'Getränke-Kühlschrank', accent: '#c0392b',
    summary: 'Auffüllen & sauber halten.',
    sections: [
      { heading: 'Anweisung', blocks: [
        { t: 'ul', items: ['Immer morgens komplett auffüllen', 'Immer sauber halten'] },
      ]},
      { heading: 'Wichtig', blocks: [
        { t: 'ul', items: ['Alle Getränke nach vorne ausrichten', 'Mindestbestand immer sicherstellen', 'Regale, Glas und Tür sauber halten', 'Verfallsdatum regelmäßig prüfen'] },
      ]},
    ],
  },
  {
    id: 'lagerung', no: '8', title: 'Lagerung', accent: '#8a6a15',
    summary: 'Wo und bei welcher Temperatur was gelagert wird.',
    sections: [
      { heading: 'Lagerung nach Produkt', blocks: [
        { t: 'table', rows: [
          ['Produkt', 'Lagerung', 'Temperatur'],
          ['Pommes', 'Tiefgekühlt, Originalverpackung geschlossen halten', '-18 °C (Tiefkühler)'],
          ['Ketchup', 'Kühl & trocken; nach Öffnen im Kühlschrank, Deckel gut schließen', '2–7 °C'],
          ['Currysoße', 'Kühl & trocken; nach Öffnen im Kühlschrank, vor Gebrauch schütteln', '2–7 °C'],
          ['Mayo', 'Nach Öffnen im Kühlschrank, Deckel schließen, nicht einfrieren', '2–7 °C'],
          ['Sesam-Brötchen', 'Trocken bei Raumtemperatur, vor Sonne schützen, bei Bedarf frisch nachlegen', '15–25 °C'],
          ['Salat (Eisberg etc.)', 'Im Kühlschrank, Frischhaltebox/verschlossene Tüte, täglich Frische prüfen', '2–7 °C'],
          ['Tomaten', 'Im Kühlschrank, Frischhaltebox, täglich Frische prüfen', '2–7 °C'],
          ['Etc. (Zwiebeln, Gurken, Käse, Saucen)', 'Je nach Produkt Kühlschrank/Raumtemp., Originalverpackung, Ablaufdatum prüfen', 'regelmäßig kontrollieren'],
        ]},
      ]},
      { heading: 'Wichtig', blocks: [
        { t: 'ul', items: ['FIFO-Prinzip beachten (First In – First Out)', 'Lebensmittel stets abdecken oder verpackt lagern', 'Temperatur regelmäßig kontrollieren', 'Sauberkeit im Kühlschrank/Lager stets gewährleisten'] },
      ]},
    ],
  },
  {
    id: 'salattheke', no: '9', title: 'Salattheke', accent: '#2e9e57', img: asset('assets/sop-salattheke.jpeg'),
    summary: 'Inhalt, Frische & tägliche/wöchentliche Reinigung.',
    sections: [
      { heading: 'Kernpunkte', blocks: [
        { t: 'ul', items: ['Inhalt: Gurken, Tomaten, Jalapeños, Eisbergsalat, Zwiebeln, Chicken- & Haupt-Marinade', 'Täglich abends: Theke abwischen, Flächen frei von Rückständen', 'Wöchentlich (Sa): alle Behälter entnehmen & gründlich reinigen', 'Kühlkette 2–7 °C einhalten'] },
        { t: 'box', label: 'Wichtig', text: 'Nur frische, einwandfreie Produkte verwenden. Verfallsdaten der Saucen & Marinaden regelmäßig kontrollieren.' },
      ]},
    ],
  },
  {
    id: 'bainmarie', no: '10', title: 'Bain Marie', accent: '#e8631a', img: asset('assets/sop-bainmarie.jpeg'),
    summary: 'Currysoße & Fertigspeisen konstant warm halten.',
    sections: [
      { heading: 'Kernpunkte', blocks: [
        { t: 'ul', items: ['Vorderer Behälter: Currysoße, jederzeit warm halten', 'Zwei hintere Behälter: Fertigspeisen warmhalten', 'Reinigung Currysoße-Behälter: Di / Do / Sa', 'Gesamte Bain Marie: erster Mittwoch im Monat, Wasser wechseln'] },
        { t: 'box', label: 'Wichtig', text: 'Speisen regelmäßig umrühren & Temperatur prüfen. Keine Speisen über Nacht stehen lassen. Behälter abdecken, wenn nicht in Gebrauch.' },
      ]},
    ],
  },
  {
    id: 'kasse', no: '11', title: 'Kasse', accent: '#f07f13', img: asset('assets/sop-kasse.jpeg'),
    summary: 'Kassenvorgang, Sätze & Geldhandling.',
    sections: [
      { heading: 'Kernpunkte', blocks: [
        { t: 'ul', items: ['Kunde kommt: nicht am Handy sein, immer aufstehen', 'Bestellung vollständig aufnehmen, Extras nachfragen, wiederholen', 'Bestellung kontrollieren & an Küche weitergeben', 'Kassenschublade geschlossen halten, nur autorisierte MA'] },
        { t: 'box', label: 'Wichtig', text: 'Immer freundlich & professionell. Keine Bestellung ohne Bezahlung herausgeben. Kasse nie unbeaufsichtigt offen lassen.' },
      ]},
    ],
  },
];

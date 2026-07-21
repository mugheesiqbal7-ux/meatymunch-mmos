# Handoff: MeatyMunch MMOS — Mitarbeiter-App

## Overview
Eine responsive App für die Burger-Kette **MeatyMunch** (Premium Halal Fast Casual). Sie unterstützt drei Rollen — **Mitarbeiter**, **Schichtleiter** und **Management/Geschäftsführung** — und soll Mitarbeitern helfen, effizienter und selbstständiger zu arbeiten: Checklisten abhaken, SOPs & Rezepte nachschlagen, das Handbuch durchsuchen, Betriebsaufgaben erledigen (Schichtplan, Krankmeldung, Inventur, Temperatur-Doku, Meldungen, Onboarding) und – für Management – ein Kennzahlen-Dashboard.

Sprache der Oberfläche: **DE / EN / TR / AR** (AR mit RTL-Layout). Handbuch-/SOP-Inhalte bleiben Deutsch (Originaldokumente).

## About the Design Files
Die Datei in diesem Paket (`MeatyMunch App.dc.html`) ist eine **Design-Referenz, erstellt als HTML-Prototyp** — sie zeigt Aussehen, Struktur und Verhalten. Sie ist **kein produktionsfertiger Code zum 1:1-Übernehmen**.

Aufgabe: Diese Designs in der Zielumgebung des Codebases **nachbauen** (React, React Native, Vue, SwiftUI, Flutter o.ä.), mit dessen etablierten Mustern, State-Management und Komponenten-Bibliotheken. Falls noch keine Umgebung existiert: das für das Projekt passendste Framework wählen (Empfehlung für eine mobile-first, offline-taugliche Restaurant-App: **React + Vite als PWA** oder **React Native/Expo**) und die Designs dort umsetzen.

Der Prototyp ist ein „Design Component" (DC): Das HTML enthält ein `<x-dc>`-Template plus eine `class Component extends DCLogic`-Logikklasse. **Ignoriere den DC-Wrapper** — relevant sind Markup-Struktur, Inline-Styles (siehe Design Tokens) und die Logik/Daten in der Klasse (State, Daten-Arrays, Handler). Alle Styles sind Inline; es gibt keine externe CSS-Datei.

> Hinweis: Diesem Projekt ist ein „Modernist"-Design-System zugewiesen. Der Prototyp folgt jedoch **bewusst der MeatyMunch-Markenidentität** (dunkle Flächen, Orange/Lila, Archivo), da der Kunde explizit Logo und Markenfarben vorgegeben hat. In der Umsetzung gilt die MeatyMunch-Marke, nicht das rote Modernist-Theme.

## Fidelity
**High-fidelity (hifi).** Finale Farben, Typografie, Abstände und Interaktionen. Pixelgenau mit den Bibliotheken/Patterns des Ziel-Codebases nachbauen. Radien, Schatten und Zustände wie dokumentiert übernehmen.

---

## Design Tokens

### Farben
| Token | Hex | Verwendung |
|---|---|---|
| ink (dunkel) | `#17130f` | Topbar, dunkle Panels, Text auf hell |
| ink-2 | `#1e1813` | Sidebar-Hintergrund |
| ink-3 | `#221c17` | Gradient-Panels |
| paper (App-BG) | `#f4f1ec` | Arbeitsfläche/Content-Hintergrund |
| paper-2 | `#faf7f2` | Hover-Zeilen, Input-Felder |
| white | `#ffffff` | Karten |
| **orange (Primär)** | `#f07f13` | Primäraktion, aktive Nav, Akzent (Hover `#ff8f26`) |
| orange-hell | `#f5a11f` | Kicker/Highlights auf Dunkel |
| ember (warm) | `#e8631a` | Warnung/Akzent Bain Marie |
| **lila (Sekundär)** | `#7C3AED` | Sekundärakzent (Schichtleiter, Rezepte); Rezept-Header `#2a1c47` |
| gold | `#b8912e` | Kicker/Labels, Tertiärakzent |
| grün (ok) | `#2e9e57` | Erledigt/Häkchen; BG `#e8f5ec`, Text `#1c6d3c` |
| text | `#2a2620` | Fließtext |
| muted | `#7c756c` | Sekundärtext |
| muted-2 | `#a49c90` | Meta/Timestamps |
| line | `#e4ded4` | Rahmen/Trennlinien; dunkel: `rgba(255,255,255,.08)` |
| warn-bg / warn-text | `#fbe9d6` / `#b1470f` | „Wichtig"-Boxen, kritischer Bestand |
| gold-bg / gold-text | `#f7f0e2` / `#8a6a15` | „Wöchentlich"/gesperrt |

Rollen-Akzent: Mitarbeiter `#f07f13`, Schichtleiter `#7C3AED`/`#a879f5`, Management `#b8912e`/`#d8b45c`.

### Typografie
- **Archivo** (700–900): Überschriften, Zahlen, Logo. Google Fonts.
- **Inter** (400–700): Fließtext, Buttons, UI.
- **IBM Plex Mono** (500–600): Kicker, Labels, Meta (uppercase, letter-spacing .10–.24em).
- Skala (px): H1 clamp(24–42), Karten-Titel 18–21, Body 14–17, Labels 10–12, Nav 14.5 (Sidebar) / 10 (Bottom).

### Spacing / Radius / Shadow
- Radius: Buttons/Inputs 8–11px, Karten 14–18px, Pills/Chips 20–30px, Avatare/Icons 50% bzw. 8–12px. (Marke ist bewusst **abgerundet** — Gegensatz zum Modernist-System.)
- Content-Padding: Desktop `28px 34px 40px` (max-width 1160px, zentriert), Mobile `18px 16px 30px`.
- Schatten: Karten-Hover `0 8px 22px rgba(0,0,0,.06)`, Bilder `0 8px 24px rgba(0,0,0,.08)`, Toast `0 12px 34px rgba(0,0,0,.4)`.
- Fortschrittsbalken: Höhe 7–9px, Radius 5–6px, `transition:.4s`.

---

## Screens / Views

Navigation: 5 Hauptbereiche. **Desktop (≥900px):** linke Sidebar (236px, dunkel) + dunkle Topbar (60px). **Mobile (<900px):** dunkle Topbar + Bottom-Tab-Bar (5 Icons). Layout-Umschaltung erfolgt per JS über `window.innerWidth` (resize-Listener), da kein CSS-Media-Query genutzt wird — im Zielframework durch CSS-Breakpoints/Container-Queries ersetzen.

### 0. Login / Rollenauswahl
- Vollbild, dunkler Radial-Gradient (`radial-gradient(120% 90% at 78% 0%,#2a211a,#17130f 60%)`), zentriert.
- Logo (`assets/logo-icon.jpeg`, 110px, radius 24px, pop-Animation), Wortmarke „MEATY**MUNCH**" (Archivo 900), Tagline „Smash. Sizzle. Strasse." (Mono, gold).
- Sprachumschalter oben rechts (DE/EN/TR/AR).
- 3 Rollenkarten (Mitarbeiter/Schichtleiter/Management), je mit Nummer, Titel, Beschreibung, farbigem Top-Border (orange/lila/gold). Klick → eingeloggt in die jeweilige Rolle.

### 1. Start (Home) — rollenabhängig, 3 Layout-Varianten
Umschaltbar oben rechts: **Fokus / Karten / Dashboard**.
- **Fokus:** Großes dunkles Panel mit **Fortschritts-Ring (SVG, r=52, Umfang 326.7)** für den Öffnungs-Checklisten-Fortschritt + „Weiter"-CTA; Schnellzugriff-Grid (6 Aktionen mit farbigen Icon-Kacheln); „Meine Schicht" + Abzeichen.
- **Karten:** CSS-`columns` Masonry-Feed mit 5 Karten (Priorität, Schicht, Build Card, SOP, Onboarding), je mit Kicker/Titel/Body/CTA und farbigem Top-Border.
- **Dashboard:** Stat-Kacheln (Heute %, Serie, Level, Onboarding) + Checklisten-Status-Balken + offene Meldungen.
- Header: Datum (Mono/gold), „{Begrüßung}, {Name}." (zeitabhängig, sprachabhängig), Untertitel.

### 2. Checklisten
- Übersicht: Karten-Grid (Öffnungsablauf, Schließablauf, Reinigung Salattheke, Reinigung Bain Marie, Stations-Qualitätscheck) mit Fortschrittsbalken + „x/y"-Badge (grün bei 100%).
- Detail: Zurück-Button, Titel, Reset-Button, Fortschrittsbalken + „x/y · %", Erfolgs-Banner bei 100% (grün), abhakbare Item-Liste (24px Box, grün gefüllt + weißes Häkchen bei checked, Text durchgestrichen/ausgegraut). Optional „Wöchentlich"-Box (gold).

### 3. Wissen (Sub-Tabs: SOP-Karten / Handbuch / Rezepte)
- Suchfeld (filtert alle drei Listen live).
- **SOP-Karten:** Karten mit Poster-Bild (150px cover) + SOP-Nr/Titel/Summary. Detail: großes Poster + „Kernpunkte" (Häkchenliste) + „Wichtig"-Box (ember). Bilder: `sop-salattheke.jpeg` (SOP 9), `sop-bainmarie.jpeg` (SOP 10), `sop-kasse.jpeg` (SOP 11). Platzhalterkachel „Weitere SOPs … in Vorbereitung".
- **Handbuch:** Zeilenliste der 12 Kapitel (Nr/Titel/Desc/Status-Tag „fertig"/„in Vorb."). Detail: große Kapitelnummer, Titel, Lesezeit, Lead-Absatz, „Kernpunkte"-Liste, Hinweis auf Volltext.
- **Rezepte:** Karten mit Poster (`recipe-classicsmash.jpeg`, `recipe-chillimilli.jpeg`) + Name/Schichtenzahl. Detail: Poster + „Bau-Reihenfolge" (dunkelvioletter Header) als **antippbare, nummerierte Schrittliste** (Kreis wird grün bei checked).

### 4. Betrieb
Kachel-Landing (6 Kacheln, farbige Icon-Kachel + Titel + Desc), jede öffnet ein Unter-Screen (Zurück-Button):
- **Schichtplan:** Wochenliste Mo–Sa, je Tag Slots (Name · Zeit als Chips). Öffnungszeiten Mo–Sa 10:30–20:00.
- **Krankmeldung:** Formular (Von/Bis Datum, Grund) → Submit zeigt Toast + Eintrag in Liste.
- **Inventur & Bestellung:** Tabelle mit MIN/MAX/Bestand-Spalten + Status-Tag (kritisch/niedrig/ok) + „Bestellen"-Button (bei ≤MIN orange) → „Bestellt" + Toast. Logik: `current<=min` kritisch, `current<min*1.4` niedrig, sonst ok.
- **Temperatur-Doku:** Station-Select + Wert-Input + „Eintragen" → Log-Zeile mit OK/PRÜFEN. Sollwerte: Kühlschrank/Salattheke 2–7°C, Bain Marie >63°C, Tiefkühler <-18°C.
- **Meldungen & Aufgaben:** Textarea + „Senden" → prepend in Liste; Basis-Meldungen mit Severity-Dot (warn/neu/info).
- **Onboarding & Schulung:** Fortschrittsbalken + abhakbare Modul-Liste (6 Module, Tag 1–5) → speist Gamification-XP.

### 5. Mehr & Einstellungen
- **Management-Dashboard** (nur Rolle Management sichtbar; sonst gesperrte gold-gestrichelte Box): KPI-Kacheln (Umsatz, Bestellungen, Ø Bon, Qualität), Standorte-Liste (Container Idar-Oberstein aktiv, weitere geplant), Team-Liste (Avatare).
- Rolle wechseln (Demo-Pills), Sprache (Pills), Versionszeile, Abmelden.

---

## Interactions & Behavior
- **Navigation:** Tab-Wechsel setzt `tab` und resettet `open`/`bsub`. Detail-Ansichten via `open={type,id}`; Betrieb-Unterscreens via `bsub`. Zurück löscht `open` bzw. `bsub`.
- **Abhaken:** toggelt einen Key im `checks`-Objekt (`{clId}:{itemId}` bzw. `rez_{id}_{i}`); Fortschritt/Ring/Badges neu berechnet.
- **Toast:** erscheint unten mittig, verschwindet nach 2600ms (`mmtoast`-Anim). Ausgelöst bei Bestellung/Temp/Krankmeldung/Meldung.
- **Animationen:** `mmfade` (Screen-Einblendung, .3s), `mmpop` (Logo), Balken/Ring `transition:.4s/.6s`, Karten-Hover `translateY(-2px)` + Schatten.
- **Responsive:** <900px Bottom-Nav statt Sidebar, Topbar-Tagline ausgeblendet, kompakteres Padding.
- **RTL:** bei `lang==='ar'` `dir="rtl"` auf Wurzelcontainer.
- **Fokus-Zustände:** `:focus-visible` = 2px `#f07f13` outline (kein Browser-Blau).

## State Management
Zentrale State-Felder (im Prototyp `this.state`):
`loggedIn, role('ma'|'sl'|'mgmt'), lang('de'|'en'|'tr'|'ar'), tab, homeVar(0|1|2), wsub('sop'|'hb'|'rez'), open({type,id}|null), bsub, checks{}, ordered{}, mods{}, vw, query, tempStation, tempValue, tempLog[], sickFrom, sickTo, sickReason, sickList[], reportText, extraMeld[], toast`.
Abgeleitet: Checklisten-Fortschritt, XP (`erledigte*15 + module*40`), Level (`floor(xp/200)+1`), Onboarding-%, Filter über `query`. **Persistenz:** im Prototyp nur In-Memory — im echten App localStorage/PWA-Storage bzw. Backend anbinden.

## Interactions – Datenquellen
Alle Inhalte sind als Daten-Arrays in der Logikklasse gekapselt (Methoden `checklists() sops() recipes() chapters() inventory() shifts() modules()` und das Übersetzungsobjekt `T()`). Diese lassen sich 1:1 in JSON/DB überführen. Inhalte stammen aus dem MeatyMunch Operations Manual (Band 1 & 2) und den SOP-/Build-Card-Postern.

## Assets
Alle in `./assets/` (echte Kundenbilder, in Farbe belassen — **nicht** graustufen):
- `logo-icon.jpeg` — App-Icon/Logo (Diamant + Pommes).
- `logo-sheet.jpeg` — Logo-Varianten & Markenfarben-Referenz (nicht in der App gezeigt, nur Referenz).
- `sop-salattheke.jpeg`, `sop-bainmarie.jpeg`, `sop-kasse.jpeg` — SOP-Poster (9/10/11).
- `recipe-classicsmash.jpeg`, `recipe-chillimilli.jpeg` — Burger-Build-Cards.
Fonts: Archivo, Inter, IBM Plex Mono (Google Fonts). Icons: einfache inline-SVG im Lucide-Stil — im Zielprojekt durch echte Lucide-Icons ersetzen.

## Files
- `MeatyMunch App.dc.html` — der komplette Prototyp (Markup + Logik + Daten + Übersetzungen). Primäre Referenz.
- `assets/` — Bild-Assets.

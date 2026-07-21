# MeatyMunch MMOS — Mitarbeiter-App

Responsive Mitarbeiter-App für die Burger-Kette **MeatyMunch** (Premium Halal Fast Casual).
Rollen: **Mitarbeiter**, **Schichtleiter**, **Management**. Oberfläche in **DE / EN / TR / AR** (AR mit RTL).

Umgesetzt als **React + Vite** aus dem Claude-Design-Handoff (`design_handoff_meatymunch_app/`).

## Funktionen
- **Start** – rollenabhängige Home-Ansicht (Fokus / Karten / Dashboard) mit Öffnungs-Checklisten-Fortschritt, XP/Level/Abzeichen.
- **Checklisten** – Öffnen/Schließen, Reinigung Salattheke & Bain Marie, Stations-Qualitätscheck; abhakbar, Fortschritt live.
- **Wissen** – SOP-Karten, Handbuch (12 Kapitel), Rezepte/Build-Cards mit Live-Suche.
- **Betrieb** – Schichtplan, Krankmeldung, Inventur & Bestellung (MIN/MAX), Temperatur-Doku, Meldungen, Onboarding.
- **Mehr** – Management-Dashboard (rollen-gated), Rollen-/Sprachwechsel.

> Zustand ist aktuell rein In-Memory (kein Backend). Persistenz (localStorage/Backend) ist als spätere Ausbaustufe vorgesehen.

## Entwicklung
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production-Build nach dist/
npm run preview  # Build lokal ansehen
```

## Deployment (GitHub Pages)
Push auf `main` triggert den Workflow in `.github/workflows/deploy.yml` (Build + Deploy).
Voraussetzung: in den Repo-Einstellungen unter **Settings → Pages → Source = "GitHub Actions"**.

Der `base`-Pfad in `vite.config.js` ist auf `/meatymunch-mmos/` gesetzt und muss dem Repo-Namen entsprechen.
Live-URL: `https://<github-user>.github.io/meatymunch-mmos/`

## Struktur
- `src/data/` – Inhalte (Checklisten, SOPs, Rezepte, Kapitel, Inventar, Schichten, Module) + Übersetzungen.
- `src/state/useAppState.js` – zentraler State, Handler und abgeleitete Anzeige-Daten.
- `src/screens/` – UI-Komponenten pro Screen.
- `public/assets/` – Bild-Assets (Logo, SOP-Poster, Build-Cards).
- `design_handoff_meatymunch_app/` – originaler Design-Handoff (Referenz).

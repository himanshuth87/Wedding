# Project Structure: Anuja & Aditya Wedding Invitation

## Overview
A premium, interactive React-based wedding invitation for Anuja & Aditya. The application features a traditional Indian aesthetic with modern web animations.

## Directory Layout
- `.env.example`: Template for environment variables.
- `.gitignore`: Files and directories to be ignored by Git.
- `index.html`: Main HTML entry point.
- `metadata.json`: Project metadata (name, description, etc.).
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite build tool configuration.
- `src/`: Source code directory.
    - `main.tsx`: React entry point.
    - `App.tsx`: Main application component containing all invitation logic and sections.
    - `index.css`: Global styles and Tailwind CSS directives.

## Key Features
- **Door Reveal**: A cinematic opening animation using palace doors and a Devanagari prayer.
- **Scratch to Reveal**: Interactive component to reveal the wedding date.
- **Countdown Timer**: Real-time countdown to the wedding festivities.
- **Wardrobe Guide**: Visual guide for suggested attire for each event.
- **Event Schedule**: Detailed flow of events for both days.
- **RSVP Integration**: Direct link to WhatsApp for attendance confirmation.
- **Voice Invite**: Text-to-speech functionality to "hear" the invitation.
- **Background Music**: Traditional ambient music with floating controls.

## Technology Stack
- **Framework**: React 19.
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS 4.0 (with @theme support).
- **Animations**: Framer Motion (motion/react).
- **Icons**: Lucide React.
- **Typography**: Cinzel, Cormorant Garamond, Noto Sans Devanagari.

## Design System: Royal Marigold
- **Aesthetic**: Premium, editorial, and cinematic look inspired by traditional Indian royal architecture.
- **Palette**: Luxury Cream (#FEFCCF), Deep Crimson (#610000), and Royal Gold (#D4AF37).
- **Typography**: 
  - `Cinzel`: Primary display font for headings and elegance.
  - `Cormorant Garamond`: Body font for high-end editorial feel.
  - `Noto Sans Devanagari`: Traditional Sanskrit and Marathi text.
- **Key Rules**:
  - **No-Line Rule**: Avoid using 1px borders; use tonal background shifts and soft shadows (`royal-shadow`) for sectioning.
  - **Surface Hierarchy**: Use varied cream tones to create depth without harsh lines.

## Architecture
- **App.tsx**: The central component which manages:
  - **Interaction State**: Entry door reveal, scratch reveal, and countdown logic.
  - **Flow Control**: Controls the transition from the "Palace Door" entry to the full interactive scrollable invitation.
  - **Component Structure**: Modularized sections for Hero, Countdown, Wardrobe, Events, Venue, RSVP.
- **CSS Architecture**: Uses Tailwind CSS 4.0 with a `@theme` block in `index.css` for design tokens, ensuring global consistency.
- **Animation System**: Powered by `motion/react` for smooth, cinematic transitions (door rotates, etc.).

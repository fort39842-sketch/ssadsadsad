# FeesType - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from competitive gaming platforms and crypto trading interfaces (Twitch, Discord gaming themes, Binance dark mode) combined with modern typing test platforms (Monkeytype, TypeRacer). The design emphasizes speed, precision, and competitive gaming aesthetics.

## Core Design Principles
1. **High-Energy Competition**: Visual elements communicate urgency, speed, and competitive spirit
2. **Clarity in Motion**: Despite vibrant aesthetics, typing area maintains perfect readability
3. **Real-time Feedback**: Instant visual responses to player actions and game state changes
4. **Crypto-Gaming Fusion**: Blend blockchain credibility with arcade-style excitement

## Color Palette

### Dark Mode (Primary)
- **Background**: 230 35% 7% (deep navy-dark)
- **Surface/Cards**: 230 30% 10% (slightly lighter navy)
- **Primary (Neon Purple)**: 280 80% 60% - main CTAs, winner highlights, premium elements
- **Secondary (Neon Cyan)**: 180 100% 50% - active states, typing indicators, player highlights
- **Accent (Neon Green)**: 140 100% 50% - success states, accuracy indicators, positive feedback
- **Text Primary**: 180 100% 90% (cyan-tinted white)
- **Text Muted**: 180 30% 70% (desaturated cyan-gray)

### Semantic Colors
- **Correct Typing**: 140 100% 50% (neon green)
- **Incorrect Typing**: 0 84% 60% (bright red)
- **Waiting State**: 180 100% 50% (cyan)
- **Active Race**: 280 80% 60% (purple)
- **Winner Gold**: 45 100% 51% (bright gold for #1)

## Typography

### Font Stack
- **Primary**: 'Inter', system-ui, -apple-system, sans-serif (UI elements, general text)
- **Monospace**: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace (typing area, code/wallet addresses)
- **Display**: 'Inter', extra-bold weight (headings, hero text)

### Type Scale
- **Hero/Display**: 4xl-8xl (96px-128px), font-bold, tight leading
- **H1**: 3xl-6xl (48px-72px), font-bold
- **H2**: 2xl-4xl (32px-48px), font-bold
- **Body Large**: lg-xl (18px-20px)
- **Body**: base (16px)
- **Caption/Meta**: sm-xs (12px-14px)

### Typing Area Specific
- **Typing Text**: 18px monospace, 1.8 line-height for comfortable reading
- **User Input**: 18px monospace, matches reference text exactly
- **Timer Display**: 72-96px bold tabular numerals for countdown

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16, 24, 32** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: gap-8, space-y-8
- Large gaps: gap-12 to gap-16
- Micro spacing: gap-2 to gap-4

### Container Strategy
- **Full-width sections**: w-full with inner max-w-6xl or max-w-7xl
- **Content containers**: max-w-4xl for typing area (optimal reading width)
- **Forms/Inputs**: max-w-md to max-w-2xl
- **Results/Leaderboards**: max-w-6xl

### Grid Patterns
- **Leaderboard**: Single column on mobile, maintains clarity
- **Info Cards**: 2-4 column grid on desktop (grid-cols-2 lg:grid-cols-4)
- **Podium**: Flexbox for dynamic 1st/2nd/3rd positioning

## Component Library

### Buttons
- **Primary CTA**: Gradient from purple to cyan, bold text, px-8 py-6, glow on hover
- **Secondary**: Outline with cyan border, transparent bg with blur backdrop
- **Destructive/Warning**: Red gradient, used sparingly
- **Sizes**: Default (py-3 px-6), Large (py-6 px-12), Small (py-2 px-4)

### Cards
- **Base**: Dark surface (230 30% 10%), subtle border (230 30% 18%), rounded-lg
- **Glow Cards**: Gradient blur behind, elevated with border glow effect
- **Interactive**: Hover state with subtle scale transform and enhanced glow

### Input Fields
- **Typing Area**: Large textarea, monospace font, subtle glow border when active
- **Form Inputs**: Dark background, cyan focus ring, placeholder in muted cyan
- **Wallet Address**: Monospace font, smaller text, copy button with icon

### Progress & Indicators
- **Race Progress**: Linear gradient bar (purple to cyan to green)
- **Timer**: Large bold numbers with pulsing glow effect
- **Player Count**: Icon + number with subtle pulse animation
- **Status Indicators**: Colored dots with pulse animation (green=active, yellow=waiting)

### Navigation & Overlays
- **No traditional navbar**: Game uses full-screen state-based views
- **Dev Panel**: Hidden access via inconspicuous button, dark red accent theme
- **Modals/Dialogs**: Backdrop blur, centered card with prominent close action

## Visual Effects

### Glows & Shadows
- **Text Glow**: Drop shadow with color spread (cyan, purple, green variants)
- **Card Glow**: Gradient blur layer behind elements
- **Button Glow**: Box-shadow on hover/active states
- **Typing Pulse**: Animated border glow while user types

### Animations
- **Fade In**: Components animate in with opacity 0→1 and slight translateY
- **Pulse Glow**: 2s ease-in-out infinite for emphasis elements
- **Countdown Pulse**: Timer pulsates with color shift as time decreases
- **Winner Celebration**: Scale + glow burst on results reveal
- **Minimal Motion**: Prefer meaningful animations over decorative ones

### Gradients
- **Primary Gradient**: 135deg, purple to blue (280 80% 60% → 240 100% 50%)
- **Secondary Gradient**: 135deg, cyan to green (180 100% 50% → 140 100% 50%)
- **Background Gradient**: Radial gradient with purple glow at 30% opacity
- **Progress Bar**: Linear gradient purple → cyan → green

## Page-Specific Guidelines

### Landing Page
- **Hero**: Full viewport height, centered FeesType logo with animated glow, tagline below
- **Status Banner**: Prominent display of current game state (waiting/active/no game) with icon
- **Info Grid**: 4-card grid explaining gameplay, rewards, entry, rules
- **Prize Rules**: Distinct red-tinted card for important disclaimers
- **Contract Address**: Centered, copyable, monospace display
- **CTA**: Large gradient button "Join Race" when game available

### Entry Form
- **Centered Card**: Max-width card with glow effect
- **Inputs**: Nickname (text) and Wallet (monospace) with cyan focus states
- **Submit Button**: Full-width gradient CTA
- **Tagline**: Muted text below form with game value proposition

### Waiting Room
- **Countdown Timer**: Massive 80-96px numerals with pulsing glow, center stage
- **Player Count**: Large display with users icon, updates in real-time
- **Status Message**: Clear messaging about when race starts
- **Visual Hierarchy**: Timer > Player count > Instructions

### Typing Race
- **Reference Text**: Monospace, large (18px), characters colored based on user accuracy (green=correct, red=wrong, gray=pending)
- **Input Area**: Matching monospace textarea, focus glow, paste-disabled
- **Progress Bar**: Top of card, gradient fill showing completion %
- **Stats Display**: Compact accuracy % and progress % in corner
- **Finish Button**: Appears only when text matches exactly, prominent gradient

### Results Podium
- **Podium Visual**: 3D-style blocks for top 3, graduated heights, emoji medals (🏆🥈🥉)
- **Winner Emphasis**: #1 position elevated, larger text, pulsing glow animation
- **Personal Stats**: Highlighted card showing user's time/accuracy/placement
- **Leaderboard**: Clean list for remaining racers, striped rows
- **Play Again**: Large centered CTA button

### Dev Panel
- **Auth Screen**: Red accent theme, centered password card, contrasts with main game
- **Control Panel**: Form for game creation (duration input), creation button
- **Visual Distinction**: Different color scheme (red vs purple/cyan) signals developer mode

## Images
**No hero images required** - The design relies on bold typography, neon colors, and gaming aesthetics rather than photography. Icons and emoji provide sufficient visual interest (🏆, ⚡, 🚀 for decorative elements).

## Accessibility Notes
- Maintain WCAG AA contrast ratios despite vibrant colors (use 90% lightness text on dark backgrounds)
- Typing area must have high contrast and clear character distinction
- Color is not the only differentiator (use icons + color for states)
- Focus indicators visible and distinct (cyan glow rings)
- Reduced motion: Disable pulse/glow animations when prefers-reduced-motion is set
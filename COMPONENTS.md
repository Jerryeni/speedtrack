# Component Inventory

## UI Components (`components/ui/`)

### Button.tsx
- **Purpose**: Reusable button with variants
- **Props**: `variant` (primary/secondary), `className`, standard button props
- **Usage**: All CTAs, wallet connections, form submissions

### IconCircle.tsx
- **Purpose**: Icon wrapper with gradient border and background
- **Props**: `size` (sm/md/lg/xl), `gradient`, `bgColor`, `className`
- **Usage**: Feature icons, stat icons, decorative elements

### StatCard.tsx
- **Purpose**: Unified stat display component (replaces StatBox)
- **Props**: `value`, `label`, `color`, `progress`, `id`, `icon`, `badge`, `layout` (center/box)
- **Layouts**: 
  - `center`: Simple centered stat with progress bar
  - `box`: Card layout with icon, badge, and gradient background
- **Usage**: All statistics displays across pages

### FeatureCard.tsx
- **Purpose**: Feature display with icon and description
- **Props**: `icon`, `title`, `description`, `gradient`, `iconColor`
- **Usage**: Feature lists, benefit sections

### WalletOption.tsx
- **Purpose**: Wallet selection card
- **Props**: `name`, `description`, `icon`, `iconBg`, `iconColor`, `badges`, `onClick`
- **Usage**: Wallet connection page

### NetworkCard.tsx
- **Purpose**: Network/blockchain display card
- **Props**: `name`, `gas`, `icon`, `iconColor`, `iconBg`
- **Usage**: Network selection, blockchain info

### HelpCard.tsx
- **Purpose**: Help/support option card
- **Props**: `icon`, `iconColor`, `title`, `description`, `gradient`, `border`
- **Usage**: Support sections, help centers

## Layout Components (`components/layout/`)

### Header.tsx
- **Purpose**: Main navigation header
- **Usage**: All pages

## Section Components (`components/sections/`)

### Hero.tsx
- **Purpose**: Landing page hero section
- **Usage**: Home page

### Stats.tsx
- **Purpose**: Live statistics display with counter animations
- **Usage**: Home page, dashboard

### PoolFlow.tsx
- **Purpose**: Pool flow visualization
- **Usage**: Home page

### About.tsx
- **Purpose**: About/features section
- **Usage**: Home page

### Blockchain.tsx
- **Purpose**: Blockchain transparency section
- **Usage**: Home page

### HowItWorks.tsx
- **Purpose**: Step-by-step process display
- **Usage**: Home page

### JoinNow.tsx
- **Purpose**: Call-to-action section
- **Usage**: Home page

## Modal Components (`components/modals/`)

### ConnectionModal.tsx
- **Purpose**: Wallet connection progress modal
- **Props**: `isOpen`, `walletName`, `onCancel`
- **Usage**: Wallet connection flow

### SuccessModal.tsx
- **Purpose**: Success confirmation modal
- **Props**: `isOpen`, `walletAddress`, `walletName`, `onProceed`
- **Usage**: Post-connection confirmation

## Guidelines

1. **Always check this file before creating new components**
2. **Reuse existing components with different props instead of creating duplicates**
3. **If a component needs new functionality, extend it with optional props**
4. **Keep components flexible and composable**
5. **Update this file when adding new components**

# GLB Viewer & Equipper Studio

A high-performance, studio-grade 3D model viewer and character customization engine built with **Next.js**, **Three.js**, and **React Three Fiber**.

<img width="1850" height="1174" alt="Screenshot 2026-02-13 at 7 10 13 PM" src="https://github.com/user-attachments/assets/35a449f8-5842-4b75-a290-950cd0ed65c5" />

## 🚀 Features

### 1. Premium Landing Page

- **Ultra-Modern UI**: Dark mode with glassmorphism, glowing orbs, and smooth Framer Motion animations.
- **Micro-interactions**: Hover effects and magnetic buttons for a premium feel.
- **Developer-First**: Clean, modular structure designed for scalability.

### 2. Instant GLB Previewer

- **Quick Inspection**: Drag and drop any `.glb` file to visualize it instantly.
- **Smart Rendering**: Specialized `SimpleGLBViewer` with auto-centering, studio lighting, and orbit controls.
- **Blob Handling**: Efficient local file handling without double-loading.

### 3. Equipper Studio (`/equipper`)

- **Character Customization**: A dedicated environment for building modular 3D avatars.
- **Skeleton Rebinding**: Advanced logic to bind modular parts (heads, bodies, apparel) to a single bone hierarchy in real-time.
- **Modular Assets**: Seamlessly swap between different genders, body types, hair styles, and outfits.
- **Camera Presets**: Integrated controls for Zoom, Rotation, and View resets.

## 🛠️ Tech Stack

- **Core**: [Next.js](https://nextjs.org/) (App Router)
- **3D Engine**: [Three.js](https://threejs.org/)
- **React 3D**: [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/UsmanDevCraft/glb-viewer.git
   cd glb-viewer
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/views/index.tsx`: Premium Landing Page & Uploader logic.
- `src/views/Equipper/index.tsx`: Core Equipper Studio & Character Logic.
- `src/components/SimpleGLBViewer.tsx`: Standalone lightweight 3D viewer.
- `src/components/FileUploader.tsx`: Advanced drag-and-drop file handler.

## 📄 License

MIT License. Feel free to use this for your own 3D projects!

---

Crafted with ❤️ for the 3D Web.

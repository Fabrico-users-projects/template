import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // ← only change
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [tailwindcss(), react(), cloudflare()],
});

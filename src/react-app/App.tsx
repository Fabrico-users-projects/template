import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { FabricoProvider } from "@fabrico/sdk/react";
import { fabrico } from "./lib/fabrico";

function App() {
  return (
    <FabricoProvider client={fabrico}>
      <BrowserRouter>
        <Routes>
          {/* Main Dashboard Welcome Page */}
          <Route path="/" element={<Home />} />

          {/* Add others Routes Here */}

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </FabricoProvider>
  );
}

export default App;
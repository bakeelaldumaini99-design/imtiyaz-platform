import { Routes, Route } from "react-router";
import { StoreProvider } from "./lib/store";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UnitView from "./pages/UnitView";
import LessonView from "./pages/LessonView";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/unit/:unitId" element={<UnitView />} />
        <Route path="/lesson/:lessonId" element={<LessonView />} />
        <Route path="/checkout/:packId" element={<Checkout />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <FloatingWhatsApp />
    </StoreProvider>
  );
}

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { Router } from "./components/common/Router";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import TicketsPage from "./pages/TicketsPage";
import KnowledgePage from "./pages/KnowledgePage";
import PricingPage from "./pages/PricingPage";
import ContactsPage from "./pages/ContactsPage";
import "./App.css";

function App() {
  // Конфигурация маршрутов
  const routes = {
    '/': () => <HomePage />,
    '/services': () => <ServicesPage />,
    '/tickets': () => <TicketsPage />,
    '/knowledge': () => <KnowledgePage />,
    '/pricing': () => <PricingPage />,
    '/contacts': () => <ContactsPage />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', width: '100%' }}>
        <Router routes={routes} />
      </main>

      <Footer />
    </div>
  );
}

export default App;

import { lazy, Suspense } from 'react';
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { Router } from "./components/common/Router";
import Loading from "./components/common/Loading";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import ParticleBackground from "./components/common/ParticleBackground";
import "./App.css";

// Lazy loading страниц
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));
const PerformancePage = lazy(() => import('./pages/PerformancePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  const renderAdminPage = () => (
    <Suspense fallback={<Loading />}>
      <AdminPage />
    </Suspense>
  );

  // Конфигурация маршрутов с Suspense для lazy loading
  const routes = {
    '/': () => (
      <Suspense fallback={<Loading />}>
        <HomePage />
      </Suspense>
    ),
    '/services': () => (
      <Suspense fallback={<Loading />}>
        <ServicesPage />
      </Suspense>
    ),
    '/tickets': () => (
      <Suspense fallback={<Loading />}>
        <TicketsPage />
      </Suspense>
    ),
    '/knowledge': () => (
      <Suspense fallback={<Loading />}>
        <KnowledgePage />
      </Suspense>
    ),
    '/performance': () => (
      <Suspense fallback={<Loading />}>
        <PerformancePage />
      </Suspense>
    ),
    '/pricing': () => (
      <Suspense fallback={<Loading />}>
        <PricingPage />
      </Suspense>
    ),
    '/contacts': () => (
      <Suspense fallback={<Loading />}>
        <ContactsPage />
      </Suspense>
    ),
    '/admin': renderAdminPage,
    '/admin/tickets': renderAdminPage,
    '/admin/services': renderAdminPage,
    '/admin/knowledge': renderAdminPage,
    '/admin/changelog': renderAdminPage,
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ParticleBackground />
        <Header />

        <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <ErrorBoundary>
            <Router routes={routes} />
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

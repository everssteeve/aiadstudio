import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

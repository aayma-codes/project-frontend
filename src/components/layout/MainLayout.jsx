import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Chatbot from '../common/Chatbot';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
}

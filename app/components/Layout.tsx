import React from 'react';
import Sidebar from './Sidebar';
import {Outlet} from '@remix-run/react'
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: React.ReactNode;
    
}

export default function Layout(props: LayoutProps) {
  return (
    <div className='flex h-screen w-screen'>
      <nav className='flex-shrink-0 w-60  h-screen ' >
        <Sidebar />
      </nav>

      <main className='flex-grow overflow-auto z-auto'>
        <Outlet />
        <Toaster 
           position="bottom-center" 
           toastOptions={{
            // Define default options
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '1rem',
            },}}
        />
      </main>
    </div>
  );
}

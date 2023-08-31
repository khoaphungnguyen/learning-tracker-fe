import React from 'react';
import Sidebar from './Sidebar';
import {Outlet} from '@remix-run/react'

interface LayoutProps {
    children: React.ReactNode;
    
}

export default function Layout(props: LayoutProps) {
  return (
    <div className='flex h-screen w-screen'>
      <nav className='flex-shrink-0 w-60  h-screen ' >
        <Sidebar />
      </nav>

      <main className='flex-grow overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
}

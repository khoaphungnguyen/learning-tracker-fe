import React from 'react';
import Sidebar from './Sidebar';
import {Outlet} from '@remix-run/react'

interface LayoutProps {
    children: React.ReactNode;
    
}

export default function Layout(props: LayoutProps ) {
    return (
      <>
     <div className='flex h-screen w-screen flex-row '>
      <Sidebar/>
      <main className=' h-screen  '>
        <Outlet />
      </main>
     </div>
      </>
    )
  }
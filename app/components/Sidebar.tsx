import React from 'react';
import { NavLink } from '@remix-run/react';

const Sidebar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white h-screen w-64 p-4">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/group1"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Group 1
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/group2"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          //  activeClassName="font-semibold bg-gray-700"
          >
            Group 2
          </NavLink>
        </li>
        {/* Add more group links as needed */}
      </ul>
    </nav>
  );
};

export default Sidebar;

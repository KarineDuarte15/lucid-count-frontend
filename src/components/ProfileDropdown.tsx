// src/components/ProfileDropdown.tsx
'use client';
import { useState } from 'react';
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 p-2 bg-primary rounded-md text-background hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-border"
      >
        <div className="flex items-center">
          <FaUserCircle className="mr-3 text-2xl text-background" />
          <span>Meu Perfil</span>
        </div>
        <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-primary rounded-md shadow-lg z-10">
          <button className="flex items-center w-full px-4 py-2 text-left text-border hover:bg-border hover:text-background">
            <FaSignOutAlt className="mr-3" />
            Sair
          </button>

        </div>
      )}
    </div>
  );
}
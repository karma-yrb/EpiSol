import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavMenu.css';
import { isAdminFromToken } from '../../utils/auth';

const NAV_LINKS = [
  { to: '/', icon: 'fa-home', label: 'Accueil' },
  { to: '/users', icon: 'fa-users', label: 'Utilisateurs', adminOnly: true },
  { to: '/beneficiaires', icon: 'fa-address-book', label: 'Bénéficiaires' },
  { to: '/produits', icon: 'fa-shopping-basket', label: 'Produits' }, // icône panier pour produits
  { to: '/achats', icon: 'fa-shopping-cart', label: 'Nouvel achat' }, // Lien explicite vers la page d'ajout d'achats
  { to: '/liste-achats', icon: 'fa-list-alt', label: 'Liste achats' }, // Ajout historique achats
];

function NavMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  // Détecte si mobile (largeur < 900px)
  const isMobile = window.innerWidth < 900;

  const isAdmin = isAdminFromToken();

  return (
    <>
      <button
        className={`nav-burger${open ? ' open' : ''}`}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <nav className={`nav-menu${open ? ' open' : ''}`}
        role="navigation"
        aria-label="Menu principal"
      >
        <ul>
          {NAV_LINKS.filter(link => {
            if (link.adminOnly && !isAdmin) return false;
            return true;
          }).map(link => (
            <li key={link.to} className={location.pathname === link.to ? 'active' : ''}>
              <Link to={link.to} onClick={() => setOpen(false)}>
                <i className={`fa ${link.icon}`} aria-hidden="true" style={{fontSize: '1.3em', marginRight: isMobile ? 0 : 8}}></i>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Menu utilisateur déroulant à droite */}
      <div className="user-menu-wrapper">
        {user}
        <button className="user-menu-btn" onClick={() => setUserMenuOpen(v => !v)}>
          <i className="fa fa-user-circle"></i>
        </button>
        {userMenuOpen && (
          <div className="user-dropdown-menu">
            <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
              <i className="fa fa-user"></i> Mon profil
            </Link>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}>
              <i className="fa fa-sign-out"></i> Se déconnecter
            </button>
          </div>
        )}
      </div>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
}

export default NavMenu;

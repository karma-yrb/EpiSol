import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavMenu.css';
import { isAdminFromToken, getUserInitialsFromToken } from '../../utils/auth';

const NAV_LINKS = [
  { to: '/', icon: 'fa-home', label: 'Accueil' },
  { to: '/users', icon: 'fa-users', label: 'Utilisateurs', adminOnly: true },
  { to: '/beneficiaires', icon: 'fa-address-book', label: 'Bénéficiaires' },
  { to: '/produits', icon: 'fa-shopping-basket', label: 'Produits' }, // icône panier pour produits
  { to: '/achats', icon: 'fa-shopping-cart', label: 'Nouvel achat' }, // Lien explicite vers la page d'ajout d'achats
  { to: '/liste-achats', icon: 'fa-list-alt', label: 'Liste achats' }, // Ajout historique achats
  { to: '/stocks', icon: 'fa-archive', label: 'Stocks' }, // Lien gestion des stocks
];

function NavMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const location = useLocation();

  // Hook pour détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = isAdminFromToken();
  
  // Récupère les initiales de l'utilisateur depuis le token
  const userInitials = getUserInitialsFromToken();

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
      </button>      <nav className={`nav-menu${open ? ' open' : ''}`}
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
          ))}        </ul>
      </nav>{/* Menu utilisateur déroulant à droite */}
      <div className="user-menu-wrapper">
        <button className="user-menu-btn" onClick={() => setUserMenuOpen(v => !v)}>
          {userInitials ? (
            <span className="user-initials">{userInitials}</span>
          ) : (
            <i className="fa fa-user-circle"></i>
          )}
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

import React, { useState, useEffect } from 'react';
import packageJson from '../../../package.json';
import { versionApi } from '../../api/versionApi';
import './VersionInfo.css';

const VersionInfo = ({ position = 'bottom-right', showBackend = false }) => {
  const [backendVersion, setBackendVersion] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const frontendVersion = {
    name: 'EpiSol Frontend',
    version: packageJson.version
  };

  useEffect(() => {
    if (showBackend) {
      versionApi.getBackendVersion()
        .then(setBackendVersion)
        .catch(console.error);
    }
  }, [showBackend]);

  const toggleExpanded = () => {
    if (showBackend) {
      setIsExpanded(!isExpanded);
    }
  };

  const isSynchronized = backendVersion && frontendVersion.version === backendVersion.version;

  return (
    <div 
      className={`version-info version-info--${position} ${isExpanded ? 'version-info--expanded' : ''}`} 
      data-page="version"
      onClick={toggleExpanded}
      style={{ cursor: showBackend ? 'pointer' : 'default' }}
    >
      <div className="version-info__content">
        <span className="version-info__name">EpiSol</span>
        <span className="version-info__version">v{frontendVersion.version}</span>
        {showBackend && backendVersion && !isSynchronized && (
          <span className="version-info__warning" title="Versions frontend/backend désynchronisées">⚠️</span>
        )}
        {showBackend && isSynchronized && (
          <span className="version-info__sync" title="Versions synchronisées">✅</span>
        )}
      </div>
      
      {showBackend && isExpanded && (
        <div className="version-info__details">
          <div className="version-info__item">
            <span>Frontend:</span> <span>v{frontendVersion.version}</span>
          </div>
          <div className="version-info__item">
            <span>Backend:</span> 
            <span>{backendVersion ? `v${backendVersion.version}` : 'Loading...'}</span>
          </div>
          {backendVersion && (
            <div className="version-info__item version-info__uptime">
              <span>Uptime:</span> 
              <span>{Math.floor(backendVersion.uptime / 60)}min</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VersionInfo;

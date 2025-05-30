console.log('API URL utilisée :', process.env.REACT_APP_API_URL);
export function getApiUrl(path) {
  const base = process.env.REACT_APP_API_URL || '';
  if (path.startsWith('/')) return base + path;
  return base + '/' + path;
}

// Nettoyage : retire les logs de debug et la logique complexe inutile
export async function postData(path = '', data = {}) {
  throw new Error('postData ne doit plus être utilisé pour la navigation entre /beneficiaires et /liste-achats');
}

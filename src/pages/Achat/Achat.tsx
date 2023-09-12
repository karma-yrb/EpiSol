// src/pages/Achat.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Achat() {
  const [listeName, setListeName] = useState('');
  const [articleName, setArticleName] = useState('');
  const [articleValue, setArticleValue] = useState('');
  const [total, setTotal] = useState(0);
  const [articles, setArticles] = useState<{ name: string; value: number }[]>(
    []
  );

  const handleAddArticle = () => {
    if (articleName && articleValue) {
      const article = { name: articleName, value: parseFloat(articleValue) };
      setArticles([...articles, article]);
      setTotal(total + article.value);
      setArticleName('');
      setArticleValue('');
    }
  };

  const handleRemoveArticle = (index: number) => {
    const removedArticle = articles[index];
    setTotal(total - removedArticle.value);
    setArticles(articles.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Nouvel achat</h1>
      <div className="mb-4">
        <label className="block font-medium mb-2">Nom de la liste</label>
        <input
          type="text"
          value={listeName}
          onChange={(e) => setListeName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Nom de l'article</label>
        <input
          type="text"
          value={articleName}
          onChange={(e) => setArticleName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Valeur de l'article</label>
        <input
          type="number"
          value={articleValue}
          onChange={(e) => setArticleValue(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="button"
        onClick={handleAddArticle}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Ajouter l'article
      </button>
      <h2 className="text-lg font-semibold mt-4">Articles</h2>
      <ul className="list-disc pl-6">
        {articles.map((article, index) => (
          <li key={index} className="flex justify-between items-center my-2">
            <span>{article.name}</span>
            <span>{article.value}</span>
            <button
              key={article.name}
              type="button"
              onClick={() => handleRemoveArticle(index)}
              className="text-red-600"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <p className="font-semibold">Total : {total.toFixed(2)}</p>
      </div>
      <div className="mt-4">
        <Link
          to="/"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default Achat;

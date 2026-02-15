import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetAPI } from '../services/api';
import { Search, Filter } from 'lucide-react';

const AssetCatalog = () => {
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadAssets();
  }, [filters]);

  const loadAssets = async () => {
    try {
      const res = await assetAPI.getAll(filters);
      setAssets(res.data.assets);
    } catch (error) {
      console.error('Failed to load assets:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Asset Catalog</h1>
        <div className="grid grid-3">
          {assets.map(asset => (
            <div key={asset.id} className="card" onClick={() => navigate(`/learn/${asset.id}`)}>
              <img src={asset.thumbnail} alt={asset.title} style={{width:'100%',borderRadius:'4px',marginBottom:'1rem'}} />
              <h3>{asset.title}</h3>
              <p className="text-muted">{asset.description}</p>
              <div className="flex gap-1 mt-2">
                <span className={`badge badge-${asset.difficulty.toLowerCase()}`}>{asset.difficulty}</span>
                <span className="badge">{asset.format}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetCatalog;

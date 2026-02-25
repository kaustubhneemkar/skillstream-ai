import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, learningPathAPI, assetAPI } from '../services/api';
import { LogOut, BookOpen, TrendingUp, Clock, Award, Play, ChevronRight, Zap, BookMarked, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [paths, setPaths] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [progress, setProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, pathsRes, analyticsRes, categoriesRes, assetsRes, progressRes] = await Promise.all([
        employeeAPI.getProfile(),
        learningPathAPI.getAll(),
        employeeAPI.getAnalytics(),
        assetAPI.getCategories(),
        assetAPI.getAll(),
        employeeAPI.getProgress()
      ]);

      setEmployee(profileRes.data);
      setPaths(pathsRes.data.paths);
      setAnalytics(analyticsRes.data);
      setCategories(categoriesRes.data.categories);
      setAllAssets(assetsRes.data.assets);
      setProgress(progressRes.data.progress || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePath = async (category) => {
    try {
      await learningPathAPI.generate(category);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to generate path:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Get enrolled courses (courses in active learning paths)
  const enrolledAssetIds = new Set();
  paths.forEach(path => {
    if (path.status === 'active') {
      path.modules.forEach(module => enrolledAssetIds.add(module.id));
    }
  });

  const enrolledAssets = allAssets.filter(asset => enrolledAssetIds.has(asset.id));
  const unenrolledAssets = allAssets.filter(asset => !enrolledAssetIds.has(asset.id));

  // Filter unenrolled assets by search
  const filteredUnenrolledAssets = unenrolledAssets.filter(asset =>
    asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate progress for enrolled courses
  const getAssetProgress = (assetId) => {
    const assetProgress = progress.find(p => p.assetId === assetId);
    return assetProgress ? assetProgress.percentComplete : 0;
  };

  const activePath = paths.find(p => p.status === 'active');

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <h2 className="nav-logo">SKILLSTREAM</h2>
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link active">Dashboard</Link>
              <Link to="/catalog" className="nav-link">Catalog</Link>
              {user.isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
            </div>
            <div className="nav-actions">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-content container">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, <span className="text-primary">{employee?.name}</span>
            </h1>
            <p className="dashboard-subtitle">{employee?.role} • {employee?.department}</p>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><BookOpen /></div>
            <div className="stat-info">
              <div className="stat-value">{enrolledAssets.length}</div>
              <div className="stat-label">Enrolled Courses</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Award /></div>
            <div className="stat-info">
              <div className="stat-value">{analytics?.totalModulesCompleted || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><TrendingUp /></div>
            <div className="stat-info">
              <div className="stat-value">
                {analytics?.averageScore ? Math.round(analytics.averageScore) : 'N/A'}
              </div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Clock /></div>
            <div className="stat-info">
              <div className="stat-value">{Math.round(analytics?.completionRate || 0)}%</div>
              <div className="stat-label">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="enrolled-section">
          <div className="section-header">
            <h3><BookMarked size={24} /> My Enrolled Courses</h3>
          </div>

          {enrolledAssets.length > 0 ? (
            <div className="enrolled-courses-grid">
              {enrolledAssets.map(asset => {
                const assetProgress = getAssetProgress(asset.id);
                return (
                  <div key={asset.id} className="enrolled-course-card">
                    <div className="course-thumbnail">
                      <img src={asset.thumbnail} alt={asset.title} />
                      <div className="course-format-badge">{asset.format}</div>
                    </div>
                    <div className="course-content">
                      <h4>{asset.title}</h4>
                      <p className="course-category">{asset.category}</p>
                      <div className="course-progress-section">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span>{assetProgress}%</span>
                        </div>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{width: `${assetProgress}%`}}></div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/learn/${asset.id}`)}
                      >
                        {assetProgress > 0 ? 'Continue' : 'Start'} <Play size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <BookMarked size={48} />
              <h4>No Enrolled Courses Yet</h4>
              <p>Generate a learning path or browse available courses below</p>
            </div>
          )}
        </div>

        {/* Available Courses Section */}
        <div className="available-section">
          <div className="section-header">
            <h3><Search size={24} /> Available Courses</h3>
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredUnenrolledAssets.length > 0 ? (
            <div className="available-courses-grid">
              {filteredUnenrolledAssets.map(asset => (
                <div key={asset.id} className="available-course-card card">
                  <div className="course-thumbnail">
                    <img src={asset.thumbnail} alt={asset.title} />
                    <div className={`badge badge-${asset.difficulty.toLowerCase()}`}>
                      {asset.difficulty}
                    </div>
                  </div>
                  <div className="course-details">
                    <h4>{asset.title}</h4>
                    <p className="course-description">{asset.description}</p>
                    <div className="course-meta">
                      <span className="category-tag">{asset.category}</span>
                      <span className="duration-tag">{asset.duration} min</span>
                    </div>
                    <div className="course-tags">
                      {asset.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>{searchTerm ? 'No courses match your search' : 'All courses enrolled!'}</p>
            </div>
          )}
        </div>

        {/* Generate Learning Path CTA */}
        {!activePath && categories.length > 0 && (
          <div className="generate-path-section">
            <div className="generate-path-card">
              <Zap size={48} className="generate-icon" />
              <h3>Generate Your Personalized Learning Path</h3>
              <p>Get a curated learning journey tailored to your skills and goals</p>
              <div className="category-grid">
                {categories.map(category => (
                  <button
                    key={category}
                    className="category-card"
                    onClick={() => handleGeneratePath(category)}
                  >
                    <span>{category}</span>
                    <ChevronRight size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics */}
        {analytics && analytics.recentScores.length > 0 && (
          <div className="analytics-section">
            <h3>Performance Trends</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.recentScores.map((score, idx) => ({ name: `Test ${idx + 1}`, score }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A4049" />
                  <XAxis dataKey="name" stroke="#7A8189" />
                  <YAxis stroke="#7A8189" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#2A2F36', border: '1px solid #3A4049', borderRadius: '4px' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#FF6B35" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {analytics.strengths.length > 0 && (
              <div className="insights">
                <div className="insight-group">
                  <h4>Strengths</h4>
                  <div className="tag-list">
                    {analytics.strengths.map(strength => (
                      <span key={strength} className="tag tag-success">{strength}</span>
                    ))}
                  </div>
                </div>

                {analytics.weaknesses.length > 0 && (
                  <div className="insight-group">
                    <h4>Areas to Improve</h4>
                    <div className="tag-list">
                      {analytics.weaknesses.map(weakness => (
                        <span key={weakness} className="tag tag-warning">{weakness}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

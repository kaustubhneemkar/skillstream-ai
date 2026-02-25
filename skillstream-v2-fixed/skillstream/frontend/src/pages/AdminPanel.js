import React, { useState, useEffect } from 'react';
import { adminAPI, assetAPI } from '../services/api';
import { Users, BookOpen, TrendingUp, Database, Plus, X, Video } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Cloud',
    difficulty: 'Beginner',
    format: 'Video',
    duration: 60,
    tags: '',
    content: {
      type: 'youtube',
      playlist: [{ videoId: '', title: '', duration: 0, description: '' }]
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, employeesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getEmployees()
      ]);
      setStats(statsRes.data);
      setEmployees(employeesRes.data.employees);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleSeed = async () => {
    try {
      await adminAPI.seedDatabase();
      loadData();
      alert('Database reseeded successfully!');
    } catch (error) {
      console.error('Seed failed:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = () => {
    setNewCourse(prev => ({
      ...prev,
      content: {
        ...prev.content,
        playlist: [...prev.content.playlist, { videoId: '', title: '', duration: 0, description: '' }]
      }
    }));
  };

  const handleRemoveVideo = (index) => {
    setNewCourse(prev => ({
      ...prev,
      content: {
        ...prev.content,
        playlist: prev.content.playlist.filter((_, i) => i !== index)
      }
    }));
  };

  const handleVideoChange = (index, field, value) => {
    setNewCourse(prev => ({
      ...prev,
      content: {
        ...prev.content,
        playlist: prev.content.playlist.map((video, i) =>
          i === index ? { ...video, [field]: value } : video
        )
      }
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...newCourse,
        tags: newCourse.tags.split(',').map(t => t.trim()).filter(Boolean),
        url: `/assets/${newCourse.title.toLowerCase().replace(/\s+/g, '-')}`,
        thumbnail: newCourse.content.playlist[0].videoId 
          ? `https://img.youtube.com/vi/${newCourse.content.playlist[0].videoId}/maxresdefault.jpg`
          : ''
      };

      await assetAPI.create(courseData);
      alert('Course created successfully!');
      setShowCreateForm(false);
      setNewCourse({
        title: '',
        description: '',
        category: 'Cloud',
        difficulty: 'Beginner',
        format: 'Video',
        duration: 60,
        tags: '',
        content: {
          type: 'youtube',
          playlist: [{ videoId: '', title: '', duration: 0, description: '' }]
        }
      });
      loadData();
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course: ' + (error.response?.data?.error || error.message));
    }
  };

  if (!stats) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="dashboard admin-panel">
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h1 className="dashboard-title">Admin Panel</h1>
          <div className="admin-actions">
            <button className="btn btn-secondary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? <X size={20} /> : <Plus size={20} />} 
              {showCreateForm ? 'Cancel' : 'Create Course'}
            </button>
            <button className="btn btn-primary" onClick={handleSeed}>
              <Database size={20} /> Reseed Database
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="create-course-form card mb-4">
            <h3><Plus size={20} /> Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input"
                  rows="3"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-input" value={newCourse.category} onChange={handleInputChange}>
                    <option>Cloud</option>
                    <option>AI</option>
                    <option>DevOps</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select name="difficulty" className="form-input" value={newCourse.difficulty} onChange={handleInputChange}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    className="form-input"
                    value={newCourse.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-input"
                  placeholder="AWS, Cloud, Infrastructure"
                  value={newCourse.tags}
                  onChange={handleInputChange}
                />
              </div>

              <div className="video-playlist-section">
                <div className="flex justify-between items-center mb-3">
                  <h4><Video size={18} /> Video Playlist</h4>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddVideo}>
                    <Plus size={16} /> Add Video
                  </button>
                </div>

                {newCourse.content.playlist.map((video, index) => (
                  <div key={index} className="video-form-group">
                    <div className="video-form-header">
                      <h5>Video {index + 1}</h5>
                      {newCourse.content.playlist.length > 1 && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRemoveVideo(index)}>
                          <X size={16} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">YouTube Video ID</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="dQw4w9WgXcQ"
                          value={video.videoId}
                          onChange={(e) => handleVideoChange(index, 'videoId', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Duration (minutes)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={video.duration}
                          onChange={(e) => handleVideoChange(index, 'duration', parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Video Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={video.title}
                        onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-input"
                        value={video.description}
                        onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary">
                Create Course
              </button>
            </form>
          </div>
        )}

        <div className="stats-grid mb-4">
          <div className="stat-card">
            <div className="stat-icon"><Users /></div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalEmployees}</div>
              <div className="stat-label">Employees</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><BookOpen /></div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalAssets}</div>
              <div className="stat-label">Courses</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><TrendingUp /></div>
            <div className="stat-info">
              <div className="stat-value">{Math.round(stats.averageScore)}</div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-3">Employees</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Completion</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td className="text-muted">{emp.role}</td>
                    <td>{Math.round((emp.completionRate || 0) * 100)}%</td>
                    <td>{emp.averageScore || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

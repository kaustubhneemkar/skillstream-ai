import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assetAPI, employeeAPI } from '../services/api';
import { ArrowLeft, CheckCircle, Play, BookOpen, Code, ExternalLink, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import './LearningModule.css';

const LearningModule = () => {
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAsset();
  }, [assetId]);

  useEffect(() => {
    if (asset && asset.content?.type === 'youtube' && asset.content.playlist) {
      const totalVideos = asset.content.playlist.length;
      const progressPercent = Math.round((completedVideos.length / totalVideos) * 100);
      setProgress(progressPercent);
    }
  }, [completedVideos, asset]);

  const loadAsset = async () => {
    try {
      const res = await assetAPI.getById(assetId);
      setAsset(res.data);
    } catch (error) {
      console.error('Failed to load asset:', error);
    }
  };

  const handleVideoComplete = () => {
    if (!completedVideos.includes(currentVideoIndex)) {
      setCompletedVideos([...completedVideos, currentVideoIndex]);
    }
  };

  const handleNextVideo = () => {
    const playlist = asset.content.playlist;
    if (currentVideoIndex < playlist.length - 1) {
      handleVideoComplete();
      setCurrentVideoIndex(currentVideoIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    try {
      await employeeAPI.updateProgress({ assetId, percentComplete: 100, timeSpent: asset.duration });
      await employeeAPI.submitScore({ assetId, score: 85, maxScore: 100 });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (!asset) return <div className="loading-container"><div className="spinner"></div></div>;

  const renderVideoContent = () => {
    const content = asset.content;
    
    // Single video (backward compatibility)
    if (content.videoId && !content.playlist) {
      return (
        <div className="video-content">
          <div className="video-container">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${content.videoId}`}
              title={asset.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      );
    }

    // Video playlist
    if (content.playlist && content.playlist.length > 0) {
      const currentVideo = content.playlist[currentVideoIndex];
      const totalVideos = content.playlist.length;

      return (
        <div className="video-content">
          <div className="video-playlist-header">
            <div className="playlist-info">
              <h3>Video {currentVideoIndex + 1} of {totalVideos}</h3>
              <p className="current-video-title">{currentVideo.title}</p>
            </div>
            <div className="playlist-progress">
              <span>{completedVideos.length} / {totalVideos} completed</span>
            </div>
          </div>

          <div className="video-container">
            <iframe
              key={currentVideoIndex}
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-description">
            <p>{currentVideo.description}</p>
            <span className="video-duration">Duration: {currentVideo.duration} minutes</span>
          </div>

          <div className="video-navigation">
            <button 
              className="btn btn-secondary"
              onClick={handlePreviousVideo}
              disabled={currentVideoIndex === 0}
            >
              <ChevronLeft size={20} /> Previous Video
            </button>

            <button 
              className="btn btn-primary"
              onClick={handleNextVideo}
              disabled={currentVideoIndex === totalVideos - 1}
            >
              {currentVideoIndex === totalVideos - 1 ? 'All Videos Completed' : 'Next Video'} 
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Video Playlist Sidebar */}
          <div className="playlist-sidebar">
            <h4>Course Playlist</h4>
            <div className="playlist-items">
              {content.playlist.map((video, index) => (
                <div 
                  key={index}
                  className={`playlist-item ${index === currentVideoIndex ? 'active' : ''} ${completedVideos.includes(index) ? 'completed' : ''}`}
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <div className="playlist-item-number">
                    {completedVideos.includes(index) ? '✓' : index + 1}
                  </div>
                  <div className="playlist-item-info">
                    <div className="playlist-item-title">{video.title}</div>
                    <div className="playlist-item-duration">{video.duration} min</div>
                  </div>
                  {index === currentVideoIndex && <Play size={16} className="playing-icon" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (!asset.content) {
      return (
        <div className="content-placeholder">
          <p>Content coming soon for this module</p>
        </div>
      );
    }

    // YouTube Video Content
    if (asset.content.type === 'youtube') {
      return (
        <>
          {renderVideoContent()}
          
          {asset.content.resources && asset.content.resources.length > 0 && (
            <div className="resources-section">
              <h3><FileText size={20} /> Additional Resources</h3>
              <div className="resource-links">
                {asset.content.resources.map((resource, idx) => (
                  <a 
                    key={idx} 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <ExternalLink size={16} />
                    {resource.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }

    // Documentation Content
    if (asset.content.type === 'documentation') {
      return (
        <div className="documentation-content">
          <div className="doc-summary">
            <h3>Overview</h3>
            <p>{asset.content.summary}</p>
          </div>

          <div className="doc-links">
            <h3><BookOpen size={20} /> Technical Documentation</h3>
            {asset.content.docs.map((doc, idx) => (
              <a 
                key={idx}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-card"
              >
                <div className="doc-card-header">
                  <h4>{doc.title}</h4>
                  <ExternalLink size={18} />
                </div>
                <p>{doc.description}</p>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // Interactive Sandbox Content
    if (asset.content.type === 'sandbox') {
      return (
        <div className="sandbox-content">
          {asset.content.videoId && (
            <div className="video-container mb-4">
              <h3><Play size={20} /> Video Tutorial</h3>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${asset.content.videoId}`}
                title={asset.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="sandbox-section">
            <div className="sandbox-header">
              <h3><Code size={20} /> Interactive Sandbox</h3>
              <a 
                href={asset.content.sandboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                Open {asset.content.platform}
              </a>
            </div>
            
            <div className="exercises-list">
              <h4>Practical Exercises</h4>
              <ol>
                {asset.content.exercises.map((exercise, idx) => (
                  <li key={idx}>{exercise}</li>
                ))}
              </ol>
            </div>
          </div>

          {asset.content.resources && asset.content.resources.length > 0 && (
            <div className="resources-section">
              <h3><FileText size={20} /> Additional Resources</h3>
              <div className="resource-links">
                {asset.content.resources.map((resource, idx) => (
                  <a 
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <ExternalLink size={16} />
                    {resource.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard learning-module">
      <div className="container learning-container">
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="module-header">
          <div className="module-meta">
            <div className={`badge badge-${asset.difficulty.toLowerCase()}`}>{asset.difficulty}</div>
            <span className="module-format">{asset.format}</span>
            <span className="module-duration">{asset.duration} minutes</span>
          </div>
          <h1>{asset.title}</h1>
          <p className="module-description">{asset.description}</p>
          <div className="module-tags">
            {asset.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{width:`${progress}%`}}></div>
          </div>
        </div>

        <div className="module-content-card">
          <div className="content-tabs">
            <button 
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <Play size={16} /> Learning Content
            </button>
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BookOpen size={16} /> Overview
            </button>
          </div>

          <div className="content-area">
            {activeTab === 'content' && renderContent()}
            
            {activeTab === 'overview' && (
              <div className="overview-content">
                <h3>Module Overview</h3>
                <p><strong>Category:</strong> {asset.category}</p>
                <p><strong>Difficulty:</strong> {asset.difficulty}</p>
                <p><strong>Format:</strong> {asset.format}</p>
                <p><strong>Estimated Time:</strong> {asset.duration} minutes</p>
                
                <h4 className="mt-4">What You'll Learn</h4>
                <p>{asset.description}</p>
                
                <h4 className="mt-4">Topics Covered</h4>
                <div className="topics-grid">
                  {asset.tags.map(tag => (
                    <div key={tag} className="topic-card">{tag}</div>
                  ))}
                </div>

                {asset.prerequisites && asset.prerequisites.length > 0 && (
                  <>
                    <h4 className="mt-4">Prerequisites</h4>
                    <ul>
                      {asset.prerequisites.map((prereq, idx) => (
                        <li key={idx}>{prereq}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="action-section">
          {progress >= 100 && (
            <button className="btn btn-primary btn-lg" onClick={handleComplete}>
              <CheckCircle size={20} /> Mark Complete & Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningModule;

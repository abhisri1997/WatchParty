import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { usePartyStore } from '../store/partyStore';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaSync,
  FaArrowLeft,
  FaUserFriends,
  FaCopy,
  FaLink,
} from 'react-icons/fa';
import './PartyPage.css';

const PartyPage = () => {
  const { partyCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentParty, getParty, leaveParty, updateContent } = usePartyStore();

  const [socket, setSocket] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [members, setMembers] = useState([]);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [tempVideoUrl, setTempVideoUrl] = useState('');
  const [isSeeking, setIsSeeking] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    // Load party data
    getParty(partyCode);

    // Initialize socket connection
    const token = localStorage.getItem('token');
    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join-party', { partyCode });
    });

    newSocket.on('party-state', (data) => {
      console.log('Party state received:', data);
      setMembers(data.members);
      if (data.currentContent?.contentUrl) {
        setVideoUrl(data.currentContent.contentUrl);
      }
      setPlaying(data.videoState.isPlaying);
      setCurrentTime(data.videoState.currentTime);
    });

    newSocket.on('video-play', (data) => {
      console.log('Play event received');
      setPlaying(true);
      if (Math.abs(data.currentTime - currentTime) > 2) {
        playerRef.current?.seekTo(data.currentTime);
        setCurrentTime(data.currentTime);
      }
    });

    newSocket.on('video-pause', (data) => {
      console.log('Pause event received');
      setPlaying(false);
      playerRef.current?.seekTo(data.currentTime);
      setCurrentTime(data.currentTime);
    });

    newSocket.on('video-seek', (data) => {
      console.log('Seek event received');
      playerRef.current?.seekTo(data.currentTime);
      setCurrentTime(data.currentTime);
    });

    newSocket.on('video-sync', (data) => {
      console.log('Sync event received');
      setPlaying(data.isPlaying);
      playerRef.current?.seekTo(data.currentTime);
      setCurrentTime(data.currentTime);
      toast.success('Video synced!');
    });

    newSocket.on('user-joined', (data) => {
      toast.success('A user joined the party');
    });

    newSocket.on('user-left', (data) => {
      toast('A user left the party');
    });

    newSocket.on('error', (data) => {
      toast.error(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-party', { partyCode });
      newSocket.disconnect();
    };
  }, [partyCode, getParty]);

  const handlePlayPause = () => {
    const newPlaying = !playing;
    setPlaying(newPlaying);
    
    if (newPlaying) {
      socket?.emit('video-play', { partyCode, currentTime });
    } else {
      socket?.emit('video-pause', { partyCode, currentTime });
    }
  };

  const handleSeekForward = () => {
    const newTime = currentTime + 10;
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime);
    socket?.emit('video-seek', { partyCode, currentTime: newTime });
  };

  const handleSeekBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime);
    socket?.emit('video-seek', { partyCode, currentTime: newTime });
  };

  const handleSync = () => {
    socket?.emit('request-sync', { partyCode });
  };

  const handleProgress = (state) => {
    if (!isSeeking) {
      setCurrentTime(state.playedSeconds);
    }
  };

  const handleSetVideoUrl = async () => {
    if (!tempVideoUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    const result = await updateContent(partyCode, {
      contentUrl: tempVideoUrl,
      contentTitle: 'Custom Video',
      contentType: 'custom',
    });

    if (result.success) {
      setVideoUrl(tempVideoUrl);
      setShowUrlModal(false);
      setTempVideoUrl('');
      toast.success('Video URL updated!');
      
      // Notify via socket
      socket?.emit('video-seek', { partyCode, currentTime: 0 });
    } else {
      toast.error(result.error);
    }
  };

  const handleLeaveParty = async () => {
    const result = await leaveParty(partyCode);
    if (result.success) {
      toast.success('Left the party');
      navigate('/dashboard');
    }
  };

  const copyPartyLink = () => {
    const link = `${window.location.origin}/party/${partyCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Party link copied!');
  };

  const isHost = currentParty?.host?._id === user?._id;
  const canControl = currentParty?.settings?.allowMemberControl || isHost;

  return (
    <div className="party-page">
      <nav className="party-nav">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="party-title">
          <h2>{currentParty?.name}</h2>
          <span className="party-code">Code: {partyCode}</span>
        </div>
        <div className="party-actions">
          <button onClick={copyPartyLink} className="btn-icon" title="Copy party link">
            <FaCopy />
          </button>
          <button onClick={handleLeaveParty} className="btn-leave">
            Leave Party
          </button>
        </div>
      </nav>

      <div className="party-content">
        <div className="video-section">
          <div className="video-container">
            {videoUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={playing}
                controls={false}
                width="100%"
                height="100%"
                onProgress={handleProgress}
                progressInterval={1000}
                config={{
                  youtube: {
                    playerVars: { showinfo: 0, controls: 0 }
                  }
                }}
              />
            ) : (
              <div className="no-video">
                <FaLink className="no-video-icon" />
                <p>No video loaded</p>
                <button onClick={() => setShowUrlModal(true)} className="btn-primary">
                  Set Video URL
                </button>
              </div>
            )}
          </div>

          <div className="video-controls">
            <button
              onClick={handleSeekBackward}
              disabled={!canControl || !videoUrl}
              className="control-btn"
              title="Backward 10s"
            >
              <FaBackward />
            </button>

            <button
              onClick={handlePlayPause}
              disabled={!canControl || !videoUrl}
              className="control-btn control-btn-large"
              title={playing ? 'Pause' : 'Play'}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>

            <button
              onClick={handleSeekForward}
              disabled={!canControl || !videoUrl}
              className="control-btn"
              title="Forward 10s"
            >
              <FaForward />
            </button>

            <button
              onClick={handleSync}
              className="control-btn"
              title="Re-sync video"
            >
              <FaSync />
            </button>

            <button
              onClick={() => setShowUrlModal(true)}
              className="control-btn"
              title="Change video"
            >
              <FaLink />
            </button>
          </div>

          {!canControl && (
            <div className="control-warning">
              <small>Only the host can control playback</small>
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="members-section">
            <h3>
              <FaUserFriends /> Members ({members.length})
            </h3>
            <div className="members-list">
              {members.map((member) => (
                <div key={member.user._id} className="member-item">
                  <img
                    src={member.user.avatar}
                    alt={member.user.username}
                    className="member-avatar"
                  />
                  <div className="member-info">
                    <span className="member-name">{member.user.username}</span>
                    {currentParty?.host?._id === member.user._id && (
                      <span className="host-badge">Host</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h4>Party Information</h4>
            <div className="info-item">
              <strong>Service:</strong>
              <span className="service-tag">{currentParty?.streamingService}</span>
            </div>
            <div className="info-item">
              <strong>Max Members:</strong>
              <span>{currentParty?.settings?.maxMembers}</span>
            </div>
            {currentParty?.currentContent?.contentTitle && (
              <div className="info-item">
                <strong>Now Playing:</strong>
                <span>{currentParty.currentContent.contentTitle}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Set Video URL Modal */}
      {showUrlModal && (
        <div className="modal-overlay" onClick={() => setShowUrlModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Set Video URL</h2>
            <p className="modal-description">
              Enter a video URL (YouTube, Vimeo, direct video links, etc.)
            </p>
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                value={tempVideoUrl}
                onChange={(e) => setTempVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowUrlModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleSetVideoUrl} className="btn-submit">
                Set Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyPage;

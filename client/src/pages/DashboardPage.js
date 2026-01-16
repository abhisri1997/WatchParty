import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePartyStore } from '../store/partyStore';
import toast from 'react-hot-toast';
import {
  FaVideo,
  FaSignOutAlt,
  FaPlus,
  FaUserFriends,
  FaCopy,
  FaDoorOpen,
  FaNetflix,
} from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuthStore();
  const { createParty, joinParty, activeParties, loadActiveParties } = usePartyStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    name: '',
    streamingService: 'netflix',
    maxMembers: 10,
    allowMemberControl: true,
  });

  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    loadUser();
    loadActiveParties();
  }, [loadUser, loadActiveParties]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleCreateParty = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createParty(createFormData);
    setLoading(false);

    if (result.success) {
      toast.success('Party created successfully!');
      setShowCreateModal(false);
      navigate(`/party/${result.party.partyCode}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleJoinParty = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await joinParty(joinCode.toUpperCase());
    setLoading(false);

    if (result.success) {
      toast.success('Joined party successfully!');
      setShowJoinModal(false);
      navigate(`/party/${result.party.partyCode}`);
    } else {
      toast.error(result.error);
    }
  };

  const copyPartyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Party code copied!');
  };

  const streamingServiceIcon = {
    netflix: '🎬',
    hulu: '📺',
    'disney-plus': '🏰',
    'prime-video': '📦',
    'hbo-max': '🎭',
    custom: '🎥',
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <FaVideo />
          <span>WatchParty</span>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.username}
              className="user-avatar"
            />
            <span>{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="btn-icon" title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Your Watch Parties</h1>
          <div className="header-actions">
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              <FaPlus /> Create Party
            </button>
            <button onClick={() => setShowJoinModal(true)} className="btn-secondary">
              <FaDoorOpen /> Join Party
            </button>
          </div>
        </div>

        <div className="parties-grid">
          {activeParties.length === 0 ? (
            <div className="empty-state">
              <FaUserFriends className="empty-icon" />
              <h3>No Active Parties</h3>
              <p>Create or join a party to start watching together!</p>
            </div>
          ) : (
            activeParties.map((party) => (
              <div key={party._id} className="party-card">
                <div className="party-header">
                  <div className="party-service">
                    {streamingServiceIcon[party.streamingService]}
                    <span>{party.streamingService}</span>
                  </div>
                  {party.host._id === user?._id && (
                    <span className="host-badge">Host</span>
                  )}
                </div>
                <h3>{party.name}</h3>
                <div className="party-info">
                  <span>
                    <FaUserFriends /> {party.members.length} / {party.settings.maxMembers} members
                  </span>
                  <button
                    onClick={() => copyPartyCode(party.partyCode)}
                    className="btn-icon"
                    title="Copy party code"
                  >
                    <FaCopy /> {party.partyCode}
                  </button>
                </div>
                {party.currentContent && (
                  <div className="party-content">
                    <small>Now watching:</small>
                    <p>{party.currentContent.contentTitle}</p>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/party/${party.partyCode}`)}
                  className="btn-join-party"
                >
                  Join Watch Party
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Create Party Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Party</h2>
            <form onSubmit={handleCreateParty}>
              <div className="form-group">
                <label>Party Name</label>
                <input
                  type="text"
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, name: e.target.value })
                  }
                  placeholder="Friday Night Movies"
                  required
                />
              </div>

              <div className="form-group">
                <label>Streaming Service</label>
                <select
                  value={createFormData.streamingService}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, streamingService: e.target.value })
                  }
                >
                  <option value="netflix">Netflix</option>
                  <option value="hulu">Hulu</option>
                  <option value="disney-plus">Disney+</option>
                  <option value="prime-video">Prime Video</option>
                  <option value="hbo-max">HBO Max</option>
                  <option value="custom">Custom URL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Max Members</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={createFormData.maxMembers}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, maxMembers: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={createFormData.allowMemberControl}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, allowMemberControl: e.target.checked })
                    }
                  />
                  Allow all members to control playback
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Party'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Party Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Join Party</h2>
            <form onSubmit={handleJoinParty}>
              <div className="form-group">
                <label>Party Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 8-character code"
                  maxLength={8}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowJoinModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Joining...' : 'Join Party'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

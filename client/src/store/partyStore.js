import { create } from 'zustand';
import { partyAPI } from '../utils/api';

export const usePartyStore = create((set, get) => ({
  currentParty: null,
  activeParties: [],
  loading: false,

  createParty: async (partyData) => {
    try {
      set({ loading: true });
      const response = await partyAPI.createParty(partyData);
      set({ currentParty: response.data.party, loading: false });
      return { success: true, party: response.data.party };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create party'
      };
    }
  },

  joinParty: async (partyCode) => {
    try {
      set({ loading: true });
      const response = await partyAPI.joinParty({ partyCode });
      set({ currentParty: response.data.party, loading: false });
      return { success: true, party: response.data.party };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to join party'
      };
    }
  },

  getParty: async (partyCode) => {
    try {
      set({ loading: true });
      const response = await partyAPI.getParty(partyCode);
      set({ currentParty: response.data.party, loading: false });
      return { success: true, party: response.data.party };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch party'
      };
    }
  },

  leaveParty: async (partyCode) => {
    try {
      await partyAPI.leaveParty(partyCode);
      set({ currentParty: null });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to leave party'
      };
    }
  },

  updateContent: async (partyCode, contentData) => {
    try {
      const response = await partyAPI.updateContent(partyCode, contentData);
      set({ currentParty: response.data.party });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update content'
      };
    }
  },

  loadActiveParties: async () => {
    try {
      const response = await partyAPI.getActiveParties();
      set({ activeParties: response.data.parties });
    } catch (error) {
      console.error('Failed to load active parties:', error);
    }
  },

  setCurrentParty: (party) => set({ currentParty: party }),
}));

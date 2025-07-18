import { api } from "../contexts/AuthContext";

// POST /api/tracking
export const createTracking = async (data) => {
  try {
    const response = await api.post("/api/tracking", data);
    return response;
  } catch (err) {
    return err.response;
  }
};

// GET /api/tracking
export const getAllTrackings = async () => {
  try {
    const response = await api.get("/api/tracking");
    return response;
  } catch (err) {
    return err.response;
  }
};

// GET /api/tracking/{id}
export const getTrackingById = async (id) => {
  try {
    const response = await api.get(`/api/tracking/${id}`);
    return response;
  } catch (err) {
    return err.response;
  }
};

// DELETE /api/tracking/{id}
export const deleteTracking = async (id) => {
  try {
    const response = await api.delete(`/api/tracking/${id}`);
    return response;
  } catch (err) {
    return err.response;
  }
};

// GET /api/tracking/contract/{contractId}
export const getTrackingByContract = async (contractId) => {
  try {
    const response = await api.get(`/api/tracking/contract/${contractId}`);
    return response;
  } catch (err) {
    return err.response;
  }
};

// GET /api/tracking/contract/{contractId}/latest
export const getLatestTrackingForContract = async (contractId) => {
  try {
    const response = await api.get(
      `/api/tracking/contract/${contractId}/latest`
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

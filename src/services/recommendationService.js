import { apiClient } from "./apiClient";

export const recommendationService = {
  getUserRecommendations(idUsuario) {
    return apiClient.get(`/users/${idUsuario}/recommendations`);
  },
};

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

export interface CreateLeagueData {
  name: string;
  league: string;
  matchWeek: string;
  lives: number;
  penalty: "lose_life" | "none" | "random_pick";
  allowReentries: boolean;
  tiesCount: "win" | "loss" | "draw";
}

export const createLeague = async (data: CreateLeagueData) => {
  const token = Cookies.get("token");
  try {
    const response = await axios.post(
      `${API_URL}/leagues`,
      {
        name: data.name,
        leagueType: data.league,
        initialLives: data.lives,
        maxParticipants: 100, // Default value
        startDate: new Date(), // We'll need to get this from the match week
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isPrivate: false,
        totalRounds: 38, // Default for Premier League
        advancedSettings: {
          numberOfLives: data.lives,
          playerForgetToPick: data.penalty,
        },
        allowReEntry: data.allowReentries,
        tiesCountAs: data.tiesCount,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinLeague = async (leagueId: string, userId: string) => {
  const token = Cookies.get("token");
  try {
    const response = await axios.post(
      `${API_URL}/leagues/join`,
      { leagueId, userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

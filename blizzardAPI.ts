import axios from 'axios';

let accessToken: string | null = null;
let tokenExpiration: number | null = null;
const BLIZZARD_API_BASE_URL = "https://eu.api.blizzard.com";

interface BlizzardAPIResponse {
  access_token: string;
  expires_in: number;
}

interface CharacterAppearance {
  // Define the structure based on the Blizzard API response
}

interface CharacterMedia {
  // Define the structure based on the Blizzard API response
}

interface CharacterAchievementsSummary {
  // Define the structure based on the Blizzard API response
}

interface CharacterAchievementsStatistics {
  // Define the structure based on the Blizzard API response
}

interface TokenInfo {
  // Define the structure based on the Blizzard API response
}

const getClientCredentials = async (): Promise<void> => {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
  const response = await axios.post<BlizzardAPIResponse>('https://eu.battle.net/oauth/token', null, {
    params: {
      grant_type: 'client_credentials'
    },
    auth: {
      username: clientId!,
      password: clientSecret!
    }
  });

  accessToken = response.data.access_token;
  const expiresIn = response.data.expires_in;
  tokenExpiration = Date.now() + expiresIn * 1000; // Convertir en millisecondes
};

const getAccessToken = async (): Promise<string | null> => {
  if (!accessToken || Date.now() > tokenExpiration!) {
    await getClientCredentials();
  }
  return accessToken;
};

const getCharacterAppearance = async (realm: string, characterName: string): Promise<CharacterAppearance> => {
  try {
    const accessToken = await getAccessToken();
    const url = `${BLIZZARD_API_BASE_URL}/profile/wow/character/${realm}/${characterName}/appearance?namespace=profile-eu&locale=fr_FR&access_token=${accessToken}`;
    const response = await axios.get<CharacterAppearance>(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching character appearance:", error.response || error);
    throw error;
  } 
};

const getCharacterMedia = async (realm: string, characterName: string): Promise<CharacterMedia> => {
  const accessToken = await getAccessToken();
  const url = `${BLIZZARD_API_BASE_URL}/profile/wow/character/${realm}/${characterName}/character-media?namespace=profile-eu&locale=fr_FR&access_token=${accessToken}`;
  const response = await axios.get<CharacterMedia>(url);
  return response.data;
};

const getCharacterAchievementsSummary = async (realm: string, characterName: string): Promise<CharacterAchievementsSummary> => {
  const accessToken = await getAccessToken();
  const url = `${BLIZZARD_API_BASE_URL}/profile/wow/character/${realm}/${characterName}/achievements?namespace=profile-eu&locale=fr_FR&access_token=${accessToken}`;
  const response = await axios.get<CharacterAchievementsSummary>(url);
  return response.data;
};

const getCharacterAchievementsStatistics = async (realm: string, characterName: string): Promise<CharacterAchievementsStatistics> => {
  const accessToken = await getAccessToken();
  const url = `${BLIZZARD_API_BASE_URL}/profile/wow/character/${realm}/${characterName}/achievements/statistics?namespace=profile-eu&locale=fr_FR&access_token=${accessToken}`;
  const response = await axios.get<CharacterAchievementsStatistics>(url);
  return response.data;
};

const getTokenInfo = async (): Promise<TokenInfo> => {
  try {
    const accessToken = await getAccessToken();
    const url = `${BLIZZARD_API_BASE_URL}/data/wow/token/index?namespace=dynamic-eu&locale=fr_FR&access_token=${accessToken}`;
    const response = await axios.get<TokenInfo>(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching token information:", error.response || error);
    throw error;
  }
};

export {
  getAccessToken,
  getCharacterAppearance,
  getCharacterMedia,
  getCharacterAchievementsSummary,
  getCharacterAchievementsStatistics,
  getTokenInfo,
};

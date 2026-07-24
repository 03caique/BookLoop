import api from "./api";

import {
  SocioeconomicProfile,
  SocioeconomicProfileUpdate,
} from "../models/SocioeconomicProfile";

export async function createSocioeconomicProfile(
  profile: SocioeconomicProfile
) {
  const response = await api.post(
    "/api/socioeconomic-profile",
    {
      familyIncome: Number(profile.familyIncome),
      educationLevel: profile.educationLevel,
      householdSize: Number(profile.householdSize),
      workSituation: profile.workSituation,
    }
  );

  return response.data;
}

export async function getSocioeconomicProfile(
  userId: number
): Promise<SocioeconomicProfile> {
  const response = await api.get<SocioeconomicProfile>(
    `/api/socioeconomic-profile/${userId}`
  );

  return response.data;
}

export async function updateSocioeconomicProfile(
  userId: number,
  profile: SocioeconomicProfileUpdate
): Promise<SocioeconomicProfile> {
  const response = await api.put<SocioeconomicProfile>(
    `/api/socioeconomic-profile/${userId}`,
    {
      familyIncome: Number(profile.familyIncome),
      educationLevel: profile.educationLevel,
      householdSize: Number(profile.householdSize),
      workSituation: profile.workSituation,
    }
  );

  return response.data;
}
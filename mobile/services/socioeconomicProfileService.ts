import api from "./api";

import { SocioeconomicProfile }
from "../models/SocioeconomicProfile";

export async function createSocioeconomicProfile(
  profile: SocioeconomicProfile
) {

  const response = await api.post(
    "/api/socioeconomic-profile",
    {
      familyIncome:
        Number(profile.familyIncome),

      educationLevel:
        profile.educationLevel,

      householdSize:
        Number(profile.householdSize),

      workSituation:
        profile.workSituation,
    }
  );

  return response.data;
}
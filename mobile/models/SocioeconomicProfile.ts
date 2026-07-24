export interface SocioeconomicProfile {
  id: number;
  familyIncome: number;
  educationLevel: string;
  householdSize: number;
  workSituation: string;
}

export interface SocioeconomicProfileUpdate {
  familyIncome: number;
  educationLevel: string;
  householdSize: number;
  workSituation: string;
}
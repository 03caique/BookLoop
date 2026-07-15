export interface MatchResponseDTO{
  matchId: number;

  otherUserId: number;
  otherUserName: string;

  myBookId: number;
  myBookTitle: string;

  otherBookId: number;
  otherBookTitle: string;
}

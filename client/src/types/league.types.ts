export interface Participant {
  userId: string;
  lives: number;
  isActive: boolean;
  totalPredictions: number;
  correctPredictions: number;
}

export interface League {
  id: string;
  name: string;
  leagueType: string;
  initialLives: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  isPrivate: boolean;
  totalRounds: number;
  advancedSettings: {
    numberOfLives: number;
    playerForgetToPick: string;
  };
  allowReEntry: boolean;
  tiesCountAs: string;
  createdBy: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  participants: Participant[];
  status: string;
  currentRound: number;
} 
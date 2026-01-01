
export interface Solution {
  text: string;
  timestamp: number;
  imageUrl?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

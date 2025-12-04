export interface Citizen {
  id: number;
  name: string;
  age: number;
  loyalty_score: number;
  last_activity: string;
  status: 'active' | 'under_surveillance' | 'unperson' | 'detained';
  dept_id: number;
}

export interface Department {
  id: number;
  dept_name: string;
  building: string;
}

export interface Level {
  id: number;
  title: string;
  briefing: string;
  data: Citizen[];
  secondaryData?: Department[]; // Support for JOIN levels showing a second table
  tokens: string[];
  expectedResultIds: number[]; 
  sqlConcept: string;
  // Regex string to validate the user's constructed query
  validPattern?: string; 
  isCritical?: boolean;
}

export type GameState = 'BOOT' | 'BRIEFING' | 'PLAYING' | 'SUCCESS' | 'FAILURE' | 'ENDING';

export interface Message {
  sender: 'SUPERVISOR' | 'SYSTEM' | 'HERO';
  text: string;
}
export interface PosterData {
  titleCN: string;
  titleEN: string;
  credits: string;
  year: string;
  summary: [string, string, string];
  posterImage: string; // Base64 string of the generated image
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: PosterData | null;
}
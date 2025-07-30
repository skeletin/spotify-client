declare global {
  interface SpotifyApiResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    scope: string;
    expiresIn: number;
  }
}

export {};

export interface Anime {
  mal_id: number;
  title: string;
  score: number | null;
  episodes: number | null;
  status: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export interface AnimeResult {
  data: Anime[];
}

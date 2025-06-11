export interface Database {
  public: {
    Tables: {
      hackathons: {
        Row: {
          id: string;
          name: string;
          location: string;
          city: string | null;
          country_code: string | null;
          date_start: string;
          date_end: string | null;
          topics: string[] | null;
          notes: string | null;
          url: string;
          source: string;
          status: "upcoming" | "past" | "estimated";
          created_at: string;
          updated_at: string;
          notified: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          city?: string | null;
          country_code?: string | null;
          date_start: string;
          date_end?: string | null;
          topics?: string[] | null;
          notes?: string | null;
          url: string;
          source?: string;
          status?: "upcoming" | "past" | "estimated";
          created_at?: string;
          updated_at?: string;
          notified?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          city?: string | null;
          country_code?: string | null;
          date_start?: string;
          date_end?: string | null;
          topics?: string[] | null;
          notes?: string | null;
          url?: string;
          source?: string;
          status?: "upcoming" | "past" | "estimated";
          created_at?: string;
          updated_at?: string;
          notified?: boolean;
        };
      };
    };
  };
}

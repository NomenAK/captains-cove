/* Captain's Cove - Supabase Database Types */
/* Auto-generated type definitions for database tables */

export interface Database {
  public: {
    Tables: {
      ships: {
        Row: {
          id: number;
          static_info_id: number;
          name: string;
          health: number;
          speed: number;
          mobility: number;
          armor: number;
          capacity: number;
          crew_slots: number;
          rank: number;
          tier: number;
          type: 'Destroyer' | 'Battleship' | 'Hardship' | 'CargoShip' | 'Mortar';
          ship_class: 'Combat' | 'Fast' | 'Heavy' | 'Transport' | 'Siege' | 'Imperial';
          subtype: string | null;
          fraction: 'None' | 'Antilia' | 'Empire' | 'Espaniol' | 'KaiAndSeveria' | 'Scandinavia' | 'Pirates';
          cost: number;
          coolness: 'Default' | 'Unique' | 'Elite' | 'Rare';
          required_rank: number;
          upgrade_slots: number;
          is_playable: boolean;
          pvp_role: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ships']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['ships']['Insert']>;
      };
      weapons: {
        Row: {
          id: string;
          name: string;
          class: string;
          category: 'Cannon' | 'Culverin' | 'Carronade' | 'Bombard' | 'Mortar';
          size_class: 'Light' | 'Medium' | 'Heavy';
          distance: number;
          penetration: number;
          cooldown: number;
          angle: number;
          scatter: number;
          speed_factor: number;
          price: number;
          icon: string | null;
          model: string | null;
          crafting_type: 'ByGold' | 'ByCraft' | 'NotAvailable';
          tier: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['weapons']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['weapons']['Insert']>;
      };
      ammo: {
        Row: {
          id: string;
          name: string;
          speed: number;
          penetration: number;
          damage_factor: number;
          sail_damage: number;
          crew_damage: number;
          min_damage: number;
          effects: string | null;
          mass: number;
          radius: number;
          reload_factor: number;
          distance_factor: number;
          icon: string | null;
          cost: number;
          is_rare: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ammo']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['ammo']['Insert']>;
      };
      kegs: {
        Row: {
          id: string;
          name: string;
          mass: number;
          damage: number;
          trigger_radius: number;
          damage_radius: number;
          count: number;
          reload: number;
          crew_usage: number;
          icon: string | null;
          cost_gold: number;
          cost_skulls: number;
          cost_marks: number;
          is_rare: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kegs']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['kegs']['Insert']>;
      };
      crews: {
        Row: {
          id: string;
          name: string;
          type: 'Sailor' | 'Boarding' | 'Special';
          damage: number;
          health: number;
          capacity: number;
          cost: number;
          cost_marks: number;
          options: 'All' | 'Combats' | 'Sailors' | 'Pirates' | 'Adventurers';
          effect: string | null;
          effect_per_sailor: string | null;
          effect_per_boarding: string | null;
          icon: string | null;
          pvp_relevant: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['crews']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['crews']['Insert']>;
      };
      skills: {
        Row: {
          id: string;
          name: string;
          cost_points: number;
          cost: string | null;
          effect: string | null;
          category: 'economy' | 'logistics' | 'combat' | 'legend';
          position: string | null;
          radial_position: string | null;
          depends_on: string | null;
          required_achievements: string | null;
          required_ships: string | null;
          required_rank: string | null;
          icon: string | null;
          pvp_relevant: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['skills']['Insert']>;
      };
      localization: {
        Row: {
          key: string;
          value: string;
          language: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['localization']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['localization']['Insert']>;
      };
      builds: {
        Row: {
          id: string;
          name: string;
          archetype: 'brawler' | 'kite' | 'sniper' | 'pursuit' | 'trade' | 'siege';
          tier: number;
          ship_id: number | null;
          weapons: Record<string, string>;
          ammo: Record<string, string>;
          upgrades: string[];
          strategy: string | null;
          strengths: string[];
          weaknesses: string[];
          estimated_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['builds']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['builds']['Insert']>;
      };
    };
  };
}

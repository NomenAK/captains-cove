export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: Database["public"]["Enums"]["achievement_category"]
          created_at: string
          enum_ref: string | null
          id: string
          internal_id: string
          rating_weight: number
          single_give: boolean
        }
        Insert: {
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string
          enum_ref?: string | null
          id: string
          internal_id: string
          rating_weight?: number
          single_give?: boolean
        }
        Update: {
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string
          enum_ref?: string | null
          id?: string
          internal_id?: string
          rating_weight?: number
          single_give?: boolean
        }
        Relationships: []
      }
      ammo: {
        Row: {
          cost: number
          created_at: string
          crew_damage: number
          damage_factor: number
          description: string | null
          distance_factor: number
          effects: string | null
          icon: string | null
          id: string
          index: number | null
          is_rare: boolean
          mass: number
          min_damage: number
          name: string
          notes: string | null
          penetration: number
          radius: number
          reload_factor: number
          sail_damage: number
          speed: number
        }
        Insert: {
          cost?: number
          created_at?: string
          crew_damage?: number
          damage_factor?: number
          description?: string | null
          distance_factor?: number
          effects?: string | null
          icon?: string | null
          id: string
          index?: number | null
          is_rare?: boolean
          mass?: number
          min_damage?: number
          name: string
          notes?: string | null
          penetration?: number
          radius?: number
          reload_factor?: number
          sail_damage?: number
          speed?: number
        }
        Update: {
          cost?: number
          created_at?: string
          crew_damage?: number
          damage_factor?: number
          description?: string | null
          distance_factor?: number
          effects?: string | null
          icon?: string | null
          id?: string
          index?: number | null
          is_rare?: boolean
          mass?: number
          min_damage?: number
          name?: string
          notes?: string | null
          penetration?: number
          radius?: number
          reload_factor?: number
          sail_damage?: number
          speed?: number
        }
        Relationships: []
      }
      arena_bonuses: {
        Row: {
          effects: string
          id: number
          max_quantity: number
          probability: number
        }
        Insert: {
          effects: string
          id?: number
          max_quantity?: number
          probability?: number
        }
        Update: {
          effects?: string
          id?: number
          max_quantity?: number
          probability?: number
        }
        Relationships: []
      }
      builds: {
        Row: {
          ammo: Json
          archetype: Database["public"]["Enums"]["archetype"]
          consumables: string[]
          created_at: string
          estimated_score: number
          id: string
          name: string
          ship_id: number | null
          strategy: string | null
          strengths: string[]
          tier: number
          updated_at: string
          upgrades: string[]
          weaknesses: string[]
          weapons: Json
        }
        Insert: {
          ammo?: Json
          archetype?: Database["public"]["Enums"]["archetype"]
          consumables?: string[]
          created_at?: string
          estimated_score?: number
          id?: string
          name: string
          ship_id?: number | null
          strategy?: string | null
          strengths?: string[]
          tier?: number
          updated_at?: string
          upgrades?: string[]
          weaknesses?: string[]
          weapons?: Json
        }
        Update: {
          ammo?: Json
          archetype?: Database["public"]["Enums"]["archetype"]
          consumables?: string[]
          created_at?: string
          estimated_score?: number
          id?: string
          name?: string
          ship_id?: number | null
          strategy?: string | null
          strengths?: string[]
          tier?: number
          updated_at?: string
          upgrades?: string[]
          weaknesses?: string[]
          weapons?: Json
        }
        Relationships: [
          {
            foreignKeyName: "builds_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      consumables: {
        Row: {
          allow_interrupt: boolean | null
          category: Database["public"]["Enums"]["consumable_category"]
          cooldown: number
          crafting_gold: number
          crafting_resources: Json
          created_at: string
          description: string | null
          duration: number
          effects: Json
          group_range: number | null
          hidden_from_craft: boolean
          icon: string | null
          id: number
          is_group_effect: boolean
          min_rank: number | null
          name: string
          npc_can_use: boolean
          server_effect: string | null
        }
        Insert: {
          allow_interrupt?: boolean | null
          category?: Database["public"]["Enums"]["consumable_category"]
          cooldown?: number
          crafting_gold?: number
          crafting_resources?: Json
          created_at?: string
          description?: string | null
          duration?: number
          effects?: Json
          group_range?: number | null
          hidden_from_craft?: boolean
          icon?: string | null
          id: number
          is_group_effect?: boolean
          min_rank?: number | null
          name: string
          npc_can_use?: boolean
          server_effect?: string | null
        }
        Update: {
          allow_interrupt?: boolean | null
          category?: Database["public"]["Enums"]["consumable_category"]
          cooldown?: number
          crafting_gold?: number
          crafting_resources?: Json
          created_at?: string
          description?: string | null
          duration?: number
          effects?: Json
          group_range?: number | null
          hidden_from_craft?: boolean
          icon?: string | null
          id?: number
          is_group_effect?: boolean
          min_rank?: number | null
          name?: string
          npc_can_use?: boolean
          server_effect?: string | null
        }
        Relationships: []
      }
      cosmetics: {
        Row: {
          bonus: string | null
          created_at: string
          icon: string | null
          id: number
          in_shop: string | null
          name_key: string
          type: Database["public"]["Enums"]["cosmetic_type"]
        }
        Insert: {
          bonus?: string | null
          created_at?: string
          icon?: string | null
          id?: number
          in_shop?: string | null
          name_key: string
          type?: Database["public"]["Enums"]["cosmetic_type"]
        }
        Update: {
          bonus?: string | null
          created_at?: string
          icon?: string | null
          id?: number
          in_shop?: string | null
          name_key?: string
          type?: Database["public"]["Enums"]["cosmetic_type"]
        }
        Relationships: []
      }
      crews: {
        Row: {
          capacity: number
          cost: number
          cost_marks: number
          created_at: string
          damage: number
          description: string | null
          effect: string | null
          effect_per_boarding: string | null
          effect_per_sailor: string | null
          health: number
          icon: string | null
          id: string
          name: string
          options: Database["public"]["Enums"]["crew_options"]
          pvp_relevant: boolean
          type: Database["public"]["Enums"]["crew_type"]
        }
        Insert: {
          capacity?: number
          cost?: number
          cost_marks?: number
          created_at?: string
          damage?: number
          description?: string | null
          effect?: string | null
          effect_per_boarding?: string | null
          effect_per_sailor?: string | null
          health?: number
          icon?: string | null
          id: string
          name: string
          options?: Database["public"]["Enums"]["crew_options"]
          pvp_relevant?: boolean
          type: Database["public"]["Enums"]["crew_type"]
        }
        Update: {
          capacity?: number
          cost?: number
          cost_marks?: number
          created_at?: string
          damage?: number
          description?: string | null
          effect?: string | null
          effect_per_boarding?: string | null
          effect_per_sailor?: string | null
          health?: number
          icon?: string | null
          id?: string
          name?: string
          options?: Database["public"]["Enums"]["crew_options"]
          pvp_relevant?: boolean
          type?: Database["public"]["Enums"]["crew_type"]
        }
        Relationships: []
      }
      guilds: {
        Row: {
          faction: Database["public"]["Enums"]["faction"]
          id: number
          name_key: string
          place: Database["public"]["Enums"]["guild_place"]
          reward: number
        }
        Insert: {
          faction: Database["public"]["Enums"]["faction"]
          id?: number
          name_key: string
          place: Database["public"]["Enums"]["guild_place"]
          reward: number
        }
        Update: {
          faction?: Database["public"]["Enums"]["faction"]
          id?: number
          name_key?: string
          place?: Database["public"]["Enums"]["guild_place"]
          reward?: number
        }
        Relationships: []
      }
      kegs: {
        Row: {
          cost_gold: number
          cost_marks: number
          cost_skulls: number
          count: number
          created_at: string
          crew_usage: number
          damage: number
          damage_radius: number
          description: string | null
          icon: string | null
          id: string
          is_rare: boolean
          mass: number
          name: string
          notes: string | null
          reload: number
          trigger_radius: number
        }
        Insert: {
          cost_gold?: number
          cost_marks?: number
          cost_skulls?: number
          count?: number
          created_at?: string
          crew_usage?: number
          damage?: number
          damage_radius?: number
          description?: string | null
          icon?: string | null
          id: string
          is_rare?: boolean
          mass?: number
          name: string
          notes?: string | null
          reload?: number
          trigger_radius?: number
        }
        Update: {
          cost_gold?: number
          cost_marks?: number
          cost_skulls?: number
          count?: number
          created_at?: string
          crew_usage?: number
          damage?: number
          damage_radius?: number
          description?: string | null
          icon?: string | null
          id?: string
          is_rare?: boolean
          mass?: number
          name?: string
          notes?: string | null
          reload?: number
          trigger_radius?: number
        }
        Relationships: []
      }
      localization: {
        Row: {
          category: string | null
          id: number
          key: string
          language: string
          value: string
        }
        Insert: {
          category?: string | null
          id?: number
          key: string
          language?: string
          value: string
        }
        Update: {
          category?: string | null
          id?: number
          key?: string
          language?: string
          value?: string
        }
        Relationships: []
      }
      ports: {
        Row: {
          build_ranks: number
          created_at: string
          fixed_level: number
          flags: string | null
          id: string
          name: string
          produced_resource: string | null
          team_limit: number | null
          type: Database["public"]["Enums"]["port_type"]
        }
        Insert: {
          build_ranks?: number
          created_at?: string
          fixed_level?: number
          flags?: string | null
          id: string
          name: string
          produced_resource?: string | null
          team_limit?: number | null
          type: Database["public"]["Enums"]["port_type"]
        }
        Update: {
          build_ranks?: number
          created_at?: string
          fixed_level?: number
          flags?: string | null
          id?: string
          name?: string
          produced_resource?: string | null
          team_limit?: number | null
          type?: Database["public"]["Enums"]["port_type"]
        }
        Relationships: []
      }
      ranks: {
        Row: {
          rank: number
          xp_required: number
        }
        Insert: {
          rank: number
          xp_required: number
        }
        Update: {
          rank?: number
          xp_required?: number
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: Database["public"]["Enums"]["resource_category"]
          corruption: number
          created_at: string
          description: string | null
          effects: string | null
          icon: string | null
          id: string
          is_food: boolean
          is_tradeable: boolean
          mass: number
          medium_cost: number
          name: string
          status: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["resource_category"]
          corruption?: number
          created_at?: string
          description?: string | null
          effects?: string | null
          icon?: string | null
          id: string
          is_food?: boolean
          is_tradeable?: boolean
          mass?: number
          medium_cost?: number
          name: string
          status?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["resource_category"]
          corruption?: number
          created_at?: string
          description?: string | null
          effects?: string | null
          icon?: string | null
          id?: string
          is_food?: boolean
          is_tradeable?: boolean
          mass?: number
          medium_cost?: number
          name?: string
          status?: string
        }
        Relationships: []
      }
      ships: {
        Row: {
          arm_bow: number
          arm_falconet: number
          arm_mortar: number
          arm_side: number
          arm_side_total: number
          arm_special: number
          arm_stern: number
          armor: number
          bow_figure: string | null
          cargo: number
          cost_gold: number
          cost_premium: number
          created_at: string
          crew_slots: number
          description: string | null
          faction: Database["public"]["Enums"]["faction"]
          health: number
          hitbox_center: number[] | null
          hitbox_size: number[] | null
          icon: string | null
          id: number
          is_npc_usable: boolean
          is_playable: boolean
          is_vehicle: boolean
          mobility: number
          model: string | null
          name: string
          name_key: string | null
          physics_waterline: number | null
          physics_weight: number | null
          pvp_role: string | null
          rank: number
          rarity: Database["public"]["Enums"]["rarity"]
          required_rank: number
          speed: number
          static_id: number
          subtype: string | null
          tier: number
          type: Database["public"]["Enums"]["ship_type"]
          upgrade_slots: number
        }
        Insert: {
          arm_bow?: number
          arm_falconet?: number
          arm_mortar?: number
          arm_side?: number
          arm_side_total?: number
          arm_special?: number
          arm_stern?: number
          armor: number
          bow_figure?: string | null
          cargo: number
          cost_gold?: number
          cost_premium?: number
          created_at?: string
          crew_slots: number
          description?: string | null
          faction?: Database["public"]["Enums"]["faction"]
          health: number
          hitbox_center?: number[] | null
          hitbox_size?: number[] | null
          icon?: string | null
          id: number
          is_npc_usable?: boolean
          is_playable?: boolean
          is_vehicle?: boolean
          mobility: number
          model?: string | null
          name: string
          name_key?: string | null
          physics_waterline?: number | null
          physics_weight?: number | null
          pvp_role?: string | null
          rank: number
          rarity?: Database["public"]["Enums"]["rarity"]
          required_rank?: number
          speed: number
          static_id: number
          subtype?: string | null
          tier: number
          type: Database["public"]["Enums"]["ship_type"]
          upgrade_slots?: number
        }
        Update: {
          arm_bow?: number
          arm_falconet?: number
          arm_mortar?: number
          arm_side?: number
          arm_side_total?: number
          arm_special?: number
          arm_stern?: number
          armor?: number
          bow_figure?: string | null
          cargo?: number
          cost_gold?: number
          cost_premium?: number
          created_at?: string
          crew_slots?: number
          description?: string | null
          faction?: Database["public"]["Enums"]["faction"]
          health?: number
          hitbox_center?: number[] | null
          hitbox_size?: number[] | null
          icon?: string | null
          id?: number
          is_npc_usable?: boolean
          is_playable?: boolean
          is_vehicle?: boolean
          mobility?: number
          model?: string | null
          name?: string
          name_key?: string | null
          physics_waterline?: number | null
          physics_weight?: number | null
          pvp_role?: string | null
          rank?: number
          rarity?: Database["public"]["Enums"]["rarity"]
          required_rank?: number
          speed?: number
          static_id?: number
          subtype?: string | null
          tier?: number
          type?: Database["public"]["Enums"]["ship_type"]
          upgrade_slots?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: Database["public"]["Enums"]["skill_category"]
          cost: string | null
          cost_points: number
          created_at: string
          depends_on: string | null
          description: string | null
          effect: string | null
          icon: string | null
          id: string
          name: string
          position: string | null
          pvp_relevant: boolean
          radial_position: string | null
          required_achievements: string | null
          required_rank: string | null
          required_ships: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["skill_category"]
          cost?: string | null
          cost_points?: number
          created_at?: string
          depends_on?: string | null
          description?: string | null
          effect?: string | null
          icon?: string | null
          id: string
          name: string
          position?: string | null
          pvp_relevant?: boolean
          radial_position?: string | null
          required_achievements?: string | null
          required_rank?: string | null
          required_ships?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["skill_category"]
          cost?: string | null
          cost_points?: number
          created_at?: string
          depends_on?: string | null
          description?: string | null
          effect?: string | null
          icon?: string | null
          id?: string
          name?: string
          position?: string | null
          pvp_relevant?: boolean
          radial_position?: string | null
          required_achievements?: string | null
          required_rank?: string | null
          required_ships?: string | null
        }
        Relationships: []
      }
      swivel_ammo: {
        Row: {
          cost: number
          created_at: string
          crew_damage: number
          damage_factor: number
          description: string | null
          distance_factor: number
          effects: string | null
          icon: string | null
          id: string
          index: number
          is_rare: boolean
          mass: number
          min_damage: number
          name: string
          notes: string | null
          penetration: number
          radius: number
          reload_factor: number
          sail_damage: number
          speed: number
        }
        Insert: {
          cost?: number
          created_at?: string
          crew_damage?: number
          damage_factor?: number
          description?: string | null
          distance_factor?: number
          effects?: string | null
          icon?: string | null
          id: string
          index: number
          is_rare?: boolean
          mass?: number
          min_damage?: number
          name: string
          notes?: string | null
          penetration?: number
          radius?: number
          reload_factor?: number
          sail_damage?: number
          speed?: number
        }
        Update: {
          cost?: number
          created_at?: string
          crew_damage?: number
          damage_factor?: number
          description?: string | null
          distance_factor?: number
          effects?: string | null
          icon?: string | null
          id?: string
          index?: number
          is_rare?: boolean
          mass?: number
          min_damage?: number
          name?: string
          notes?: string | null
          penetration?: number
          radius?: number
          reload_factor?: number
          sail_damage?: number
          speed?: number
        }
        Relationships: []
      }
      upgrades: {
        Row: {
          category: Database["public"]["Enums"]["upgrade_category"]
          cost: boolean
          craft_resource: string | null
          created_at: string
          description: string | null
          effects: string | null
          icon: string | null
          id: string
          name: string
          parsed_effects: Json | null
          strength: boolean
          wear_type: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["upgrade_category"]
          cost?: boolean
          craft_resource?: string | null
          created_at?: string
          description?: string | null
          effects?: string | null
          icon?: string | null
          id: string
          name: string
          parsed_effects?: Json | null
          strength?: boolean
          wear_type?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["upgrade_category"]
          cost?: boolean
          craft_resource?: string | null
          created_at?: string
          description?: string | null
          effects?: string | null
          icon?: string | null
          id?: string
          name?: string
          parsed_effects?: Json | null
          strength?: boolean
          wear_type?: string | null
        }
        Relationships: []
      }
      weapons: {
        Row: {
          angle: number
          category: Database["public"]["Enums"]["weapon_category"]
          cooldown: number
          crafting_type: Database["public"]["Enums"]["crafting_type"]
          created_at: string
          distance: number
          icon: string | null
          id: string
          material: string | null
          model: string | null
          name: string
          penetration: number
          price: number
          scatter: number
          size_class: Database["public"]["Enums"]["weapon_size"]
          speed_factor: number
          tier: number
          weapon_class: string
        }
        Insert: {
          angle?: number
          category: Database["public"]["Enums"]["weapon_category"]
          cooldown: number
          crafting_type?: Database["public"]["Enums"]["crafting_type"]
          created_at?: string
          distance: number
          icon?: string | null
          id: string
          material?: string | null
          model?: string | null
          name: string
          penetration: number
          price?: number
          scatter?: number
          size_class: Database["public"]["Enums"]["weapon_size"]
          speed_factor?: number
          tier?: number
          weapon_class: string
        }
        Update: {
          angle?: number
          category?: Database["public"]["Enums"]["weapon_category"]
          cooldown?: number
          crafting_type?: Database["public"]["Enums"]["crafting_type"]
          created_at?: string
          distance?: number
          icon?: string | null
          id?: string
          material?: string | null
          model?: string | null
          name?: string
          penetration?: number
          price?: number
          scatter?: number
          size_class?: Database["public"]["Enums"]["weapon_size"]
          speed_factor?: number
          tier?: number
          weapon_class?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_category:
        | "Battle"
        | "Arena"
        | "Top"
        | "Collection"
        | "Trade"
        | "Other"
      archetype: "brawler" | "kite" | "sniper" | "pursuit" | "trade" | "siege"
      consumable_category: "mending" | "equipment" | "group"
      cosmetic_type: "design" | "sail" | "flag" | "guild" | "private"
      crafting_type:
        | "ByGold"
        | "ByCraft"
        | "NotAvailable"
        | "ByMarks"
        | "ByResources"
      crew_options:
        | "All"
        | "Combats"
        | "Sailors"
        | "Pirates"
        | "Adventurers"
        | "BoardingOnly"
        | "SailorOnly"
      crew_type: "Sailor" | "Boarding" | "Special"
      faction:
        | "None"
        | "Antilia"
        | "Empire"
        | "Espaniol"
        | "KaiAndSeveria"
        | "Scandinavia"
        | "Pirates"
        | "TradeUnion"
        | "Pirate"
      guild_place: "Gold" | "Silver" | "Bronze" | "Copper"
      port_type: "PirateBay" | "NeutralBay" | "Bay" | "City"
      rarity:
        | "Default"
        | "Unique"
        | "Elite"
        | "Rare"
        | "Empire"
        | "SailageLegend"
      resource_category: "trade" | "food" | "material" | "special"
      ship_class:
        | "Combat"
        | "Fast"
        | "Heavy"
        | "Transport"
        | "Siege"
        | "Imperial"
      ship_type:
        | "Destroyer"
        | "Battleship"
        | "Hardship"
        | "CargoShip"
        | "Mortar"
      skill_category: "economy" | "logistics" | "combat" | "legend"
      upgrade_category:
        | "Support"
        | "Protection"
        | "Combat"
        | "Speed"
        | "Mortars"
        | "PvP"
        | "Sailes"
        | "Modification"
      weapon_category:
        | "Cannon"
        | "Culverin"
        | "Carronade"
        | "Bombard"
        | "Mortar"
      weapon_size: "Light" | "Medium" | "Heavy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "Battle",
        "Arena",
        "Top",
        "Collection",
        "Trade",
        "Other",
      ],
      archetype: ["brawler", "kite", "sniper", "pursuit", "trade", "siege"],
      consumable_category: ["mending", "equipment", "group"],
      cosmetic_type: ["design", "sail", "flag", "guild", "private"],
      crafting_type: [
        "ByGold",
        "ByCraft",
        "NotAvailable",
        "ByMarks",
        "ByResources",
      ],
      crew_options: [
        "All",
        "Combats",
        "Sailors",
        "Pirates",
        "Adventurers",
        "BoardingOnly",
        "SailorOnly",
      ],
      crew_type: ["Sailor", "Boarding", "Special"],
      faction: [
        "None",
        "Antilia",
        "Empire",
        "Espaniol",
        "KaiAndSeveria",
        "Scandinavia",
        "Pirates",
        "TradeUnion",
        "Pirate",
      ],
      guild_place: ["Gold", "Silver", "Bronze", "Copper"],
      port_type: ["PirateBay", "NeutralBay", "Bay", "City"],
      rarity: ["Default", "Unique", "Elite", "Rare", "Empire", "SailageLegend"],
      resource_category: ["trade", "food", "material", "special"],
      ship_class: ["Combat", "Fast", "Heavy", "Transport", "Siege", "Imperial"],
      ship_type: ["Destroyer", "Battleship", "Hardship", "CargoShip", "Mortar"],
      skill_category: ["economy", "logistics", "combat", "legend"],
      upgrade_category: [
        "Support",
        "Protection",
        "Combat",
        "Speed",
        "Mortars",
        "PvP",
        "Sailes",
        "Modification",
      ],
      weapon_category: ["Cannon", "Culverin", "Carronade", "Bombard", "Mortar"],
      weapon_size: ["Light", "Medium", "Heavy"],
    },
  },
} as const

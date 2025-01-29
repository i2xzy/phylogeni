export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clades: {
        Row: {
          created_at: string;
          description: string | null;
          extant: boolean | null;
          id: string;
          modified: string | null;
          name: string;
          other_names: string | null;
          parent: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          extant?: boolean | null;
          id: string;
          modified?: string | null;
          name: string;
          other_names?: string | null;
          parent?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          extant?: boolean | null;
          id?: string;
          modified?: string | null;
          name?: string;
          other_names?: string | null;
          parent?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          legacy_id: string | null;
          role: Database['public']['Enums']['role'] | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          legacy_id?: string | null;
          role?: Database['public']['Enums']['role'] | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          legacy_id?: string | null;
          role?: Database['public']['Enums']['role'] | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      taxa: {
        Row: {
          common_names: string[] | null;
          created_at: string;
          extant: boolean | null;
          id: number;
          name: string;
          parent_id: number | null;
          rank: string | null;
        };
        Insert: {
          common_names?: string[] | null;
          created_at?: string;
          extant?: boolean | null;
          id?: number;
          name?: string;
          parent_id?: number | null;
          rank?: string | null;
        };
        Update: {
          common_names?: string[] | null;
          created_at?: string;
          extant?: boolean | null;
          id?: number;
          name?: string;
          parent_id?: number | null;
          rank?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'taxa_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'taxa';
            referencedColumns: ['id'];
          },
        ];
      };
      transactions_old: {
        Row: {
          after: Json | null;
          before: Json | null;
          created: string | null;
          id: string;
          identifier: string | null;
          mode: Database['public']['Enums']['transaction_mode'];
          status: Database['public']['Enums']['transaction_status'];
          user: string;
        };
        Insert: {
          after?: Json | null;
          before?: Json | null;
          created?: string | null;
          id: string;
          identifier?: string | null;
          mode: Database['public']['Enums']['transaction_mode'];
          status?: Database['public']['Enums']['transaction_status'];
          user: string;
        };
        Update: {
          after?: Json | null;
          before?: Json | null;
          created?: string | null;
          id?: string;
          identifier?: string | null;
          mode?: Database['public']['Enums']['transaction_mode'];
          status?: Database['public']['Enums']['transaction_status'];
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_old_user_fkey';
            columns: ['user'];
            isOneToOne: false;
            referencedRelation: 'users_old';
            referencedColumns: ['id'];
          },
        ];
      };
      users_old: {
        Row: {
          coverLetter: string | null;
          created: string | null;
          email: string | null;
          firstName: string | null;
          id: string;
          isActive: boolean | null;
          isConfirmed: boolean | null;
          lastName: string | null;
          modified: string | null;
          role: string | null;
          subscribed: boolean | null;
          title: string | null;
          username: string | null;
        };
        Insert: {
          coverLetter?: string | null;
          created?: string | null;
          email?: string | null;
          firstName?: string | null;
          id: string;
          isActive?: boolean | null;
          isConfirmed?: boolean | null;
          lastName?: string | null;
          modified?: string | null;
          role?: string | null;
          subscribed?: boolean | null;
          title?: string | null;
          username?: string | null;
        };
        Update: {
          coverLetter?: string | null;
          created?: string | null;
          email?: string | null;
          firstName?: string | null;
          id?: string;
          isActive?: boolean | null;
          isConfirmed?: boolean | null;
          lastName?: string | null;
          modified?: string | null;
          role?: string | null;
          subscribed?: boolean | null;
          title?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fetch_subtree: {
        Args: {
          root_id: number;
        };
        Returns: {
          id: number;
          name: string;
          parent_id: number;
          level: number;
        }[];
      };
      get_clade_details: {
        Args: {
          clade_id: string;
        };
        Returns: Json;
      };
      get_clades_tree: {
        Args: {
          node_id: string;
          depth: number;
        };
        Returns: Json;
      };
      get_taxa_tree: {
        Args: {
          node_id: number;
          depth: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      role: 'viewer' | 'editor' | 'curator' | 'admin';
      transaction_mode: 'CREATE' | 'DESTROY' | 'UPDATE';
      transaction_status: 'DONE' | 'FAILED' | 'REVIEW';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

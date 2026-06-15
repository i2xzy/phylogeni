export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      clade_revisions: {
        Row: {
          after: Json | null;
          before: Json | null;
          changed_fields: string[];
          clade_id: number | null;
          created_at: string;
          id: number;
          mode: Database['public']['Enums']['revision_mode'];
          summary: string | null;
          target_clade_id: number | null;
          user_id: string | null;
        };
        Insert: {
          after?: Json | null;
          before?: Json | null;
          changed_fields?: string[];
          clade_id?: number | null;
          created_at?: string;
          id?: never;
          mode: Database['public']['Enums']['revision_mode'];
          summary?: string | null;
          target_clade_id?: number | null;
          user_id?: string | null;
        };
        Update: {
          after?: Json | null;
          before?: Json | null;
          changed_fields?: string[];
          clade_id?: number | null;
          created_at?: string;
          id?: never;
          mode?: Database['public']['Enums']['revision_mode'];
          summary?: string | null;
          target_clade_id?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'clade_revisions_clade_id_fkey';
            columns: ['clade_id'];
            isOneToOne: false;
            referencedRelation: 'taxa';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'clade_revisions_target_clade_id_fkey';
            columns: ['target_clade_id'];
            isOneToOne: false;
            referencedRelation: 'taxa';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'clade_revisions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      clade_transactions: {
        Row: {
          after: Json | null;
          before: Json | null;
          created: string | null;
          id: string | null;
          identifier: string | null;
          mode: Database['public']['Enums']['transaction_mode'] | null;
          status: Database['public']['Enums']['transaction_status'] | null;
          user: string | null;
        };
        Insert: {
          after?: Json | null;
          before?: Json | null;
          created?: string | null;
          id?: string | null;
          identifier?: string | null;
          mode?: Database['public']['Enums']['transaction_mode'] | null;
          status?: Database['public']['Enums']['transaction_status'] | null;
          user?: string | null;
        };
        Update: {
          after?: Json | null;
          before?: Json | null;
          created?: string | null;
          id?: string | null;
          identifier?: string | null;
          mode?: Database['public']['Enums']['transaction_mode'] | null;
          status?: Database['public']['Enums']['transaction_status'] | null;
          user?: string | null;
        };
        Relationships: [];
      };
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
      contact_messages: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          email: string;
          handled_at: string | null;
          handled_by: string | null;
          id: number;
          message: string;
          name: string;
          status: Database['public']['Enums']['contact_status'];
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          email: string;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: never;
          message: string;
          name: string;
          status?: Database['public']['Enums']['contact_status'];
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          email?: string;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: never;
          message?: string;
          name?: string;
          status?: Database['public']['Enums']['contact_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'contact_messages_handled_by_fkey';
            columns: ['handled_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
          legacy_mongo_id: string | null;
          name: string;
          parent_id: number | null;
          rank: string | null;
        };
        Insert: {
          common_names?: string[] | null;
          created_at?: string;
          extant?: boolean | null;
          id?: number;
          legacy_mongo_id?: string | null;
          name?: string;
          parent_id?: number | null;
          rank?: string | null;
        };
        Update: {
          common_names?: string[] | null;
          created_at?: string;
          extant?: boolean | null;
          id?: number;
          legacy_mongo_id?: string | null;
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
      delete_clade: { Args: { p_clade_id: number }; Returns: undefined };
      fetch_subtree: {
        Args: { root_id: number };
        Returns: {
          id: number;
          level: number;
          name: string;
          parent_id: number;
        }[];
      };
      get_clade_details: { Args: { clade_id: number }; Returns: Json };
      get_clades_tree: {
        Args: { depth: number; node_id: string };
        Returns: Json;
      };
      get_taxa_tree: {
        Args: { depth: number; node_id: number };
        Returns: Json;
      };
    };
    Enums: {
      contact_status: 'new' | 'in_progress' | 'resolved';
      revision_mode: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE' | 'MERGE';
      role: 'viewer' | 'editor' | 'curator' | 'admin';
      transaction_mode: 'CREATE' | 'DESTROY' | 'UPDATE';
      transaction_status: 'DONE' | 'FAILED' | 'REVIEW';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      contact_status: ['new', 'in_progress', 'resolved'],
      revision_mode: ['CREATE', 'UPDATE', 'DELETE', 'MOVE', 'MERGE'],
      role: ['viewer', 'editor', 'curator', 'admin'],
      transaction_mode: ['CREATE', 'DESTROY', 'UPDATE'],
      transaction_status: ['DONE', 'FAILED', 'REVIEW'],
    },
  },
} as const;

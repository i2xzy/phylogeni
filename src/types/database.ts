import { Database } from './supabase';

export type Status = Database['public']['Enums']['transaction_status'];

export type Mode = Database['public']['Enums']['transaction_mode'];

//export type Clade = Database['public']['Tables']['clades']['Row'];

export type Clade = {
  created: string;
  description: string | null;
  extant: boolean | null;
  id: string;
  modified: string | null;
  name: string;
  otherNames: string | null;
  parent: string | null;
};

export type User = Database['public']['Tables']['users_old']['Row'];

export type Transaction =
  Database['public']['Tables']['transactions_old']['Row'] & {
    before: Partial<Clade> | null;
    after: Partial<Clade> | null;
    mode: Mode;
    status: Status;
  };

export interface TransactionWithUser extends Omit<Transaction, 'user'> {
  user: Pick<User, 'id' | 'username'> | null;
}

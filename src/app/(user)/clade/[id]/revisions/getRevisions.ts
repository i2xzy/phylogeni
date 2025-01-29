import { QueryData } from '@supabase/supabase-js';
import { createClient } from '~/lib/utils/supabase/server';
import { TransactionWithUser } from '~/types/database';

const getRevisions = async (id: string): Promise<TransactionWithUser[]> => {
  const supabase = await createClient();

  const transactionsWithUsersQuery = supabase
    .from('transactions_old')
    .select(
      `
    *,
    users_old (id, username)`
    )
    .eq('identifier', id);

  type TransactionsWithUsers = QueryData<typeof transactionsWithUsersQuery>;

  const { data, error } = await transactionsWithUsersQuery;

  if (error) throw error;

  const transactionsWithUsers: TransactionsWithUsers = data;

  console.log(data);

  const txsWithUsers = transactionsWithUsers.map((item) => ({
    ...item,
    user: item.users_old,
  }));

  return txsWithUsers;
};

export default getRevisions;

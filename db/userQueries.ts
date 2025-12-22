export async function getUserByUserId(
  db: any,
  userId: string
) {
  const [rows] = await db.execute(
    'SELECT user_id, status, created_at, updated_at FROM user_account WHERE user_id = ?',
    [userId]
  );
  return rows;
}

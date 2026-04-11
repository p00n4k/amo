import { createHash, timingSafeEqual } from 'node:crypto';
import { getConnection } from '@/lib/db';

type AdminUserRow = {
  id: number;
  username: string;
  password_hash: string;
  display_name: string | null;
  is_active: number;
};

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function safeEqualHex(left: string, right: string) {
  try {
    const leftBuffer = Buffer.from(left, 'hex');
    const rightBuffer = Buffer.from(right, 'hex');

    if (leftBuffer.length === 0 || rightBuffer.length === 0) {
      return false;
    }

    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
  } catch {
    return false;
  }
}

export async function authenticateAdmin(username: string, password: string) {
  const normalizedUsername = username.trim();
  const normalizedPassword = password.trim();

  if (!normalizedUsername || !normalizedPassword) {
    return null;
  }

  let connection: Awaited<ReturnType<typeof getConnection>> | undefined;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `
      SELECT id, username, password_hash, display_name, is_active
      FROM admin_users
      WHERE username = ?
      LIMIT 1
      `,
      [normalizedUsername]
    );

    const admin = (rows as AdminUserRow[])[0];
    if (!admin || admin.is_active !== 1) {
      return null;
    }

    const inputHash = hashPassword(normalizedPassword);
    if (!safeEqualHex(inputHash, admin.password_hash)) {
      return null;
    }

    return {
      id: admin.id,
      username: admin.username,
      displayName: admin.display_name,
    };
  } finally {
    await connection?.end();
  }
}

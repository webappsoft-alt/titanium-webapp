import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { useDB } from '@/lib/store/db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-key');

export async function login(email, password) {
  const { users } = useDB.getState();
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
    },
    token,
  };
}

export async function verifyToken(token) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch {
    throw new Error('Invalid token');
  }
}
export function validatePassword(password) {
  return password === 'password123';
}

export function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateToken() {
  return `token_${Math.random().toString(36).substr(2, 9)}`;
}
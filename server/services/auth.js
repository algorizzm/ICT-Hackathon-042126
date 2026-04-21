const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
  return crypto
    .scryptSync(password, salt, 64)
    .toString('hex');
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function register({ name, email, password }) {
  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.find(u => u.email === normalizedEmail)) {
    return { error: 'An account with that email already exists.' };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const token = crypto.randomBytes(24).toString('hex');

  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    salt,
    passwordHash,
    token,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  return { user: publicUser(user), token };
}

function login({ email, password }) {
  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const users = readUsers();
  const user = users.find(u => u.email === normalizeEmail(email));

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const candidateHash = hashPassword(password, user.salt);
  const ok =
    candidateHash.length === user.passwordHash.length &&
    crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(user.passwordHash, 'hex'));

  if (!ok) {
    return { error: 'Invalid email or password.' };
  }

  const token = crypto.randomBytes(24).toString('hex');
  user.token = token;
  writeUsers(users);

  return { user: publicUser(user), token };
}

module.exports = { register, login };
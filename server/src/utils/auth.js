import crypto from 'node:crypto';

const tokenSecret = () => process.env.JWT_SECRET || 'mediazy-local-dev-secret-change-me';
const tokenTtlMs = () => Number(process.env.AUTH_TOKEN_TTL_HOURS || 24) * 60 * 60 * 1000;

const base64Url = (value) => Buffer.from(value).toString('base64url');

const sign = (value) => (
  crypto.createHmac('sha256', tokenSecret()).update(value).digest('base64url')
);

export const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { passwordHash, passwordSalt: salt };
};

export const verifyPassword = (password, user) => {
  const { passwordHash } = hashPassword(password, user.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(passwordHash, 'hex'), Buffer.from(user.passwordHash, 'hex'));
};

export const createToken = (user) => {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    sub: String(user._id),
    email: user.email,
    name: user.name,
    exp: Date.now() + tokenTtlMs()
  }));
  const signature = sign(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
};

export const verifyToken = (token) => {
  const [header, payload, signature] = token.split('.');

  if (!header || !payload || !signature) return null;

  const expected = sign(`${header}.${payload}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  return decoded.exp > Date.now() ? decoded : null;
};

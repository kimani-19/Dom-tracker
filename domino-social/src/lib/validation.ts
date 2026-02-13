export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function validateUsername(usernameRaw: string) {
  const username = normalizeUsername(usernameRaw);
  if (!username) return { ok: false as const, message: "Username is required." };
  if (username.length < 3 || username.length > 20)
    return {
      ok: false as const,
      message: "Username must be 3–20 characters.",
    };
  if (!/^[a-z0-9_]+$/.test(username))
    return {
      ok: false as const,
      message: "Username can only use letters, numbers, and underscores.",
    };
  return { ok: true as const, username };
}

export function validatePassword(password: string) {
  if (!password) return { ok: false as const, message: "Password is required." };
  if (password.length < 8)
    return { ok: false as const, message: "Password must be at least 8 characters." };
  return { ok: true as const };
}

export function validateDisplayName(displayName: string) {
  const name = displayName.trim();
  if (!name) return { ok: false as const, message: "Display name is required." };
  if (name.length > 40)
    return { ok: false as const, message: "Display name is too long." };
  return { ok: true as const, displayName: name };
}

export function validateCommentBody(body: string) {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false as const, message: "Comment cannot be empty." };
  if (trimmed.length > 500)
    return { ok: false as const, message: "Comment is too long." };
  return { ok: true as const, body: trimmed };
}

export function clampInt(value: unknown, min: number, max: number) {
  const numberValue = typeof value === "string" ? Number(value) : (value as number);
  if (!Number.isFinite(numberValue)) return null;
  const intValue = Math.trunc(numberValue);
  if (intValue < min || intValue > max) return null;
  return intValue;
}

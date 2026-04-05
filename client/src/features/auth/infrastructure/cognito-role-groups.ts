const DEFAULT_MANAGED_ROLE_GROUPS = ["admin", "manager", "user"] as const;

export function getManagedRoleGroups(): string[] {
  const rawValue = process.env.COGNITO_ROLE_GROUPS;

  if (!rawValue) {
    return [...DEFAULT_MANAGED_ROLE_GROUPS];
  }

  const parsedGroups = rawValue
    .split(",")
    .map((group) => group.trim().toLowerCase())
    .filter(Boolean);

  return parsedGroups.length
    ? [...new Set(parsedGroups)]
    : [...DEFAULT_MANAGED_ROLE_GROUPS];
}

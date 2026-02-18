import { sqlDB } from "../db/index"

interface ProfileRow {
  key: string
  value: string
  category: string
}

export const loadUserProfile = async (): Promise<string> => {
  const { rows } = await sqlDB.query<ProfileRow>(
    "SELECT key, value, category FROM user_profile ORDER BY category, key"
  )

  if (rows.length === 0) return ""

  const grouped: Record<string, { key: string; value: string }[]> = {}

  for (const row of rows) {
    if (!grouped[row.category]) {
      grouped[row.category] = []
    }
    grouped[row.category].push({ key: row.key, value: row.value })
  }

  const sections = Object.entries(grouped).map(([category, facts]) => {
    const title = `**${category.charAt(0).toUpperCase() + category.slice(1)}**`
    const items = facts.map((f) => `- ${f.key}: ${f.value}`).join("\n")
    return `${title}\n${items}`
  })

  return sections.join("\n\n")
}

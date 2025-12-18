/**
 * Supabase Storage URL utilities
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lewslcexldrbequixxpg.supabase.co';
const BUCKET_NAME = 'game-icons';

/**
 * Get the full URL for an icon stored in Supabase Storage
 * @param path - The relative path to the icon (e.g., 'weapons/cannons/c_bomb1.png')
 * @returns The full public URL or null if path is empty
 */
export function getIconUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Add .png extension if not present
  const finalPath = cleanPath.endsWith('.png') ? cleanPath : `${cleanPath}.png`;

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${finalPath}`;
}

/**
 * Get weapon icon URL
 */
export function getWeaponIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`weapons/cannons/${iconName}`);
}

/**
 * Get ammo icon URL
 */
export function getAmmoIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`ammo/${iconName}`);
}

/**
 * Get keg icon URL
 */
export function getKegIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`kegs/${iconName}`);
}

/**
 * Get crew unit icon URL
 */
export function getCrewIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`crews/${iconName}`);
}

/**
 * Get skill icon URL
 */
export function getSkillIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`skills/${iconName}`);
}

/**
 * Get upgrade icon URL
 */
export function getUpgradeIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`upgrades/${iconName}`);
}

/**
 * Get ship design/cosmetic icon URL
 */
export function getCosmeticIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`cosmetics/designs/${iconName}`);
}

/**
 * Get resource icon URL
 */
export function getResourceIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`resources/${iconName}`);
}

/**
 * Get achievement icon URL
 */
export function getAchievementIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`achievements/${iconName}`);
}

/**
 * Get consumable/powerup icon URL
 */
export function getConsumableIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`consumables/${iconName}`);
}

/**
 * Get faction icon URL
 */
export function getFactionIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`factions/${iconName}`);
}

/**
 * Get swivel/falconet ammo icon URL (same as regular ammo)
 */
export function getSwivelAmmoIconUrl(iconName: string | null | undefined): string | null {
  if (!iconName) return null;
  return getIconUrl(`ammo/${iconName}`);
}

// Icon folder structure in bucket:
// game-icons/
// ├── weapons/cannons/    # Cannon icons
// ├── ammo/               # Ammunition icons
// ├── kegs/               # Powder keg icons
// ├── crews/              # Crew unit icons
// ├── skills/             # Captain skill icons
// ├── upgrades/           # Ship upgrade icons
// ├── cosmetics/designs/  # Ship design icons
// ├── resources/          # Resource icons
// ├── achievements/       # Achievement icons
// ├── consumables/        # Powerup/consumable icons
// ├── factions/           # Faction emblems
// └── misc/               # Other icons (Icons.png, FractionIcons.png)

/* Captain's Cove - Store Exports */
/* Central export point for all stores */

// Data store
export {
  dataStore,
  shipsByClass,
  shipsByTier,
  statBounds,
  pvpCrews,
  pvpSkills,
  combatSkills,
  weaponsByCategory,
  isLoading,
  dataError,
  createShipLookup,
  createWeaponLookup,
  createAmmoLookup
} from './data';

// Filter stores
export {
  shipFilters,
  shipSort,
  filteredShips,
  resetShipFilters,
  weaponFilters,
  weaponSort,
  filteredWeapons,
  resetWeaponFilters,
  crewFilters,
  crewSort,
  filteredCrews,
  resetCrewFilters,
  buildFilters,
  buildSort,
  resetBuildFilters,
  comparisonShipIds,
  addToComparison,
  removeFromComparison,
  clearComparison,
  comparisonShips
} from './filters';

// Builds store
export {
  buildsStore,
  filteredBuilds,
  buildsByArchetype,
  buildCount,
  createEmptyBuild
} from './builds';

// UI stores
export {
  modal,
  toasts,
  selectedShipId,
  selectedWeaponId,
  selectedBuildId,
  selectShip,
  selectWeapon,
  selectBuild,
  shipsViewMode,
  weaponsViewMode,
  buildsViewMode,
  sidebarOpen,
  toggleSidebar,
  closeSidebar,
  openSidebar,
  isMobile,
  theme,
  toggleTheme,
  globalLoading,
  loadingMessage,
  showLoading,
  hideLoading,
  registerShortcut,
  cleanupUI
} from './ui';

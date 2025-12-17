/* Captain's Cove - UI Store */
/* Manages UI state: modals, toasts, selections */

import { writable, derived } from 'svelte/store';
import type { ToastMessage, Ship, Weapon } from '$lib/data/types';

// ═══════════════════════════════════════════════════
// MODAL STATE
// ═══════════════════════════════════════════════════

interface ModalState {
  active: string | null;
  data: unknown;
}

const modalState = writable<ModalState>({
  active: null,
  data: null
});

export const modal = {
  subscribe: modalState.subscribe,

  open(name: string, data?: unknown) {
    modalState.set({ active: name, data });
  },

  close() {
    modalState.set({ active: null, data: null });
  },

  isOpen: derived(modalState, $state => $state.active !== null),
  activeModal: derived(modalState, $state => $state.active),
  modalData: derived(modalState, $state => $state.data)
};

// ═══════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════

const toastStore = writable<ToastMessage[]>([]);

let toastCounter = 0;

export const toasts = {
  subscribe: toastStore.subscribe,

  add(toast: Omit<ToastMessage, 'id'>): string {
    const id = `toast_${++toastCounter}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    };

    toastStore.update(toasts => [...toasts, newToast]);

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toasts.remove(id);
      }, newToast.duration);
    }

    return id;
  },

  remove(id: string) {
    toastStore.update(toasts => toasts.filter(t => t.id !== id));
  },

  clear() {
    toastStore.set([]);
  },

  // Convenience methods
  success(message: string, duration?: number) {
    return this.add({ type: 'success', message, duration });
  },

  error(message: string, duration?: number) {
    return this.add({ type: 'error', message, duration: duration ?? 8000 });
  },

  warning(message: string, duration?: number) {
    return this.add({ type: 'warning', message, duration });
  },

  info(message: string, duration?: number) {
    return this.add({ type: 'info', message, duration });
  }
};

// ═══════════════════════════════════════════════════
// SELECTION STATE
// ═══════════════════════════════════════════════════

export const selectedShipId = writable<number | null>(null);
export const selectedWeaponId = writable<string | null>(null);
export const selectedBuildId = writable<string | null>(null);

export function selectShip(id: number | null) {
  selectedShipId.set(id);
}

export function selectWeapon(id: string | null) {
  selectedWeaponId.set(id);
}

export function selectBuild(id: string | null) {
  selectedBuildId.set(id);
}

// ═══════════════════════════════════════════════════
// VIEW STATE
// ═══════════════════════════════════════════════════

type ViewMode = 'grid' | 'table' | 'list';

export const shipsViewMode = writable<ViewMode>('table');
export const weaponsViewMode = writable<ViewMode>('table');
export const buildsViewMode = writable<ViewMode>('grid');

// ═══════════════════════════════════════════════════
// SIDEBAR STATE
// ═══════════════════════════════════════════════════

export const sidebarOpen = writable<boolean>(false);

export function toggleSidebar() {
  sidebarOpen.update(open => !open);
}

export function closeSidebar() {
  sidebarOpen.set(false);
}

export function openSidebar() {
  sidebarOpen.set(true);
}

// ═══════════════════════════════════════════════════
// MOBILE STATE
// ═══════════════════════════════════════════════════

export const isMobile = writable<boolean>(false);

// Update on resize
if (typeof window !== 'undefined') {
  const updateMobile = () => {
    isMobile.set(window.innerWidth < 768);
  };

  updateMobile();
  window.addEventListener('resize', updateMobile);
}

// ═══════════════════════════════════════════════════
// THEME STATE
// ═══════════════════════════════════════════════════

type Theme = 'dark' | 'light';

const THEME_KEY = 'captains-cove-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  // Default to dark (nautical theme)
  return 'dark';
}

export const theme = writable<Theme>(getInitialTheme());

// Sync with localStorage
theme.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, value);
    document.documentElement.setAttribute('data-theme', value);
  }
});

export function toggleTheme() {
  theme.update(t => t === 'dark' ? 'light' : 'dark');
}

// ═══════════════════════════════════════════════════
// LOADING OVERLAY
// ═══════════════════════════════════════════════════

export const globalLoading = writable<boolean>(false);
export const loadingMessage = writable<string>('Loading...');

export function showLoading(message: string = 'Loading...') {
  loadingMessage.set(message);
  globalLoading.set(true);
}

export function hideLoading() {
  globalLoading.set(false);
}

// ═══════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  handler: () => void;
}

const shortcuts: ShortcutHandler[] = [];

export function registerShortcut(shortcut: ShortcutHandler): () => void {
  shortcuts.push(shortcut);

  // Return unregister function
  return () => {
    const index = shortcuts.indexOf(shortcut);
    if (index > -1) {
      shortcuts.splice(index, 1);
    }
  };
}

// Global keyboard handler
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    // Don't handle if typing in input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;

      if (e.key.toLowerCase() === shortcut.key.toLowerCase() && ctrlMatch && shiftMatch) {
        e.preventDefault();
        shortcut.handler();
        break;
      }
    }
  });
}

// Register escape to close modal
registerShortcut({
  key: 'Escape',
  handler: () => modal.close()
});

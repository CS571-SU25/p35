// src/lib/theme.ts
export function initTheme() {
  const stored = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldDark = stored ? stored === "dark" : systemPrefersDark;
  document.documentElement.classList.toggle("dark", shouldDark);
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

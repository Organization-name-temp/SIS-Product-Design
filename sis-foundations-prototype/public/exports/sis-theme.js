(function (global) {
  "use strict";
  const root = global.document.documentElement;
  const themes = new Set(["light", "dark", "system"]);
  const brands = new Set(["ejust"]);
  function read(key) {
    try { return global.localStorage.getItem(key); } catch { return null; }
  }
  function write(key, value) {
    try { global.localStorage.setItem(key, value); } catch {}
  }
  function initial(attribute, key, valid, fallback) {
    const explicit = root.getAttribute(attribute);
    if (valid.has(explicit)) return explicit;
    const saved = read(key);
    return valid.has(saved) ? saved : fallback;
  }
  root.setAttribute("data-brand", initial("data-brand", "sis.brand", brands, "ejust"));
  root.setAttribute("data-theme", initial("data-theme", "sis.theme", themes, "light"));
  global.SISTheme = Object.freeze({
    setTheme(theme) {
      if (!themes.has(theme)) throw new TypeError("Unknown theme: " + theme);
      root.setAttribute("data-theme", theme);
      write("sis.theme", theme);
      return theme;
    },
    getTheme() { return root.getAttribute("data-theme"); },
    setBrand(brand) {
      if (!brands.has(brand)) throw new TypeError("Unknown brand: " + brand);
      root.setAttribute("data-brand", brand);
      write("sis.brand", brand);
      return brand;
    },
    getBrand() { return root.getAttribute("data-brand"); }
  });
})(globalThis);

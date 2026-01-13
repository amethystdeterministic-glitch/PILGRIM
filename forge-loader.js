let forgeReady = false;

export async function loadForge() {
  if (forgeReady) return true;

  try {
    // wasm-pack generated entry
    const forge = await import("./dist/wasm/forge_web.js");

    if (forge && forge.default) {
      await forge.default();
      forgeReady = true;
      console.log("[FORGE] WASM loaded");
      return true;
    }

    throw new Error("FORGE init missing default export");
  } catch (err) {
    console.error("[FORGE] WASM load failed", err);
    return false;
  }
}

export function isForgeReady() {
  return forgeReady;
}

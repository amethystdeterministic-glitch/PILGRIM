import { openMundo } from "./mundo.wire.js";

export function routeExtend(route) {
  if (route === "mundo") openMundo();
}

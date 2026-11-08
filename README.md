# Occupied Memphis

Playable Chapter 1 demo. Clone this repo and run `npm install`, then `sh startup.sh`.

## Locked art direction

Painted isometric, high oblique, 2:1. Not live 3D. The approved still is not in this repo (binary art was too large for the upload). The playable view in `src/game/render.ts` is still top-down. Build the world to match a painted isometric Memphis street: separate ground and buildings, small figures, screen-relative WASD.

Design doc section 13 (first-person / third-person camera) is obsolete. Do not wire `src/game/world3d/` back in.

Full rules: `attachments/Occupied_Memphis_RPG_Core_Design-1.md`.

The preview OAuth secret in `src/lib/auth/preview.ts` was replaced with a placeholder and is not a real credential.

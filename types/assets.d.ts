// Declarações de tipo para importação estática de imagens (`import logo from "@/public/x.png"`).
// Referencia a mesma declaração que o Next injeta em `next-env.d.ts`, garantindo que o
// `tsc --noEmit` funcione no CI mesmo antes do `next build` (que é quem gera o next-env.d.ts,
// arquivo gitignorado e ausente no checkout limpo).
/// <reference types="next/image-types/global" />

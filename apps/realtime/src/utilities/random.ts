export type Rand = () => number;

export function secureRandom(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return (buffer[0] ?? 0) / 0x1_0000_0000;
}

export function randomInt(max: number, rand: Rand = secureRandom): number {
  return Math.floor(rand() * max);
}

export function pick<T>(list: readonly T[], rand: Rand = secureRandom): T | undefined {
  return list[randomInt(list.length, rand)];
}

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function randomPublicId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let id = "";
  for (const byte of bytes) {
    id += ID_ALPHABET.charAt(byte % ID_ALPHABET.length);
  }
  return id;
}

export type StyleSheet = { [key: string]: React.CSSProperties };

export function createStyle<T extends StyleSheet>(data: T): T {
  return data;
}

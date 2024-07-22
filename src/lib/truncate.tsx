// utils/truncate.ts
export const truncateText = (text: string, wordLimit: number): string => {
  const words = text.split(' ');
  return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
};

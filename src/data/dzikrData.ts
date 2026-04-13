export interface DzikrItem {
  id: number;
  arabic: string;
  latin?: string;
  translation: string;
  source?: string;
  count: number;
  category: string;
  description?: string;
  note?: string;
}

export async function fetchDzikrData(): Promise<DzikrItem[]> {
  const res = await fetch('/api/dzikr');
  if (!res.ok) {
    throw new Error('Failed to fetch dzikr data');
  }
  return res.json();
}

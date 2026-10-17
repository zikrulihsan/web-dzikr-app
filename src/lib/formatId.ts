/** Thousands with dots, the Indonesian way: 12345 → "12.345". */
export const formatId = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

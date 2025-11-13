import { useMemo, useState } from 'react';

export function useSearchFilter(items = [], getField = item => item) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    if (!lowerSearch) return items;
    return items.filter(item =>
      (getField(item) ?? '').toLowerCase().includes(lowerSearch)
    );
  }, [items, search, getField]);

  return { search, setSearch, filteredItems };
}
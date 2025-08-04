import { useEffect, useState } from 'react';

export function useSearchFilter(items = [], getField = item => item) {
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();

        const results = lowerSearch === ''
            ? items
            : items.filter(item =>
                getField(item).toLowerCase().includes(lowerSearch)
            );

        setFilteredItems(prev => {
            if (prev.length === results.length && prev.every((v, i) => v === results[i])) {
                return prev;
            }
            return results;
        });
    }, [search, items, getField]);

    return { search, setSearch, filteredItems };
}
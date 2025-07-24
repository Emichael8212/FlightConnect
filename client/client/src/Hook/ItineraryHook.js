import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '/api';

export default function useListPage(endpoint, weights) {
    const [recommendationItems, setRecommendationItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchItems, 500);
        return () => clearTimeout(debounceRef.current);
    }, [weights]);

    async function fetchItems() {
        setLoading(true);
        try {
            const { data } = await axios.post(`${BASE_URL}/${endpoint}`,
                { weights },
                { withCredentials: true }
            );
            const camel = toCamel(endpoint);
            const list = data[camel] || [];
            setRecommendationItems(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            setRecommendationItems([]);
        }   finally {
            setLoading(false);
        }
    }
    return { recommendationItems, loading };
}

function toCamel(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

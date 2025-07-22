import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '/api';

export default function useListPage(endpoint, weights) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchItems, 500);
        return () => clearTimeout(debounceRef.current);
    }, [weights]);

    // fetch items from the server and update the state with the result
    async function fetchItems() {
        setLoading(true);
        try {
            const { data } = await axios.post(`${BASE_URL}/${endpoint}`,
                { weights },
                { withCredentials: true }
            );
            const list = data[endpoint];
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            setItems([]);
        }   finally {
            setLoading(false);
        }
    }
    return { items, loading };
}

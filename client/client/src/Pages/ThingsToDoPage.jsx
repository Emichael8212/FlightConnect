import { useState } from 'react';
import ListPage from '../Components/ListPage';

export default function HotelPage() {
    const [weights, setWeights] = useState({
        thingsToDoRatingWeight: 0.5,
        thingsToDoReviewWeight: 0.5,
    });

    const handleWeightChange = ({ target: { name, value } }) => {
        setWeights( prevWeights => ({
            ...prevWeights, [name]: parseFloat(value)
        }));
    };

    return (
        <ListPage
            endpoint='things-to-do'
            label='Attractions'
            showPrice={false}
            weights={weights}
            onWeightChange={handleWeightChange}
        />
    );
}

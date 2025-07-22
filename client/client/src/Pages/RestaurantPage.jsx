import { useState } from 'react';
import ListPage from '../Components/ListPage';

export default function HotelPage() {
    const [weights, setWeights] = useState({
        restaurantRatingWeight: 0.5,
        restaurantReviewWeight: 0.5,
    });

    const handleWeightChange = ({ target: { name, value } }) => {
        setWeights( prevWeights => ({
            ...prevWeights, [name]: parseFloat(value)
        }));
    };

    return (
        <ListPage
            endpoint='restaurants'
            label='Restaurants'
            showPrice={false}
            weights={weights}
            onWeightChange={handleWeightChange}
        />
    );
}

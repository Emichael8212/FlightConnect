import { useState } from 'react';
import ListPage from '../Components/ListPage';

export default function HotelPage() {
    const [weights, setWeights] = useState({
        hotelPriceWeight: 0.4,
        hotelRatingWeight: 0.3,
        hotelReviewWeight: 0.3,
    });

    const handleWeightChange = ({ target: { name, value } }) => {
        setWeights( prevWeights => ({
            ...prevWeights, [name]: parseFloat(value)
        }));
    };

    return (
        <ListPage
            endpoint='hotels'
            label='Hotel'
            showPrice={true}
            weights={weights}
            onWeightChange={handleWeightChange}
        />
    );
}

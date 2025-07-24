import ListPage from '../Components/ListPage';
import useWeightsHook from '../Hook/WeightsHook';
import { DEFAULT_HOTEL_WEIGHTS } from '@shared/WeightsConstants';

export default function HotelPage() {
    const [weights, handleWeightChange] = useWeightsHook({
        hotelPriceWeight: DEFAULT_HOTEL_WEIGHTS.hotelPriceWeight,
        hotelRatingWeight: DEFAULT_HOTEL_WEIGHTS.hotelRatingWeight,
        hotelReviewWeight: DEFAULT_HOTEL_WEIGHTS.hotelReviewWeight,
    });

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

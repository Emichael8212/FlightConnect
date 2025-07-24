import ListPage from '../Components/ListPage';
import useWeightsHook from '../Hook/WeightsHook';
import { DEFAULT_RESTAURANT_WEIGHTS } from '@shared/WeightsConstants';

export default function Restaurants() {
    const [weights, handleWeightChange] = useWeightsHook({
        restaurantRatingWeight: DEFAULT_RESTAURANT_WEIGHTS.restaurantRatingWeight,
        restaurantReviewWeight: DEFAULT_RESTAURANT_WEIGHTS.restaurantReviewWeight,
    });

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

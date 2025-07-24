import ListPage from '../Components/ListPage';
import useWeightsHook from '../Hook/WeightsHook';
import { DEFAULT_THINGS_TO_DO_WEIGHTS } from '@shared/WeightsConstants';

export default function ThingsToDo() {
    const [weights, handleWeightChange] = useWeightsHook({
        thingsToDoRatingWeight: DEFAULT_THINGS_TO_DO_WEIGHTS.thingsToDoRatingWeight,
        thingsToDoReviewWeight: DEFAULT_THINGS_TO_DO_WEIGHTS.thingsToDoReviewWeight,
    });

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

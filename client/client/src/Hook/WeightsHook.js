import { useState, useCallback } from 'react';

export default function useWeightsHook(initialWeights) {
    const [currentWeights, setCurrentWeights] = useState(initialWeights);

    const handleWeightChange = useCallback(({ target: { name, value } }) => {
        setCurrentWeights(previousWeights => {
            let newWeightValue = parseFloat(value);
            newWeightValue = clampToRange(newWeightValue);
            const weightDelta = newWeightValue - previousWeights[name];
            if (weightDelta === 0) {
                return previousWeights;
            }
            const otherWeightKeys = Object.keys(previousWeights).filter(key => key !== name);
            const sumOfOtherWeights = otherWeightKeys.reduce((total, key) => total + previousWeights[key], 0);

            const updatedWeights = {...previousWeights, [name]: newWeightValue};

            if (sumOfOtherWeights <= 0) {
                const balancedShareForOthers = (1 - newWeightValue) / otherWeightKeys.length;
                otherWeightKeys.forEach(key => updatedWeights[key] = clampToRange(balancedShareForOthers));
            } else {
                otherWeightKeys.forEach(key => {
                    const weightProportion = previousWeights[key] / sumOfOtherWeights;
                    updatedWeights[key] = clampToRange(previousWeights[key] - weightProportion * weightDelta);
                });
            }
            return updatedWeights;
        });
    }, []);

    return [currentWeights, handleWeightChange, setCurrentWeights];
}

function clampToRange(value) {
    return Math.max(0, Math.min(1, value));
}

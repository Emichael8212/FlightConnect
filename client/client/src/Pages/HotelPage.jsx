// HotelPage.jsx
import { useNavigate } from "react-router-dom";
import ListPage from "../Components/ListPage";
import usePreferences from "../Hook/UserPreferenceHook.js";

export default function HotelPage() {
  const navigate = useNavigate();
  const { weightGroupsMapping } = usePreferences(navigate);
  const { weights, changeHandler: onWeightChange } =
    weightGroupsMapping["Hotel Weights"];

  return (
    <ListPage
      endpoint="hotels"
      label="Hotels"
      showPrice={true}
      weights={weights}
      onWeightChange={onWeightChange}
    />
  );
}

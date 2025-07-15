import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "/api.js";
import axios from "axios";
import "./UserPreference.css";

export default function PreferenceForm() {
  const [preferenceForm, setPreferenceForm] = useState({
    defaultCity: "",
    cuisine: "",
    budgetTier: "",
    activityCategory: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [checkingCity, setCheckingCity] = useState(false);
  const [cityError, setCityError] = useState("");
  const navigate = useNavigate();

  // Load existing preference data
  useEffect(() => {
    const getPreference = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/preference`, {withCredentials: true});
        if (data) {
          setPreferenceForm({
            defaultCity: data.defaultCity  || "",
            cuisine: data.cuisine || "",
            budgetTier: data.budgetTier?.toString() || "",
            activityCategory: data.activityCategory || ""
          });
        }
      } catch (err) {
        console.error('Preference Load Error:', err);
      }
    };
    getPreference();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPreferenceForm(prev =>
    ({...prev, [name]: value})
    );
    // if user changes city input, I'll clear the error message
    if (name === "defaultCity") {
      setCityError("");
    }
  };

  // Validate city input wether it exists in my db
  const validateCity = async () => {
    const cityInputed = preferenceForm.defaultCity.trim();
    if (!cityInputed) {
      setCityError("Please enter a city.");
      return false;
    }
    setCheckingCity(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/preference/exists`,
        {
          params: { defaultCity: cityInputed },
          withCredentials: true
        }
      );
      if (!res.data.exists) {
        setCityError(`Sorry, we don’t have data for “${cityInputed}.”`);
        return false;
      }
      setCityError("");
      return true;
    } catch (err) {
      console.error("City validation error:", err);
      setCityError("Could not verify city. Try again.");
      return false;
    } finally {
      setCheckingCity(false);
    }
  };

  const handlePreferenceSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    // check if the user inputed city is valid
    const cityValid = await validateCity();
    if (!cityValid) {
      setSubmitting(false);
      return;
    }

    try {
      const preferenceLoad = {
        ...preferenceForm,
        budgetTier: Number(preferenceForm.budgetTier),
      };

      await axios.post(`${BASE_URL}/preference`, preferenceLoad,
        {withCredentials: true}
      );
      // After a success in collecting user preference, redirect to the home page
      navigate('/');
    } catch(err) {
      console.error('Preference Submit Error:', err);
    } finally {setSubmitting(false);}
  };

  return (
    <form
      onSubmit={handlePreferenceSubmit}
      className="preferenceForm"
    >
      <h2>Your Travel Preferences</h2>

      <div className="preferenceForm input">
        <label htmlFor="defaultCity" className="defaultCity">Default City</label>
          <input
            id="defaultCity"
            type="text"
            name="defaultCity"
            value={preferenceForm.defaultCity}
            onChange={handleChange}
            onBlur={validateCity}
            placeholder="e.g San Francisco"
            required
          />
          {checkingCity && <span className="loading">Checking...</span>}
          {cityError && <span className="error">{cityError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="budgetTier" className="budgetTier" >Budget Tier</label>
          <select
            id="budgetTier"
            name="budgetTier"
            value={preferenceForm.budgetTier}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">--Select Your Budget--</option>
            <option value="50">Standard (up to $50)</option>
            <option value="100">Moderate (up to $100)</option>
            <option value="200">Premium (up to $200)</option>
            <option value="201">Luxury (above $200)</option>
          </select>
      </div>

      <div className="form-group">
        <label htmlFor="cuisine" className="cusisine" >Cuisine</label>
          <select
            id="cuisine"
            name="cuisine"
            value={preferenceForm.cuisine}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">--Select Your Cuisine--</option>
            <option value="american">American</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="japanese">Japanese</option>
          </select>
      </div>

      <div className="activityCategory">
        <label htmlFor="activityCategory" className="block mb-2">Activity Category</label>
          <select
            id = "activityCategory"
            name="activityCategory"
            value={preferenceForm.activityCategory}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">--Select Your Activity Category--</option>
            <option value="Adventure">Adventure</option>
            <option value="Art">Art</option>
            <option value="Culture">Culture</option>
            <option value="Nightlife">Nightlife</option>
          </select>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Next"}
      </button>
    </form>
  );
}

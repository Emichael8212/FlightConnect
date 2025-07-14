import { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import BASE_URL from "/api.js"
import axios from "axios";
import "./UserPreference.css";

export default function PreferenceForm() {
  const [preferenceForm, setPreferenceForm] = useState({
    defaultCity: "",
    cuisine: "",
    budgetTier: "",
    activityCategory: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
      } finally {setLoading(false);}
    };
    getPreference();
  }, []);

  const handleChange = (event) => {
    setPreferenceForm(prev =>
    ({...prev, [event.target.name]: event.target.value})
    );
  };

  const handlePreferenceSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const preferenceLoad = {
        ...preferenceForm,
        budgetTier: Number(preferenceForm.budgetTier),
      }

      await axios.post(`${BASE_URL}/preference`, preferenceLoad,
        {withCredentials: true}
      );
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
            placeholder="e.g San Francisco"
            required
          />
      </div>

      <div className="budget">
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

      <div className="cuisineDiv">
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

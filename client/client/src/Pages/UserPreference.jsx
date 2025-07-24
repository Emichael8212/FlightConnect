import { useNavigate } from 'react-router-dom';
import './UserPreference.css';
import Spinner from '../Components/Spinner.jsx';
import SliderGroup from '../Components/SliderGroup.jsx';
import SelectGroup from '../Components/SelectGroup.jsx';
import { getImportanceText } from '../utils/utils.js';
import usePreferences from '../Hook/UserPreferenceHook.js';
import Header from '../Components/Header.jsx';
import {
  BUDGET_TIERS,
  CUISINE_OPTIONS,
  ACTIVITY_CATEGORIES,
  SLIDER_GROUPS,
} from '@shared/WeightsConstants';

export default function PreferenceForm() {
  const navigate = useNavigate();
  const {
    basicPreferences,
    handleBasicFieldChange,
    isSubmitting,
    isCheckingCity,
    cityValidationError,
    isFormValid,
    handlePreferenceFormSubmit,
    validateCityInput,
    weightGroupsMapping,
  } = usePreferences(navigate);

  return (
    <div className='preference-container'>
      <Header />
      <div className='preference-layout'>
        <aside className='preference-sliders'>
          {SLIDER_GROUPS.map((group) => {
            const { weights, changeHandler } = weightGroupsMapping[group.title];
            return (
              <SliderGroup
                key={group.title}
                title={group.title}
                items={group.items}
                weights={weights}
                onChange={changeHandler}
                getTextFunction={getImportanceText}
              />
            );
          })}
        </aside>

        <form onSubmit={handlePreferenceFormSubmit} className='preference-form'>
          {isSubmitting && (
            <Spinner overlay={true} text='Submitting your preferences…' />
          )}
          <h2>Your Travel Preferences</h2>

          <div className='preference-form-input'>
            <label htmlFor='default-city'>Default City</label>
            <input
              id='default-city'
              name='defaultCity'
              type='text'
              value={basicPreferences.defaultCity}
              onChange={handleBasicFieldChange}
              onBlur={validateCityInput}
              placeholder='e.g. San Francisco'
              required
            />
            {isCheckingCity && <span className='loading'>Checking…</span>}
            {cityValidationError && (
              <span className='error'>{cityValidationError}</span>
            )}
          </div>

          <SelectGroup
            id='budget-tier'
            name='budgetTier'
            labelText='Budget Tier'
            value={basicPreferences.budgetTier}
            onChange={handleBasicFieldChange}
            options={BUDGET_TIERS}
            placeholder='--Select Your Budget--'
          />

          <SelectGroup
            id='cuisine'
            name='cuisine'
            labelText='Cuisine'
            value={basicPreferences.cuisine}
            onChange={handleBasicFieldChange}
            options={CUISINE_OPTIONS}
            placeholder='--Select Your Cuisine--'
          />

          <SelectGroup
            id='activity-category'
            name='activityCategory'
            labelText='Activity Category'
            value={basicPreferences.activityCategory}
            onChange={handleBasicFieldChange}
            options={ACTIVITY_CATEGORIES}
            placeholder='--Select Your Activity--'
          />

          {isFormValid && (
            <button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Next'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export const DEFAULT_MAIN_WEIGHTS = {
  cityWeight: 0.4,
  budgetWeight: 0.3,
  cuisineWeight: 0.15,
  activityWeight: 0.15,
};

export const DEFAULT_HOTEL_WEIGHTS = {
  hotelPriceWeight: 0.4,
  hotelRatingWeight: 0.3,
  hotelReviewWeight: 0.3,
};

export const DEFAULT_RESTAURANT_WEIGHTS = {
  restaurantRatingWeight: 0.5,
  restaurantReviewWeight: 0.5,
};

export const DEFAULT_THINGS_TO_DO_WEIGHTS = {
  thingsToDoRatingWeight: 0.5,
  thingsToDoReviewWeight: 0.5,
};

export const BUDGET_TIERS = [
  { value: '1', label: 'Standard (up to $50)' },
  { value: '2', label: 'Moderate (up to $100)' },
  { value: '3', label: 'Premium (up to $200)' },
  { value: '4', label: 'Luxury (above $200)' },
];

export const CUISINE_OPTIONS = [
  { value: 'american', label: 'American' },
  { value: 'italian', label: 'Italian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'japanese', label: 'Japanese' },
];

export const ACTIVITY_CATEGORIES = [
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Art', label: 'Art' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Nightlife', label: 'Nightlife' },
];

export const SLIDER_GROUPS = [
  {
    title: 'Main Weights',
    items: [
      { key: 'cityWeight', label: 'City' },
      { key: 'budgetWeight', label: 'Budget' },
      { key: 'cuisineWeight', label: 'Cuisine' },
      { key: 'activityWeight', label: 'Activity' },
    ],
  },
  {
    title: 'Hotel Weights',
    items: [
      { key: 'hotelPriceWeight', label: 'Price Closeness' },
      { key: 'hotelRatingWeight', label: 'Rating' },
      { key: 'hotelReviewWeight', label: 'Popularity' },
    ],
  },
  {
    title: 'Restaurant Weights',
    items: [
      { key: 'restaurantRatingWeight', label: 'Rating' },
      { key: 'restaurantReviewWeight', label: 'Popularity' },
    ],
  },
  {
    title: 'Things To Do Weights',
    items: [
      { key: 'thingsToDoRatingWeight', label: 'Rating' },
      { key: 'thingsToDoReviewWeight', label: 'Popularity' },
    ],
  },
];

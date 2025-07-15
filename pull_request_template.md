## Description
This PR adds a **UserPreference** model and API to store each user’s content-based recommendation “lenses” (budget tier, favorite cuisine, activity category, default city).  
- On successful registration, a new user is redirected to a userPreferences form.  
- Their selections are saved in a one-to-one `userPreference` table in the database.  
- After they submit the form, they’re sent to the Home page.  

These preferences will drive our upcoming itinerary recommendation engine in the next PR.

## Milestones
- Create `UserPreference` Prisma model & migration  
-  Build `/preference` GET, POST, and `/preference/exists` endpoints  
-  Hook up the front-end form and validate “default city” against our DB  
-  Next: consume these preferences to score & serve personalized recommendations

## Resources
- UX discussion on when to capture preferences:  
  https://ux.stackexchange.com/questions/93508/should-we-ask-user-details-preference-before-or-after-sign-up-in-a-mobile-app  

## Test Plan
1. **Flow For New User**  
   - Register new user → redirected to Preferences page → fill form with a valid city → redirect to Home → verify `userPreference` record in DB.  
2. **Edge cases**  
   - Enter blank city: return inline error “Please enter a city.”  
   - Enter city not in the DB: return inline error “Sorry—we don’t have data for {that city}”  
   - Try again after typo: I clear the when user starts tying in a new city.  

Preference Form: [<insert images or gifs of feature>](https://www.loom.com/share/0a45e85258904b36b8e1363cd6247f51?sid=a38e9e9e-37a8-4e0a-b44e-6c25dcc8c9bb)
user preference table: https://www.loom.com/share/8dd350529657491c8031d9ac9fd2b06a?sid=90f23b49-9847-4b5a-8203-71d911c494ee


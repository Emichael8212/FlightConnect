## Description
In this PR branch I created a user preference table with a relation to a user. so each user has a single preference table. 
This user preference table contain lens for the implementation of the content base recommendation. 
So the flow of the app now become new user register on successfully registration is sent to the preference page so I can store the lenses of the recommendation.
then after filling the form, user is sent to the home page

With this I have the user preference in my db. So in my next PR I will match the user preference to the data in my db for itinerary recommendation.

## Milestones
This also works towards the recommendation feature of itinerary for users

## Resources
https://ux.stackexchange.com/questions/93508/should-we-ask-user-details-preference-before-or-after-sign-up-in-a-mobile-app

## Test Plan
[<insert images or gifs of feature>](https://www.loom.com/share/0a45e85258904b36b8e1363cd6247f51?sid=a38e9e9e-37a8-4e0a-b44e-6c25dcc8c9bb)
https://www.loom.com/share/8dd350529657491c8031d9ac9fd2b06a?sid=90f23b49-9847-4b5a-8203-71d911c494ee
I tested an edge case where the city user inputed is not in my DB

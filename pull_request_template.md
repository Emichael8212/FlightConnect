## Description

The Restaurant Scraper PR
This PR introduces the foundational components for managing restaurant data within the system. The key changes include:
Created the Restaurant model to represent restaurant entities in the application.
Added a Prisma table for restaurants to enable structured storage in the database.
Implemented a JavaScript script that reads restaurant data from JSON files and feeds it into the database.
Developed a restaurant scraper to collect restaurant data from external sources.
Added a server run command to automate feeding the scraped restaurant data into the database.
These changes collectively establish the end-to-end pipeline for ingesting, storing, and managing restaurant data.

## what will be done in later PRs and not included here
With this scrapped data in my future PR I'll be developing a recommmendation system based on user preference

## Milestones
This Pr works to complete my Technical Challenge 1

## Resources
The web scrapping browser: https://www.tripadvisor.com/Restaurants-g34438-Miami_Florida.html
<links to tutorials, code snippets, inspirations>
<if you took or translated specific code from the internet, please call it out here!>

## Test Plan
![restaurant table](<img width="1920" height="1080" alt="Screenshot 2025-07-14 at 11 05 37 AM (2)" src="https://github.com/user-attachments/assets/0a22acfd-a576-4f8b-bb4d-796e1f7eaf7b" />
)

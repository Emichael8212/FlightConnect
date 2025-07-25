import random
import re
import time

import requests
from bs4 import BeautifulSoup
from config import BASE_URL, HEADERS, US_HOTELS_URL


def get_soup_parser(page_url: str) -> BeautifulSoup:
    # first I fetch the url and return a BeautifulSoup parser of its HTML.
    response = requests.get(page_url, headers=HEADERS)
    # raises an exception if the status code isn't 200.
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")  # returns a BeautifulSoup parser of the HTML.


# implement a function that takes a slug filters to match the page I want to scrape
def clean_slug(given_slug: str) -> str:
    slug_parts = given_slug.split("-")
    if len(slug_parts) >= 5:
        return "-".join([slug_parts[0], slug_parts[1], slug_parts[-2], slug_parts[-1]])
    return given_slug


# initialize a function that collects
def collect_us_city_slugs(state_href_pattern: str) -> list[str]:
    # initialize a state pattern
    state_regex = re.compile(state_href_pattern)
    invalid_tokens = ("United_States", "oa", "-c", "-zfb", "-zff")

    # get all state links from the US page with the state pattern
    us_soup_parser = get_soup_parser(US_HOTELS_URL)
    state_links = {
        link_element["href"]
        for link_element in us_soup_parser.find_all("a", href=state_regex)
        if not any(token in link_element["href"] for token in invalid_tokens)
    }
    # initialize a set to store the city slugs
    city_slugs = set()
    # loop through each state page
    for state_link in state_links:
        # get the soup parser for the state page
        state_soup_parser = get_soup_parser(BASE_URL + state_link)
        for link_element in state_soup_parser.find_all("a", href=state_regex):
            city_link = link_element["href"]
            if city_link == state_link or any(token in city_link for token in invalid_tokens):
                continue
            raw_slug = city_link.lstrip("/").rsplit(".html", 1)[0]
            # clean the city slug and add to the set
            city_slugs.add(clean_slug(raw_slug))
    # convert the set to a list and return
    return list(city_slugs)

# initialize a function that collects the slugs for the target pages
def generate_slugs_from_hotels(target_prefix: str, middle_part: str) -> list[str]:
    # initialize a pattern to match the hotel page
    hotel_href_pattern = r"^/Hotels-g\d+-[^/]+-Hotels\.html$"
    # now collect the slugs for the hotels and store
    hotel_slugs = collect_us_city_slugs(hotel_href_pattern)
    # initialize a list to store the slugs for the target pages
    target_slugs = []
    for hotel_slug in hotel_slugs:
        # match the hotel slug to the format of the target page
        match_object = re.match(r"Hotels-(g\d+)-(.+)-Hotels$", hotel_slug)
        # if the match fails, continue to the next hotel slug
        if not match_object:
            continue
        # otherwise, extract the group id and city state
        geo_id, city_state = match_object.groups()
        # add the slug for the target page to the list
        target_slugs.append(f"{target_prefix}-{geo_id}{middle_part}-{city_state}")
    return target_slugs

# intialize a function that filters names
def clean_name(raw_name_with_number):
    raw_name = raw_name_with_number.strip()
    cleaned_name = re.sub(r"^\d+\.\s*", "", raw_name)
    return cleaned_name


# initialize a function parse the rating
def clean_rating(rating_strings: str) -> float | None:
    try:
        return float(rating_strings)
    except ValueError:
        return None


# initialize a function to parse the review count
def clean_review_count(review_string: str) -> int | None:
    match_object = re.search(r"(\d[\d,]*)", review_string.replace(",", ""))
    return int(match_object.group(1)) if match_object else None


# initialize a function to parse the price
def clean_price(price_string: str) -> float | None:
    match_object = re.search(r"(\d+\.?\d*)", price_string.replace(",", ""))
    try:
        return float(match_object.group(1)) if match_object else None
    except ValueError:
        return None


# initialize a function to parse to filter the description
def clean_description(description_string: str) -> str | None:
    cleaned_text = description_string.strip()
    return cleaned_text if cleaned_text else None


US_STATES = {
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "District of Columbia",
}


# initialize a function to parse the location from the slug
def parse_location_from_slug(slug: str) -> tuple[str, str]:
    # isolate the token with underscores
    location_token = next((token for token in slug.split("-") if "_" in token), slug)
    token_parts = location_token.split("_")
    # parse to city and state
    for num_words in range(3, 0, -1):
        if len(token_parts) >= num_words:
            state_candidate = " ".join(token_parts[-num_words:]).title()
            if state_candidate in US_STATES:
                city_name = " ".join(token_parts[:-num_words]).title()
                return city_name, state_candidate
    state_name = token_parts[-1].title()
    city_name = " ".join(token_parts[:-1]).title()
    return city_name, state_name

import random
import re
import time

import requests
from bs4 import BeautifulSoup
from config import BASE_URL, HEADERS, US_HOTELS_URL


def get_soup(url: str) -> BeautifulSoup:
    # first I fetch the url and return a BeautifulSoup parser of its HTML.
    resp = requests.get(url, headers=HEADERS)
    # raises an exception if the status code isn't 200.
    resp.raise_for_status()
    return BeautifulSoup(
        resp.text, "html.parser"
    )  # returns a BeautifulSoup parser of the HTML.


# implement a function that takes a slug filters to match the page I want to scrape
def clean_slug(given_slug: str) -> str:
    parts = given_slug.split("-")
    if len(parts) >= 5:
        return "-".join([parts[0], parts[1], parts[-2], parts[-1]])
    return given_slug


# initialize a function that collects
def collect_us_city_slugs(state_pattern: str) -> list[str]:
    # initialize a state pattern
    pattern = re.compile(state_pattern)
    invalid = ("United_States", "oa", "-c", "-zfb", "-zff")

    # get all state links from the US page with the state pattern
    soup_us = get_soup(US_HOTELS_URL)
    state_hrefs = {
        a["href"]
        for a in soup_us.find_all("a", href=pattern)
        if not any(tok in a["href"] for tok in invalid)
    }
    # initialize a set to store the city slugs
    slugs = set()
    # loop through each state page
    for href in state_hrefs:
        soup_st = get_soup(BASE_URL + href)
        # find city links
        for a in soup_st.find_all("a", href=pattern):
            link = a["href"]
            if link == href or any(tok in link for tok in invalid):
                continue
            raw = link.lstrip("/").rsplit(".html", 1)[0]
            # clean the city slug and add to the set
            slugs.add(clean_slug(raw))
    return list(slugs)


# intialize a function that filters names
def clean_name(name_num):
    raw_name = name_num.strip()
    cleaned_name = re.sub(r"^\d+\.\s*", "", raw_name)
    return cleaned_name


# initialize a function parse the rating
def clean_rating(s: str) -> float | None:
    try:
        return float(s)
    except ValueError:
        return None


# initialize a function to parse the review count
def clean_review_count(s: str) -> int | None:
    m = re.search(r"(\d[\d,]*)", s.replace(",", ""))
    return int(m.group(1)) if m else None


# initialize a function to parse the price
def clean_price(s: str) -> float | None:
    m = re.search(r"(\d+\.?\d*)", s.replace(",", ""))
    try:
        return float(m.group(1)) if m else None
    except ValueError:
        return None


# initialize a function to parse to filter the description
def clean_description(s: str) -> str | None:
    text = s.strip()
    return text if text else None


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
    location_token = next((tok for tok in slug.split("-") if "_" in tok), slug)
    parts = location_token.split("_")

    # parse to city and state
    if len(parts) >= 2:
        first_state = " ".join(parts[-2:]).title()
        if sec_state in US_STATES:
            city = " ".join(parts[:-2]).title()
            return city, sec_state

    first_state = parts[-1].title()
    city = " ".join(parts[:-1]).title()
    return city, first_state

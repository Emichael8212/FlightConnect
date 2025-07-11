import json
import os
from typing import Any, List

from config import MAX_CARDS, PAGE_STEP
from scraper_utils import collect_us_city_slugs, get_soup, parse_location_from_slug


class BaseScraper:
    def __init__(
        self,
        name: str,
        slug_pattern: str,
        max_cards: int = MAX_CARDS,
        page_step: int = PAGE_STEP,
        output_dir: str = "output",
    ):
        self.name = name
        self.slug_pattern = slug_pattern  # regex to find relevant TripAdvisor pages
        self.max_cards = max_cards  # how many items max per slug
        self.page_step = page_step  # items per page
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)  # check if my output folder exists

    # collect and return all slugs that match the pattern
    def collect_slugs(self) -> list[str]:
        from scraper_utils import collect_us_city_slugs

        slugs = collect_us_city_slugs(self.slug_pattern)
        return slugs

    # parse out the city and state from the slug
    def parse_slugs(self, slug: str) -> tuple[str, str]:
        # isolate the token with underscores
        location_token = next((t for t in slug.split("-") if "_" in t), slug)
        parts = location_token.split("_")
        # parse to city and state
        city = " ".join(parts[:-1])
        state = parts[-1]
        return city, state

    # construct the URL for a given city slug and page offset
    def page_url(self, slug: str, offset: int) -> str:
        base = f"/{self.name}-{slug}.html"
        return base if offset == 0 else base.replace(".html", f"-oa{offset}.html")

    # finally, I parse the page and return list of records
    def parse_page(self, soup: Any) -> List[dict]:
        # raise an error if not implemented
        raise NotImplementedError("Subclasses must override parse_page()")

    # initialize the function to save the records to a JSON file
    def save(self, records: List[dict], slug: str):
        path = os.path.join(self.output_dir, f"{self.name}_{slug}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)

    # define the function to scrape the data
    def scrape(self):
        # extract all the slugs
        slugs = self.collect_slugs()
        # loop through each slug
        for slug in slugs:
            # initialize a list to store the records
            all_records = []
            # loop through each page and paginate up to max_cards
            for offset in range(0, self.max_cards, self.page_step):
                # construct the URL for the current page
                rel_url = self.page_url(slug, offset)
                full_url = f"https://www.tripadvisor.com{rel_url}"
                soup = get_soup(full_url)
                batch = self.parse_page(soup)
                if not batch:
                    # no more results on this page
                    break
                all_records.extend(batch)
                if len(all_records) >= self.max_cards:
                    break
            # if records, save to a JSON file
            if not all_records:
                continue
                # parse out city and state from slug
            city, state = parse_location_from_slug(slug)
            # add city and state to each record
            for record in all_records:
                record["city"] = city
                record["state"] = state

                if record.get("location") == "Open Now":
                    record["location"] = city

                # 4) now save enriched records
            self.save(all_records, slug)

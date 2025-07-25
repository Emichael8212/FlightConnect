import json
import os
from typing import Any, List

from config import MAX_ITEMS_PER_SLUG, ITEMS_PER_PAGE, BASE_URL
from scraper_utils import collect_us_city_slugs, get_soup_parser, parse_location_from_slug


class BaseScraper:
    def __init__(
        self,
        name: str,
        slug_pattern: str,
        max_items: int = MAX_ITEMS_PER_SLUG,
        page_size: int = ITEMS_PER_PAGE,
        output_dir: str = "output",
    ):
        self.name = name
        self.slug_pattern = slug_pattern  # regex to find relevant TripAdvisor pages
        self.max_items = max_items  # how many items max per slug
        self.page_size = page_size  # items per page
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)  # check if my output folder exists

    # collect and return all slugs that match the pattern
    def collect_slugs(self) -> list[str]:
        return collect_us_city_slugs(self.slug_pattern)

    # construct the URL for a given city slug and page offset
    def page_url(self, slug: str, offset: int) -> str:
        if offset == 0:
            return f"/{slug}.html"
        slug_parts = slug.split("-")
        prefix = "-".join(slug_parts[:-1])
        last_part = slug_parts[-1]
        return f"/{prefix}-oa{offset}-{last_part}.html"

    # parse the page and return a list of records
    def parse_page(self, soup_parser: Any) -> List[dict]:
        raise NotImplementedError("Subclasses must override parse_page()")

    # save the records to a JSON file
    def save_records(self, records: List[dict], slug: str):
        file_path = os.path.join(self.output_dir, f"{self.name}_{slug}.json")
        with open(file_path, "w", encoding="utf-8") as file_handle:
            json.dump(records, file_handle, ensure_ascii=False, indent=2)
    # initialize a function to scrape the pages for a given slug
    def scrape(self):
        # collect the slugs for the pages to scrape
        slugs = self.collect_slugs()
        # scrape each page
        for slug in slugs:
            all_records = []
            for offset in range(0, self.max_items, self.page_size):
                relative_url = self.page_url(slug, offset)
                full_url = f"{BASE_URL}{relative_url}"
                soup_parser = get_soup_parser(full_url)
                batch_records = self.parse_page(soup_parser)
                if not batch_records:
                    break
                all_records.extend(batch_records)
                if len(all_records) >= self.max_items:
                    all_records = all_records[: self.max_items]
                    break
            if not all_records:
                continue
            city_name, state_name = parse_location_from_slug(slug)
            for record in all_records:
                record["city"] = city_name
                record["state"] = state_name
                if record.get("location") == "Open Now":
                    record["location"] = city_name
            self.save_records(all_records, slug)

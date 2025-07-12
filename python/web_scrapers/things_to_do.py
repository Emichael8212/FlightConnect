import re

from config import ATTRACTIONS_OUTPUT_DIR
from scraper_utils import clean_name, clean_rating, clean_review_count

from .base_scraper import BaseScraper


class ThingsToDoScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            name="Attractions", slug_pattern="", output_dir=ATTRACTIONS_OUTPUT_DIR
        )

    # initialize a function to collect slugs for cities and  modify them to match the format of the attractions page scraping
    def collect_slugs(self) -> list[str]:
        from scraper_utils import collect_us_city_slugs

        # initialize a pattern to match the hotel page
        hotel_pattern = r"^/Hotels-g\d+-[^/]+-Hotels\.html$"
        # now collect the slugs for the hotels and store
        hotel_slugs = collect_us_city_slugs(hotel_pattern)

        # initialize a list to store the slugs for the attractions
        attr_slugs = []
        for hslug in hotel_slugs:  # iterate through the hotel slugs
            m = re.match(
                r"Hotels-(g\d+)-(.+)-Hotels$", hslug
            )  # match the hotel slug to the format of the attractions page
            if not m:  # if the match fails
                continue  # continue to the next hotel slug
            gid, city_state = m.groups()  # otherwise, extract the group id and
            attr_slugs.append(f"Attractions-{gid}-Activities-{city_state}")
        return attr_slugs

    def page_url(self, slug: str, offset: int) -> str:

        m = re.match(r"^(Attractions-g\d+-Activities)-(.+)$", slug)
        if not m:
            return super().page_url(slug, offset)

        prefix, city_part = m.groups()
        return f"/{prefix}-oa{offset}-{city_part}.html"

    def parse_page(self, soup):
        # extract name of things to do
        name = [
            h.get_text(strip=True)
            for h in soup.find_all("h3", class_="biGQs _P fiohW OgHoE")
        ]

        # extract description of things to do
        description = []
        for span in soup.find_all("div", {"data-test-target": "gai-summary-card"}):
            raw_desc = span.get_text(strip=True)
            filtered_desc = re.sub(r"(?i)This attraction.*", " ", raw_desc).strip()
            description.append(filtered_desc or None)

        # extract rating of things to do
        rating = [
            span.find("span").get_text(strip=True)
            for span in soup.find_all("div", {"data-automation": "bubbleRatingValue"})
        ]

        # extract image url of things to do
        images = []
        for article in soup.find_all("article", class_="GTuVU XJlaI"):
            first_div = article.find("div", {"data-automation": "photoCarousel"})
            if not first_div:
                continue
            img = first_div.find("img", src=True)
            if img:
                images.append(img["src"])

        # extract review counts of the things to do
        reviews = [
            div.text.strip()
            for div in soup.find_all("div", {"data-automation": "bubbleLabel"})
        ]

        # extract category of things to do
        category = []
        for article in soup.find_all("article", class_="GTuVU XJlaI"):
            first_div = article.find("div", class_="BKifx y")
            if not first_div:
                continue
            second_div = first_div.find("div", class_="biGQs _P pZUbB ZNjnF")
            if second_div:
                category.append(second_div.get_text(strip=True))

        # extract location of things to do
        locations = []
        for article in soup.find_all("article", class_="GTuVU XJlaI"):
            first_div = article.find("div", class_="BKifx y")
            if not first_div:
                continue
            second_div = article.find("div", class_="bRMrl _Y K")
            if not second_div:
                continue
            third_div = second_div.find("div", class_="biGQs _P pZUbB ZNjnF")
            if third_div:
                locations.append(third_div.get_text(strip=True))

        # create a list of dictionaries with the extracted data
        rows = []
        # finally, I'll loop through each item in the lists and create a dictionary with the extracted data and add the dictionary to the list of dictionaries
        for (
            name,
            category,
            rating,
            images,
            locations,
            reviews,
            description,
        ) in zip(name, category, rating, images, locations, reviews, description):
            rows.append(
                {
                    "name": clean_name(name),
                    "category": category,
                    "rating": clean_rating(rating),
                    "image_url": images,
                    "location": locations,
                    "review_count": clean_review_count(reviews),
                    "description": description,
                }
            )
        return rows

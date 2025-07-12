import re

from config import RESTAURANTS_OUTPUT_DIR
from scraper_utils import clean_name, clean_rating, clean_review_count

from .base_scraper import BaseScraper


class RestaurantScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            name="Restaurants", slug_pattern="", output_dir=RESTAURANTS_OUTPUT_DIR
        )

    # initialize a function to collect slugs for cities and  modify them to match the format of the restaurants page scraping
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
            attr_slugs.append(f"Restaurants-{gid}-{city_state}")
        return attr_slugs

    def page_url(self, slug: str, offset: int) -> str:

        m = re.match(r"^Restaurants-g(\d+)-(.+)$", slug)
        if m:
            gid, city_part = m.groups()
            if offset == 0:
                return f"/Restaurants-g{gid}-{city_part}.html"
            return f"/Restaurants-g{gid}-oa{offset}-{city_part}.html"

    def parse_page(self, soup):
        # extract name of things to do
        name = []
        for h in soup.find_all("a", class_="BMQDV _F Gv wSSLS SwZTJ FGwzt ukgoS"):
            target_div = h.find(
                "div",
                class_="biGQs _P fiohW alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU mtnKn OgHoE",
            )
            if target_div:
                name.append(target_div.get_text(strip=True))

        # extract description of things to do
        description = []
        for div in soup.find_all("div", class_="CnVYs y _T"):
            first_div = div.find("a", target="_blank")
            if not first_div:
                continue

            second_div = first_div.find(
                "div", class_="biGQs _P pZUbB alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU ZNjnF"
            )
            if second_div:
                description.append(second_div.get_text(strip=True))

        # extract rating of things to do
        rating = [
            span.find("span").get_text(strip=True)
            for span in soup.find_all("div", {"data-automation": "bubbleRatingValue"})
        ]

        # extract image url of things to do
        images = []
        for div in soup.find_all("div", {"data-clicksource": "Photo"}):
            first_div = div.find("div", {"data-automation": "photoCarousel"})
            if not first_div:
                continue
            img = first_div.find("img", src=True)
            if img:
                images.append(img["src"])

        # extract review counts of the things to do
        reviews = [
            div.text.strip()
            for div in soup.find_all("div", {"data-automation": "bubbleReviewCount"})
        ]

        # extract location of things to do
        category = []
        for div in soup.find_all("div", class_="ZvrsW N G"):
            first_div = div.find("div", class_="ZvrsW N G biqBm")
            if not first_div:
                continue

            span = first_div.find("span", class_="f")
            if not span:
                continue

            third_div = span.find("span", class_="biGQs _P pZUbB ZNjnF")
            if third_div:
                category.append(third_div.get_text(strip=True))

        # create a list of dictionaries with the extracted data
        rows = []
        # finally, I'll loop through each item in the lists and create a dictionary with the extracted data and add the dictionary to the list of dictionaries
        for (
            name,
            rating,
            images,
            category,
            reviews,
            description,
        ) in zip(name, rating, images, category, reviews, description):
            rows.append(
                {
                    "name": clean_name(name),
                    "rating": clean_rating(rating),
                    "image_url": images,
                    "category": category,
                    "review_count": clean_review_count(reviews),
                    "description": description,
                }
            )
        return rows

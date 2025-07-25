import re

from config import RESTAURANTS_OUTPUT_DIR
from scraper_utils import clean_name, clean_rating, clean_review_count, generate_slugs_from_hotels

from .base_scraper import BaseScraper


class RestaurantScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            name="Restaurants", slug_pattern="", output_dir=RESTAURANTS_OUTPUT_DIR
        )

    # initialize a function to collect slugs for cities and  modify them to match the format of the restaurants page scraping
    def collect_slugs(self) -> list[str]:
        return generate_slugs_from_hotels("Restaurants", "")

    # initialize a function to collect slugs for cities and  modify them to match the format of the restaurants page scraping
    def parse_page(self, soup_parser):
        # extract the names of the restaurants
        restaurant_names = []
        for link_element in soup_parser.find_all("a", class_="BMQDV _F Gv wSSLS SwZTJ FGwzt ukgoS"):
            target_div = link_element.find(
                "div",
                class_="biGQs _P fiohW alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU mtnKn OgHoE",
            )
            if target_div:
                restaurant_names.append(target_div.get_text(strip=True))
        # extract the descriptions of the restaurants
        restaurant_descriptions = []
        for container_div in soup_parser.find_all("div", class_="CnVYs y _T"):
            link_element = container_div.find("a", target="_blank")
            if not link_element:
                continue
            text_div = link_element.find(
                "div", class_="biGQs _P pZUbB alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU ZNjnF"
            )
            if text_div:
                restaurant_descriptions.append(text_div.get_text(strip=True))
        # extract the ratings of the restaurants
        restaurant_ratings = [
            bubble_span.find("span").get_text(strip=True)
            for bubble_span in soup_parser.find_all("div", {"data-automation": "bubbleRatingValue"})
        ]
        # extract the images of the restaurants
        restaurant_images = []
        for photo_div in soup_parser.find_all("div", {"data-clicksource": "Photo"}):
            carousel_div = photo_div.find("div", {"data-automation": "photoCarousel"})
            if not carousel_div:
                continue
            image_element = carousel_div.find("img", src=True)
            if image_element:
                restaurant_images.append(image_element["src"])
        # extract the review counts of the restaurants
        restaurant_reviews = [
            review_div.text.strip()
            for review_div in soup_parser.find_all("div", {"data-automation": "bubbleReviewCount"})
        ]
        # extract the categories of the restaurants
        restaurant_categories = []
        for container_div in soup_parser.find_all("div", class_="ZvrsW N G"):
            inner_div = container_div.find("div", class_="ZvrsW N G biqBm")
            if not inner_div:
                continue
            span_element = inner_div.find("span", class_="f")
            if not span_element:
                continue
            text_div = span_element.find("span", class_="biGQs _P pZUbB ZNjnF")
            if text_div:
                restaurant_categories.append(text_div.get_text(strip=True))
        # create a list of dictionaries with the extracted data
        data_rows = []
        for (
            restaurant_name,
            restaurant_rating,
            restaurant_image,
            restaurant_category,
            restaurant_review,
            restaurant_description,
        ) in zip(
            restaurant_names,
            restaurant_ratings,
            restaurant_images,
            restaurant_categories,
            restaurant_reviews,
            restaurant_descriptions,
        ):
            data_rows.append(
                {
                    "name": clean_name(restaurant_name),
                    "rating": clean_rating(restaurant_rating),
                    "image_url": restaurant_image,
                    "category": restaurant_category,
                    "review_count": clean_review_count(restaurant_review),
                    "description": restaurant_description,
                }
            )
        return data_rows

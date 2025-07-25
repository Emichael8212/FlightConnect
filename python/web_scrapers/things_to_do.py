import re

from config import ATTRACTIONS_OUTPUT_DIR
from scraper_utils import clean_name, clean_rating, clean_review_count, generate_slugs_from_hotels

from .base_scraper import BaseScraper


class ThingsToDoScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            name="Attractions", slug_pattern="", output_dir=ATTRACTIONS_OUTPUT_DIR
        )

    # initialize a function to collect slugs for cities and  modify them to match the format of the attraction page scraping
    def parse_page(self, soup_parser):
        # extract the names of the attractions
        attraction_names = [
            header_element.get_text(strip=True)
            for header_element in soup_parser.find_all("h3", class_="biGQs _P fiohW OgHoE")
        ]
        # extract the descriptions of the attractions
        attraction_descriptions = []
        for summary_div in soup_parser.find_all("div", {"data-test-target": "gai-summary-card"}):
            raw_description = summary_div.get_text(strip=True)
            filtered_description = re.sub(r"(?i)This attraction.*", " ", raw_description).strip()
            attraction_descriptions.append(filtered_description or None)
        # extract the ratings of the attractions
        attraction_ratings = [
            bubble_span.find("span").get_text(strip=True)
            for bubble_span in soup_parser.find_all("div", {"data-automation": "bubbleRatingValue"})
        ]
        # extract the images of the attractions
        attraction_images = []
        for article_element in soup_parser.find_all("article", class_="GTuVU XJlaI"):
            photo_div = article_element.find("div", {"data-automation": "photoCarousel"})
            if not photo_div:
                continue
            image_element = photo_div.find("img", src=True)
            if image_element:
                attraction_images.append(image_element["src"])
        # extract the review counts of the attractions
        attraction_reviews = [
            review_div.text.strip()
            for review_div in soup_parser.find_all("div", {"data-automation": "bubbleLabel"})
        ]
        # extract the categories of the attractions
        attraction_categories = []
        for article_element in soup_parser.find_all("article", class_="GTuVU XJlaI"):
            category_div = article_element.find("div", class_="BKifx y")
            if not category_div:
                continue
            text_div = category_div.find("div", class_="biGQs _P pZUbB ZNjnF")
            if text_div:
                attraction_categories.append(text_div.get_text(strip=True))
        # extract the locations of the attractions
        attraction_locations = []
        for article_element in soup_parser.find_all("article", class_="GTuVU XJlaI"):
            outer_div = article_element.find("div", class_="BKifx y")
            if not outer_div:
                continue
            inner_div = article_element.find("div", class_="bRMrl _Y K")
            if not inner_div:
                continue
            text_div = inner_div.find("div", class_="biGQs _P pZUbB ZNjnF")
            if text_div:
                attraction_locations.append(text_div.get_text(strip=True))
        # create a list of dictionaries with the extracted data
        data_rows = []
        for (
            attraction_name,
            attraction_category,
            attraction_rating,
            attraction_image,
            attraction_location,
            attraction_review,
            attraction_description,
        ) in zip(
            attraction_names,
            attraction_categories,
            attraction_ratings,
            attraction_images,
            attraction_locations,
            attraction_reviews,
            attraction_descriptions,
        ):
            data_rows.append(
                {
                    "name": clean_name(attraction_name),
                    "category": attraction_category,
                    "rating": clean_rating(attraction_rating),
                    "image_url": attraction_image,
                    "location": attraction_location,
                    "review_count": clean_review_count(attraction_review),
                    "description": attraction_description,
                }
            )
        return data_rows

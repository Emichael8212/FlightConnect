from scraper_utils import (
    clean_description,
    clean_name,
    clean_price,
    clean_rating,
    clean_review_count,
)

from .base_scraper import BaseScraper


class HotelScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            name="Hotels",
            slug_pattern=r"^/Hotels-g\d+-[^/]+-Hotels\.html$",
            output_dir="hotel_json_cleaned",  # where to write my output
        )

    def parse_page(self, soup_parser):
        # extract name of hotel
        hotel_names = [
            header_element.get_text(strip=True)
            for header_element in soup_parser.find_all(
                "h3", class_="biGQs _P fiohW alXOW EEXWj GzNcM BYtua UTQMg alvrA OgHoE"
            )
        ]
        # extract rating of hotel
        hotel_ratings = [
            bubble_span.find("span").get_text(strip=True)
            for bubble_span in soup_parser.find_all("div", {"data-automation": "bubbleRatingValue"})
        ]
        # extract image url of hotel
        hotel_images = [
            image_element["src"]
            for container_div in soup_parser.find_all("div", class_="OCjqp w _Z")
            for image_element in container_div.find_all("img", src=True)
        ]
        # extract review counts of the hotel
        hotel_reviews = [
            review_span.find("span").get_text(strip=True)
            for review_span in soup_parser.find_all("div", {"data-automation": "bubbleReviewCount"})
        ]
        # extract descriptions of the hotel
        hotel_descriptions = [
            span_element.get_text(strip=True)
            for link_element in soup_parser.find_all("a", class_="BMQDV _F Gv wSSLS SwZTJ")
            if (span_element := link_element.find("span"))
        ]
        # extract prices of the hotel
        hotel_prices = [price_div.get_text(strip=True) for price_div in soup_parser.select("div.TMaKm.u")]

        data_rows = []
        for hotel_name, hotel_rating, hotel_image, hotel_review, hotel_description, hotel_price in zip(
            hotel_names, hotel_ratings, hotel_images, hotel_reviews, hotel_descriptions, hotel_prices
        ):
            data_rows.append(
                {
                    "name": clean_name(hotel_name),
                    "rating": clean_rating(hotel_rating),
                    "image_url": hotel_image,
                    "review_count": clean_review_count(hotel_review),
                    "description": clean_description(hotel_description),
                    "price": clean_price(hotel_price),
                }
            )
        return data_rows

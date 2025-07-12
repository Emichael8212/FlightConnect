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

    def parse_page(self, soup):
        # extract name of hotel
        names = [
            h.get_text(strip=True)
            for h in soup.find_all(
                "h3", class_="biGQs _P fiohW alXOW EEXWj GzNcM BYtua UTQMg alvrA OgHoE"
            )
        ]
        # extract rating of hotel
        ratings = [
            span.find("span").get_text(strip=True)
            for span in soup.find_all("div", {"data-automation": "bubbleRatingValue"})
        ]
        # extract image url of hotel
        images = [
            img["src"]
            for div in soup.find_all("div", class_="OCjqp w _Z")
            for img in div.find_all("img", src=True)
        ]
        # extract review counts of the hotel
        reviews = [
            span.find("span").get_text(strip=True)
            for span in soup.find_all("div", {"data-automation": "bubbleReviewCount"})
        ]
        # 5 extract descriptions of the hotel
        descriptions = [
            a.find("span").get_text(strip=True)
            for a in soup.find_all("a", class_="BMQDV _F Gv wSSLS SwZTJ")
            if a.find("span")
        ]
        # extract price of hotel
        prices = [div.get_text(strip=True) for div in soup.select("div.TMaKm.u")]

        # create a list of dictionaries with the extracted data
        rows = []
        # loop through each hotel and extract the data for that hotel
        for name, rating, img, reviews, descriptions, price in zip(
            names, ratings, images, reviews, descriptions, prices
        ):
            # create a dictionary with the extracted data and add the dictionary to the list of dictionaries
            rows.append(
                {
                    "name": clean_name(name),
                    "rating": clean_rating(rating),
                    "image_url": img,
                    "review_count": clean_review_count(reviews),
                    "description": clean_description(descriptions),
                    "price": clean_price(price),
                }
            )
        return rows

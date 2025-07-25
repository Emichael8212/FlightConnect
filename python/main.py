from web_scrapers.hotels import HotelScraper
from web_scrapers.restaurants import RestaurantScraper
from web_scrapers.things_to_do import ThingsToDoScraper


# define a function to run the scrapers
def main():

    HotelScraper().scrape()  # hotel scraper
    ThingsToDoScraper().scrape()  # things to do scraper
    RestaurantScraper().scrape()  # restaurant scraper

if __name__ == "__main__":
    main()

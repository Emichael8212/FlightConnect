BASE_URL = "https://www.tripadvisor.com"

# initialize the base URL for US hotels
US_HOTELS_URL = f"{BASE_URL}/Hotels-g191-United_States-Hotels.html"

# initialize the maximum number of cards to scrape per page
MAX_CARDS = 100

# How many items per “page” TripAdvisor shows
PAGE_STEP = 30

# Where to dump hotel JSON files
HOTEL_OUTPUT_DIR = "hotel_json_cleaned"

# Where to dump “things to do” JSON files
ATTRACTIONS_OUTPUT_DIR = "things_to_do_json"

# initialize header for requests
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/100.0.4896.127 Safari/537.36"
    )
}

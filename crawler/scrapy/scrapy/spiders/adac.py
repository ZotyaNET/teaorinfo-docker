import scrapy, json, redis
from urllib.parse import urlparse

class AdacSpider(scrapy.Spider):
    name = "adac"
    allowed_domains = ["adac.de"]
    start_urls = ["https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autosuche/?pageNumber=1&sort=ALPHABETIC_ASC"]

    def parse(self, response):
        # Extract links to car pages
        car_pages = response.css('[data-testid="carpages:generation:model:link"]::attr(href)').getall()
        for car_page in car_pages:
            # If car_page exists as a key in Redis, skip the request
            if redis.Redis(host='redis', port=6379, db=0).get(f"car:adac:https://www.adac.de{car_page}"):
                continue
            # Extend URL with #technische-daten
            technical_data_url = car_page + "#technische-daten"
            yield response.follow(technical_data_url, callback=self.parse_technical_data, cb_kwargs={'car_page': car_page})
        # Follow pagination link
        next_page = response.css('div[data-testid="pagination"] a:last-child::attr(href)').get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)

    def parse_technical_data(self, response, car_page):
        car_image = response.css('picture[data-testId="picture"] img::attr(data-src)').get()
         # Extracting the 5th nav element with data-testid="breadcrumbs"
        nav_element = response.xpath('(//nav[@data-testid="breadcrumbs"])')  # Modify XPath accordingly
        # Extracting data from elements with data-tracking attribute
        data_tracking_values = nav_element.xpath('.//@data-tracking').extract()  # Extracting data-tracking attribute values
        # Initialize an empty array to store key-value pairs
        key_value_pairs = []
        related_car_labels = []
        related_cars = response.css('[data-testid="related-cars"]::attr(href)').getall()
        related_car_data_list = response.css('[data-testid="related-cars"]::attr(data-tracking)').getall()
        # Extract href attribute using CSS selector
        related_more = response.css('footer[data-testid="teaser-collection"] a::attr(href)').get()
        for related_car_data in related_car_data_list:
            if related_car_data:
                json_data = json.loads(related_car_data)
                label = json_data.get('click', {}).get('label')
                if label:
                    related_car_labels.append(label)
        car_model = response.css('h1::text').get()
        # Extract table rows with exactly two cells
        table_rows = response.xpath('//tr[count(td) = 2]')
        for row in table_rows:
            # Extract key and value from the table cells
            key = row.xpath('./td[1]//text()').get()
            value = row.xpath('./td[2]//text()').get()
            # Append the key-value pair to the array
            key_value_pairs.append({key: value})
        data = {
            'make' : data_tracking_values[4],
            'model' : data_tracking_values[5],
            'generation' : data_tracking_values[6],
            'car_image': car_image,
            'car_model': car_model,
            'technical_data': key_value_pairs,
            'related_more': related_more,
            'related_car_urls': related_cars,
            'related_car_labels': related_car_labels
        }
        # Storing data in Redis
        self.store_in_redis(data, car_page)
        yield data

    def store_in_redis(self, data, car_page):
        # Connect to Redis
        r = redis.Redis(host='redis', port=6379, db=0)
        c = 1
#         print("Data:", data)  # Print the data variable to inspect its structure
        # Get the domain or relevant part of the URL
        key = f"car:adac:https://www.adac.de{car_page}"
        c += 1
        # Serialize the item dictionary to JSON
        item_json = json.dumps(data)
        # Store the serialized item as a string
        r.set(key, item_json)
        # Optionally, set an expiry time for the keys
        r.expire(key, 28800)  # Set expiry time to 1 hour

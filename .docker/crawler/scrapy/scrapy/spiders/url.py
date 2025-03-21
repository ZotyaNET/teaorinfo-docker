import scrapy
import json
import redis
from urllib.parse import urlparse

class GenericSpider(scrapy.Spider):
    name = "generic_spider"

    def __init__(self, *args, **kwargs):
        super(GenericSpider, self).__init__(*args, **kwargs)
        self.start_urls = [url for url in kwargs.get('start_urls', '').split(',') if url]
        self.redis_client = redis.Redis(host='redis', port=6379, db=0)
        self.allowed_domains = [urlparse(url).netloc for url in self.start_urls if url]

    def parse(self, response):
        # Example: Extract links to other pages. Adjust the selector based on your target pages.
        page_links = response.css('a::attr(href)').getall()
#         for page_link in page_links:
#             full_url = response.urljoin(page_link)
#             if self.is_valid_url(full_url) and not self.redis_client.get(f"url:{full_url}"):
#                 yield response.follow(full_url, callback=self.parse_page, cb_kwargs={'page_link': full_url})

        # Follow pagination link, if exists. Adjust the selector based on your target pages.
        next_page = response.css('a.pagination-next::attr(href)').get()
#         if next_page:
#             full_url = response.urljoin(next_page)
#             if self.is_valid_url(full_url):
#                 yield response.follow(full_url, callback=self.parse)

    def parse_page(self, response, page_link):
        # Extract data from the page. Adjust this part based on your target pages.
        page_title = response.css('title::text').get()
        page_text = ' '.join(response.css('body *::text').getall()).strip()

        data = {
            'url': page_link,
            'title': page_title,
            'text': page_text,
        }

        # Storing data in Redis
        self.store_in_redis(data, page_link)
        yield data

    def store_in_redis(self, data, page_link):
        key = f"url:{page_link}"
        item_json = json.dumps(data)
        self.redis_client.set(key, item_json)
        self.redis_client.expire(key, 28800)  # Set expiry time to 8 hours

    def is_valid_url(self, url):
        parsed_url = urlparse(url)
        # Only consider HTTP and HTTPS URLs
        return parsed_url.scheme in ['http', 'https'] and parsed_url.netloc in self.allowed_domains

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(GenericSpider, cls).from_crawler(crawler, *args, **kwargs)
        spider._set_crawler(crawler)
        return spider

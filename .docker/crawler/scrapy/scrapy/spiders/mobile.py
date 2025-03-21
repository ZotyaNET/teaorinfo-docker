import scrapy, json, redis

class MobiSpider(scrapy.Spider):

    name = "mobi"

    allowed_domains = ["mobile.de"]

    start_urls = ["https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autosuche/?pageNumber=1&sort=ALPHABETIC_ASC"]

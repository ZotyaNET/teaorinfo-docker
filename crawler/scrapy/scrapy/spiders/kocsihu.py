import scrapy, json, redis

class KocsiSpider(scrapy.Spider):

    name = "kocsi"

    allowed_domains = ["kocsi.hu"]

    start_urls = ["https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autosuche/?pageNumber=1&sort=ALPHABETIC_ASC"]

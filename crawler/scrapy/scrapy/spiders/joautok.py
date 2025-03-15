import scrapy, json, redis

class JoAutokSpider(scrapy.Spider):

    name = "joautok"

    allowed_domains = ["joautok.hu"]

    start_urls = ["https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autosuche/?pageNumber=1&sort=ALPHABETIC_ASC"]

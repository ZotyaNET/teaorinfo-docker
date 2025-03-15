import scrapy, json, redis

class JofogasSpider(scrapy.Spider):

    name = "jofogas"
    
    allowed_domains = ["jofogas.hu"]
    
    start_urls = ["https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autosuche/?pageNumber=1&sort=ALPHABETIC_ASC"]
import scrapy, json, redis

class AS24Spider(scrapy.Spider):

    name = "as24"

    allowed_domains = ["autoscout24.hu", "autoscout24.de", "autoscout24.at", "autoscout24.it", "autoscout24.fr",
    "autoscout24.es", "autoscout24.be", "autoscout24.nl", "autoscout24.pl", "autoscout24.pt", "autoscout24.lu",
    "autoscout24.ch", "autoscout24.dk", "autoscout24.se", "autoscout24.fi", "autoscout24.no", "autoscout24.ee",
    "autoscout24.lv", "autoscout24.lt", "autoscout24.ru", "autoscout24.bg", "autoscout24.ro", "autoscout24.gr",
    "autoscout24.cz", "autoscout24.sk", "autoscout24.si", "autoscout24.hr", "autoscout24.ba", "autoscout24.rs",
    "autoscout24.me", "autoscout24.mk", "autoscout24.al", "autoscout24.ua", "autoscout24.by", "autoscout24.md",
    "autoscout24.tr", "autoscout24.ma", "autoscout24.dz", "autoscout24.tn", "autoscout24.ly", "autoscout24.eg",
    "autoscout24.il", "autoscout24.sa", "autoscout24.ae", "autoscout24.qa", "autoscout24.om", "autoscout24.kw",
    "autoscout24.bh", "autoscout24.jo", "autoscout24.iq", "autoscout24.sy", "autoscout24.lb", "autoscout24.ps",
    "autoscout24.ye", "autoscout24.sd", "autoscout24.er", "autoscout24.so", "autoscout24.dj", "autoscout24.et",
    "autoscout24.ke", "autoscout24.ug", "autoscout24.rw", "autoscout24.bi", "autoscout24.bf", "autoscout24.ne",
    "autoscout24.ng", "autoscout24.td", "autoscout24.cm", "autoscout24.cf", "autoscout24.cg", "autoscout24.cd",
    "autoscout24.ao", "autoscout24.ga", "autoscout24.gq", "autoscout24.st", "autoscout24.cv", "autoscout24.gm",
    "autoscout24.sn", "autoscout24.ml", "autoscout24.gn", "autoscout24.ci", "autoscout24.lr"]

    start_urls = ["https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autosuche/?pageNumber=1&sort=ALPHABETIC_ASC"]

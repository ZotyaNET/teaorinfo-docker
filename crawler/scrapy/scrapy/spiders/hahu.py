import scrapy
import redis
import json

from scrapy.selector import Selector
from datetime import datetime

class HasznaltautoSpider(scrapy.Spider):
    name = "hahu"
    start_urls = [
        'https://www.hasznaltauto.hu/talalatilista/PCOHKVGRN3NTADH4C56UDEVG5WTDY3RIKZQAQCQM5CV4DWUMUNMBEA4JG2NBJ7PXKG3JGWSG7JSOFDQSR4T5FIGXJP6RD5LSUVKQHDBVAUBVX3GUI2YKKVXRRQHO2CK2UYPFU2YFGZH5ZDXY32CAUGLDA4K4JM62XTU4K6CJE6YIKUBY4PJSKC5N2SOID5ZJOOXRLNVBZDHG23YR5HMLLPSU6VQLSOCAOBWX7D2WZP7PXKCVBUAXY2OATJ4CGYMVHICUX7QGE4256MFA3UR5GDP2U5LKFD5CMFSC4LTF423NAEY4DAHBOXA23VEQOYWUONCSHNV4MKJYNJ7AUVM6SJTANQW4OJHAJ2CCYFV5SQP7GR7YCXB65SZZGHUA6OP4Q6QTGJOGZS4ZP7JJSB7TKFMOOJLFFOLMEOJ7W2ZCX4CHFREG7RZTLUAP7WU5PZ7N5DC6FYUFRFHWCODDPT6WILDD7C5LAKULOIH2CFVKFDEXWLEZEY2HYT2LNMHEEA4FDECSJW5JIJV27CFEWA43N4MAOY3GLWGJWMA6PNS6YGE23DPJ4QM63GBEIOYZHOLHN3OHY5BTFKNV3UOVZLHIAP2BPW6RPLEFEOY5VAF624PWMWEMP2AIYXQO6EVMLKZBXZF7DXIQV5J3YHXCPO27TFCALZ6I7PWG2ADJ4C6LXF6KXEWDA6TKNECRO7YNKZDLGFRIMSQT4KREK55GE2EZNLEP33QPIH3QYAYH25KJUYMM7DPMJAZ4KH6SGDIM5PDHEMRCQWTMHAGVILHAZVBHMKGVWCWYZPBXGOMNCHKT5XWLM7TP2M6J6G7SU5XMVCITDCHTHII5PHNFHID2RI7Q57ZBLHOCSKQL2NMOHMSW2OHUJKVBH5QSY5QUNKYG5IXTOMYFSFXDG6K22QZ7CH57SH6ZYG3CI',
    ]

    def parse(self, response):
        # Extracting required data
        listings = response.css('.row.talalati-sor')
        data = []
        for listing in listings:
            logo = ''
            logo_alt = ''
            logo_link = ''
            title = listing.css('h3 a::text').get()
            link = listing.css('h3 a::attr(href)').get()
            price = listing.css('div.pricefield-primary::text').get()
            extra = ' '.join(listing.css('div.cimke-lista>span.label-vilagos::text').getall())
            dealer = listing.css('span.trader-name::text').get()
            info = ' '.join(listing.css('.talalatisor-info>span.info::text').getall())
            km = listing.css('.talalatisor-info>span.info>abbr::text').get()
            img = listing.css('img::attr(src)').get()
            logo = listing.css('.talalatisor-logo>a>img::attr(src)').get()
            logo_alt = listing.css('.talalatisor-logo>a>img::attr(alt)').get()
            logo_link = listing.css('.talalatisor-logo>a::attr(href)').get()

            # Cut everything with and after the hashtag (#)
            link = link.split('#')[0] if link else None

            # Check if any of the variables is None
#             if any(var is None for var in [logo, logo_alt, logo_link, price]):
#                 continue  # Skip this listing if any of the variables is None

            # Process the data further
            created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if title is not None:
              title = title.strip()
            if link is not None:
              link = link.strip()
            if price is not None:
              price = price.strip()
            if extra is not None:
              extra = extra.strip()
            if dealer is not None:
              dealer = dealer.strip()
            if info is not None:
              info = info.strip()
            if km is not None:
              km = km.strip()
            if img is not None:
              img = img.strip()
            if created is not None:
              created = created.strip()
            if logo is not None:
              logo = logo.strip()
            if logo_alt is not None:
              logo_alt = logo_alt.strip()
            if logo_link is not None:
              logo_link = logo_link.strip()

            data.append({
                'title': title,
                'link': link,
                'price': price,
                'extra': extra,
                'dealer': dealer,
                'info': info,
                'km': km,
                'img': img,
                'created': created,
                'logo': logo,
                'logo_alt': logo_alt,
                'logo_link': logo_link
            })

        # Storing data in Redis
        self.store_in_redis(data)

        # Clicking on the next page link
        next_page_link = response.css('li.next a::attr(href)').get()
        if next_page_link:
            yield response.follow(next_page_link, callback=self.parse)

    def store_in_redis(self, data):
        # Connect to Redis
        r = redis.Redis(host='redis', port=6379, db=0)
        c = 1

        # Inserting data into Redis
        for item in data:
            key = f"car:hahu:{item['link']}"
            c += 1
            # Serialize the item dictionary to JSON
            item_json = json.dumps(item)
            # Store the serialized item as a string
            r.set(key, item_json)
            # Optionally, set an expiry time for the keys
            r.expire(key, 28800)  # Set expiry time to 8 hour

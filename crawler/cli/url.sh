#!/bin/bash

start_url="https://www.hasznaltauto.hu/talalatilista/PCOHKVGRN3NTADH4C56UDEVG5WTDY3RIKZQAQCQM5CV4DWUMUNMBEA4JG2NBJ7PXKG3JGWSG7JSOFDQSR4T5FIGXJP6RD5LSUVKQHDBVAUBVX3GUI2YKKVXRRQHO2CK2UYPFU2YFGZH5ZDXY32CAUGLDA4K4JM62XTU4K6CJE6YIKUBY4PJSKC5N2SOID5ZJOOXRLNVBZDHG23YR5HMLLPSU6VQLSOCAOBWX7D2WZP7PXKCVBUAXY2OATJ4CGYMVHICUX7QGE4256MFA3UR5GDP2U5LKFD5CMFSC4LTF423NAEY4DAHBOXA23VEQOYWUONCSHNV4MKJYNJ7AUVM6SJTANQW4OJHAJ2CCYFV5SQP7GR7YCXB65SZZGHUA6OP4Q6QTGJOGZS4ZP7JJSB7TKFMOOJLFFOLMEOJ7W2ZCX4CHFREG7RZTLUAP7WU5PZ7N5DC6FYUFRFHWCODDPT6WILDD7C5LAKULOIH2CFVKFDEXWLEZEY2HYT2LNMHEEA4FDECSJW5JIJV27CFEWA43N4MAOY3GLWGJWMA6PNS6YGE23DPJ4QM63GBEIOYZHOLHN3OHY5BTFKNV3UOVZLHIAP2BPW6RPLEFEOY5VAF624PWMWEMP2AIYXQO6EVMLKZBXZF7DXIQV5J3YHXCPO27TFCALZ6I7PWG2ADJ4C6LXF6KXEWDA6TKNECRO7YNKZDLGFRIMSQT4KREK55GE2EZNLEP33QPIH3QYAYH25KJUYMM7DPMJAZ4KH6SGDIM5PDHEMRCQWTMHAGVILHAZVBHMKGVWCWYZPBXGOMNCHKT5XWLM7TP2M6J6G7SU5XMVCITDCHTHII5PHNFHID2RI7Q57ZBLHOCSKQL2NMOHMSW2OHUJKVBH5QSY5QUNKYG5IXTOMYFSFXDG6K22QZ7CH57SH6ZYG3CI"
num_threads=16
max_pages=32
page=1
base_url=$(echo "$start_url/page")
mkdir -p "storage/crawler/hahu";

while [ "$page" -le "$max_pages" ]; do
    end_page=$((page + num_threads - 1))
    if [ "$end_page" -gt "$max_pages" ]; then
        end_page=$max_pages
    fi
    seq "$page" "$end_page" | parallel -j "$num_threads" '
        url='"$base_url"'{};
        if [ $(({} % 3)) -eq 0 ]; then
            url="https://hasznaltauto.info.hu/?url='"$base_url"'{}";
        elif [ $(({} % 2)) -eq 0 ]; then
            url="http://winstonsmith.xyz/?url='"$base_url"'{}";
        fi;
        retries=9;
        while [ $retries -gt 0 ]; do
            status_code=$(curl -o /dev/null -s -w "%{http_code}" "$url");
            if [ "$status_code" -eq 200 ]; then
                content=$(curl -s "$url");
                echo "$content" > "storage/crawler/hahu/page_{}.html";
                title=$(echo "$content" | grep -oP "(?<=<title>)(.*)(?=</title>)");
                echo "Page {} Title: $title Url: $url";
                break;
            elif [ "$status_code" -eq 404 ]; then
                echo "Page {} returned status code 404. Skipping.";
                break;
            else
                retries=$((retries - 1));
                echo "Retrying... $url ($retries left)";
                sleep $((2 * retries));
            fi;
        done;
        if [ $retries -eq 0 ]; then
            echo "Page {} failed after 9 retries. Skipping.";
        fi;
    ' || break
    page=$((page + num_threads))
done
echo "Finished processing pages."

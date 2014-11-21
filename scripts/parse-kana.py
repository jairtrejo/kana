import os
import urllib
import json

from bs4 import BeautifulSoup


def make_soup(name):
    filename = "%s.html" % name

    if not os.path.exists(filename):
        urllib.urlretrieve("http://en.wikipedia.org/wiki/%s" % name, filename)

    with open(filename) as f:
        return BeautifulSoup(f.read())


def get_table(soup):
    tables = soup.find_all("table", class_="wikitable")

    for table in tables:
        if table.caption.string.endswith("syllabograms"):
            return table

    return None


def parse_table(table):
    def is_kana_row(tr):
        return (tr.get("valign") == "top" or
                tr.get("style") == "vertical-align:top;text-align:center;")

    easy, hard = [], []
    for tr in filter(is_kana_row, table.find_all("tr")):
        kana_row = []
        for td in filter(lambda td: td.big, tr.find_all("td")):
            kana, sound = td.big.string, tuple(td.children)[2].strip()
            if td.big.get("style") != "color:#808080" and not sound.startswith("("):
                kana_row.append({"kana": kana, "sound": sound})

        easy.append(kana_row[:5])
        hard.append(kana_row[5:])

    return filter(lambda x: len(x) > 0, easy + hard)


if __name__ == "__main__":
    kana = {
        syllabary: parse_table(get_table(make_soup(syllabary)))
        for syllabary in ("hiragana", "katakana")
    }

    print "module.exports = %s" % json.dumps(kana, indent=2, separators=(",", ":"))

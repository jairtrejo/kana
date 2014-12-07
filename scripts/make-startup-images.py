import re
import os.path

from bs4 import BeautifulSoup
from PIL import Image, ImageDraw


def make_soup(filename):
    with open(filename) as f:
        return BeautifulSoup(f.read())


def extract_startup_images(soup):
    links = soup.find_all('link', rel='apple-touch-startup-image')

    def link_to_description(link):
        match = re.search(r'(\d*x\d*)', link['href'])
        name = link['href'].split('/')[-1]
        size = match.groups()[0]

        return (name, size)

    return map(link_to_description, links)


def make_startup_image(size, background_color, bar_height, bar_color):
    height, width = map(int, size.split('x'))
    image = Image.new('RGB', (height, width), background_color)

    draw = ImageDraw.Draw(image)
    draw.rectangle([0, 0, width, bar_height], fill=bar_color)

    return image


if __name__ == '__main__':
    for name, size in extract_startup_images(make_soup('../src/index.html')):
        image = make_startup_image(size, '#FEF9FD', 155, '#EC4D68')
        image.save(os.path.join('../src/images', name))

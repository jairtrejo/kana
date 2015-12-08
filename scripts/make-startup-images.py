import re
import os.path

from bs4 import BeautifulSoup
from PIL import Image, ImageDraw


def make_soup(filename):
    with open(filename) as f:
        return BeautifulSoup(f.read(), "html.parser")


def extract_startup_images_web(soup):
    links = soup.find_all('link', rel='apple-touch-startup-image')

    def link_to_description(link):
        name = link['href'].split('/')[-1]

        match = re.search(r'(\d*x\d*)', link['href'])
        width, height = map(int, match.groups()[0].split('x'))

        match = re.search(r'-webkit-device-pixel-ratio: (\d*)', link['media'])
        pixel_ratio = float(match.groups()[0]) if match else 1

        return (name, width, height, pixel_ratio)

    return map(link_to_description, links)


def extract_startup_images_cordova(soup):
    links = soup.find_all('splash')

    def splash_to_description(splash):
        name = splash['src'].split('/')[-1]

        width, height = int(splash['width']), int(splash['height'])

        match = re.search(r'@(\d*)x.png', name)
        if match:
            pixel_ratio = float(match.groups()[0])
        elif name.endswith("h.png"):
            pixel_ratio = 2.0
        else:
            pixel_ratio = 1.0

        return (name, width, height, pixel_ratio)

    return map(splash_to_description, links)


def make_startup_image(width, height, pixel_ratio, background_color, bar_height, bar_color):
    bar_height = int(bar_height * pixel_ratio)
    landscape = width > height

    image = Image.new('RGB', (width, height), background_color)

    draw = ImageDraw.Draw(image)
    draw.rectangle([
        width - bar_height if landscape else 0,
        0,
        width,
        height if landscape else bar_height], fill=bar_color)

    return image


if __name__ == '__main__':
    print "- Web"
    for name, width, height, pixel_ratio in extract_startup_images_web(make_soup('../src/index.html')):
        # For web
        image = make_startup_image(width, height, pixel_ratio, '#FEF9FD', 60, '#EC4D68')
        image.save(os.path.join('../src/images', name))

        print "%dx%d" % (width, height)

    print "- Cordova"
    for name, width, height, pixel_ratio in extract_startup_images_cordova(make_soup('../phonegap/config.xml')):
        # For web
        image = make_startup_image(width, height, pixel_ratio, '#FEF9FD', 80, '#EC4D68')
        image.save(os.path.join('../phonegap/res', name))

        print "%dx%d" % (width, height)

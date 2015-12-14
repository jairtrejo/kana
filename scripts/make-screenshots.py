from math import ceil
from PIL import Image, ImageDraw, ImageFont


SCREENSHOTS = (
    ("Study the hiragana and katakana\non your free time", "kana-to-sound"),
    ("You can go sound to kana\nor kana to sound", "sound-to-kana"),
    ("Customize your learning", "customize"),
)


IOS_SIZES = (
    (640, 960),
    (640, 1136),
    (750, 1334),
    (1242, 2208),
)

ANDROID_SIZES = (
    (1080, 1920),
)


def draw_screenshot_for_size(background, phone, text, size):
    width, height = size

    bg_width, bg_height = background.size
    temp_height = int(ceil(bg_height * width / float(bg_width)))
    result = background.resize((width, temp_height)).crop((
        0,
        (temp_height - height) / 2,
        width,
        (temp_height - height) / 2 + height
    ))

    phone = phone.copy()
    phone.thumbnail((4 * width / 5, 4 * height / 5))
    p_width, p_height = phone.size
    p_y = height - p_height - p_height / 20
    result.paste(phone, ((width - p_width) / 2, p_y), phone)

    d = ImageDraw.Draw(result)
    font = ImageFont.truetype("OpenSans-Bold", size=(width / 20))
    t_width, t_height = d.multiline_textsize(text, font=font)
    d.multiline_text(
        (2 + (width - t_width) / 2, 2 + (p_y - t_height) / 2), text, font=font,
        fill=(0, 0, 0, 128), align="center")
    d.multiline_text(
        ((width - t_width) / 2, (p_y - t_height) / 2), text, font=font,
        fill=(255, 255, 255), align="center")

    return result

def make_screenshot(screenshot):
    text, screen = screenshot

    background = Image.open('../assets/screenshots/kana-screenshot-background.png')

    iphone = Image.open('../assets/screenshots/iphone-5s.png')
    android = Image.open('../assets/screenshots/htc-one.png')

    screen_img = Image.open('../assets/screenshots/' + screen + '-ios.png')
    iphone.paste(screen_img, (55, 219))

    screen_img = Image.open('../assets/screenshots/' + screen + '-android.png')
    android.paste(screen_img, (120, 307))

    print "- %s" % text
    for size in IOS_SIZES:
        print "  - iOS %dx%d" % size
        img = draw_screenshot_for_size(background, iphone, text.upper(), size)
        img.save('../phonegap/res/ios-%s-%dx%d.png' % ((text.replace('\n', ' '),) + size))

    for size in ANDROID_SIZES:
        print "  - Android %dx%d" % size
        img = draw_screenshot_for_size(background, android, text.upper(), size)
        img.save('../phonegap/res/android-%s-%dx%d.png' % ((text.replace('\n', ' '),) + size))


if __name__ == '__main__':
    for screenshot in SCREENSHOTS:
        make_screenshot(screenshot)

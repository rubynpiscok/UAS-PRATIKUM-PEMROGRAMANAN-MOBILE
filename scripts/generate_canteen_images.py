from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs(os.path.join('assets', 'canteen'), exist_ok=True)

items = [
    ('nasi_ayam_goreng.png', 'Nasi Ayam Goreng', '#FFD6A5'),
    ('gorengan_mix.png', 'Gorengan Mix', '#FFC6FF'),
    ('kopi_susu.png', 'Kopi Susu', '#D0F4DE'),
    ('meja_vip.png', 'Meja VIP', '#A9DEF9'),
    ('fotokopi.png', 'Fotokopi', '#CDB4DB'),
    ('es_teh_tawar.png', 'Es Teh Tawar', '#FFADAD'),
]

for filename, label, color in items:
    path = os.path.join('assets', 'canteen', filename)
    img = Image.new('RGB', (640, 480), color)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('arial.ttf', 48)
    except Exception:
        font = ImageFont.load_default()
    w, h = draw.textsize(label, font=font)
    draw.text(((640 - w) / 2, (480 - h) / 2), label, fill='black', font=font)
    img.save(path)
    print('created', path)

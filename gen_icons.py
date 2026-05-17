"""アイコン PNG を依存なしで生成"""
import struct, zlib
from pathlib import Path

def make_png(size: int, bg=(79, 70, 229)) -> bytes:
    def chunk(tag, data):
        c = tag + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    row = bytes(bg) * size
    raw = b''.join(b'\x00' + row for _ in range(size))
    idat = zlib.compress(raw, 9)

    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

out = Path(__file__).parent / "app/public"
out.mkdir(exist_ok=True)
for size in (192, 512):
    (out / f"icon-{size}.png").write_bytes(make_png(size))
    print(f"icon-{size}.png 生成完了")

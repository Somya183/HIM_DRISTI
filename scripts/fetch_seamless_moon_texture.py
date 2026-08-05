import urllib.request
import os
import cv2
import numpy as np

def create_or_download_seamless_moon():
    output_path = r"c:\Users\dubey\HImDristi\frontend\src\assets\moon_texture_seamless.jpg"
    
    # High resolution official NASA / USGS Lunar texture URLs
    urls = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Moonmap_from_LRO_360k_tile.jpg/2048px-Moonmap_from_LRO_360k_tile.jpg",
        "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_2k.jpg",
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg"
    ]
    
    success = False
    for url in urls:
        try:
            print(f"Downloading seamless NASA Moon texture from {url}...")
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                
            nparr = np.frombuffer(data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is not None and img.shape[0] > 200 and img.shape[1] > 200:
                # Save high quality texture
                cv2.imwrite(output_path, img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
                print(f"[SUCCESS] Downloaded seamless moon texture ({img.shape[1]}x{img.shape[0]}) to {output_path}")
                success = True
                break
        except Exception as e:
            print(f"[WARNING] Could not fetch from {url}: {e}")
            
    if not success:
        print("[INFO] Fallback: Inpainting existing texture to remove polar black hole...")
        existing_path = r"c:\Users\dubey\HImDristi\frontend\src\assets\moon_sphere.png"
        img = cv2.imread(existing_path)
        if img is not None:
            # Mask out black hole at top pole
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            black_mask = (gray < 15).astype(np.uint8) * 255
            # Inpaint seamless crater texture into the black hole
            inpainted = cv2.inpaint(img, black_mask, 15, cv2.INPAINT_TELEA)
            cv2.imwrite(output_path, inpainted)
            print(f"[SUCCESS] Inpainted seamless moon texture to {output_path}")

if __name__ == "__main__":
    create_or_download_seamless_moon()

import os
import numpy as np
from PIL import Image
import cv2

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEXTURES_DIR = os.path.join(BASE_DIR, "frontend", "public", "textures")
os.makedirs(TEXTURES_DIR, exist_ok=True)

def generate_realistic_lunar_texture(width=1024, height=512):
    """
    Generates realistic 1024x512 Equirectangular Lunar Surface Color & Bump textures.
    Includes Lunar Maria (dark basaltic seas), heavily cratered highlands,
    ejecta ray systems, and multi-scale impact craters.
    """
    print("[1/3] Generating realistic lunar color map...")
    np.random.seed(42)
    
    # 1. Grid coordinates
    x = np.linspace(-np.pi, np.pi, width)
    y = np.linspace(-np.pi/2, np.pi/2, height)
    xx, yy = np.meshgrid(x, y)
    
    # Perlin-like multi-scale noise for highland roughness & maria seas
    scale1 = np.sin(xx * 4.0) * np.cos(yy * 2.5)
    scale2 = np.sin(xx * 12.0 + yy * 8.0) * 0.5
    scale3 = np.random.normal(0, 0.08, (height, width))
    
    base_noise = scale1 * 0.35 + scale2 * 0.25 + scale3
    
    # 2. Add Lunar Maria (Dark Basaltic Seas)
    maria_mask = np.zeros((height, width), dtype=np.float32)
    
    # Mare Imbrium & Oceanus Procellarum
    r1 = np.sqrt(((xx + 0.8) / 1.2)**2 + ((yy - 0.3) / 0.6)**2)
    maria_mask += np.clip(1.0 - r1, 0, 1) * 0.75
    
    # Mare Tranquillitatis & Serenitatis
    r2 = np.sqrt(((xx - 0.7) / 1.0)**2 + ((yy - 0.2) / 0.5)**2)
    maria_mask += np.clip(1.0 - r2, 0, 1) * 0.7

    # Mare Crisium
    r3 = np.sqrt(((xx - 1.8) / 0.5)**2 + ((yy - 0.2) / 0.4)**2)
    maria_mask += np.clip(1.0 - r3, 0, 1) * 0.65

    maria_mask = np.clip(maria_mask, 0.0, 1.0)
    
    # High-contrast albedo (Highlands ~160-220, Maria ~45-85)
    albedo = (1.0 - maria_mask * 0.6) * (145.0 + base_noise * 40.0) + 25.0
    albedo = np.clip(albedo, 20.0, 245.0)

    # 3. Add Realistic Impact Craters
    craters_canvas = np.zeros((height, width), dtype=np.float32)
    bump_canvas = np.zeros((height, width), dtype=np.float32)

    for i in range(120):
        cx = np.random.uniform(-np.pi, np.pi)
        cy = np.random.uniform(-np.pi/2, np.pi/2)
        cr = np.random.uniform(0.04, 0.18) if i >= 5 else np.random.uniform(0.2, 0.45)
        
        dist = np.sqrt((xx - cx)**2 + (yy - cy)**2)
        
        # Bowl depression & elevated rim
        inside_mask = dist < cr
        bowl = np.maximum(0.0, 1.0 - (dist / cr)**2) * 0.85
        
        craters_canvas += bowl * (0.35 if i < 5 else 0.15)
        bump_canvas -= bowl * 1.2
        
        # Elevated rim
        rim_mask = np.exp(-((dist - cr) ** 2) / (2 * (cr * 0.15)**2)) * 0.6
        craters_canvas += rim_mask * 0.2
        bump_canvas += rim_mask * 1.5

    # Combine albedo and craters
    final_albedo = np.clip(albedo + craters_canvas * 45.0, 15, 255).astype(np.uint8)

    # 4. Generate Warm Charcoal / Silver Regolith Palette RGB
    color_rgb = np.zeros((height, width, 3), dtype=np.uint8)
    color_rgb[:, :, 0] = np.clip(final_albedo * 0.95, 0, 255).astype(np.uint8)
    color_rgb[:, :, 1] = np.clip(final_albedo * 0.96, 0, 255).astype(np.uint8)
    color_rgb[:, :, 2] = np.clip(final_albedo * 1.00, 0, 255).astype(np.uint8)

    # Save Color Map
    color_path = os.path.join(TEXTURES_DIR, "lunar_color_map.jpg")
    Image.fromarray(color_rgb).save(color_path, quality=95)
    print(f"[OK] Saved realistic lunar color map -> {color_path}")

    # 5. Save Bump Map
    print("[2/3] Generating lunar bump map...")
    bump_norm = cv2.normalize(bump_canvas + base_noise * 0.5, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    bump_path = os.path.join(TEXTURES_DIR, "lunar_bump_map.jpg")
    Image.fromarray(bump_norm).save(bump_path, quality=95)
    print(f"[OK] Saved realistic lunar bump map -> {bump_path}")

    # 6. Save Normal Map
    print("[3/3] Generating lunar normal map...")
    dx = cv2.Sobel(bump_norm, cv2.CV_32F, 1, 0, ksize=3)
    dy = cv2.Sobel(bump_norm, cv2.CV_32F, 0, 1, ksize=3)
    dz = np.ones_like(dx) * 20.0

    norm_len = np.sqrt(dx**2 + dy**2 + dz**2)
    nx = (dx / norm_len * 0.5 + 0.5) * 255
    ny = (dy / norm_len * 0.5 + 0.5) * 255
    nz = (dz / norm_len * 0.5 + 0.5) * 255

    normal_rgb = np.stack([nx, ny, nz], axis=-1).astype(np.uint8)
    normal_path = os.path.join(TEXTURES_DIR, "lunar_normal_map.jpg")
    Image.fromarray(normal_rgb).save(normal_path, quality=95)
    print(f"[OK] Saved realistic lunar normal map -> {normal_path}")

if __name__ == "__main__":
    generate_realistic_lunar_texture()

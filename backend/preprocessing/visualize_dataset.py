import os
import matplotlib.pyplot as plt
from dataset_loader import LunarDatasetLoader

def visualize_lunar_datasets():
    loader = LunarDatasetLoader()
    data = loader.load_all_modalities()

    radar = data["radar"]
    optical = data["optical"]
    dem = data["dem"]
    shadow = data["shadow"]

    fig, axes = plt.subplots(2, 2, figsize=(12, 11))
    fig.suptitle("HImDristi Phase 1 - Multi-Modal Lunar Input Datasets\n(Shackleton Crater, South Pole - 89.9°S, 0.0°E)", fontsize=14, fontweight='bold')

    # 1. Radar (Chandrayaan-2 DFSAR CPR)
    im0 = axes[0, 0].imshow(radar, cmap='inferno')
    axes[0, 0].set_title("Chandrayaan-2 DFSAR Radar (CPR)", fontsize=11, fontweight='bold')
    axes[0, 0].axis('off')
    fig.colorbar(im0, ax=axes[0, 0], fraction=0.046, pad=0.04, label="CPR Ratio")

    # 2. Optical (LRO LROC Albedo)
    im1 = axes[0, 1].imshow(optical, cmap='gray')
    axes[0, 1].set_title("Optical Image (LRO LROC Reflectance)", fontsize=11, fontweight='bold')
    axes[0, 1].axis('off')
    fig.colorbar(im1, ax=axes[0, 1], fraction=0.046, pad=0.04, label="Albedo")

    # 3. DEM Terrain (LOLA Elevation)
    im2 = axes[1, 0].imshow(dem, cmap='terrain')
    axes[1, 0].set_title("DEM Terrain Elevation (LOLA)", fontsize=11, fontweight='bold')
    axes[1, 0].axis('off')
    fig.colorbar(im2, ax=axes[1, 0], fraction=0.046, pad=0.04, label="Elevation (m)")

    # 4. Shadow Map (PSR)
    im3 = axes[1, 1].imshow(shadow, cmap='bone')
    axes[1, 1].set_title("Permanent Shadow Region (PSR Map)", fontsize=11, fontweight='bold')
    axes[1, 1].axis('off')
    fig.colorbar(im3, ax=axes[1, 1], fraction=0.046, pad=0.04, label="1 = Shadow, 0 = Sunlit")

    plt.tight_layout()
    output_path = os.path.join(loader.dataset_dir, "lunar_dataset_overview.png")
    plt.savefig(output_path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved multi-panel visualization -> {output_path}")

if __name__ == "__main__":
    visualize_lunar_datasets()

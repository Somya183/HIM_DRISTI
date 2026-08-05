import os
import numpy as np
import matplotlib.pyplot as plt

def generate_preprocessing_comparison():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    dataset_dir = os.path.join(base_dir, "dataset")
    prep_dir = os.path.join(dataset_dir, "preprocessed")

    # Load Raw Datasets
    raw_radar = np.load(os.path.join(dataset_dir, "radar", "dfsar_cpr_shackleton.npy"))
    raw_optical = np.load(os.path.join(dataset_dir, "optical", "lroc_optical_shackleton.npy"))
    raw_dem = np.load(os.path.join(dataset_dir, "dem", "lola_dem_shackleton.npy"))
    raw_shadow = np.load(os.path.join(dataset_dir, "shadow", "psr_shadow_shackleton.npy"))

    # Load Preprocessed Datasets
    clean_radar = np.load(os.path.join(prep_dir, "radar_cleaned.npy"))
    clean_optical = np.load(os.path.join(prep_dir, "optical_cleaned.npy"))
    clean_dem = np.load(os.path.join(prep_dir, "dem_cleaned.npy"))
    clean_shadow = np.load(os.path.join(prep_dir, "shadow_cleaned.npy"))

    fig, axes = plt.subplots(4, 2, figsize=(10, 16))
    fig.suptitle("HImDristi Phase 2: Dataset Preprocessing Pipeline (Before vs. After)", fontsize=14, fontweight='bold')

    # Row 1: Radar
    axes[0, 0].imshow(raw_radar, cmap='inferno')
    axes[0, 0].set_title("1. Radar (Raw CPR with Speckle)", fontsize=10, fontweight='bold')
    axes[0, 0].axis('off')

    axes[0, 1].imshow(clean_radar, cmap='inferno')
    axes[0, 1].set_title("1. Radar (Denoised & Normalized [0, 1])", fontsize=10, fontweight='bold')
    axes[0, 1].axis('off')

    # Row 2: Optical
    axes[1, 0].imshow(raw_optical, cmap='gray')
    axes[1, 0].set_title("2. Optical (Raw Reflectance)", fontsize=10, fontweight='bold')
    axes[1, 0].axis('off')

    axes[1, 1].imshow(clean_optical, cmap='gray')
    axes[1, 1].set_title("2. Optical (CLAHE Contrast Enhanced)", fontsize=10, fontweight='bold')
    axes[1, 1].axis('off')

    # Row 3: DEM
    axes[2, 0].imshow(raw_dem, cmap='terrain')
    axes[2, 0].set_title("3. DEM (Raw Topographic Elevation)", fontsize=10, fontweight='bold')
    axes[2, 0].axis('off')

    axes[2, 1].imshow(clean_dem, cmap='terrain')
    axes[2, 1].set_title("3. DEM (Normalized Elevation [0, 1])", fontsize=10, fontweight='bold')
    axes[2, 1].axis('off')

    # Row 4: Shadow
    axes[3, 0].imshow(raw_shadow, cmap='bone')
    axes[3, 0].set_title("4. Shadow (Raw Illumination Map)", fontsize=10, fontweight='bold')
    axes[3, 0].axis('off')

    axes[3, 1].imshow(clean_shadow, cmap='bone')
    axes[3, 1].set_title("4. Shadow (Morphologically Cleaned Binary Mask)", fontsize=10, fontweight='bold')
    axes[3, 1].axis('off')

    plt.tight_layout()
    output_path = os.path.join(dataset_dir, "phase2_preprocessing_comparison.png")
    plt.savefig(output_path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved Phase 2 comparison plot -> {output_path}")

if __name__ == "__main__":
    generate_preprocessing_comparison()

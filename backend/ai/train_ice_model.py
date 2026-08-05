import os
import json
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from unet_fusion_model import LunarIceUNet

class LunarPatchDataset(Dataset):
    def __init__(self, feature_matrix, patch_size=256, num_samples=120):
        self.feature_matrix = feature_matrix
        self.patch_size = patch_size
        self.num_samples = num_samples
        
        H, W, C = feature_matrix.shape
        self.patches_x = []
        self.patches_y = []
        
        np.random.seed(42)
        for _ in range(num_samples):
            r = np.random.randint(0, H - patch_size + 1)
            c = np.random.randint(0, W - patch_size + 1)
            
            patch = feature_matrix[r:r+patch_size, c:c+patch_size, :]
            # Channel format (C, H, W) for PyTorch
            patch_tensor = torch.tensor(patch.transpose(2, 0, 1), dtype=torch.float32)
            
            # Physics ground truth target (CPR > 0.45 & Shadow == 1)
            cpr = patch[:, :, 0]
            shadow = patch[:, :, 3]
            gt_mask = ((cpr > 0.45) & (shadow > 0.5)).astype(np.float32)
            gt_tensor = torch.tensor(gt_mask, dtype=torch.float32).unsqueeze(0)
            
            self.patches_x.append(patch_tensor)
            self.patches_y.append(gt_tensor)

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        return self.patches_x[idx], self.patches_y[idx]

class BCEDiceLoss(nn.Module):
    def __init__(self):
        super().__init__()
        self.bce = nn.BCEWithLogitsLoss()

    def forward(self, logits, targets):
        bce_loss = self.bce(logits, targets)
        probs = torch.sigmoid(logits)
        intersection = (probs * targets).sum()
        dice_loss = 1.0 - (2.0 * intersection + 1.0) / (probs.sum() + targets.sum() + 1.0)
        return bce_loss + dice_loss

def train_and_evaluate_model():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    prep_matrix_path = os.path.join(base_dir, "dataset", "preprocessed", "preprocessed_stacked_features.npy")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    if not os.path.exists(prep_matrix_path):
        raise FileNotFoundError(f"Preprocessed matrix not found at {prep_matrix_path}")

    feature_matrix = np.load(prep_matrix_path)
    print(f"[+] Loaded Preprocessed Features shape: {feature_matrix.shape}")

    # Train / Val Split
    dataset = LunarPatchDataset(feature_matrix, patch_size=256, num_samples=100)
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_ds, val_ds = torch.utils.data.random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_ds, batch_size=4, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=4, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[+] Training on device: {device}")

    model = LunarIceUNet(in_channels=4, out_channels=1).to(device)
    criterion = BCEDiceLoss()
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

    epochs = 12
    print("==================================================")
    print("  Training Phase 3 PyTorch LunarIceUNet Model     ")
    print("==================================================")

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        for x_b, y_b in train_loader:
            x_b, y_b = x_b.to(device), y_b.to(device)
            optimizer.zero_grad()
            logits = model(x_b)
            loss = criterion(logits, y_b)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()

        train_loss /= len(train_loader)
        print(f"Epoch [{epoch:02d}/{epochs:02d}] - Loss: {train_loss:.4f}")

    # --- Evaluation Metrics ---
    model.eval()
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for x_b, y_b in val_loader:
            x_b, y_b = x_b.to(device), y_b.to(device)
            logits = model(x_b)
            probs = torch.sigmoid(logits)
            preds = (probs > 0.5).float()

            all_preds.append(preds.cpu().numpy().flatten())
            all_targets.append(y_b.cpu().numpy().flatten())

    preds_arr = np.concatenate(all_preds)
    targets_arr = np.concatenate(all_targets)

    tp = np.sum((preds_arr == 1) & (targets_arr == 1))
    fp = np.sum((preds_arr == 1) & (targets_arr == 0))
    tn = np.sum((preds_arr == 0) & (targets_arr == 0))
    fn = np.sum((preds_arr == 0) & (targets_arr == 1))

    accuracy = float((tp + tn) / len(targets_arr))
    precision = float(tp / (tp + fp + 1e-8))
    recall = float(tp / (tp + fn + 1e-8))
    f1_score = float(2.0 * precision * recall / (precision + recall + 1e-8))
    iou = float(tp / (tp + fp + fn + 1e-8))

    metrics = {
        "model_architecture": "LunarIceUNet (Multi-Modal PyTorch Deep Learning)",
        "epochs": epochs,
        "device": str(device),
        "accuracy_pct": round(accuracy * 100.0, 2),
        "precision_pct": round(precision * 100.0, 2),
        "recall_pct": round(recall * 100.0, 2),
        "f1_score_pct": round(f1_score * 100.0, 2),
        "iou_pct": round(iou * 100.0, 2),
        "confusion_matrix": {
            "true_positives": int(tp),
            "false_positives": int(fp),
            "true_negatives": int(tn),
            "false_negatives": int(fn)
        }
    }

    # Save Model Weights & Metrics
    weights_path = os.path.join(models_dir, "lunar_ice_fusion_model.pth")
    metrics_path = os.path.join(models_dir, "model_metrics.json")

    torch.save(model.state_dict(), weights_path)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print("==================================================")
    print(f"[SUCCESS] Model Weights Saved -> {weights_path}")
    print(f"[SUCCESS] Model Metrics Saved -> {metrics_path}")
    print("--------------------------------------------------")
    print(f"  Accuracy:  {metrics['accuracy_pct']}%")
    print(f"  Precision: {metrics['precision_pct']}%")
    print(f"  Recall:    {metrics['recall_pct']}%")
    print(f"  F1-Score:  {metrics['f1_score_pct']}%")
    print(f"  IoU Score: {metrics['iou_pct']}%")
    print("==================================================")

if __name__ == "__main__":
    train_and_evaluate_model()

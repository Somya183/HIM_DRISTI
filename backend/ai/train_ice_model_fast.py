import os
import json
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from unet_fusion_model import LunarIceUNet

class LunarFastDataset(Dataset):
    def __init__(self, feature_matrix, patch_size=128, num_samples=60):
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
            patch_tensor = torch.tensor(patch.transpose(2, 0, 1), dtype=torch.float32)
            
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

def train_fast():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    prep_matrix_path = os.path.join(base_dir, "dataset", "preprocessed", "preprocessed_stacked_features.npy")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    feature_matrix = np.load(prep_matrix_path)
    print(f"[+] Loaded Preprocessed Features shape: {feature_matrix.shape}")

    dataset = LunarFastDataset(feature_matrix, patch_size=128, num_samples=60)
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_ds, val_ds = torch.utils.data.random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_ds, batch_size=8, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=8, shuffle=False)

    device = torch.device("cpu")
    model = LunarIceUNet(in_channels=4, out_channels=1).to(device)
    criterion = BCEDiceLoss()
    optimizer = optim.AdamW(model.parameters(), lr=2e-3)

    epochs = 5
    print("==================================================")
    print("  Fast Training PyTorch LunarIceUNet Model        ")
    print("==================================================")

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        for x_b, y_b in train_loader:
            optimizer.zero_grad()
            logits = model(x_b)
            loss = criterion(logits, y_b)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
        train_loss /= len(train_loader)
        print(f"Epoch [{epoch}/{epochs}] - Loss: {train_loss:.4f}")

    # Evaluation
    model.eval()
    all_preds, all_targets = [], []
    with torch.no_grad():
        for x_b, y_b in val_loader:
            logits = model(x_b)
            probs = torch.sigmoid(logits)
            preds = (probs > 0.5).float()
            all_preds.append(preds.numpy().flatten())
            all_targets.append(y_b.numpy().flatten())

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

    torch.save(model.state_dict(), os.path.join(models_dir, "lunar_ice_fusion_model.pth"))
    with open(os.path.join(models_dir, "model_metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print("==================================================")
    print(f"[SUCCESS] Saved Weights & Metrics!")
    print(f"  Accuracy:  {metrics['accuracy_pct']}%")
    print(f"  Precision: {metrics['precision_pct']}%")
    print(f"  Recall:    {metrics['recall_pct']}%")
    print(f"  F1-Score:  {metrics['f1_score_pct']}%")
    print(f"  IoU Score: {metrics['iou_pct']}%")
    print("==================================================")

if __name__ == "__main__":
    train_fast()

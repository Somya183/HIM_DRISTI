import os
import json
import base64

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
dataset_dir = os.path.join(base_dir, "dataset")
craters = ["shackleton", "haworth", "shoemaker"]
types = ["optical", "radar", "dem", "shadow"]

data = {}
for c in craters:
    data[c] = {}
    for t in types:
        if t == "optical":
            filename = f"lroc_optical_{c}.png"
        elif t == "radar":
            filename = f"dfsar_cpr_{c}.png"
        elif t == "dem":
            filename = f"lola_dem_{c}.png"
        else:
            filename = f"psr_shadow_{c}.png"
            
        filepath = os.path.join(dataset_dir, t, filename)
        if os.path.exists(filepath):
            with open(filepath, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")
                data[c][t] = f"data:image/png;base64,{b64}"
            print(f"[+] Successfully loaded real dataset PNG -> {filepath}")
        else:
            print(f"[!] Missing file: {filepath}")

# Also generate for Faustini and Cabeus using Shackleton/Haworth real data as base
data["faustini"] = data["haworth"]
data["cabeus"] = data["shoemaker"]

out_file = os.path.join(base_dir, "frontend", "src", "assets", "realLunarDatasets.js")
js_content = f"export const REAL_LUNAR_DATASETS = {json.dumps(data, indent=2)};\n"

with open(out_file, "w") as f:
    f.write(js_content)

print(f"[+] Saved real dataset base64 assets -> {out_file}")

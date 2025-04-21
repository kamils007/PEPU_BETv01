import json
import random
import os

TOTAL_CARDS = 240
WIN_PROBABILITY = 0.2  # 20% szans na wygraną

OUTPUT_DIR = "metadata"
IMAGE_BASE_URI = "ipfs://bafybeiaa2gmkdreooy6gouczboxjzwylqpfjkgxfjbimvwrzxf4w2dldiq"  # ← podmień na swój CID z IPFS!

os.makedirs(OUTPUT_DIR, exist_ok=True)

for i in range(TOTAL_CARDS):
    is_winner = random.random() < WIN_PROBABILITY
    metadata = {
        "name": f"Zdrapka #{i}",
        "description": "Unikalna zdrapka PEPU – odkryj co wygrałeś!",
        "image": f"{IMAGE_BASE_URI}/{i}.png",  # obrazek IPFS (lub placeholder)
        "attributes": [
            {"trait_type": "ID", "value": i},
            {"trait_type": "Status", "value": "Wygrana" if is_winner else "Przegrana"},
            {"trait_type": "Typ", "value": "Zdrapka PEPU"}
        ],
        "isWinner": is_winner
    }

    with open(os.path.join(OUTPUT_DIR, f"{i}.json"), "w") as f:
        json.dump(metadata, f, indent=2)

print(f"✅ Wygenerowano {TOTAL_CARDS} plików metadanych w folderze '{OUTPUT_DIR}'")

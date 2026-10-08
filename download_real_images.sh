#!/bin/bash
set -e

mkdir -p public/assets/images src/assets/images public/images public/src/assets/images

echo "Downloading real car images..."

# 1. Land Cruiser 300 VXR Real Showroom Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/1/1a/Toyota_Land_Cruiser_300_4x4_VXR_2023_%281%29.jpg" -o public/assets/images/car_landcruiser_vxr_1790462842346.jpg

# 2. Highlander XSE 2021 Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/1/11/2021_Toyota_Highlander_XSE_%28United_States%29_front_view.jpg" -o public/assets/images/car_highlander_xse_1790462851011.jpg

# 3. Highlander Limited Edition Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/2/2a/%2717_Toyota_Highlander.jpg" -o public/assets/images/car_highlander_limited_1790462852222.jpg

# 4. Lexus RX350 2017 Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lexus_RX_2016_Corner.jpg" -o public/assets/images/car_lexus_rx350_1790462861358.jpg

# 5. Toyota Camry 2010 XV40 Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/0/00/2010_Toyota_Camry_LE_%282009-01-18%29.jpg" -o public/assets/images/car_camry_2010_1790462872857.jpg

# 6. Indomie Box Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/2/2b/Indomie_%28box%29.jpg" -o public/assets/images/jumia_indomie_chicken_carton.jpg

# 7. Romoss/Oraimo Power Bank Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/5/56/A_Romoss_power_bank-20210312.jpg" -o public/assets/images/jumia_oraimo_powerbank_30000mah.jpg

# 8. Smartwatch Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/b/bb/Smartwatches.jpg" -o public/assets/images/jumia_oraimo_smartwatch.jpg

# 9. Electric Fan Real Photo
curl -s -L -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/2/22/ELECTRIC_FAN_%287174555233%29.jpg" -o public/assets/images/jumia_electric_standing_fan.jpg

echo "Copying to redundant asset folders..."
cp public/assets/images/* src/assets/images/
cp public/assets/images/* public/images/
cp public/assets/images/* public/src/assets/images/

echo "Done downloading and copying!"

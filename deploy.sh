#!/bin/bash
# run : chmod +x deploy.sh
# run : ./deploy.sh

# 1. ดึงโค้ดล่าสุด
git pull

# 2. ติดตั้ง dependencies
yarn install

# 3. อัพเดท Sql schema
yarn push

# 4. Build NestJs
yarn build

# 5. Reload PM2
pm2 reload ecosystem.config.js --env production
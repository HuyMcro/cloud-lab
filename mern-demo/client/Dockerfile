FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Khai báo cổng lắng nghe và lệnh chạy Preview cho Vite React
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
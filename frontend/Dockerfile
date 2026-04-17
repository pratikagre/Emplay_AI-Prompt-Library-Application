FROM node:18-alpine

WORKDIR /app

# Add a script to run exactly what is needed since we created it manually
COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

# Since we define Vite config to listen on 0.0.0.0, npm run dev will work for container
CMD ["npm", "run", "dev"]

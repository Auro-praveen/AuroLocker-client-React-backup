FROM node:16 As build
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build


# Step 2: Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to the Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD [ "nxinx", "-g", "daemon off;" ]
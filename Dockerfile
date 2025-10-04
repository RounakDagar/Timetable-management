# 1. Start with a base that has Nginx
FROM nginx:alpine

# 2. Copy your built React app into the Nginx server directory
COPY build /usr/share/nginx/html

# 3. Tell Docker that the web server uses port 80
EXPOSE 80

# 4. The command to start the Nginx server
CMD ["nginx", "-g", "daemon off;"]

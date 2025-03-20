FROM nginx:alpine

# Ensure the www-data user exists (if missing)
RUN id -u www-data &>/dev/null || adduser -S www-data -G www-data

# Create Certbot challenge directory with correct ownership
RUN mkdir -p /var/www/certbot && chown -R www-data:www-data /var/www/certbot

COPY nginx.conf /etc/nginx/nginx.conf
COPY ./prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
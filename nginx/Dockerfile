FROM nginx:alpine
COPY ./prod.conf /etc/nginx/conf.d/prod.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
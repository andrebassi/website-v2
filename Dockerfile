FROM alpine:3.21

RUN apk add --no-cache darkhttpd

WORKDIR /var/www

COPY . .

EXPOSE 8080

CMD ["darkhttpd", "/var/www", "--port", "8080", "--addr", "0.0.0.0"]

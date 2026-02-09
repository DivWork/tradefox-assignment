IMAGE_NAME=trading-portfolio-service
CONTAINER_NAME=trading-portfolio

build:
	docker build -t $(IMAGE_NAME) .

start:
	docker run -d \
		-p 3000:3000 \
		--name $(CONTAINER_NAME) \
		$(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

logs:
	docker logs -f $(CONTAINER_NAME)

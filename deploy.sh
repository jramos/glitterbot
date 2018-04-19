#!/bin/sh

ECR=804879515677.dkr.ecr.us-east-1.amazonaws.com

eval $(aws ecr get-login --no-include-email --region us-east-1)

docker build -t glitterbot:latest .
docker tag glitterbot:latest $ECR/glitterbot:latest
docker push $ECR/glitterbot:latest

aws s3 cp public/ s3://glitterbot/ --recursive --acl public-read

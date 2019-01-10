#!/bin/sh

ECR=804879515677.dkr.ecr.us-east-1.amazonaws.com

eval $(aws ecr get-login --no-include-email --region us-east-1)

docker build -t glitterbot:latest .
docker tag glitterbot:latest $ECR/glitterbot:latest
docker push $ECR/glitterbot:latest

for DIR in en ja nl; do
  aws s3 sync public/$DIR/ s3://glitterbot/$DIR/ --acl public-read --delete
done

kubectl delete -f deploy/deployment.yml
kubectl create -f deploy/deployment.yml

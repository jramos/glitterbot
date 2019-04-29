#!/bin/sh

KUBECTL=${KUBECTL:-"$HOME/bin/kubectl-v1.9.11"}
ECR="804879515677.dkr.ecr.us-east-1.amazonaws.com"
TAG=${TAG:-"latest"}

eval $(aws ecr get-login --no-include-email --region us-east-1)

docker build -t glitterbot:${TAG} .
docker tag glitterbot:${TAG} $ECR/glitterbot:${TAG}
docker push $ECR/glitterbot:${TAG}

for DIR in en ja nl; do
  aws s3 sync public/$DIR/ s3://glitterbot/$DIR/ --acl public-read --delete
done

$KUBECTL delete -f deploy/deployment.yml
$KUBECTL create -f deploy/deployment.yml

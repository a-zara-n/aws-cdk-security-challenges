init:
	cd ./deploy && \
	docker compose build --no-cache && \
    docker compose run --rm installer bash -c "bash /app/init.sh" 

synth:
	cd ./deploy && \
	docker compose run --rm cdk bash -c "cdk synth --all"

setup:
	cd ./deploy && \
	docker compose run --rm cdk bash -c "cdk deploy -O ../frontend/aws.json Challenge1ApplicationStack Challenge2ApplicationStack Challenge3ApplicationStack Challenge4ApplicationStack" && \
	docker compose run --rm react bash -c "bash ./react-build.sh" && \
	docker compose run --rm cdk bash -c "cdk deploy Challenge1DeploymentStack Challenge2DeploymentStack Challenge3DeploymentStack Challenge4DeploymentStack"

destroy:
	cd ./deploy && \
	docker compose run --rm cdk bash -c "cdk destroy -f"

bash-cdk:
	cd ./deploy && \
	docker compose run --rm cdk bash

bash-react:
	cd ./deploy && \
	docker compose run --rm react  bash
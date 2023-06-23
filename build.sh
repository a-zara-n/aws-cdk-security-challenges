pushd ./deploy
    docker compose build
    docker compose run --rm installer bash -c "bash /app/init.sh"
    docker compose run --rm react bash -c "npm run build"
popd
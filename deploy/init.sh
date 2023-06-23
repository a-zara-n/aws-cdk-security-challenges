pushd /app/cdk
    if [ ! -d "node_modules" ]; then
        npm install
    fi
popd

for DIR in $( ls -d /app/frontend/*/ ); do
    if [ ! -d "$DIR/node_modules" ]; then
        echo "Installing node_modules for $DIR"
        pushd $DIR
            npm install
        popd
    fi
done


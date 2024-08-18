Docker compose for local development for Angular hot reload
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```
it takes overrides For simpler Dockerfile.dev and corresponding entrypoint script

For production simply use:
```
docker-compose up --build -d
```

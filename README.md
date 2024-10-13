Docker compose for local development for Angular hot reload
```
docker-compose up --build -d
```
Or explicitly:
```
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
```
it takes overrides For simpler Dockerfile.dev and corresponding entrypoint script

For production use, it will not include ".override":
```
docker-compose up -f docker-compose.yml --build -d
```

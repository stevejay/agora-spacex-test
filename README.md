# Title

## Building the Web site Docker image

The image currently needs to be manually built locally and then pushed to Docker Hub. The image is built and pushed with a tag of `latest`.

First log in to Docker:

```bash
docker login -u yourusername
[enter your password]
```

Then build and push the image:

```bash
docker build --tag stevejay/agora-spacex-testatest --file Dockerfile .
docker push stevejay/agora-spacex-testatest
```

### Building and running locally

If you want to test building and running the image locally, then run the following command from the project root: `docker-compose up --force-recreate --build --detach`. You should now be able to access the Web site at `http://localhost:6008/`.

## Issues

- `@typescript-eslint/eslint-plugin` version is locked to v5.33.0 because of [a bug with the latest version](https://github.com/typescript-eslint/typescript-eslint/issues/5525).
- Storybook needs to be run with node v16, not a later major version.

# reverielabs-challenge

- [reverielabs-challenge](#reverielabs-challenge)
  - [Backend](#backend)
    - [Caching](#caching)
  - [Client](#client)
    - [Local Dev](#local-dev)
    - [Production-like](#production-like)
  - [Docker](#docker)

## Backend

The backend is a very simple express server that has a single RESTful GET endpoint.

You can run the backend with:

```sh
cd ./api;
npm install;
npm run start;
```

Then view the following in your browser or hit it with curl/postman/etc.

http://localhost:7000/chembl/CHEMBL203

Any valid CHEMBL ID should work.

### Caching

There is an extremely simple in-memory cache that stores the results of the requests so subsequent requests are very fast.

This is not a good production solution.

In practice, I would pick one of the following:

- Use Redis to cache the data with an expiration
- Run a cron job to ETL the data into a SQL database and, after the ETL process finishes, aggregate the data in normalized tables with another cron job.
  Tools like Airflow, Flyte, Prefect, etc. can also be used for this purpose.

The later is much more common for this sort of problem.

## Client

The client is a simple Create React App setup using [recharts](https://recharts.org/en-US/) for some simple charting.

### Local Dev

```sh
cd ./client;
npm install;
npm run start;
```

### Production-like

To get everything working simply in single Docker container, I have a very simple setup to serve the built react app.

To get this working:

```sh
cd ./client;
npm install;
npm run build;
```

Then run the API with the instructions above and view http://localhost:7000

This is not a great production setup.  
Typically in production the `client/build` folder would be uploaded to a CDN like AWS CloudFront or Azure CDN and served directly as an index.html file.

This is much cheaper and faster than a server-side deploy.

## Docker

The docker build can serve both the API and the client and should be easy to get working locally.

```sh
./docker-build.sh
./docker-run.sh
```

Then view http://localhost:7000

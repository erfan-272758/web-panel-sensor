## Deploy
1. Clone the repository and navigate to its directory.
2. For each application, create a `.env.local` file in its respective directory based on the `.env` file. Follow the structure below:
```bash
# For the back-api application, create back-api/.env.local:
INFLUX_URL="http://influx:8086"
INFLUX_TOKEN=influx-token
PORT=2781
AUTH_SECRET="auth-secret"
ADMIN_USER=admin
ADMIN_PASS=admin

# For the client application, create client/.env.local:
WS_PORT=2780
WS_HOST="127.0.0.1"
RABBIT_PORT=5672
RABBIT_HOST="127.0.0.1"
RABBIT_USER=rabbit-user
TOKEN=rabbit-token

```
3. After ensuring that you have created all the necessary `.env.local` files, run `docker-compose up` or `docker compose up`.
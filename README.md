# SharkRadar

## Quick setup

1. Clone the repository
2. Install the node packages:
    ```bash
    npm i
    ```
3. Create the `.env` file in the root directory and add the following:
    ```bash
    DB_USERNAME=<username>
    DB_PASSWORD=<password>
    SESSION_SECRET=TestSessionSecret
    PORT=3030
    ```
    *(replace `<>` fields with user credentials)*
4. Run the build:
    ```bash
    npm run build
    ```
    *(or `build:watch` to watch for changes)*
5. Run the server:
    ```bash
    npm run server
    ```
    *(or `server:watch` to watch for changes)*
6. Go to: http://localhost:3030

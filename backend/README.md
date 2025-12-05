# Ecom Backend

This is the backend service for the Ecom System, built with Go (Fiber) and MongoDB. It provides API endpoints for user authentication (only guest login), product management and campaigns management system.

### Prerequisites

Ensure you have the following installed on your system:

- [Go](https://go.dev/dl/) (version 1.24 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/faiisu/ecom-backend.git
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```

### Configuration

Create a `.env` file in the root directory of the project. You can copy the example below:

```env
PORT=8080
MONGO_URL=mongodb://localhost:8080
MONGO_DB_NAME=ecom_db
```

| Variable        | Description                                      | Default                     |
| :-------------- | :----------------------------------------------- | :-------------------------- |
| `PORT`          | The port the server will listen on.              | `8080`                      |
| `MONGO_URL`     | The connection string for your MongoDB instance. | `mongodb://localhost:8080` |
| `MONGO_DB_NAME` | The name of the database to use.                 | `ecom_db`                   |

### Running the Application

To run the application in development mode with hot reload (using [Air](https://github.com/air-verse/air)):

```bash
air
```

Or run it directly with Go:

```bash
go run main.go
```

The server will start on `http://localhost:8080` (or the port specified in your `.env`).

## API Documentation

Swagger API documentation is available at:

[http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html).

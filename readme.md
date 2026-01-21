# Task Management Application

This repository contains a simple Task Management Application with a Node/Express backend and a React frontend.

## Prerequisites ✅

- Node.js v22.14.0 (or compatible Node 22.x)
- npm (bundled with Node)
- Docker & Docker Compose (optional, for containerized run)


## Run locally (recommended)

### 1) Start the backend

1. Open a terminal and go to the `Backend` folder:

```bash
cd Backend
```

2. Install dependencies and start the server:

```bash
npm install
npm start
```

3. The backend listens on port 8082 by default. Verify the server is up:

```bash
curl http://localhost:8082/health
```

### 2) Start the frontend

1. Create a `.env` file in the `Frontend` folder and add the backend URL:

```
REACT_APP_BACKEND_URL=http://localhost:8082
```

2. Install dependencies and start the dev server:

```bash
cd Frontend
npm install
npm start
```

3. The React app runs by default on http://localhost:3000


## Run with Docker 🐳

From the repository root you can build and run both services using Docker Compose:

```bash
docker-compose up --build
```

This will expose the backend on port `8082` and the frontend on port `3000` as configured in `docker-compose.yaml`.


## Tests & scripts

- Backend smoke test:
- Run the following command only after starting the backend server.

```bash
cd Backend
npm run smoke-test
```


---

# Note!

- Start the backend first, then start the frontend (the frontend needs the backend URL to be set).
- To stop local servers, press `Ctrl+C` in each terminal.



# For K8S

### **Step 1: Switch to Minikube’s Docker**

Run this **in the same terminal** before building images:

```bash
eval $(minikube docker-env)
```

This makes your `docker build` commands build images **inside Minikube**, so Kubernetes can use them directly.

You can check:

```bash
docker info | grep "Docker Root Dir"
```

It should point to a Minikube path, not your host Docker.

---

### **Step 2: Rebuild the Images**

```bash
docker build -t be:latest ./Backend
docker build -t fe:latest ./Frontend
```

Check they exist:

```bash
docker images
```

You should see `be:latest` and `fe:latest` **without needing `minikube image load`**.

---

### **Step 3: Delete old pods and redeploy**

```bash
kubectl delete deployment task-app
kubectl delete svc task-app-service
kubectl apply -f app-pod.yaml
kubectl apply -f service.yaml
```

Check pods:

```bash
kubectl get pods -o wide
```

---

### **Step 4: Access the service**

```bash
minikube ip
```

Suppose it returns `192.168.49.2`. Your NodePort is `30081`, so:

```bash
curl http://192.168.49.2:30081
```
## You'll see the Application Working
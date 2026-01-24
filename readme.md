# Task Management Application

Task Management Application with Node/Express backend and React frontend, containerized with Docker and Kubernetes.

## What Each File Does

### Dockerfiles

**Backend/Dockerfile** - Builds the backend container:
- Installs production dependencies
- Copies backend code
- Runs on port 8082
- Creates data directory for SQLite database

**Frontend/Dockerfile** - Builds the frontend container:
- Builds React app for production
- Serves static files using `serve`
- Runs on port 3000
- Connects to backend at localhost:8082

### docker-compose.yaml

Defines how to run both containers together:
- Backend service on port 8082
- Frontend service on port 3000
- Shared network for communication
- Volume for backend data storage

### Jenkinsfile

Automates building and deploying:
- Checks out code from repository
- Builds Docker images with version tags
- Pushes images to Docker Hub
- Deploys to Kubernetes and updates running containers

### Kubernetes Files (k8s/)

**namespace.yaml** - Creates a separate space called "task-management" for the app

**deployment.yaml** - Defines how to run the app:
- Creates 2 copies (replicas) for availability
- Each copy has 2 containers: frontend and backend
- Sets memory and CPU limits
- Configures environment variables

**service.yaml** - Makes the app accessible:
- Exposes frontend on port 30080
- Exposes backend on port 30082
- Load balances traffic between the 2 copies

## Docker Setup


### Check Status

```bash
kubectl get pods -n task-management
kubectl get service -n task-management
kubectl get deployment -n task-management

kubectl get all -n task-management
```

### Access Application

### Update Deployment

```bash
kubectl set image deployment/task-management-app \
  backend=someone15me/dp:backend-latest \
  frontend=someone15me/dp:frontend-latest \
  -n task-management
```

### Delete Everything

```bash
kubectl delete -f k8s/
```

## Local Development

### Backend

```bash
cd Backend
npm install
npm start
```

Backend runs on http://localhost:8082

### Frontend

Create `Frontend/.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8082
```

```bash
cd Frontend
npm install
npm start
```

Frontend runs on http://localhost:3000


---

## 🐳 Step 1: Install Docker

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
```

Add Jenkins user to Docker group:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Reboot recommended.

---

## 🕸️ Step 2: Install Minikube & kubectl

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl
```


## 🎯 Step 3: Install and Set up Jenkins

```bash
sudo apt update
sudo apt install fontconfig openjdk-21-jre
java -version
```

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins
```

### Start Jenkins
- You can enable the Jenkins service to start at boot with the command:
```bash
sudo systemctl enable jenkins
```
- You can start the Jenkins service with the command:

```bash
sudo systemctl start jenkins
```
- You can check the status of the Jenkins service using the command:

```bash
sudo systemctl status jenkins
```

## ⭐ CRITICAL STEP


Run:

```bash
kubectl config view --raw --flatten > kubeconfig-inline.yaml
```

### What this does

* Embeds certs as base64
* Removes references to `/home/<user>/.minikube`
* Makes kubeconfig portable and CI-safe

✅ This is the file Jenkins will use.


## 🧩 Configure Jenkins Credentials

In Jenkins UI:

```
Manage Jenkins
→ Credentials
→ (Global)
→ Add Credentials
```

* **Kind:** Secret file
* **ID:** `kubeconfig`
* **File:** `kubeconfig.yaml`
* **Description:** Kubernetes config (inline certs)

Save.

---

## 🔑 Docker Hub Credentials

Add Docker Hub credentials in Jenkins:

* **Kind:** Username with password
* **ID:** `dockerhub-creds`
* **Username:** your Docker Hub username
* **Password:** Docker Hub access token (recommended)

---

## Check logs of the buid

If Jenkins can run:

```bash
kubectl get all -n task-management
```

## Local Development

### Backend

```bash
cd Backend
npm install
npm start
```

Backend runs on [http://localhost:8082](http://localhost:8082)

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

Frontend runs on [http://localhost:3000](http://localhost:3000)

---

## 🐳 Step 1: Install Docker

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
```

## Add current user to Docker group

```bash
sudo usermod -aG docker $USER
newgrp docker
docker ps
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

---

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

## Add Jenkins user to Docker group

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Start Jenkins

```bash
sudo apt install -y kubectl
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

## Increase Jenkins stability (recommended)

Edit:

```bash 
sudo nano /etc/default/jenkins 
```


Add:

```bash 
JAVA_ARGS="-Djenkins.install.runSetupWizard=false -Xms512m -Xmx2048m" 
```

Restart:

```bash 
sudo systemctl restart jenkins 
```

## Fix kubectl context
```bash 
kubectl config use-context minikube
kubectl get nodes
kubectl create namespace task-management

```
## Create CI/CD pipeline in Jenkins

### 1. Log In to Jenkins

<img width="1273" height="675" alt="image" src="https://github.com/user-attachments/assets/dcfdd8cf-7deb-4a2a-bdc8-48221b2a9cae" />

### 2. Redirected to the Jenkins Dashboard

When you logged in, you will be redirected to the Jenkins console or dashboard.

### 3. Create a New Project

<img width="1267" height="677" alt="image" src="https://github.com/user-attachments/assets/b0d53ca9-a007-4e89-b1e8-805b9b40c95e" />

### 4. Configure the Project Type

<img width="1268" height="679" alt="image" src="https://github.com/user-attachments/assets/3a52a946-c8ac-49fb-9275-f534c8d30669" />

### 5. Configure the General Section

<img width="1273" height="672" alt="image" src="https://github.com/user-attachments/assets/6b534809-d8ac-413f-8418-dc4fc37f17f8" />

### 6. Set Build Triggers

<img width="1272" height="672" alt="image" src="https://github.com/user-attachments/assets/f77dbea6-3989-40fd-954d-952626c04633" />

### 7. Configure the Pipeline Section

<img width="1272" height="677" alt="image" src="https://github.com/user-attachments/assets/ad7ddfe7-c79b-44f7-ba16-a7181340f60d" />

### 8. Save the Pipeline 

<img width="1272" height="676" alt="image" src="https://github.com/user-attachments/assets/8620ae11-0de4-48d2-8af8-46cf1a0f7468" />

---

## ⭐ CRITICAL STEP

```bash
kubectl config view --raw --flatten > kubeconfig.yaml
```

### What this does

* Embeds certs as base64
* Removes references to `/home/<user>/.minikube`
* Makes kubeconfig portable and CI-safe

✅ This is the file Jenkins will use.

---

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

### Check Status

```bash
kubectl get pods -n task-management
kubectl get service -n task-management
kubectl get deployment -n task-management
kubectl get all -n task-management
``

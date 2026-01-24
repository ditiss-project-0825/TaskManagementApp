Alright 😎 here it is — **properly decorated**, clean, and **not a single letter touched** inside your content.
All styling is **around** it, never inside. 👌

---

## 🚀 **SonarQube + Jenkins Setup (Production-Ready)**

---

### 🧠 **1️⃣ Kernel Tuning (MANDATORY for SonarQube)**

```bash
sudo sysctl -w vm.max_map_count=262144
sudo sysctl -w fs.file-max=65536
```

**Persist it:**

```bash
sudo nano /etc/sysctl.conf
```

**Add:**

```bash
vm.max_map_count=262144
fs.file-max=65536
```

**Apply:**

```bash
sudo sysctl -p
```

---

### 📦 **2️⃣ Create Docker Volumes**

```bash
docker volume create sonarqube_data
docker volume create sonarqube_logs
docker volume create sonarqube_extensions
```

---

### 🐳 **3️⃣ Run SonarQube Container**

```bash
docker run -d \
 --name sonarqube \
 --restart unless-stopped \
 -p 9000:9000 \
 -v sonarqube_data:/opt/sonarqube/data \
 -v sonarqube_logs:/opt/sonarqube/logs \
 -v sonarqube_extensions:/opt/sonarqube/extensions \
 sonarqube:lts
```

**Check:**

```bash
docker ps
docker logs -f sonarqube
```

---

### 🌐 **4️⃣ Access Both Services**

```
Service URL
Jenkins http://<VM-IP>:8080
SonarQube http://<VM-IP>:9000
```

---

### ⚙️ **5️⃣ Jenkins Configuration (IMPORTANT CHANGE)**

**When Jenkins and SonarQube are on same VM:**

```
SonarQube Server URL in Jenkins
http://localhost:9000
```

✔ Faster
✔ No firewall issues
✔ Cleaner setup

---

### 📊 **Monitoring & Health Checks**

```bash
htop
docker stats
```

---

✨ Clean
✨ Readable
✨ Production-ready

If you want this converted into **README.md**, **Confluence**, or **Notion format**, say the word 💬

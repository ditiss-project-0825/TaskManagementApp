1️⃣ Kernel Tuning (MANDATORY for SonarQube)
sudo sysctl -w vm.max_map_count=262144
sudo sysctl -w fs.file-max=65536

Persist it:

sudo nano /etc/sysctl.conf

Add:

vm.max_map_count=262144
fs.file-max=65536

Apply:

sudo sysctl -p

2️⃣ Create Docker Volumes
docker volume create sonarqube_data
docker volume create sonarqube_logs
docker volume create sonarqube_extensions

3️⃣ Run SonarQube Container
docker run -d \
 --name sonarqube \
 --restart unless-stopped \
 -p 9000:9000 \
 -v sonarqube_data:/opt/sonarqube/data \
 -v sonarqube_logs:/opt/sonarqube/logs \
 -v sonarqube_extensions:/opt/sonarqube/extensions \
 sonarqube:lts

Check:

docker ps
docker logs -f sonarqube

4️⃣ Access Both Services
Service URL
Jenkins http://<VM-IP>:8080
SonarQube http://<VM-IP>:9000
5️⃣ Jenkins Configuration (IMPORTANT CHANGE)

When Jenkins and SonarQube are on same VM:

SonarQube Server URL in Jenkins
http://localhost:9000

✔ Faster
✔ No firewall issues
✔ Cleaner setup

Monitor regularly:

htop
docker stats

⚙️ Prérequis (Requirements)
-
Java 17

Maven 3.8+

MongoDB Community Server

MongoDB Compass 

Consul

Git

Postman 

🚀 Installation & Lancement
1️⃣ Cloner le projet
git clone https://github.com/RACHIDOV10/projet-microservice-dechets.git
2️⃣ Démarrer MongoDB

MongoDB doit être lancé avant les services Spring Boot.

Par défaut, la base utilisée est :

waste-db
-
La collection sera créée automatiquement :

wastes
-

3️⃣ Démarrer Consul

En mode développement / Admin:

consul agent -dev
-
Interface web Consul :

http://localhost:8500

4️⃣ Lancer waste-service

Dans un premier terminal :

cd waste-service
mvn spring-boot:run
-
Port : 8081

Service enregistré dans Consul : waste-service

Endpoint principal :

http://localhost:8081/api/wastes

5️⃣ Lancer gateway-service

Dans un deuxième terminal :

cd gateway-service
mvn spring-boot:run
-
Port : 8082

Service enregistré dans Consul : gateway-service

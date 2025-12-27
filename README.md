Prérequis (Requirements)
-
Java 17

Maven 3.8+

MongoDB Community Server

MongoDB Compass 

Consul

Git

Postman 

Installation & Lancement
 Cloner le projet
git clone https://github.com/RACHIDOV10/projet-microservice-dechets.git
 Démarrer MongoDB

MongoDB doit être lancé avant les services Spring Boot.

Par défaut, la base utilisée est :

waste-db
-
La collection sera créée automatiquement :

wastes
-

 Démarrer Consul

En mode développement / Admin:

consul agent -dev
-
Interface web Consul :

http://localhost:8500

 Lancer waste-service

Dans un premier terminal :

cd waste-service
mvn spring-boot:run
-
Port : 8081

Service enregistré dans Consul : waste-service

Endpoint principal :

http://localhost:8081/api/wastes

Lancer gateway-service

Dans un deuxième terminal :

cd gateway-service
mvn spring-boot:run
-
Port : 8082

Service enregistré dans Consul : gateway-service



website video : 


https://github.com/user-attachments/assets/742646bb-03ec-466d-b634-0ecb2cd26350



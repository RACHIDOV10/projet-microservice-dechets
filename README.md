GreenCity 3D – WasteBot Platform
-
Plateforme de supervision de robots autonomes pour la collecte et l’analyse intelligente des déchets, basée sur une architecture microservices, une simulation 3D et un système de perception automatisée.


Prérequis (Requirements)
-
Avant de lancer le projet, assurez-vous d’avoir installé les éléments suivants :

Logiciels requis

Java JDK 17

Maven 3.8 ou supérieur

MongoDB Community Server

MongoDB Compass (optionnel, pour la visualisation)

PostgreSQL

Consul

Git

Postman (pour tester les API)

Environnements recommandés
-
Windows / Linux / macOS
IDE : IntelliJ IDEA ou VS Code

Architecture générale
-
Le projet repose sur une architecture microservices comprenant :

gateway-service : point d’entrée unique pour toutes les requêtes

admin-service : gestion des administrateurs et des paramètres système

robot-service : gestion des robots (PostgreSQL)

waste-service : gestion des données de déchets (MongoDB)

ai-service : perception intelligente et streaming vidéo

Unity 3D : simulation du robot et de l’environnement urbain

Consul : service registry et découverte des microservices

Bases de données
-
MongoDB

PostgreSQL



Installation & Lancement
-
Cloner le projet

git clone https://github.com/RACHIDOV10/projet-microservice-dechets.git
cd projet-microservice-dechets

Démarrer MongoDB et PostgreSQL
-
Démarrer Consul
-
En mode développement :

consul agent -dev
-
Interface web Consul :

http://localhost:8500

Lancer les servies :
-

### Unity scene : 


https://github.com/user-attachments/assets/f67d21c4-6034-47c5-b419-cb4d07fe3811


### website video : 


https://github.com/user-attachments/assets/742646bb-03ec-466d-b634-0ecb2cd26350



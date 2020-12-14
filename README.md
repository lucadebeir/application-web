# Application Web Marine's Recipe

## How to launch the app with online database

1. Download and install the latest version of Git : https://git-scm.com/downloads

2. Clone the project on your computer. In your terminal, type the command : **git clone https://github.com/Marine-s-Recipes/application-web.git**

3. Go to the folder of the cloned project from your device : **cd application-web**

4. To install all the modules necessary for the test to work, type the command : **npm install**

5. Then, to start the server with online database, type : **npm start** and navigate to http://localhost:4200/

## How to launch the app with locale database

1. Download and install the latest version of Git : https://git-scm.com/downloads

2. Clone the project on your computer. In your terminal, type the command : **git clone https://github.com/Marine-s-Recipes/application-web.git**

3. Go to the folder of the cloned project from your device : **cd application-web**

4. To install all the modules necessary for the test to work, type the command : **npm install**

5. And, to start the server with locale database, type the command **npm start** on the folder **application-server** (read the README file of the following git repository : https://github.com/Marine-s-Recipes/application-server.git)

6. Finally, type : **npm run start:dev** and navigate to http://localhost:4201/

## How to deploy the app

1. Go to the folder of the cloned project from your device : **cd application-web**

2. Type the command : **ng build**

3. Push your git repository

4. Go to https://dashboard.heroku.com/apps/marine-s-recipes/deploy/github and click on **Deploy Branch** at the bottom of the page in the **Manual deploy** section

5. Navigate to http://marinesrecipes.fr

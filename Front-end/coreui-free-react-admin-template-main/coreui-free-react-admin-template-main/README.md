##DOCKER dummy examples##
#Create
docker save -o coreui-imagen.tar coreui-react-app
#Load
docker load -i coreui-imagen.tar
#Run
docker run -d -p 3000:3000 --name mi-react-app coreui-react-app
#Delete
docker rm -f mi-react-app

##Extra
#Recommmended extensions for Vs Code
WSL, Docker
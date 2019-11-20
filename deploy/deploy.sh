#!/bin/bash

echo $BRANCH

echo "DEPLOYING PROD"
ssh jenkins@yoda.myunisoft.fr -p 522 /bin/bash <<'EOT'
ls
cd service_converter
git checkout master
git pull origin master
npm i
pm2 restart service_converter
exit
EOT
# if [ "$BRANCH" == 'master' ]
#   then
#     echo "DEPLOYING PROD"
#     # scp -r -P 522 -i /var/jenkins_home/.ssh/id_rsa build/* jenkins@palpatine.myunisoft.fr:/home/jenkins/preprod
#     ssh jenkins@yoda.myunisoft.fr -p 522 /bin/bash <<'EOT'
#     ls
#     cd service_converter
#     git checkout preprod
#     git pull origin preprod
#     npm i
#     pm2 restart service_converter_preprod
#     exit
# EOT
# elif [ "$BRANCH" == 'prod' ]
#   then
#     echo "DEPLOYING PROD"
#     # scp -r -P 522 -i /var/jenkins_home/.ssh/id_rsa build/* jenkins@app.myunisoft.fr:/home/jenkins/prod
#     # ssh jenkins@yoda.myunisoft.fr -p 522
#     # cd service_converter
#     # git checkout prod
#     # git pull origin prod
#     # npm i
#     # pm2 restart service_converter_prod
#     # exit
#     ssh jenkins@yoda.myunisoft.fr -p 522 /bin/bash <<'EOT'
#     cd service_converter
#     git checkout prod
#     git pull origin prod
#     npm i
#     pm2 restart service_converter_prod
#     exit
# EOT
# else
#     echo "DEPLOYING DEV"
#     # ssh 
#     ssh jenkins@yoda.myunisoft.fr -p 522 /bin/bash <<'EOT'
#     ls
#     cd service_converter
#     ls
#     git checkout dev
#     git pull origin dev
#     npm i
#     pm2 restart service_converter_dev
#     exit
# EOT
#     # scp -r -P 522 -i /var/jenkins_home/.ssh/id_rsa build jenkins@palpatine.myunisoft.fr:/home/jenkins/
#     # scp -r -P 522 -i /var/jenkins_home/.ssh/id_rsa out jenkins@palpatine.myunisoft.fr:/home/jenkins/
#     # scp -r -P 522 -i /var/jenkins_home/.ssh/id_rsa styleguide jenkins@palpatine.myunisoft.fr:/home/jenkins/
# fi

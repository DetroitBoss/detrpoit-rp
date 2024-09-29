git checkout ${1}
git pull origin ${1}

cd /root/ragemp/main/dlcrepo/dlcpacks
git stash
git pull origin ${1}
find -name '*.rpf' -print0 | xargs --null cp --parents -t ~/ragemp/main/client_packages/game_resources/dlcpacks/

cd /root/ragemp/main/src/server
git checkout ${1}
git pull origin ${1}

cd /root/ragemp/main/src/client
git checkout ${1}
git pull origin ${1}

cd /root/ragemp/main/src/web
git checkout ${1}
git pull origin ${1}

cd /root/ragemp/main/
npm i
chmod +x ragemp-server
npm run buildall

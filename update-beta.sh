cd /root/ragemp/main/ && 
git stash && 
git pull origin beta && 

cd /root/ragemp/main/dlcrepo/dlcpacks && 
git stash && 
git pull origin beta && 
find -name '*.rpf' -print0 | xargs --null cp --parents -t ~/ragemp/main/client_packages/game_resources/dlcpacks/

cd /root/ragemp/main/src/server && 
git stash && 
git pull origin beta && 

cd /root/ragemp/main/src/client && 
git stash && git pull origin beta && 

cd /root/ragemp/main/src/web && 
git stash && 
git pull origin beta && 

cd /root/ragemp/main/ && 
npm i && chmod +x ragemp-server && npm run buildall

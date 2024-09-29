cd /home/ragemp/main && 
git stash && 
git pull origin main && 

cd /home/ragemp/main/dlcrepo/dlcpacks && 
git stash && 
git pull origin main && 
find -name '*.rpf' -print0 | xargs --null cp --parents -t /home/ragemp/main/client_packages/game_resources/dlcpacks/

cd /home/ragemp/main/src/server && 
git stash && 
git pull origin main && 

cd /home/ragemp/main/src/client && 
git stash && 
git pull origin main && 

cd /home/ragemp/main/src/web && 
git stash && 
git pull origin main &&
 
cd /home/ragemp/main/ && npm i && chmod +x ragemp-server && npm run buildall
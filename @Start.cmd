@echo off
title Restarter GTAV server
color 0a
:top
echo Server has been started at %time% !
start /wait ragemp-server.exe
echo Server has crashed at %time%, restarting!
color 0c
goto top
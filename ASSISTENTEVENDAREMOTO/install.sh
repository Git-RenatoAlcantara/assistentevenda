#!/bin/bash

#============== CODIGOS ESTILOS ============#
Bold=$(tput bold)
Norm=$(tput sgr0)
Yellow=$(tput setaf 3)
Red=$(tput setaf 1)
Green=$(tput setaf 2)
Magenta=$(tput setaf 5)
#============================================#

install_npm(){

    apt install npm

}

pm2_install(){

    echo "${Magenta}[-] PM2 Configurando variavel global${Norm}"
    npm install pm2 --location=global
}

puppeteer_libs(){

    echo "${Magenta}[-] Instala bibliotecas para funcionamento do pupputeer.${Norm}"
    apt-get upgrade

    apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget


    apt-get install -y libgbm-dev
    apt-get install libglib2.0-0
    sudo apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0 libdrm.so.2 libgbm.so.1 
    sudo apt-get install -y libgbm-dev
    apt-get upgrade
}

install(){

    apt-get upgrade
    echo "${Magenta}[-] Instalando gerenciador node.${Norm}"
        wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
        source ~/.profile
        nvm install 18
        nvm use 18
        echo "${Green}[-] NVM instalado e apontado para o node na versão 16.${Norm}"
        install_npm
        puppeteer_libs
        pm2_install
}



echo "${Bold}${Yellow}[-] Instalando dependências${Norm}${Norm}"
install

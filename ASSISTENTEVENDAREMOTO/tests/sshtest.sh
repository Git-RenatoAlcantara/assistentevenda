#!/usr/bash
    ip_server3=$1
    senha_server3=$2
    limite='1'
    tempo='1'
    usuario=$3
    senha=$4
    tuserdate=$(date '+%C%y/%m/%d' -d " +1 days")
    if sshpass -p "$senha_server3" ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no root@$ip_server3 echo "ok" 1>/dev/null 2>/dev/null; then
		sshpass -p "$senha_server3" ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no root@$ip_server3 << EOF
		useradd -M -N -s /bin/false $usuario -e $tuserdate > /dev/null 2>&1
    (echo "$senha";echo "$senha") | passwd $usuario > /dev/null 2>&1
    echo "$senha" > /etc/SSHPlus/senha/$usuario
    echo "$usuario $limite" >> /root/usuarios.db
    echo "#!/bin/bash
pkill -f "$usuario"
userdel --force $usuario
grep -v ^$usuario[[:space:]] /root/usuarios.db > /tmp/ph ; cat /tmp/ph > /root/usuarios.db
rm /etc/SSHPlus/senha/$usuario > /dev/null 2>&1
rm -rf /etc/SSHPlus/userteste/$usuario.sh" > /etc/SSHPlus/userteste/$usuario.sh
chmod +x /etc/SSHPlus/userteste/$usuario.sh
at -f /etc/SSHPlus/userteste/$usuario.sh now + $tempo hour > /dev/null 2>&1
chage -E $tuserdate $usuario
EOF
    echo -e "✅ Criado com sucesso ✅\n\nUSUARIO: $usuario\nSENHA: $senha\nLimite: $limite\n\n⏳ Expira em: $tempo Horas"
exit
else
	echo -e "Erro Tente novamente Mais tarde!)"
	exit
fi
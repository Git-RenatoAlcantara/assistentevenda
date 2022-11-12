#!/usr/bin/env bash
username=$1
password=$2
dias=$3
sshlimiter=$4
ip_server=$5
pass_server=$6


    final=$(date "+%Y-%m-%d" -d "+$dias days")
	gui=$(date "+%d/%m/%Y" -d "+$dias days")
	pass=$(perl -e 'print crypt($ARGV[0], "password")' $password)
    if sshpass -p "$pass_server" ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no root@$ip_server echo "ok" 1>/dev/null 2>/dev/null; then
        sshpass -p "$pass_server" ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no root@$ip_server <<EOF
        useradd -e $final -M -s /bin/false -p $pass $username
        echo "$password" > /etc/SSHPlus/senha/$username
        echo "$username $sshlimiter" >> /root/usuarios.db
EOF

 echo '{
        "IP": "'${IP}'",
        "Usuario": "'${username}'",
        "Senha": "'${password}'",
        "expira": "'${days}' dias",
        "limite": "'${limit}' usuario"
      }'
else
 echo '{}'
fi
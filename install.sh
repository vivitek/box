 #!/usr/bin/env sh

wget -P /tmp/balena-dl --progress=bar $BALENA_RELEASE
echo "Downloaded file"
filename=$(echo $BALENA_RELEASE | rev | cut -d/ -f1 | rev)
echo $filename
unzip "/tmp/balena-dl/${filename}" -d /tmp/balena
ln -s /tmp/balena/balena-cli/balena /usr/bin/balena
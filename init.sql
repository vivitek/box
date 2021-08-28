CREATE USER firewall WITH PASSWORD 'firewallpwd';
CREATE DATABASE firewallDB;
GRANT ALL PRIVILEGES ON DATABASE firewallDB TO firewall;
GRANT pg_read_server_files TO firewall;
CREATE USER fire WITH PASSWORD 'fire2020';
CREATE DATABASE firewall;
GRANT ALL PRIVILEGES ON DATABASE firewall TO fire;
GRANT pg_read_server_files TO fire;

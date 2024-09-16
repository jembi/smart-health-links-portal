-- Create databases if they don't exist
CREATE DATABASE keycloak;
CREATE DATABASE shlp;

-- Create users and grant privileges
CREATE USER keycloak_user WITH PASSWORD 'keycloak_password';
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak_user;

CREATE USER shlp_user WITH PASSWORD 'shlp_password' CREATEDB; -- Primsa requires db create permission
GRANT ALL PRIVILEGES ON DATABASE shlp TO shlp_user;

-- Change ownership of the databases to the respective users
ALTER DATABASE keycloak OWNER TO keycloak_user;
ALTER DATABASE shlp OWNER TO shlp_user;

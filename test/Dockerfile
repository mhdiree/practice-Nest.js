FROM mariadb:11.3

RUN apt-get update && \
    apt-get install -y awscli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV MARIADB_ROOT_PASSWORD=0000




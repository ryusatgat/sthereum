#!/bin/bash
# for Postgres docker

# docker pull postgres

docker run -p 5432:5432 --name postgres \
        -e POSTGRES_PASSWORD=postgres -e TZ=Asia/Seoul \
        -v /home/besu/postgresql/data -d \
        postgres
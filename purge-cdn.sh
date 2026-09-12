#!/bin/sh
# Purga o cache do jsDelivr para os scripts deste repo, forçando o PlayCanvas
# a buscar a versão mais recente ao invés de esperar o cache expirar (~24h).
REPO="John00741/playcanvas-meu-primeiro-jogo"
BRANCH="main"

for f in scripts/*.js; do
    url="https://purge.jsdelivr.net/gh/${REPO}@${BRANCH}/${f}"
    echo "Purgando ${f}..."
    curl -s "$url"
    echo
done

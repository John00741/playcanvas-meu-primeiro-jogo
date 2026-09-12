#!/bin/sh
# Purga o cache do jsDelivr para os scripts deste repo e SO TERMINA quando
# confirma que o CDN esta servindo exatamente o conteudo local (compara hash).
# Isso elimina o ciclo manual de "purga -> espera -> confere -> purga de novo"
# quando o jsDelivr esta com propagacao lenta ou com o purge throttled.
REPO="John00741/playcanvas-meu-primeiro-jogo"
BRANCH="main"
MAX_ATTEMPTS=6
SLEEP_SECONDS=5

status=0

for f in scripts/*.js; do
    local_hash=$(md5sum "$f" | cut -d' ' -f1)
    purge_url="https://purge.jsdelivr.net/gh/${REPO}@${BRANCH}/${f}"
    cdn_url="https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/${f}"

    attempt=1
    ok=0
    while [ $attempt -le $MAX_ATTEMPTS ]; do
        curl -s "$purge_url" > /dev/null
        remote_hash=$(curl -s "${cdn_url}?_=$(date +%s%N)" | md5sum | cut -d' ' -f1)
        if [ "$local_hash" = "$remote_hash" ]; then
            echo "${f}: OK (confirmado na tentativa ${attempt})"
            ok=1
            break
        fi
        attempt=$((attempt + 1))
        [ $attempt -le $MAX_ATTEMPTS ] && sleep $SLEEP_SECONDS
    done

    if [ $ok -ne 1 ]; then
        echo "${f}: AINDA DESATUALIZADO apos ${MAX_ATTEMPTS} tentativas (pode ser propagacao lenta do GitHub raw, tente rodar de novo em ~1 min)"
        status=1
    fi
done

exit $status

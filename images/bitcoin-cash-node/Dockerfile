FROM debian:buster-slim

RUN groupadd -r bitcoin && useradd -r -m -g bitcoin bitcoin

RUN set -ex \
  && apt-get update \
  && apt-get install -qq --no-install-recommends ca-certificates gosu wget \
  && rm -rf /var/lib/apt/lists/*

ENV BITCOIN_VERSION 27.1.1
ENV BITCOIN_URL https://download.bitcoincashnode.org/misc/builds/upgrade11_temp/linux/bitcoin-cash-node-27.1.1-x86_64-linux-gnu.tar.gz
ENV BITCOIN_SHA256 2a20111c97013e42f82e96691c438600cc30fe6c73b55df830265f1c7421a2f6

# install bitcoin binaries
RUN set -ex \
  && cd /tmp \
  && wget -qO bitcoin.tar.gz "$BITCOIN_URL" \
  && echo "$BITCOIN_SHA256 bitcoin.tar.gz" | sha256sum -c - \
  && tar -xzvf bitcoin.tar.gz -C /usr/local --strip-components=1 --exclude=*-qt \
  && rm -rf /tmp/*

# create data directory
ENV BITCOIN_DATA /data
RUN mkdir "$BITCOIN_DATA" \
  && chown -R bitcoin:bitcoin "$BITCOIN_DATA" \
  && ln -sfn "$BITCOIN_DATA" /home/bitcoin/.bitcoin \
  && chown -h bitcoin:bitcoin /home/bitcoin/.bitcoin
VOLUME /data

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8332 8333 18332 18333 18443 28332 28333 38332 38333 48332 48333
CMD ["bitcoind"]

FROM golang:1.17.1-alpine AS builder

WORKDIR /go/src/app
COPY . .

RUN go build -o hosting cmd/hosting/*.go

FROM alpine:latest AS torbuilder

RUN apk add git g++ make automake autoconf libevent-dev openssl-dev zlib-dev
RUN git clone --depth 1 https://git.torproject.org/tor.git /root/tor

WORKDIR /root/tor
RUN cd /root/tor

RUN ./autogen.sh
RUN ./configure --disable-asciidoc
RUN make

FROM alpine:latest AS runner

COPY --from=torbuilder /root/tor/src/app/tor /root/tor
COPY --from=builder /go/src/app/hosting /root/hosting

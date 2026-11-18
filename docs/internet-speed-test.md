# Internet Speed Test deployment

The website and iframe use one measurement client. Run the measurement service on dedicated hosts with adequate network capacity. The website build takes a comma-separated list of region names and HTTPS base URLs from `NEXT_PUBLIC_SPEED_TEST_SERVERS`.

```sh
NEXT_PUBLIC_SPEED_TEST_SERVERS='US East|https://speed-us.example.com,Europe|https://speed-eu.example.com' npm run build
```

On each measurement host, run `node scripts/speed-test-server.mjs` behind an HTTPS reverse proxy. The service listens on loopback on port 9120 by default. Configure `SPEED_TEST_ORIGINS` with the exact site or staging origins, separated by commas. The site and its iframe use the same origin. Set `SPEED_TEST_CONCURRENCY` to the maximum transfers the host can sustain. The default is eight.

Disable proxy caching, compression, and buffering in both directions. Allow 16 MiB request bodies and configure host-level request rate limits and a bandwidth budget. The origin allowlist controls browser access. Apply rate limits at the proxy because non-browser clients can supply an Origin header.

Before public launch, check repeated Quick and Full measurements on wired, Wi-Fi, and mobile networks in each target region. Check aborted transfers, failure recovery, and a third-party iframe in staging. If a proxy adds framing headers, allow framing only on `/embed/internet-speed-test`. Leave the embed page out of the search index.

For local testing, run the following commands in separate terminals, then open http://localhost:3000/tools/internet-speed-test.

```sh
SPEED_TEST_ORIGINS=http://localhost:3000 node scripts/speed-test-server.mjs
NEXT_PUBLIC_SPEED_TEST_SERVERS='Local|http://localhost:9120' npm run dev
```

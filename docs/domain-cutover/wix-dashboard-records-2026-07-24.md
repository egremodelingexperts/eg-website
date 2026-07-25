# Wix DNS dashboard transcription

Source: Wix **Settings → Domains → DNS Records → Manage DNS Records**

Domain: `egremodelingexperts.com`

Recorded: July 24, 2026

## A (Host)

| Host name                 | Value            | TTL    |
| ------------------------- | ---------------- | ------ |
| `egremodelingexperts.com` | `185.230.63.171` | 1 hour |
| `egremodelingexperts.com` | `185.230.63.186` | 1 hour |
| `egremodelingexperts.com` | `185.230.63.107` | 1 hour |

## CNAME (Aliases)

| Host name                     | Value             | TTL    |
| ----------------------------- | ----------------- | ------ |
| `en.egremodelingexperts.com`  | `cdn1.wixdns.net` | 1 hour |
| `www.egremodelingexperts.com` | `cdn1.wixdns.net` | 1 hour |

## Empty sections

The supplied Wix dashboard text showed no records in these sections:

- TXT (Text)
- SRV
- MX (Mail Exchange)

## NS (Name Servers)

Wix reports that these records are not editable.

| Host name                 | Value             | TTL   |
| ------------------------- | ----------------- | ----- |
| `egremodelingexperts.com` | `ns13.wixdns.net` | 1 day |
| `egremodelingexperts.com` | `ns12.wixdns.net` | 1 day |

## Notes

- This file is a transcription of the Wix dashboard information supplied by
  the site owner.
- A screenshot or PDF of the dashboard should still be placed in the ignored
  `private/snapshots/` directory before production cutover.
- The `en` CNAME must not be deleted accidentally when changing the apex and
  `www` website records.

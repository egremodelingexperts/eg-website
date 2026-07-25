# Domain Cutover and Wix Rollback

This folder records the known configuration for moving
`egremodelingexperts.com` from the existing Wix website to the static GitHub
Pages site.

Last public-DNS inventory: **July 24, 2026 (America/Chicago)**

Live records reverified without changes: **July 25, 2026
(America/Chicago)**

## Safety rule

Keep the Wix website published and keep the Wix subscription active until the
GitHub Pages site has been stable in production for an agreed observation
period. After that period, the Wix site may be unpublished, but its project and
subscription should be retained as a rollback source. Do not transfer the
domain or change its nameservers for this cutover.

Do not delete or modify unrelated TXT, MX, verification, mail, or service
records shown in Wix.

## Systems

| Purpose                  | Current/target system                               |
| ------------------------ | --------------------------------------------------- |
| Domain                   | `egremodelingexperts.com`                           |
| Current website host     | Wix                                                 |
| DNS host                 | Wix DNS                                             |
| Target website host      | GitHub Pages                                        |
| Target repository        | `https://github.com/egremodelingexperts/eg-website` |
| Canonical production URL | `https://egremodelingexperts.com`                   |
| Target `www` behavior    | Redirect to the apex domain                         |

## Current Wix settings

The current public DNS records are preserved verbatim in
[`current-public-dns.txt`](./current-public-dns.txt).

### Nameservers — do not change

| Type | Name | Value             |
| ---- | ---- | ----------------- |
| NS   | `@`  | `ns12.wixdns.net` |
| NS   | `@`  | `ns13.wixdns.net` |

### Website records to restore during rollback

| Type  | Host         | Value                           |
| ----- | ------------ | ------------------------------- |
| A     | `@` or blank | `185.230.63.107` (TTL: 1 hour)  |
| A     | `@` or blank | `185.230.63.171` (TTL: 1 hour)  |
| A     | `@` or blank | `185.230.63.186` (TTL: 1 hour)  |
| CNAME | `www`        | `cdn1.wixdns.net` (TTL: 1 hour) |

### Existing language subdomain

| Type  | Host | Value                           |
| ----- | ---- | ------------------------------- |
| CNAME | `en` | `cdn1.wixdns.net` (TTL: 1 hour) |

`en.egremodelingexperts.com` currently points to Wix. At cutover it should move
to a dedicated GitHub Pages redirect site that sends visitors permanently to
`https://egremodelingexperts.com/`. A DNS CNAME by itself is not an HTTP
redirect.

The Wix dashboard supplied on July 24, 2026 showed no entries in its `TXT`,
`SRV`, or `MX` sections. The apex also had no publicly visible `AAAA` or `CAA`
answers. See
[`wix-dashboard-records-2026-07-24.md`](./wix-dashboard-records-2026-07-24.md)
for the dashboard transcription.

## Target GitHub Pages settings

Before changing production DNS:

1. Complete the consultation form URL and privacy-policy launch gates.
2. Push the approved site to the target repository.
3. Set repository **Settings → Pages → Source** to **GitHub Actions**.
4. In the GitHub organization, use **Settings → Pages → Verified domains** to
   verify `egremodelingexperts.com`.
5. Add the exact TXT verification record supplied by GitHub in Wix and keep it
   after launch.
6. Run the deployment workflow and confirm it succeeds.
7. Set the Pages custom domain to `egremodelingexperts.com`.
8. Create a small second GitHub Pages repository for the `en` redirect, set its
   custom domain to `en.egremodelingexperts.com`, and verify its HTTPS
   certificate before retiring the Wix-hosted `en` endpoint.

The repository already declares this canonical domain in:

- `astro.config.mjs`
- `public/CNAME`
- `src/config/site.ts`

### Production DNS records

Remove the three Wix website `A` records and replace them with:

| Type  | Host         | Value                           |
| ----- | ------------ | ------------------------------- |
| A     | `@` or blank | `185.199.108.153`               |
| A     | `@` or blank | `185.199.109.153`               |
| A     | `@` or blank | `185.199.110.153`               |
| A     | `@` or blank | `185.199.111.153`               |
| CNAME | `www`        | `egremodelingexperts.github.io` |
| CNAME | `en`         | `egremodelingexperts.github.io` |

Do not include a repository path in either CNAME value. The `www` CNAME belongs
to the primary site; the `en` CNAME belongs to the separate redirect Pages
site. Configure each custom domain in its owning GitHub repository before
changing DNS.

The minimal initial configuration omits IPv6. If IPv6 is enabled later, use:

| Type | Host         | Value                 |
| ---- | ------------ | --------------------- |
| AAAA | `@` or blank | `2606:50c0:8000::153` |
| AAAA | `@` or blank | `2606:50c0:8001::153` |
| AAAA | `@` or blank | `2606:50c0:8002::153` |
| AAAA | `@` or blank | `2606:50c0:8003::153` |

## Cutover checklist

- [ ] Complete Google Form and privacy-policy launch gates.
- [ ] Confirm the GitHub Pages deployment succeeds.
- [ ] Verify the domain in the GitHub organization.
- [ ] Save a full Wix DNS dashboard screenshot in the ignored
      `private/snapshots/` directory.
- [ ] Create and verify the dedicated `en` → apex GitHub Pages redirect.
- [ ] Confirm the old Wix site is still published.
- [ ] Replace the apex Wix `A` records with the four GitHub `A` records.
- [ ] Replace the `www` CNAME with `egremodelingexperts.github.io`.
- [ ] Replace the `en` CNAME with `egremodelingexperts.github.io`.
- [ ] Wait for DNS propagation and GitHub's domain check.
- [ ] Enable **Enforce HTTPS** in GitHub Pages.
- [ ] Verify apex, `www`, `en`, HTTPS, navigation, forms, phone, and email links.
- [ ] After the agreed observation period, unpublish the Wix site while
      retaining its project and subscription for rollback.

## Emergency rollback

Rollback requires republishing Wix first and then restoring its website DNS.
Do not disable GitHub Pages or delete either GitHub repository until DNS has
returned to Wix.

1. Open the retained Wix project and publish it.
2. Confirm the Wix site is accessible through its Wix preview or assigned
   temporary URL.
3. Open Wix **Domains → Domain Actions → Manage DNS Records**.
4. Delete the four GitHub apex `A` records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
5. If GitHub `AAAA` records were added, delete all four of them.
6. Restore the three Wix apex `A` records:
   - `185.230.63.107`
   - `185.230.63.171`
   - `185.230.63.186`
7. Replace the `www` CNAME with `cdn1.wixdns.net`.
8. Replace the `en` CNAME with `cdn1.wixdns.net`.
9. Leave the Wix nameservers and unrelated DNS records unchanged.
10. Save the changes.
11. Run the verification commands in the next section.
12. Expect DNS caches to produce mixed results temporarily. Wix states that DNS
    changes may take up to 48 hours to propagate fully.

## Verification commands

After the GitHub cutover:

```bash
dig egremodelingexperts.com A +noall +answer
dig www.egremodelingexperts.com CNAME +noall +answer
dig en.egremodelingexperts.com CNAME +noall +answer
curl -I https://egremodelingexperts.com/
curl -I https://www.egremodelingexperts.com/
curl -I https://en.egremodelingexperts.com/
```

Expected apex answers are the four `185.199.10x.153` GitHub addresses. Expected
`www` and `en` CNAMEs are `egremodelingexperts.github.io`. Both subdomains
should redirect to the apex URL.

After rollback:

```bash
dig egremodelingexperts.com A +noall +answer
dig www.egremodelingexperts.com CNAME +noall +answer
dig en.egremodelingexperts.com CNAME +noall +answer
curl -I https://egremodelingexperts.com/
curl -I https://www.egremodelingexperts.com/
curl -I https://en.egremodelingexperts.com/
```

Expected apex answers are the three `185.230.63.x` Wix addresses. Expected
`www` and `en` CNAMEs are `cdn1.wixdns.net`.

## Official references

- GitHub Pages custom domains:
  <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
- GitHub Pages domain verification:
  <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages>
- GitHub Pages HTTPS:
  <https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https>
- Wix external-site DNS:
  <https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site>

## Private preservation archive

Private configuration evidence belongs in `docs/domain-cutover/private/`, which
is excluded by `.gitignore`. The local archive should contain only screenshots
or exports needed to recreate the Wix DNS, domain assignment, and GitHub Pages
custom-domain settings.

Do not store passwords, payment-card information, recovery codes, API tokens,
cookies, session tokens, personal contacts, or billing information in the
repository or the local archive.

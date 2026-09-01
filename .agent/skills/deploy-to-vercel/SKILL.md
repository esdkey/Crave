---
name: deploy-to-vercel
description: Deploy a project to Vercel. Use when the user says "deploy", "ship", "push to production", "deploy to Vercel", or wants to make their project live. Handles CLI auth, project linking, and git-based deploys.
metadata:
  author: vercel
  version: "1.0.0"
---

# Deploy to Vercel

Deploy any web project to Vercel using the correct method for the current environment.

## Step 1: Gather Project State

Check the following before choosing a deploy method:

1. Is `.vercel/` directory present? → project is already linked
2. Is there a git remote configured? (`git remote -v`)
3. Is Vercel CLI installed? (`vercel --version`)
4. Is CLI authenticated? (`vercel whoami`)

### Team selection

If the user has multiple teams, ask which to deploy to before proceeding.

## Step 2: Choose a Deploy Method

| Condition | Method |
|---|---|
| Linked + has git remote | Git Push |
| Linked + no git remote | `vercel deploy` |
| Not linked + CLI authenticated | Link first, then deploy |
| Not linked + CLI not authenticated | Install, auth, link, deploy |

### Linked + has git remote → Git Push

```bash
git add .
git commit -m "deploy"
git push
```

Vercel auto-deploys on push via git integration.

### Linked + no git remote → `vercel deploy`

```bash
vercel deploy --prod
```

### Not linked → Link first

```bash
vercel link
vercel deploy --prod
```

### Not linked + not authenticated → Full setup

```bash
npm i -g vercel
vercel login
vercel link
vercel deploy --prod
```

## Step 3: Verify

After deploy, confirm:
- Deployment URL is returned
- Visit the URL to verify the site is live
- Check for build errors in the output

## Output

Always return:
- The deployment URL
- Whether it was a preview or production deploy
- Any warnings from the build output

## Troubleshooting

### CLI Auth Failure
Run `vercel login` and complete browser-based auth flow. Then retry.

### Build Errors
Read the build output carefully. Common issues:
- Missing env variables → add via `vercel env add`
- Missing dependencies → check `package.json`
- TypeScript errors → fix type errors before deploying

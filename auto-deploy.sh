#!/bin/bash
# Auto-deploy on git push
# Save this as .git/hooks/post-commit and make it executable

echo "🚀 Auto-deploying to Cloudflare Pages..."
npm run build && wrangler pages deploy dist

#!/usr/bin/env bash
set -euo pipefail

: "${PAPERCLIP_COMPANY_ID:?Set PAPERCLIP_COMPANY_ID to the target Paperclip company ID}"

skills=(
  pubg-urdu-lqa
  arabic-urdu-localization
  multilingual-translation-mtpe
  legal-translation-qa
  indus-kohistani-research
)

for skill in "${skills[@]}"; do
  echo "Importing $skill..."
  paperclipai skills import "https://github.com/xl8saif/site/tree/main/ai-skills/$skill"     --company-id "$PAPERCLIP_COMPANY_ID"
done

echo "Paperclip import complete. Attach the installed skills to the desired agents with:"
echo "paperclipai skills agent sync <agent-ref> --skill pubg-urdu-lqa --skill arabic-urdu-localization --skill multilingual-translation-mtpe --skill legal-translation-qa --skill indus-kohistani-research --mode add --company-id $PAPERCLIP_COMPANY_ID"

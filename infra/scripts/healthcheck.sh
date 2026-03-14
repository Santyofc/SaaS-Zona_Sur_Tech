#!/bin/bash
# ==========================================================
# healthcheck.sh
# Purpose: Validates the application is responding locally
# ==========================================================
set -Eeuo pipefail

WEB_URL="http://127.0.0.1:3000/"
API_URL="http://127.0.0.1:4000/health"

check_url() {
    local url="$1"
    local status
    status=$(curl -o /dev/null -s -w "%{http_code}\n" "$url")

    if [ "$status" = "200" ] || [ "$status" = "301" ] || [ "$status" = "302" ] || [ "$status" = "307" ] || [ "$status" = "308" ]; then
        echo "Healthcheck OK: HTTP $status ($url)"
        return 0
    fi

    echo "Healthcheck Failed: HTTP $status ($url)"
    return 1
}

check_url "$WEB_URL"
check_url "$API_URL"

#!/bin/bash

# Set parameters with default values
LIMIT="${1:-1000}"
OFFSET="${2:-0}"
OUTPUT_FILE="items.json"

# Fetch actor runs with increasing offset until total is reached
total=0
current_offset=0
actor_limit=1000

# Clear or create the output file
echo "[]" > "$OUTPUT_FILE"

echo "Fetching actor runs and saving results to $OUTPUT_FILE..."

while :; do
    response=$(curl -s -L "https://api.apify.com/v2/actor-runs" \
                 -H "Accept: application/json" \
                 -H "Authorization: Bearer apify_api_hZGL5cXqqzlgalWj69G4jHd8qFRYu50tTMxK" \
                 -G --data-urlencode "limit=$actor_limit" --data-urlencode "offset=$current_offset")

    total=$(echo "$response" | jq -r '.data.total')
    count=$(echo "$response" | jq -r '.data.count')
    current=0

    echo "Fetched $count actor runs (Offset: $current_offset, Total: $total)"

    # Process each item from the response
    echo "$response" | jq -c '.data.items[]' | while read -r item; do
        API_KEY_STORE_ID=$(echo "$item" | jq -r '.defaultKeyValueStoreId')
        DATASET_ID=$(echo "$item" | jq -r '.defaultDatasetId')
        current=$((current + 1))

        if [[ "$API_KEY_STORE_ID" != "null" && "$DATASET_ID" != "null" ]]; then
            echo -ne "Fetched $count actor runs (Offset: $current, Total: $total, Percent: $((100 * current / total))%)\\r"

            api_response=$(curl -s -L "https://api.apify.com/v2/datasets/$DATASET_ID/items" \
                            -H "Accept: application/json" \
                            -G --data-urlencode "limit=$LIMIT" --data-urlencode "offset=$OFFSET")

            # Append the response to the output file
            jq --argjson newData "$api_response" '. + $newData' "$OUTPUT_FILE" > temp.json && mv temp.json "$OUTPUT_FILE"
        else
            echo "Skipping item with missing datasetId or apiKeyStoreId"
        fi
    done

    if [ "$((current_offset + actor_limit))" -ge "$total" ]; then
        break
    fi

    current_offset=$((current_offset + actor_limit))
done

echo "All data saved to $OUTPUT_FILE"

#!/bin/bash

# Configuration
REDIS_HOST="localhost"    # Redis server host
REDIS_PORT="6379"         # Redis server port
KEY_PREFIX="system_stats"
JSON_FILE="/path/to/commands.json"  # Path to your commands.json

# Function to execute a command and push the output to Redis
execute_command() {
    local command="$1"
    local frequency="$2"

    # Infinite loop to repeatedly execute the command
    while true; do
        TIMESTAMP=$(date --iso-8601=seconds)
        OUTPUT=$($command)  # Execute the command

        # Create a JSON structure with the timestamp and command output
        OUTPUT_JSON=$(jq -n --arg time "$TIMESTAMP" --arg output "$OUTPUT" '{time: $time, output: $output}')

        # Push the output to Redis
        echo -e "SET $KEY_PREFIX:$command:$TIMESTAMP $OUTPUT_JSON" | telnet $REDIS_HOST $REDIS_PORT

        # Sleep for the given frequency (e.g., 5s)
        sleep $frequency
    done
}

# Read the JSON file and process each command entry
jq -c '.[]' "$JSON_FILE" | while read -r line; do
    command=$(echo "$line" | jq -r '.command')
    frequency_str=$(echo "$line" | jq -r '.frequency')

    # Convert frequency string to seconds (e.g., "5s" -> 5)
    frequency=$(echo "$frequency_str" | sed 's/[a-zA-Z]*//g')

    # Run the command in the background with the specified frequency
    execute_command "$command" "$frequency" &
done

# Wait for all background processes to complete
wait

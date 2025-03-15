<?php
// Check if the 'url' parameter is set in the URL
if (isset($_GET['url'])) {
    // Get the content of the 'url' parameter
    $url = $_GET['url'];

    // Initialize cURL
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute cURL request
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        // Return cURL error
        echo 'cURL Error: ' . curl_error($ch);
    } else {
        if (isset($_GET['compress']) && $_GET['compress'] == 'gzip') {
            // Compress the response using gzip
            $compressedResponse = gzencode($response, 9);

            // Set headers for gzip encoding
            header('Content-Encoding: gzip');
            header('Content-Length: ' . strlen($compressedResponse));
            header('Content-Type: application/octet-stream');

            // Return the compressed content
            echo $compressedResponse;
        } else {
            // Return the response as is
            echo $response;
        }
    }

    // Close cURL session
    curl_close($ch);
} else {
    // If the 'url' parameter is not set, return a message
    echo 'No URL parameter provided.';
}
?>

async function getCandyHaul(zipCode) {
    // API URL with zip code as query parameter
    const apiUrl = `https://iyielkzr51.execute-api.us-west-1.amazonaws.com/prod/candypredict?zip_code=${zipCode}`;

    try {
        // Send the request to the API Gateway
        const response = await fetch(apiUrl);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }

        // Parse the JSON response
        const data = await response.json();

        // Get the predicted candy haul from the response
        const predictedHaul = data.predicted_haul;

        // Display the predicted candy haul on the website
        document.getElementById('result').innerText = `Estimated Candy Haul: ${predictedHaul}`;
    } catch (error) {
        // Handle errors, display a message
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}

// Event listener for form submission
document.getElementById('zipcode-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get the zip code entered by the user
    const zipCode = document.getElementById('zipcode-input').value;

    // Call the function to get the candy haul prediction
    await getCandyHaul(zipCode);
});

// Function to get candy haul prediction based on the zip code
async function getCandyHaul(zipCode) {
    // Replace 'your-api-id' with your actual API Gateway ID and 'region' with your region
    const apiUrl = `https://iyielkzr51.execute-api.us-west-1.amazonaws.com/$default/candypredict?zip_code=${zipCode}`;
    // Show loading message while fetching data
    document.getElementById('candy-haul-result').innerText = "Loading...";

    try {
        // Fetch response from API Gateway
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // Handle error if API request fails
            document.getElementById('candy-haul-result').innerText = "Error fetching data.";
            return;
        }

        // Parse the response data
        const data = await response.json();
        
        // Display the predicted candy haul on the website
        if (data.predicted_haul) {
            document.getElementById('candy-haul-result').innerText = `Estimated Candy Haul: ${data.predicted_haul}`;
        } else {
            document.getElementById('candy-haul-result').innerText = "No data found for this zip code.";
        }
    } catch (error) {
        // Handle any errors during the fetch
        console.error('Error:', error);
        document.getElementById('candy-haul-result').innerText = "Error fetching data.";
    }
}

// Event listener for form submission
document.getElementById('submit-button').addEventListener('click', async (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Get zip code from the input field
    const zipCode = document.getElementById('zipcode').value.trim();

    // Validate the zip code before calling the API
    if (!zipCode || zipCode.length !== 5 || isNaN(zipCode)) {
        document.getElementById('candy-haul-result').innerText = "Please enter a valid 5-digit zip code.";
        return;
    }

    // Fetch and display the candy haul prediction
    await getCandyHaul(zipCode);
});

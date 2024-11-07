async function getCandyHaul(zipCode) {
    // Replace 'your-api-id' with your actual API Gateway ID and 'region' with your region
    const apiUrl = `https://your-api-id.execute-api.region.amazonaws.com/candy-haul?zip_code=${zipCode}`;
    
    // Fetch response from API Gateway
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        // Handle error if API request fails
        document.getElementById('result').innerText = "Error fetching data.";
        return;
    }

    const data = await response.json();
    
    // Display the predicted candy haul on the website
    document.getElementById('result').innerText = `Estimated Candy Haul: ${data.predicted_haul}`;
}

// Event listener for form submission
document.getElementById('zipcode-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Get zip code from the input field
    const zipCode = document.getElementById('zipcode-input').value;

    // Fetch and display the candy haul prediction
    await getCandyHaul(zipCode);
});

async function getCandyHaul(zipCode, startTime, endTime) {
    // Convert 24-hour format to 12-hour format with AM/PM
    function convertTo12HourFormat(time) {
        const [hour, minute] = time.split(':');
        let hours = parseInt(hour);
        const period = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;  // Handle midnight (00:00) as 12 AM
        return `${hours}:${minute}${period}`;
    }

    // Convert both start and end times
    const startTime12hr = convertTo12HourFormat(startTime);
    const endTime12hr = convertTo12HourFormat(endTime);

    // API URL with zip code, start time, and end time as query parameters
    const apiUrl = `https://nonmdwp4vf.execute-api.us-west-1.amazonaws.com/stageone/haul?zip_code=${zipCode}&start_time=${startTime12hr}&end_time=${endTime12hr}`;

    try {
        // Send the request to the API Gateway
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            // If the response is not ok, throw an error including the status code
            throw new Error(`Error ${response.status}: Failed to fetch data from API`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the predicted_haul is present in the response
        if (data.predicted_haul) {
            const predictedHaul = data.predicted_haul;

            // Calculate the total candy haul
            let totalCandy = 0;
            for (const amount of Object.values(predictedHaul)) {
                totalCandy += amount;
            }

            // Create a string to display the candy breakdown
            let candyDisplay = "Estimated Candy Haul:\n";
            for (const [candy, amount] of Object.entries(predictedHaul)) {
                candyDisplay += `${candy}: ${amount}\n`;
            }

            // Display the candy haul breakdown and the total candy on the website
            document.getElementById('result').innerText = candyDisplay;

            // Display the total candy amount
            document.getElementById('total-candy').innerText = `Total Candy: ${totalCandy}`;
        } else if (data.error) {
            // Display error code and message from the API if data.error is present
            document.getElementById('result').innerText = `Error ${response.status}: ${data.error}`;
            document.getElementById('total-candy').innerText = '';
        }
    } catch (error) {
        // Handle any unexpected errors (e.g., network issues or other issues)
        document.getElementById('result').innerText = `Error: ${error.message}`;
        document.getElementById('total-candy').innerText = '';
    }
}

// Event listener for form submission
document.getElementById('zipcode-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get the zip code, start time, and end time entered by the user
    const zipCode = document.getElementById('zipcode-input').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    // Check if all fields are filled out
    if (!zipCode || !startTime || !endTime) {
        document.getElementById('result').innerText = 'Error: All fields are required';
        document.getElementById('total-candy').innerText = '';
        return;
    }

    // Call the function to get the candy haul prediction
    await getCandyHaul(zipCode, startTime, endTime);
});

async function getCandyHaul(zipCode, startTime, endTime) {
    // Convert 24-hour format to 12-hour format with AM/PM
    function convertTo12HourFormat(time) {
        const [hour, minute] = time.split(':');
        let hours = parseInt(hour);
        const period = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;  // Handle midnight (00:00) as 12 AM
        return `${hours}:${minute} ${period}`;
    }

    // Convert both start and end times
    const startTime12hr = convertTo12HourFormat(startTime);
    const endTime12hr = convertTo12HourFormat(endTime);

    // API URL with zip code, start time, and end time as query parameters
    const apiUrl = `https://nonmdwp4vf.execute-api.us-west-1.amazonaws.com/stageone/haul?zip_code=${zipCode}&start_time=${"3:00PM"}&end_time=${"5:00PM"}`;

    try {
        // Send the request to the API Gateway
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the predicted_haul is present in the response
        if (data.predicted_haul) {
            const predictedHaul = data.predicted_haul;
            // Display the predicted candy haul on the website
            document.getElementById('result').innerText = `Estimated Candy Haul: ${predictedHaul}`;
        } else if (data.error) {
            // Handle specific API error responses
            document.getElementById('result').innerText = `Error: ${data.error}`;
        }
    } catch (error) {
        // Handle any unexpected errors
        document.getElementById('result').innerText = `Error: ${error.message}`;
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
        return;
    }

    // Call the function to get the candy haul prediction
    await getCandyHaul(zipCode, startTime, endTime);
});

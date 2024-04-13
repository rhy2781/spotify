import ColorThief from 'colorthief'


function fetchAndEncodeImage(imageUrl, setColor) {
    fetch(imageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        })
        .then(base64Data => {
            // Pass base64Data to Color Thief after creating an img element
            const img = new Image();
            img.onload = () => {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                setColor(dominantColor)
                // console.log('Dominant color:', dominantColor);
            };
            img.src = base64Data;
        })
        .catch(error => {
            console.error('Error fetching or encoding image:', error);
        });
}

export default fetchAndEncodeImage
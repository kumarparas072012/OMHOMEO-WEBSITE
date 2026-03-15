# omhomeo-website

Welcome to the omhomeo.com website project! This project is designed to provide comprehensive information on various health topics, focusing on homeopathic treatments and solutions.

## Project Structure

The project consists of the following files and directories:

- **index.html**: The main entry point of the website, featuring the homepage layout, navigation, and links to other pages.
- **about.html**: Contains information about the website, its mission, and the services offered.
- **contact.html**: Includes a contact form and details for users to reach out for inquiries or support.
- **pages/**: A directory containing individual pages for specific health topics:
  - **piles.html**: Information about piles, including symptoms, causes, and treatment options.
  - **fissure.html**: Details on anal fissures, including causes, symptoms, and treatment methods.
  - **fistula.html**: Covers anal fistulas, explaining symptoms and treatment options.
  - **skin.html**: Focuses on skin-related issues and treatments.
  - **pcos.html**: Discusses Polycystic Ovary Syndrome (PCOS), its symptoms, and management strategies.
  - **pcod.html**: Information on Polycystic Ovarian Disease (PCOD), including symptoms and treatment options.
  - **depression.html**: Covers depression, its symptoms, causes, and treatment options.
  - **anxiety.html**: Discusses anxiety disorders, their symptoms, and management strategies.
  - **autism.html**: Information on autism spectrum disorders, including symptoms and support options.
  - **adhd.html**: Focuses on Attention Deficit Hyperactivity Disorder (ADHD), its symptoms, and treatment options.
  - **thyroid.html**: Discusses thyroid disorders, including symptoms and treatment options.
  - **obesity.html**: Information on obesity, its causes, health risks, and management strategies.
  - **hair-fall.html**: Covers hair fall, its causes, and treatment options.
  - **alopecia.html**: Discusses alopecia, including types, causes, and treatment options.
  - **acne.html**: Information on acne, its causes, and treatment options.
  - **blemishes.html**: Covers skin blemishes, including types, causes, and treatment options.
- **css/**: Contains styles for the website, including layout, typography, and responsive design.
  - **styles.css**: The main stylesheet for the website.
- **js/**: Includes JavaScript for interactive elements on the website.
  - **script.js**: The main JavaScript file for functionality.

## Setup Instructions

1. Clone the repository or download the project files.
2. Run a local web server from the project root:
   - `python3 -m http.server 8080`
3. Open `http://localhost:8080/` in your browser.
3. Navigate through the homepage and explore the various health topics.

## Contact Form Note

- The contact form uses FormSubmit and must be opened through `http://` or `https://`.
- Opening pages directly as local files (`file://`) will not submit the form.

## Google Review Sync

- To refresh the 5-star review dataset from configured Google Maps links, run:
  - `node scripts/sync-google-reviews.mjs`
- This updates `js/google-reviews-data.js` automatically.

## Contributing

Feel free to contribute to this project by adding more health topics, improving the design, or enhancing functionality. Your contributions are welcome!

## License

This project is open-source and available for use and modification. Please ensure to give appropriate credit if you use any part of this project.
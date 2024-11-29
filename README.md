# Portal Lomba HMSI v2

**Portal Lomba HMSI v2** is a web-based platform for showcasing and managing competition-related information. The project leverages Google Sheets API for automated data updates, CI/CD pipelines for automated deployment, and rigorous testing to ensure application reliability.

Created by Group 11 PSO A:
- Anisa Rahmah 5026211040
- Karina Filza Aafiyah 5026221012
- Eugenia Indrawan 5026221020
- Mutiara Noor Fauzia 5026221045

## Key Features

- **Google Sheets Integration**: Automatically updates competition data from spreadsheets.
- **CI/CD Pipeline**: Automates deployment with every code change.
- **Testing and Monitoring**: Ensures the app functions optimally at all times.

## How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nerdypengu/portal-lomba-v2.git
   cd portal-lomba-v2
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Create a `.env` file based on `.env.example`.
   - Add your Google Sheets API credentials.

4. **Run the Application**:
   ```bash
   npm start
   ```

## CI/CD Pipeline Overview

This project follows an automated CI/CD pipeline in Azure DevOps platform that illustrated as below:

1. **Code Quality**
   - Checks code with ESLint for quality assurance. 
2. **Build**
   - Frontend and backend are built using Node.js, followed by creating Docker images.
   - Images are pushed to Docker Registry.
3. **Testing**
   - Unit and integration tests are executed. Failing tests result in a rollback to the previous stable version.
4. **Deployment**
   - Docker images are deployed to Azure Web Apps.
   - If deployment issues occur, it triggers an automatic rollback.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

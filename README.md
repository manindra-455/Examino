# 🎓 Examino – Automatic Student Seat Allocation System

**Examino** is a fully automated, web-based exam seat allocation system designed to streamline the process of assigning students to exam halls. It eliminates the need for tedious manual planning and reduces the likelihood of human error, providing educational institutions with a fast, reliable, and scalable solution for managing exam seating.

## 🚀 Project Overview

Manually managing student seating for examinations is a time-consuming and error-prone task. **Examino** simplifies this process through automation and digitalization. The platform is designed exclusively for administrators who can:

- Manage student and exam hall data
- Assign seats either randomly or based on roll numbers
- Export seating arrangements as printable PDF reports

## 🔐 Features

- **Role-Based Access Control**  
  Only verified Admin users can log in and access the platform.

- **Hall & Capacity Management**  
  Define rooms/halls with their seating capacities and names.

- **Course-Wise Allocation**  
  Assign seating based on course and roll number ranges.

- **Seating Strategy Options**  
  Allocate seats randomly or sequentially by roll numbers.

- **PDF Export**  
  Generate downloadable and printable seat plan reports using **jsPDF** and **jsPDF-AutoTable**.

- **Responsive UI**  
  Built with **ReactJS** and styled using **Tailwind CSS** for a clean and intuitive user interface.

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| **Frontend**| ReactJS, Tailwind CSS               |
| **Backend** | Firebase (Firestore & Authentication)|
| **PDF Export** | jsPDF, jsPDF-AutoTable          |

## 📁 Folder Structure (Simplified)

```
Examino/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── App.jsx
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## 🧭 Future Upgrades

- **Role-based access for multiple admins**  
  Enable multiple admin levels (e.g., Super Admin, Center Admin) with specific permissions for managing data securely.

- **Real-time conflict detection and warnings**  
  Implement logic to detect overlapping seat allocations or room capacity issues as data is entered.

- **Support for mobile UI and uploads via CSV**  
  Optimize the UI for mobile devices and allow bulk data uploads (e.g., course or student data) via CSV files.

- **Enhanced PDF styling and customization**  
  Improve the appearance of generated PDFs by adding institute branding, color themes, headers, and footers.

- **Admin dashboard with analytics and reports**  
  Visualize seating data using charts, activity logs, and downloadable reports to assist in better decision-making.

## 📦 Installation & Setup (for Developers)

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/examino.git
   cd examino
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Configure Firebase**  
   - Create a Firebase project.
   - Enable Firestore and Authentication (Email/Password).
   - Add your Firebase config in `firebaseConfig.js`.

4. **Start the App**  
   ```bash
   npm run dev
   ```

## 🙌 Contribution

Pull requests are welcome! If you have suggestions, feel free to open an issue or submit a PR. Let’s make Examino even better!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 👤 Author

**Manindra Gupta**  
📧 [manindragupta0@gamil.com]  
🔗 [LinkedIn](www.linkedin.com/in/manindra-nilesh-191975264) | [GitHub](https://github.com/manindra-455)

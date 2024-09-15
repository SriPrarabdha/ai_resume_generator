<p align="center">
  <img src="https://img.icons8.com/?size=512&id=55494&format=png" width="20%" alt="AI_RESUME_GENERATOR-logo">
</p>
<p align="center">
    <h1 align="center">AI_RESUME_GENERATOR</h1>
</p>
<p align="center">
    <em><code>❯ REPLACE-ME</code></em>
</p>
<p align="center">
	<!-- Shields.io badges disabled, using skill icons. --></p>
<p align="center">
		<em>Built with the tools and technologies:</em>
</p>
<p align="center">
	<a href="https://skillicons.dev">
		<img src="https://skillicons.dev/icons?i=css,md,react,ts">
	</a></p>

<br>

##### 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📂 Repository Structure](#-repository-structure)
- [🧩 Modules](#-modules)
- [🚀 Getting Started](#-getting-started)
    - [🔖 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
    - [🤖 Usage](#-usage)
    - [🧪 Tests](#-tests)
- [📌 Project Roadmap](#-project-roadmap)
- [🤝 Contributing](#-contributing)
- [🎗 License](#-license)
- [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

The AI Resume Generator is an advanced web application designed to automate the creation of professional resumes. By leveraging cutting-edge technologies such as Langchain.js, Next.js, and Tailwind CSS, this application offers a seamless experience for users wishing to transform their LinkedIn profile PDFs into polished HTML resumes. The application utilizes Langchain's PDF parser to extract text from uploaded PDFs, which is then processed to generate a detailed and structured resume. The app is deployed on Vercel, providing robust performance and scalability. Additionally, it uses Vercel Blob for secure PDF storage and Vercel Authentication for user access management.

---

## 👾 Features


- Automated PDF Parsing: Utilizes Langchain.js to extract text from LinkedIn profile PDFs, ensuring accurate data retrieval for resume generation.
- Dynamic Resume Generation: Creates detailed HTML resumes based on the extracted data, formatted for professional presentation.
- Responsive Web Design: Built with Next.js and styled using Tailwind CSS, ensuring a responsive and visually appealing user interface.
- Secure File Storage: Employs Vercel Blob for storing uploaded PDFs securely, ensuring data integrity and privacy.
- User Authentication: Integrates Vercel Authentication to manage user sessions and access, enhancing security.
- Seamless Deployment: Deployed on Vercel, offering high availability and automatic scaling to handle varying loads.
- Raw HTML Display: Allows users to view the generated resume in raw HTML format, providing a detailed and customizable view.

These features make the AI Resume Generator an essential tool for professionals looking to streamline their resume creation process with minimal effort and maximum efficiency.

---

## 📂 Repository Structure

```sh
└── ai_resume_generator/
    ├── README.md
    ├── app
    │   ├── api
    │   ├── components
    │   ├── favicon.ico
    │   ├── fonts
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── declarations.d.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## 🧩 Modules

<details closed><summary>.</summary>

| File | Summary |
| --- | --- |
| [postcss.config.mjs](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/postcss.config.mjs) | <code>❯ REPLACE-ME</code> |
| [tailwind.config.ts](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/tailwind.config.ts) | <code>❯ REPLACE-ME</code> |
| [tsconfig.json](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/tsconfig.json) | <code>❯ REPLACE-ME</code> |
| [package.json](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/package.json) | <code>❯ REPLACE-ME</code> |
| [next.config.mjs](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/next.config.mjs) | <code>❯ REPLACE-ME</code> |
| [declarations.d.ts](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/declarations.d.ts) | <code>❯ REPLACE-ME</code> |
| [package-lock.json](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/package-lock.json) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app</summary>

| File | Summary |
| --- | --- |
| [globals.css](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/app/globals.css) | <code>❯ REPLACE-ME</code> |
| [page.tsx](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/app/page.tsx) | <code>❯ REPLACE-ME</code> |
| [layout.tsx](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/app/layout.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.components.ui</summary>

| File | Summary |
| --- | --- |
| [progress.tsx](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/app/components/ui/progress.tsx) | <code>❯ REPLACE-ME</code> |
| [button.tsx](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/app/components/ui/button.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.api.process-pdf</summary>

| File | Summary |
| --- | --- |
| [route.ts](https://github.com/SriPrarabdha/ai_resume_generator/blob/main/app/api/process-pdf/route.ts) | <code>❯ REPLACE-ME</code> |

</details>

---

## 🚀 Getting Started

### 🔖 Prerequisites

**TypeScript**: `version x.y.z`

### 📦 Installation

Build the project from source:

1. Clone the ai_resume_generator repository:
```sh
❯ git clone https://github.com/SriPrarabdha/ai_resume_generator
```

2. Navigate to the project directory:
```sh
❯ cd ai_resume_generator
```

3. Install the required dependencies:
```sh
❯ npm install
```

### 🤖 Usage

To run the project, execute the following command:

```sh
❯ npm run build && node dist/main.js
```
import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import pdf from 'pdf-parse';
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { z } from "zod";

const ResumeDataSchema = z.object({
  name: z.string().optional(),
  contactInfo: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  summary: z.string().optional(),
  experience: z.array(z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    dates: z.string().optional(),
    achievements: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(z.object({
    degree: z.string().optional(),
    institution: z.string().optional(),
    major: z.string().optional(),
    dates: z.string().optional(),
  })).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).optional(),
  certifications: z.array(z.union([z.string(), z.object({ name: z.string() })])).optional(),
  languages: z.array(z.string()).optional(),
});

const resumeParser = StructuredOutputParser.fromNamesAndDescriptions({
  name: "Full name of the person",
  contactInfo: "Contact information including email, phone, location, and LinkedIn profile URL",
  summary: "A brief professional summary",
  experience: "Array of work experiences, each containing job title, company, dates, and key achievements",
  education: "Array of educational qualifications, including degree, institution, major, and dates",
  skills: "List of relevant skills",
  projects: "Array of notable projects, if any",
  certifications: "Array of certifications, if any",
  languages: "List of languages known, if any",
});

const resumeTemplate = PromptTemplate.fromTemplate(`
You are an AI assistant that generates professional, ATS-friendly resumes based on LinkedIn profile information.
Extract the most relevant information from the provided LinkedIn profile and create a structured resume.must include a brief professiona;
summary, experience, education, skills, projects, certifications, and languages.

{format_instructions}

LinkedIn Profile Information:
{profile_info}

Generate a structured resume based on the above information. Be sure to extract and include all relevant details, including the person's name, contact information, work experience, education, skills, projects, certifications, and languages. If any information is not available, leave it blank or omit it from the structure.
`);

interface ResumeData {
    name?: string;
    contactInfo: {
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
    };
    summary?: string;
    experience?: {
      title?: string;
      company?: string;
      dates?: string;
      achievements?: string[];
    }[];
    education?: {
      degree?: string;
      institution?: string;
      major?: string;
      dates?: string;
    }[];
    skills?: string[];
    projects?: {
      name: string;
      description: string;
    }[];
    certifications?: (string | { name: string })[];
    languages?: string[];
  }

  function generateHTMLResume(resumeData: ResumeData) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resumeData.name || 'Professional Resume'}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h1, h2 {
            color: #2c3e50;
            margin-bottom: 10px;
          }
          h1 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
            margin-top: 20px;
          }
          .contact-info {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }
          .contact-info span {
            margin-right: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .experience-item, .education-item {
            margin-bottom: 15px;
          }
          .experience-item h3, .education-item h3 {
            margin-bottom: 5px;
            color: #2980b9;
          }
          .skills-list, .languages-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .skill-item, .language-item {
            background-color: #ecf0f1;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>${resumeData.name || 'Professional Resume'}</h1>
            <div class="contact-info">
              ${resumeData.contactInfo.email ? `<span>📧 ${resumeData.contactInfo.email}</span>` : ''}
              ${resumeData.contactInfo.phone ? `<span>📱 ${resumeData.contactInfo.phone}</span>` : ''}
              ${resumeData.contactInfo.location ? `<span>📍 ${resumeData.contactInfo.location}</span>` : ''}
              ${resumeData.contactInfo.linkedin ? `<span>🔗 <a href="${resumeData.contactInfo.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
            </div>
          </header>
  
          ${resumeData.summary ? `
          <section class="section">
            <h2>Professional Summary</h2>
            <p>${resumeData.summary}</p>
          </section>
          ` : ''}
  
          ${resumeData.experience && resumeData.experience.length > 0 ? `
          <section class="section">
            <h2>Professional Experience</h2>
            ${resumeData.experience.map(job => `
              <div class="experience-item">
                <h3>${job.title} at ${job.company}</h3>
                <p>${job.dates}</p>
                ${job.achievements && job.achievements.length > 0 ? `
                  <ul>
                    ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}
  
          ${resumeData.education && resumeData.education.length > 0 ? `
          <section class="section">
            <h2>Education</h2>
            ${resumeData.education.map(edu => `
              <div class="education-item">
                <h3>${edu.degree}${edu.major ? ` in ${edu.major}` : ''}</h3>
                <p>${edu.institution}, ${edu.dates}</p>
              </div>
            `).join('')}
          </section>
          ` : ''}
  
          ${resumeData.skills && resumeData.skills.length > 0 ? `
          <section class="section">
            <h2>Skills</h2>
            <div class="skills-list">
              ${resumeData.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
            </div>
          </section>
          ` : ''}
  
          ${resumeData.projects && resumeData.projects.length > 0 ? `
          <section class="section">
            <h2>Projects</h2>
            ${resumeData.projects.map(project => `
              <div class="project-item">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
              </div>
            `).join('')}
          </section>
          ` : ''}
  
          ${resumeData.certifications && resumeData.certifications.length > 0 ? `
          <section class="section">
            <h2>Certifications</h2>
            <ul>
              ${resumeData.certifications.map(cert => `<li>${typeof cert === 'string' ? cert : cert.name}</li>`).join('')}
            </ul>
          </section>
          ` : ''}
  
          ${resumeData.languages && resumeData.languages.length > 0 ? `
          <section class="section">
            <h2>Languages</h2>
            <div class="languages-list">
              ${resumeData.languages.map(lang => `<span class="language-item">${lang}</span>`).join('')}
            </div>
          </section>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }
  function extractJSONFromString(str: string): string {
    // First, try to find JSON between triple backticks
    const match = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      return match[1].trim();
    }

    // If no match found, try to extract the largest JSON-like substring
    const jsonStart = str.indexOf('{');
    const jsonEnd = str.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      return str.slice(jsonStart, jsonEnd + 1);
    }

    // If still no valid JSON found, return the original string
    return str;
  }
  
  export async function POST(req: NextRequest) {
    try {
      const { fileUrl, apiKey } = await req.json();

      if (!fileUrl || !apiKey) {
        return NextResponse.json({ error: 'File URL and API key are required' }, { status: 400 });
      }
  
      console.log('Received file URL:', fileUrl);

      // Fetch the PDF file
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from PDF using pdf-parse
      const data = await pdf(buffer);
      console.log('PDF parsed, number of pages:', data.numpages);
      const extractedText = data.text;
      console.log('Extracted text length:', extractedText.length);
  
      // Select the appropriate model
      let model;
      if (apiKey.startsWith('gsk_')) {
        model = new ChatGroq({
          apiKey: apiKey,
          model: "llama-3.1-70b-versatile",
          temperature: 0
        });
      } else {
        model = new ChatOpenAI({
          modelName: "gpt-4",
          openAIApiKey: apiKey,
          temperature: 0
        });
      }
  
      // Create a chain for generating the structured resume data
      const chain = RunnableSequence.from([
        {
          format_instructions: () => "Return the resume data as a valid JSON object without any additional text or formatting.",
          profile_info: (input: string) => input,
        },
        resumeTemplate,
        model,
        new StringOutputParser(),
      ]);
  
      const rawResumeData = await chain.invoke(extractedText);
      console.log('Raw resume data:', rawResumeData);
  
      // Extract JSON from the raw string and parse it
      const jsonString = extractJSONFromString(rawResumeData);
      console.log('Extracted JSON string:', jsonString);
  
      let parsedResumeData;
      try {
        parsedResumeData = JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing resume data:', error);
        console.error('Problematic JSON string:', jsonString);
        return NextResponse.json({ error: 'Error parsing resume data', details: (error as Error).message, stack: (error as Error).stack }, { status: 500 });
      }
  
      // Process the parsed data to match our expected schema
      const processedResumeData = {
        name: parsedResumeData.name,
        contactInfo: {
          email: parsedResumeData.contact?.email,
          phone: parsedResumeData.contact?.phone,
          location: parsedResumeData.contact?.location,
          linkedin: `${parsedResumeData.contact?.website || ''}${parsedResumeData.contact?.linkedin || ''}`,
        },
        summary: parsedResumeData.summary,
        experience: parsedResumeData.experience?.map((exp: any) => ({
          title: exp.title || exp.position,
          company: exp.company,
          dates: exp.dates || exp.tenure,
          achievements: exp.achievements || exp.keyAchievements || [],
        })) || [],
        education: parsedResumeData.education?.map((edu: any) => ({
          degree: edu.degree,
          institution: edu.institution,
          major: edu.major || edu.field || edu.degree?.split(',')[1]?.trim(),
          dates: edu.dates || edu.graduation_date,
        })) || [],
        skills: parsedResumeData.skills || parsedResumeData.top_skills || [],
        projects: parsedResumeData.projects || [],
        certifications: parsedResumeData.certifications?.map((cert: any) => 
          typeof cert === 'string' ? cert : cert.name
        ) || [],
        languages: parsedResumeData.languages?.map((lang: any) => 
          typeof lang === 'string' ? lang : `${lang.name || lang.language} (${lang.level || lang.proficiency})`
        ).filter((lang: string) => !lang.startsWith('undefined')) || [],
      };
  
      console.log('Processed resume data:', JSON.stringify(processedResumeData, null, 2));
  
      // Validate the processed data
      const validatedResumeData = ResumeDataSchema.parse(processedResumeData);
      const htmlResume = generateHTMLResume(validatedResumeData);
  
      return NextResponse.json({ resume: htmlResume });
    } catch (error) {
      console.error('Error processing PDF:', error);
      return NextResponse.json({ error: 'Error processing PDF', details: (error as Error).message, stack: (error as Error).stack }, { status: 500 });
    }
  }
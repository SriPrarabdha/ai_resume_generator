import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
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
  certifications: z.array(z.string()).optional(),
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
Extract the most relevant information from the provided LinkedIn profile and create a structured resume.

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
    certifications?: string[];
    languages?: string[];
  }

function generateHTMLResume(resumeData: ResumeData) {
  console.log('Received resumeData:', JSON.stringify(resumeData, null, 2));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resumeData.name || 'Resume'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2 { color: #2c3e50; }
        .section { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>${resumeData.name || 'Name Not Provided'}</h1>
          <p>${resumeData.contactInfo.email || ''} | ${resumeData.contactInfo.phone || ''} | ${resumeData.contactInfo.location || ''} | <a href="${resumeData.contactInfo.linkedin || '#'}">${resumeData.contactInfo.linkedin || ''}</a></p>
        </header>
        <section class="section">
          <h2>Professional Summary</h2>
          <p>${resumeData.summary || 'No summary provided'}</p>
        </section>
        <section class="section">
          <h2>Experience</h2>
          ${resumeData.experience?.map(job => `
            <div>
              <h3>${job.title || ''} at ${job.company || ''}</h3>
              <p>${job.dates || ''}</p>
              <ul>
                ${job.achievements?.map(achievement => `<li>${achievement}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
        <section class="section">
          <h2>Education</h2>
          ${resumeData.education?.map(edu => `
            <p>${edu.degree || ''} in ${edu.major || ''} - ${edu.institution || ''}, ${edu.dates || ''}</p>
          `).join('')}
        </section>
        <section class="section">
          <h2>Skills</h2>
          <ul>
            ${resumeData.skills?.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
        </section>
        ${resumeData.projects && resumeData.projects.length > 0 ? `
          <section class="section">
            <h2>Projects</h2>
            ${resumeData.projects.map(project => `
              <div>
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
              ${resumeData.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
        ${resumeData.languages && resumeData.languages.length > 0 ? `
          <section class="section">
            <h2>Languages</h2>
            <ul>
              ${resumeData.languages.map(lang => `<li>${lang}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const apiKey = formData.get('apiKey') as string;

    if (!file || !apiKey) {
      return NextResponse.json({ error: 'File and API key are required' }, { status: 400 });
    }

    // Extract text from PDF
    const loader = new PDFLoader(file);
    const docs = await loader.load();
    const extractedText = docs.map((doc: { pageContent: string }) => doc.pageContent).join('\n');

    // Select the appropriate model
    let model;
    if (apiKey.startsWith('gsk_')) {
      model = new ChatGroq({
        apiKey: apiKey,
        model: "mixtral-8x7b-32768",
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
        format_instructions: () => resumeParser.getFormatInstructions(),
        profile_info: (input: string) => input,
      },
      resumeTemplate,
      model,
      new StringOutputParser(),
      resumeParser,
    ]);

    const rawResumeData = await chain.invoke(extractedText);
    console.log('Raw resume data:', JSON.stringify(rawResumeData, null, 2));

    const parsedResumeData = ResumeDataSchema.parse(rawResumeData);
    const htmlResume = generateHTMLResume(parsedResumeData as ResumeData);

    return NextResponse.json({ resume: htmlResume });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Error processing PDF', details: (error as Error).message }, { status: 500 });
  }
}
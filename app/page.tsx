'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, ArrowRight, CheckCircle, Key } from 'lucide-react'
import { Button } from './components/ui/button'
import { Progress } from './components/ui/progress'
import { put } from '@vercel/blob';

export default function ResumeGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [apiKey, setApiKey] = useState('')
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const [generatedResume, setGeneratedResume] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleGenerate = async () => {
    if (!file || !isApiKeyValid) {
      alert('Please upload a LinkedIn profile PDF and provide a valid API key')
      return
    }
    setIsGenerating(true)
    setProgress(0)

    try {
      // Upload file to Vercel Blob
      const blob = await put(file.name, file, {
        access: 'public',
      });

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: blob.url,
          apiKey: apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF')
      }

      const data = await response.json()
      setGeneratedResume(data.resume)

      // Simulating progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setIsGenerating(false)
      alert('Resume generated successfully!')
    } catch (error) {
      console.error('Error generating resume:', error)
      setIsGenerating(false)
      alert(`An error occurred while generating the resume: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleApiKeySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically validate the API key with your backend
    // For this example, we'll consider any non-empty string as valid
    if (apiKey.trim() !== '') {
      setIsApiKeyValid(true)
    } else {
      alert('Please enter a valid API key')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="relative z-10">
              <motion.h1 
                className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="block">Transform your</span>
                <span className="block text-indigo-600">LinkedIn profile</span>
              </motion.h1>
              <motion.p 
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Our AI-powered tool converts your LinkedIn PDF into a stunning, professional HTML resume in seconds. Stand out from the crowd and land your dream job.
              </motion.p>
              <motion.div 
                className="mt-8 sm:mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  onClick={() => document.getElementById('resume-generator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </Button>
              </motion.div>
            </div>
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-3xl transform rotate-3 scale-105"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 1, delay: 0.4 }}
              />
              <motion.div
                className="relative bg-white p-8 rounded-3xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-4 bg-gray-200 rounded"
                      style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                    />
                  ))}
                </div>
                <motion.div
                  className="mt-6 flex items-center text-sm text-indigo-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  AI-Optimized Resume
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </section>

      {/* Resume Generator Section */}
      <section id="resume-generator" className="py-16 sm:py-24 relative">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-xl relative z-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">AI Resume Generator</h2>
            
            {/* API Key Input */}
            <form onSubmit={handleApiKeySubmit} className="mb-6">
              <div className="flex items-center border-b border-indigo-500 py-2">
                <Key className="text-indigo-500 mr-3" />
                <input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  disabled={isApiKeyValid}
                />
                <Button type="submit" disabled={isApiKeyValid}>
                  {isApiKeyValid ? 'Submitted' : 'Submit'}
                </Button>
              </div>
            </form>

            {/* File upload area */}
            <AnimatePresence>
              {isApiKeyValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors duration-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-indigo-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">LinkedIn Profile PDF</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File name display */}
            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center mb-6 text-sm text-gray-600"
                >
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  {file.name}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate button */}
            <AnimatePresence>
              {isApiKeyValid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={!file || isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <span>{isGenerating ? 'Generating...' : 'Generate HTML Resume'}</span>
                    {!isGenerating && <ArrowRight className="w-5 h-5" />}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                <Progress value={progress} className="h-2 bg-indigo-100" indicatorClassName="bg-indigo-600" />
              </motion.div>
            )}
          </motion.div>
        </div>
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
          <motion.div
            className="w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </section>

      

      {/* Generated Resume Section */}
      {generatedResume && (
        <section className="py-16 sm:py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-xl relative z-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Generated Resume</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <iframe
                  srcDoc={generatedResume}
                  title="Generated Resume"
                  className="w-full h-screen border-none"
                  sandbox="allow-scripts"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => {
                    const blob = new Blob([generatedResume], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'generated_resume.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download HTML Resume
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
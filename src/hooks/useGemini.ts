import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useCallback } from 'react';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (prompt: string, apiKey: string) => {
    if (!apiKey) {
      setError('Please provide a Gemini API key');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setIsLoading(false);
      return text;
    } catch (err) {
      console.error('Gemini API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      setIsLoading(false);
      return null;
    }
  }, []);

  const generateStructuredContent = useCallback(async (
    prompt: string, 
    apiKey: string,
    schema?: any
  ) => {
    if (!apiKey) {
      setError('Please provide a Gemini API key');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setIsLoading(false);
      return JSON.parse(text);
    } catch (err) {
      console.error('Gemini API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate structured content');
      setIsLoading(false);
      return null;
    }
  }, []);

  // Helper function for retry logic with exponential backoff
  const retryWithBackoff = async (
    fn: () => Promise<any>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<any> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries - 1;
        const isRetryableError = error.message?.includes('503') || 
                                 error.message?.includes('overloaded') ||
                                 error.message?.includes('temporarily unavailable');
        
        if (isLastAttempt || !isRetryableError) {
          throw error;
        }
        
        // Exponential backoff: wait longer between each retry
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const generateLogo = useCallback(async (prompt: string, apiKey: string) => {
    if (!apiKey) {
      setError('Please provide a Gemini API key');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Use the image generation model with retry logic
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp'
      });
      
      const generateWithRetry = async () => {
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{
              text: prompt
            }]
          }]
        });
        
        const response = await result.response;
        
        // Check if response contains image data
        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
          const parts = candidates[0].content.parts;
          
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              // Convert base64 to blob URL for display
              const imageData = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/png';
              const blob = base64ToBlob(imageData, mimeType);
              const imageUrl = URL.createObjectURL(blob);
              
              return {
                imageUrl,
                imageData,
                mimeType
              };
            }
          }
        }
        
        throw new Error('No image generated in response');
      };

      const result = await retryWithBackoff(generateWithRetry, 3, 2000);
      setIsLoading(false);
      return result;
      
    } catch (err: any) {
      console.error('Gemini Logo Generation error:', err);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to generate logo';
      
      if (err.message?.includes('503') || err.message?.includes('overloaded')) {
        errorMessage = 'The AI service is temporarily overloaded. Please try again in a few moments.';
      } else if (err.message?.includes('quota') || err.message?.includes('limit')) {
        errorMessage = 'API quota exceeded. Please check your API usage limits.';
      } else if (err.message?.includes('authentication') || err.message?.includes('API key')) {
        errorMessage = 'Invalid API key. Please check your Gemini API key.';
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return {
    generateContent,
    generateStructuredContent,
    generateLogo,
    isLoading,
    error
  };
};
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Ensures Gemini is configured properly. Returns null if missing.
 */
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_google_api_key_here') {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

async function generateSummary(skills, jobTitle) {
  const model = getModel();
  if (!model) {
    return "AI ERROR: Missing API Key. (Fallback) Experienced professional with a proven track record of leveraging data to drive strategic decisions and improve operational efficiency across fast-paced environments.";
  }

  const prompt = `
    You are an expert executive resume writer. 
    Write a 3-sentence professional summary for a candidate whose top job match is "${jobTitle || 'Executive'}".
    Their core extracted skills are: ${skills.join(', ')}.
    Do NOT use first-person pronouns (like "I" or "my"). Focus on impact, leadership, and technical prowess.
    Only return the summary text perfectly formatted, nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini generateSummary error:", error.message);
    return `AI ERROR: ${error.message}`;
  }
}

async function enhanceBulletPoint(originalText) {
  const model = getModel();
  if (!model) {
    return `AI ERROR: Missing API Key. (Fallback enhanced) ${originalText}`;
  }

  const prompt = `
    You are an expert executive resume writer.
    Enhance the following resume bullet point to make it sound highly professional, action-oriented, and impactful.
    Original bullet point: "${originalText}"
    Keep it to one sentence. Do NOT invent fake metrics, but do sound more strategic.
    Only return the enhanced bullet point text perfectly formatted, nothing else.
  `;

  try {
    const result = await model.generateContent(prompt);
    let enhanced = result.response.text().trim();
    if (enhanced.startsWith('-') || enhanced.startsWith('*')) {
      enhanced = enhanced.substring(1).trim();
    }
    return enhanced;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "AI ERROR: Failed to enhance bullet point. Please check your API limits.";
  }
}

async function generateExperienceBullets({ jobTitle, industry, userTasks, tools, experienceLevel }) {
  const model = getModel();

  const prompt = `You are an expert ATS-optimized resume writer. Generate high-quality, ATS-friendly resume experience bullet points based on the following user input.

Follow these rules strictly:
- Use concise, professional language
- Start bullet points with strong action verbs
- Focus on achievements, not just responsibilities
- Include measurable results whenever possible (numbers, percentages, impact)
- Avoid generic phrases like "responsible for" or "worked on"
- Do not invent unrealistic or unverifiable achievements
- Keep each bullet point between 1–2 lines
- Tailor content to the provided job title and industry

User Input:
- Job Title: ${jobTitle || 'Professional'}
- Industry: ${industry || 'General'}
- Tasks/Responsibilities: ${userTasks || 'General duties'}
- Tools/Skills Used: ${tools || 'Various tools'}
- Experience Level: ${experienceLevel || 'Mid-level'}

Output Format:
- 3–5 bullet points
- Each bullet point should be impactful and results-driven
- Use plain text only (no emojis, no special formatting)
- Return ONLY the bullet points, one per line, starting with a dash (-)`;

  if (!model) {
    const fallback = [
      `- Executed core ${jobTitle || 'professional'} responsibilities with consistent delivery across all assigned projects.`,
      `- Collaborated with cross-functional teams to streamline ${industry || 'business'} workflows and improve operational outcomes.`,
      `- Applied ${tools || 'relevant tools and technologies'} to solve complex problems and drive measurable results.`,
    ];
    return `AI ERROR: Missing API Key. (Fallback)\n${fallback.join('\n')}`;
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return 'AI ERROR: Failed to generate bullets. Please check your API limits.';
  }
}

module.exports = {
  generateSummary,
  enhanceBulletPoint,
  generateExperienceBullets,
};

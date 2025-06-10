import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }
    console.log("🤖 Initializing Gemini service...");
    console.log("API Key present:", !!apiKey);
    console.log("API Key length:", apiKey.length);

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateLearningPath(skills: any[], goals: any[]): Promise<string> {
    const skillsContext = skills
      .map(
        (skill) =>
          `${skill.name} (${skill.category}) - Proficiency: ${skill.proficiency}/5`
      )
      .join("\n");
    const goalsContext = goals
      .map(
        (goal) =>
          `${goal.title} (${goal.category}) - ${goal.difficulty} level, Priority: ${goal.priority}, Status: ${goal.status}`
      )
      .join("\n");

    const prompt = `
As an AI learning advisor for developers, analyze the following user data and provide personalized learning recommendations:

CURRENT SKILLS:
${skillsContext || "No skills tracked yet"}

LEARNING GOALS:
${goalsContext || "No learning goals set yet"}

Please provide:
1. A personalized learning path with 3-5 specific recommendations
2. Suggested order of learning based on skill dependencies
3. Estimated time commitments for each recommendation
4. Resources or technologies to focus on
5. Skills that need improvement based on current proficiency levels

Format your response in a clear, actionable manner that helps the developer plan their learning journey effectively.
    `;
    try {
      console.log("📤 Sending learning path request to Gemini...");
      console.log("Skills count:", skills.length);
      console.log("Goals count:", goals.length);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("✅ Gemini response received, length:", text.length);
      return text;
    } catch (error: any) {
      console.error("❌ Gemini API error:", error);
      console.error("Error details:", error.message);

      // Provide a fallback response instead of throwing an error
      return this.getFallbackLearningPath(skills, goals);
    }
  }

  async suggestSkillCategories(currentSkills: string[]): Promise<string> {
    const skillsContext = currentSkills.join(", ") || "No skills specified";

    const prompt = `
Based on the following developer skills: ${skillsContext}

Suggest 5-7 complementary skill categories or specific technologies that would enhance this developer's career prospects. Consider:
1. Market demand and trends
2. Natural skill progressions
3. Full-stack development opportunities
4. Emerging technologies
5. Career advancement potential

Provide brief explanations for each suggestion and why it complements their existing skillset.
    `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return this.getFallbackSkillSuggestions(currentSkills);
    }
  }

  async analyzeSkillGaps(skills: any[], targetRole: string): Promise<string> {
    const skillsContext = skills
      .map(
        (skill) =>
          `${skill.name} (${skill.category}) - Level ${skill.proficiency}/10`
      )
      .join("\n");

    const prompt = `
Analyze the skill gaps for a developer targeting the role: "${targetRole}"

CURRENT SKILLS:
${skillsContext || "No skills tracked yet"}

Please provide:
1. Skills that are well-developed for this role
2. Critical skill gaps that need immediate attention
3. Nice-to-have skills for competitive advantage
4. Recommended proficiency levels for each skill area
5. Learning priorities and timeline suggestions

Focus on practical, actionable insights that help bridge the gap between current abilities and role requirements.
    `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return this.getFallbackSkillGapAnalysis(skills, targetRole);
    }
  }
  async generateStudyPlan(goal: any, userSkills: any[]): Promise<string> {
    const skillsContext = userSkills
      .map((skill) => `${skill.name} - Level ${skill.proficiency}/10`)
      .join("\n");

    const prompt = `
Create a detailed study plan for the following learning goal:

GOAL: ${goal.title}
DESCRIPTION: ${goal.description || "No description provided"}
CATEGORY: ${goal.category}
DIFFICULTY: ${goal.difficulty}
PRIORITY: ${goal.priority}
STATUS: ${goal.status}
PROGRESS: ${goal.progress}%
TARGET DATE: ${
      goal.targetDate
        ? new Date(goal.targetDate).toLocaleDateString()
        : "Not set"
    }

CURRENT SKILLS:
${skillsContext || "No skills tracked"}

Please provide:
1. Week-by-week breakdown of learning activities
2. Specific resources (courses, tutorials, documentation)
3. Practical projects to build
4. Milestones and checkpoints
5. Time estimates for each phase
6. Prerequisites and preparation steps

Make the plan realistic and achievable based on the difficulty level and existing skills.
    `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return this.getFallbackStudyPlan(goal, userSkills);
    }
  }

  // Fallback methods for when Gemini API is unavailable
  private getFallbackLearningPath(skills: any[], goals: any[]): string {
    console.log("🔄 Using fallback learning path generation...");

    const skillsText =
      skills.length > 0
        ? skills
            .map(
              (skill) =>
                `${skill.name} (${skill.category}) - Level ${skill.proficiency}/10`
            )
            .join("\n")
        : "No skills tracked yet";

    const goalsText =
      goals.length > 0
        ? goals.map((goal) => `${goal.title} - ${goal.status}`).join("\n")
        : "No learning goals set yet";

    return `# Personalized Learning Path (Generated Offline)

## Current Skills Assessment
${skillsText}

## Learning Goals
${goalsText}

## Recommendations
Based on your current skills and goals, here are some recommendations:

1. **Focus on Skill Gaps**: Review your skills with proficiency below 5 and prioritize improvement
2. **Complete Active Goals**: Work on your in-progress learning goals systematically
3. **Build Portfolio Projects**: Apply your skills in real-world projects
4. **Stay Updated**: Keep learning new technologies in your field
5. **Practice Regularly**: Consistent practice is key to skill development

## Next Steps
- Set specific, measurable learning goals
- Create a study schedule
- Find online courses or tutorials for skill gaps
- Build projects to apply new knowledge
- Track your progress regularly

*Note: This is a basic recommendation. For AI-powered personalized suggestions, please check your Gemini API configuration.*`;
  }

  private getFallbackSkillSuggestions(currentSkills: string[]): string {
    console.log("🔄 Using fallback skill suggestions...");

    return `# Skill Development Suggestions (Generated Offline)

## Based on your current skills: ${currentSkills.join(", ") || "None specified"}

## Recommended Skills to Consider:

### Core Development Skills
- **Version Control**: Git, GitHub/GitLab
- **Testing**: Unit testing, Integration testing
- **Debugging**: Debugging tools and techniques
- **Documentation**: Technical writing, API documentation

### Popular Technologies
- **Frontend**: React, Vue.js, Angular, TypeScript
- **Backend**: Node.js, Python, Java, C#
- **Databases**: PostgreSQL, MongoDB, Redis
- **Cloud**: AWS, Azure, Google Cloud

### DevOps & Tools
- **Containerization**: Docker, Kubernetes
- **CI/CD**: Jenkins, GitHub Actions, GitLab CI
- **Monitoring**: Application monitoring and logging
- **Security**: Security best practices, OWASP

*Note: This is a basic suggestion. For AI-powered personalized recommendations, please check your Gemini API configuration.*`;
  }

  private getFallbackSkillGapAnalysis(
    skills: any[],
    targetRole: string
  ): string {
    console.log("🔄 Using fallback skill gap analysis...");

    const skillsText =
      skills.length > 0
        ? skills
            .map(
              (skill) =>
                `${skill.name} (${skill.category}) - Level ${skill.proficiency}/10`
            )
            .join("\n")
        : "No skills tracked yet";

    return `# Skill Gap Analysis for ${targetRole} (Generated Offline)

## Your Current Skills
${skillsText}

## Common Skills for ${targetRole}
Based on industry standards, here are typical skills needed:

### Technical Skills
- Programming languages relevant to the role
- Frameworks and libraries
- Database knowledge
- Version control (Git)
- Testing methodologies

### Soft Skills
- Problem-solving
- Communication
- Team collaboration
- Project management
- Continuous learning

## General Recommendations
1. **Assess Current Level**: Compare your skills with job requirements
2. **Identify Gaps**: Focus on missing or weak skills
3. **Create Learning Plan**: Prioritize high-impact skills
4. **Gain Experience**: Work on projects that use target skills
5. **Stay Updated**: Keep up with industry trends

*Note: This is a basic analysis. For AI-powered personalized gap analysis, please check your Gemini API configuration.*`;
  }

  private getFallbackStudyPlan(goal: any, userSkills: any[]): string {
    console.log("🔄 Using fallback study plan generation...");

    return `# Study Plan for: ${goal.title} (Generated Offline)

## Goal Details
- **Title**: ${goal.title}
- **Description**: ${goal.description || "No description provided"}
- **Category**: ${goal.category || "General"}
- **Priority**: ${goal.priority || "Medium"}
- **Status**: ${goal.status || "Not started"}
- **Target Date**: ${
      goal.targetDate
        ? new Date(goal.targetDate).toLocaleDateString()
        : "Not set"
    }

## Recommended Study Plan

### Week 1-2: Foundation
- Research and understand the basics
- Gather learning resources (courses, books, tutorials)
- Set up development environment if needed

### Week 3-4: Core Learning
- Follow structured learning materials
- Take notes and create summaries
- Practice with small exercises

### Week 5-6: Hands-on Practice
- Build practice projects
- Apply concepts in real scenarios
- Troubleshoot and debug issues

### Week 7-8: Advanced Topics
- Explore advanced concepts
- Learn best practices
- Study real-world implementations

### Ongoing: Review and Reinforce
- Regular practice sessions
- Code reviews and feedback
- Stay updated with latest developments

## Resources to Consider
- Online courses (Coursera, Udemy, Pluralsight)
- Documentation and official guides
- Community forums and Stack Overflow
- GitHub repositories and open source projects
- YouTube tutorials and tech talks

*Note: This is a basic study plan. For AI-powered personalized recommendations, please check your Gemini API configuration.*`;
  }
}

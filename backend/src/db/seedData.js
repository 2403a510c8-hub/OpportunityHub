/**
 * Rich realistic initial seed data for Opportunity Hub
 */
const seedData = {
  users: [
    {
      id: "usr_student_01",
      name: "Alex Rivera",
      email: "alex@example.com",
      // default demo password: password123 (bcrypt hash for "password123")
      passwordHash: "$2a$10$wT0lVlZfVekY9hF33mQ3Z.0B89qG0xeqjYnC2gT0lR17x6pS8Q9W.",
      role: "applicant",
      headline: "Computer Science Senior @ Stanford | Full-Stack & ML Enthusiast",
      bio: "Passionate software engineering student with experience in React, Node.js, and PyTorch. Built open-source tools with 1k+ GitHub stars. Looking for Summer 2026 internships and hackathons.",
      location: "San Francisco, CA (Open to Remote)",
      skills: ["React", "TypeScript", "Node.js", "Python", "PyTorch", "Docker", "Tailwind CSS"],
      education: "B.S. in Computer Science, Stanford University (Expected 2026)",
      github: "https://github.com/alexrivera-demo",
      linkedin: "https://linkedin.com/in/alexrivera-demo",
      portfolio: "https://alexrivera.dev",
      resumeUrl: "https://alexrivera.dev/resume.pdf",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      createdAt: "2026-01-15T10:00:00.000Z"
    },
    {
      id: "usr_recruiter_01",
      name: "Elena Vance",
      email: "elena@stripe.com",
      passwordHash: "$2a$10$wT0lVlZfVekY9hF33mQ3Z.0B89qG0xeqjYnC2gT0lR17x6pS8Q9W.",
      role: "recruiter",
      organization: "Stripe",
      headline: "University Talent Lead @ Stripe",
      bio: "Helping empower the next generation of engineers and designers building economic infrastructure for the internet.",
      location: "San Francisco, CA",
      skills: ["Technical Recruiting", "Campus Outreach", "Talent Acquisition"],
      education: "B.A. in Psychology, UC Berkeley",
      linkedin: "https://linkedin.com/in/elenavance-recruiter",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
      createdAt: "2026-01-10T08:30:00.000Z"
    },
    {
      id: "usr_recruiter_02",
      name: "Marcus Chen",
      email: "marcus@mit.edu",
      passwordHash: "$2a$10$wT0lVlZfVekY9hF33mQ3Z.0B89qG0xeqjYnC2gT0lR17x6pS8Q9W.",
      role: "recruiter",
      organization: "MIT Innovation Initiative",
      headline: "Director of Student Programs & Hackathons @ MIT",
      bio: "Organizing flagship hackathons and research grants for global student innovators.",
      location: "Cambridge, MA",
      skills: ["Program Management", "Hackathon Organization", "Grant Allocation"],
      education: "M.Ed, Harvard University",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      createdAt: "2026-01-12T09:15:00.000Z"
    }
  ],

  opportunities: [
    {
      id: "opp_001",
      title: "Software Engineering Intern - Core Infrastructure",
      organization: "Stripe",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
      type: "Internship",
      category: "Engineering",
      workMode: "Hybrid",
      location: "San Francisco, CA / Seattle, WA",
      experienceLevel: "Students & New Grads",
      salaryOrStipend: "$58 - $65 / hour + Housing Stipend",
      deadline: "2026-12-15",
      featured: true,
      description: "Join Stripe's Core Infrastructure engineering team to scale distributed ledger systems processing hundreds of billions of dollars annually. You will collaborate directly with seasoned engineers deploying robust APIs and zero-downtime microservices.",
      requirements: [
        "Currently pursuing a BS/MS in Computer Science or related STEM field graduating between Dec 2026 and June 2027",
        "Proficiency in at least one modern language: Go, Java, Python, Ruby, or Rust",
        "Solid grasp of fundamental data structures, algorithms, and system design concepts",
        "Eagerness to tackle high-scale distributed systems challenges"
      ],
      responsibilities: [
        "Design, build, and deploy production-grade software features within Stripe's payments stack",
        "Participate in code reviews, design documentation, and architectural syncs",
        "Collaborate with cross-functional teams including Product, Security, and Reliability"
      ],
      benefits: [
        "$10,000 corporate housing allowance or subsidized corporate housing",
        "Comprehensive health, vision, and wellness coverage",
        "Dedicated 1-on-1 staff engineer mentorship throughout the 12-week program",
        "Full-time return offer opportunities upon graduation"
      ],
      tags: ["Distributed Systems", "Go", "Cloud", "High Scale", "Fintech"],
      contactEmail: "university-jobs@stripe.com",
      applyUrl: "https://stripe.com/jobs/university",
      postedBy: "usr_recruiter_01",
      status: "Active",
      applicantsCount: 42,
      createdAt: "2026-10-01T12:00:00.000Z"
    },
    {
      id: "opp_002",
      title: "Global AI & Climate Innovation Hackathon 2026",
      organization: "MIT Innovation Lab",
      logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80",
      type: "Hackathon",
      category: "Data & AI",
      workMode: "Remote",
      location: "Global / Online",
      experienceLevel: "All Levels Welcome",
      salaryOrStipend: "$75,000 in Total Prizes + Cloud Credits",
      deadline: "2026-11-30",
      featured: true,
      description: "A premier 48-hour global virtual hackathon inviting developers, researchers, and climate advocates to leverage generative AI, computer vision, and geospatial data to build tangible solutions addressing carbon mitigation and clean energy transition.",
      requirements: [
        "Teams of 2 to 4 individuals (or register solo to be matched during mixer)",
        "Open to university students, recent grads, and independent builders globally",
        "Projects must be built during the hackathon timeline and open-sourced on GitHub"
      ],
      responsibilities: [
        "Ideate and implement an AI-driven prototype addressing one of 4 climate tracks",
        "Submit a 3-minute video demo, GitHub repo, and project pitch document",
        "Attend virtual mentor office hours with leading climate tech founders"
      ],
      benefits: [
        "1st Place: $30,000 cash grant + VC pitch day fast-track",
        "2nd Place: $20,000 cash grant | 3rd Place: $10,000 cash grant",
        "$5,000 in GPU cloud compute credits for all qualifying submissions",
        "Direct access to hiring partners from Anthropic, Google, and Climate Capital"
      ],
      tags: ["AI/ML", "ClimateTech", "Hackathon", "Prizes", "Remote"],
      contactEmail: "hackathon@mit.edu",
      applyUrl: "https://mithackclimate.org",
      postedBy: "usr_recruiter_02",
      status: "Active",
      applicantsCount: 188,
      createdAt: "2026-10-05T09:00:00.000Z"
    },
    {
      id: "opp_003",
      title: "Women in Technology Leadership Scholarship 2026-2027",
      organization: "Google & AnitaB.org",
      logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=120&q=80",
      type: "Scholarship",
      category: "Engineering",
      workMode: "Remote",
      location: "North America & International",
      experienceLevel: "Undergraduate & Graduate",
      salaryOrStipend: "$10,000 Academic Merit Grant",
      deadline: "2026-12-01",
      featured: true,
      description: "Established to inspire and empower historically underrepresented individuals in tech to become leaders in computing and technology. Recipients receive financial assistance and an invitation to the annual Google Scholars Retreat.",
      requirements: [
        "Identify as a woman currently enrolled in an accredited university",
        "Majoring in Computer Science, Computer Engineering, or closely related technical field",
        "Exemplify leadership and demonstrate a commitment to diversity in technology",
        "Maintain a strong academic record (minimum 3.2 GPA or international equivalent)"
      ],
      responsibilities: [
        "Submit academic transcripts, resume, and two essay prompts on leadership",
        "Participate in the virtual cohort onboarding and networking summit"
      ],
      benefits: [
        "$10,000 USD grant applied towards tuition, fees, and books",
        "All-expenses-paid trip to the Google Scholars Retreat at Google HQ in Mountain View",
        "Lifetime access to the Google Scholar Alumni network and career coaching"
      ],
      tags: ["Scholarship", "Women In Tech", "Diversity", "Mentorship", "Grant"],
      contactEmail: "scholars@google.com",
      applyUrl: "https://buildyourfuture.withgoogle.com/scholarships",
      postedBy: "usr_recruiter_01",
      status: "Active",
      applicantsCount: 76,
      createdAt: "2026-09-20T14:30:00.000Z"
    },
    {
      id: "opp_004",
      title: "Associate Product Designer (UI/UX)",
      organization: "Linear",
      logo: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=120&q=80",
      type: "Full-Time",
      category: "Design",
      workMode: "Remote",
      location: "Worldwide (Remote)",
      experienceLevel: "0-2 Years Experience",
      salaryOrStipend: "$95,000 - $125,000 + Equity",
      deadline: "2026-12-31",
      featured: true,
      description: "Linear is seeking an Associate Product Designer obsessed with craftsmanship, keyboard-first workflows, micro-interactions, and pristine typography. You will work on core features that millions of builders rely on daily.",
      requirements: [
        "A portfolio demonstrating mastery in web UI/UX, interaction design, and design systems",
        "Proficiency in Figma, prototyping tools, and familiarity with front-end code (HTML/CSS)",
        "Deep empathy for developer tools and high-productivity workflows"
      ],
      responsibilities: [
        "Own design execution from concept through launch for Linear mobile and desktop interfaces",
        "Design polished iconography, component libraries, and interactive design prototypes",
        "Collaborate tightly with founders and engineering to deliver rapid, bug-free iterations"
      ],
      benefits: [
        "100% remote flexibility across any timezone",
        "$4,000 home office setup allowance + top-tier Apple hardware",
        "Unlimited paid time off with mandatory 4-week minimum",
        "Generous early-stage equity grant"
      ],
      tags: ["Figma", "Product Design", "Design Systems", "UI/UX", "Remote"],
      contactEmail: "careers@linear.app",
      applyUrl: "https://linear.app/careers",
      postedBy: "usr_recruiter_01",
      status: "Active",
      applicantsCount: 64,
      createdAt: "2026-10-10T11:00:00.000Z"
    },
    {
      id: "opp_005",
      title: "Generative AI Research Fellowship",
      organization: "OpenAI Foundation",
      logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&q=80",
      type: "Fellowship",
      category: "Data & AI",
      workMode: "Hybrid",
      location: "San Francisco, CA",
      experienceLevel: "Graduate / Early Career",
      salaryOrStipend: "$120,000 Annual Stipend + $50k Compute",
      deadline: "2026-12-20",
      featured: false,
      description: "A 9-month intensive research fellowship designed to foster breakthrough research in model alignment, agentic workflows, and safe multi-modal systems. Fellows work directly alongside leading research scientists.",
      requirements: [
        "Strong mathematical foundations (linear algebra, probability, optimization)",
        "Proven hands-on experience training or fine-tuning transformer models (PyTorch/JAX)",
        "Pre-prints or publications at top-tier venues (NeurIPS, ICML, ICLR) are a strong plus"
      ],
      responsibilities: [
        "Formulate research hypotheses and design scalable empirical experiments",
        "Publish open-source benchmarks and research papers under guidance of senior advisors",
        "Present findings at quarterly internal AI symposia"
      ],
      benefits: [
        "Substantial dedicated cluster compute access (H100 GPU clusters)",
        "Comprehensive health and wellness benefits",
        "Conference travel budget to present accepted publications"
      ],
      tags: ["LLM", "Deep Learning", "PyTorch", "Research", "Safety"],
      contactEmail: "fellowships@openai.com",
      applyUrl: "https://openai.com/careers",
      postedBy: "usr_recruiter_02",
      status: "Active",
      applicantsCount: 92,
      createdAt: "2026-09-15T08:00:00.000Z"
    },
    {
      id: "opp_006",
      title: "NASA Space Apps Challenge Hackathon",
      organization: "NASA Earth Science Division",
      logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
      type: "Hackathon",
      category: "Engineering",
      workMode: "Remote",
      location: "Global Virtual",
      experienceLevel: "Open to Public",
      salaryOrStipend: "Global NASA Honors & Launch Invitation",
      deadline: "2026-11-25",
      featured: false,
      description: "Join the largest annual global hackathon tackling space exploration, satellite telemetry, and planetary data challenges using open NASA satellite datasets.",
      requirements: [
        "Anyone with an appetite for science, coding, storytelling, or design",
        "Use real NASA open data assets to build your solution"
      ],
      responsibilities: [
        "Select from 20+ real space missions challenge statements",
        "Develop an app, data visualization, hardware prototype, or educational game",
        "Publish project on the NASA Space Apps submission portal"
      ],
      benefits: [
        "Global Winners invited to view a rocket launch at NASA Kennedy Space Center",
        "Official NASA certificates of participation for all valid projects",
        "Global media coverage and NASA press release highlights"
      ],
      tags: ["NASA", "SpaceTech", "Open Data", "Hackathon", "Satellite"],
      contactEmail: "spaceapps@nasa.gov",
      applyUrl: "https://spaceappschallenge.org",
      postedBy: "usr_recruiter_02",
      status: "Active",
      applicantsCount: 310,
      createdAt: "2026-10-02T16:00:00.000Z"
    },
    {
      id: "opp_007",
      title: "Junior Full-Stack Engineer (React + Node.js)",
      organization: "Vercel",
      logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=120&q=80",
      type: "Full-Time",
      category: "Engineering",
      workMode: "Remote",
      location: "Remote (US/EU/APAC)",
      experienceLevel: "0-2 Years Experience",
      salaryOrStipend: "$90,000 - $115,000 + RSUs",
      deadline: "2027-01-15",
      featured: false,
      description: "Work on Next.js developer experience, documentation tooling, and developer dashboard interfaces. Perfect for enthusiastic junior engineers passionate about modern web performance.",
      requirements: [
        "Experience building modern web apps with React, Next.js, and TypeScript",
        "Understanding of REST and GraphQL APIs, caching, and server-side rendering",
        "Excellent communication and collaboration skills"
      ],
      responsibilities: [
        "Ship high-impact UI components and edge-compatible backend routes",
        "Write comprehensive unit and integration tests",
        "Investigate and resolve developer issues reported on GitHub"
      ],
      benefits: [
        "Flexible remote-first culture",
        "401(k) matching and international health benefits",
        "$1,500 annual continuing education & book budget"
      ],
      tags: ["TypeScript", "Next.js", "React", "Frontend", "Remote"],
      contactEmail: "jobs@vercel.com",
      applyUrl: "https://vercel.com/careers",
      postedBy: "usr_recruiter_01",
      status: "Active",
      applicantsCount: 115,
      createdAt: "2026-10-08T10:00:00.000Z"
    },
    {
      id: "opp_008",
      title: "Product Marketing & Growth Intern",
      organization: "Notion",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&q=80",
      type: "Internship",
      category: "Business",
      workMode: "Hybrid",
      location: "New York, NY",
      experienceLevel: "Students & New Grads",
      salaryOrStipend: "$35 - $42 / hour",
      deadline: "2026-12-10",
      featured: false,
      description: "Help scale Notion's campus ambassador program and enterprise community workflows. You will design creative product campaigns, analyze user conversion funnels, and author engaging case studies.",
      requirements: [
        "Current student in Marketing, Business, Communications, or related discipline",
        "Exceptional copywriting skills and aesthetic storytelling ability",
        "Experience running social media channels or campus student clubs is an advantage"
      ],
      responsibilities: [
        "Draft product release launch collateral and customer story spotlights",
        "Analyze campaign engagement metrics using SQL and Amplitude",
        "Coordinate university community workshops and product demos"
      ],
      benefits: [
        "Daily catered gourmet lunches in our vibrant NYC office",
        "Direct 1-on-1 mentorship with Notion's VP of Product Marketing",
        "High rate of full-time conversion for graduating seniors"
      ],
      tags: ["Marketing", "Growth", "Product", "Community", "Notion"],
      contactEmail: "campus@notion.so",
      applyUrl: "https://notion.so/careers",
      postedBy: "usr_recruiter_01",
      status: "Active",
      applicantsCount: 52,
      createdAt: "2026-10-12T13:45:00.000Z"
    }
  ],

  applications: [
    {
      id: "app_001",
      opportunityId: "opp_001",
      applicantId: "usr_student_01",
      applicantName: "Alex Rivera",
      applicantEmail: "alex@example.com",
      applicantPhone: "+1 (555) 234-5678",
      resumeUrl: "https://alexrivera.dev/resume.pdf",
      portfolioUrl: "https://alexrivera.dev",
      coverNote: "I've been using Stripe APIs since building my first SaaS app three years ago. I'm deeply passionate about high-concurrency distributed systems and would love to contribute to the core infrastructure team.",
      answers: {
        "graduationYear": "2026",
        "preferredLanguage": "Go & TypeScript",
        "priorInternship": "Yes, Software Engineering Intern at TechCorp (Summer 2025)"
      },
      status: "Under Review",
      appliedAt: "2026-10-15T14:20:00.000Z",
      updatedAt: "2026-10-18T10:00:00.000Z"
    },
    {
      id: "app_002",
      opportunityId: "opp_002",
      applicantId: "usr_student_01",
      applicantName: "Alex Rivera",
      applicantEmail: "alex@example.com",
      applicantPhone: "+1 (555) 234-5678",
      resumeUrl: "https://alexrivera.dev/resume.pdf",
      portfolioUrl: "https://alexrivera.dev",
      coverNote: "Registered our team 'EcoSync' to build an autonomous geospatial sensor dashboard leveraging Gemini API and open satellite feeds.",
      answers: {
        "teamName": "EcoSync",
        "teamSize": "3 members"
      },
      status: "Accepted",
      appliedAt: "2026-10-16T18:00:00.000Z",
      updatedAt: "2026-10-20T11:30:00.000Z"
    }
  ],

  bookmarks: [
    {
      id: "bm_001",
      userId: "usr_student_01",
      opportunityId: "opp_003",
      createdAt: "2026-10-16T09:30:00.000Z"
    },
    {
      id: "bm_002",
      userId: "usr_student_01",
      opportunityId: "opp_004",
      createdAt: "2026-10-17T15:45:00.000Z"
    }
  ],

  notifications: [
    {
      id: "notif_001",
      userId: "usr_student_01",
      title: "Application Status Updated",
      message: "Your application for Global AI & Climate Innovation Hackathon 2026 has been marked as Accepted! Check your dashboard for next steps.",
      type: "status_change",
      read: false,
      createdAt: "2026-10-20T11:30:00.000Z"
    },
    {
      id: "notif_002",
      userId: "usr_student_01",
      title: "New Opportunity Match",
      message: "A new opportunity matching your skills (Go, Cloud): 'Software Engineering Intern - Core Infrastructure' at Stripe.",
      type: "recommendation",
      read: true,
      createdAt: "2026-10-10T12:00:00.000Z"
    }
  ]
};

module.exports = seedData;

/* ==========================================================
   PROJECTS — edit everything about your projects here.
   The scrolling project cards on the home page read this list.

   Fields:
     id          short unique id (used in the URL, e.g. index.html#insurasync)
     name        project name
     category    label shown on the card
     brief       ONE short line shown on the scrolling card
     description longer text shown when the card is opened
     tools       list of tools / tech used (leave [] to hide the section)
     demo        live demo / video link (null = button greyed out)
     website     project website (optional, leave out to hide)
     github      repo link (null = button greyed out)
     image       logo or screenshot path (null = show `icon` instead)
     cover       true = image fills the card, false = logo centred
     icon        Remix icon class, used when there is no image
     theme       card colour: "light" | "invert" | "accent"
   ========================================================== */

window.PROJECTS = [
    {
        id: "paydiagnose",
        name: "PayDiagnose",
        category: "AI Agent",
        brief: "AI agent that debugs failing payment webhooks in seconds.",
        description:
            "An AI agent that debugs your webhook errors in seconds. Feed it a failing payment webhook and it traces the issue and gives you the suggested fix, instead of you digging through logs.",
        tools: ["Next.js", "TypeScript", "OpenAI API", "React", "Tailwind CSS"],
        demo: "https://pay-diagnose.vercel.app/",
        github: "https://github.com/AJINGS12/PayDiagnose",
        image: "assets/paydiagnose_logo.png",
        cover: false,
        icon: "ri-bug-line",
        theme: "light"
    },
    {
        id: "faultline",
        name: "Faultline",
        category: "AI Agent · Data",
        brief: "AI-powered incident tracing through DataHub lineage.",
        description:
            "An AI agent that traces data incidents through DataHub lineage, alerts the real owners on Slack and Jira, and writes the incident back to the graph.",
        tools: ["Python", "Claude API (Anthropic)", "DataHub", "Slack SDK", "Jira", "Requests"],
        demo: "https://www.youtube.com/watch?v=TmJ-Ci3n3uU",
        github: "https://github.com/AJINGS12/faultline",
        image: "assets/faultline logo.png",
        cover: false,
        icon: "ri-git-branch-line",
        theme: "invert"
    },
    {
        id: "nitify",
        name: "Nitify",
        category: "Featured · RAG",
        brief: "AI-powered compliance platform for Thai immigration.",
        description:
            "An AI-powered compliance platform for Thai immigration. We built a RAG-powered AI assistant that answers your immigration questions accurately, backed by a high-quality retrieval pipeline over official immigration rules and documents.",
        tools: ["Python", "FastAPI", "LangChain", "OpenAI API", "Vector database", "Embeddings", "Next.js"],
        demo: "https://youtu.be/mSQYOKKmXO0?si=f77kGFqoKMFJedx",
        website: "#",    // TODO: paste the website link
        github: null,
        image: null,
        cover: true,
        icon: "ri-passport-line",
        theme: "accent"
    },
    {
        id: "insurasync",
        name: "InsurAsync",
        category: "Multi-agent AI",
        brief: "Three AI agents that negotiate an insurance claim for you.",
        description:
            "InsurAsync lets three AI agents (policyholder, insurer, and repair shop) negotiate an insurance claim directly using real WebMCP tools, instead of weeks of emails and phone calls. Every tool call checks against real data (coverage limits, document requirements, repair pricing), and the final settlement always needs a human's confirmation, not an agent's.",
        tools: ["Next.js", "React", "WebMCP", "Redis", "JavaScript", "CSS Modules"],
        demo: "https://www.youtube.com/watch?v=0cB3Nb6ohd0",
        github: "https://github.com/AJINGS12/InsurAsync",
        image: "assets/insurAsnyc logo.png",
        cover: false,
        icon: "ri-shield-check-line",
        theme: "light"
    },
    {
        id: "ai-safepark",
        name: "AI SafePark",
        category: "Computer Vision & IoT",
        brief: "Real-time illegal parking detection with physical alerts.",
        description:
            "A term project for an AI course. It uses Roboflow to detect illegal parking in real time, paired with Arduino hardware to trigger physical alerts.",
        tools: ["Python", "FastAPI", "Roboflow", "OpenCV", "Node.js", "Express", "MongoDB", "React", "Vite", "Arduino"],
        demo: null,
        github: "https://github.com/itsdadelous/AI-PARKING-CHECK",
        image: null,
        cover: true,
        icon: "ri-parking-box-line",
        theme: "invert"
    }
];

import copy

# Mock data mapping role names to 2026 industry standards
ROLE_MOCK_DATA = {
    "ml_ai": {
        "score": 76,
        "breakdown": {
            "formatting": 82,
            "keywords": 70,
            "impact": 76
        },
        "summary": "AI & ML Engineer with solid experience in Python, PyTorch, and NLP models. Shows competence in building traditional machine learning systems and simple RAG workflows, but lacks exposure to multi-agent frameworks, serverless GPU scaling, and modern evaluation pipelines critical for production AI systems in 2026.",
        "skills": [
            "Python", "PyTorch", "TensorFlow", "Hugging Face", "LangChain", "LlamaIndex",
            "Vector Databases (Pinecone, Milvus)", "SQL", "Docker", "Git", "FastAPI",
            "Supervised Learning", "Unsupervised Learning", "NLP"
        ],
        "missing_skills": [
            "Multi-Agent Orchestrations (CrewAI / AutoGen)",
            "Serverless GPU Scaling (RunPod / Modal)",
            "MLflow / Weights & Biases (Experiment Tracking)",
            "Triton Inference Server / vLLM",
            "LLM Evaluation (TruLens / Ragas)",
            "TypeScript (for AI Frontend integrations)",
            "GraphQL API Design"
        ],
        "improvements": [
            "Quantify your AI model improvements: add metrics showing precision/recall improvements or inference speedups (e.g., 'Reduced LLM time-to-first-token by 30% using vLLM and caching').",
            "Explicitly reference LLM safety, alignment, or evaluation tools (e.g., NeMo Guardrails, Ragas) as safety and evaluation are major focuses for 2026 enterprise projects.",
            "Indicate deployment methodologies used (such as Triton Inference Server, vLLM, RunPod, or Modal) to show you understand deployment scaling, not just sandbox development."
        ],
        "interview_questions": [
            "Explain how you would design and optimize a Retrieval-Augmented Generation (RAG) system to handle 10 million documents with sub-second response times and high accuracy.",
            "How do you handle LLM hallucinations and security vulnerabilities like prompt injection in a user-facing production application?",
            "What is your approach to fine-tuning a 7B or 13B parameter model on a custom dataset, and how do you decide between LoRA and full parameter fine-tuning?",
            "Describe how you would set up a continuous evaluation pipeline for an agentic AI system using frameworks like Ragas or TruLens.",
            "How do you manage prompt versioning, testing, and caching to keep LLM API latency and costs low?"
        ],
        "job_match": {
            "score": 68,
            "matched_keywords": ["Python", "PyTorch", "TensorFlow", "LangChain", "Docker", "FastAPI", "SQL"],
            "missing_keywords": ["CrewAI", "vLLM", "Triton", "RunPod", "Ragas", "TypeScript"],
            "role_suitability": "Your machine learning background aligns well with the core algorithms and frameworks. However, the job description heavily emphasizes production AI engineering — including model evaluation frameworks, agentic workflows, and GPU optimization — which are absent from your resume. To stand out in 2026, add projects demonstrating serverless GPU orchestration and agentic design patterns."
        }
    },
    "devops": {
        "score": 75,
        "breakdown": {
            "formatting": 80,
            "keywords": 72,
            "impact": 74
        },
        "summary": "DevOps & Cloud Engineer with strong hands-on experience in AWS, Kubernetes, Docker, and Terraform. Competent in basic CI/CD setups, but needs to incorporate modern platform engineering concepts, GitOps workflows (ArgoCD), and cloud-native FinOps policies that are standard requirements for senior roles in 2026.",
        "skills": [
            "AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions", "Linux / Bash",
            "Python", "Prometheus", "Grafana", "CI/CD Pipelines", "Ansible", "Helm"
        ],
        "missing_skills": [
            "GitOps (ArgoCD / Flux)",
            "Platform Engineering (Backstage)",
            "Service Meshes (Istio / Linkerd)",
            "Serverless Cloud Architectures",
            "FinOps & Cloud Cost Optimization",
            "Pulumi (IaC in programming languages)",
            "OpenTelemetry / Distributed Tracing"
        ],
        "improvements": [
            "Provide quantitative speed and deployment metrics in your experience section (e.g., 'Reduced CI/CD build times by 45% and increased deployment frequency to 15+ times daily').",
            "Highlight cost management achievements: FinOps is highly prioritized in 2026. Explicitly state how much monthly cloud spend you optimized (e.g., 'Optimized AWS resource allocation, saving 28% in annual cloud spend').",
            "List experience with GitOps engines (ArgoCD, Flux). Enterprise DevOps is moving away from direct imperative deployments in favor of declarative GitOps."
        ],
        "interview_questions": [
            "Walk me through how you would design a highly available, multi-region active-active Kubernetes cluster on AWS using EKS and GitOps principles.",
            "How do you approach securing a CI/CD pipeline from supply chain attacks (e.g., dependency poisoning, leaked secrets)?",
            "Explain the difference between Terraform and Pulumi. In what scenario would you choose Pulumi's programming-language approach over HCL?",
            "Describe a scenario where you had to debug a complex network routing or DNS resolution issue within a Kubernetes cluster. What steps did you take?",
            "How do you set up distributed tracing and OpenTelemetry across microservices, and how do you use those metrics to resolve bottlenecks?"
        ],
        "job_match": {
            "score": 70,
            "matched_keywords": ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions", "Helm"],
            "missing_keywords": ["ArgoCD", "Backstage", "Istio", "OpenTelemetry", "FinOps"],
            "role_suitability": "You have a solid foundation in cloud infrastructure and configuration management. However, the job description lists platform engineering and GitOps automation as essential expectations. Showcasing experience with ArgoCD and OpenTelemetry tools would significantly elevate your profile and match score."
        }
    },
    "data_engineer": {
        "score": 73,
        "breakdown": {
            "formatting": 78,
            "keywords": 68,
            "impact": 72
        },
        "summary": "Data Engineer skilled in designing ELT/ETL pipelines, data warehousing, and working with big data tools like Spark and Airflow. Possesses strong SQL capabilities, but lacks modern data lakehouse technologies (Iceberg, Delta Lake), dbt for modular modeling, and real-time streaming infrastructure standard in 2026 data pipelines.",
        "skills": [
            "Python", "SQL", "Apache Spark", "ETL / ELT Pipelines", "PostgreSQL",
            "Airflow", "Docker", "AWS (S3 / Redshift)", "Snowflake", "Git", "Data Modeling"
        ],
        "missing_skills": [
            "dbt (Data Build Tool)",
            "Apache Iceberg / Delta Lake (Lakehouse)",
            "Real-time Streaming (Apache Flink / Kafka Streams)",
            "Data Quality Frameworks (Great Expectations)",
            "Vector Databases (Milvus / pgvector)",
            "Data Governance & Lineage (Collibra / OpenLineage)",
            "DuckDB for serverless analytics"
        ],
        "improvements": [
            "Include metrics for data pipeline execution times: e.g., 'Redesigned Spark ETL job to reduce execution time by 60% and cloud compute cost by $5,000/month'.",
            "Specify the volume of data you've managed (e.g., 'Orchestrated ingestion and processing of 5TB+ daily transaction data into Snowflake').",
            "Emphasize data quality and testing. In 2026, data teams expect automated validation. Mention using dbt test or Great Expectations to monitor data reliability."
        ],
        "interview_questions": [
            "Explain the difference between Lambda and Kappa architectures. In what scenario would you choose Apache Flink over Apache Spark Streaming?",
            "How do you design a slowly changing dimension (SCD) Type 2 table in Snowflake, and how do you handle late-arriving dimensions?",
            "What is a Lakehouse architecture, and how do Apache Iceberg or Delta Lake solve transactional consistency issues on top of object storage?",
            "How would you design a data quality monitoring system that alerts the team of schema drift and anomalies before data reaches production dashboards?",
            "Explain how you would optimize a slow, expensive SQL query in Snowflake that is joining two large tables with billions of rows."
        ],
        "job_match": {
            "score": 67,
            "matched_keywords": ["Python", "SQL", "Apache Spark", "Airflow", "Snowflake", "AWS"],
            "missing_keywords": ["dbt", "Apache Iceberg", "Apache Flink", "Great Expectations", "OpenLineage"],
            "role_suitability": "Your capabilities in big data batch processing and cloud warehousing are robust. However, this role focuses heavily on lakehouse formats (Iceberg) and streaming pipelines (Flink/Kafka). Incorporating these tools into your project history will bridge the gap and demonstrate readiness for 2026 data standards."
        }
    },
    "mobile": {
        "score": 74,
        "breakdown": {
            "formatting": 80,
            "keywords": 70,
            "impact": 72
        },
        "summary": "Mobile Developer with strong experience building cross-platform apps using Flutter and React Native. Demonstrates solid UI layout skills, but needs deeper integration with native code (Swift/Kotlin), automated mobile CI/CD pipelines, and offline synchronization frameworks standard in 2026.",
        "skills": [
            "React Native", "Flutter", "JavaScript", "TypeScript", "Dart", "Git",
            "REST APIs", "Redux", "Android Studio", "Xcode", "UI/UX Design"
        ],
        "missing_skills": [
            "Swift & iOS Native Development",
            "Kotlin & Android Native Development",
            "Mobile CI/CD (Fastlane / Bitrise)",
            "App Store / Play Store Deployment Automation",
            "Offline-first Sync (WatermelonDB / Realm)",
            "Jetpack Compose / SwiftUI",
            "Mobile Security (SSL Pinning, Code Obfuscation)"
        ],
        "improvements": [
            "Quantify app store metrics and stability: e.g., 'Maintained a 4.8-star rating on the App Store across 100k+ downloads by reducing crash rates to <0.1% using Firebase Crashlytics'.",
            "Detail native bridge integrations: mention custom native wrappers or Swift/Kotlin logic written to handle custom device APIs.",
            "Add deployment automation and security credentials, such as setting up Fastlane or integrating SSL pinning and root/jailbreak detection."
        ],
        "interview_questions": [
            "How does the React Native architecture bridge (specifically the new architecture with JSI and TurboModules) differ from the old bridge architecture?",
            "Describe how you would design an offline-first mobile app that syncs conflict-free database updates with a remote PostgreSQL server once connectivity is restored.",
            "How do you optimize image rendering, caching, and memory usage in a mobile feed that scrolls infinitely with high-res media?",
            "What is your strategy for setting up automated mobile testing and deployment using Fastlane and GitHub Actions?",
            "How do Swift's async/await concurrency model and Kotlin's Coroutines differ when handling background tasks on mobile platforms?"
        ],
        "job_match": {
            "score": 68,
            "matched_keywords": ["React Native", "Flutter", "JavaScript", "TypeScript", "REST APIs"],
            "missing_keywords": ["Swift", "Kotlin", "Fastlane", "WatermelonDB", "SSL Pinning"],
            "role_suitability": "You have solid skills in cross-platform mobile frameworks. To better align with this role's native extension requirements, it is recommended to highlight projects where you built custom Swift or Kotlin code bridges and automated store releases."
        }
    },
    "frontend": {
        "score": 75,
        "breakdown": {
            "formatting": 82,
            "keywords": 68,
            "impact": 75
        },
        "summary": "Frontend Engineer with strong expertise in React, TypeScript, and modern styling libraries. Able to construct responsive, highly polished user interfaces, but needs to gain experience with server actions, modern server rendering paradigms (Next.js App Router), and automated web accessibility audits.",
        "skills": [
            "React", "TypeScript", "JavaScript", "HTML5", "CSS3", "SASS / SCSS",
            "Tailwind CSS", "Redux Toolkit", "Webpack / Vite", "Git", "REST APIs"
        ],
        "missing_skills": [
            "Next.js App Router & Server Actions",
            "Visual Regression Testing (Playwright / Chromatic)",
            "Web Accessibility (WCAG 2.2 / WAI-ARIA)",
            "Micro-frontends / Module Federation",
            "Tailwind CSS v4.0",
            "AI SDKs (Vercel AI SDK)",
            "State Machines (XState)"
        ],
        "improvements": [
            "Quantify performance optimizations using Core Web Vitals: e.g., 'Improved Lighthouse Performance score from 65 to 98 and reduced LCP by 1.8 seconds'.",
            "Explicitly list experience with WCAG 2.2 accessibility guidelines, which is highly required in 2026 for public and enterprise web platforms.",
            "Replace outdated tools (like Webpack or Jest) with modern, faster options (Vite, Bun, or Playwright) to align with current development stacks."
        ],
        "interview_questions": [
            "Explain how Next.js Server Actions work, how they handle security under the hood, and when you would use them instead of traditional API endpoints.",
            "How do you optimize a complex React application to prevent unnecessary re-renders and achieve a 100/100 Core Web Vitals score?",
            "What is your strategy for implementing WCAG 2.2 compliant keyboard navigation and screen-reader accessibility on a custom, interactive multi-select dropdown?",
            "Compare CSS-in-JS, Tailwind CSS, and CSS Modules. What are the performance and developer-experience tradeoffs of each in a large-scale project?",
            "How would you set up and configure a micro-frontend architecture using Webpack Module Federation or Vite's federation plugins?"
        ],
        "job_match": {
            "score": 66,
            "matched_keywords": ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "REST APIs"],
            "missing_keywords": ["Next.js", "Server Actions", "Playwright", "WCAG 2.2", "Vercel AI SDK"],
            "role_suitability": "Your frontend coding and styling skills are strong. However, the target job description demands knowledge of server-side React frameworks (Next.js) and testing tools like Playwright. Building a modern side project utilizing Next.js Server Actions and Playwright testing will make your application much more competitive."
        }
    },
    "backend": {
        "score": 74,
        "breakdown": {
            "formatting": 80,
            "keywords": 67,
            "impact": 75
        },
        "summary": "Backend Engineer with strong experience in Python, FastAPI, and relational database systems. Solid background designing RESTful web services, but missing hands-on work with event streaming brokers (Kafka), high-speed caching (Redis), and modern RPC interfaces standard in 2026 systems.",
        "skills": [
            "Python", "FastAPI", "Django", "PostgreSQL", "SQL", "REST APIs",
            "Git", "Docker", "Node.js", "Express", "MongoDB", "Unit Testing"
        ],
        "missing_skills": [
            "Event-Driven Architecture (Kafka / RabbitMQ)",
            "Redis (Caching & Rate Limiting)",
            "gRPC / Protocol Buffers",
            "WebSockets / Real-time Communication",
            "NoSQL Scaling (DynamoDB / Cassandra)",
            "Database Sharding & Replication",
            "Distributed Systems Patterns"
        ],
        "improvements": [
            "Add metrics for database performance: e.g., 'Optimized complex SQL queries and indexing, reducing average API response time from 1.2s to 150ms'.",
            "Include information on system capacity: describe the concurrent traffic load your backends successfully handled.",
            "Add event broker technologies (Kafka/RabbitMQ) to your resume. In 2026, real-time message routing is key to backend systems design."
        ],
        "interview_questions": [
            "How do you design a database schema and indexing strategy for a write-heavy application that processes 10,000 transactions per second?",
            "Describe how you would implement a distributed lock mechanism using Redis to prevent double-booking or race conditions in a ticket booking system.",
            "Compare gRPC and REST. Under what conditions would you choose gRPC for service-to-service communication?",
            "How do you handle message delivery guarantees (at-least-once, exactly-once) when working with Apache Kafka?",
            "Walk me through how you would scale a database horizontally using sharding, read-replicas, and connection pooling."
        ],
        "job_match": {
            "score": 69,
            "matched_keywords": ["Python", "FastAPI", "PostgreSQL", "REST APIs", "Docker", "Git"],
            "missing_keywords": ["Kafka", "Redis", "gRPC", "WebSockets", "DynamoDB"],
            "role_suitability": "Your core REST and relational database design skills are strong. Since this role focuses heavily on real-time event routing and distributed caching, you should emphasize any message queue projects or scale-out strategies you've implemented."
        }
    },
    "fullstack": {
        "score": 74,
        "breakdown": {
            "formatting": 80,
            "keywords": 65,
            "impact": 76
        },
        "summary": "Mid-level Full-Stack Engineer with solid experience in React, Python, and REST API development. Strong grasp of core web technologies but lacks exposure to modern cloud-native tools, AI/LLM integrations, and infrastructure-as-code practices that are now standard requirements in top-tier engineering roles in 2026.",
        "skills": [
            "Python", "React", "JavaScript", "TypeScript", "FastAPI", "Node.js",
            "PostgreSQL", "MongoDB", "REST APIs", "Git", "GitHub", "HTML5", "CSS3",
            "Tailwind CSS", "SQL", "Agile / Scrum"
        ],
        "missing_skills": [
            "Docker & Kubernetes",
            "AWS / GCP / Azure (Cloud Platforms)",
            "CI/CD Pipelines (GitHub Actions)",
            "Terraform / Infrastructure as Code",
            "Next.js / Server-Side Rendering",
            "LangChain / LLM API Integration",
            "Vector Databases (Pinecone, Milvus)",
            "GraphQL",
            "Redis / Caching Strategies",
            "Microservices Architecture",
            "System Design & Scalability",
            "gRPC / WebSockets"
        ],
        "improvements": [
            "Add quantifiable impact to every bullet point — e.g., 'Reduced API response time by 42% by implementing Redis caching', instead of 'Improved performance'. ATS and hiring managers rank measurable results very highly.",
            "Include cloud platform experience (AWS, GCP, or Azure) prominently. In 2026, nearly 90% of engineering job descriptions require at least one major cloud provider. Even listing AWS Free Tier projects helps.",
            "Add an 'AI & Emerging Tech' section to your resume. Employers are actively seeking engineers who have hands-on experience with LLM APIs (OpenAI, Gemini), LangChain, RAG pipelines, or vector databases — even side projects count.",
            "List CI/CD tools explicitly (e.g., GitHub Actions, CircleCI, Jenkins). Automated deployment pipelines are a baseline expectation at most companies in 2026.",
            "Restructure your resume with a strong Technical Skills section at the top, grouped by category: Languages, Frameworks, Cloud & DevOps, Databases, AI/ML Tools. This maximizes ATS keyword matching."
        ],
        "interview_questions": [
            "Walk me through how you would design a scalable, cloud-native REST API on AWS that handles 100,000 concurrent users. What services would you use and why?",
            "How would you integrate an LLM (like Gemini or GPT-4) into a production application? Describe your approach to prompt engineering, caching, and cost control.",
            "Explain the difference between horizontal and vertical scaling. When would you use Kubernetes over a simpler deployment strategy?",
            "Describe a CI/CD pipeline you've built or worked with. What stages did it include and how did you handle rollbacks on failed deployments?",
            "You notice a PostgreSQL query is taking 8 seconds on a table with 50 million rows. Walk me through your step-by-step debugging and optimization process."
        ],
        "job_match": {
            "score": 62,
            "matched_keywords": ["Python", "React", "TypeScript", "REST APIs", "PostgreSQL", "Git", "Agile"],
            "missing_keywords": ["Docker", "Kubernetes", "AWS", "CI/CD", "LangChain", "GraphQL", "Terraform", "Redis"],
            "role_suitability": "Your programming capabilities cover both frontend and backend basics well. However, this target role requires strong cloud, deployment pipeline, and caching experience. Containerizing your stack and detailing your deployment setups will significantly increase your suitability score."
        }
    }
}

def detect_role(text: str) -> str:
    if not text:
        return "fullstack"
    text_lower = text.lower()
    
    # ML/AI
    if any(kw in text_lower for kw in ["pytorch", "tensorflow", "keras", "huggingface", "hugging face", "llm", "langchain", "llamaindex", "transformers", "milvus", "pinecone", "chromadb", "machine learning", "deep learning", "artificial intelligence", "mlops"]):
        return "ml_ai"
        
    # DevOps/Cloud
    if any(kw in text_lower for kw in ["terraform", "kubernetes", "k8s", "docker", "dockerfile", "ansible", "jenkins", "argocd", "gitlab ci", "aws", "gcp", "azure", "devops", "platform engineering", "infrastructure as code", "pulumi", "cloud engineer", "sysadmin"]):
        return "devops"
        
    # Data Engineer
    if any(kw in text_lower for kw in ["spark", "airflow", "hadoop", "snowflake", "redshift", "dbt", "etl", "elt", "data pipeline", "data engineering", "lakehouse", "iceberg", "delta lake", "flink"]):
        return "data_engineer"
        
    # Mobile
    if any(kw in text_lower for kw in ["flutter", "react native", "swift", "kotlin", "objective-c", "android studio", "xcode", "mobile app", "ios developer", "android developer", "dart"]):
        return "mobile"
        
    # Frontend
    if any(kw in text_lower for kw in ["react", "vue", "angular", "next.js", "nextjs", "nuxt", "svelte", "typescript", "javascript", "tailwind", "sass", "css", "html", "web design", "ux", "ui/ux", "frontend developer", "frontend engineer"]):
        has_backend = any(kw in text_lower for kw in ["django", "flask", "fastapi", "springboot", "spring boot", "express.js", "node.js", "nodejs", "postgres", "mongodb", "mysql", "sql", "database", "backend developer", "backend engineer"])
        if has_backend:
            return "fullstack"
        return "frontend"
        
    # Backend
    if any(kw in text_lower for kw in ["django", "flask", "fastapi", "springboot", "spring boot", "express.js", "node.js", "nodejs", "postgres", "mongodb", "mysql", "sql", "database", "backend developer", "backend engineer", "microservices", "grpc", "kafka", "rabbitmq", "redis"]):
        return "backend"
        
    return "fullstack"

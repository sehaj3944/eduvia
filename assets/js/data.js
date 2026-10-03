/**
 * EDUVIA DATA MODULE (assets/js/data.js)
 * Manages in-memory university and programme datasets with optional JSON fetching.
 */

const EduviaData = {
  universities: [
    {
      id: "muj",
      name: "Manipal University Jaipur",
      shortName: "MUJ Online",
      logoText: "MUJ",
      logoUrl: "assets/images/universities/logos/muj.png",
      badge: "NAAC A+",
      approvals: ["UGC-DEB", "AICTE", "WES"],
      nirfRank: "Rank #64",
      programmesCount: 18,
      feeRange: "₹1.5L - ₹2.6L",
      minFee: 150000,
      maxFee: 260000,
      emiStarts: "₹4,166/mo",
      rating: 4.6,
      reviewsCount: 1840,
      examMode: "Online Proctored (Webcam + AI)",
      liveSessions: "Weekend Live Masterclasses",
      placementAvg: "₹7.5 LPA",
      placementHighest: "₹18.0 LPA",
      topRecruiters: ["Amazon", "Deloitte", "Accenture", "Infosys", "KPMG"],
      lmsFeatures: "Coursera Access, 24/7 Sandbox Labs, Mobile App",
      location: "Jaipur, Rajasthan",
      established: 2011,
      type: "Private Deemed",
      description: "Renowned legacy institution with top-tier corporate recruiter network and international WES credential recognition."
    },
    {
      id: "amity",
      name: "Amity University Online",
      shortName: "Amity Online",
      logoText: "AMITY",
      logoUrl: "assets/images/universities/logos/amity-online.png",
      badge: "NAAC A+",
      approvals: ["UGC-DEB", "WASC (USA)", "QAA (UK)"],
      nirfRank: "Rank #35",
      programmesCount: 32,
      feeRange: "₹1.6L - ₹3.1L",
      minFee: 160000,
      maxFee: 310000,
      emiStarts: "₹4,500/mo",
      rating: 4.5,
      reviewsCount: 2920,
      examMode: "100% Proctored Remote Exams",
      liveSessions: "Daily Doubt Clearing & Global Faculty",
      placementAvg: "₹8.2 LPA",
      placementHighest: "₹21.5 LPA",
      topRecruiters: ["Google", "TCS", "HCL Tech", "Ernst & Young", "Wipro"],
      lmsFeatures: "Amigo LMS, Metaverse Campus Tour, Global Masterclasses",
      location: "Noida, Uttar Pradesh",
      established: 2005,
      type: "Private University",
      description: "Pioneer in online education with US WASC accreditation and extensive global alumni network across 60+ countries."
    },
    {
      id: "cu",
      name: "Chandigarh University",
      shortName: "CU Online",
      logoText: "CU",
      logoUrl: "uni/chandigarh-online-university-logo.webp",
      badge: "NAAC A+",
      approvals: ["UGC-DEB", "AICTE", "NIRF #27"],
      nirfRank: "Rank #27",
      programmesCount: 14,
      feeRange: "₹1.1L - ₹1.8L",
      minFee: 110000,
      maxFee: 180000,
      emiStarts: "₹3,050/mo",
      rating: 4.4,
      reviewsCount: 1450,
      examMode: "Online Remote Proctored",
      liveSessions: "Bi-weekly Interactive Code Cohorts",
      placementAvg: "₹6.8 LPA",
      placementHighest: "₹16.2 LPA",
      topRecruiters: ["Cognizant", "Capgemini", "IBM", "Tech Mahindra"],
      lmsFeatures: "Blackboard Ultra LMS, Cloud Labs, Virtual Placement Cell",
      location: "Mohali, Punjab",
      established: 2012,
      type: "Private University",
      description: "Highest return-on-investment online degree option with affordable semester fees and robust placement drives."
    },
    {
      id: "jain",
      name: "Jain University (Online)",
      shortName: "Jain Online",
      logoText: "JAIN",
      logoUrl: "assets/images/universities/logos/jain-university.png",
      badge: "NAAC A++",
      approvals: ["UGC-DEB", "AICTE", "KSURF 5-Star"],
      nirfRank: "Rank #68",
      programmesCount: 24,
      feeRange: "₹1.3L - ₹2.4L",
      minFee: 130000,
      maxFee: 240000,
      emiStarts: "₹3,600/mo",
      rating: 4.5,
      reviewsCount: 1180,
      examMode: "Two-way Live Proctoring",
      liveSessions: "Weekend Mentorship & Case Clinics",
      placementAvg: "₹7.1 LPA",
      placementHighest: "₹19.0 LPA",
      topRecruiters: ["PwC", "Morgan Stanley", "Flipkart", "Dell"],
      lmsFeatures: "LEARN LMS, AI Doubt Solver, LinkedIn Learning bundle",
      location: "Bengaluru, Karnataka",
      established: 1990,
      type: "Deemed-to-be University",
      description: "Premier Bengaluru tech-hub institution offering specialized emerging tech and FinTech degrees with NAAC A++ rating."
    },
    {
      id: "nmims",
      name: "NMIMS Centre for Distance & Online Education",
      shortName: "NMIMS CDOE",
      logoText: "NMIMS",
      logoUrl: "assets/images/universities/logos/nmims-cdoe.png",
      badge: "NAAC A+",
      approvals: ["UGC-DEB", "Category-1 Autonomy"],
      nirfRank: "Rank #21",
      programmesCount: 16,
      feeRange: "₹1.8L - ₹3.5L",
      minFee: 180000,
      maxFee: 350000,
      emiStarts: "₹5,200/mo",
      rating: 4.7,
      reviewsCount: 3400,
      examMode: "Computer Based Online Exam",
      liveSessions: "Harvard Case Study Sessions",
      placementAvg: "₹9.5 LPA",
      placementHighest: "₹24.0 LPA",
      topRecruiters: ["Kotak Mahindra", "Goldman Sachs", "HDFC Bank", "Bain & Co"],
      lmsFeatures: "Student Portal 2.0, Digital Library, Alumni Job Portal",
      location: "Mumbai, Maharashtra",
      established: 1981,
      type: "Deemed University",
      description: "Gold standard in executive management education with prestigious corporate brand recognition and high-paying roles."
    },
    {
      id: "upes",
      name: "UPES ON (University of Tomorrow)",
      shortName: "UPES ON",
      logoText: "UPES",
      logoUrl: "assets/images/universities/logos/upes.png",
      badge: "NAAC A",
      approvals: ["UGC-DEB", "IACBE", "NIRF #52"],
      nirfRank: "Rank #52",
      programmesCount: 12,
      feeRange: "₹1.4L - ₹2.2L",
      minFee: 140000,
      maxFee: 220000,
      emiStarts: "₹3,880/mo",
      rating: 4.3,
      reviewsCount: 940,
      examMode: "AI Supervised Online Exam",
      liveSessions: "Industry Practitioner Workshops",
      placementAvg: "₹6.9 LPA",
      placementHighest: "₹15.5 LPA",
      topRecruiters: ["Adani", "Tata Power", "L&T Infotech", "Reliance"],
      lmsFeatures: "Coursera Enterprise, Virtual Simulators, Career Edge 360",
      location: "Dehradun, Uttarakhand",
      established: 2003,
      type: "Private University",
      description: "Specialized in energy, supply chain, digital business, and futuristic engineering management domains."
    },
    {
      id: "chitkara",
      name: "Chitkara University",
      shortName: "Chitkara",
      logoText: "CHITKARA",
      logoUrl: "uni/online-chitkara-university-logo.webp",
      badge: "NAAC A+",
      approvals: ["UGC", "AICTE", "COA", "PCI"],
      nirfRank: "Top 100",
      programmesCount: 22,
      feeRange: "₹4.2L - ₹10.0L",
      minFee: 420000,
      maxFee: 1000000,
      emiStarts: "₹11,666/mo",
      rating: 4.6,
      reviewsCount: 2150,
      examMode: "On-Campus Semester Examinations",
      liveSessions: "Full-Time Classroom & Industry Labs",
      placementAvg: "₹8.5 LPA",
      placementHighest: "₹40.0 LPA",
      topRecruiters: ["Microsoft", "Virtusa", "Amazon", "Infosys", "Adobe"],
      lmsFeatures: "Chitkara Portal, CEED Incubator, Global Partner Labs",
      location: "Rajpura / Baddi, Punjab & HP",
      established: 2002,
      type: "Private State University",
      description: "Top-tier multidisciplinary university acclaimed for engineering, business management and global dual-degree pathways."
    },
    {
      id: "shoolini",
      name: "Shoolini University",
      shortName: "Shoolini",
      logoText: "SHOOLINI",
      logoUrl: "uni/shoolini-university-online-logo.webp",
      badge: "NAAC A+",
      approvals: ["UGC", "AICTE", "PCI"],
      nirfRank: "Rank #70",
      programmesCount: 16,
      feeRange: "₹3.6L - ₹9.6L",
      minFee: 360000,
      maxFee: 960000,
      emiStarts: "₹10,000/mo",
      rating: 4.5,
      reviewsCount: 1280,
      examMode: "On-Campus Semester Examinations",
      liveSessions: "SPRINT Stanford-Pedagogy Bootcamps",
      placementAvg: "₹7.2 LPA",
      placementHighest: "₹18.5 LPA",
      topRecruiters: ["Abbott", "Nestle", "Cognizant", "Hindustan Unilever", "ICICI"],
      lmsFeatures: "Yogananda e-Library, Innovation Hub, Biotech Labs",
      location: "Solan, Himachal Pradesh",
      established: 2009,
      type: "Private Research University",
      description: "Research-driven Himalayan university renowned for patent output, biotechnology, management SPRINT bootcamps, and high student mentorship."
    },
    {
      id: "lpu",
      name: "Lovely Professional University",
      shortName: "LPU",
      logoText: "LPU",
      logoUrl: "uni/Lovely-Professional-University-Online-logo.webp",
      badge: "NAAC A++",
      approvals: ["UGC-DEB", "AICTE", "PCI", "COA"],
      nirfRank: "Rank #27",
      programmesCount: 45,
      feeRange: "₹1.1L - ₹11.2L",
      minFee: 110000,
      maxFee: 1120000,
      emiStarts: "₹3,166/mo",
      rating: 4.6,
      reviewsCount: 4200,
      examMode: "On-Campus & Online Proctored",
      liveSessions: "Global Masterclasses & Live Industry Cohorts",
      placementAvg: "₹8.0 LPA",
      placementHighest: "₹30.0 LPA",
      topRecruiters: ["Google", "Microsoft", "Capgemini", "Amazon", "Bosch"],
      lmsFeatures: "LPU e-Connect, Uni-Hospital, Smart 600-Acre Campus",
      location: "Phagwara, Punjab",
      established: 2005,
      type: "Private University",
      description: "India's premier NAAC A++ (Score 3.68) institution offering both sprawling on-campus degree programmes and UGC-DEB entitled online degrees."
    },
    {
      id: "dypatil",
      name: "Dr. D.Y. Patil Vidyapeeth (Centre for Online Learning)",
      shortName: "DY Patil Online",
      logoText: "DPU",
      logoUrl: "uni/dy-patil-vidyapeeth-university-online.webp",
      badge: "NAAC A++",
      approvals: ["UGC-DEB", "AICTE", "WES"],
      nirfRank: "Rank #46",
      programmesCount: 14,
      feeRange: "₹1.0L - ₹1.4L",
      minFee: 102000,
      maxFee: 140000,
      emiStarts: "₹2,833/mo",
      rating: 4.5,
      reviewsCount: 1650,
      examMode: "Online Remote AI-Proctored",
      liveSessions: "Healthcare & FinTech Executive Webinars",
      placementAvg: "₹7.0 LPA",
      placementHighest: "₹17.0 LPA",
      topRecruiters: ["Apollo Hospitals", "Cipla", "Fortis Healthcare", "TCS", "Infosys"],
      lmsFeatures: "DPU e-Learning Portal, Digital Healthcare Labs",
      location: "Pune, Maharashtra",
      established: 2003,
      type: "Deemed-to-be University",
      description: "NAAC A++ accredited healthcare and management leader offering UGC-DEB entitled online degrees in Hospital Administration, Finance and AI."
    },
    {
      id: "amrita",
      name: "Amrita AHEAD (Amrita Vishwa Vidyapeetham)",
      shortName: "Amrita Online",
      logoText: "AMRITA",
      logoUrl: "uni/amrita-online-ahead-logo.webp",
      badge: "NAAC A++",
      approvals: ["UGC-DEB", "AICTE", "NIRF #7"],
      nirfRank: "Rank #7",
      programmesCount: 18,
      feeRange: "₹1.2L - ₹2.5L",
      minFee: 120000,
      maxFee: 250000,
      emiStarts: "₹3,333/mo",
      rating: 4.8,
      reviewsCount: 2300,
      examMode: "Online Remote Proctored",
      liveSessions: "Live Interactive Faculty Cohorts",
      placementAvg: "₹8.8 LPA",
      placementHighest: "₹22.0 LPA",
      topRecruiters: ["Cisco", "Bosch", "TCS", "Accenture", "Microsoft"],
      lmsFeatures: "Amrita AHEAD Portal, Virtual Labs, Value-Based Education",
      location: "Coimbatore, Tamil Nadu",
      established: 2003,
      type: "Deemed-to-be University",
      description: "Rank #7 in NIRF overall universities with NAAC A++ accreditation, delivering values-based, high-rigour online engineering, computer applications and management degrees."
    },
    {
      id: "parul",
      name: "Parul University (Online & Campus)",
      shortName: "Parul University",
      logoText: "PARUL",
      logoUrl: "uni/parul-university-logo.webp",
      badge: "NAAC A++",
      approvals: ["UGC-DEB", "AICTE", "PCI", "BCI"],
      nirfRank: "Rank #47 (Innovation)",
      programmesCount: 28,
      feeRange: "₹90K - ₹3.2L",
      minFee: 90000,
      maxFee: 320000,
      emiStarts: "₹2,500/mo",
      rating: 4.4,
      reviewsCount: 1890,
      examMode: "On-Campus & Online Remote",
      liveSessions: "Practical Industry Sessions",
      placementAvg: "₹6.5 LPA",
      placementHighest: "₹18.0 LPA",
      topRecruiters: ["L&T", "Tata Motors", "Reliance", "Infosys", "Wipro"],
      lmsFeatures: "PU Online LMS, Global Career Cell",
      location: "Vadodara, Gujarat",
      established: 2009,
      type: "Private University",
      description: "NAAC A++ multidisciplinary university with over 700+ corporate recruitment drives annually across management, technology, and health sciences."
    }
  ],

  programmes: [
    {
      id: "prog-mba-muj",
      universityId: "muj",
      universityName: "Manipal University Jaipur",
      title: "Online Master of Business Administration (MBA)",
      discipline: "business",
      degreeLevel: "pg",
      specialisation: "FinTech, Analytics, Marketing & HR",
      duration: "2 Years (4 Semesters)",
      durationYears: 2,
      studyMode: "Online + Weekend Live",
      modeCategory: "online",
      location: "Jaipur, Rajasthan",
      state: "Rajasthan",
      eligibility: "50% in Bachelor's Degree (Any Stream)",
      totalFee: 160000,
      emiMonthly: 6666,
      accreditation: "UGC-DEB, NAAC A+, WES",
      accreditations: ["UGC-DEB", "NAAC A+", "WES"],
      avgSalary: "₹7.8 LPA",
      description: "Electives in FinTech, HR Leadership, Business Analytics, and Global Supply Chain with capstone case simulations.",
      syllabus: [
        { sem: "Sem 1", topics: ["Management Concepts", "Financial Accounting", "Managerial Economics", "Organizational Behavior"] },
        { sem: "Sem 2", topics: ["Marketing Management", "Financial Management", "Human Resource Mgmt", "Business Analytics Fundamentals"] },
        { sem: "Sem 3", topics: ["Elective Specialization I & II", "Strategic Management", "Supply Chain Architecture", "Entrepreneurship"] },
        { sem: "Sem 4", topics: ["Cross-Functional Capstone Project", "Business Law & Corporate Governance", "Comprehensive Viva"] }
      ],
      highlights: ["12 High-growth electives (FinTech, Analytics, Marketing)", "Free Coursera certification access", "Placement week with 200+ companies"]
    },
    {
      id: "prog-mca-cu",
      universityId: "cu",
      universityName: "Chandigarh University",
      title: "Online Master of Computer Applications (MCA)",
      discipline: "tech",
      degreeLevel: "pg",
      specialisation: "Cloud Computing, AI & Full Stack",
      duration: "2 Years (4 Semesters)",
      durationYears: 2,
      studyMode: "Online Code Sandbox + Proctored",
      modeCategory: "online",
      location: "Mohali, Punjab",
      state: "Punjab",
      eligibility: "BCA / B.Sc (Computer Science/IT/Maths) with 50%",
      totalFee: 120000,
      emiMonthly: 5000,
      accreditation: "UGC-DEB, AICTE, NAAC A+",
      accreditations: ["UGC-DEB", "AICTE", "NAAC A+"],
      avgSalary: "₹7.2 LPA",
      description: "Hands-on specialization in Full-Stack Web Development, Cloud Computing, and Artificial Intelligence with virtual labs.",
      syllabus: [
        { sem: "Sem 1", topics: ["Advanced Data Structures & Algorithms", "Python Programming", "Operating Systems Internals", "Mathematical Foundations"] },
        { sem: "Sem 2", topics: ["Database Management Systems (SQL/NoSQL)", "Web Technologies (React & Node)", "Software Engineering & Agile", "Computer Networks"] },
        { sem: "Sem 3", topics: ["Cloud Computing (AWS/GCP)", "Machine Learning & AI", "Cyber Security & Cryptography", "DevOps Pipelines"] },
        { sem: "Sem 4", topics: ["Industry Full-Stack Capstone Project", "Internship Report", "Technical Dissertation"] }
      ],
      highlights: ["Hands-on Cloud Labs & Git integration", "Mentorship from Microsoft & IBM engineers", "Live Hackathons every quarter"]
    },
    {
      id: "prog-ds-jain",
      universityId: "jain",
      universityName: "Jain University (Online)",
      title: "M.Sc in Data Science & Artificial Intelligence",
      discipline: "data",
      degreeLevel: "pg",
      specialisation: "Machine Learning, NLP & Analytics",
      duration: "2 Years (4 Semesters)",
      durationYears: 2,
      studyMode: "Interactive Cohorts + Cloud Labs",
      modeCategory: "online",
      location: "Bengaluru, Karnataka",
      state: "Karnataka",
      eligibility: "Graduation with Mathematics/Statistics/CS",
      totalFee: 210000,
      emiMonthly: 8750,
      accreditation: "UGC-DEB, NAAC A++",
      accreditations: ["UGC-DEB", "NAAC A++"],
      avgSalary: "₹9.2 LPA",
      description: "Rigorous syllabus spanning predictive statistics, deep learning pipelines, NLP, and distributed processing architectures.",
      syllabus: [
        { sem: "Sem 1", topics: ["Applied Statistics & Probability", "Python for Data Science", "Data Wrangling & Visualization", "Linear Algebra"] },
        { sem: "Sem 2", topics: ["Supervised & Unsupervised Machine Learning", "Big Data Engineering (Spark/Kafka)", "Deep Learning Fundamentals", "Time Series Analysis"] },
        { sem: "Sem 3", topics: ["Natural Language Processing (NLP)", "Computer Vision & Transformers", "MLOps & Cloud Deployment", "GenAI Architecture"] },
        { sem: "Sem 4", topics: ["End-to-End Enterprise ML Pipeline Project", "Research Paper Formulation", "Peer Code Reviews"] }
      ],
      highlights: ["Jupyter Notebook cloud environments provided", "Build 14+ portfolio GitHub projects", "Specialized GenAI & LLM curriculum modules"]
    },
    {
      id: "prog-bba-amity",
      universityId: "amity",
      universityName: "Amity University Online",
      title: "Online Bachelor of Business Administration (BBA)",
      discipline: "business",
      degreeLevel: "ug",
      specialisation: "Marketing, Finance & International Business",
      duration: "3 Years (6 Semesters)",
      durationYears: 3,
      studyMode: "Self-Paced + Live Doubt Clinics",
      modeCategory: "online",
      location: "Noida, Uttar Pradesh",
      state: "Uttar Pradesh",
      eligibility: "10+2 / Intermediate in Any Stream (Min 45%)",
      totalFee: 165000,
      emiMonthly: 4583,
      accreditation: "UGC-DEB, WASC (USA), NAAC A+",
      accreditations: ["UGC-DEB", "NAAC A+", "WASC (USA)"],
      avgSalary: "₹4.8 LPA",
      description: "Designed for foundational executive competencies, real-world case simulations, and foreign languages option.",
      syllabus: [
        { sem: "Sem 1-2", topics: ["Principles of Management", "Business Mathematics", "Business Economics", "Corporate Communication"] },
        { sem: "Sem 3-4", topics: ["Marketing Fundamentals", "Financial Accounting", "Organizational Dynamics", "Digital Business Strategy"] },
        { sem: "Sem 5-6", topics: ["International Business", "Strategic Decision Making", "Electives (Digital Marketing/HR/Finance)", "Graduation Project"] }
      ],
      highlights: ["Foreign language elective option (German/French/Spanish)", "Case studies from global business schools", "Resume building and mock interview prep"]
    },
    {
      id: "prog-bca-cu",
      universityId: "cu",
      universityName: "Chandigarh University",
      title: "Online Bachelor of Computer Applications (BCA)",
      discipline: "tech",
      degreeLevel: "ug",
      specialisation: "Software Development & Cloud Foundations",
      duration: "3 Years (6 Semesters)",
      durationYears: 3,
      studyMode: "Online + Virtual Labs",
      modeCategory: "online",
      location: "Mohali, Punjab",
      state: "Punjab",
      eligibility: "10+2 with Mathematics/CS or equivalent (Min 45%)",
      totalFee: 135000,
      emiMonthly: 3750,
      accreditation: "UGC-DEB, AICTE, NAAC A+",
      accreditations: ["UGC-DEB", "AICTE", "NAAC A+"],
      avgSalary: "₹4.5 LPA",
      description: "Foundational computer applications degree with full-stack programming, cloud basics, and database management.",
      syllabus: [
        { sem: "Sem 1-2", topics: ["Problem Solving with C", "Digital Logic", "Discrete Mathematics", "Data Structures"] },
        { sem: "Sem 3-4", topics: ["Object-Oriented Programming (Java)", "Database Systems", "Web Technologies (HTML/CSS/JS)", "Computer Architecture"] },
        { sem: "Sem 5-6", topics: ["Full Stack Development", "Cloud Essentials", "Software Testing", "Final Major Application Project"] }
      ],
      highlights: ["Ideal gateway for aspiring software developers", "Live coding challenges", "Recognized for MCA direct eligibility"]
    },
    {
      id: "prog-mcom-jain",
      universityId: "jain",
      universityName: "Jain University (Online)",
      title: "M.Com in FinTech, Accounting & International Finance",
      discipline: "commerce",
      degreeLevel: "pg",
      specialisation: "FinTech, ACCA Papers & Taxation",
      duration: "2 Years (4 Semesters)",
      durationYears: 2,
      studyMode: "Online + Case Studies",
      modeCategory: "online",
      location: "Bengaluru, Karnataka",
      state: "Karnataka",
      eligibility: "B.Com / BBA / Allied Degree with 50%",
      totalFee: 110000,
      emiMonthly: 4580,
      accreditation: "UGC-DEB, NAAC A++",
      accreditations: ["UGC-DEB", "NAAC A++"],
      avgSalary: "₹6.2 LPA",
      description: "Mapped to ACCA & CMA paper exemptions with advanced financial valuation and direct taxation modules.",
      syllabus: [
        { sem: "Sem 1", topics: ["Advanced Corporate Accounting", "Financial Markets & Instruments", "Managerial Economics", "Direct Tax Laws"] },
        { sem: "Sem 2", topics: ["FinTech Ecosystems & Blockchain", "Quantitative Finance", "International Financial Reporting Standards (IFRS)", "Audit & Assurance"] },
        { sem: "Sem 3", topics: ["Algorithmic Trading & Risk Modeling", "Indirect Taxation (GST)", "Strategic Financial Management", "Wealth Mgmt"] },
        { sem: "Sem 4", topics: ["Corporate Valuation Capstone", "Financial Analytics with Python", "Comprehensive Viva"] }
      ],
      highlights: ["Mapped to ACCA & CMA paper exemptions", "Bloomberg terminal case datasets", "High demand in banking and Big 4 audit"]
    },
    {
      id: "prog-mha-amity",
      universityId: "amity",
      universityName: "Amity University Online",
      title: "Master of Hospital Administration (MHA)",
      discipline: "healthcare",
      degreeLevel: "pg",
      specialisation: "Hospital Operations & Quality Auditing",
      duration: "2 Years (4 Semesters)",
      durationYears: 2,
      studyMode: "Online + Hospital Case Practicum",
      modeCategory: "online",
      location: "Noida, Uttar Pradesh",
      state: "Uttar Pradesh",
      eligibility: "Graduation in Life Sciences / MBBS / BDS / Nursing / Any Stream",
      totalFee: 190000,
      emiMonthly: 7916,
      accreditation: "UGC-DEB, NAAC A+",
      accreditations: ["UGC-DEB", "NAAC A+"],
      avgSalary: "₹7.5 LPA",
      description: "Comprehensive healthcare administration training covering NABH protocols, clinical data management, and hospital ops.",
      syllabus: [
        { sem: "Sem 1", topics: ["Healthcare Delivery Systems", "Hospital Planning & Architecture", "Medical Terminology & Clinical Records", "Public Health"] },
        { sem: "Sem 2", topics: ["Hospital Operational Management", "Healthcare Quality & NABH Standards", "Health Economics & Billing", "Human Resources in Healthcare"] },
        { sem: "Sem 3", topics: ["Health Informatics & Telemedicine", "Biomedical Waste & Hazard Protocols", "Legal Aspects in Healthcare", "Supply Chain in Hospitals"] },
        { sem: "Sem 4", topics: ["Hospital Simulation Capstone", "Clinical Risk Audit Project", "Hospital Administration Dissertation"] }
      ],
      highlights: ["Accredited for executive healthcare operations", "NABH auditor framework insights", "Alumni in Fortis, Apollo, and Max Healthcare"]
    },
    {
      id: "prog-mba-nmims",
      universityId: "nmims",
      universityName: "NMIMS CDOE",
      title: "Executive Online MBA (Working Professionals)",
      discipline: "business",
      degreeLevel: "exec",
      specialisation: "Strategic Leadership & Enterprise Growth",
      duration: "2 Years (4 Semesters)",
      durationYears: 2,
      studyMode: "Live Harvard Case Cohorts",
      modeCategory: "hybrid",
      location: "Mumbai, Maharashtra",
      state: "Maharashtra",
      eligibility: "Bachelor's Degree + Min 2 Years Corporate Work Experience",
      totalFee: 280000,
      emiMonthly: 11666,
      accreditation: "UGC-DEB, NAAC A+, Category-1",
      accreditations: ["UGC-DEB", "NAAC A+", "Category-1"],
      avgSalary: "₹12.5 LPA",
      description: "Executive leadership curriculum featuring Harvard Business School cases and live weekend CXO masterclasses.",
      syllabus: [
        { sem: "Sem 1", topics: ["Executive Leadership & Strategy", "Financial Modeling for Decision Makers", "Global Economic Environments", "Digital Transformation"] },
        { sem: "Sem 2", topics: ["Product Strategy & Growth", "Supply Chain Resilience", "Customer Analytics", "Corporate Governance"] },
        { sem: "Sem 3", topics: ["Mergers & Acquisitions", "Organizational Architecture", "Advanced Strategy Simulation", "Executive Elective I"] },
        { sem: "Sem 4", topics: ["Enterprise Innovation Capstone", "C-Suite Advisory Mentorship", "Defense Viva"] }
      ],
      highlights: ["Exclusive alumni network in top consulting and tech firms", "Weekend live Harvard cases with veteran CXOs", "1-on-1 executive career coaching"]
    },
    {
      id: "prog-bsc-it-amity",
      universityId: "amity",
      universityName: "Amity University Online",
      title: "Online Bachelor of Science in Information Technology (B.Sc IT)",
      discipline: "tech",
      degreeLevel: "ug",
      specialisation: "Software Engineering, Cloud & Web Systems",
      duration: "3 Years (6 Semesters)",
      durationYears: 3,
      studyMode: "100% Online + Virtual Labs",
      modeCategory: "online",
      location: "Noida, Uttar Pradesh",
      state: "Uttar Pradesh",
      eligibility: "10+2 / Intermediate in Science / Maths / IT Stream (Min 45%)",
      totalFee: 145000,
      emiMonthly: 4027,
      accreditation: "UGC-DEB, WASC (USA), NAAC A+",
      accreditations: ["UGC-DEB", "NAAC A+", "WASC (USA)"],
      avgSalary: "₹5.2 LPA",
      description: "Undergraduate curriculum covering object-oriented programming, data structures, cloud architectures, cybersecurity basics, and database systems.",
      syllabus: [
        { sem: "Sem 1-2", topics: ["Programming in C & C++", "Digital Computer Fundamentals", "Calculus & Discrete Mathematics", "Database Management Fundamentals"] },
        { sem: "Sem 3-4", topics: ["Data Structures & Algorithms", "Java Programming", "Web Development Technologies", "Operating Systems Internals"] },
        { sem: "Sem 5-6", topics: ["Cloud Computing & Virtualization", "Information Security & Cryptography", "Software Engineering Principles", "B.Sc Capstone Project"] }
      ],
      highlights: ["Hands-on virtual computing sandboxes", "Direct eligibility for MCA & M.Sc IT", "Global US WASC accreditation"]
    },
    {
      id: "prog-bsc-ds-lpu",
      universityId: "lpu",
      universityName: "Lovely Professional University",
      title: "Online Bachelor of Science in Data Science (B.Sc Data Science)",
      discipline: "data",
      degreeLevel: "ug",
      specialisation: "Python, Applied Statistics & Machine Learning",
      duration: "3 Years (6 Semesters)",
      durationYears: 3,
      studyMode: "Online Proctored + Interactive Sandbox",
      modeCategory: "online",
      location: "Phagwara, Punjab",
      state: "Punjab",
      eligibility: "10+2 with Mathematics / Statistics / CS (Min 50%)",
      totalFee: 138000,
      emiMonthly: 3833,
      accreditation: "UGC-DEB, NAAC A++",
      accreditations: ["UGC-DEB", "NAAC A++"],
      avgSalary: "₹5.6 LPA",
      description: "Foundational data science bachelor's degree featuring Python, SQL pipelines, linear algebra, and entry-level predictive modeling.",
      syllabus: [
        { sem: "Sem 1-2", topics: ["Introduction to Data Science with Python", "Descriptive & Inferential Statistics", "Linear Algebra for Computing", "Relational Database SQL"] },
        { sem: "Sem 3-4", topics: ["Data Wrangling & Exploratory Analysis", "Statistical Machine Learning", "Big Data Concepts", "Data Visualization (Tableau & PowerBI)"] },
        { sem: "Sem 5-6", topics: ["Applied Deep Learning Fundamentals", "Cloud Analytics Platforms", "Ethics in AI & Data Governance", "Industrial Data Capstone Project"] }
      ],
      highlights: ["Jupyter cloud lab sandbox provided", "Kaggle project portfolio building", "NAAC A++ accredited university"]
    }
  ],

  getUniversityById(id) {
    return this.universities.find(u => u.id === id) || null;
  },

  getProgrammeById(id) {
    return this.programmes.find(p => p.id === id) || null;
  },

  getProgrammesByUniversity(univId) {
    return this.programmes.filter(p => p.universityId === univId);
  },

  resources: [
    {
      id: "understanding-university-recognition",
      title: "Understanding University Recognition: UGC-DEB & Equivalence Standards",
      category: "accreditation",
      categoryLabel: "Accreditation",
      featured: true,
      description: "How statutory approvals, DEB entitlement, and Supreme Court equivalence judgements distinguish accredited degrees for public and private sector recognition.",
      image: "assets/images/resources/eduvia-resource-regulation-01.jpg",
      keywords: ["ugc", "deb", "recognition", "accreditation", "equivalence", "government jobs", "upsc", "validity"],
      source: "UGC Gazette Notification No. 1-4/2021 (DEB-I)",
      content: "The University Grants Commission (UGC) Open and Distance Learning Programmes and Online Programmes Regulations establish that undergraduate and postgraduate degrees conferred through approved online and distance learning modes by recognized Higher Educational Institutions (HEIs) are equivalent to corresponding degrees awarded through traditional on-campus regular modes for all higher education admissions and public sector appointments. Institutional recognition requires UGC 12(B) approval, valid NAAC accreditation (minimum 3.26+ score for online entitlement or Category-1 graded autonomy), and specific Centre for Distance and Online Education (CDOE) compliance.",
      actionText: "Explore Accredited Universities",
      actionUrl: "universities.html"
    },
    {
      id: "naac-nirf-rankings-explained",
      title: "NAAC Grades & NIRF Ranking Tiers Explained",
      category: "accreditation",
      categoryLabel: "Accreditation",
      description: "How institutional accreditation grades and national ranking frameworks reflect academic quality, digital faculty ratios, and research performance.",
      keywords: ["naac", "nirf", "ranking", "grade", "a++", "a+", "quality", "framework"],
      source: "National Assessment and Accreditation Council (NAAC) Manual",
      content: "National Assessment and Accreditation Council (NAAC) evaluates universities across 7 key criteria: Curricular Aspects, Teaching-Learning Evaluation, Research and Innovation, Infrastructure and Learning Resources, Student Support and Progression, Governance and Leadership, and Institutional Values. Grades range from A++ (CGPA 3.51–4.00) and A+ (3.26–3.50) down to B. The National Institutional Ranking Framework (NIRF) by the Ministry of Education ranks universities across parameters including Teaching, Learning & Resources (TLR), Research and Professional Practice (RP), Graduation Outcomes (GO), Outreach and Inclusivity (OI), and Peer Perception (PR).",
      actionText: "View Top NIRF Ranked Universities",
      actionUrl: "universities.html?sort=nirf"
    },
    {
      id: "how-admissions-work",
      title: "How Online & Distance University Admissions Work",
      category: "admissions",
      categoryLabel: "Admissions",
      description: "Step-by-step overview of application submission, digital document verification, Academic Bank of Credits (ABC ID), and provisional enrollment.",
      keywords: ["admissions", "application", "abc id", "process", "enrollment", "documents", "verification"],
      source: "National Academic Depository (NAD) Guidelines",
      content: "Online university admissions in India follow a standardized digital workflow: 1) Online Application Registration; 2) Creation and linking of Academic Bank of Credits (ABC ID / APAAR) linked to DigiLocker; 3) Scanned Document Submission (Class 10 mark sheet for DOB proof, Class 12 certificate, Graduation degree/transcripts for PG programmes, Government photo ID, and passport-size photograph); 4) Scrutiny by University Admissions Board; 5) Fee payment via digital gateway or semester EMI mandate; 6) Generation of Student Enrollment Number and Learning Management System (LMS) login credentials.",
      actionText: "Browse All Programmes",
      actionUrl: "programmes.html"
    },
    {
      id: "understanding-eligibility-criteria",
      title: "Understanding Programme Eligibility: Percentages, Streams & Pre-requisites",
      category: "eligibility",
      categoryLabel: "Eligibility",
      description: "How to interpret minimum percentage thresholds, stream transition rules, and specific math requirements for MCA and Data Science.",
      keywords: ["eligibility", "criteria", "percentage", "maths", "bca", "mca", "stream", "prerequisites"],
      source: "AICTE / UGC Minimum Standards of Instruction",
      content: "Eligibility benchmarks vary by degree type and level: Undergraduate programmes (BBA, BCA, B.Com) typically require 10+2 / Intermediate completion from a recognized board with minimum 45% to 50% aggregate marks. BCA programmes often require Mathematics/Computer Science at 10+2 or qualifying bridge courses. Postgraduate management degrees (MBA) generally accept graduation in any academic discipline with 50% marks (45% for reserved categories). Technical master's degrees (MCA, M.Sc Data Science) require BCA/B.Sc Computer Science/IT or a bachelor's degree with Mathematics/Statistics at graduation or 10+2 level.",
      actionText: "Check Programme Eligibility",
      actionUrl: "programmes.html"
    },
    {
      id: "comparing-programme-fees",
      title: "How to Compare Programme Tuition, Semester Fees & EMI Schemes",
      category: "fees",
      categoryLabel: "Fees & Financing",
      featured: true,
      description: "Evaluating total course tuition versus semester installments, no-cost EMI structures, loan financing tenures, and payment transparency.",
      image: "assets/images/resources/eduvia-resource-roi-01.jpg",
      keywords: ["fees", "tuition", "emi", "financing", "cost", "semester fee", "loan", "installments"],
      source: "Eduvia Financial Transparency Standard",
      content: "When evaluating programme costs, students should distinguish between: 1) Total Programme Tuition (all semesters combined); 2) Semester-wise Fee Payment Schedule; 3) 0% No-Cost EMI financing structures where the interest component is subvented by the university; and 4) Education loan terms with scheduled tenures. Always verify whether quoted fees include examination fees, LMS subscription charges, study material dispatch, and proctored examination platform costs.",
      actionText: "Open Comparison Matrix",
      actionUrl: "compare.html"
    },
    {
      id: "hidden-charges-checklist",
      title: "Fee Transparency Checklist: Questions to Ask Before Enrollment",
      category: "fees",
      categoryLabel: "Fees & Financing",
      description: "Key questions to verify regarding examination fees, re-registration costs, digital library charges, and convocation fees.",
      keywords: ["hidden fees", "checklist", "examination fee", "transparency", "costs", "convocation", "re-evaluation"],
      source: "Consumer Education Notice on Academic Fees",
      content: "A comprehensive financial evaluation checklist before choosing a university includes: 1) Is the examination fee included in semester tuition or billed separately per subject (typically ₹1,000–₹2,500 per semester)? 2) Are LMS platform access and Coursera/cloud lab subscriptions bundled without recurring annual charges? 3) What is the formal refund policy under UGC refund guidelines? 4) What are the fee schedules for repeat examinations or backlogs?",
      actionText: "Compare Fee Matrices",
      actionUrl: "compare.html"
    },
    {
      id: "online-vs-distance-vs-regular",
      title: "Online vs On-Campus vs Hybrid: Learning Environment Comparison",
      category: "modes",
      categoryLabel: "Study Modes",
      description: "A structured comparative analysis of daily schedule flexibility, live cohort interaction, campus access, and examination formats.",
      keywords: ["online", "on-campus", "hybrid", "distance", "study modes", "flexibility", "delivery", "lms"],
      source: "Eduvia Comparative Learning Research",
      content: "Online Learning provides 100% digital delivery via recorded video lectures, live weekend doubt-clearing clinics, digital sandbox labs, and remote proctored exams—ideal for working professionals seeking zero career interruption. Hybrid / Cohort Learning combines virtual lectures with periodic on-campus masterclasses and residential immersion weekends. Traditional On-Campus learning requires daily physical classroom attendance, fixed semester schedules, and physical exam centers.",
      actionText: "Explore Online Degrees",
      actionUrl: "programmes.html?mode=online"
    },
    {
      id: "proctored-exams-explained",
      title: "How Remote AI-Proctored & Webcam Semester Exams Work",
      category: "modes",
      categoryLabel: "Study Modes",
      description: "Hardware requirements, exam conduct regulations, two-way audio-video monitoring, and academic integrity protocols.",
      keywords: ["proctored", "remote exams", "webcam", "ai proctoring", "examinations", "hardware", "integrity"],
      source: "Digital Examination & Assessment Standards",
      content: "UGC-DEB compliant online degree examinations utilize automated and human-supervised remote proctoring: 1) Secure browser sandboxing to prevent unauthorized tabs or applications; 2) Continuous 360-degree webcam and microphone monitoring for background sound and room scanning; 3) Government photo ID verification before exam launch; 4) Timed question paper submission with instant digital acknowledgement.",
      actionText: "View Exam Formats",
      actionUrl: "programmes.html"
    },
    {
      id: "degree-vs-specialisation",
      title: "Degree vs Specialisation: How to Choose Your Major Track",
      category: "degrees",
      categoryLabel: "Degrees",
      description: "Understanding the distinction between core statutory degree titles (MBA, MCA, BBA) and elective specialisations (FinTech, Cloud, Marketing).",
      keywords: ["degree", "specialisation", "electives", "major", "curriculum", "mba", "mca", "bba"],
      source: "National Higher Education Qualification Framework (NHEQF)",
      content: "Under the National Higher Education Qualification Framework (NHEQF), the base degree (e.g. Master of Business Administration or Master of Computer Applications) denotes the statutory qualification recognized by universities and regulators. Specialisations (e.g. Business Analytics, FinTech, Cloud Computing, Healthcare Ops) represent focused elective clusters (usually 4 to 8 subjects in the 3rd and 4th semesters) plus a domain-specific capstone project.",
      actionText: "Discover Pathways",
      actionUrl: "discover.html"
    },
    {
      id: "undergraduate-pathways-guide",
      title: "Undergraduate Degree Guide: BBA vs BCA vs B.Com (Hons)",
      category: "degrees",
      categoryLabel: "Degrees",
      description: "Curriculum scope, mathematical prerequisites, and post-graduation pathways for 3-year bachelor's degree programmes.",
      keywords: ["ug", "undergraduate", "bba", "bca", "b.com", "bachelor", "degree guide"],
      source: "UGC Undergraduate Curriculum Framework",
      content: "Undergraduate degree options serve different foundational goals: 1) BBA (Bachelor of Business Administration) covers management fundamentals, marketing principles, financial accounting, and business communication—serving as a direct launchpad for general management and MBA studies. 2) BCA (Bachelor of Computer Applications) builds programming, database management, web development, and cloud computing skills—preparing students for software roles or direct MCA admission. 3) B.Com (Honours) emphasizes corporate accounting, taxation, auditing, and corporate law—aligning with chartered accounting (CA), ACCA, and M.Com tracks.",
      actionText: "Explore UG Degrees",
      actionUrl: "programmes.html?level=ug"
    },
    {
      id: "postgraduate-selection-guide",
      title: "Postgraduate Degree Guide: MBA vs MCA vs M.Sc Data Science vs M.Com",
      category: "programmes",
      categoryLabel: "Programmes",
      description: "Comparative curriculum analysis across management, software systems, predictive analytics, and corporate finance master's degrees.",
      keywords: ["pg", "postgraduate", "mba", "mca", "m.sc", "m.com", "mha", "master", "programme guide"],
      source: "Eduvia Academic Curriculum Clearinghouse",
      content: "Postgraduate programmes deliver specialized executive or technical depth: 1) Online MBA builds executive strategy, leadership, financial modeling, and cross-functional management competencies. 2) Online MCA delivers advanced full-stack development, cloud architecture, DevOps, and applied AI systems. 3) M.Sc in Data Science & AI focuses on advanced statistical inference, machine learning pipelines, NLP, and distributed data systems. 4) M.Com in FinTech addresses algorithmic trading, ACCA paper exemptions, and corporate taxation. 5) Master of Hospital Administration (MHA) develops healthcare operations, NABH auditing, and clinical management skills.",
      actionText: "Explore PG Degrees",
      actionUrl: "programmes.html?level=pg"
    },
    {
      id: "career-exploration-principles",
      title: "Connecting Academic Curricula to Broad Career Disciplines",
      category: "careers",
      categoryLabel: "Careers",
      description: "Mapping core academic competencies, analytical methodologies, and technical portfolios to industry roles without outcome promises.",
      keywords: ["career", "skills", "roles", "discipline", "direction", "competencies", "industry"],
      source: "National Occupational Standards Overview",
      content: "Academic degrees build specific clusters of transferable and technical competencies: Computing degrees (BCA, MCA) develop algorithms, system design, and software engineering capabilities mapped to developer, cloud architect, and systems analyst roles. Management degrees (BBA, MBA) develop organizational strategy, quantitative decision-making, and marketing leadership mapped to operations, product management, and consulting functions. Data science degrees build statistical programming and predictive modeling expertise.",
      actionText: "Explore Career Directions",
      actionUrl: "discover.html#career-directions-section"
    }
  ],

  credibility: {
    partners: [
      { id: "lpu", name: "Lovely Professional University", badge: "NAAC A++", logo: "LPU", logoUrl: "uni/Lovely-Professional-University-Online-logo.webp" },
      { id: "cu", name: "Chandigarh University", badge: "NAAC A+", logo: "CU", logoUrl: "uni/chandigarh-online-university-logo.webp" },
      { id: "chitkara", name: "Chitkara University", badge: "NAAC A+", logo: "CHITKARA", logoUrl: "uni/online-chitkara-university-logo.webp" },
      { id: "shoolini", name: "Shoolini University", badge: "NAAC A+", logo: "SHOOLINI", logoUrl: "uni/shoolini-university-online-logo.webp" },
      { id: "dypatil", name: "Dr. D.Y. Patil Vidyapeeth", badge: "NAAC A++", logo: "DPU", logoUrl: "uni/dy-patil-vidyapeeth-university-online.webp" },
      { id: "amrita", name: "Amrita Vishwa Vidyapeetham", badge: "NAAC A++", logo: "AMRITA", logoUrl: "uni/amrita-online-ahead-logo.webp" },
      { id: "parul", name: "Parul University", badge: "NAAC A++", logo: "PARUL", logoUrl: "uni/parul-university-logo.webp" },
      { id: "deakin", name: "Deakin Business School", badge: "AACSB", logo: "DEAKIN", logoUrl: "uni/deakin-business-school-logo-with-upgrad.webp" },
      { id: "muj", name: "Manipal University Jaipur", badge: "NAAC A+", logo: "MUJ", logoUrl: "assets/images/universities/logos/muj.png" },
      { id: "amity", name: "Amity University Online", badge: "NAAC A+", logo: "AMITY", logoUrl: "assets/images/universities/logos/amity-online.png" },
      { id: "jain", name: "Jain University", badge: "NAAC A++", logo: "JAIN", logoUrl: "assets/images/universities/logos/jain-university.png" },
      { id: "nmims", name: "NMIMS CDOE", badge: "NAAC A+", logo: "NMIMS", logoUrl: "assets/images/universities/logos/nmims-cdoe.png" }
    ],
    testimonials: [
      {
        id: "test-01",
        name: "Rohit Verma",
        role: "Product Marketing Lead",
        company: "Swiggy",
        programme: "Online MBA in Digital Marketing",
        university: "Manipal University Jaipur",
        batch: "Batch of 2024",
        outcome: "+52% Salary Jump & Shifted from Agency to Product Org",
        quote: "Eduvia's semester-by-semester fee transparency saved me from hidden exam surcharges. The UGC-DEB verification gave me the confidence to invest while working full-time.",
        rating: 5,
        photo: "assets/images/students/eduvia-persona-working-professional-01.jpg",
        verified: true
      },
      {
        id: "test-02",
        name: "Ananya Sen",
        role: "Senior Cloud Engineer",
        company: "Cognizant",
        programme: "Online MCA in Cloud Architecture",
        university: "Chandigarh University",
        batch: "Batch of 2024",
        outcome: "Promoted to Cloud Architect with ₹14.5 LPA Package",
        quote: "Being able to compare MCA elective specialisations side-by-side helped me pick the AWS-aligned syllabus without leaving my job in Bangalore.",
        rating: 5,
        photo: "assets/images/students/eduvia-persona-recent-graduate-01.jpg",
        verified: true
      },
      {
        id: "test-03",
        name: "Vikramaditya Rao",
        role: "Senior Data Analyst",
        company: "Deloitte USI",
        programme: "M.Sc Data Science & AI",
        university: "Jain University Online",
        batch: "Batch of 2023",
        outcome: "Transitioned from Core Mechanical to FinTech Data Analytics",
        quote: "The 0% EMI financing calculator accurately predicted my monthly payment down to the exact rupee. Zero spam calls from sales reps—just pure data.",
        rating: 5,
        photo: "assets/images/students/eduvia-persona-data-analyst-01.jpg",
        verified: true
      },
      {
        id: "test-04",
        name: "Pooja Hegde",
        role: "Financial Risk Consultant",
        company: "KPMG India",
        programme: "Online M.Com in International Finance",
        university: "Amity University Online",
        batch: "Batch of 2024",
        outcome: "ACCA Paper Exemptions & Global WES Credential Approved",
        quote: "Eduvia was the only platform that clearly stated the WES evaluation status for Canadian PR equivalence before I enrolled. Invaluable clearinghouse!",
        rating: 5,
        photo: "assets/images/hero/eduvia-hero-student-01.jpg",
        verified: true
      },
      {
        id: "test-05",
        name: "Siddharth Menon",
        role: "Senior FinTech Product Manager",
        company: "Razorpay",
        programme: "Online MBA in Financial Technology",
        university: "Dr. D.Y. Patil Vidyapeeth (DPU Online)",
        batch: "Batch of 2024",
        outcome: "Led Payment Gateway Migration with 65% Compensation Hike",
        quote: "Comparing NAAC A++ accreditation scores and curriculum structures in minutes saved me weeks of manual research. Zero misleading sales pitches.",
        rating: 5,
        photo: "assets/images/students/eduvia-persona-siddharth-menon.jpg",
        verified: true
      },
      {
        id: "test-06",
        name: "Meera Krishnan",
        role: "Lead UX Researcher & Designer",
        company: "Zomato",
        programme: "Online M.Des in Interaction Design",
        university: "Lovely Professional University (LPU Online)",
        batch: "Batch of 2023",
        outcome: "Promoted to Design Track Lead & Published 2 Design Patents",
        quote: "The UGC-DEB statutory validation and credit equivalence table gave me complete clarity to upskill alongside a demanding sprint schedule.",
        rating: 5,
        photo: "assets/images/students/eduvia-persona-meera-krishnan.jpg",
        verified: true
      }
    ]
  },

  scholarships: [
    {
      id: "cucet-merit-scholarship",
      universityId: "cu",
      name: "CUCET Phase-1 National Academic Scholarship",
      type: "Merit / Entrance Score Based",
      eligibility: "Scored 90%+ in CUCET Phase-1 entrance examination",
      benefit: "100% Tuition Fee Concession for the full semester",
      discountPercentage: "100%",
      fixedAmount: "Up to ₹1,30,000/sem",
      conditions: "Must maintain minimum 7.5 CGPA with zero backlogs in subsequent semesters"
    },
    {
      id: "lpunest-merit-scholarship",
      universityId: "lpu",
      name: "LPUNEST Top Bracket Merit Concession",
      type: "Merit / Entrance Exam",
      eligibility: "Ranked in top 10% bracket in LPUNEST entrance exam",
      benefit: "₹80,000 fee waiver per semester",
      discountPercentage: "40%",
      fixedAmount: "₹80,000 per semester",
      conditions: "Applicable across all 4 semesters subject to 8.0 CGPA maintenance"
    },
    {
      id: "amity-online-defense-scholarship",
      universityId: "amity",
      name: "Amity Online Armed Forces & Police Welfare Concession",
      type: "Defense / Paramilitary Category",
      eligibility: "Serving defense personnel, veterans, paramilitary officers and their immediate wards",
      benefit: "20% Tuition Fee Concession across all semesters",
      discountPercentage: "20%",
      fixedAmount: "₹39,800 total fee reduction",
      conditions: "Valid defense/service ID proof required during online verification"
    },
    {
      id: "muj-online-merit-scholarship",
      universityId: "muj",
      name: "Manipal Online Academic Excellence Scholarship",
      type: "Merit Based",
      eligibility: "Scored 80%+ aggregate marks in Bachelor's qualifying degree",
      benefit: "15% Fee Concession on total course fee",
      discountPercentage: "15%",
      fixedAmount: "₹26,250 total fee reduction",
      conditions: "Directly applied upon verification of graduation mark sheets"
    }
  ],

  getResourceById(id) {
    return this.resources.find(r => r.id === id) || null;
  },

  getResourcesByCategory(cat) {
    if (!cat || cat === "all") return this.resources;
    return this.resources.filter(r => r.category === cat);
  },

  getUniversityById(id) {
    if (!id) return null;
    return this.universities.find(u => u.id === id || u.id.toLowerCase() === id.toLowerCase()) || null;
  },

  getProgrammeById(id) {
    if (!id) return null;
    return this.programmes.find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase()) || null;
  },

  getProgrammesByCountry(countryCode) {
    if (!countryCode || countryCode === "ALL" || countryCode === "all") return this.programmes;
    const code = countryCode.toUpperCase();
    return this.programmes.filter(p => {
      if (p.country && p.country.toUpperCase() === code) return true;
      if (Array.isArray(p.countriesAvailable) && p.countriesAvailable.includes(code)) return true;
      return false;
    });
  },

  getUniversitiesByCountry(countryCode) {
    if (!countryCode || countryCode === "ALL" || countryCode === "all") return this.universities;
    const code = countryCode.toUpperCase();
    return this.universities.filter(u => {
      if (u.country && u.country.toUpperCase() === code) return true;
      if (Array.isArray(u.countriesAvailable) && u.countriesAvailable.includes(code)) return true;
      return false;
    });
  },

  // Auto-enrich all programmes & universities with originalFee, originalCurrency, country, countriesAvailable
  initI18nData() {
    const allCountryCodes = [
      "IN", "PK", "BD", "LK", "NP",
      "AE", "SA", "QA", "OM",
      "US", "CA", "GB", "DE", "FR", "NL", "IE", "CH",
      "AU", "NZ", "SG", "MY",
      "ZA", "NG", "KE"
    ];

    if (Array.isArray(this.universities)) {
      this.universities.forEach(u => {
        if (!u.country) u.country = "IN";
        if (!u.countryName) u.countryName = "India";
        if (!u.countriesAvailable) u.countriesAvailable = [...allCountryCodes];
        if (!u.originalCurrency) u.originalCurrency = "INR";
        if (!u.originalMinFee) u.originalMinFee = u.minFee;
        if (!u.originalMaxFee) u.originalMaxFee = u.maxFee;
      });
    }

    if (Array.isArray(this.programmes)) {
      this.programmes.forEach(p => {
        if (!p.country) p.country = "IN";
        if (!p.countryName) p.countryName = "India";
        if (!p.countriesAvailable) p.countriesAvailable = [...allCountryCodes];
        if (!p.originalFee) p.originalFee = p.totalFee;
        if (!p.originalCurrency) p.originalCurrency = "INR";
        if (!p.originalEmiMonthly) p.originalEmiMonthly = p.emiMonthly;
      });
    }
  }
};

// Execute data enrichment
try {
  EduviaData.initI18nData();
} catch (e) {
  console.warn("EduviaData i18n enrichment note:", e);
}

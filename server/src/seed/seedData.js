// Comprehensive Seed Data for Job & Internship Portal
// Contains:
// 1. Exactly 50 Curated Company Profiles (25 Global MNCs + 19 Indian Tech Giants + 6 Fast-Growing Startups)
// 2. 52 Distinct, realistic Job and Internship Opportunities (categorized, varied roles, stipends/salaries, skills)
// 3. 3 Demo Accounts (Student, Recruiter, Admin)

const demoUsers = [
  {
    name: 'Aarav Sharma (Demo Student)',
    email: 'student@demo.com',
    password: 'Student@123',
    role: 'student',
    profile: {
      headline: 'Aspiring Full-Stack MERN Developer | B.Tech CSE Final Year',
      bio: 'Enthusiastic computer science undergraduate passionate about building scalable web applications with React, Node.js, and modern cloud technologies. Seeking entry-level software engineering roles.',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      education: [
        {
          degree: 'B.Tech in Computer Science and Engineering',
          institution: 'Apex Institute of Technology',
          yearOfCompletion: '2026',
          score: '8.8 CGPA'
        }
      ],
      skills: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST APIs'],
      resumeUrl: 'https://example.com/resumes/aarav-sharma-mern-resume.pdf',
      githubUrl: 'https://github.com/example-student',
      linkedinUrl: 'https://linkedin.com/in/example-student'
    }
  },
  {
    name: 'Priya Verma (Demo Recruiter)',
    email: 'recruiter@demo.com',
    password: 'Recruiter@123',
    role: 'recruiter',
    profile: {
      headline: 'Lead Technical Talent Acquisition Partner',
      bio: 'Connecting exceptional fresher engineers and experienced developers with high-growth technology teams and innovative engineering challenges.',
      phone: '+91 98111 22334',
      location: 'Hyderabad, India'
    }
  },
  {
    name: 'Indra Singh Jeena (Portal Admin)',
    email: 'admin@demo.com',
    password: 'Admin@123',
    role: 'admin',
    profile: {
      headline: 'System Administrator & Portal Architect',
      bio: 'Platform administration and moderation for Job & Internship Portal Minor Project.',
      phone: '+91 99999 88888',
      location: 'Delhi NCR, India'
    }
  }
];

const companiesData = [
  // 1 to 25: Global MNCs
  {
    name: 'Microsoft',
    industry: 'Cloud Computing & Software',
    description: 'Global technology leader in cloud computing (Azure), enterprise software, operating systems, and AI innovation.',
    website: 'https://www.microsoft.com',
    headquarters: 'Redmond, WA / Hyderabad, India',
    employeeCount: '220,000+'
  },
  {
    name: 'Google',
    industry: 'Internet & Artificial Intelligence',
    description: 'Global technology innovator specializing in search, advertising, cloud solutions (GCP), consumer electronics, and deep AI.',
    website: 'https://about.google',
    headquarters: 'Mountain View, CA / Bangalore, India',
    employeeCount: '180,000+'
  },
  {
    name: 'Amazon',
    industry: 'E-Commerce & Cloud Computing',
    description: 'Pioneer in global e-commerce, cloud infrastructure (AWS), logistics technology, and digital streaming.',
    website: 'https://www.amazon.jobs',
    headquarters: 'Seattle, WA / Hyderabad, India',
    employeeCount: '1,500,000+'
  },
  {
    name: 'IBM',
    industry: 'Enterprise Software & Hybrid Cloud',
    description: 'Global hybrid cloud, quantum computing, and AI solutions provider driving business transformations worldwide.',
    website: 'https://www.ibm.com',
    headquarters: 'Armonk, NY / Bangalore, India',
    employeeCount: '280,000+'
  },
  {
    name: 'Oracle',
    industry: 'Database & Enterprise Cloud',
    description: 'World-renowned leader in database software, cloud infrastructure (OCI), enterprise ERP, and financial technologies.',
    website: 'https://www.oracle.com',
    headquarters: 'Austin, TX / Hyderabad, India',
    employeeCount: '160,000+'
  },
  {
    name: 'Accenture',
    industry: 'IT Services & Consulting',
    description: 'Global management consulting and professional services firm delivering digital, cloud, and cybersecurity transformation.',
    website: 'https://www.accenture.com',
    headquarters: 'Dublin, Ireland / Bangalore, India',
    employeeCount: '730,000+'
  },
  {
    name: 'Capgemini',
    industry: 'IT Services & Digital Engineering',
    description: 'Multinational information technology services, cloud engineering, and digital business consulting corporation.',
    website: 'https://www.capgemini.com',
    headquarters: 'Paris, France / Mumbai, India',
    employeeCount: '360,000+'
  },
  {
    name: 'Cognizant',
    industry: 'IT Services & Digital Transformation',
    description: 'Leading provider of information technology, consulting, and business process services for the digital era.',
    website: 'https://www.cognizant.com',
    headquarters: 'Teaneck, NJ / Chennai, India',
    employeeCount: '345,000+'
  },
  {
    name: 'Deloitte',
    industry: 'Management Consulting & Risk Advisory',
    description: 'Big Four professional services network offering audit, consulting, tax, risk advisory, and technology architecture.',
    website: 'https://www2.deloitte.com',
    headquarters: 'London, UK / Hyderabad, India',
    employeeCount: '450,000+'
  },
  {
    name: 'EY',
    industry: 'Consulting & Technology Advisory',
    description: 'Ernst & Young delivers assurance, consulting, strategy, and technology transformation across global markets.',
    website: 'https://www.ey.com',
    headquarters: 'London, UK / Bangalore, India',
    employeeCount: '390,000+'
  },
  {
    name: 'KPMG',
    industry: 'Financial Advisory & Technology Consulting',
    description: 'Global organization of independent professional services firms providing audit, tax, and cyber/digital advisory.',
    website: 'https://kpmg.com',
    headquarters: 'Amstelveen, Netherlands / Gurugram, India',
    employeeCount: '270,000+'
  },
  {
    name: 'PwC',
    industry: 'Professional Services & Digital Consulting',
    description: 'PricewaterhouseCoopers provides industry-focused assurance, tax, and digital advisory solutions.',
    website: 'https://www.pwc.com',
    headquarters: 'London, UK / Mumbai, India',
    employeeCount: '360,000+'
  },
  {
    name: 'SAP',
    industry: 'Enterprise Application Software',
    description: 'Global market leader in enterprise application software, supply chain solutions, and business AI.',
    website: 'https://www.sap.com',
    headquarters: 'Walldorf, Germany / Bangalore, India',
    employeeCount: '105,000+'
  },
  {
    name: 'Cisco',
    industry: 'Networking & Cybersecurity',
    description: 'Worldwide leader in networking hardware, telecommunications equipment, cloud security, and IoT software.',
    website: 'https://www.cisco.com',
    headquarters: 'San Jose, CA / Bangalore, India',
    employeeCount: '84,000+'
  },
  {
    name: 'Adobe',
    industry: 'Creative Software & Digital Experience',
    description: 'Changing the world through digital experiences, creative cloud suites, document services, and marketing platforms.',
    website: 'https://www.adobe.com',
    headquarters: 'San Jose, CA / Noida, India',
    employeeCount: '30,000+'
  },
  {
    name: 'Salesforce',
    industry: 'Enterprise CRM & Cloud Applications',
    description: 'World-leading customer relationship management (CRM) platform bringing companies and customers together.',
    website: 'https://www.salesforce.com',
    headquarters: 'San Francisco, CA / Hyderabad, India',
    employeeCount: '73,000+'
  },
  {
    name: 'Intel',
    industry: 'Semiconductors & Embedded Systems',
    description: 'Industry leader creating world-changing semiconductor technology that enables global computing progress.',
    website: 'https://www.intel.com',
    headquarters: 'Santa Clara, CA / Bangalore, India',
    employeeCount: '124,000+'
  },
  {
    name: 'NVIDIA',
    industry: 'Semiconductors & Accelerated AI',
    description: 'Pioneer of GPU-accelerated computing, graphics hardware, and full-stack generative AI computing platforms.',
    website: 'https://www.nvidia.com',
    headquarters: 'Santa Clara, CA / Pune, India',
    employeeCount: '29,000+'
  },
  {
    name: 'Qualcomm',
    industry: 'Wireless Technology & Semiconductors',
    description: 'World leader in wireless tech, 5G standard innovations, Snapdragon processors, and mobile chipsets.',
    website: 'https://www.qualcomm.com',
    headquarters: 'San Diego, CA / Hyderabad, India',
    employeeCount: '51,000+'
  },
  {
    name: 'Hewlett Packard Enterprise',
    industry: 'Enterprise IT & Edge-to-Cloud',
    description: 'Edge-to-cloud company helping organizations accelerate outcomes by unlocking value from all of their data.',
    website: 'https://www.hpe.com',
    headquarters: 'Houston, TX / Bangalore, India',
    employeeCount: '60,000+'
  },
  {
    name: 'Dell Technologies',
    industry: 'Hardware & Infrastructure Solutions',
    description: 'End-to-end technology solutions provider, from personal computing devices to advanced data center infrastructure.',
    website: 'https://www.dell.com',
    headquarters: 'Round Rock, TX / Bangalore, India',
    employeeCount: '120,000+'
  },
  {
    name: 'Siemens',
    industry: 'Industrial Automation & Smart Infrastructure',
    description: 'Technology company focused on industry automation, smart infrastructure, mobility, and medical technology.',
    website: 'https://www.siemens.com',
    headquarters: 'Munich, Germany / Mumbai, India',
    employeeCount: '320,000+'
  },
  {
    name: 'JPMorgan Chase',
    industry: 'Investment Banking & Financial Tech',
    description: 'Global financial services institution developing high-throughput trading systems, fintech platforms, and cyber defenses.',
    website: 'https://www.jpmorganchase.com',
    headquarters: 'New York, NY / Mumbai, India',
    employeeCount: '300,000+'
  },
  {
    name: 'Goldman Sachs',
    industry: 'Investment Banking & Quantitative Engineering',
    description: 'Leading global investment banking, securities, and investment management firm pioneering financial software engineering.',
    website: 'https://www.goldmansachs.com',
    headquarters: 'New York, NY / Bangalore, India',
    employeeCount: '45,000+'
  },
  {
    name: 'Morgan Stanley',
    industry: 'Financial Services & Wealth Management',
    description: 'Global investment bank and financial services company engineering distributed financial algorithms and data systems.',
    website: 'https://www.morganstanley.com',
    headquarters: 'New York, NY / Mumbai, India',
    employeeCount: '80,000+'
  },

  // 26 to 44: Indian IT & Technology Companies
  {
    name: 'Tata Consultancy Services (TCS)',
    industry: 'IT Services & Consulting',
    description: 'Largest Indian multinational IT services provider, delivering digital transformation solutions to global enterprises.',
    website: 'https://www.tcs.com',
    headquarters: 'Mumbai, India',
    employeeCount: '600,000+'
  },
  {
    name: 'Infosys',
    industry: 'IT Services & Digital Consulting',
    description: 'Global leader in next-generation digital services and consulting, enabling clients across 56 countries.',
    website: 'https://www.infosys.com',
    headquarters: 'Bangalore, India',
    employeeCount: '320,000+'
  },
  {
    name: 'Wipro',
    industry: 'IT Services & Business Solutions',
    description: 'Leading technology services and consulting company focused on building innovative solutions across cloud and AI.',
    website: 'https://www.wipro.com',
    headquarters: 'Bangalore, India',
    employeeCount: '235,000+'
  },
  {
    name: 'HCLTech',
    industry: 'Digital Engineering & IT Services',
    description: 'Global technology company supercharging enterprise progress through digital, engineering, cloud, and software.',
    website: 'https://www.hcltech.com',
    headquarters: 'Noida, India',
    employeeCount: '220,000+'
  },
  {
    name: 'Tech Mahindra',
    industry: 'Telecommunications & IT Services',
    description: 'Specialist in digital transformation, consulting, and business re-engineering solutions for the connected world.',
    website: 'https://www.techmahindra.com',
    headquarters: 'Pune, India',
    employeeCount: '145,000+'
  },
  {
    name: 'LTIMindtree',
    industry: 'Digital Transformation & Enterprise IT',
    description: 'Global technology consulting and digital solutions company that enables enterprises across diverse industries.',
    website: 'https://www.ltimindtree.com',
    headquarters: 'Mumbai, India',
    employeeCount: '82,000+'
  },
  {
    name: 'Persistent Systems',
    industry: 'Digital Engineering & Product Development',
    description: 'Digital engineering and enterprise modernization partner building software products and cloud platforms.',
    website: 'https://www.persistent.com',
    headquarters: 'Pune, India',
    employeeCount: '23,000+'
  },
  {
    name: 'Zoho',
    industry: 'Cloud SaaS & Business Applications',
    description: 'Indian SaaS pioneer developing comprehensive suite of business, productivity, and collaboration cloud software.',
    website: 'https://www.zoho.com',
    headquarters: 'Chennai, India',
    employeeCount: '15,000+'
  },
  {
    name: 'Freshworks',
    industry: 'Customer Engagement & IT Service SaaS',
    description: 'Developer of intuitive, cloud-based software for customer service, CRM, and IT service management.',
    website: 'https://www.freshworks.com',
    headquarters: 'San Mateo, CA / Chennai, India',
    employeeCount: '5,000+'
  },
  {
    name: 'Paytm',
    industry: 'FinTech & Digital Payments',
    description: 'India’s leading digital payments and financial services company empowering merchants and consumers.',
    website: 'https://paytm.com',
    headquarters: 'Noida, India',
    employeeCount: '10,000+'
  },
  {
    name: 'PhonePe',
    industry: 'Digital Payments & Financial Services',
    description: 'India’s leading payments app built on UPI, offering bill payments, investments, and insurance services.',
    website: 'https://www.phonepe.com',
    headquarters: 'Bangalore, India',
    employeeCount: '5,500+'
  },
  {
    name: 'Razorpay',
    industry: 'FinTech & Payment Gateway Solutions',
    description: 'Full-stack financial solutions company enabling online businesses to accept, process, and disburse payments.',
    website: 'https://razorpay.com',
    headquarters: 'Bangalore, India',
    employeeCount: '3,500+'
  },
  {
    name: 'Flipkart',
    industry: 'E-Commerce Marketplace',
    description: 'One of India’s leading digital commerce entities, revolutionizing retail with advanced supply chain tech.',
    website: 'https://www.flipkart.com',
    headquarters: 'Bangalore, India',
    employeeCount: '35,000+'
  },
  {
    name: 'Swiggy',
    industry: 'Food Delivery & Quick Commerce',
    description: 'India’s leading on-demand convenience platform connecting consumers with restaurants and grocery delivery.',
    website: 'https://www.swiggy.com',
    headquarters: 'Bangalore, India',
    employeeCount: '6,000+'
  },
  {
    name: 'Zomato',
    industry: 'Food Tech & Quick Commerce',
    description: 'Restaurant aggregator, food ordering, and quick-delivery platform transforming culinary experiences.',
    website: 'https://www.zomato.com',
    headquarters: 'Gurugram, India',
    employeeCount: '4,000+'
  },
  {
    name: 'MakeMyTrip',
    industry: 'Online Travel & Hospitality Tech',
    description: 'India’s leading online travel company offering flight bookings, hotel reservations, and holiday packages.',
    website: 'https://www.makemytrip.com',
    headquarters: 'Gurugram, India',
    employeeCount: '3,800+'
  },
  {
    name: 'CRED',
    industry: 'FinTech & Credit Card Rewards',
    description: 'Reward-centric financial platform for creditworthy individuals offering bill management and premium commerce.',
    website: 'https://cred.club',
    headquarters: 'Bangalore, India',
    employeeCount: '1,000+'
  },
  {
    name: 'Meesho',
    industry: 'Social E-Commerce Marketplace',
    description: 'Democratizing internet commerce in India for small businesses, micro-entrepreneurs, and value shoppers.',
    website: 'https://www.meesho.com',
    headquarters: 'Bangalore, India',
    employeeCount: '2,000+'
  },
  {
    name: 'Groww',
    industry: 'Investment Tech & Wealth Management',
    description: 'Leading financial technology platform making investing in stocks, mutual funds, and IPOs simple and accessible.',
    website: 'https://groww.in',
    headquarters: 'Bangalore, India',
    employeeCount: '2,500+'
  },

  // 45 to 50: Additional High-Growth Tech Companies & Startups
  {
    name: 'Atlassian',
    industry: 'Developer Tools & Collaboration Software',
    description: 'Creators of Jira, Confluence, Trello, and Bitbucket, powering modern software development teams globally.',
    website: 'https://www.atlassian.com',
    headquarters: 'Sydney, Australia / Bangalore, India',
    employeeCount: '11,000+'
  },
  {
    name: 'Uber India',
    industry: 'Mobility & Distributed Systems',
    description: 'Engineering high-concurrency microservices, geospatial mapping, and automated dispatch engines.',
    website: 'https://www.uber.com',
    headquarters: 'San Francisco, CA / Hyderabad, India',
    employeeCount: '30,000+'
  },
  {
    name: 'Zerodha',
    industry: 'FinTech & Discount Broking',
    description: 'India’s largest retail stockbroker known for innovative open-source technology and lightweight trading apps.',
    website: 'https://zerodha.com',
    headquarters: 'Bangalore, India',
    employeeCount: '1,200+'
  },
  {
    name: 'Postman',
    industry: 'API Platform & Developer Productivity',
    description: 'Leading collaborative platform for API design, automated testing, documentation, and mock servers.',
    website: 'https://www.postman.com',
    headquarters: 'San Francisco, CA / Bangalore, India',
    employeeCount: '1,500+'
  },
  {
    name: 'BrowserStack',
    industry: 'Cloud Software Testing Platform',
    description: 'World’s most trusted software testing cloud, enabling developers to test websites and apps across 3,000+ devices.',
    website: 'https://www.browserstack.com',
    headquarters: 'Dublin, Ireland / Mumbai, India',
    employeeCount: '1,000+'
  },
  {
    name: 'Hasura',
    industry: 'GraphQL Engines & Instant Data APIs',
    description: 'Instant GraphQL and REST APIs on relational databases with integrated authorization and caching.',
    website: 'https://hasura.io',
    headquarters: 'San Francisco, CA / Bangalore, India',
    employeeCount: '400+'
  }
];

// Helper to generate 52 distinct job/internship listings
const generateOpportunities = (companies) => {
  const companyMap = {};
  companies.forEach(c => {
    companyMap[c.name] = c._id;
  });

  const getCompanyId = (name) => companyMap[name] || companies[0]._id;

  const rawOpportunities = [
    // 1. MERN Stack Developer
    {
      title: 'MERN Stack Developer',
      companyName: 'Flipkart',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Join the consumer experience team to engineer high-throughput web frontends and microservices utilizing MongoDB, Express.js, React.js, and Node.js. You will work on real-time catalogue indexing and checkout flows.',
      responsibilities: [
        'Develop responsive web pages using React.js and modern state management',
        'Build scalable RESTful API services using Node.js and Express',
        'Optimize MongoDB queries and indexing strategies for peak sales volume',
        'Write clean, modular code with comprehensive unit test coverage'
      ],
      requirements: [
        'B.Tech / B.E. in Computer Science or related engineering stream',
        'Proficiency in JavaScript (ES6+), React, Node.js, and MongoDB',
        'Familiarity with Git and Agile development methodologies'
      ],
      requiredSkills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JavaScript', 'REST APIs'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 8,
      salaryMax: 14,
      openings: 5,
      daysDeadline: 45
    },
    // 2. Full-Stack Developer
    {
      title: 'Full-Stack Developer (React & Node)',
      companyName: 'Freshworks',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Remote',
      location: 'Chennai, India',
      category: 'Full-Stack Development',
      description: 'Looking for enthusiastic developers to build enterprise SaaS widgets and automation dashboards. You will bridge frontend customer experiences with resilient backend services.',
      responsibilities: [
        'Design and implement end-to-end features for customer engagement modules',
        'Collaborate with product designers to implement pixel-perfect user interfaces',
        'Implement authentication, role-based controls, and third-party integrations'
      ],
      requirements: [
        'Solid fundamentals in Data Structures, Algorithms, and Object-Oriented Design',
        'Hands-on project experience with modern frontend frameworks and Node.js'
      ],
      requiredSkills: ['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
      experienceLevel: '0-1 Years',
      isFresherEligible: true,
      salaryMin: 9,
      salaryMax: 15,
      openings: 3,
      daysDeadline: 30
    },
    // 3. Frontend Developer
    {
      title: 'Frontend Developer',
      companyName: 'Swiggy',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Bangalore, India',
      category: 'Frontend Development',
      description: 'Build lightning-fast, accessible web interfaces for millions of hungry consumers. Focus on core web vitals, progressive web apps, and animation micro-interactions.',
      responsibilities: [
        'Translate Figma wireframes into performant React components',
        'Minimize bundle sizes and improve page load metrics',
        'Collaborate with backend engineers to integrate RESTful endpoints'
      ],
      requirements: [
        'Deep understanding of HTML5, CSS3, modern JavaScript, and React',
        'Knowledge of state management libraries (Redux Toolkit or Zustand)'
      ],
      requiredSkills: ['React.js', 'Redux', 'HTML5', 'CSS3', 'JavaScript', 'Webpack'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 7,
      salaryMax: 12,
      openings: 4,
      daysDeadline: 25
    },
    // 4. Backend Developer
    {
      title: 'Backend Developer (Node.js & Microservices)',
      companyName: 'Razorpay',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Backend Development',
      description: 'Work on distributed payment processing pipelines requiring 99.99% uptime. You will build idempotent API endpoints, handle webhooks, and ensure robust security compliance.',
      responsibilities: [
        'Architect idempotent payment processing endpoints',
        'Implement asynchronous event queues with Redis and RabbitMQ',
        'Ensure bank-grade API security and transaction logging'
      ],
      requirements: [
        'Knowledge of Node.js event loops, asynchronous programming, and REST principles',
        'Familiarity with relational and document databases'
      ],
      requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 10,
      salaryMax: 16,
      openings: 2,
      daysDeadline: 40
    },
    // 5. Software Development Engineer (SDE-1)
    {
      title: 'Software Development Engineer - 1',
      companyName: 'Amazon',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Hyderabad, India',
      category: 'Software Engineering',
      description: 'Join Amazon’s logistics tech ecosystem. Design and develop software systems that plan, route, and deliver packages across the globe with precision.',
      responsibilities: [
        'Deliver reliable software systems adhering to Amazon coding standards',
        'Participate in design reviews and operational metrics reviews',
        'Troubleshoot complex issues in distributed AWS environments'
      ],
      requirements: [
        'B.Tech / M.Tech in CS/IT or relevant technical discipline',
        'Strong problem solving and algorithmic reasoning in Java or C++'
      ],
      requiredSkills: ['Java', 'Data Structures', 'Algorithms', 'AWS', 'System Design'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 14,
      salaryMax: 22,
      openings: 10,
      daysDeadline: 60
    },
    // 6. Java Developer
    {
      title: 'Java Enterprise Developer',
      companyName: 'Tata Consultancy Services (TCS)',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Pune, India',
      category: 'Software Engineering',
      description: 'Develop enterprise-grade banking and insurance applications using Spring Boot microservices, Hibernate, and Oracle SQL databases.',
      responsibilities: [
        'Implement business logic and backend services using Spring Boot',
        'Develop automated unit tests using JUnit and Mockito',
        'Deploy microservices into containerized cloud environments'
      ],
      requirements: [
        'Degree in Engineering / MCA with minimum 60% aggregate',
        'Core Java proficiency and understanding of MVC architecture'
      ],
      requiredSkills: ['Java', 'Spring Boot', 'Hibernate', 'SQL', 'Git', 'Maven'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.5,
      salaryMax: 7.5,
      openings: 15,
      daysDeadline: 50
    },
    // 7. Python Developer
    {
      title: 'Python Backend Engineer',
      companyName: 'PhonePe',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Bangalore, India',
      category: 'Backend Development',
      description: 'Design analytics pipelines and backend microservices using FastAPI, Django, and PostgreSQL for real-time transaction reconciliation.',
      responsibilities: [
        'Create high-performance API endpoints for merchant analytics',
        'Implement database models and perform database query tuning',
        'Collaborate with data science engineers to deploy ML inference models'
      ],
      requirements: [
        'Proficiency in Python and at least one web framework (FastAPI or Django)',
        'Understanding of asynchronous programming and database indexing'
      ],
      requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Linux'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 9,
      salaryMax: 15,
      openings: 3,
      daysDeadline: 35
    },
    // 8. QA / Software Testing Intern
    {
      title: 'QA / Software Testing Intern',
      companyName: 'BrowserStack',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Remote',
      location: 'Mumbai, India',
      category: 'QA & Testing',
      description: 'Learn modern software quality assurance techniques including automated testing with Playwright, Selenium, and API testing with Postman.',
      responsibilities: [
        'Author clear test cases from functional product requirements',
        'Execute automated test suites and report reproducible bugs',
        'Perform regression and cross-browser testing across real mobile devices'
      ],
      requirements: [
        'Knowledge of software testing life cycle (STLC) and test case authoring',
        'Basic programming knowledge in JavaScript or Python'
      ],
      requiredSkills: ['Selenium', 'JavaScript', 'Postman', 'Manual Testing', 'Jira'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 25000,
      openings: 4,
      daysDeadline: 20
    },
    // 9. Data Analyst Intern
    {
      title: 'Data Analyst Intern',
      companyName: 'Zomato',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Gurugram, India',
      category: 'Data & AI',
      description: 'Extract business insights from consumer ordering patterns, delivery times, and seasonal trends using SQL, Python, and Tableau dashboards.',
      responsibilities: [
        'Write complex SQL queries to extract data from warehouse tables',
        'Build interactive visualizations and dashboards for operations teams',
        'Perform statistical analysis to evaluate marketing campaign performance'
      ],
      requirements: [
        'Strong command of SQL (Joins, Aggregations, Window Functions)',
        'Familiarity with Excel, Python (Pandas), and data visualization tools'
      ],
      requiredSkills: ['SQL', 'Python', 'Pandas', 'Tableau', 'Excel'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 30000,
      openings: 3,
      daysDeadline: 28
    },
    // 10. Cloud / DevOps Intern
    {
      title: 'Cloud / DevOps Engineering Intern',
      companyName: 'Microsoft',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Hyderabad, India',
      category: 'Cloud & DevOps',
      description: 'Gain practical experience with Azure cloud services, CI/CD automated deployment pipelines, Docker containerization, and infrastructure monitoring.',
      responsibilities: [
        'Assist in building and automating GitHub Actions deployment workflows',
        'Containerize internal development services using Docker',
        'Monitor server telemetry and configure alerts'
      ],
      requirements: [
        'Understanding of Linux command-line, networking basics, and Git',
        'Foundational knowledge of Cloud computing concepts'
      ],
      requiredSkills: ['Linux', 'Docker', 'Azure', 'Git', 'Bash Scripting', 'CI/CD'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 50000,
      openings: 2,
      daysDeadline: 45
    },
    // 11. Cybersecurity Intern
    {
      title: 'Cybersecurity Analyst Intern',
      companyName: 'Deloitte',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Onsite',
      location: 'Hyderabad, India',
      category: 'Cybersecurity',
      description: 'Support enterprise vulnerability assessments, security policy reviews, and penetration testing simulations under senior security consultants.',
      responsibilities: [
        'Assist with OWASP Top 10 vulnerability checks on web applications',
        'Analyze log telemetry for potential security anomalies',
        'Document security evaluation reports and remediation steps'
      ],
      requirements: [
        'Knowledge of networking protocols (TCP/IP, DNS, HTTP/S)',
        'Familiarity with OWASP guidelines and basic security scanning tools'
      ],
      requiredSkills: ['Network Security', 'OWASP', 'Burp Suite', 'Linux', 'Vulnerability Assessment'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 35000,
      openings: 3,
      daysDeadline: 30
    },
    // 12. UI/UX Design Intern
    {
      title: 'UI/UX Design Intern',
      companyName: 'CRED',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Onsite',
      location: 'Bangalore, India',
      category: 'UI/UX Design',
      description: 'Design intuitive, dark-mode user flows and high-fidelity interaction prototypes for member-first mobile and web applications.',
      responsibilities: [
        'Create wireframes, user personas, and customer journey maps',
        'Craft high-fidelity Figma prototypes and micro-animations',
        'Participate in user research and usability testing sessions'
      ],
      requirements: [
        'Strong design portfolio demonstrating typography, layout, and visual hierarchy',
        'Proficiency in Figma and interactive prototyping'
      ],
      requiredSkills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping', 'User Research'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 40000,
      openings: 2,
      daysDeadline: 18
    },
    // 13. Technical Support Associate
    {
      title: 'Technical Support Associate',
      companyName: 'Dell Technologies',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Technical Support',
      description: 'Provide level-1 and level-2 technical diagnosis for enterprise clients running server hardware and storage area networks.',
      responsibilities: [
        'Troubleshoot hardware, firmware, and operating system incidents',
        'Coordinate escalation tickets to senior systems engineering teams',
        'Maintain detailed documentation in enterprise CRM systems'
      ],
      requirements: [
        'Graduate in any discipline with strong technical aptitude',
        'Excellent written and verbal English communication'
      ],
      requiredSkills: ['Hardware Troubleshooting', 'Networking', 'Customer Support', 'Windows Server', 'Linux'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4,
      salaryMax: 6.5,
      openings: 8,
      daysDeadline: 35
    },
    // 14. Graduate Engineer Trainee (GET)
    {
      title: 'Graduate Engineer Trainee (GET - 2026 Batch)',
      companyName: 'LTIMindtree',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Mumbai, India',
      category: 'Software Engineering',
      description: 'Comprehensive entry-level engineering development program covering full-stack web development, enterprise cloud architectures, and client projects.',
      responsibilities: [
        'Undergo structured training across modern development toolchains',
        'Complete shadow projects under guided mentorship',
        'Transition into billable global client engineering engagements'
      ],
      requirements: [
        'B.E. / B.Tech graduated or graduating in 2026 with no active backlogs',
        'Basic programming knowledge in Java, C#, or Python'
      ],
      requiredSkills: ['Java', 'SQL', 'C++', 'Object-Oriented Programming', 'Communication'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.2,
      salaryMax: 6.8,
      openings: 25,
      daysDeadline: 60
    },
    // 15. React Developer
    {
      title: 'Junior React.js Developer',
      companyName: 'Postman',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Remote',
      location: 'Bangalore, India',
      category: 'Frontend Development',
      description: 'Craft rich, collaborative desktop and web features for millions of API developers. Focus on modular state handling and fast rendering.',
      responsibilities: [
        'Build reusable component libraries and hooks with React and TypeScript',
        'Collaborate on client-side state caching and offline capabilities',
        'Maintain automated test coverage using React Testing Library'
      ],
      requirements: [
        'Good grasp of React functional components, hooks, and context API',
        'Knowledge of Web APIs and modern front-end debugging tools'
      ],
      requiredSkills: ['React.js', 'TypeScript', 'CSS Modules', 'Jest', 'Git'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 8,
      salaryMax: 13,
      openings: 3,
      daysDeadline: 30
    },
    // 16. Node.js Developer
    {
      title: 'Junior Node.js Backend Engineer',
      companyName: 'Paytm',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Noida, India',
      category: 'Backend Development',
      description: 'Build high-volume consumer payment and wallet notification microservices using Express, MongoDB, and Redis caching.',
      responsibilities: [
        'Develop resilient RESTful endpoints for merchant transactions',
        'Write unit tests and conduct load testing with k6 or JMeter',
        'Handle asynchronous data pipelines with message brokers'
      ],
      requirements: [
        'Solid foundation in JavaScript asynchronous patterns (Promises, async/await)',
        'Experience building server applications using Express.js'
      ],
      requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Unit Testing'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 7.5,
      salaryMax: 12,
      openings: 4,
      daysDeadline: 30
    },
    // 17. Database Developer
    {
      title: 'Database Developer / Junior DBA',
      companyName: 'Oracle',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Hyderabad, India',
      category: 'Database & Infrastructure',
      description: 'Support high-concurrency relational and document databases. Assist with schema architecture, query optimization, and automated backup routines.',
      responsibilities: [
        'Write complex stored procedures, triggers, and analytical queries',
        'Monitor database execution plans and tune slow-running queries',
        'Participate in disaster recovery drills and replication setup'
      ],
      requirements: [
        'Deep understanding of relational database theory, ACID properties, and normalization',
        'Proficiency in SQL (Oracle, MySQL, or PostgreSQL)'
      ],
      requiredSkills: ['Oracle SQL', 'PL/SQL', 'Database Tuning', 'PostgreSQL', 'Linux'],
      experienceLevel: '0-1 Years',
      isFresherEligible: true,
      salaryMin: 9,
      salaryMax: 15,
      openings: 2,
      daysDeadline: 40
    },
    // 18. Business Analyst Intern
    {
      title: 'Business Analyst Intern',
      companyName: 'EY',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Onsite',
      location: 'Bangalore, India',
      category: 'Business Analysis',
      description: 'Gather stakeholder requirements, document functional specifications, and perform market benchmarking for digital transformation clients.',
      responsibilities: [
        'Document business requirements and create process flow diagrams',
        'Analyze client datasets to identify cost optimization opportunities',
        'Prepare PowerPoint executive summaries and client deliverables'
      ],
      requirements: [
        'Strong analytical thinking, problem-solving, and presentation skills',
        'Proficiency in MS Excel, PowerPoint, and flowcharting tools'
      ],
      requiredSkills: ['Business Analysis', 'Excel Modeling', 'Process Mapping', 'PowerPoint', 'Agile'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 32000,
      openings: 3,
      daysDeadline: 25
    },
    // 19. Software Engineering Intern
    {
      title: 'Software Engineering Intern',
      companyName: 'Google',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Work alongside world-class software engineers on large-scale distributed systems, search features, or internal developer infrastructure.',
      responsibilities: [
        'Design, build, and test software solutions under engineering mentorship',
        'Collaborate across cross-functional teams in a fast-paced environment',
        'Present project findings and design docs at the internship conclusion'
      ],
      requirements: [
        'Currently enrolled in a B.Tech, M.Tech, or PhD program in Computer Science',
        'Strong programming foundation in C++, Java, Python, or Go'
      ],
      requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'Python', 'Distributed Systems'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 75000,
      openings: 5,
      daysDeadline: 35
    },
    // 20. Mobile App Developer Intern
    {
      title: 'Mobile App Developer Intern (React Native / Flutter)',
      companyName: 'Meesho',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Mobile Development',
      description: 'Help build lightweight, accessible mobile e-commerce experiences targeting tier-2 and tier-3 Indian shoppers on varying network speeds.',
      responsibilities: [
        'Develop cross-platform mobile views using React Native or Flutter',
        'Optimize app startup time and image caching on low-end Android devices',
        'Integrate REST APIs and handle offline synchronization'
      ],
      requirements: [
        'Familiarity with mobile app architectures and React Native / Flutter',
        'Understanding of component lifecycles and mobile UI patterns'
      ],
      requiredSkills: ['React Native', 'Flutter', 'JavaScript', 'Mobile UI', 'REST APIs'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 35000,
      openings: 3,
      daysDeadline: 22
    },
    // 21. AI/ML Engineering Intern
    {
      title: 'AI/ML Engineering Intern',
      companyName: 'NVIDIA',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Onsite',
      location: 'Pune, India',
      category: 'Data & AI',
      description: 'Assist in benchmarking deep learning frameworks and optimizing inference models on GPU architecture.',
      responsibilities: [
        'Profile PyTorch models on CUDA-enabled accelerators',
        'Clean, curate, and preprocess multimodal benchmark datasets',
        'Document performance metrics and throughput comparisons'
      ],
      requirements: [
        'Strong grasp of linear algebra, calculus, and neural network foundations',
        'Hands-on experience with PyTorch or TensorFlow'
      ],
      requiredSkills: ['Python', 'PyTorch', 'CUDA', 'Deep Learning', 'NumPy'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 65000,
      openings: 2,
      daysDeadline: 40
    },
    // 22. Cloud Infrastructure Associate
    {
      title: 'Cloud Infrastructure Associate',
      companyName: 'Hewlett Packard Enterprise',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Cloud & DevOps',
      description: 'Deploy, configure, and maintain hybrid enterprise storage, virtualized compute servers, and software-defined networks.',
      responsibilities: [
        'Automate server provisioning using Ansible and Terraform',
        'Monitor compute clusters and configure backup routines',
        'Address infrastructure support tickets within agreed SLAs'
      ],
      requirements: [
        'B.Tech in IT / CSE / ECE with knowledge of virtualization',
        'Basic certification in AWS, Azure, or Linux is a plus'
      ],
      requiredSkills: ['Linux', 'Terraform', 'Ansible', 'Virtualization', 'Networking'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 6.5,
      salaryMax: 10.5,
      openings: 4,
      daysDeadline: 30
    },
    // 23. Embedded Software Engineer
    {
      title: 'Junior Embedded Software Engineer',
      companyName: 'Qualcomm',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Hyderabad, India',
      category: 'Software Engineering',
      description: 'Write low-level firmware and device drivers for wireless communications, audio processors, and IoT edge devices.',
      responsibilities: [
        'Develop board support packages (BSP) and device drivers in C/C++',
        'Debug kernel modules using logic analyzers and oscilloscopes',
        'Optimize memory and battery footprint for embedded chips'
      ],
      requirements: [
        'Strong proficiency in C and microcontrollers (ARM architecture)',
        'Understanding of RTOS, device drivers, and hardware interfaces (I2C, SPI)'
      ],
      requiredSkills: ['C', 'C++', 'RTOS', 'Microcontrollers', 'Embedded Systems'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 11,
      salaryMax: 18,
      openings: 3,
      daysDeadline: 50
    },
    // 24. Quantitative Developer
    {
      title: 'Quantitative Technology Analyst',
      companyName: 'Goldman Sachs',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Build algorithmic pricing engines and high-frequency risk calculation models using modern C++, Python, and distributed memory grids.',
      responsibilities: [
        'Implement financial mathematical models into high-speed C++ libraries',
        'Optimize real-time market data ingestion pipelines',
        'Collaborate with quantitative strategists on algorithmic backtesting'
      ],
      requirements: [
        'High aptitude in mathematics, statistics, and low-latency programming',
        'Proficiency in C++ or Python'
      ],
      requiredSkills: ['C++', 'Python', 'Algorithms', 'Linear Algebra', 'Multi-threading'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 18,
      salaryMax: 28,
      openings: 2,
      daysDeadline: 45
    },
    // 25. Graduate Software Analyst
    {
      title: 'Graduate Software Analyst',
      companyName: 'Infosys',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Mysore, India',
      category: 'Software Engineering',
      description: 'Participate in world-class Infosys Mysore campus training, mastering enterprise software development, database design, and cloud methodologies.',
      responsibilities: [
        'Complete intensive technical learning modules and capstone projects',
        'Engage in real-world simulated client assignments',
        'Integrate into global development centers across India'
      ],
      requirements: [
        'Engineering graduate (All branches) graduating in 2026',
        'Consistent academic track record'
      ],
      requiredSkills: ['Java', 'Python', 'Database Foundations', 'Web Technologies', 'Aptitude'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.5,
      salaryMax: 7.2,
      openings: 30,
      daysDeadline: 60
    },
    // 26. Cloud Solutions Associate
    {
      title: 'Cloud Solutions Associate',
      companyName: 'IBM',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Cloud & DevOps',
      description: 'Assist in architecting Red Hat OpenShift and hybrid cloud migrations for enterprise clients in banking and telecommunications.',
      responsibilities: [
        'Containerize legacy application workloads into Kubernetes clusters',
        'Assist senior architects with infrastructure security configurations',
        'Develop automation scripts using Python and Ansible'
      ],
      requirements: [
        'Computer Science or IT degree with strong Linux background',
        'Understanding of container concepts (Docker / Kubernetes)'
      ],
      requiredSkills: ['Kubernetes', 'Docker', 'Linux', 'Python', 'OpenShift'],
      experienceLevel: '0-1 Years',
      isFresherEligible: true,
      salaryMin: 7,
      salaryMax: 11,
      openings: 4,
      daysDeadline: 35
    },
    // 27. FinTech Software Intern
    {
      title: 'FinTech Software Intern',
      companyName: 'Groww',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Work on mutual funds and stock trading user journeys. Build real-time order tracking and portfolio calculation services.',
      responsibilities: [
        'Develop backend REST microservices in Go or Java',
        'Optimize high-frequency price updates over WebSockets',
        'Write integration tests for payment settlement webhooks'
      ],
      requirements: [
        'Strong coding skills in Go, Java, or Node.js',
        'Eagerness to learn financial technology mechanisms'
      ],
      requiredSkills: ['Golang', 'Java', 'WebSockets', 'PostgreSQL', 'Kafka'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 45000,
      openings: 3,
      daysDeadline: 25
    },
    // 28. API Solutions Intern
    {
      title: 'API Engineering Intern',
      companyName: 'Hasura',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Remote',
      location: 'Bangalore, India',
      category: 'Backend Development',
      description: 'Help develop sample developer connectors, benchmark GraphQL engine query compilation, and author developer guides.',
      responsibilities: [
        'Build sample applications showcasing GraphQL queries and subscriptions',
        'Contribute to open-source developer documentation and issue reproduction',
        'Run performance benchmarks comparing REST and GraphQL latency'
      ],
      requirements: [
        'Strong knowledge of GraphQL and SQL database schemas',
        'Proficiency in JavaScript or TypeScript'
      ],
      requiredSkills: ['GraphQL', 'TypeScript', 'PostgreSQL', 'Docker', 'REST'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 35000,
      openings: 2,
      daysDeadline: 21
    },
    // 29. Systems Engineer
    {
      title: 'Systems Engineer - Digital Enterprise',
      companyName: 'Wipro',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Chennai, India',
      category: 'Software Engineering',
      description: 'Deliver end-to-end IT services, enterprise integration, and digital platform maintenance for Fortune 500 customers.',
      responsibilities: [
        'Analyze client support incidents and resolve code defects',
        'Build automated test scripts to accelerate release cycles',
        'Participate in daily standup and sprint planning meetings'
      ],
      requirements: [
        'B.E. / B.Tech / MCA with minimum 60% aggregate',
        'Good fundamental knowledge of programming and databases'
      ],
      requiredSkills: ['Java', 'C#', 'SQL', 'Git', 'Agile Methodologies'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.0,
      salaryMax: 6.5,
      openings: 20,
      daysDeadline: 40
    },
    // 30. Platform Reliability Engineer
    {
      title: 'Junior Platform Reliability Engineer',
      companyName: 'Uber India',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Hyderabad, India',
      category: 'Cloud & DevOps',
      description: 'Help ensure the resilience and elasticity of distributed microservices that power millions of rides and food deliveries worldwide.',
      responsibilities: [
        'Investigate service bottlenecks and optimize latency graphs',
        'Implement automated canary deployments and rollback scripts',
        'Participate in on-call rotation simulations and post-mortem analysis'
      ],
      requirements: [
        'Solid programming skills in Go, Java, or Python',
        'Knowledge of Linux internals, TCP/IP, and distributed systems'
      ],
      requiredSkills: ['Golang', 'Linux', 'Kubernetes', 'Prometheus', 'Distributed Systems'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 15,
      salaryMax: 24,
      openings: 3,
      daysDeadline: 45
    },
    // 31. Software Engineer - Trading Tools
    {
      title: 'Software Engineer - Trading Tools',
      companyName: 'Zerodha',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Remote',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Work with the core engineering group building fast, minimalist, highly scalable trading and charting applications.',
      responsibilities: [
        'Develop lightweight backend endpoints and WebSocket feeds in Go',
        'Write lean, dependency-free JavaScript for client charting utilities',
        'Contribute to internal open-source developer toolkits'
      ],
      requirements: [
        'Obsession with clean, simple, and unbloated software architecture',
        'Strong knowledge of Go or modern JavaScript'
      ],
      requiredSkills: ['Golang', 'JavaScript', 'PostgreSQL', 'WebSockets', 'Redis'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 12,
      salaryMax: 18,
      openings: 2,
      daysDeadline: 30
    },
    // 32. IT Consultant Trainee
    {
      title: 'IT Consulting Analyst',
      companyName: 'Capgemini',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Mumbai, India',
      category: 'Software Engineering',
      description: 'Work with enterprise clients on SAP ERP integrations, digital manufacturing, and cloud migration frameworks.',
      responsibilities: [
        'Configure and test enterprise ERP integration workflows',
        'Prepare technical architecture documentation and functional specs',
        'Conduct unit and integration testing alongside client leads'
      ],
      requirements: [
        'Degree in Engineering or Computer Applications',
        'Effective communication skills and analytical ability'
      ],
      requiredSkills: ['ERP Concepts', 'SQL', 'Java', 'Business Process', 'Excel'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.8,
      salaryMax: 7.5,
      openings: 12,
      daysDeadline: 35
    },
    // 33. Digital Associate
    {
      title: 'Digital Engineering Associate',
      companyName: 'Cognizant',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Chennai, India',
      category: 'Software Engineering',
      description: 'Collaborate with global clients across healthcare, retail, and financial sectors to build modern web and cloud applications.',
      responsibilities: [
        'Develop software modules according to Agile sprint commitments',
        'Execute automated test cases and participate in peer code reviews',
        'Address defect tickets and optimize legacy codebases'
      ],
      requirements: [
        'B.Tech / B.E. in CSE, IT, ECE with minimum 60% aggregate',
        'Familiarity with web technologies and relational databases'
      ],
      requiredSkills: ['Java', 'JavaScript', 'HTML/CSS', 'MySQL', 'Git'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.5,
      salaryMax: 7.0,
      openings: 18,
      daysDeadline: 45
    },
    // 34. Cloud Security Associate
    {
      title: 'Cloud Security Associate',
      companyName: 'Cisco',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Cybersecurity',
      description: 'Help develop and manage next-generation cloud firewall policies, VPN software, and enterprise network telemetry.',
      responsibilities: [
        'Write automated Python scripts to validate firewall configurations',
        'Investigate suspicious network traffic patterns using telemetry tools',
        'Collaborate with developers on secure coding standards'
      ],
      requirements: [
        'Deep understanding of TCP/IP networking, routing, and switching',
        'Proficiency in Python or C++ and Linux environments'
      ],
      requiredSkills: ['Networking', 'Python', 'TCP/IP', 'Cybersecurity', 'Linux'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 10,
      salaryMax: 16,
      openings: 3,
      daysDeadline: 40
    },
    // 35. Creative Cloud Software Engineer
    {
      title: 'Junior Software Engineer - Web Platforms',
      companyName: 'Adobe',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Noida, India',
      category: 'Frontend Development',
      description: 'Build web-based creative editing tools using WebAssembly, WebGL, Canvas APIs, and high-performance React architectures.',
      responsibilities: [
        'Implement vector graphics rendering components on HTML5 Canvas',
        'Optimize memory usage and frame rates during complex multi-layer editing',
        'Write modular, test-driven TypeScript components'
      ],
      requirements: [
        'Exceptional command of modern JavaScript, TypeScript, and Data Structures',
        'Understanding of browser rendering pipelines and 2D canvas graphics'
      ],
      requiredSkills: ['TypeScript', 'WebGL', 'React.js', 'Canvas API', 'Algorithms'],
      experienceLevel: '0-1 Years',
      isFresherEligible: true,
      salaryMin: 14,
      salaryMax: 22,
      openings: 2,
      daysDeadline: 35
    },
    // 36. CRM Solutions Engineer
    {
      title: 'Associate Salesforce Developer',
      companyName: 'Salesforce',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Hyderabad, India',
      category: 'Software Engineering',
      description: 'Develop custom Lightning Web Components (LWC), Apex triggers, and enterprise integration endpoints on the Salesforce cloud.',
      responsibilities: [
        'Author Apex classes, triggers, and batch jobs following best practices',
        'Build reactive user interfaces using Lightning Web Components',
        'Integrate third-party REST services with Salesforce platform events'
      ],
      requirements: [
        'Strong knowledge of Object-Oriented Programming (Java / C# / Apex)',
        'Understanding of web fundamentals (HTML, CSS, JavaScript)'
      ],
      requiredSkills: ['Apex', 'Lightning Web Components', 'JavaScript', 'REST APIs', 'Cloud CRM'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 9,
      salaryMax: 15,
      openings: 4,
      daysDeadline: 30
    },
    // 37. Semiconductor Verification Engineer
    {
      title: 'Junior Hardware Verification Engineer',
      companyName: 'Intel',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Develop SystemVerilog testbenches and UVM validation environments to verify microprocessor and system-on-chip (SoC) architectures.',
      responsibilities: [
        'Build automated regression test suites for silicon validation',
        'Analyze simulation code coverage and identify design corner cases',
        'Write Python scripts to automate verification workflows'
      ],
      requirements: [
        'B.Tech / M.Tech in ECE / EEE / Computer Engineering',
        'Knowledge of digital logic design, SystemVerilog, and computer architecture'
      ],
      requiredSkills: ['SystemVerilog', 'Digital Design', 'Python', 'Computer Architecture', 'Linux'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 11,
      salaryMax: 17,
      openings: 3,
      daysDeadline: 50
    },
    // 38. Financial Software Engineer
    {
      title: 'Technology Analyst - Trading Infrastructure',
      companyName: 'Morgan Stanley',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Mumbai, India',
      category: 'Software Engineering',
      description: 'Build robust, highly scalable trading and risk management systems handling billions of dollars in daily transactions.',
      responsibilities: [
        'Engineer low-latency distributed services in Java and Spring Boot',
        'Design performant relational schemas and transaction models',
        'Participate in continuous deployment and automated verification'
      ],
      requirements: [
        'B.Tech / B.E. in CS / IT with excellent analytical mindset',
        'Proficiency in Java or C++, multithreading, and SQL'
      ],
      requiredSkills: ['Java', 'Spring Boot', 'Multithreading', 'SQL', 'Kafka'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 16,
      salaryMax: 24,
      openings: 3,
      daysDeadline: 40
    },
    // 39. Investment Banking Technology Intern
    {
      title: 'Summer Technology Analyst',
      companyName: 'JPMorgan Chase',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Mumbai, India',
      category: 'Software Engineering',
      description: 'Collaborate with engineering teams on wealth management platforms, blockchain initiatives, or consumer banking portals.',
      responsibilities: [
        'Develop real-world software modules under senior tech mentors',
        'Participate in internal hackathons and firmwide learning seminars',
        'Showcase project achievements to senior technology managing directors'
      ],
      requirements: [
        'Currently pursuing B.Tech in CSE / IT graduating in 2026/2027',
        'Proficiency in Java, Python, or C++ and strong problem-solving skills'
      ],
      requiredSkills: ['Java', 'Python', 'Algorithms', 'Data Structures', 'Git'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 70000,
      openings: 4,
      daysDeadline: 35
    },
    // 40. Industrial Automation Software Trainee
    {
      title: 'Industrial IoT Software Engineer',
      companyName: 'Siemens',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Develop edge computing applications and telemetry ingestion pipelines for smart manufacturing plants and industrial PLCs.',
      responsibilities: [
        'Develop IoT edge communication protocols (MQTT, OPC-UA)',
        'Build monitoring web dashboards using React and Node.js',
        'Ensure robust industrial cybersecurity and firmware integrity'
      ],
      requirements: [
        'Degree in Computer Engineering / Electronics / Instrumentation',
        'Familiarity with IoT protocols, Python, and C++'
      ],
      requiredSkills: ['IoT', 'C++', 'Python', 'MQTT', 'Industrial Automation'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 7,
      salaryMax: 11,
      openings: 3,
      daysDeadline: 30
    },
    // 41. SaaS Product Developer
    {
      title: 'Junior Product Developer',
      companyName: 'Zoho',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Chennai, India',
      category: 'Full-Stack Development',
      description: 'Build fast, native-feeling cloud productivity apps. Develop proprietary data models and custom client UI components with no heavy dependencies.',
      responsibilities: [
        'Design database schemas and optimized Java server controllers',
        'Craft vanilla JavaScript / Web Component UI elements',
        'Maintain zero external dependency architecture'
      ],
      requirements: [
        'Strong passion for core programming concepts (Data Structures, Algorithms)',
        'Deep understanding of Java, JavaScript, and database systems'
      ],
      requiredSkills: ['Java', 'JavaScript', 'SQL', 'Algorithms', 'Object-Oriented Design'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 6.5,
      salaryMax: 10,
      openings: 10,
      daysDeadline: 45
    },
    // 42. Telecom Software Engineer
    {
      title: '5G Telecom Software Engineer',
      companyName: 'Tech Mahindra',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Pune, India',
      category: 'Software Engineering',
      description: 'Work on software-defined networking, 5G core network functions, and telecom orchestration software for global operators.',
      responsibilities: [
        'Implement network function virtualization (NFV) components in C++',
        'Conduct automated protocol compliance and stress testing',
        'Deploy microservices onto OpenStack and Kubernetes clusters'
      ],
      requirements: [
        'Degree in Electronics & Communication / Computer Science',
        'Knowledge of networking protocols and C/C++ programming'
      ],
      requiredSkills: ['C++', 'Networking', '5G', 'Linux', 'Kubernetes'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.5,
      salaryMax: 7.2,
      openings: 8,
      daysDeadline: 40
    },
    // 43. Digital Engineering Trainee
    {
      title: 'Digital Engineering Trainee',
      companyName: 'HCLTech',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Onsite',
      location: 'Noida, India',
      category: 'Software Engineering',
      description: 'Join HCLTech’s elite graduate onboarding cohort. Receive hands-on exposure to cloud application engineering and automation toolkits.',
      responsibilities: [
        'Learn enterprise application development under senior tech leaders',
        'Execute test plans and assist in defect triaging',
        'Contribute to project sprint deliverables'
      ],
      requirements: [
        'B.Tech / B.E. (All streams) with 60% throughout academics',
        'Strong problem-solving and basic coding fundamentals'
      ],
      requiredSkills: ['Java', 'Python', 'SQL', 'Problem Solving', 'Teamwork'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 4.2,
      salaryMax: 6.8,
      openings: 20,
      daysDeadline: 55
    },
    // 44. Cloud Application Engineer
    {
      title: 'Junior Cloud Application Engineer',
      companyName: 'Persistent Systems',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Pune, India',
      category: 'Software Engineering',
      description: 'Help global ISVs modernize legacy software into multi-tenant cloud SaaS architectures using AWS and Azure.',
      responsibilities: [
        'Implement serverless functions using AWS Lambda and API Gateway',
        'Design document schemas in DynamoDB or MongoDB',
        'Write automated integration tests in TypeScript'
      ],
      requirements: [
        'Familiarity with cloud computing concepts and serverless frameworks',
        'Hands-on coding experience in Node.js or Python'
      ],
      requiredSkills: ['AWS', 'Node.js', 'Serverless', 'TypeScript', 'MongoDB'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 5.5,
      salaryMax: 9.0,
      openings: 5,
      daysDeadline: 35
    },
    // 45. Travel Tech Frontend Intern
    {
      title: 'Travel Tech Frontend Intern',
      companyName: 'MakeMyTrip',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      location: 'Gurugram, India',
      category: 'Frontend Development',
      description: 'Work on search result pages and flight booking checkout flows used by millions of Indian travelers.',
      responsibilities: [
        'Implement performant React web components with modern CSS modules',
        'Optimize client-side caching to reduce flight search latency',
        'Conduct cross-browser and mobile responsive testing'
      ],
      requirements: [
        'Proficiency in React.js, JavaScript, and responsive CSS layout',
        'Familiarity with REST APIs and browser network profiling'
      ],
      requiredSkills: ['React.js', 'JavaScript', 'CSS3', 'REST APIs', 'Performance Optimization'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 30000,
      openings: 3,
      daysDeadline: 25
    },
    // 46. Collaboration Tools Intern
    {
      title: 'Collaboration Tools Engineering Intern',
      companyName: 'Atlassian',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Remote',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Work on rich text editor plugins and team collaboration capabilities for Jira and Confluence cloud.',
      responsibilities: [
        'Develop frontend extension components using React and TypeScript',
        'Write automated end-to-end tests with Cypress',
        'Participate in agile team retrospectives and sprint demos'
      ],
      requirements: [
        'Enrolled in computer science or related undergraduate program',
        'Good command of TypeScript, React, and Git'
      ],
      requiredSkills: ['React.js', 'TypeScript', 'Git', 'Agile', 'Unit Testing'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 60000,
      openings: 2,
      daysDeadline: 30
    },
    // 47. Cloud ERP Solutions Trainee
    {
      title: 'Associate Cloud Consultant (SAP BTP)',
      companyName: 'SAP',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Software Engineering',
      description: 'Develop cloud extensions on SAP Business Technology Platform (BTP) using Node.js, Java, and SAP UI5 / Fiori.',
      responsibilities: [
        'Develop SAP Cloud Application Programming model (CAP) services',
        'Design enterprise analytical dashboards in SAP UI5',
        'Integrate on-premise ERP with cloud microservices'
      ],
      requirements: [
        'B.Tech / MCA with solid programming fundamentals',
        'Understanding of enterprise systems and cloud services'
      ],
      requiredSkills: ['JavaScript', 'Node.js', 'SAP BTP', 'SQL', 'Cloud Architecture'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 8.5,
      salaryMax: 14,
      openings: 4,
      daysDeadline: 40
    },
    // 48. Risk Advisory Technology Intern
    {
      title: 'Technology Risk Advisory Intern',
      companyName: 'KPMG',
      opportunityType: 'Internship',
      jobType: 'Internship',
      workplaceType: 'Onsite',
      location: 'Gurugram, India',
      category: 'Cybersecurity',
      description: 'Assist in IT security audits, regulatory compliance reviews, and data governance assessments for financial institutions.',
      responsibilities: [
        'Analyze client IT controls against ISO 27001 and RBI cyber frameworks',
        'Review identity and access management (IAM) segregation of duties',
        'Compile audit workpapers and client presentations'
      ],
      requirements: [
        'Undergraduate in Computer Science / Information Security / IT',
        'Knowledge of information security standards and IT general controls'
      ],
      requiredSkills: ['IT Audit', 'Information Security', 'Risk Assessment', 'Excel', 'Compliance'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      stipendAmount: 28000,
      openings: 2,
      daysDeadline: 20
    },
    // 49. Digital Assurance Trainee
    {
      title: 'Digital Assurance & Automation Trainee',
      companyName: 'PwC',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Mumbai, India',
      category: 'QA & Testing',
      description: 'Build robotic process automation (RPA) workflows and automated quality engineering scripts for multinational clients.',
      responsibilities: [
        'Develop test automation scripts using Python and Selenium',
        'Create RPA bots to streamline manual data verification tasks',
        'Report quality assurance metrics to project managers'
      ],
      requirements: [
        'B.Tech / B.E. / MCA with interest in software test automation',
        'Familiarity with Python or Java'
      ],
      requiredSkills: ['Python', 'Selenium', 'Automation', 'SQL', 'Quality Assurance'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 5,
      salaryMax: 8.5,
      openings: 5,
      daysDeadline: 35
    },
    // 50. Devops Engineer - Build Systems
    {
      title: 'Junior Build & Release Engineer',
      companyName: 'Microsoft',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Cloud & DevOps',
      description: 'Maintain high-speed distributed build pipelines, containerized developer devboxes, and package delivery workflows for developer products.',
      responsibilities: [
        'Optimize build pipeline execution times using distributed caching',
        'Maintain automated deployment stages in Azure DevOps',
        'Troubleshoot compile failures across Windows and Linux targets'
      ],
      requirements: [
        'Knowledge of scripting (PowerShell, Bash, or Python)',
        'Understanding of CI/CD concepts and container technologies'
      ],
      requiredSkills: ['CI/CD', 'Azure DevOps', 'Docker', 'PowerShell', 'Git'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 12,
      salaryMax: 19,
      openings: 3,
      daysDeadline: 45
    },
    // 51. Machine Learning Systems Engineer
    {
      title: 'Junior ML Infrastructure Engineer',
      companyName: 'Google',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Hyderabad, India',
      category: 'Data & AI',
      description: 'Assist in maintaining high-performance GPU/TPU cluster orchestration, distributed dataset pipelines, and model serving runtimes.',
      responsibilities: [
        'Automate dataset preparation pipelines using Apache Beam or Python',
        'Optimize model serving latency with TensorFlow Serving or Triton',
        'Monitor cluster telemetry and resource utilization'
      ],
      requirements: [
        'B.Tech in Computer Science with focus on Systems or AI',
        'Strong programming ability in Python and C++'
      ],
      requiredSkills: ['Python', 'TensorFlow', 'Kubernetes', 'Linux', 'System Design'],
      experienceLevel: '0-1 Years',
      isFresherEligible: true,
      salaryMin: 16,
      salaryMax: 26,
      openings: 2,
      daysDeadline: 50
    },
    // 52. Associate Cloud Architect
    {
      title: 'Associate Cloud Architect',
      companyName: 'Amazon',
      opportunityType: 'Job',
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Bangalore, India',
      category: 'Cloud & DevOps',
      description: 'Help enterprise AWS customers architect resilient, secure, high-performing cloud environments following AWS Well-Architected frameworks.',
      responsibilities: [
        'Develop CloudFormation and Terraform reference templates',
        'Perform architectural assessments on customer cloud workloads',
        'Deliver technical workshops on serverless and container technologies'
      ],
      requirements: [
        'Understanding of core AWS services (EC2, S3, RDS, VPC, IAM, Lambda)',
        'Strong written and verbal technical presentation abilities'
      ],
      requiredSkills: ['AWS', 'Cloud Architecture', 'Terraform', 'Networking', 'Python'],
      experienceLevel: 'Fresher / Entry Level',
      isFresherEligible: true,
      salaryMin: 13,
      salaryMax: 20,
      openings: 4,
      daysDeadline: 40
    }
  ];

  return rawOpportunities.map(opp => ({
    ...opp,
    company: getCompanyId(opp.companyName),
    deadline: new Date(Date.now() + (opp.daysDeadline || 30) * 24 * 60 * 60 * 1000),
    isDemo: true
  }));
};

module.exports = {
  demoUsers,
  companiesData,
  generateOpportunities
};

/**
 * Sample Data Seed
 * Populates the database with demo employees, assets, and learning paths
 */

const bcrypt = require('bcryptjs');
const db = require('../utils/database');

// Sample Learning Assets with Real Content (Videos, Docs, Sandboxes)
const sampleAssets = [
  {
    title: "Introduction to Cloud Computing",
    description: "Learn the fundamentals of cloud computing, including IaaS, PaaS, and SaaS models.",
    category: "Cloud",
    difficulty: "Beginner",
    format: "Video",
    duration: 45,
    url: "/assets/cloud-intro",
    thumbnail: "https://img.youtube.com/vi/M988_fsOSWo/maxresdefault.jpg",
    tags: ["AWS", "Azure", "GCP", "Fundamentals"],
    prerequisites: [],
    content: {
      type: "youtube",
      playlist: [
        {
          videoId: "M988_fsOSWo",
          title: "What is Cloud Computing?",
          duration: 6,
          description: "Introduction to cloud computing concepts"
        },
        {
          videoId: "mxT233EdY5c",
          title: "Cloud Service Models (IaaS, PaaS, SaaS)",
          duration: 8,
          description: "Understanding different cloud service models"
        },
        {
          videoId: "QAfLraEWkM8",
          title: "Public vs Private vs Hybrid Cloud",
          duration: 7,
          description: "Exploring cloud deployment models"
        },
        {
          videoId: "dH0yz-Osy54",
          title: "Cloud Computing Benefits",
          duration: 10,
          description: "Why organizations move to the cloud"
        },
        {
          videoId: "usYySG1nbfI",
          title: "Major Cloud Providers Overview",
          duration: 12,
          description: "Comparing AWS, Azure, and Google Cloud"
        }
      ],
      resources: [
        { title: "AWS Cloud Basics", url: "https://aws.amazon.com/getting-started/" },
        { title: "Azure Fundamentals", url: "https://learn.microsoft.com/en-us/azure/" }
      ]
    }
  },
  {
    title: "AWS Solutions Architect Deep Dive",
    description: "Advanced AWS architecture patterns, scalability, and security best practices.",
    category: "Cloud",
    difficulty: "Advanced",
    format: "Text",
    duration: 120,
    url: "/assets/aws-architect",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
    tags: ["AWS", "Architecture", "Scalability"],
    prerequisites: ["Introduction to Cloud Computing"],
    content: {
      type: "documentation",
      docs: [
        { 
          title: "AWS Well-Architected Framework", 
          url: "https://aws.amazon.com/architecture/well-architected/",
          description: "Best practices for building secure, high-performing, resilient systems"
        },
        { 
          title: "AWS Solutions Library", 
          url: "https://aws.amazon.com/solutions/",
          description: "Vetted technical reference implementations"
        },
        { 
          title: "AWS Architecture Center", 
          url: "https://aws.amazon.com/architecture/",
          description: "Reference architecture diagrams and best practices"
        }
      ],
      summary: "Comprehensive guide to AWS architectural patterns including microservices, event-driven architecture, and serverless designs."
    }
  },
  {
    title: "Cloud Security Fundamentals",
    description: "Understanding cloud security principles, IAM, encryption, and compliance.",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    format: "Video",
    duration: 60,
    url: "/assets/cloud-security",
    thumbnail: "https://img.youtube.com/vi/pTXMercDIQU/maxresdefault.jpg",
    tags: ["Security", "IAM", "Encryption"],
    prerequisites: ["Introduction to Cloud Computing"],
    content: {
      type: "youtube",
      playlist: [
        {
          videoId: "pTXMercDIQU",
          title: "Cloud Security Fundamentals",
          duration: 15,
          description: "Introduction to cloud security"
        },
        {
          videoId: "tlU6SCoD_7M",
          title: "Identity and Access Management (IAM)",
          duration: 12,
          description: "Understanding IAM principles"
        },
        {
          videoId: "2WS0N9ARSXo",
          title: "Data Encryption in the Cloud",
          duration: 10,
          description: "Encryption at rest and in transit"
        },
        {
          videoId: "MG40D0QIYQU",
          title: "Cloud Compliance and Governance",
          duration: 13,
          description: "Meeting compliance requirements"
        }
      ],
      resources: [
        { title: "AWS Security Best Practices", url: "https://aws.amazon.com/security/best-practices/" },
        { title: "OWASP Cloud Security", url: "https://owasp.org/www-project-cloud-security/" }
      ]
    }
  },
  {
    title: "Docker Containerization Lab",
    description: "Hands-on practice with Docker containers, images, and orchestration.",
    category: "DevOps",
    difficulty: "Intermediate",
    format: "Interactive",
    duration: 90,
    url: "/assets/docker-lab",
    thumbnail: "https://img.youtube.com/vi/pg19Z8LL06w/maxresdefault.jpg",
    tags: ["Docker", "Containers", "DevOps"],
    prerequisites: [],
    content: {
      type: "sandbox",
      platform: "Play with Docker",
      sandboxUrl: "https://labs.play-with-docker.com/",
      videoId: "pg19Z8LL06w", // "Docker Tutorial for Beginners"
      exercises: [
        "Create your first Docker container",
        "Build a custom Docker image",
        "Use Docker Compose for multi-container apps",
        "Implement container networking",
        "Manage data with Docker volumes"
      ],
      resources: [
        { title: "Docker Official Documentation", url: "https://docs.docker.com/" },
        { title: "Docker Hub", url: "https://hub.docker.com/" }
      ]
    }
  },
  {
    title: "Kubernetes for Beginners",
    description: "Introduction to Kubernetes concepts, pods, services, and deployments.",
    category: "DevOps",
    difficulty: "Beginner",
    format: "Video",
    duration: 75,
    url: "/assets/k8s-basics",
    thumbnail: "https://img.youtube.com/vi/X48VuDVv0do/maxresdefault.jpg",
    tags: ["Kubernetes", "Orchestration", "DevOps"],
    prerequisites: ["Docker Containerization Lab"],
    content: {
      type: "youtube",
      playlist: [
        {
          videoId: "X48VuDVv0do",
          title: "Kubernetes Explained in 15 Minutes",
          duration: 15,
          description: "Quick overview of Kubernetes"
        },
        {
          videoId: "PH-2FfFD2PU",
          title: "Kubernetes Architecture",
          duration: 18,
          description: "Understanding K8s components"
        },
        {
          videoId: "7bA0gTroJjw",
          title: "Pods and Containers",
          duration: 14,
          description: "Working with pods in Kubernetes"
        },
        {
          videoId: "T4Z7visMM4E",
          title: "Services and Networking",
          duration: 16,
          description: "Kubernetes service types"
        },
        {
          videoId: "qmDzcu5uY1I",
          title: "Deployments and Scaling",
          duration: 12,
          description: "Managing deployments in K8s"
        }
      ],
      resources: [
        { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/" },
        { title: "Play with Kubernetes", url: "https://labs.play-with-k8s.com/" }
      ]
    }
  },
  {
    title: "Machine Learning Foundations",
    description: "Core ML concepts, algorithms, and practical applications in business.",
    category: "AI",
    difficulty: "Beginner",
    format: "Text",
    duration: 90,
    url: "/assets/ml-foundations",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
    tags: ["Machine Learning", "AI", "Python"],
    prerequisites: [],
    content: {
      type: "documentation",
      docs: [
        { 
          title: "Google ML Crash Course", 
          url: "https://developers.google.com/machine-learning/crash-course",
          description: "Fast-paced introduction to machine learning"
        },
        { 
          title: "Scikit-learn Documentation", 
          url: "https://scikit-learn.org/stable/tutorial/index.html",
          description: "Practical machine learning in Python"
        },
        { 
          title: "ML Fundamentals by AWS", 
          url: "https://aws.amazon.com/machine-learning/mlu/",
          description: "Machine Learning University courses"
        }
      ],
      summary: "Comprehensive introduction to supervised and unsupervised learning, model evaluation, and feature engineering."
    }
  },
  {
    title: "Deep Learning with TensorFlow",
    description: "Build neural networks and train deep learning models with TensorFlow.",
    category: "AI",
    difficulty: "Advanced",
    format: "Interactive",
    duration: 150,
    url: "/assets/tensorflow-deep",
    thumbnail: "https://img.youtube.com/vi/tPYj3fFJGjk/maxresdefault.jpg",
    tags: ["Deep Learning", "TensorFlow", "Neural Networks"],
    prerequisites: ["Machine Learning Foundations"],
    content: {
      type: "sandbox",
      platform: "Google Colab",
      sandboxUrl: "https://colab.research.google.com/",
      videoId: "tPYj3fFJGjk", // "TensorFlow 2.0 Complete Course"
      exercises: [
        "Build a simple neural network",
        "Implement CNNs for image classification",
        "Create RNNs for sequence data",
        "Transfer learning with pre-trained models",
        "Deploy models with TensorFlow Serving"
      ],
      resources: [
        { title: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials" },
        { title: "TensorFlow Playground", url: "https://playground.tensorflow.org/" }
      ]
    }
  },
  {
    title: "Network Security Essentials",
    description: "Firewalls, VPNs, intrusion detection, and network security protocols.",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    format: "Video",
    duration: 80,
    url: "/assets/network-security",
    thumbnail: "https://img.youtube.com/vi/qiQR5rTSshw/maxresdefault.jpg",
    tags: ["Network Security", "Firewalls", "VPN"],
    prerequisites: [],
    content: {
      type: "youtube",
      videoId: "qiQR5rTSshw", // "Network Security - CompTIA Security+"
      transcript: "Understanding firewalls, VPNs, IDS/IPS, secure protocols...",
      resources: [
        { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
        { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
      ]
    }
  },
  {
    title: "Ethical Hacking Simulation",
    description: "Practice penetration testing in a safe, sandboxed environment.",
    category: "Cybersecurity",
    difficulty: "Advanced",
    format: "Interactive",
    duration: 120,
    url: "/assets/ethical-hacking",
    thumbnail: "https://img.youtube.com/vi/3Kq1MIfTWCE/maxresdefault.jpg",
    tags: ["Penetration Testing", "Security", "Ethical Hacking"],
    prerequisites: ["Network Security Essentials", "Cloud Security Fundamentals"],
    content: {
      type: "sandbox",
      platform: "TryHackMe",
      sandboxUrl: "https://tryhackme.com/",
      videoId: "3Kq1MIfTWCE", // "Ethical Hacking Full Course"
      exercises: [
        "Reconnaissance and information gathering",
        "Vulnerability scanning and exploitation",
        "Web application penetration testing",
        "Network penetration testing",
        "Post-exploitation and reporting"
      ],
      resources: [
        { title: "HackTheBox", url: "https://www.hackthebox.com/" },
        { title: "OWASP WebGoat", url: "https://owasp.org/www-project-webgoat/" },
        { title: "Metasploit Unleashed", url: "https://www.offensive-security.com/metasploit-unleashed/" }
      ]
    }
  },
  {
    title: "CI/CD Pipeline Design",
    description: "Build automated deployment pipelines with Jenkins, GitLab, and GitHub Actions.",
    category: "DevOps",
    difficulty: "Advanced",
    format: "Text",
    duration: 100,
    url: "/assets/cicd-pipeline",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400",
    tags: ["CI/CD", "Jenkins", "Automation"],
    prerequisites: ["Docker Containerization Lab"],
    content: {
      type: "documentation",
      docs: [
        { 
          title: "GitHub Actions Documentation", 
          url: "https://docs.github.com/en/actions",
          description: "Automate your workflow from idea to production"
        },
        { 
          title: "GitLab CI/CD", 
          url: "https://docs.gitlab.com/ee/ci/",
          description: "GitLab's built-in continuous integration and delivery"
        },
        { 
          title: "Jenkins User Documentation", 
          url: "https://www.jenkins.io/doc/",
          description: "Leading open source automation server"
        }
      ],
      summary: "Learn to design, implement, and optimize CI/CD pipelines for automated testing and deployment."
    }
  },
  {
    title: "Natural Language Processing Basics",
    description: "Text processing, sentiment analysis, and chatbot development fundamentals.",
    category: "AI",
    difficulty: "Intermediate",
    format: "Video",
    duration: 85,
    url: "/assets/nlp-basics",
    thumbnail: "https://img.youtube.com/vi/fLvJ8VdHLA0/maxresdefault.jpg",
    tags: ["NLP", "Text Processing", "AI"],
    prerequisites: ["Machine Learning Foundations"],
    content: {
      type: "youtube",
      videoId: "fLvJ8VdHLA0", // "Natural Language Processing in Python"
      transcript: "Learn tokenization, stemming, lemmatization, sentiment analysis...",
      resources: [
        { title: "NLTK Documentation", url: "https://www.nltk.org/" },
        { title: "spaCy Course", url: "https://course.spacy.io/" },
        { title: "Hugging Face Transformers", url: "https://huggingface.co/docs/transformers/" }
      ]
    }
  },
  {
    title: "Cloud Cost Optimization",
    description: "Strategies to reduce cloud spending while maintaining performance.",
    category: "Cloud",
    difficulty: "Intermediate",
    format: "Text",
    duration: 55,
    url: "/assets/cost-optimization",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
    tags: ["Cost Management", "Cloud", "Optimization"],
    prerequisites: ["Introduction to Cloud Computing"],
    content: {
      type: "documentation",
      docs: [
        { 
          title: "AWS Cost Optimization", 
          url: "https://aws.amazon.com/pricing/cost-optimization/",
          description: "Best practices for optimizing your AWS costs"
        },
        { 
          title: "Azure Cost Management", 
          url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/",
          description: "Monitor and optimize cloud spending"
        },
        { 
          title: "GCP Cost Optimization", 
          url: "https://cloud.google.com/cost-management",
          description: "Google Cloud cost management best practices"
        }
      ],
      summary: "Learn strategies for rightsizing resources, using reserved instances, implementing auto-scaling, and monitoring costs."
    }
  }
];

// Sample Employees with different learning styles
const sampleEmployees = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "Cloud Engineer",
    department: "Infrastructure",
    skillLevel: "Intermediate",
    learningPreference: "Visual",
    background: ["Cloud", "DevOps"],
    strengths: ["Quick learner", "Problem-solving"],
    gaps: ["Advanced security", "Cost optimization"],
    preferredFormats: ["Video", "Interactive"],
    completionRate: 0.75,
    averageScore: 82,
    totalHoursSpent: 45
  },
  {
    name: "Marcus Williams",
    email: "marcus.williams@company.com",
    role: "Security Analyst",
    department: "Cybersecurity",
    skillLevel: "Advanced",
    learningPreference: "Text",
    background: ["Cybersecurity", "Networking"],
    strengths: ["Deep analytical thinking", "Technical writing"],
    gaps: ["Cloud-native security", "AI/ML security"],
    preferredFormats: ["Text", "Interactive"],
    completionRate: 0.90,
    averageScore: 91,
    totalHoursSpent: 78
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    role: "Junior Developer",
    department: "Engineering",
    skillLevel: "Beginner",
    learningPreference: "Hands-on",
    background: ["Programming", "Web Development"],
    strengths: ["Eager to learn", "Collaborative"],
    gaps: ["Cloud platforms", "DevOps practices", "Security"],
    preferredFormats: ["Interactive", "Video"],
    completionRate: 0.45,
    averageScore: 68,
    totalHoursSpent: 23
  },
  {
    name: "David Park",
    email: "david.park@company.com",
    role: "ML Engineer",
    department: "Data Science",
    skillLevel: "Advanced",
    learningPreference: "Visual",
    background: ["AI", "Machine Learning", "Python"],
    strengths: ["Mathematical reasoning", "Research-oriented"],
    gaps: ["MLOps", "Production deployment"],
    preferredFormats: ["Video", "Text"],
    completionRate: 0.85,
    averageScore: 88,
    totalHoursSpent: 67
  },
  {
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "DevOps Engineer",
    department: "Platform",
    skillLevel: "Intermediate",
    learningPreference: "Hands-on",
    background: ["DevOps", "Cloud", "Automation"],
    strengths: ["Practical application", "Troubleshooting"],
    gaps: ["Advanced Kubernetes", "Security automation"],
    preferredFormats: ["Interactive", "Text"],
    completionRate: 0.70,
    averageScore: 79,
    totalHoursSpent: 52
  }
];

// Sample Admin User
const adminUser = {
  name: "Admin User",
  email: "admin@skillstream.com",
  role: "Administrator",
  isAdmin: true
};

// Seed function
function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  // Create admin user
  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
  db.createUser({
    ...adminUser,
    password: hashedAdminPassword
  });
  console.log('✅ Admin user created (admin@skillstream.com / admin123)');

  // Create assets
  sampleAssets.forEach(asset => {
    db.createAsset(asset);
  });
  console.log(`✅ Created ${sampleAssets.length} learning assets`);

  // Create employees and their user accounts
  sampleEmployees.forEach(employee => {
    const hashedPassword = bcrypt.hashSync('password123', 10);
    const user = db.createUser({
      name: employee.name,
      email: employee.email,
      password: hashedPassword,
      role: employee.role,
      isAdmin: false
    });

    const employeeRecord = db.createEmployee({
      ...employee,
      userId: user.id
    });

    console.log(`✅ Created employee: ${employee.name}`);
  });

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@skillstream.com / admin123');
  console.log('Employees: [employee-email] / password123');
}

module.exports = { seedDatabase, sampleAssets, sampleEmployees };

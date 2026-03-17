export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  desc: string;
  category: string;
  status: 'upcoming' | 'registering' | 'closed';
  image?: string;
  regUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subRole?: string;
  tech: string;
  image: string;
  category?: 'LEADERSHIP' | 'TECHNICAL' | 'MANAGEMENT' | 'CREATIVE' | string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  linkedin?: string;
  email?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  readTime: string;
  date: string;
  category: string;
  content?: string;
}

export interface SiteSettings {
  cloudinaryPreset: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    category: 'Hardware' | 'AI/ML' | 'Web' | string;
    tags: string[];
    image?: string;
    links: {
        demo?: string;
        github?: string;
    };
    featured?: boolean;
}

export interface SiteData {
  events: Event[];
  team: TeamMember[];
  projects: Project[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  faculty: FacultyMember[];
  settings: SiteSettings;
}

export const INITIAL_DATA: SiteData = {
  events: [
    {
      id: '1',
      title: "IoT Hackathon 2026",
      date: "MAR 15, 2026",
      time: "09:00 AM - 09:00 PM",
      location: "Tech Hub, Main Campus",
      type: "signal",
      desc: "24-hour hackathon focused on building smart city solutions.",
      category: "COMPETITION",
      status: "registering",
      image: "iot-club/assets/hero",
      regUrl: "https://forms.gle/example1"
    },
    {
      id: '2',
      title: "Drone Racing League",
      date: "APR 02, 2026",
      time: "04:00 PM - 08:00 PM",
      location: "University Stadium",
      type: "signal",
      desc: "High-speed FPV drone racing tournament.",
      category: "SOCIAL",
      status: "upcoming",
      image: "iot-club/assets/hero"
    },
    {
      id: '3',
      title: "Edge AI Workshop",
      date: "APR 20, 2026",
      time: "02:00 PM - 05:00 PM",
      location: "Lab 304, Electronics Dept",
      type: "signal",
      desc: "Hands-on workshop on deploying computer vision models.",
      category: "WORKSHOP",
      status: "upcoming",
      image: "iot-club/assets/hero"
    }
  ],
  team: [
    {
      id: '1',
      name: "Atharv Rao",
      role: "President",
      tech: "IoT Architecture",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Atharv&backgroundColor=b6e3f4",
      category: 'LEADERSHIP'
    },
    {
      id: '2',
      name: "Harshal Patil",
      role: "Vice President",
      tech: "Embedded Systems",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal&backgroundColor=c0aede",
      category: 'LEADERSHIP'
    },
    {
      id: '3',
      name: "Akshata",
      role: "Secretary",
      tech: "Operations Management",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akshata&backgroundColor=ffdfbf",
      category: 'LEADERSHIP'
    },
    {
      id: '4',
      name: "Aditya",
      role: "Co-Secretary",
      tech: "System Design",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya&backgroundColor=d1d4f9",
      category: 'LEADERSHIP'
    },
    {
      id: '5',
      name: "Krishna",
      role: "Web Development Head",
      tech: "Full Stack / Cloud",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Krishna&backgroundColor=b6e3f4",
      category: 'TECHNICAL'
    },
    {
      id: '6',
      name: "Yash Sonje",
      role: "Project Development Head",
      tech: "Hardware Integration",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yash&backgroundColor=c0aede",
      category: 'TECHNICAL'
    },
    {
      id: '7',
      name: "Adiyan Baig",
      role: "Design Head",
      tech: "UI/UX / Product Design",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adiyan&backgroundColor=ffdfbf",
      category: 'CREATIVE'
    },
    {
      id: '8',
      name: "Shiburai",
      role: "Project Design Head",
      tech: "3D Modeling / Prototyping",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shiburai&backgroundColor=d1d4f9",
      category: 'CREATIVE'
    },
    {
      id: '9',
      name: "Vedant",
      role: "Marketing Head",
      subRole: "Co-Head: Datta",
      tech: "Strategic Growth",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vedant&backgroundColor=ffd5dc",
      category: 'MANAGEMENT'
    },
    {
      id: '10',
      name: "Vaishnavi",
      role: "Management Head",
      tech: "Project Coordination",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vaishnavi&backgroundColor=c0aede",
      category: 'MANAGEMENT'
    }
  ],
  projects: [
    {
        id: '1',
        title: "Sentinels: Drone Fleet",
        description: "Autonomous drone swarm capable of coordinated search and rescue operations using local mesh networking.",
        category: "Hardware",
        tags: ["ESP32", "LoRa", "Computer Vision"],
        links: { github: "#", demo: "#" },
        featured: true,
        image: "iot-club/assets/hero"
    },
    {
        id: '2',
        title: "Neuro-Interface",
        description: "Brain-computer interface for controlling IoT devices via EEG signals processing in real-time.",
        category: "AI/ML",
        tags: ["Python", "TensorFlow", "EEG"],
        links: { github: "#" },
        image: "iot-club/assets/hero"
    },
    {
        id: '3',
        title: "GreenGrid Dashboard",
        description: "Full-stack analytics platform for monitoring campus energy consumption and solar efficiency.",
        category: "Web",
        tags: ["React", "Node.js", "D3.js"],
        links: { demo: "#", github: "#" },
        image: "iot-club/assets/hero"
    }
  ],
  gallery: [
    { id: '1', image: 'iot-club/assets/hero', caption: 'Launch Event 2025', category: 'event' },
    { id: '2', image: 'iot-club/assets/hero', caption: 'Workshop on ESP32', category: 'workshop' },
    { id: '3', image: 'iot-club/assets/hero', caption: 'Hackathon Winning Moment', category: 'achievement' },
    { id: '4', image: 'iot-club/assets/hero', caption: 'Lab Setup', category: 'infrastructure' },
    { id: '5', image: 'iot-club/assets/hero', caption: 'Drone Testing', category: 'project' },
    { id: '6', image: 'iot-club/assets/hero', caption: 'IoT Dashboard', category: 'project' },
    { id: '7', image: 'iot-club/assets/hero', caption: 'Team Meeting', category: 'team' },
    { id: '8', image: 'iot-club/assets/hero', caption: 'Annual Showcase', category: 'event' }
  ],
  blogs: [
    {
      id: '1',
      title: "The Future of Embedded Intelligence in Industrial IoT",
      author: "Alex Rivera",
      readTime: "5min",
      date: "Oct 12, 2025",
      category: "Analysis 001",
      content: "As industries move towards more autonomous operations, the role of embedded intelligence becomes paramount. Beyond simple sensor data collection, tomorrow's IoT devices will perform real-time processing at the edge, reducing latency and bandwidth requirements. This shift is driven by advancements in low-power neural networks and specialized AI accelerators integrated directly into microcontrollers.\n\nKey trends include:\n- Federated learning on edge devices\n- Hardware-level security protocols\n- Energy harvesting for self-powered sensors"
    },
    {
      id: '2',
      title: "Securing Edge Devices in a Connected World",
      author: "Sarah Chen",
      readTime: "8min",
      date: "Nov 05, 2025",
      category: "Analysis 002",
      content: "Security is no longer an afterthought in the IoT ecosystem. With billions of connected devices, the attack surface has expanded exponentially. Vulnerabilities in edge nodes can lead to system-wide compromises. We explore the implementation of Trusted Execution Environments (TEEs) and the move towards Zero Trust architecture in industrial networks, where every device must continuously verify its identity and integrity."
    },
    {
      id: '3',
      title: "Optimizing RTOS for Low-Power Wearables",
      author: "David Kim",
      readTime: "6min",
      date: "Dec 15, 2025",
      category: "Analysis 003",
      content: "Wearable technology demands extreme power efficiency without sacrificing responsiveness. Traditional RTOS implementations often carry overhead that is unacceptable for modern health monitoring devices. We discuss techniques for optimizing task scheduling, interrupt handling, and memory management to extend battery life while maintaining reliable performance under strict timing constraints."
    }
  ],
  faculty: [
    {
      id: '1',
      name: "Dr. Sonali Patil",
      role: "Head of Department",
      quote: "Guiding and inspiring the next generation of computing professionals.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sonali&backgroundColor=b6e3f4",
      linkedin: "https://linkedin.com/in/sonali-patil",
      email: "sonali.patil@pccoepune.org"
    },
    {
      id: '2',
      name: "Dr. Smith Khernar",
      role: "Faculty Coordinator",
      quote: "Empowering innovation through technical mentorship.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Smith&backgroundColor=c0aede",
      linkedin: "https://linkedin.com/in/smith-khernar",
      email: "smith.khernar@pccoepune.org"
    }
  ],
  settings: {
    cloudinaryPreset: 'ml_default'
  }
};

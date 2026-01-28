import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

import './index.css';

// Define the types for the data structures to satisfy TypeScript.
interface ProjectImage {
  src: string;
  caption: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
}

const projectData: Project[] = [
  {
    id: 'hype-nation',
    title: 'Hype Nation AU',
    description: 'Hype Nation is a Melbourne-based brand that specializes in car accessories and apparel inspired by Japanese pop culture and car culture. Founded in 2020 by a duo who were passionate about JDM (Japanese Domestic Market) cars, they offer a variety of products, from air fresheners and stickers to keychains and banners.',
    images: [
      { src: 'assets/media/hn/HN_landing_hero.png', caption: "Founder's vision executed" },
      { src: 'assets/media/hn/HN_products.png', caption: 'Much cleaner display of the products' },
      { src: 'assets/media/hn/HN_sale.png', caption: 'Discount pills and savings calculated' },
      { src: 'assets/media/hn/HN_footer.png', caption: 'Footer section to share the vision' }

    ],
  },
  {
    id: 'orbit-coffee',
    title: 'Orbit Coffee AU',
    description: "Orbit Coffee is a business that showcases and sells a curated selection of the season's best coffee beans sourced from various roasters across Melbourne. In addition to the beans, they also offer coffee accessories, including coffee makers, and provide different grind options for their customers",
    images: [
      { src: 'assets/media/orbitcoffee/orbitcoffee_mobile.jpeg', caption: "Get responsive design to work with custom icons and graphical assets designed by the Owner -- Site is no longer live, Orbit Coffee AU now operates explicity via their instagram page." },
      { src: 'assets/media/orbitcoffee/orbitcoffee_insta.png', caption: 'Scaling well on social media, surpassed the 300 followers milestone'},
    ],
  },
  {
    id: 'Coming soon',
    title: 'TO BE ANNOUNCED...',
    description: 'More details coming soon! 😉',
    images: [
      { src: 'https://placehold.co/800x600/000000/FFFFFF/png?text=COMING+SOON', caption: 'Brand inception in motion' },
    ],
  },
];

// Reusable modal component for project details.
const ProjectModal = ({ project, onClose, darkMode }: { project: Project, onClose: () => void, darkMode: boolean }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${darkMode ? 'bg-zinc-900 border border-gray-700' : 'bg-white border border-gray-200'}`}
        onClick={e => e.stopPropagation()} // Prevent click from bubbling up to backdrop
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-3xl font-thin p-2 rounded-full ${darkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-200'}`}
        >
          &times;
        </button>
        <div className="p-8">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${darkMode ? 'text-[#ff6b6b]' : 'text-black'}`}>{project.title}</h2>
          <p className={`text-lg mb-8 ${darkMode ? 'text-white opacity-75' : 'text-black opacity-75'}`}>{project.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {project.images.map((image: ProjectImage, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-full flex items-center justify-center rounded-lg overflow-hidden h-full">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-auto object-contain rounded-lg shadow-md"
                  />
                </div>
                <p className="text-sm italic opacity-75 text-center mt-2">{image.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// The main App component for the portfolio website.
const App = () => {
  // State to manage the theme mode (dark or light).
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const aboutRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    // Correctly type the event object
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      // Use a type guard and ensure the target is a Node before using contains
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle header background and content fade-in on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const offset = headerHeight + 50;

      const aboutTop = aboutRef.current?.offsetTop;
      const workTop = workRef.current?.offsetTop;
      const contactTop = contactRef.current?.offsetTop;
      const totalHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      let currentActive = 'home';

      if (scrollPosition + viewportHeight >= totalHeight - 10) {
        currentActive = 'contact';
      } else if (contactRef.current && contactTop && scrollPosition >= contactTop - offset) {
        currentActive = 'contact';
      } else if (workRef.current && workTop && scrollPosition >= workTop - offset) {
        currentActive = 'work';
      } else if (aboutRef.current && aboutTop && scrollPosition >= aboutTop - offset) {
        currentActive = 'about';
      }

      setActiveSection(currentActive);

      // Fix: Updated the type of 'ref' to include 'null'
      const checkSectionVisibility = (ref: RefObject<HTMLElement | null>, setState: (value: boolean) => void) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setState(rect.top < window.innerHeight / 1.5);
        }
      };

      checkSectionVisibility(aboutRef, setShowAbout);
      checkSectionVisibility(workRef, setShowWork);
      checkSectionVisibility(contactRef, setShowContact);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on initial load to check position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    if (element) {
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      setActiveSection(section);
      setIsMenuOpen(false);
    }
  };

  const handleViewMore = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Google Fonts link for Poppins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* Corrected the crossOrigin attribute from "true" to "anonymous" */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      {/* Main container with gradient background */}
      <div className={`flex flex-col min-h-screen font-sans transition-colors duration-500 ${darkMode ? 'bg-zinc-900 text-white bg-gradient-to-br from-zinc-900 to-black' : 'bg-gray-100 text-black bg-gradient-to-br from-gray-100 to-white'}`}>

        {/* Main Header */}
        <header ref={headerRef} className={`w-full p-4 sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? `${darkMode ? 'bg-black/80 shadow-lg' : 'bg-white/90 shadow-lg'}` : 'bg-transparent'}`}>
          {/* Desktop Header */}
          <div className="hidden md:flex flex-col w-full items-center">
            <h1 className={`text-6xl md:text-8xl font-black leading-tight text-center font-poppins`}>
              MENG LIM
            </h1>
            <div className="flex justify-center items-center w-full max-w-lg mt-4 space-x-8">
              <nav className="flex-grow">
                <ul className="flex flex-row space-x-8 text-xl justify-center font-poppins">
                  {['home', 'about', 'work', 'contact'].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item);
                        }}
                        className={`capitalize font-medium hover:underline underline-offset-4 ${activeSection === item ? 'underline' : ''
                          } ${activeSection === item && darkMode ? 'text-[#ff6b6b]' : ''}`}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <button className="p-2 rounded-full cursor-pointer" onClick={handleThemeToggle}>
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex flex-col w-full items-center md:hidden">
            <h1 className={`text-4xl font-black leading-tight text-center font-poppins`}>
              MENG LIM
            </h1>
            <div className="flex justify-center items-center w-full max-w-sm mt-4 space-x-2">
              <button className="p-2 rounded-full cursor-pointer" onClick={handleThemeToggle}>
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Content (Dropdown) */}
        <div ref={menuRef} className={`md:hidden fixed top-[7rem] left-0 right-0 p-4 z-40 flex flex-col items-center ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } ${darkMode ? 'bg-black/95' : 'bg-white/95'}`}>
          <div className="absolute top-4 right-4">
            <button onClick={() => setIsMenuOpen(false)} className={`p-2 text-5xl font-thin ${darkMode ? 'text-white' : 'text-black'}`}>
              &times;
            </button>
          </div>
          <ul className="flex flex-col space-y-4 text-3xl pt-8">
            {['home', 'about', 'work', 'contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item);
                  }}
                  className={`capitalize font-bold block text-center py-2 rounded-md transition-colors duration-200 ${activeSection === item ? (darkMode ? 'text-[#ff6b6b]' : 'text-[#ff6b6b]') : ''
                    }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Home Section */}
        <section id="home" className="flex flex-col items-center p-8 md:p-24 pt-20 min-h-[70vh]">
          {/* Profile Picture */}
          <div className="my-12">
            <img
              src="assets\media\profile_dp.jpeg"
              alt="Profile Picture"
              className={`rounded-full w-48 h-48 object-cover border-4 border-current mx-auto shadow-xl ${darkMode ? 'shadow-black/50' : 'shadow-gray-400'}`}
            />
          </div>
          {/* Headline Section */}
          <div className="mb-6 md:mb-12 px-4 md:px-0">
            <h2 className={`text-xl sm:text-2xl md:text-4xl font-black opacity-75 text-center font-poppins`}>
              People & Value First | Architect in Progress
            </h2>
            <p className={`text-center font-poppins`}>Driving engineering and architecture decisions to reduce friction and build reusable frameworks that empower teams.</p>
          </div>
        </section>

        {/* Content Sections */}
        <section
          id="about"
          ref={aboutRef}
          className={`px-8 py-8 md:p-24 transition-opacity duration-700 transform ${showAbout ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className={`text-4xl md:text-6xl font-black mb-10 leading-tight text-center ${darkMode ? 'text-[#ff6b6b]' : ''} font-poppins`}>About Me</h2>
          <h3 className={`text-2xl md:text-3xl font-semibold mb-4 leading-tight max-w-4xl mx-auto text-left ${darkMode ? 'text-white opacity-100' : 'text-black opacity-75'} font-poppins`}>My Professional Craft</h3>
          <div className="text-lg md:text-xl max-w-4xl mx-auto text-left font-poppins">
            <p className='mb-10'>You’ll often find me at my desk <u><i>without</i></u> headphones, to me engineering is a team sport. I genuinely enjoy collaborating with stakeholders and diving into the details with my team to build great products. My focus is on solutions that are functional, durable and easy to maintain—designed to <strong>#MakeLifeEasier</strong> for everyone.</p>

          </div>
          <h3 className={`text-2xl md:text-3xl font-semibold mt-8 mb-4 leading-tight max-w-4xl mx-auto text-left ${darkMode ? 'text-white opacity-100' : 'text-black opacity-75'} font-poppins`}>My Personal Passions</h3>
          <div className="text-lg md:text-xl max-w-4xl mx-auto text-left font-poppins">
            <p>I'm a passionate foodie that also loves to cook. I balance that with an active lifestyle that includes hitting the gym and training Judo. When I need to disconnect, you'll find me at a camping ground. These mix of passions has even inspired me to start my own clothing brand, which is my most exciting project right now.</p>
          </div>
        </section>

        <section
          id="work"
          ref={workRef}
          className={`px-8 py-16 md:p-24 transition-opacity duration-700 transform ${showWork ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className={`text-4xl md:text-6xl font-black mb-10 leading-tight text-center ${darkMode ? 'text-[#ff6b6b]' : ''} font-poppins`}>Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Dynamically render project cards from the projectData array */}
            {projectData.map((project) => (
              <div key={project.id} className={`flex flex-col border border-current rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ${darkMode ? 'shadow-black/50 hover:shadow-black/75' : 'shadow-gray-300/50 hover:shadow-gray-400/75'} hover:scale-105`}>
                <div className="h-56"> {/* Set a fixed height for the image container */}
                  <img
                    src={project.images[0].src}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-8 font-poppins flex flex-col flex-grow">
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : ''}`}>{project.title}</h3>
                  <p className="font-sans opacity-75 flex-grow">{project.description}</p>
                  <button
                    onClick={() => handleViewMore(project)}
                    className={`mt-4 px-4 py-2 rounded-lg font-bold transition-colors duration-200 border-2 ${darkMode ? 'border-white text-white hover:bg-zinc-800 hover:text-white' : 'border-black text-black hover:bg-zinc-200 hover:text-black'}`}
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Section for Blog and CV links - now with swapped order and updated colors */}
          <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-6 ${darkMode ? 'text-[#ff6b6b]' : ''}`">
            <a
              href="https://persumi.com/u/menglim/cv"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-zinc-200 text-black hover:bg-zinc-300' : 'bg-zinc-800 text-white hover:bg-zinc-900'}`}
            >
              View My CV
            </a>
            <a
              href="https://persumi.com/u/menglim"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-zinc-200 text-black hover:bg-zinc-300' : 'bg-zinc-800 text-white hover:bg-zinc-900'}`}
            >
              Read My Blog
            </a>
          </div>
        </section>

        <section
          id="contact"
          ref={contactRef}
          className={`px-8 py-16 md:p-24 transition-opacity duration-700 transform ${showContact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className={`text-4xl md:text-6xl font-black mb-10 leading-tight text-center ${darkMode ? 'text-[#ff6b6b]' : ''} font-poppins`}>Contact</h2>
          <p className="text-lg md:text-xl max-w-2xl mb-6 mx-auto text-center font-poppins">
            You can connect with me on LinkedIn. I'm currently open to new opportunities.
          </p>
          <div className="flex space-x-4 justify-center">
            <a
              href="https://www.linkedin.com/in/limmeng/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`p-3 rounded-full border-2 border-current hover:scale-110 ${darkMode ? 'bg-black text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
            >
              <svg viewBox="0 0 504.4 504.4" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
                <g>
                  <g>
                    <path d="M377.6,0.2H126.4C56.8,0.2,0,57,0,126.6v251.6c0,69.2,56.8,126,126.4,126H378c69.6,0,126.4-56.8,126.4-126.4V126.6 C504,57,447.2,0.2,377.6,0.2z M168,408.2H96v-208h72V408.2z M131.6,168.2c-20.4,0-36.8-16.4-36.8-36.8c0-20.4,16.4-36.8,36.8-36.8 c20.4,0,36.8,16.4,36.8,36.8C168,151.8,151.6,168.2,131.6,168.2z M408.4,408.2H408h-60V307.4c0-24.4-3.2-55.6-36.4-55.6 c-34,0-39.6,26.4-39.6,54v102.4h-60v-208h56v28h1.6c8.8-16,29.2-28.4,61.2-28.4c66,0,77.6,38,77.6,94.4V408.2z"></path>
                  </g>
                </g>
              </svg>
            </a>
            <a
              href="https://github.com/mengopudding"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`p-3 rounded-full border-2 border-current hover:scale-110 ${darkMode ? 'bg-black text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
            >
              <svg viewBox="0 0 73 73" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
                <g id="SVGRepo_iconCarrier">
                  <title>team-collaboration/version-control/github</title>
                  <desc>Created with Sketch.</desc>
                  <defs> </defs>
                  <g id="team-collaboration/version-control/github" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="container" transform="translate(2.000000, 2.000000)" fillRule="nonzero">
                      <rect id="mask" stroke="#000000" strokeWidth="2" fill="#000000" x="-1" y="-1" width="71" height="71" rx="14"></rect>
                      <path d="M58.3067362,21.4281798 C55.895743,17.2972267 52.6253846,14.0267453 48.4948004,11.615998 C44.3636013,9.20512774 39.8535636,8 34.9614901,8 C30.0700314,8 25.5585181,9.20549662 21.4281798,11.615998 C17.2972267,14.0266224 14.0269912,17.2972267 11.615998,21.4281798 C9.20537366,25.5590099 8,30.0699084 8,34.9607523 C8,40.8357654 9.71405782,46.1187277 13.1430342,50.8109917 C16.5716416,55.5036246 21.0008949,58.7507436 26.4304251,60.5527176 C27.0624378,60.6700211 27.5302994,60.5875152 27.8345016,60.3072901 C28.1388268,60.0266961 28.290805,59.6752774 28.290805,59.2545094 C28.290805,59.1842994 28.2847799,58.5526556 28.2730988,57.3588401 C28.2610487,56.1650247 28.2553926,55.1235563 28.2553926,54.2349267 L27.4479164,54.3746089 C26.9330843,54.468919 26.2836113,54.5088809 25.4994975,54.4975686 C24.7157525,54.4866252 23.9021284,54.4044881 23.0597317,54.2517722 C22.2169661,54.1004088 21.4330982,53.749359 20.7075131,53.1993604 C19.982297,52.6493618 19.4674649,51.9294329 19.1631397,51.0406804 L18.8120898,50.2328353 C18.5780976,49.6950097 18.2097104,49.0975487 17.7064365,48.4426655 C17.2031625,47.7871675 16.6942324,47.3427912 16.1794003,47.108799 L15.9336039,46.9328437 C15.7698216,46.815909 15.6178435,46.6748743 15.4773006,46.511215 C15.3368806,46.3475556 15.2317501,46.1837734 15.1615401,46.0197452 C15.0912072,45.855594 15.1494901,45.7209532 15.3370036,45.6153308 C15.5245171,45.5097084 15.8633939,45.4584343 16.3551097,45.4584343 L17.0569635,45.5633189 C17.5250709,45.6571371 18.104088,45.9373622 18.7947525,46.4057156 C19.4850481,46.8737001 20.052507,47.4821045 20.4972521,48.230683 C21.0358155,49.1905062 21.6846737,49.9218703 22.4456711,50.4251443 C23.2060537,50.9284182 23.9727072,51.1796248 24.744894,51.1796248 C25.5170807,51.1796248 26.1840139,51.121096 26.7459396,51.0046532 C27.3072505,50.8875956 27.8338868,50.7116403 28.3256025,50.477771 C28.5362325,48.9090515 29.1097164,47.7039238 30.0455624,46.8615271 C28.7116959,46.721353 27.5124702,46.5102313 26.4472706,46.2295144 C25.3826858,45.9484285 24.2825656,45.4922482 23.1476478,44.8597436 C22.0121153,44.2280998 21.0701212,43.44374 20.3214198,42.5080169 C19.5725954,41.571802 18.9580429,40.3426971 18.4786232,38.821809 C17.9989575,37.300306 17.7590632,35.5451796 17.7590632,33.5559381 C17.7590632,30.7235621 18.6837199,28.3133066 20.5326645,26.3238191 C19.6665366,24.1944035 19.7483048,21.8072644 20.778215,19.1626478 C21.4569523,18.951772 22.4635002,19.1100211 23.7973667,19.6364115 C25.1314792,20.1630477 26.1082708,20.6141868 26.7287253,20.9882301 C27.3491798,21.3621504 27.8463057,21.6790175 28.2208409,21.9360032 C30.3978419,21.3277217 32.644438,21.0235195 34.9612442,21.0235195 C37.2780503,21.0235195 39.5251383,21.3277217 41.7022622,21.9360032 L43.0362517,21.0938524 C43.9484895,20.5319267 45.0257392,20.0169716 46.2654186,19.5488642 C47.5058357,19.0810026 48.4543466,18.9521409 49.1099676,19.1630167 C50.1627483,21.8077563 50.2565666,24.1947724 49.3901927,26.324188 C51.2390143,28.3136755 52.1640399,30.7245457 52.1640399,33.556307 C52.1640399,35.5455485 51.9232849,37.3062081 51.444357,38.8393922 C50.9648143,40.3728223 50.3449746,41.6006975 49.5845919,42.5256002 C48.8233486,43.4503799 47.8753296,44.2285916 46.7404118,44.8601125 C45.6052481,45.4921252 44.504759,45.9483056 43.4401742,46.2293914 C42.3750975,46.5104772 41.1758719,46.7217219 39.8420054,46.8621419 C41.0585683,47.9149226 41.6669728,49.5767225 41.6669728,51.846804 L41.6669728,59.2535257 C41.6669728,59.6742937 41.8132948,60.0255895 42.1061847,60.3063064 C42.3987058,60.5865315 42.8606653,60.6690374 43.492678,60.5516109 C48.922946,58.7498829 53.3521992,55.5026409 56.7806837,50.810008 C60.2087994,46.117744 61.923472,40.8347817 61.923472,34.9597686 C61.9222424,30.0695396 60.7162539,25.5590099 58.3067362,21.4281798 Z" id="Shape" fill="#FFFFFF"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className={`w-full p-4 mt-auto text-center ${darkMode ? 'bg-black/80' : 'bg-white/80'}`}>
          <p className="text-sm font-poppins">
            © {new Date().getFullYear()} Meng Lim. All rights reserved.
          </p>
        </footer>

        {/* Project Modal */}
        {isModalOpen && (
          <ProjectModal
            project={selectedProject as Project} // Cast as Project to satisfy TypeScript
            onClose={() => setIsModalOpen(false)}
            darkMode={darkMode}
          />
        )}
      </div>
    </>
  );
};

export default App;

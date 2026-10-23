import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './Auth';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  FileSearch,
  FileText,
  GraduationCap,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  X,
  Zap
} from 'lucide-react';

import Results from './Results';
import CareerRecommendations from './CareerRecommendations';

const features = [
  {
    icon: FileSearch,
    n: '01',
    title: 'Resume insights',
    text: 'Understand your resume strengths and discover practical ways to improve it.'
  },
  {
    icon: Target,
    n: '02',
    title: 'Skill gap analysis',
    text: 'Compare your current skills with the skills expected for your target role.'
  },
  {
    icon: BriefcaseBusiness,
    n: '03',
    title: 'Career suggestions',
    text: 'Explore job roles that may fit your skills, education, and interests.'
  }
];

const steps = [
  ['Upload your resume', 'Add your resume as a PDF file.'],
  ['Review your insights', 'See extracted skills and improvement areas.'],
  ['Plan your next move', 'Explore roles and skills to learn next.']
];

export default function App() {
  const uploadRef = useRef(null);
  const inputRef = useRef(null);

  const [page, setPage] = useState('home');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState('Not sure yet');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);
  });

  return unsubscribe;
}, []);

const handleLogout = async () => {
  try {
    await signOut(auth);
    setPage('home');
    setSelectedFile(null);
    setAnalysisData(null);
    setError('');
    setNotice('');
  } catch (err) {
    setError('Logout failed. Please try again.');
    console.error(err);
  }
};
if (authLoading) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      Loading CareerLens...
    </div>
  );
}

if (!user) {
  return (
    <Auth onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
  );
}

  const scrollUpload = () => {
    setMenuOpen(false);

    if (page !== 'home') {
      setPage('home');

      setTimeout(() => {
        uploadRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);

      return;
    }

    uploadRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const chooseFile = (file) => {
    setError('');
    setNotice('');

    if (!file) return;

    if (
      file.type !== 'application/pdf' &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      setSelectedFile(null);
      setAnalysisData(null);
      setError('Please choose a PDF file. Other file types are not supported yet.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setAnalysisData(null);
      setError('Your PDF is larger than 10 MB. Please choose a smaller file.');
      return;
    }

    setSelectedFile(file);
    setAnalysisData(null);
  };

  // Send the resume to the Flask backend for analysis
  const analyze = async () => {
    if (!selectedFile) {
      setError('Choose your resume PDF first, then continue.');
      setNotice('');
      return;
    }

    setError('');
    setNotice('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('role', role);

      const response = await fetch(
        'http://127.0.0.1:5000/analyze',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Resume analysis failed.');
      }

      setAnalysisData(data);
      setPage('results');

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (err) {
      console.error('Resume analysis error:', err);

      if (err.message === 'Failed to fetch') {
        setError(
          'Cannot connect to the backend. Make sure Flask is running on port 5000.'
        );
      } else {
        setError(
          err.message || 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Results page
  if (page === 'results') {
    return (
      <Results
        file={selectedFile}
        role={role}
        analysisData={analysisData}
        onBack={() => {
          setPage('home');

          setTimeout(() => {
            uploadRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 100);
        }}
        onRecommendations={() => {
          setPage('recommendations');

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
      />
    );
  }

  // Career recommendations page
  if (page === 'recommendations') {
    return (
      <CareerRecommendations
        role={role}
        analysisData={analysisData}
        onBack={() => {
          setPage('results');

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
        onHome={() => {
          setPage('home');
          setSelectedFile(null);
          setAnalysisData(null);
          setError('');
          setNotice('');

          setTimeout(() => {
            uploadRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 100);
        }}
      />
    );
  }

  // Home page
  return (
    <div className="app">
      <div className="announcement">
        <Sparkles size={14} />
        Your next career move starts with a stronger resume.
        <ArrowUpRight size={14} />
      </div>

      <header className="header">
        <a className="brand" href="#home">
          <span className="brand-mark">
            <BrainCircuit size={22} />
          </span>
          <span>
            Career<span className="accent">Lens</span>
          </span>
        </a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>

          <a href="#how" onClick={() => setMenuOpen(false)}>
            How it works
          </a>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <button className="button dark small" onClick={scrollUpload}>
            Analyze my resume <ArrowRight size={15} />
          </button>
          <button
  className="button dark small"
  onClick={handleLogout}
>
  Logout
</button>
        </nav>
      </header>

      <main id="home">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <i /> YOUR CAREER, WITH MORE CLARITY
            </div>

            <h1>
              Your experience.
              <br />
              Your potential.
              <br />
              <span className="gradient">Your next move.</span>
            </h1>

            <p className="hero-description">
              Turn your resume into a clearer career plan. Discover your skills,
              spot opportunities to improve, and explore roles that fit your goals.
            </p>

            <div className="hero-actions">
              <button className="button primary" onClick={scrollUpload}>
                Analyze my resume <ArrowRight size={17} />
              </button>

              <a className="text-link" href="#how">
                See how it works ↓
              </a>
            </div>

            <div className="trust">
              <span>
                <ShieldCheck size={16} /> Privacy-minded design
              </span>

              <span>
                <FileText size={16} /> PDF resume support
              </span>
            </div>
          </div>

          <div className="visual">
            <div className="orb orb1"></div>
            <div className="orb orb2"></div>

            <div className="float-tag tag1">
              <Sparkles size={15} /> Career insights
            </div>

            <div className="resume-card">
              <div className="resume-head">
                <div className="doc-icon">
                  <FileText size={23} />
                </div>

                <div>
                  <div className="fake-line dark-line"></div>
                  <div className="fake-line short-line"></div>
                </div>

                <span className="pdf-pill">PDF</span>
              </div>

              <div className="rule"></div>
              <div className="mini-heading">SKILLS OVERVIEW</div>

              {['Communication', 'Problem solving', 'Technical skills'].map(
                (skill, index) => (
                  <div className="skill" key={skill}>
                    <span>{skill}</span>

                    <div className="track">
                      <i
                        style={{
                          width: ['86%', '72%', '64%'][index]
                        }}
                      />
                    </div>
                  </div>
                )
              )}

              <div className="rule"></div>

              <div className="insight">
                <span className="zap">
                  <Zap size={17} />
                </span>

                <div>
                  <b>Your next step</b>
                  <small>Identify skills for your target role</small>
                </div>

                <ArrowUpRight className="insight-arrow" size={17} />
              </div>
            </div>

            <div className="float-tag tag2">
              <Check size={16} /> A plan built around you
            </div>

            <div className="visual-caption">
              A clearer picture of where you can go next.
            </div>
          </div>
        </section>

        <section className="stats wrap">
          <div>
            <b>01</b>
            <span>Upload your resume</span>
          </div>

          <div>
            <b>02</b>
            <span>Understand your skills</span>
          </div>

          <div>
            <b>03</b>
            <span>Explore your next step</span>
          </div>
        </section>

        <section className="features wrap" id="features">
          <div className="section-heading">
            <div className="eyebrow">BUILT FOR YOUR NEXT CHAPTER</div>
            <h2>More than a resume check.</h2>

            <p>
              A practical starting point for making your next career decision
              with confidence.
            </p>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, n, title, text }) => (
              <article className="feature-card" key={title}>
                <div className="feature-top">
                  <span className="feature-icon">
                    <Icon size={22} />
                  </span>

                  <span className="number">{n}</span>
                </div>

                <h3>{title}</h3>
                <p>{text}</p>

                <a
                  href="#upload"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollUpload();
                  }}
                  className="feature-link"
                >
                  Explore feature <ArrowUpRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="how" id="how">
          <div className="wrap how-inner">
            <div className="section-heading left">
              <div className="eyebrow">A SIMPLE THREE-STEP FLOW</div>
              <h2>From resume to next steps.</h2>
              <p>No complicated process. Start with what you already have.</p>
            </div>

            <div className="steps">
              {steps.map(([title, text], index) => (
                <article key={title}>
                  <span>{`0${index + 1}`}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="upload wrap" id="upload" ref={uploadRef}>
          <div className="upload-copy">
            <div className="eyebrow">
              <i /> START HERE
            </div>

            <h2>Ready to take a closer look?</h2>

            <p>
              Upload your resume PDF to extract skills, check your resume score,
              and identify skills to improve for your selected career role.
            </p>

            <ul>
              <li>
                <Check size={17} /> PDF files up to 10 MB
              </li>

              <li>
                <Check size={17} /> Choose a career direction
              </li>

              <li>
                <Check size={17} /> Analysis using your project backend
              </li>
            </ul>
          </div>

          <div className="upload-panel">
            <div className="panel-title">
              <div>
                <h3>Upload your resume</h3>
                <p>PDF format · Maximum 10 MB</p>
              </div>

              <span className="panel-icon">
                <UploadCloud size={22} />
              </span>
            </div>

            <input
              ref={inputRef}
              className="hidden"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />

            <button
              className="dropzone"
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                chooseFile(event.dataTransfer.files?.[0]);
              }}
            >
              <span className="drop-icon">
                <UploadCloud size={25} />
              </span>

              <b>
                {selectedFile
                  ? selectedFile.name
                  : 'Click to choose a PDF'}
              </b>

              <span>
                {selectedFile
                  ? `${(selectedFile.size / 1048576).toFixed(2)} MB · Ready to continue`
                  : 'or drag and drop your file here'}
              </span>

              <em>
                {selectedFile
                  ? 'Choose a different file'
                  : 'Browse files'}
              </em>
            </button>

            {error && (
              <p className="message error" role="alert">
                {error}
              </p>
            )}

            {notice && (
              <p className="message success" role="status">
                {notice}
              </p>
            )}

            <label className="select-label" htmlFor="role">
              What role are you interested in?
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {[
                'Not sure yet',
                'Data Analyst',
                'Frontend Developer',
                'Backend Developer',
                'Full Stack Developer',
                'Software Developer',
                'UI/UX Designer',
                'Digital Marketer'
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              className="button primary full"
              onClick={analyze}
              disabled={loading}
            >
              {loading ? 'Analyzing resume...' : 'Continue'}
              {!loading && <ArrowRight size={17} />}
            </button>

            <p className="privacy">
              <ShieldCheck size={14} />
              Your resume is sent to your local backend for analysis.
            </p>
          </div>
        </section>

        <section className="closing wrap" id="about">
          <div className="grad-icon">
            <GraduationCap size={25} />
          </div>

          <div>
            <h2>Your career journey is still being written.</h2>
            <p>
              Use your skills as a starting point, and your next step as a plan.
            </p>
          </div>

          <button className="button dark" onClick={scrollUpload}>
            Get started <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <footer className="footer wrap">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">
            <BrainCircuit size={20} />
          </span>

          <span>
            Career<span className="accent">Lens</span>
          </span>
        </a>

        <p>AI-Powered Resume Analyzer &amp; Career Recommendation System</p>
        <small>Student project · Built for learning and career guidance</small>
      </footer>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BadgeCheck, Clipboard, Download, Link2, LockKeyhole, Mail, MessageCircle, Send, Sparkles, Smartphone } from 'lucide-react';
import {
  fetchCurrentUser,
  fetchDownloadQuota,
  fetchVideoInfo,
  loginUser,
  registerUser,
  requestDownload,
  updateProfile
} from './api/mediaApi.js';
import AuthModal from './components/AuthModal.jsx';
import DownloadCard from './components/DownloadCard.jsx';
import FeatureStrip from './components/FeatureStrip.jsx';
import Header from './components/Header.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import UrlForm from './components/UrlForm.jsx';

const SUPPORTED_PLATFORMS = [
  {
    label: 'Video',
    hosts: [],
    acceptsAnyVideo: true,
  },
  {
    label: 'Instagram Reels',
    hosts: ['instagram.com', 'www.instagram.com', 'm.instagram.com'],
  },
  {
    label: 'Facebook',
    hosts: ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch', 'web.facebook.com'],
  },
  {
    label: 'TikTok',
    hosts: ['tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'],
  },
  {
    label: 'Twitter/X',
    hosts: ['twitter.com', 'www.twitter.com', 'mobile.twitter.com', 'x.com', 'www.x.com'],
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9]\d{9,14}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const supportEmail = 'mediazy.xyz@gmail.com';
const savedTheme = () => {
  try {
    return window.localStorage.getItem('mediazy_theme') || 'dark';
  } catch {
    return 'dark';
  }
};

function refreshGuestAds() {
  window.MediazyAds?.refresh?.();
}

function isUrlForPlatform(value, platform) {
  try {
    const { hostname } = new URL(value);
    const cleanHost = hostname.toLowerCase().replace(/^www\./, '');

    if (platform.acceptsAnyVideo) {
      return !SUPPORTED_PLATFORMS
        .filter((item) => !item.acceptsAnyVideo)
        .some((item) => item.hosts.some((host) => {
          const cleanPlatformHost = host.replace(/^www\./, '');
          return cleanHost === cleanPlatformHost || cleanHost.endsWith(`.${cleanPlatformHost}`);
        }));
    }

    return platform.hosts.some((host) => {
      const cleanPlatformHost = host.replace(/^www\./, '');
      return cleanHost === cleanPlatformHost || cleanHost.endsWith(`.${cleanPlatformHost}`);
    });
  } catch {
    return false;
  }
}

function HowToUsePage({ user, quota, onStart }) {
  const steps = [
    {
      icon: Link2,
      title: 'Pick the platform',
      copy: 'Choose Video, Instagram Reels, Facebook, TikTok, or Twitter/X before pasting your link.'
    },
    {
      icon: Clipboard,
      title: 'Paste and preview',
      copy: 'Paste a public media URL, then load the preview so you can confirm the title and thumbnail.'
    },
    {
      icon: Download,
      title: 'Choose and download',
      copy: 'Select MP4, MP3, subtitles, or thumbnail, then save the prepared file to your device.'
    }
  ];

  return (
    <section className="grid gap-5">
      <div className="min-w-0">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold text-slate-300">
          <Sparkles size={16} className="text-brand" />
          Quick start
        </p>
        <h1 className="max-w-3xl break-words text-[2.25rem] font-black leading-none text-white sm:text-5xl">
          How to use Mediazy
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-8">
          Load a supported link, choose the output you need, and save the file when it is ready.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, copy }) => (
          <article className="glass min-w-0 rounded-2xl p-4" key={title}>
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand/15 text-brand">
              <Icon size={20} />
            </div>
            <h2 className="text-lg font-black text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
          </article>
        ))}
      </div>

      <div className="glass grid gap-3 rounded-2xl p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <p className="text-base font-black text-white">
            {user ? 'Your daily download counter is active.' : 'Guest downloads are available before login.'}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {quota
              ? `${quota.available} of ${quota.limit} downloads remaining.`
              : 'Your remaining downloads will appear once quota loads.'}
          </p>
        </div>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-ink transition hover:bg-emerald-300"
          type="button"
          onClick={onStart}
        >
          <Download size={18} />
          Start download
        </button>
      </div>
    </section>
  );
}

function ContactPage({ onStart }) {
  return (
    <section className="grid gap-5">
      <div className="min-w-0">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold text-slate-300">
          <MessageCircle size={16} className="text-brand" />
          Support
        </p>
        <h1 className="max-w-3xl break-words text-[2.25rem] font-black leading-none text-white sm:text-5xl">
          Contact us
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-8">
          Send the video link, platform name, and the error message you saw so support can help faster.
        </p>
      </div>

      <div className="glass grid gap-4 rounded-2xl p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand/15 text-brand">
            <Mail size={20} />
          </div>
          <h2 className="break-words text-xl font-black text-white">{supportEmail}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            For download issues, include whether you wanted video, audio, subtitles, or thumbnail.
          </p>
        </div>
        <a
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-ink transition hover:bg-emerald-300"
          href={`mailto:${supportEmail}?subject=Mediazy support request`}
        >
          <Send size={18} />
          Email support
        </a>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <p className="font-bold text-white">Download not loading</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Try a public link, choose Best available quality, and check that the selected platform matches the URL.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <p className="font-bold text-white">Need to try another link</p>
          <button
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-slate-200 transition hover:border-brand/70 hover:text-white"
            type="button"
            onClick={onStart}
          >
            <Download size={16} />
            Go to downloader
          </button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [quality, setQuality] = useState('best');
  const [type, setType] = useState('video');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(SUPPORTED_PLATFORMS[0]);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [quota, setQuota] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(savedTheme);

  const isSelectedPlatformUrl = useMemo(
    () => (value) => isUrlForPlatform(value, selectedPlatform),
    [selectedPlatform],
  );

  const showPlatformError = () => {
    toast.error(`Please paste a ${selectedPlatform.label} link.`);
  };

  const showPasteUnavailable = () => {
    toast.error('Browser blocked clipboard access. Paste with Ctrl+V in the link box.');
  };

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const loadQuota = async () => {
    const { quota: currentQuota } = await fetchDownloadQuota();
    setQuota(currentQuota);
  };

  useEffect(() => {
    if (!downloading) return undefined;

    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 92 ? current : current + Math.ceil(Math.random() * 8)));
    }, 700);

    return () => window.clearInterval(timer);
  }, [downloading]);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem('mediazy_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    const loadSession = async () => {
      if (!window.localStorage.getItem('mediazy_token')) {
        const { quota: currentQuota } = await fetchDownloadQuota();
        if (mounted) setQuota(currentQuota);
        return;
      }

      try {
        const { user: currentUser } = await fetchCurrentUser();
        const { quota: currentQuota } = await fetchDownloadQuota();
        if (!mounted) return;
        setUser(currentUser);
        setQuota(currentQuota);
      } catch {
        window.localStorage.removeItem('mediazy_token');
        if (!mounted) return;
        setUser(null);
        await loadQuota().catch(() => setQuota(null));
        refreshGuestAds();
      }
    };

    loadSession().catch(() => {
      if (mounted) setQuota(null);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!url.trim()) {
      toast.error('Paste a video link first.');
      return;
    }

    if (!isSelectedPlatformUrl(url.trim())) {
      showPlatformError();
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await fetchVideoInfo(url.trim());
      setInfo(data);
      setQuality('best');
      toast.success('Video details loaded.');
    } catch (error) {
      setInfo(null);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!info) return;

    setDownloading(true);
    setResult(null);
    setProgress(8);

    try {
      const data = await requestDownload({ url: info.url, type, quality });
      setProgress(100);
      setResult(data);
      if (data.quota) {
        setQuota(data.quota);
      }
      toast.success('Your file is ready.');
    } catch (error) {
      if (/log in|login|required/i.test(error.message)) {
        setAuthMode('login');
        setAuthOpen(true);
      }
      toast.error(error.message);
    } finally {
      window.setTimeout(() => {
        setDownloading(false);
        setProgress(0);
      }, 600);
    }
  };

  const handleAuthSubmit = async (form) => {
    const name = form.name.trim();
    const identifier = form.email.trim().toLowerCase();
    const email = identifier;
    const phone = form.phone.trim().replace(/[\s()-]/g, '');
    const loginPhone = identifier.replace(/[\s()-]/g, '');
    const password = form.password;

    if (!password) {
      toast.error('Enter your password.');
      return;
    }

    if (authMode === 'signup') {
      if (!emailPattern.test(email)) {
        toast.error('Enter a valid email address.');
        return;
      }

      if (name.length < 2 || name.length > 80) {
        toast.error('Name must be between 2 and 80 characters.');
        return;
      }

      if (!phonePattern.test(phone)) {
        toast.error('Enter a valid phone number with 10 to 15 digits.');
        return;
      }

      if (!passwordPattern.test(password)) {
        toast.error('Password must be at least 8 characters and include a letter and a number.');
        return;
      }
    } else if (!emailPattern.test(identifier) && !phonePattern.test(loginPhone)) {
      toast.error('Enter a valid email or phone number.');
      return;
    }

    setAuthLoading(true);

    try {
      const data = authMode === 'signup'
        ? await registerUser({ name, email, phone, password })
        : await loginUser({ identifier, password });

      window.localStorage.setItem('mediazy_token', data.token);
      refreshGuestAds();
      setUser(data.user);
      setAuthOpen(false);
      await loadQuota();
      toast.success(authMode === 'signup' ? 'Account created.' : 'Logged in.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('mediazy_token');
    setUser(null);
    setQuota(null);
    setResult(null);
    refreshGuestAds();
    loadQuota().catch(() => {});
    toast.success('Logged out.');
  };

  const handleProfileSubmit = async (form) => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const currentPassword = form.currentPassword;
    const newPassword = form.newPassword;

    if (name.length < 2 || name.length > 80) {
      toast.error('Name must be between 2 and 80 characters.');
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error('Enter a valid email address.');
      return;
    }

    if ((email !== user.email || newPassword) && !currentPassword) {
      toast.error('Enter your current password to change email or password.');
      return;
    }

    if (newPassword && !passwordPattern.test(newPassword)) {
      toast.error('New password must be at least 8 characters and include a letter and a number.');
      return;
    }

    setProfileLoading(true);

    try {
      const data = await updateProfile({ name, email, currentPassword, newPassword });
      window.localStorage.setItem('mediazy_token', data.token);
      refreshGuestAds();
      setUser(data.user);
      setProfileOpen(false);
      toast.success('Profile updated. Notification sent to your email.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100">
      <Header
        user={user}
        quota={quota}
        activePage={activePage}
        theme={theme}
        onNavigate={navigateTo}
        onThemeToggle={toggleTheme}
        onAuthClick={() => {
          setAuthMode('login');
          setAuthOpen(true);
        }}
        onLogout={handleLogout}
        onProfileClick={() => setProfileOpen(true)}
      />

      <main className="mx-auto grid w-full max-w-6xl min-w-0 gap-4 px-3 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-6 md:gap-8 md:pb-12 md:pt-12">
        {activePage === 'how-to-use' && (
          <HowToUsePage user={user} quota={quota} onStart={() => navigateTo('home')} />
        )}

        {activePage === 'contact' && (
          <ContactPage onStart={() => navigateTo('home')} />
        )}

        {activePage === 'home' && (
        <>
        <section className="grid min-w-0 gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="min-w-0">
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold text-slate-300 sm:mb-4 sm:px-4 sm:text-sm">
              <Sparkles size={16} className="text-brand" />
              <span className="truncate">All-in-one video downloader</span>
            </div>
            <h1 className="max-w-3xl break-words text-[2.35rem] font-black leading-[0.98] text-white min-[390px]:text-[2.8rem] sm:text-5xl md:text-6xl">
              Mediazy downloads videos without the clutter.
            </h1>
            <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-slate-300 sm:mt-4 sm:text-lg sm:leading-8">
              Paste a link, preview the media, choose MP4, MP3, subtitles, or thumbnail, and get a temporary clean download.
            </p>
            {!user && quota && quota.used >= 8 && (
              <div className="mt-4 max-w-2xl rounded-xl border border-brand/30 bg-brand/10 p-3 text-sm font-semibold leading-6 text-slate-100">
                You have {quota.available} guest downloads left. Login to keep downloading and remove ads.
              </div>
            )}
            <div className="-mx-3 mt-4 flex min-w-0 gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:mt-6 sm:flex-wrap sm:overflow-visible sm:px-0">
              {SUPPORTED_PLATFORMS.map((platform) => (
                <button
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm transition sm:shrink sm:py-1 ${
                    selectedPlatform.label === platform.label
                      ? 'border-brand/70 bg-brand/15 text-white'
                      : 'border-white/10 bg-white/8 text-slate-300 hover:border-brand/50 hover:text-white'
                  }`}
                  key={platform.label}
                  type="button"
                  onClick={() => {
                    setSelectedPlatform(platform);
                    setUrl('');
                    setInfo(null);
                    setResult(null);
                  }}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass grid min-w-0 gap-2 rounded-2xl p-3 sm:gap-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/10 bg-white/8 p-3 sm:p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand sm:h-10 sm:w-10">
                <LockKeyhole size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white sm:text-base">10 guest downloads</p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  {user || !quota
                    ? 'Try downloads without an account. After 10 files, login is required.'
                    : `${quota.available} of ${quota.limit} guest downloads left before login is required.`}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/10 bg-white/8 p-3 sm:p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand sm:h-10 sm:w-10">
                <BadgeCheck size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white sm:text-base">Choose a link type first</p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  Video accepts regular video links, while social apps use their own buttons.
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/10 bg-white/8 p-3 sm:p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand sm:h-10 sm:w-10">
                <Smartphone size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white sm:text-base">Save to your device</p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  Once prepared, the browser downloads the file to your device.
                </p>
              </div>
            </div>
          </div>
        </section>

        <UrlForm
          url={url}
          setUrl={setUrl}
          onSubmit={handleAnalyze}
          loading={loading}
          selectedPlatform={selectedPlatform}
          isPlatformUrl={isSelectedPlatformUrl}
          onInvalidPlatformUrl={showPlatformError}
          onPasteUnavailable={showPasteUnavailable}
        />

        <DownloadCard
          info={info}
          quality={quality}
          setQuality={setQuality}
          type={type}
          setType={setType}
          onDownload={handleDownload}
          downloading={downloading}
          progress={progress}
          result={result}
        />

        <FeatureStrip />
        </>
        )}
      </main>

      <AuthModal
        open={authOpen}
        mode={authMode}
        setMode={setAuthMode}
        loading={authLoading}
        onClose={() => setAuthOpen(false)}
        onSubmit={handleAuthSubmit}
      />
      <ProfileModal
        open={profileOpen}
        user={user}
        loading={profileLoading}
        onClose={() => setProfileOpen(false)}
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
}

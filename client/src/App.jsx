import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AtSign, BadgeCheck, CheckCircle2, Clipboard, Download, Images, Link2, LockKeyhole, Mail, MessageCircle, Send, Sparkles, Smartphone, X, XCircle } from 'lucide-react';
import {
  fetchCurrentUser,
  fetchDownloadQuota,
  fetchInstagramProfileMedia,
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
    label: 'YouTube',
    hosts: ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'],
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
const instagramUsernamePattern = /^[A-Za-z0-9._]{1,30}$/;
const supportEmail = 'mediazy.xyz@gmail.com';

function normalizeInstagramUsernameInput(value) {
  const input = value.trim().replace(/^@+/, '');

  try {
    const parsed = new URL(input.includes('://') ? input : `https://${input}`);
    const host = parsed.hostname.replace(/^www\./i, '');

    if (host === 'instagram.com') {
      const [firstPathPart, secondPathPart] = parsed.pathname.split('/').filter(Boolean);
      return firstPathPart?.toLowerCase() === 'stories' ? secondPathPart || '' : firstPathPart || '';
    }
  } catch {
    return input;
  }

  return input;
}

function refreshGuestAds() {
  window.MediazyAds?.refresh?.();
}

function detectPlatform(value) {
  try {
    const { hostname } = new URL(value);
    const cleanHost = hostname.toLowerCase().replace(/^www\./, '');

    return SUPPORTED_PLATFORMS.find((platform) => (
      !platform.acceptsAnyVideo &&
      platform.hosts.some((host) => {
        const cleanPlatformHost = host.replace(/^www\./, '');
        return cleanHost === cleanPlatformHost || cleanHost.endsWith(`.${cleanPlatformHost}`);
      })
    )) || SUPPORTED_PLATFORMS[0];
  } catch {
    return null;
  }
}

function NotificationToast({ id, type, title, message }) {
  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div className={`mediazy-toast mediazy-toast--${type}`}>
      <div className="mediazy-toast__icon">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="mediazy-toast__title">{title}</p>
        {message && <p className="mediazy-toast__message">{message}</p>}
      </div>
      <button className="mediazy-toast__close" type="button" onClick={() => toast.dismiss(id)} aria-label="Dismiss notification">
        <X size={15} />
      </button>
    </div>
  );
}

const notify = ({ type = 'success', title, message, id }) => {
  toast.custom(
    (currentToast) => (
      <NotificationToast
        id={currentToast.id}
        type={type}
        title={title}
        message={message}
      />
    ),
    { id, duration: type === 'error' ? 5600 : 3800 }
  );
};

const notifySuccess = (title, message, id) => notify({ type: 'success', title, message, id });
const notifyError = (title, message, id) => notify({ type: 'error', title, message, id });

function HowToUsePage({ user, quota, onStart }) {
  const steps = [
    {
      icon: Link2,
      title: 'Pick the platform',
      copy: 'Paste a link and Mediazy detects whether it is Video, YouTube, Instagram Reels, Facebook, TikTok, or Twitter/X.'
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
            Unlimited downloads are available.
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Paste, preview, choose your format, and download as many files as you need.
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

function InstagramStoriesPage({
  storyUsername,
  setStoryUsername,
  onAnalyze,
  loading,
  storyCard,
  storyError,
  reelsCard,
  profileCard,
  reelsError,
  profileError
}) {
  return (
    <section className="grid gap-5">
      <div className="min-w-0">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold text-slate-300">
          <Images size={16} className="text-brand" />
          Instagram story downloader
        </p>
        <h1 className="max-w-3xl break-words text-[2.25rem] font-black leading-none text-white sm:text-5xl">
          Download Instagram stories.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-8">
          Enter one username to load active stories, reels, and profile media.
        </p>
      </div>

      <form className="glass grid gap-4 rounded-2xl p-3 sm:p-5" onSubmit={onAnalyze}>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-4">
          <label className="relative block min-w-0">
            <AtSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4" size={19} />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand/70 focus:bg-white/10 sm:h-14 sm:pl-12 sm:pr-4 sm:text-base"
              placeholder="Instagram username"
              value={storyUsername}
              onChange={(event) => setStoryUsername(event.target.value)}
            />
          </label>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-ink transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:px-6 sm:text-base"
            disabled={loading}
            type="submit"
          >
            <Download size={18} />
            {loading ? 'Loading...' : 'Load profile'}
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <h2 className="text-xl font-black text-white">Stories</h2>
          {storyCard || (
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-slate-400">
              {storyError || 'Load a username to check active stories.'}
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <h2 className="text-xl font-black text-white">Reels</h2>
          {reelsCard || (
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-slate-400">
              {reelsError || 'Supported reels appear here after the username is loaded.'}
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <h2 className="text-xl font-black text-white">Profile media</h2>
          {profileCard || (
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-slate-400">
              {profileError || 'Supported profile media appears here after the username is loaded.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const pagePaths = {
  home: '/',
  stories: '/instagram-story-downloader',
  'how-to-use': '/how-to-use',
  contact: '/contact'
};

export default function App({ initialPage = 'home' }) {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [quality, setQuality] = useState('best');
  const [type, setType] = useState('video');
  const [videoFormat, setVideoFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(SUPPORTED_PLATFORMS[0]);
  const [storyUsername, setStoryUsername] = useState('');
  const [storyInfo, setStoryInfo] = useState(null);
  const [reelsInfo, setReelsInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [storyError, setStoryError] = useState('');
  const [reelsError, setReelsError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [storyQuality, setStoryQuality] = useState('best');
  const [reelsQuality, setReelsQuality] = useState('best');
  const [profileQuality, setProfileQuality] = useState('best');
  const [storyType, setStoryType] = useState('video');
  const [reelsType, setReelsType] = useState('video');
  const [profileType, setProfileType] = useState('video');
  const [storyVideoFormat, setStoryVideoFormat] = useState('mp4');
  const [reelsVideoFormat, setReelsVideoFormat] = useState('mp4');
  const [profileVideoFormat, setProfileVideoFormat] = useState('mp4');
  const [storyResult, setStoryResult] = useState(null);
  const [reelsResult, setReelsResult] = useState(null);
  const [profileResult, setProfileResult] = useState(null);
  const [storyDownloading, setStoryDownloading] = useState(false);
  const [reelsDownloading, setReelsDownloading] = useState(false);
  const [profileDownloading, setProfileDownloading] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [reelsProgress, setReelsProgress] = useState(0);
  const [profileProgress, setProfileProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [quota, setQuota] = useState(null);
  const [activePage, setActivePage] = useState(initialPage);

  const showPasteUnavailable = () => {
    notifyError('Clipboard blocked', 'Paste with Ctrl+V in the link box.');
  };

  const handleUrlChange = useCallback((value) => {
    setUrl(value);
    setInfo(null);
    setResult(null);

    const detectedPlatform = detectPlatform(value.trim());
    if (detectedPlatform) {
      setSelectedPlatform(detectedPlatform);
    }
  }, []);

  const navigateTo = (page) => {
    setActivePage(page);
    window.history.pushState({}, '', pagePaths[page] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!storyDownloading) return undefined;

    const timer = window.setInterval(() => {
      setStoryProgress((current) => (current >= 92 ? current : current + Math.ceil(Math.random() * 8)));
    }, 700);

    return () => window.clearInterval(timer);
  }, [storyDownloading]);

  useEffect(() => {
    if (!reelsDownloading) return undefined;

    const timer = window.setInterval(() => {
      setReelsProgress((current) => (current >= 92 ? current : current + Math.ceil(Math.random() * 8)));
    }, 700);

    return () => window.clearInterval(timer);
  }, [reelsDownloading]);

  useEffect(() => {
    if (!profileDownloading) return undefined;

    const timer = window.setInterval(() => {
      setProfileProgress((current) => (current >= 92 ? current : current + Math.ceil(Math.random() * 8)));
    }, 700);

    return () => window.clearInterval(timer);
  }, [profileDownloading]);

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
      notifyError('Link needed', 'Paste a video link first.');
      return;
    }

    const detectedPlatform = detectPlatform(url.trim());
    if (detectedPlatform) {
      setSelectedPlatform(detectedPlatform);
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await fetchVideoInfo(url.trim());
      setInfo(data);
      setQuality('best');
      setVideoFormat('mp4');
      const detectedInfoPlatform = SUPPORTED_PLATFORMS.find((platform) => (
        platform.label === data.platform || platform.label.startsWith(data.platform)
      ));
      if (detectedInfoPlatform) {
        setSelectedPlatform(detectedInfoPlatform);
      }
      notifySuccess('Video details loaded', 'Choose your format and quality, then download.');
    } catch (error) {
      setInfo(null);
      notifyError('Could not load video', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInstagramUsernameAnalyze = async (event) => {
    event.preventDefault();

    const username = normalizeInstagramUsernameInput(storyUsername);

    if (!instagramUsernamePattern.test(username)) {
      notifyError('Invalid username', 'Enter a valid public Instagram username or profile URL.');
      return;
    }

    const storyUrl = `https://www.instagram.com/stories/${username}/`;

    setLoading(true);
    setStoryResult(null);
    setReelsResult(null);
    setProfileResult(null);
    setStoryInfo(null);
    setReelsInfo(null);
    setProfileInfo(null);
    setStoryError('');
    setReelsError('');
    setProfileError('');
    setUrl(storyUrl);
    setSelectedPlatform(SUPPORTED_PLATFORMS.find((platform) => platform.label === 'Instagram Reels') || SUPPORTED_PLATFORMS[0]);

    try {
      const data = await fetchInstagramProfileMedia(username);
      const sections = data.sections || {};
      const applySection = ({ section, setInfo, setError, setQuality, setType, setFormat, fallback }) => {
        if (section?.ok && section.info) {
          setInfo(section.info);
          setQuality('best');
          setType('video');
          setFormat('mp4');
          return true;
        }

        setError(section?.message || fallback);
        return false;
      };

      const loaded = [
        applySection({
          section: sections.stories,
          setInfo: setStoryInfo,
          setError: setStoryError,
          setQuality: setStoryQuality,
          setType: setStoryType,
          setFormat: setStoryVideoFormat,
          fallback: 'No active stories are available for this public profile.'
        }),
        applySection({
          section: sections.reels,
          setInfo: setReelsInfo,
          setError: setReelsError,
          setQuality: setReelsQuality,
          setType: setReelsType,
          setFormat: setReelsVideoFormat,
          fallback: 'Reels could not be loaded for this profile.'
        }),
        applySection({
          section: sections.profile,
          setInfo: setProfileInfo,
          setError: setProfileError,
          setQuality: setProfileQuality,
          setType: setProfileType,
          setFormat: setProfileVideoFormat,
          fallback: 'Profile media could not be loaded for this profile.'
        })
      ].filter(Boolean).length;

      if (loaded) {
        notifySuccess('Instagram profile loaded', `${loaded} section${loaded === 1 ? '' : 's'} ready below.`, 'instagram-profile');
      } else {
        notifyError('No media loaded', 'Instagram did not return downloadable media for this username.', 'instagram-profile');
      }
    } catch (error) {
      const message = error.message || 'Instagram profile could not be loaded.';
      setStoryError(message);
      setReelsError(message);
      setProfileError(message);
      notifyError('Could not load profile', message, 'instagram-profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInstagramDownload = async ({
    info: targetInfo,
    type: targetType,
    quality: targetQuality,
    videoFormat: targetVideoFormat,
    setTargetResult,
    setTargetDownloading,
    setTargetProgress
  }) => {
    if (!targetInfo) return;

    setTargetDownloading(true);
    setTargetResult(null);
    setTargetProgress(8);

    try {
      const data = await requestDownload({
        url: targetInfo.url,
        type: targetType,
        quality: targetQuality,
        format: targetVideoFormat
      });
      setTargetProgress(100);
      setTargetResult(data);
      notifySuccess('File ready', 'Save it, then share Mediazy with friends.');
    } catch (error) {
      notifyError('Download failed', error.message);
    } finally {
      window.setTimeout(() => {
        setTargetDownloading(false);
        setTargetProgress(0);
      }, 600);
    }
  };

  const handleDownload = async () => {
    if (!info) return;

    setDownloading(true);
    setResult(null);
    setProgress(8);

    try {
      const data = await requestDownload({ url: info.url, type, quality, format: videoFormat });
      setProgress(100);
      setResult(data);
      if (data.quota) {
        setQuota(data.quota);
      }
      notifySuccess('File ready', 'Save it, then share Mediazy with friends.');
    } catch (error) {
      if (/log in|login|required/i.test(error.message)) {
        setAuthMode('login');
        setAuthOpen(true);
      }
      notifyError('Download failed', error.message);
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
      notifyError('Password needed', 'Enter your password.');
      return;
    }

    if (authMode === 'signup') {
      if (!emailPattern.test(email)) {
        notifyError('Invalid email', 'Enter a valid email address.');
        return;
      }

      if (name.length < 2 || name.length > 80) {
        notifyError('Invalid name', 'Name must be between 2 and 80 characters.');
        return;
      }

      if (!phonePattern.test(phone)) {
        notifyError('Invalid phone', 'Enter a valid phone number with 10 to 15 digits.');
        return;
      }

      if (!passwordPattern.test(password)) {
        notifyError('Weak password', 'Password must be at least 8 characters and include a letter and a number.');
        return;
      }
    } else if (!emailPattern.test(identifier) && !phonePattern.test(loginPhone)) {
      notifyError('Invalid login', 'Enter a valid email or phone number.');
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
      notifySuccess(authMode === 'signup' ? 'Account created' : 'Logged in');
    } catch (error) {
      notifyError('Authentication failed', error.message);
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
    notifySuccess('Logged out');
  };

  const handleProfileSubmit = async (form) => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const currentPassword = form.currentPassword;
    const newPassword = form.newPassword;

    if (name.length < 2 || name.length > 80) {
      notifyError('Invalid name', 'Name must be between 2 and 80 characters.');
      return;
    }

    if (!emailPattern.test(email)) {
      notifyError('Invalid email', 'Enter a valid email address.');
      return;
    }

    if ((email !== user.email || newPassword) && !currentPassword) {
      notifyError('Current password needed', 'Enter your current password to change email or password.');
      return;
    }

    if (newPassword && !passwordPattern.test(newPassword)) {
      notifyError('Weak password', 'New password must be at least 8 characters and include a letter and a number.');
      return;
    }

    setProfileLoading(true);

    try {
      const data = await updateProfile({ name, email, currentPassword, newPassword });
      window.localStorage.setItem('mediazy_token', data.token);
      refreshGuestAds();
      setUser(data.user);
      setProfileOpen(false);
      notifySuccess('Profile updated', 'Notification sent to your email.');
    } catch (error) {
      notifyError('Profile update failed', error.message);
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
        onNavigate={navigateTo}
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

        {activePage === 'stories' && (
          <InstagramStoriesPage
            storyUsername={storyUsername}
            setStoryUsername={setStoryUsername}
            onAnalyze={handleInstagramUsernameAnalyze}
            loading={loading}
            storyError={storyError}
            reelsError={reelsError}
            profileError={profileError}
            storyCard={storyInfo && (
              <DownloadCard
                info={storyInfo}
                quality={storyQuality}
                setQuality={setStoryQuality}
                type={storyType}
                setType={setStoryType}
                videoFormat={storyVideoFormat}
                setVideoFormat={setStoryVideoFormat}
                onDownload={() => handleInstagramDownload({
                  info: storyInfo,
                  type: storyType,
                  quality: storyQuality,
                  videoFormat: storyVideoFormat,
                  setTargetResult: setStoryResult,
                  setTargetDownloading: setStoryDownloading,
                  setTargetProgress: setStoryProgress
                })}
                downloading={storyDownloading}
                progress={storyProgress}
                result={storyResult}
              />
            )}
            reelsCard={reelsInfo && (
              <DownloadCard
                info={reelsInfo}
                quality={reelsQuality}
                setQuality={setReelsQuality}
                type={reelsType}
                setType={setReelsType}
                videoFormat={reelsVideoFormat}
                setVideoFormat={setReelsVideoFormat}
                onDownload={() => handleInstagramDownload({
                  info: reelsInfo,
                  type: reelsType,
                  quality: reelsQuality,
                  videoFormat: reelsVideoFormat,
                  setTargetResult: setReelsResult,
                  setTargetDownloading: setReelsDownloading,
                  setTargetProgress: setReelsProgress
                })}
                downloading={reelsDownloading}
                progress={reelsProgress}
                result={reelsResult}
              />
            )}
            profileCard={profileInfo && (
              <DownloadCard
                info={profileInfo}
                quality={profileQuality}
                setQuality={setProfileQuality}
                type={profileType}
                setType={setProfileType}
                videoFormat={profileVideoFormat}
                setVideoFormat={setProfileVideoFormat}
                onDownload={() => handleInstagramDownload({
                  info: profileInfo,
                  type: profileType,
                  quality: profileQuality,
                  videoFormat: profileVideoFormat,
                  setTargetResult: setProfileResult,
                  setTargetDownloading: setProfileDownloading,
                  setTargetProgress: setProfileProgress
                })}
                downloading={profileDownloading}
                progress={profileProgress}
                result={profileResult}
              />
            )}
          />
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
                Unlimited guest downloads are enabled. Login is optional.
              </div>
            )}
          </div>

          <div className="glass grid min-w-0 gap-2 rounded-2xl p-3 sm:gap-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/10 bg-white/8 p-3 sm:p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand sm:h-10 sm:w-10">
                <LockKeyhole size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white sm:text-base">Unlimited downloads</p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  Download without daily or guest limits. Login is only needed for account features.
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/10 bg-white/8 p-3 sm:p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand sm:h-10 sm:w-10">
                <BadgeCheck size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white sm:text-base">Automatic platform detection</p>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                  Paste the URL and Mediazy selects the matching platform for you.
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
          setUrl={handleUrlChange}
          onSubmit={handleAnalyze}
          loading={loading}
          selectedPlatform={selectedPlatform}
          onPasteUnavailable={showPasteUnavailable}
        />

        <div className="-mx-3 flex min-w-0 gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {SUPPORTED_PLATFORMS.map((platform) => (
            <button
              className={`shrink-0 rounded-full border px-3 py-2 text-sm transition sm:shrink sm:py-1 ${
                selectedPlatform.label === platform.label
                  ? 'border-brand/70 bg-brand/15 text-white'
                  : 'border-white/10 bg-white/8 text-slate-300 hover:border-brand/50 hover:text-white'
              }`}
              key={platform.label}
              type="button"
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform.label}
            </button>
          ))}
        </div>

        <DownloadCard
          info={info}
          quality={quality}
          setQuality={setQuality}
          type={type}
          setType={setType}
          videoFormat={videoFormat}
          setVideoFormat={setVideoFormat}
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

import { useEffect, useMemo, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowLeft, ArrowUpLeft, Bell, Bookmark, BriefcaseBusiness, CalendarDays,
  Check, ChevronLeft, CircleCheck, Clock3, GraduationCap, Home,
  MapPin, Search, SlidersHorizontal, Sparkles, Target, UserRound,
  X, Building2, ChartNoAxesColumnIncreasing,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type Opportunity = {
  id: string; title: string; provider: string; kind: string; field: string;
  location: 'حضوري' | 'عن بُعد'; city: string; experience: string; duration: string;
  requirements: string[]; deadline: string; registrationStart: string;
  programStart: string; applicationMethod: string; description: string;
  matchPercent: number; matchReason: string[]; isDemo: boolean;
};
type Profile = { specialty: string; skills: string[]; level: string; interests: string[] };
type Alert = { id: string; opportunityId: string; title: string; date: string; read: boolean };

const opportunities: Opportunity[] = [
  { id:'op-01', title:'مساعد محلل بيانات', provider:'مسار مهني افتراضي', kind:'تدريب تعاوني', field:'الذكاء الاصطناعي والبيانات', location:'حضوري', city:'الرياض', experience:'طالب جامعي', duration:'6 أشهر', requirements:['إجادة أساسيات Excel','اهتمام بتحليل البيانات','التفرغ للتدريب التعاوني'], deadline:'2026-08-12', registrationStart:'2026-07-01', programStart:'2026-09-01', applicationMethod:'نموذج اهتمام تجريبي داخل فرصتي', description:'فرصة تدريبية افتراضية تمنحك مساحة لتطبيق مهارات تنظيم البيانات، إعداد التقارير، والتعلم ضمن فريق متعدد التخصصات.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-02', title:'برنامج مطور واجهات مبتدئ', provider:'مختبر تعلّم افتراضي', kind:'برنامج تدريبي', field:'التقنية', location:'عن بُعد', city:'جميع المدن', experience:'مبتدئ', duration:'10 أسابيع', requirements:['معرفة أولية بـ HTML وCSS','رغبة في بناء منتجات رقمية','الالتزام بالجلسات الأسبوعية'], deadline:'2026-08-18', registrationStart:'2026-07-10', programStart:'2026-09-10', applicationMethod:'تسجيل تجريبي على المنصة', description:'برنامج افتراضي لبناء أساس قوي في تطوير الواجهات، من النماذج الأولية إلى تحسين تجربة الاستخدام.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-03', title:'مصمم تجربة مستخدم متدرب', provider:'استوديو أثر الافتراضي', kind:'تدريب', field:'التصميم', location:'حضوري', city:'جدة', experience:'طالب جامعي', duration:'3 أشهر', requirements:['نماذج من أعمالك أو مشاريعك','معرفة بمبادئ التصميم','مهارات تواصل جيدة'], deadline:'2026-08-09', registrationStart:'2026-06-24', programStart:'2026-09-01', applicationMethod:'إرسال ملف تعريفي تجريبي', description:'تدريب عملي افتراضي للتعرف على أبحاث المستخدمين، رسم الرحلات، وتصميم النماذج التفاعلية.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-04', title:'زمالة صناعة المحتوى التعليمي', provider:'مبادرة معرفة الافتراضية', kind:'زمالة', field:'التعليم', location:'عن بُعد', city:'جميع المدن', experience:'خريج', duration:'4 أشهر', requirements:['اهتمام بالتعلم الرقمي','كتابة عربية واضحة','القدرة على العمل باستقلالية'], deadline:'2026-08-25', registrationStart:'2026-07-15', programStart:'2026-10-01', applicationMethod:'تقديم تجريبي عبر فرصتي', description:'زمالة افتراضية لاستكشاف تصميم المحتوى التعليمي وتحويل الأفكار إلى تجارب تعلم قصيرة ومفيدة.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-05', title:'محلل أعمال – مشروع قصير', provider:'مجموعة حلول افتراضية', kind:'فرصة عمل', field:'الأعمال', location:'حضوري', city:'الدمام', experience:'حديث التخرج', duration:'8 أسابيع', requirements:['تحليل المشكلات وتلخيصها','مهارات عروض تقديمية','العمل بروح الفريق'], deadline:'2026-08-15', registrationStart:'2026-07-03', programStart:'2026-09-15', applicationMethod:'تسجيل اهتمام تجريبي', description:'مشروع محاكاة مهني قصير يساعدك على ممارسة جمع المتطلبات، تحليلها، وبناء توصيات واضحة.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-06', title:'تحدي أساسيات الذكاء الاصطناعي', provider:'نادي ابتكار افتراضي', kind:'تحدي', field:'الذكاء الاصطناعي والبيانات', location:'عن بُعد', city:'جميع المدن', experience:'مبتدئ', duration:'أسبوعان', requirements:['فضول للتقنيات الجديدة','العمل ضمن فريق صغير','لا يشترط خبرة سابقة'], deadline:'2026-09-02', registrationStart:'2026-07-20', programStart:'2026-09-12', applicationMethod:'انضمام تجريبي إلى التحدي', description:'تجربة تعليمية افتراضية مبسطة للتعرّف على استخدامات الذكاء الاصطناعي وبناء فكرة أولية قابلة للنقاش.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-07', title:'متدرب تنسيق مشاريع', provider:'مكتب إنجاز افتراضي', kind:'تدريب تعاوني', field:'الأعمال', location:'حضوري', city:'الرياض', experience:'طالب جامعي', duration:'5 أشهر', requirements:['تنظيم المهام والمواعيد','إجادة أدوات العمل المكتبي','تواصل فعّال'], deadline:'2026-08-28', registrationStart:'2026-07-17', programStart:'2026-10-01', applicationMethod:'نموذج اهتمام تجريبي داخل فرصتي', description:'فرصة تطبيقية افتراضية لمتابعة خطط المشاريع والتنسيق بين فرق العمل واكتساب عادات مهنية منظمة.', matchPercent:0, matchReason:[], isDemo:true },
  { id:'op-08', title:'مسار مهارات المستقبل', provider:'أكاديمية نمو الافتراضية', kind:'دورة تدريبية', field:'التقنية', location:'عن بُعد', city:'جميع المدن', experience:'مبتدئ', duration:'5 أسابيع', requirements:['جهاز متصل بالإنترنت','الرغبة في التعلم','إكمال الأنشطة الأسبوعية'], deadline:'2026-09-06', registrationStart:'2026-07-22', programStart:'2026-09-20', applicationMethod:'تسجيل تجريبي على المنصة', description:'مسار افتراضي يجمع بين التفكير التصميمي ومهارات الأدوات الرقمية والعمل الجماعي.', matchPercent:0, matchReason:[], isDemo:true },
];
const defaultProfile: Profile = { specialty:'علوم الحاسب', skills:['تحليل البيانات','التواصل'], level:'طالب جامعي', interests:['الذكاء الاصطناعي والبيانات','التقنية'] };
const initialAlerts: Alert[] = [
  {id:'alert-1', opportunityId:'op-03', title:'تقترب نهاية التسجيل: مصمم تجربة مستخدم متدرب', date:'2026-08-04', read:false},
  {id:'alert-2', opportunityId:'op-01', title:'فرصة جديدة قد تناسب اهتمامك بالبيانات', date:'2026-07-29', read:false},
  {id:'alert-3', opportunityId:'op-05', title:'تذكير: محلل أعمال – مشروع قصير', date:'2026-07-25', read:true},
];
const fields = ['الذكاء الاصطناعي والبيانات','التقنية','التصميم','الأعمال','التعليم'];
const skillsOptions = ['تحليل البيانات','التواصل','التصميم','البرمجة','إدارة المشاريع','كتابة المحتوى','التفكير النقدي'];
const levels = ['طالب جامعي','مبتدئ','حديث التخرج','خريج','ذو خبرة'];
const getStored = <T,>(key:string, fallback:T):T => {
  try { const value = localStorage.getItem(`forsati-${key}`); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};
const saveStored = (key:string, value:unknown) => { try { localStorage.setItem(`forsati-${key}`, JSON.stringify(value)); } catch { /* local storage may be unavailable */ } };
const dateLabel = (value:string) => new Intl.DateTimeFormat('ar-SA',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`));
const shortDate = (value:string) => new Intl.DateTimeFormat('ar-SA',{day:'numeric',month:'short'}).format(new Date(`${value}T12:00:00`));

function AppContent() {
  const [profile,setProfile] = useState<Profile>(()=>getStored('profile',defaultProfile));
  const [saved,setSaved] = useState<string[]>(()=>getStored('saved',[]));
  const [alerts,setAlerts] = useState<Alert[]>(()=>getStored('alerts',initialAlerts));
  const [clicks,setClicks] = useState<number>(()=>getStored('applicationClicks',0));
  const [notice,setNotice] = useState('');
  const [location] = useLocation();
  useEffect(()=>saveStored('profile',profile),[profile]);
  useEffect(()=>saveStored('saved',saved),[saved]);
  useEffect(()=>saveStored('alerts',alerts),[alerts]);
  useEffect(()=>saveStored('applicationClicks',clicks),[clicks]);
  useEffect(()=>{ if (notice) { const timer=window.setTimeout(()=>setNotice(''),4500); return ()=>window.clearTimeout(timer); } },[notice]);
  const scored = useMemo(()=>opportunities.map(op=>{
    const terms=[...profile.interests,profile.specialty,...profile.skills].map(x=>x.toLowerCase());
    const haystack=`${op.field} ${op.title} ${op.description} ${op.requirements.join(' ')}`.toLowerCase();
    const reasons:string[]=[];
    if(profile.interests.some(i=>op.field===i)){reasons.push(`اهتمامك بـ ${op.field}`);}
    const skill=profile.skills.find(s=>haystack.includes(s.toLowerCase()));
    if(skill) reasons.push(`تتقاطع مع مهارة ${skill}`);
    if(op.experience===profile.level) reasons.push(`مناسبة لمستواك: ${profile.level}`);
    const percent=Math.min(98,Math.max(52,55+reasons.length*14+Math.min(terms.length,3)));
    return {...op,matchPercent:reasons.length?percent:57,matchReason:reasons.length?reasons:['فرصة لاستكشاف مجال جديد يناسب مسارك']};
  }),[profile]);
  const toggleSaved=(id:string)=>setSaved(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const apply=(op:Opportunity)=>{setClicks(v=>v+1);setNotice(`سُجّل اهتمامك التجريبي بفرصة «${op.title}». لم يتم الانتقال إلى أي جهة خارجية.`);};
  const unread=alerts.filter(a=>!a.read).length;
  return <div className="app-shell" dir="rtl">
    <header className="topbar">
      <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark"><Sparkles size={21}/></span><span><strong>فرصتي</strong><small>FORSATI</small></span></Link>
      <div className="topbar-caption"><span className="green-dot"/>بوابتك إلى فرص أقرب لطموحك</div>
      <div className="topbar-actions"><Link href="/notifications" className="icon-button notification-button" aria-label="التنبيهات" data-testid="link-notifications"><Bell size={19}/>{unread>0&&<span className="notification-count">{unread}</span>}</Link><Link href="/profile" className="profile-chip" data-testid="link-profile-top"><span className="avatar">م</span><span>ملفي المهني</span><ChevronLeft size={15}/></Link></div>
    </header>
    <div className="app-layout">
      <aside className="sidebar">
        <div className="side-label">مساحة فرصتي</div>
        <nav className="side-nav" aria-label="التنقل الرئيسي">
          <NavItem href="/" icon={<Home size={19}/>} label="الرئيسية" active={location==='/'} id="home"/>
          <NavItem href="/opportunities" icon={<Search size={19}/>} label="استكشف الفرص" active={location.startsWith('/opportunities')} id="opportunities"/>
          <NavItem href="/saved" icon={<Bookmark size={19}/>} label="الفرص المحفوظة" active={location==='/saved'} id="saved"/>
          <NavItem href="/calendar" icon={<CalendarDays size={19}/>} label="المواعيد" active={location==='/calendar'} id="calendar"/>
          <NavItem href="/notifications" icon={<Bell size={19}/>} label="التنبيهات" active={location==='/notifications'} id="alerts" count={unread}/>
        </nav>
        <div className="sidebar-profile">
          <span className="eyebrow">ملفك يفتح لك فرصاً أقرب</span><h3>{profile.specialty||'أكمل ملفك المهني'}</h3><p>أضف مهاراتك واهتماماتك لتظهر لك توصيات أكثر ملاءمة.</p>
          <Link href="/profile" className="side-profile-link" data-testid="link-edit-profile">تحديث الملف <ArrowLeft size={15}/></Link>
        </div>
        <div className="side-foot"><span className="demo-mini"><span/>بيئة تجريبية</span><span>فرصتي · إصدار تجريبي</span></div>
      </aside>
      <main className="main-content" id="main-content">
        <Switch>
          <Route path="/"><HomePage items={scored} saved={saved} toggleSaved={toggleSaved}/></Route>
          <Route path="/opportunities"><OpportunitiesPage items={scored} saved={saved} toggleSaved={toggleSaved}/></Route>
          <Route path="/opportunities/:id">{params=><DetailPage id={params.id||''} items={scored} saved={saved} toggleSaved={toggleSaved} apply={apply}/>}</Route>
          <Route path="/profile"><ProfilePage profile={profile} setProfile={setProfile}/></Route>
          <Route path="/saved"><SavedPage items={scored.filter(o=>saved.includes(o.id))} saved={saved} toggleSaved={toggleSaved}/></Route>
          <Route path="/notifications"><NotificationsPage alerts={alerts} setAlerts={setAlerts}/></Route>
          <Route path="/calendar"><CalendarPage items={scored}/></Route>
          <Route component={NotFound}/>
        </Switch>
        <footer className="page-footer"><span>فرصتي · مساحة واضحة لاكتشاف الخطوة القادمة</span><span><span className="green-dot"/>جميع الفرص المعروضة بيانات تجريبية</span></footer>
      </main>
    </div>
    <nav className="mobile-nav" aria-label="التنقل للجوال">
      <MobileItem href="/" icon={<Home size={19}/>} label="الرئيسية" active={location==='/'} id="home"/>
      <MobileItem href="/opportunities" icon={<Search size={19}/>} label="الفرص" active={location.startsWith('/opportunities')} id="opportunities"/>
      <MobileItem href="/saved" icon={<Bookmark size={19}/>} label="المحفوظة" active={location==='/saved'} id="saved"/>
      <MobileItem href="/calendar" icon={<CalendarDays size={19}/>} label="المواعيد" active={location==='/calendar'} id="calendar"/>
      <MobileItem href="/profile" icon={<UserRound size={19}/>} label="ملفي" active={location==='/profile'} id="profile"/>
    </nav>
    {notice&&<div role="status" className="toast-notice" data-testid="status-demo-application"><CircleCheck size={20}/><span>{notice}</span><button onClick={()=>setNotice('')} aria-label="إغلاق التنبيه" data-testid="button-close-notice"><X size={17}/></button></div>}
  </div>;
}

function NavItem({href,icon,label,active,id,count}:{href:string;icon:ReactNode;label:string;active:boolean;id:string;count?:number}) {
  return <Link href={href} className={`nav-item ${active?'active':''}`} aria-current={active?'page':undefined} data-testid={`link-nav-${id}`}>{icon}<span>{label}</span>{count? <b className="nav-count">{count}</b>:null}</Link>;
}
function MobileItem({href,icon,label,active,id}:{href:string;icon:ReactNode;label:string;active:boolean;id:string}) {
  return <Link href={href} className={`mobile-nav-item ${active?'active':''}`} aria-current={active?'page':undefined} data-testid={`link-mobile-${id}`}>{icon}<span>{label}</span></Link>;
}
function PageHeading({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:React.ReactNode}) {
  return <div className="page-heading"><div><div className="eyebrow heading-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action&&<div className="heading-action">{action}</div>}</div>;
}
function DemoTag(){return <span className="demo-tag"><span/>بيانات تجريبية</span>;}
function OpportunityCard({item,saved,toggleSaved,compact=false}:{item:Opportunity;saved:string[];toggleSaved:(id:string)=>void;compact?:boolean}) {
  const bookmarked=saved.includes(item.id);
  return <article className={`op-card ${compact?'compact-card':''}`} data-testid={`card-opportunity-${item.id}`}>
    <div className="card-topline"><span className="kind-label">{item.kind}</span><button className={`save-button ${bookmarked?'is-saved':''}`} aria-label={bookmarked?'إزالة من المحفوظة':'حفظ الفرصة'} aria-pressed={bookmarked} onClick={()=>toggleSaved(item.id)} data-testid={`button-save-${item.id}`}><Bookmark size={18} fill={bookmarked?'currentColor':'none'}/></button></div>
    <Link href={`/opportunities/${item.id}`} className="card-title-link" data-testid={`link-opportunity-${item.id}`}><h3>{item.title}</h3></Link>
    <p className="provider-name">{item.provider}</p>
    <div className="card-meta"><span><BriefcaseBusiness size={15}/>{item.field}</span><span><MapPin size={15}/>{item.location==='عن بُعد'?'عن بُعد':item.city}</span></div>
    <div className="card-bottom"><span className="deadline"><Clock3 size={15}/>آخر موعد {shortDate(item.deadline)}</span>{item.matchPercent>0&&<span className="match-pill"><Sparkles size={13}/>{item.matchPercent}% ملاءمة</span>}</div>
    {!compact&&<div className="card-foot"><DemoTag/><Link href={`/opportunities/${item.id}`} className="text-link" data-testid={`link-details-${item.id}`}>التفاصيل <ArrowLeft size={15}/></Link></div>}
  </article>;
}
function SectionTitle({eyebrow,title,link,href}:{eyebrow?:string;title:string;link?:string;href?:string}) {
  return <div className="section-title"><div>{eyebrow&&<div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2></div>{link&&href&&<Link href={href} className="text-link" data-testid={`link-section-${title}`}>{link}<ArrowLeft size={16}/></Link>}</div>;
}
function HomePage({items,saved,toggleSaved}:{items:Opportunity[];saved:string[];toggleSaved:(id:string)=>void}) {
  const [,setLocation]=useLocation();
  const [query,setQuery]=useState('');
  const recommended=[...items].sort((a,b)=>b.matchPercent-a.matchPercent).slice(0,3);
  const closing=[...items].sort((a,b)=>a.deadline.localeCompare(b.deadline)).slice(0,3);
  const fresh=items.slice(0,3);
  return <div className="page home-page">
    <section className="hero-panel">
      <div className="hero-copy"><div className="hero-overline"><span className="hero-overline-mark"><Sparkles size={14}/></span>مساحة فرصتك القادمة</div><h1>فرصتك القادمة<br/><em>تبدأ من هنا</em></h1><p>فرص تدريب وعمل وتعلّم، في مكان واحد. اكتشف ما يناسب مسارك، وابدأ بخطوة واضحة.</p>
        <form className="hero-search" onSubmit={e=>{e.preventDefault();setLocation(`/opportunities${query?`?q=${encodeURIComponent(query)}`:''}`);}}><Search size={19}/><input aria-label="ابحث عن فرصة أو مجال" placeholder="ما الفرصة التي تبحث عنها؟" value={query} onChange={e=>setQuery(e.target.value)} data-testid="input-home-search"/><button type="submit" data-testid="button-home-search">ابحث عن فرصة <ArrowLeft size={16}/></button></form>
        <div className="hero-trust"><span><Check size={14}/>اختيارات واضحة</span><span><Check size={14}/>توصيات حسب اهتماماتك</span></div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-sun"/><div className="hero-card hero-card-main"><div className="hero-card-icon"><Target size={22}/></div><div><strong>خطوتك التالية</strong><small>فرصة تناسب طموحك</small></div><ArrowUpLeft size={18}/></div><div className="hero-float hero-float-one"><span className="float-icon"><ChartNoAxesColumnIncreasing size={16}/></span><span>فرص تنمو معك</span></div><div className="hero-float hero-float-two"><span className="float-check"><Check size={15}/></span>استكشف بثقة</div><div className="hero-vertical">مسارك · فرصتك · خطوتك</div></div>
      <div className="hero-kpi"><span className="kpi-icon"><ArrowLeft size={18}/></span><div><strong data-testid="text-application-clicks">{getStored('applicationClicks',0)}</strong><small>انتقالات تقديم تجريبية</small></div><span className="kpi-caption">محفوظة على هذا الجهاز</span></div>
    </section>
    <div className="data-note"><span className="note-symbol">i</span><span>كل الفرص ومقدميها في هذا الإصدار افتراضيون لأغراض العرض.</span><DemoTag/></div>
    <section className="content-section"><SectionTitle eyebrow="اختيارات قريبة من ملفك" title="فرص قد تناسبك" link="كل الفرص" href="/opportunities"/><p className="section-subtitle">تتغير التوصيات كلما حدّثت تخصصك ومهاراتك.</p><div className="op-grid">{recommended.map(o=><OpportunityCard key={o.id} item={o} saved={saved} toggleSaved={toggleSaved}/>)}</div></section>
    <section className="content-section closing-section"><SectionTitle eyebrow="لا تدع موعدك يفوت" title="ينتهي التسجيل قريباً" link="عرض المواعيد" href="/calendar"/><div className="op-grid">{closing.map(o=><OpportunityCard key={o.id} item={o} saved={saved} toggleSaved={toggleSaved}/>)}</div></section>
    <section className="field-section"><div className="field-intro"><div className="eyebrow">مسارات متعددة، بداية واحدة</div><h2>أي مجال يشبهك؟</h2><p>تصفّح المجالات التي تهمك، واكتشف الفرص المتاحة فيها.</p></div><div className="field-grid">{fields.map((f,i)=><Link href={`/opportunities?field=${encodeURIComponent(f)}`} className="field-tile" key={f} data-testid={`link-field-${i}`}><span className="field-tile-no">0{i+1}</span><span className="field-title">{f}</span><span className="field-arrow"><ArrowLeft size={17}/></span></Link>)}</div></section>
    <section className="content-section"><SectionTitle eyebrow="أضيفت حديثاً" title="فرص جديدة" link="استكشف الكل" href="/opportunities"/><div className="op-grid">{fresh.map(o=><OpportunityCard key={o.id} item={o} saved={saved} toggleSaved={toggleSaved}/>)}</div></section>
    <section className="home-end-banner"><div className="end-icon"><GraduationCap size={26}/></div><div><div className="eyebrow">ابدأ من ملفك</div><h2>كلما عرفت فرصتي عنك أكثر، اقتربت التوصية.</h2></div><Link href="/profile" className="button button-outline" data-testid="link-home-profile">أكمل ملفك <ArrowLeft size={16}/></Link></section>
  </div>;
}
function OpportunitiesPage({items,saved,toggleSaved}:{items:Opportunity[];saved:string[];toggleSaved:(id:string)=>void}) {
  const params=new URLSearchParams(window.location.search);
  const [query,setQuery]=useState(params.get('q')||'');
  const [field,setField]=useState(params.get('field')||'');
  const [kind,setKind]=useState('');
  const [mode,setMode]=useState('');
  const [city,setCity]=useState('');
  const [experience,setExperience]=useState('');
  const [deadline,setDeadline]=useState('');
  const [filtersOpen,setFiltersOpen]=useState(true);
  const kinds=Array.from(new Set(items.map(o=>o.kind)));
  const cities=Array.from(new Set(items.map(o=>o.city).filter(c=>c!=='جميع المدن')));
  const results=items.filter(o=>{
    const text=`${o.title} ${o.provider} ${o.field} ${o.description}`.toLowerCase();
    return (!query||text.includes(query.toLowerCase()))&&(!field||o.field===field)&&(!kind||o.kind===kind)&&(!mode||o.location===mode)&&(!city||o.city===city)&&(!experience||o.experience===experience)&&(!deadline||o.deadline<=deadline);
  });
  const clear=()=>{setQuery('');setField('');setKind('');setMode('');setCity('');setExperience('');setDeadline('');};
  return <div className="page">
    <PageHeading eyebrow="مساحة الاستكشاف" title="اكتشف الفرص" description="ابحث بين فرص تدريب وعمل وتعلّم، واستخدم التصفية لتصل إلى ما يناسبك." action={<DemoTag/>}/>
    <div className="search-toolbar"><div className="list-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث بعنوان الفرصة أو المجال" aria-label="البحث في الفرص" data-testid="input-opportunity-search"/>{query&&<button onClick={()=>setQuery('')} aria-label="مسح البحث" data-testid="button-clear-search"><X size={16}/></button>}</div><button className={`filter-toggle ${filtersOpen?'selected':''}`} onClick={()=>setFiltersOpen(v=>!v)} data-testid="button-toggle-filters"><SlidersHorizontal size={17}/> التصفية <span>{[field,kind,mode,city,experience,deadline].filter(Boolean).length||''}</span></button></div>
    {filtersOpen&&<div className="filter-panel">
      <FilterSelect label="المجال" value={field} onChange={setField} options={fields} id="field"/>
      <FilterSelect label="نوع الفرصة" value={kind} onChange={setKind} options={kinds} id="kind"/>
      <FilterSelect label="طريقة الحضور" value={mode} onChange={setMode} options={['حضوري','عن بُعد']} id="mode"/>
      <FilterSelect label="المدينة" value={city} onChange={setCity} options={cities} id="city"/>
      <FilterSelect label="المستوى" value={experience} onChange={setExperience} options={levels} id="experience"/>
      <label className="filter-control"><span>آخر موعد للتسجيل</span><input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} aria-label="آخر موعد للتسجيل" data-testid="filter-deadline"/></label>
      <button className="clear-filters" onClick={clear} data-testid="button-clear-filters">مسح الفلاتر <X size={14}/></button>
    </div>}
    <div className="results-heading"><div><strong data-testid="text-result-count">{results.length}</strong> فرصة <span>تطابق بحثك</span></div><span className="results-demo"><span className="green-dot"/>نتائج تجريبية</span></div>
    {results.length?<div className="op-grid">{results.map(o=><OpportunityCard key={o.id} item={o} saved={saved} toggleSaved={toggleSaved}/>)}</div>:<EmptyState icon={<Search size={24}/>} title="لم نعثر على نتائج" body="جرّب تغيير كلمات البحث أو إزالة بعض عوامل التصفية." action={<button className="button button-primary" onClick={clear} data-testid="button-empty-clear">إزالة جميع الفلاتر</button>}/>}
  </div>;
}
function FilterSelect({label,value,onChange,options,id}:{label:string;value:string;onChange:(v:string)=>void;options:string[];id:string}) {
  return <label className="filter-control"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)} aria-label={label} data-testid={`filter-${id}`}><option value="">الكل</option>{options.map(o=><option value={o} key={o}>{o}</option>)}</select></label>;
}
function DetailPage({id,items,saved,toggleSaved,apply}:{id:string;items:Opportunity[];saved:string[];toggleSaved:(id:string)=>void;apply:(op:Opportunity)=>void}) {
  const item=items.find(o=>o.id===id);
  if(!item)return <EmptyState icon={<Search size={24}/>} title="هذه الفرصة غير متاحة" body="قد تكون غير موجودة في البيانات التجريبية الحالية." action={<Link className="button button-primary" href="/opportunities" data-testid="link-detail-back">العودة إلى الفرص <ArrowLeft size={16}/></Link>}/>;
  const bookmarked=saved.includes(item.id);
  return <div className="page detail-page"><div className="breadcrumb"><Link href="/opportunities" data-testid="link-breadcrumb-opportunities">الفرص</Link><ChevronLeft size={15}/><span>{item.field}</span></div>
    <section className="detail-hero"><div className="detail-hero-main"><DemoTag/><div className="kind-label detail-kind">{item.kind}</div><h1>{item.title}</h1><p className="provider-name">{item.provider}</p><div className="detail-meta"><span><MapPin size={17}/>{item.location==='عن بُعد'?'عن بُعد':item.city}</span><span><Clock3 size={17}/>{item.duration}</span><span><BriefcaseBusiness size={17}/>{item.experience}</span></div></div><div className="detail-match"><div className="match-ring"><strong>{item.matchPercent}%</strong><small>ملاءمة</small></div><span>توافق مع ملفك</span></div></section>
    <div className="detail-columns"><div className="detail-main-column">
      <section className="detail-block"><h2>عن الفرصة</h2><p>{item.description}</p><p>هذه فرصة افتراضية معدّة لعرض طريقة استكشاف الفرص داخل فرصتي. التفاصيل لا تمثل جهة أو إعلاناً حقيقياً.</p></section>
      <section className="detail-block"><h2>لماذا قد تناسبك؟</h2><div className="reason-list">{item.matchReason.map((r,i)=><div key={i}><span className="reason-check"><Check size={14}/></span>{r}</div>)}</div></section>
      <section className="detail-block"><h2>المتطلبات</h2><ul className="requirements">{item.requirements.map((r,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span>{r}</li>)}</ul></section>
      <div className="method-note"><span className="method-icon"><Building2 size={18}/></span><div><strong>طريقة التقديم</strong><p>{item.applicationMethod}</p></div></div>
    </div><aside className="detail-aside"><div className="deadline-card"><div className="eyebrow">مواعيد مهمة</div><Deadline date={item.registrationStart} label="بداية التسجيل"/><Deadline date={item.deadline} label="آخر موعد للتسجيل" urgent/><Deadline date={item.programStart} label="بداية البرنامج"/></div><div className="apply-card"><div className="demo-tag"><span/>تجربة توضيحية فقط</div><h3>هل ترغب في استكشاف هذه الفرصة؟</h3><p>زر التقديم يسجل نية التقديم في هذا الجهاز فقط. لا توجد جهة خارجية مرتبطة.</p><button className="button button-primary apply-button" onClick={()=>apply(item)} data-testid={`button-apply-${item.id}`}>التقديم الآن <ArrowLeft size={17}/></button><button className={`save-detail ${bookmarked?'saved':''}`} onClick={()=>toggleSaved(item.id)} aria-pressed={bookmarked} data-testid={`button-detail-save-${item.id}`}><Bookmark size={17} fill={bookmarked?'currentColor':'none'}/>{bookmarked?'تم حفظ الفرصة':'احفظها للرجوع إليها'}</button></div><div className="local-kpi"><span className="kpi-icon"><ArrowLeft size={17}/></span><span><strong data-testid="text-detail-kpi">{getStored('applicationClicks',0)}</strong><small>انتقالات تقديم تجريبية · على هذا الجهاز</small></span></div></aside></div>
  </div>;
}
function Deadline({date,label,urgent=false}:{date:string;label:string;urgent?:boolean}) {
  return <div className="deadline-row"><span className={`deadline-icon ${urgent?'urgent':''}`}><CalendarDays size={16}/></span><span><small>{label}</small><strong>{dateLabel(date)}</strong></span></div>;
}
function ProfilePage({profile,setProfile}:{profile:Profile;setProfile:Dispatch<SetStateAction<Profile>>}) {
  const update=(key:keyof Profile,value:string)=>setProfile(prev=>({...prev,[key]:value}));
  const toggle=(key:'skills'|'interests',value:string)=>setProfile(prev=>({...prev,[key]:prev[key].includes(value)?prev[key].filter(v=>v!==value):[...prev[key],value]}));
  return <div className="page profile-page"><PageHeading eyebrow="مساحتك الشخصية" title="ملفي المهني" description="معلوماتك تساعد فرصتي على ترتيب التوصيات بحسب ما يهمك." action={<span className="saved-indicator"><CircleCheck size={16}/>يُحفظ تلقائياً</span>}/>
    <div className="profile-layout"><section className="profile-form-card"><div className="form-section-heading"><span className="section-number">01</span><div><h2>عن مسارك</h2><p>معلومات أساسية لتقريب الفرص المناسبة.</p></div></div>
      <label className="form-field"><span>التخصص</span><input value={profile.specialty} onChange={e=>update('specialty',e.target.value)} placeholder="مثال: علوم الحاسب" aria-label="التخصص" data-testid="input-profile-specialty"/></label>
      <label className="form-field"><span>المستوى الحالي</span><select value={profile.level} onChange={e=>update('level',e.target.value)} aria-label="المستوى الحالي" data-testid="select-profile-level">{levels.map(l=><option key={l}>{l}</option>)}</select></label>
      <div className="form-field"><span>المهارات <small>اختر كل ما ينطبق</small></span><div className="choice-grid">{skillsOptions.map(skill=><button className={`choice-chip ${profile.skills.includes(skill)?'chosen':''}`} onClick={()=>toggle('skills',skill)} aria-pressed={profile.skills.includes(skill)} key={skill} data-testid={`button-skill-${skillsOptions.indexOf(skill)}`}>{profile.skills.includes(skill)&&<Check size={14}/>} {skill}</button>)}</div></div>
      <div className="form-field"><span>المجالات التي تهمك <small>اختر مجالاً أو أكثر</small></span><div className="choice-grid">{fields.map((field,i)=><button className={`choice-chip ${profile.interests.includes(field)?'chosen':''}`} onClick={()=>toggle('interests',field)} aria-pressed={profile.interests.includes(field)} key={field} data-testid={`button-interest-${i}`}>{profile.interests.includes(field)&&<Check size={14}/>} {field}</button>)}</div></div>
      <div className="privacy-note"><span>i</span><p>ملفك محفوظ على هذا الجهاز فقط. لا يتم إرسال معلوماتك إلى أي جهة.</p></div>
    </section><aside className="profile-side"><div className="profile-preview"><div className="preview-avatar"><UserRound size={24}/></div><div className="eyebrow">ملفك كما تراه فرصتي</div><h3>{profile.specialty||'تخصصك'}</h3><div className="preview-level"><GraduationCap size={15}/>{profile.level}</div><div className="preview-line"/><span className="preview-label">اهتماماتك</span><div className="preview-tags">{profile.interests.length?profile.interests.map(x=><span key={x}>{x}</span>):<small>أضف مجالاً لبدء التوصيات</small>}</div></div><div className="profile-tip"><Sparkles size={18}/><p><strong>نصيحة صغيرة</strong><br/>اختيار المهارات والمجالات بدقة يساعد على إظهار سبب ملاءمة كل فرصة لك.</p></div></aside></div>
  </div>;
}
function SavedPage({items,saved,toggleSaved}:{items:Opportunity[];saved:string[];toggleSaved:(id:string)=>void}) {
  return <div className="page"><PageHeading eyebrow="قائمة شخصية" title="الفرص المحفوظة" description="احتفظ بالفرص التي لفتت انتباهك، وارجع إليها في أي وقت." action={<span className="saved-indicator"><Bookmark size={16}/>{items.length} محفوظة</span>}/>{items.length?<div className="op-grid saved-grid">{items.map(o=><OpportunityCard key={o.id} item={o} saved={saved} toggleSaved={toggleSaved}/>)}</div>:<EmptyState icon={<Bookmark size={24}/>} title="قائمتك تبدأ من هنا" body="احفظ الفرص التي تهمك بالضغط على رمز الحفظ في بطاقة الفرصة." action={<Link href="/opportunities" className="button button-primary" data-testid="link-saved-explore">استكشف الفرص <ArrowLeft size={16}/></Link>}/>}</div>;
}
function NotificationsPage({alerts,setAlerts}:{alerts:Alert[];setAlerts:Dispatch<SetStateAction<Alert[]>>}) {
  const markAll=()=>setAlerts(prev=>prev.map(a=>({...a,read:true})));
  const markRead=(id:string)=>setAlerts(prev=>prev.map(a=>a.id===id?{...a,read:true}:a));
  return <div className="page"><PageHeading eyebrow="ابقَ على اطلاع" title="التنبيهات" description="مواعيد وتحديثات مرتبطة بالفرص في هذا العرض التجريبي." action={alerts.some(a=>!a.read)&&<button className="text-button" onClick={markAll} data-testid="button-mark-all-read">تحديد الكل كمقروء <Check size={15}/></button>}/>
    <div className="alerts-card">{alerts.length?alerts.map(alert=><article className={`alert-row ${alert.read?'read':''}`} key={alert.id} data-testid={`item-alert-${alert.id}`}><span className={`alert-mark ${alert.read?'':'unread'}`}><Bell size={18}/></span><div className="alert-content"><div className="alert-title">{alert.title}</div><div className="alert-date"><CalendarDays size={14}/>{dateLabel(alert.date)} <DemoTag/></div></div><div className="alert-actions">{!alert.read&&<button onClick={()=>markRead(alert.id)} aria-label="تحديد كمقروء" title="تحديد كمقروء" data-testid={`button-read-${alert.id}`}><Check size={17}/></button>}<Link href={`/opportunities/${alert.opportunityId}`} className="alert-open" aria-label="عرض الفرصة" data-testid={`link-alert-${alert.id}`}><ArrowLeft size={17}/></Link></div></article>):<EmptyState icon={<Bell size={24}/>} title="لا توجد تنبيهات" body="ستظهر التنبيهات هنا عندما تقترب مواعيد فرصك."/>}</div>
    <div className="alerts-footnote"><span className="note-symbol">i</span>التنبيهات أمثلة محلية، ولا تُرسل إشعارات خارج هذه الصفحة.</div>
  </div>;
}
function CalendarPage({items}:{items:Opportunity[]}) {
  const events=items.flatMap(o=>[{date:o.deadline,label:'آخر موعد للتسجيل',item:o},{date:o.programStart,label:'بداية البرنامج',item:o}]).sort((a,b)=>a.date.localeCompare(b.date));
  return <div className="page calendar-page"><PageHeading eyebrow="خطتك القادمة" title="مواعيد الفرص" description="تابع مواعيد التسجيل وبدايات البرامج في خط زمني واحد." action={<div className="calendar-legend"><span className="legend-deadline"/>إغلاق التسجيل <span className="legend-start"/>بداية البرنامج</div>}/>
    <div className="calendar-summary"><div className="summary-date"><span className="eyebrow">الجدول التجريبي</span><strong>يوليو — أكتوبر ٢٠٢٦</strong></div><div className="summary-count"><CalendarDays size={19}/><strong>{events.length}</strong><span>موعداً للفرص</span></div></div>
    <div className="timeline">{events.map((ev,i)=><article className="timeline-row" key={`${ev.item.id}-${ev.label}`} data-testid={`item-calendar-${ev.item.id}-${ev.label==='آخر موعد للتسجيل'?'deadline':'start'}`}><div className="timeline-date"><strong>{shortDate(ev.date)}</strong><small>{new Intl.DateTimeFormat('ar-SA',{year:'numeric'}).format(new Date(`${ev.date}T12:00:00`))}</small></div><div className="timeline-rail"><span className={`timeline-dot ${ev.label==='بداية البرنامج'?'program':''}`}/>{i<events.length-1&&<span className="timeline-line"/>}</div><div className="timeline-event"><div className="timeline-event-top"><span className={`event-type ${ev.label==='بداية البرنامج'?'program':''}`}>{ev.label}</span><DemoTag/></div><Link href={`/opportunities/${ev.item.id}`} className="timeline-title" data-testid={`link-calendar-${ev.item.id}`}>{ev.item.title}<ArrowLeft size={15}/></Link><div className="timeline-provider">{ev.item.provider} · {ev.item.city}</div></div></article>)}</div>
  </div>;
}
function EmptyState({icon,title,body,action}:{icon:ReactNode;title:string;body:string;action?:ReactNode}) {
  return <div className="empty-state" data-testid="state-empty"><span className="empty-icon">{icon}</span><h2>{title}</h2><p>{body}</p>{action&&<div>{action}</div>}</div>;
}
const queryClient = new QueryClient();
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><ErrorBoundary><AppContent/></ErrorBoundary></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;
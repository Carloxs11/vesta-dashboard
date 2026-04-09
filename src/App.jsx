import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Cell } from "recharts";

const T={bg:"#0d0d0d",card:"#161616",border:"#282828",accent:"#8d60ca",text:"#FFFFFF",ts:"#8C8C8C",pos:"#4ADE80",neg:"#F87171",neu:"#94A3B8",c1:"#8d60ca",c2:"#60A5FA",c3:"#A78BFA",c4:"#34D399"};
const TT={backgroundColor:T.card,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:12};
const fm=(n)=>{if(!n)return"0";if(n>=1e6)return`${(n/1e6).toFixed(1)}M`;if(n>=1e3)return`${(n/1e3).toFixed(1)}K`;return typeof n==="number"?n.toLocaleString("es-ES"):n};
const fc=(n)=>`€${Number(n||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const SB=({s})=>{const m={ACTIVE:{b:"rgba(74,222,128,0.15)",c:T.pos,l:"Activa"},PAUSED:{b:"rgba(148,163,184,0.15)",c:T.neu,l:"Pausada"}};const v=m[s]||m.PAUSED;return (<span style={{background:v.b,color:v.c,padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600}}>{v.l}</span>);};

// ─── DAILY DATA (account level, 31 days) ─────────────────────────────────
const ALL_DAILY=[
{d:"2026-03-09",spend:16.02,imp:6696,clicks:192,ctr:2.87,cpc:0.08,purch:2,leads:0,vv:1026},
{d:"2026-03-10",spend:258.62,imp:110644,clicks:2464,ctr:2.23,cpc:0.10,purch:0,leads:285,vv:3253},
{d:"2026-03-11",spend:225.11,imp:78747,clicks:1865,ctr:2.37,cpc:0.12,purch:0,leads:200,vv:2777},
{d:"2026-03-12",spend:285.64,imp:99184,clicks:2086,ctr:2.10,cpc:0.14,purch:0,leads:206,vv:4030},
{d:"2026-03-13",spend:415.95,imp:121098,clicks:2477,ctr:2.05,cpc:0.17,purch:0,leads:243,vv:4934},
{d:"2026-03-14",spend:472.45,imp:128967,clicks:2573,ctr:2.00,cpc:0.18,purch:0,leads:247,vv:6178},
{d:"2026-03-15",spend:432.37,imp:109797,clicks:2562,ctr:2.33,cpc:0.17,purch:112,leads:238,vv:7109},
{d:"2026-03-16",spend:57.17,imp:21312,clicks:776,ctr:3.64,cpc:0.07,purch:8,leads:0,vv:4589},
{d:"2026-03-17",spend:55.99,imp:22714,clicks:831,ctr:3.66,cpc:0.07,purch:1,leads:0,vv:3352},
{d:"2026-03-18",spend:64.30,imp:32548,clicks:815,ctr:2.50,cpc:0.08,purch:1,leads:0,vv:982},
{d:"2026-03-19",spend:62.11,imp:30304,clicks:762,ctr:2.51,cpc:0.08,purch:1,leads:0,vv:2511},
{d:"2026-03-20",spend:69.00,imp:35644,clicks:797,ctr:2.24,cpc:0.09,purch:22,leads:0,vv:3177},
{d:"2026-03-21",spend:52.05,imp:25528,clicks:589,ctr:2.31,cpc:0.09,purch:0,leads:0,vv:989},
{d:"2026-03-22",spend:69.39,imp:35226,clicks:745,ctr:2.11,cpc:0.09,purch:3,leads:0,vv:2817},
{d:"2026-03-23",spend:55.29,imp:27260,clicks:562,ctr:2.06,cpc:0.10,purch:9,leads:0,vv:2163},
{d:"2026-03-24",spend:51.64,imp:25001,clicks:564,ctr:2.26,cpc:0.09,purch:8,leads:0,vv:1459},
{d:"2026-03-25",spend:51.04,imp:23135,clicks:550,ctr:2.38,cpc:0.09,purch:1,leads:0,vv:1148},
{d:"2026-03-26",spend:45.50,imp:21062,clicks:467,ctr:2.22,cpc:0.10,purch:2,leads:0,vv:1305},
{d:"2026-03-27",spend:37.36,imp:17784,clicks:427,ctr:2.40,cpc:0.09,purch:6,leads:0,vv:1417},
{d:"2026-03-28",spend:44.26,imp:23679,clicks:479,ctr:2.02,cpc:0.09,purch:1,leads:0,vv:1626},
{d:"2026-03-29",spend:53.49,imp:30207,clicks:576,ctr:1.91,cpc:0.09,purch:2,leads:0,vv:1686},
{d:"2026-03-30",spend:51.69,imp:28777,clicks:547,ctr:1.90,cpc:0.09,purch:0,leads:0,vv:1683},
{d:"2026-03-31",spend:48.92,imp:23945,clicks:506,ctr:2.11,cpc:0.10,purch:3,leads:0,vv:1545},
{d:"2026-04-01",spend:44.84,imp:20578,clicks:447,ctr:2.17,cpc:0.10,purch:3,leads:0,vv:1687},
{d:"2026-04-02",spend:46.73,imp:24786,clicks:491,ctr:1.98,cpc:0.10,purch:2,leads:0,vv:1497},
{d:"2026-04-03",spend:44.53,imp:26190,clicks:494,ctr:1.89,cpc:0.09,purch:4,leads:0,vv:1277},
{d:"2026-04-04",spend:48.84,imp:27089,clicks:468,ctr:1.73,cpc:0.10,purch:1,leads:0,vv:1481},
{d:"2026-04-05",spend:58.05,imp:30699,clicks:687,ctr:2.24,cpc:0.08,purch:0,leads:0,vv:1671},
{d:"2026-04-06",spend:50.27,imp:24105,clicks:626,ctr:2.60,cpc:0.08,purch:2,leads:0,vv:1802},
{d:"2026-04-07",spend:51.62,imp:22197,clicks:553,ctr:2.49,cpc:0.09,purch:0,leads:0,vv:1528},
{d:"2026-04-08",spend:294.99,imp:97613,clicks:2440,ctr:2.50,cpc:0.12,purch:0,leads:320,vv:14756},
];

// ─── CAMPAIGN DAILY DATA (from level=campaign API) ──────────────────────
// c: campaign key, d: date, sp: spend, im: impressions, cl: clicks, pu: purchases, le: leads
const CAMP_DAILY=[
// TRÁFICO PERFIL-ES (tp) — active entire period
{c:"tp",d:"2026-03-09",sp:7.77,im:4329,cl:84},{c:"tp",d:"2026-03-10",sp:24.39,im:10825,cl:399},{c:"tp",d:"2026-03-11",sp:16.26,im:7466,cl:272},{c:"tp",d:"2026-03-12",sp:17.62,im:8659,cl:283},{c:"tp",d:"2026-03-13",sp:17.32,im:8180,cl:258},{c:"tp",d:"2026-03-14",sp:20.86,im:9691,cl:366},{c:"tp",d:"2026-03-15",sp:23.35,im:12277,cl:311},{c:"tp",d:"2026-03-16",sp:19.19,im:9874,cl:272},{c:"tp",d:"2026-03-17",sp:21.84,im:11300,cl:345},{c:"tp",d:"2026-03-18",sp:27.75,im:14834,cl:466},{c:"tp",d:"2026-03-19",sp:30.19,im:15538,cl:461},{c:"tp",d:"2026-03-20",sp:39.86,im:22008,cl:554},{c:"tp",d:"2026-03-21",sp:18.48,im:9728,cl:298},{c:"tp",d:"2026-03-22",sp:34.45,im:19781,cl:529},{c:"tp",d:"2026-03-23",sp:21.32,im:11962,cl:328},{c:"tp",d:"2026-03-24",sp:18.63,im:9964,cl:331},{c:"tp",d:"2026-03-25",sp:15.12,im:8098,cl:240},{c:"tp",d:"2026-03-26",sp:13.57,im:7036,cl:225},{c:"tp",d:"2026-03-27",sp:12.86,im:7231,cl:203},{c:"tp",d:"2026-03-28",sp:16.19,im:9163,cl:209},{c:"tp",d:"2026-03-29",sp:15.23,im:8357,cl:224},{c:"tp",d:"2026-03-30",sp:15.13,im:8547,cl:209},{c:"tp",d:"2026-03-31",sp:13.55,im:6906,cl:171},{c:"tp",d:"2026-04-01",sp:15.19,im:8036,cl:204},{c:"tp",d:"2026-04-02",sp:15.30,im:9358,cl:228},{c:"tp",d:"2026-04-03",sp:15.37,im:9701,cl:224},{c:"tp",d:"2026-04-04",sp:15.18,im:9523,cl:220},{c:"tp",d:"2026-04-05",sp:16.43,im:10384,cl:231},{c:"tp",d:"2026-04-06",sp:15.02,im:9423,cl:226},{c:"tp",d:"2026-04-07",sp:14.50,im:8195,cl:178},{c:"tp",d:"2026-04-08",sp:77.27,im:35490,cl:656},
// TRÁFICO PERFIL VESTA-EUR+EEUU (tv) 
{c:"tv",d:"2026-03-09",sp:8.25,im:2367,cl:108},{c:"tv",d:"2026-03-10",sp:21.79,im:5971,cl:326},{c:"tv",d:"2026-03-11",sp:16.16,im:4660,cl:310},{c:"tv",d:"2026-03-12",sp:26.02,im:7355,cl:448},{c:"tv",d:"2026-03-13",sp:37.05,im:10061,cl:578},{c:"tv",d:"2026-03-14",sp:40.60,im:10379,cl:547},{c:"tv",d:"2026-03-15",sp:47.99,im:14209,cl:708},{c:"tv",d:"2026-03-16",sp:37.98,im:11438,cl:504},{c:"tv",d:"2026-03-17",sp:27.11,im:7350,cl:352},
// LEADS-NEW DROP-ES (ld) — high spend Mar 10-15
{c:"ld",d:"2026-03-10",sp:152.21,im:80379,cl:1350,le:213},{c:"ld",d:"2026-03-11",sp:130.77,im:55502,cl:913,le:128},{c:"ld",d:"2026-03-12",sp:154.99,im:65390,cl:909,le:125},{c:"ld",d:"2026-03-13",sp:212.90,im:82675,cl:1011,le:122},{c:"ld",d:"2026-03-14",sp:258.56,im:87186,cl:1060,le:133},{c:"ld",d:"2026-03-15",sp:235.68,im:61306,cl:950,pu:112,le:140},
// LEADS-NEW DROP-ES (continued, lower spend with subaccounts)
{c:"ld",d:"2026-03-10",sp:60.23,im:13469,cl:389,le:72},{c:"ld",d:"2026-03-11",sp:61.92,im:11119,cl:370,le:72},{c:"ld",d:"2026-03-12",sp:87.01,im:17780,cl:446,le:81},{c:"ld",d:"2026-03-13",sp:148.68,im:20182,cl:630,le:121},{c:"ld",d:"2026-03-14",sp:152.43,im:21711,cl:600,le:114},{c:"ld",d:"2026-03-15",sp:125.35,im:22005,cl:593,le:98},
// CBO-ABIERTA (cb) — spread across the period
{c:"cb",d:"2026-03-18",sp:33.55,im:16021,cl:221,pu:1},{c:"cb",d:"2026-03-19",sp:28.87,im:13036,cl:188},{c:"cb",d:"2026-03-20",sp:26.22,im:12065,cl:161},{c:"cb",d:"2026-03-21",sp:30.22,im:13961,cl:182},{c:"cb",d:"2026-03-22",sp:32.99,im:14348,cl:168,pu:2},{c:"cb",d:"2026-03-23",sp:31.08,im:13722,cl:143,pu:1},{c:"cb",d:"2026-03-24",sp:29.80,im:13312,cl:141},{c:"cb",d:"2026-03-25",sp:29.20,im:11652,cl:135},{c:"cb",d:"2026-03-26",sp:25.41,im:11044,cl:96},{c:"cb",d:"2026-03-27",sp:18.50,im:7597,cl:73,pu:3},{c:"cb",d:"2026-03-28",sp:21.36,im:10916,cl:109},{c:"cb",d:"2026-03-29",sp:30.16,im:16942,cl:190,pu:1},{c:"cb",d:"2026-03-30",sp:26.49,im:15401,cl:167},{c:"cb",d:"2026-03-31",sp:24.45,im:11703,cl:155},{c:"cb",d:"2026-04-01",sp:23.02,im:9321,cl:141},{c:"cb",d:"2026-04-02",sp:24.36,im:11779,cl:148},{c:"cb",d:"2026-04-03",sp:21.65,im:12095,cl:127},{c:"cb",d:"2026-04-04",sp:24.51,im:14317,cl:162},{c:"cb",d:"2026-04-05",sp:27.39,im:13317,cl:195},{c:"cb",d:"2026-04-06",sp:26.58,im:11041,cl:217,pu:1},{c:"cb",d:"2026-04-07",sp:27.19,im:10600,cl:154},
// Retargeting_MEDIA (rt)
{c:"rt",d:"2026-03-09",sp:0,im:0,cl:0,pu:2},{c:"rt",d:"2026-03-16",sp:0,im:0,cl:0,pu:8},{c:"rt",d:"2026-03-17",sp:0,im:0,cl:0,pu:1},{c:"rt",d:"2026-03-18",sp:3.00,im:1693,cl:128},{c:"rt",d:"2026-03-19",sp:3.05,im:1730,cl:113,pu:1},{c:"rt",d:"2026-03-20",sp:2.92,im:1571,cl:82,pu:2},{c:"rt",d:"2026-03-21",sp:1.95,im:1097,cl:48},{c:"rt",d:"2026-03-22",sp:1.95,im:1576,cl:91},{c:"rt",d:"2026-03-23",sp:2.89,im:1576,cl:91,pu:8},{c:"rt",d:"2026-03-24",sp:3.21,im:1725,cl:92,pu:8},{c:"rt",d:"2026-03-25",sp:6.72,im:3385,cl:175,pu:1},{c:"rt",d:"2026-03-26",sp:6.52,im:2982,cl:146,pu:2},{c:"rt",d:"2026-03-27",sp:6.00,im:2956,cl:151,pu:3},{c:"rt",d:"2026-03-28",sp:6.71,im:3600,cl:161,pu:1},{c:"rt",d:"2026-03-29",sp:8.10,im:4908,cl:162,pu:1},{c:"rt",d:"2026-03-30",sp:10.07,im:4829,cl:171},{c:"rt",d:"2026-03-31",sp:10.92,im:5336,cl:180,pu:3},{c:"rt",d:"2026-04-01",sp:6.63,im:3221,cl:102,pu:3},{c:"rt",d:"2026-04-02",sp:7.07,im:3649,cl:115,pu:2},{c:"rt",d:"2026-04-03",sp:7.51,im:4394,cl:143,pu:4},{c:"rt",d:"2026-04-04",sp:9.15,im:3249,cl:86,pu:1},{c:"rt",d:"2026-04-05",sp:14.23,im:6998,cl:261},{c:"rt",d:"2026-04-06",sp:8.67,im:3641,cl:183,pu:1},{c:"rt",d:"2026-04-07",sp:9.93,im:3402,cl:221},{c:"rt",d:"2026-04-08",sp:3.60,im:1163,cl:17},
// CLIENTES POTENCIALES RESTOCK (cp) — only Apr 8
{c:"cp",d:"2026-04-08",sp:206.39,im:59062,cl:1648,le:320},
{c:"cp2",d:"2026-04-08",sp:7.73,im:1898,cl:119},
];

const CAMP_META={
tp:{name:"TRÁFICO PERFIL-ES",status:"ACTIVE"},
tv:{name:"TRÁFICO PERFIL VESTA-EUR+EEUU",status:"PAUSED"},
ld:{name:"LEADS-NEW DROP-ES",status:"PAUSED"},
cb:{name:"CBO-ABIERTA",status:"PAUSED"},
rt:{name:"Retargeting_MEDIA",status:"ACTIVE"},
cp:{name:"CLIENTES POT. RESTOCK",status:"ACTIVE"},
cp2:{name:"RESTOCK (Video Rubén)",status:"ACTIVE"},
};

const ADS_DATA=[
{name:"VIDEO REBRANDING (Perfil)",spend:300.46,imp:160837,cl:4831,ctr:3.00,leads:0,pu:0,roas:0,vv:31196,emoji:"🎬",color:"#8d60ca"},
{name:"VIDEO REBRANDING (Tráfico)",spend:181.79,imp:48935,cl:2866,ctr:5.86,leads:0,pu:0,roas:0,vv:12812,emoji:"🎬",color:"#7c4fb8"},
{name:"VIDEO ESPAÑOL",spend:176.90,imp:98599,cl:2701,ctr:2.74,leads:0,pu:0,roas:0,vv:5925,emoji:"🇪🇸",color:"#60A5FA"},
{name:"VIDEO RUBEN (Leads)",spend:119.05,imp:33191,cl:960,ctr:2.89,leads:174,pu:0,roas:0,vv:4653,emoji:"👤",color:"#34D399"},
{name:"this sunday at 7pm",spend:71.10,imp:21262,cl:850,ctr:4.00,leads:0,pu:0,roas:0,vv:3801,emoji:"📅",color:"#A78BFA"},
{name:"VIDEO RUBEN (Tráfico)",spend:48.13,imp:22890,cl:400,ctr:1.75,leads:0,pu:0,roas:0,vv:5498,emoji:"👤",color:"#06B6D4"},
{name:"rebranding_estatico_67",spend:46.20,imp:22818,cl:810,ctr:3.55,leads:0,pu:24,roas:18.00,vv:7,emoji:"🖼️",color:"#F59E0B"},
{name:"the new polos - Copia",spend:45.05,imp:23420,cl:554,ctr:2.37,leads:0,pu:0,roas:0,vv:8551,emoji:"👕",color:"#EC4899"},
{name:"VIDEO ESPAÑOL - Copia",spend:28.66,imp:12850,cl:241,ctr:1.88,leads:0,pu:0,roas:0,vv:3438,emoji:"🇪🇸",color:"#8B5CF6"},
{name:"AD_8960 (Lead Gen)",spend:28.02,imp:7741,cl:200,ctr:2.58,leads:42,pu:0,roas:0,vv:0,emoji:"📊",color:"#10B981"},
{name:"AD_8970 (Lead Gen)",spend:22.15,imp:6274,cl:223,ctr:3.55,leads:52,pu:0,roas:0,vv:0,emoji:"📈",color:"#F97316"},
{name:"NOS HEMOS ARRUINADO",spend:16.26,imp:7063,cl:171,ctr:2.42,leads:0,pu:0,roas:0,vv:2503,emoji:"💥",color:"#EF4444"},
{name:"VIDEO RUBEN (Perfil 2)",spend:15.64,imp:4001,cl:78,ctr:1.95,leads:14,pu:0,roas:0,vv:790,emoji:"👤",color:"#14B8A6"},
{name:"AD_8972 (Lead Gen)",spend:8.64,imp:3165,cl:80,ctr:2.53,leads:18,pu:0,roas:0,vv:0,emoji:"📋",color:"#84CC16"},
{name:"AD_8958 (Lead Gen)",spend:8.44,imp:3215,cl:75,ctr:2.33,leads:16,pu:0,roas:0,vv:0,emoji:"📝",color:"#D946EF"},
{name:"the new polos",spend:7.64,imp:2815,cl:132,ctr:4.69,leads:0,pu:0,roas:0,vv:1076,emoji:"👕",color:"#F43F5E"},
{name:"REELS Traje Militar",spend:6.62,imp:4327,cl:70,ctr:1.62,leads:0,pu:0,roas:0,vv:1670,emoji:"🎖️",color:"#78716C"},
{name:"VIDEO NEW VESTA DENIM",spend:4.84,imp:2363,cl:41,ctr:1.74,leads:0,pu:0,roas:0,vv:408,emoji:"👖",color:"#0EA5E9"},
{name:"AD_8957 (Lead Gen)",spend:3.18,imp:982,cl:20,ctr:2.04,leads:3,pu:0,roas:0,vv:0,emoji:"📄",color:"#A3E635"},
{name:"VIDEO NEW DROP",spend:2.54,imp:1132,cl:35,ctr:3.09,leads:0,pu:0,roas:0,vv:214,emoji:"❓",color:"#FBBF24"},
{name:"VIDEO NEW DROP (2)",spend:1.45,imp:703,cl:20,ctr:2.84,leads:0,pu:0,roas:0,vv:122,emoji:"❓",color:"#FB923C"},
{name:"8686 (Retargeting)",spend:0,imp:0,cl:0,ctr:0,leads:0,pu:2,roas:0,vv:0,emoji:"🔄",color:"#94A3B8"},
];

const PRESETS=[
{l:"7d",fn:()=>[new Date("2026-04-01"),new Date("2026-04-08")]},
{l:"14d",fn:()=>[new Date("2026-03-25"),new Date("2026-04-08")]},
{l:"30d",fn:()=>[new Date("2026-03-09"),new Date("2026-04-08")]},
{l:"Mar",fn:()=>[new Date("2026-03-01"),new Date("2026-03-31")]},
{l:"Abr",fn:()=>[new Date("2026-04-01"),new Date("2026-04-08")]},
{l:"Todo",fn:()=>[new Date("2026-03-09"),new Date("2026-04-08")]},
];

const NAV=[{id:"overview",l:"Vista General",i:"◈"},{id:"campaigns",l:"Campañas",i:"◉"},{id:"analytics",l:"Analítica",i:"◆"},{id:"creatives",l:"Creatividades",i:"◇"},{id:"budget",l:"Presupuesto",i:"◐"}];

export default function App(){
  const[page,setPage]=useState("overview");
  const[dr,setDr]=useState(()=>PRESETS[2].fn());
  const[ap,setAp]=useState("30d");
  const[showC,setShowC]=useState(false);
  const[cf,setCf]=useState("");
  const[ct,setCt]=useState("");

  const since=dr[0].toISOString().slice(0,10),until=dr[1].toISOString().slice(0,10);

  // Filter daily data by date range
  const filtered=useMemo(()=>ALL_DAILY.filter(d=>d.d>=since&&d.d<=until).map(d=>({...d,date:`${new Date(d.d).getDate()}/${new Date(d.d).getMonth()+1}`})),[since,until]);

  // Aggregate totals from filtered daily
  const tot=useMemo(()=>{
    const s=filtered.reduce((a,d)=>a+d.spend,0);
    const im=filtered.reduce((a,d)=>a+d.imp,0);
    const c=filtered.reduce((a,d)=>a+d.clicks,0);
    const p=filtered.reduce((a,d)=>a+d.purch,0);
    const l=filtered.reduce((a,d)=>a+d.leads,0);
    return{spend:s,imp:im,clicks:c,purch:p,leads:l};
  },[filtered]);

  // Aggregate campaigns by date range
  const camps=useMemo(()=>{
    const byC={};
    CAMP_DAILY.filter(r=>r.d>=since&&r.d<=until).forEach(r=>{
      if(!byC[r.c])byC[r.c]={spend:0,imp:0,clicks:0,purch:0,leads:0};
      byC[r.c].spend+=r.sp||0;
      byC[r.c].imp+=r.im||0;
      byC[r.c].clicks+=r.cl||0;
      byC[r.c].purch+=r.pu||0;
      byC[r.c].leads+=r.le||0;
    });
    return Object.entries(byC).filter(([k,v])=>v.spend>0||v.purch>0).map(([k,v])=>{
      const m=CAMP_META[k]||{name:k,status:"PAUSED"};
      const ctr=v.imp>0?(v.clicks/v.imp*100):0;
      const cpc=v.clicks>0?v.spend/v.clicks:0;
      return{id:k,...m,...v,ctr:+ctr.toFixed(2),cpc:+cpc.toFixed(2)};
    }).sort((a,b)=>b.spend-a.spend);
  },[since,until]);

  const selP=(p)=>{setDr(p.fn());setAp(p.l);setShowC(false)};
  const applyC=()=>{if(cf&&ct){setDr([new Date(cf),new Date(ct)]);setAp("custom");setShowC(false);}};

  // Revenue estimate (from campaigns with known ROAS)
  const totalRev=useMemo(()=>{
    // LEADS campaign: ROAS 9.56 on its spend in range
    const ldSpend=camps.find(c=>c.id==="ld")?.spend||0;
    const rtSpend=camps.find(c=>c.id==="rt")?.spend||0;
    const cbSpend=camps.find(c=>c.id==="cb")?.spend||0;
    return ldSpend*9.56+rtSpend*14.64+cbSpend*1.20;
  },[camps]);

  return(
    <div style={{display:"flex",height:"100vh",background:T.bg,fontFamily:"'Segoe UI',-apple-system,sans-serif",color:T.text,overflow:"hidden"}}>
      <div style={{width:210,minWidth:210,background:T.card,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${T.accent},#6b3fa0)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#fff"}}>V</div>
            <div><div style={{fontSize:14,fontWeight:700}}>Vesta Garments</div><div style={{fontSize:10,color:T.ts}}>Datos reales</div></div>
          </div>
        </div>
        <nav style={{padding:"12px 10px",flex:1}}>{NAV.map(n=>(<button key={n.id} onClick={()=>setPage(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:2,border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:page===n.id?600:400,color:page===n.id?T.text:T.ts,background:page===n.id?`${T.accent}1a`:"transparent",borderLeft:page===n.id?`3px solid ${T.accent}`:"3px solid transparent",textAlign:"left",fontFamily:"inherit"}}><span style={{fontSize:15,opacity:page===n.id?1:0.6}}>{n.i}</span>{n.l}</button>))}</nav>
        <div style={{padding:"10px",borderTop:`1px solid ${T.border}`,fontSize:9,color:T.ts,textAlign:"center"}}>act_1841424273047570</div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* DATE BAR */}
        <div style={{padding:"10px 24px",borderBottom:`1px solid ${T.border}`,background:T.card,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:12,color:T.ts}}><span style={{fontWeight:600,color:T.text}}>{since.split("-").reverse().join("/")}</span><span style={{margin:"0 6px"}}>→</span><span style={{fontWeight:600,color:T.text}}>{until.split("-").reverse().join("/")}</span><span style={{marginLeft:10}}>({filtered.length} días)</span></div>
          <div style={{display:"flex",gap:4,alignItems:"center",position:"relative"}}>
            {PRESETS.map(p=>(<button key={p.l} onClick={()=>selP(p)} style={{background:ap===p.l?T.accent:T.bg,border:`1px solid ${ap===p.l?T.accent:T.border}`,borderRadius:6,padding:"4px 10px",color:T.text,fontSize:11,cursor:"pointer",fontWeight:ap===p.l?600:400}}>{p.l}</button>))}
            <button onClick={()=>setShowC(!showC)} style={{background:ap==="custom"?T.accent:T.bg,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 9px",color:T.text,fontSize:11,cursor:"pointer"}}>📅</button>
            {showC&&<div style={{position:"absolute",top:"100%",right:0,marginTop:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14,zIndex:100,display:"flex",gap:8,alignItems:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}><input type="date" value={cf} onChange={e=>setCf(e.target.value)} min="2026-03-09" max="2026-04-08" style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",color:T.text,fontSize:12}}/><span style={{color:T.ts}}>→</span><input type="date" value={ct} onChange={e=>setCt(e.target.value)} min="2026-03-09" max="2026-04-08" style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 10px",color:T.text,fontSize:12}}/><button onClick={applyC} style={{background:T.accent,border:"none",borderRadius:6,padding:"6px 14px",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:600}}>OK</button></div>}
          </div>
        </div>
        <div style={{flex:1,overflow:"auto",padding:24}}>
          {page==="overview"&&<OV f={filtered} t={tot} c={camps} rev={totalRev} onNav={setPage}/>}
          {page==="campaigns"&&<CP c={camps}/>}
          {page==="analytics"&&<AN f={filtered} t={tot} c={camps} rev={totalRev}/>}
          {page==="creatives"&&<CR a={ADS_DATA}/>}
          {page==="budget"&&<BU c={camps} f={filtered} t={tot}/>}
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW ───────────────────────────────────────────────────────────────
function OV({f,t,c,rev,onNav}){
  const roas=t.spend>0?rev/t.spend:0;
  const kpis=[{l:"Gasto",v:fc(t.spend),i:"💰"},{l:"Revenue",v:rev>0?fc(rev):"—",s:t.purch>0?`${t.purch} compras`:null,i:"📈"},{l:"ROAS",v:roas>0?`${roas.toFixed(2)}x`:"—",i:"🎯"},{l:"Leads",v:t.leads>0?t.leads.toLocaleString():"—",s:t.leads>0?`${(t.spend/t.leads).toFixed(2)}€/lead`:null,i:"👥"}];
  return(<div>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>Vista General</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>{kpis.map(k=>(<div key={k.l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{color:T.ts,fontSize:12}}>{k.l}</span><span style={{fontSize:18}}>{k.i}</span></div><div style={{fontFamily:"monospace",fontSize:24,fontWeight:700,marginBottom:3}}>{k.v}</div>{k.s&&<span style={{color:T.ts,fontSize:11}}>{k.s}</span>}</div>))}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Gasto Diario</h3><ResponsiveContainer width="100%" height={260}><ComposedChart data={f}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={{stroke:T.border}}/><YAxis tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={false} tickFormatter={v=>`€${v}`}/><Tooltip contentStyle={TT}/><Area type="monotone" dataKey="spend" fill="rgba(141,96,202,0.15)" stroke={T.c1} strokeWidth={2} name="Gasto €"/></ComposedChart></ResponsiveContainer></div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Conversiones</h3><ResponsiveContainer width="100%" height={260}><ComposedChart data={f}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={{stroke:T.border}}/><YAxis tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={false}/><Tooltip contentStyle={TT}/><Bar dataKey="purch" fill={T.pos} radius={[3,3,0,0]} name="Compras"/><Bar dataKey="leads" fill={T.c2} radius={[3,3,0,0]} name="Leads"/></ComposedChart></ResponsiveContainer></div>
    </div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontSize:14,fontWeight:600}}>Campañas ({c.length})</h3><span onClick={()=>onNav("campaigns")} style={{color:T.accent,fontSize:12,cursor:"pointer"}}>Ver todas →</span></div>
      {c.length===0?<div style={{color:T.ts,padding:20,textAlign:"center"}}>Sin actividad en este periodo</div>:
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Campaña","Estado","Gasto","Impresiones","Clics","Compras","Leads"].map(h=>(<th key={h} style={{textAlign:"left",padding:"8px 10px",color:T.ts,fontSize:10,fontWeight:600,borderBottom:`1px solid ${T.border}`,textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{c.map(x=>(<tr key={x.id} style={{borderBottom:`1px solid ${T.border}`}}><td style={{padding:10,fontSize:12,fontWeight:500,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.name}</td><td style={{padding:10}}><SB s={x.status}/></td><td style={{padding:10,fontFamily:"monospace",fontSize:12}}>{fc(x.spend)}</td><td style={{padding:10,fontFamily:"monospace",fontSize:12,color:T.ts}}>{fm(x.imp)}</td><td style={{padding:10,fontFamily:"monospace",fontSize:12,color:T.ts}}>{fm(x.clicks)}</td><td style={{padding:10,fontFamily:"monospace",fontSize:12}}>{x.purch||"—"}</td><td style={{padding:10,fontFamily:"monospace",fontSize:12,color:x.leads>0?T.c2:T.ts}}>{x.leads||"—"}</td></tr>))}</tbody></table>}
    </div>
  </div>);
}

// ─── CAMPAIGNS ──────────────────────────────────────────────────────────────
function CP({c}){
  const[s,setS]=useState("");
  const[sk,setSk]=useState("spend");
  const[sd,setSd]=useState(-1);
  const tog=k=>{if(sk===k)setSd(d=>d*-1);else{setSk(k);setSd(-1)}};
  const fl=useMemo(()=>[...c].filter(x=>x.name.toLowerCase().includes(s.toLowerCase())).sort((a,b)=>(a[sk]>b[sk]?1:-1)*sd),[c,s,sk,sd]);
  const cols=[{k:"name",l:"Campaña"},{k:"status",l:"Estado"},{k:"spend",l:"Gasto"},{k:"imp",l:"Impr."},{k:"clicks",l:"Clics"},{k:"ctr",l:"CTR"},{k:"cpc",l:"CPC"},{k:"purch",l:"Compras"},{k:"leads",l:"Leads"}];
  return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700}}>Campañas ({c.length})</h2><input placeholder="Buscar..." value={s} onChange={e=>setS(e.target.value)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 14px",color:T.text,fontSize:13,width:200,outline:"none"}}/></div>
    {fl.length===0?<div style={{padding:40,textAlign:"center",color:T.ts}}>Sin campañas activas en este periodo</div>:
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}><thead><tr>{cols.map(c=>(<th key={c.k} onClick={()=>tog(c.k)} style={{textAlign:"left",padding:"12px 10px",color:sk===c.k?T.accent:T.ts,fontSize:10,fontWeight:600,borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>{c.l}{sk===c.k?(sd===1?" ↑":" ↓"):""}</th>))}</tr></thead><tbody>{fl.map(x=>(<tr key={x.id} style={{borderBottom:`1px solid ${T.border}`}} onMouseEnter={e=>e.currentTarget.style.background="rgba(141,96,202,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"11px 10px",fontSize:12,fontWeight:500,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.name}</td><td style={{padding:"11px 10px"}}><SB s={x.status}/></td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12}}>{fc(x.spend)}</td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12,color:T.ts}}>{fm(x.imp)}</td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12,color:T.ts}}>{fm(x.clicks)}</td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12,color:T.ts}}>{x.ctr}%</td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12,color:T.ts}}>€{x.cpc}</td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12}}>{x.purch||"—"}</td><td style={{padding:"11px 10px",fontFamily:"monospace",fontSize:12,color:x.leads>0?T.c2:T.ts}}>{x.leads||"—"}</td></tr>))}</tbody></table></div></div>}
  </div>);
}

// ─── ANALYTICS ──────────────────────────────────────────────────────────────
function AN({f,t,c,rev}){
  const roas=t.spend>0?rev/t.spend:0;
  const ms=[{l:"Gasto",v:fc(t.spend)},{l:"Revenue",v:rev>0?fc(rev):"—"},{l:"ROAS",v:roas>0?`${roas.toFixed(2)}x`:"—"},{l:"Compras",v:t.purch||"—"},{l:"Leads",v:t.leads||"—"},{l:"€/Lead",v:t.leads>0?`€${(t.spend/t.leads).toFixed(2)}`:"—"},{l:"Impresiones",v:fm(t.imp)},{l:"Clics",v:fm(t.clicks)}];
  return(<div>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>Analítica</h2>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Impresiones y Clics</h3><ResponsiveContainer width="100%" height={240}><LineChart data={f}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fill:T.ts,fontSize:9}} tickLine={false}/><YAxis tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={false}/><Tooltip contentStyle={TT}/><Line type="monotone" dataKey="imp" stroke={T.c3} strokeWidth={2} dot={false} name="Impresiones"/><Line type="monotone" dataKey="clicks" stroke={T.c4} strokeWidth={2} dot={false} name="Clics"/></LineChart></ResponsiveContainer></div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Video Views</h3><ResponsiveContainer width="100%" height={240}><ComposedChart data={f}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fill:T.ts,fontSize:9}} tickLine={false}/><YAxis tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={false}/><Tooltip contentStyle={TT}/><Area type="monotone" dataKey="vv" fill="rgba(167,139,250,0.15)" stroke={T.c3} strokeWidth={2} name="Views"/></ComposedChart></ResponsiveContainer></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Gasto por Campaña</h3>
        {c.length>0?<ResponsiveContainer width="100%" height={240}><BarChart data={c.slice(0,6).map(x=>({name:x.name.length>20?x.name.slice(0,20)+"…":x.name,spend:x.spend}))} layout="vertical" margin={{left:10}}><CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/><XAxis type="number" tick={{fill:T.ts,fontSize:9}} tickFormatter={v=>`€${v}`}/><YAxis dataKey="name" type="category" tick={{fill:T.ts,fontSize:9}} width={130}/><Tooltip contentStyle={TT}/><Bar dataKey="spend" fill={T.c1} radius={[0,4,4,0]} name="Gasto €"/></BarChart></ResponsiveContainer>:<div style={{color:T.ts,padding:40,textAlign:"center"}}>Sin datos</div>}
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>KPIs del Periodo</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{ms.map(m=>(<div key={m.l} style={{padding:10,background:"#1a1a1a",borderRadius:8}}><div style={{fontSize:9,color:T.ts,textTransform:"uppercase",marginBottom:3}}>{m.l}</div><div style={{fontFamily:"monospace",fontSize:16,fontWeight:700}}>{m.v}</div></div>))}</div></div>
    </div>
  </div>);
}

// ─── CREATIVES ──────────────────────────────────────────────────────────────
function CR({a}){
  const[fl,setFl]=useState("all");
  const fd=a.filter(x=>{if(fl==="video")return x.vv>0;if(fl==="lead")return x.leads>0;if(fl==="sales")return x.pu>0;return true;});
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
      <h2 style={{fontSize:22,fontWeight:700}}>Creatividades ({a.length} anuncios)</h2>
      <div style={{display:"flex",gap:5}}>{[{k:"all",l:"Todos"},{k:"video",l:"Videos"},{k:"lead",l:"Con leads"},{k:"sales",l:"Con ventas"}].map(t=>(<button key={t.k} onClick={()=>setFl(t.k)} style={{background:fl===t.k?T.accent:T.card,border:`1px solid ${fl===t.k?T.accent:T.border}`,borderRadius:6,padding:"4px 10px",color:T.text,fontSize:11,cursor:"pointer",fontWeight:fl===t.k?600:400}}>{t.l}</button>))}</div>
    </div>
    <div style={{fontSize:11,color:T.ts,marginBottom:16}}>📊 Datos del periodo completo: 9 Mar – 8 Abr 2026 · No se actualiza con el selector de fechas (limitación de la API)</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{fd.map((x,i)=>(<div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
      <div style={{height:90,background:`linear-gradient(135deg, ${x.color}22, ${x.color}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,position:"relative"}}>{x.emoji}{x.roas>0&&<div style={{position:"absolute",top:6,right:8,fontSize:10,color:"#fff",background:T.pos+"dd",padding:"2px 8px",borderRadius:4,fontWeight:700,fontFamily:"monospace"}}>{x.roas.toFixed(1)}x ROAS</div>}{x.pu>0&&<div style={{position:"absolute",bottom:6,right:8,fontSize:9,color:"#fff",background:T.pos+"cc",padding:"2px 6px",borderRadius:4,fontWeight:600}}>{x.pu} compras</div>}{x.leads>0&&<div style={{position:"absolute",top:6,left:8,fontSize:9,color:"#fff",background:T.c2+"cc",padding:"2px 6px",borderRadius:4,fontWeight:600}}>{x.leads} leads</div>}</div>
      <div style={{padding:12}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.name}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:6}}>
          {[{l:"Gasto",v:fc(x.spend)},{l:"ROAS",v:x.roas>0?`${x.roas.toFixed(1)}x`:"—",c:x.roas>=4?T.pos:x.roas>=2?"#FACC15":x.roas>0?T.neg:T.ts},{l:"Compras",v:x.pu||"—",c:x.pu>0?T.pos:T.ts}].map(m=>(<div key={m.l}><div style={{fontSize:7,color:T.ts,textTransform:"uppercase",marginBottom:1}}>{m.l}</div><div style={{fontFamily:"monospace",fontSize:11,fontWeight:600,color:m.c||T.text}}>{m.v}</div></div>))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
          {[{l:"Impr.",v:fm(x.imp)},{l:"CTR",v:`${x.ctr}%`},{l:"Leads",v:x.leads||"—"},{l:"Views",v:x.vv?fm(x.vv):"—"}].map(m=>(<div key={m.l}><div style={{fontSize:7,color:T.ts,textTransform:"uppercase",marginBottom:1}}>{m.l}</div><div style={{fontFamily:"monospace",fontSize:10,fontWeight:600}}>{m.v}</div></div>))}
        </div>
      </div>
    </div>))}</div>
  </div>);
}

// ─── BUDGET ─────────────────────────────────────────────────────────────────
function BU({c,f,t}){
  const days=f.length||1;const avg=t.spend/days;const proj=avg*30;
  return(<div>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>Presupuesto</h2>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,marginBottom:20}}>{[{l:"Gasto Total",v:fc(t.spend)},{l:"Media Diaria",v:fc(avg)},{l:"Proyección 30d",v:fc(proj)},{l:"Días",v:days}].map(k=>(<div key={k.l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}><div style={{color:T.ts,fontSize:11,marginBottom:4,textTransform:"uppercase"}}>{k.l}</div><div style={{fontFamily:"monospace",fontSize:24,fontWeight:700}}>{k.v}</div></div>))}</div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20,marginBottom:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Gasto Diario</h3><ResponsiveContainer width="100%" height={240}><ComposedChart data={f}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fill:T.ts,fontSize:9}} tickLine={false}/><YAxis tick={{fill:T.ts,fontSize:9}} tickLine={false} axisLine={false} tickFormatter={v=>`€${v}`}/><Tooltip contentStyle={TT}/><Bar dataKey="spend" fill={T.c1} radius={[3,3,0,0]} name="Gasto €"/></ComposedChart></ResponsiveContainer></div>
    {c.length>0&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}><h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Distribución del Gasto</h3>
      {c.map(x=>(<div key={x.id} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:500}}>{x.name}</span><span style={{fontFamily:"monospace",fontSize:12,color:T.ts}}>{fc(x.spend)} ({(x.spend/t.spend*100).toFixed(1)}%)</span></div><div style={{background:"#1a1a1a",borderRadius:6,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${x.spend/t.spend*100}%`,background:T.accent,borderRadius:6}}/></div></div>))}
    </div>}
  </div>);
}

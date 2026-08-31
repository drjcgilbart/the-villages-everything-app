(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const nf="modulepreload",sf=function(i){return"/golf-cart-hero/"+i},Gl={},Hl=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let l=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};var r=l;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");s=l(t.map(h=>{if(h=sf(h),h in Gl)return;Gl[h]=!0;const d=h.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${u}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":nf,d||(f.as="script"),f.crossOrigin="",f.href=h,c&&f.setAttribute("nonce",c),document.head.appendChild(f),d)return new Promise((g,x)=>{f.addEventListener("load",g),f.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${h}`)))})}))}function a(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return s.then(o=>{for(const c of o||[])c.status==="rejected"&&a(c.reason);return e().catch(a)})};const Jc="185",af=0,Vl=1,rf=2,_r=1,Nd=2,ha=3,mi=0,sn=1,nn=2,fi=0,Ps=1,Wl=2,Xl=3,ql=4,of=5,Ki=100,cf=101,lf=102,hf=103,df=104,uf=200,ff=201,pf=202,mf=203,Xo=204,qo=205,gf=206,xf=207,_f=208,Mf=209,vf=210,yf=211,Sf=212,bf=213,wf=214,Yo=0,$o=1,Ko=2,Us=3,Zo=4,Jo=5,jo=6,Qo=7,jc=0,Tf=1,Ef=2,Jn=0,Ud=1,Fd=2,Od=3,Qc=4,kd=5,Bd=6,zd=7,Yl="attached",Af="detached",Gd=300,es=301,Fs=302,Jr=303,jr=304,Hr=306,Oi=1e3,Kn=1001,Pr=1002,Vt=1003,Hd=1004,da=1005,Wt=1006,Mr=1007,hi=1008,Mn=1009,Vd=1010,Wd=1011,Ma=1012,el=1013,Qn=1014,Tn=1015,gi=1016,tl=1017,nl=1018,va=1020,Xd=35902,qd=35899,Yd=1021,$d=1022,En=1023,xi=1026,ji=1027,il=1028,sl=1029,ts=1030,al=1031,rl=1033,vr=33776,yr=33777,Sr=33778,br=33779,ec=35840,tc=35841,nc=35842,ic=35843,sc=36196,ac=37492,rc=37496,oc=37488,cc=37489,Ir=37490,lc=37491,hc=37808,dc=37809,uc=37810,fc=37811,pc=37812,mc=37813,gc=37814,xc=37815,_c=37816,Mc=37817,vc=37818,yc=37819,Sc=37820,bc=37821,wc=36492,Tc=36494,Ec=36495,Ac=36283,Rc=36284,Lr=36285,Cc=36286,ya=2300,Sa=2301,Qr=2302,$l=2303,Kl=2400,Zl=2401,Jl=2402,Rf=2500,Cf=0,Kd=1,Pc=2,Pf=3200,Dr=0,If=1,Di="",_t="srgb",vn="srgb-linear",Nr="linear",pt="srgb",rs=7680,jl=519,Lf=512,Df=513,Nf=514,ol=515,Uf=516,Ff=517,cl=518,Of=519,Ic=35044,Ql="300 es",Zn=2e3,ba=2001;function kf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Bf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function wa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zf(){const i=wa("canvas");return i.style.display="block",i}const eh={};function Ur(...i){const e="THREE."+i.shift();console.log(e,...i)}function Zd(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ie(...i){i=Zd(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ge(...i){i=Zd(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Is(...i){const e=i.join(" ");e in eh||(eh[e]=!0,Ie(...i))}function Gf(i,e,t){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}const Hf={[Yo]:$o,[Ko]:jo,[Zo]:Qo,[Us]:Jo,[$o]:Yo,[jo]:Ko,[Qo]:Zo,[Jo]:Us};class is{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let th=1234567;const pa=Math.PI/180,Os=180/Math.PI;function Fn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[i&255]+en[i>>8&255]+en[i>>16&255]+en[i>>24&255]+"-"+en[e&255]+en[e>>8&255]+"-"+en[e>>16&15|64]+en[e>>24&255]+"-"+en[t&63|128]+en[t>>8&255]+"-"+en[t>>16&255]+en[t>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function ll(i,e){return(i%e+e)%e}function Vf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Wf(i,e,t){return i!==e?(t-i)/(e-i):0}function ma(i,e,t){return(1-t)*i+t*e}function Xf(i,e,t,n){return ma(i,e,1-Math.exp(-t*n))}function qf(i,e=1){return e-Math.abs(ll(i,e*2)-e)}function Yf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function $f(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Kf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Zf(i,e){return i+Math.random()*(e-i)}function Jf(i){return i*(.5-Math.random())}function jf(i){i!==void 0&&(th=i);let e=th+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qf(i){return i*pa}function ep(i){return i*Os}function tp(i){return(i&i-1)===0&&i!==0}function np(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ip(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function sp(i,e,t,n,s){const a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),l=a((e+n)/2),h=r((e+n)/2),d=a((e-n)/2),u=r((e-n)/2),f=a((n-e)/2),g=r((n-e)/2);switch(s){case"XYX":i.set(o*h,c*d,c*u,o*l);break;case"YZY":i.set(c*u,o*h,c*d,o*l);break;case"ZXZ":i.set(c*d,c*u,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Nn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function mt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ap={DEG2RAD:pa,RAD2DEG:Os,generateUUID:Fn,clamp:st,euclideanModulo:ll,mapLinear:Vf,inverseLerp:Wf,lerp:ma,damp:Xf,pingpong:qf,smoothstep:Yf,smootherstep:$f,randInt:Kf,randFloat:Zf,randFloatSpread:Jf,seededRandom:jf,degToRad:Qf,radToDeg:ep,isPowerOfTwo:tp,ceilPowerOfTwo:np,floorPowerOfTwo:ip,setQuaternionFromProperEuler:sp,normalize:mt,denormalize:Nn};class He{static{He.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*n-r*s+e.x,this.y=a*s+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ei{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],u=a[r+0],f=a[r+1],g=a[r+2],x=a[r+3];if(d!==x||c!==u||l!==f||h!==g){let m=c*u+l*f+h*g+d*x;m<0&&(u=-u,f=-f,g=-g,x=-x,m=-m);let p=1-o;if(m<.9995){const v=Math.acos(m),w=Math.sin(v);p=Math.sin(p*v)/w,o=Math.sin(o*v)/w,c=c*p+u*o,l=l*p+f*o,h=h*p+g*o,d=d*p+x*o}else{c=c*p+u*o,l=l*p+f*o,h=h*p+g*o,d=d*p+x*o;const v=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=v,l*=v,h*=v,d*=v}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=a[r],u=a[r+1],f=a[r+2],g=a[r+3];return e[t]=o*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-o*f,e[t+2]=l*g+h*f+o*u-c*d,e[t+3]=h*g-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),d=o(a/2),u=c(n/2),f=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(a-l)*f,this._z=(r-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(a+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(a-l)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(r-s)/f,this._x=(a+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{static{L.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*s,this.y=a[1]*t+a[4]*n+a[7]*s,this.z=a[2]*t+a[5]*n+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,l=2*(r*s-o*n),h=2*(o*t-a*s),d=2*(a*n-r*t);return this.x=t+c*l+r*d-o*h,this.y=n+c*h+o*l-a*d,this.z=s+c*d+a*h-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s,this.y=a[1]*t+a[5]*n+a[9]*s,this.z=a[2]*t+a[6]*n+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return eo.copy(this).projectOnVector(e),this.sub(eo)}reflect(e){return this.sub(eo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const eo=new L,nh=new ei;class Xe{static{Xe.prototype.isMatrix3=!0}constructor(e,t,n,s,a,r,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,c,l)}set(e,t,n,s,a,r,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],v=s[1],w=s[4],M=s[7],T=s[2],S=s[5],A=s[8];return a[0]=r*x+o*v+c*T,a[3]=r*m+o*w+c*S,a[6]=r*p+o*M+c*A,a[1]=l*x+h*v+d*T,a[4]=l*m+h*w+d*S,a[7]=l*p+h*M+d*A,a[2]=u*x+f*v+g*T,a[5]=u*m+f*w+g*S,a[8]=u*p+f*M+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*r*h-t*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*r-o*l,u=o*c-h*a,f=l*a-r*c,g=t*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*r)*x,e[3]=u*x,e[4]=(h*t-s*c)*x,e[5]=(s*a-o*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(r*t-n*a)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+e,-s*l,s*c,-s*(-l*r+c*o)+o+t,0,0,1),this}scale(e,t){return Is("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(to.makeScale(e,t)),this}rotate(e){return Is("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(to.makeRotation(-e)),this}translate(e,t){return Is("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(to.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const to=new Xe,ih=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sh=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function rp(){const i={enabled:!0,workingColorSpace:vn,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===pt&&(s.r=pi(s.r),s.g=pi(s.g),s.b=pi(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===pt&&(s.r=Ls(s.r),s.g=Ls(s.g),s.b=Ls(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Di?Nr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Is("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Is("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[vn]:{primaries:e,whitePoint:n,transfer:Nr,toXYZ:ih,fromXYZ:sh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:_t},outputColorSpaceConfig:{drawingBufferColorSpace:_t}},[_t]:{primaries:e,whitePoint:n,transfer:pt,toXYZ:ih,fromXYZ:sh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:_t}}}),i}const it=rp();function pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ls(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let os;class op{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{os===void 0&&(os=wa("canvas")),os.width=e.width,os.height=e.height;const s=os.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=os}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=wa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=pi(a[r]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(pi(t[n]/255)*255):t[n]=pi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let cp=0;class hl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=Fn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(no(s[r].image)):a.push(no(s[r]))}else a=no(s);n.url=a}return t||(e.images[this.uuid]=n),n}}function no(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?op.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let lp=0;const io=new L;class Xt extends is{constructor(e=Xt.DEFAULT_IMAGE,t=Xt.DEFAULT_MAPPING,n=Kn,s=Kn,a=Wt,r=hi,o=En,c=Mn,l=Xt.DEFAULT_ANISOTROPY,h=Di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=Fn(),this.name="",this.source=new hl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(io).x}get height(){return this.source.getSize(io).y}get depth(){return this.source.getSize(io).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Oi:e.x=e.x-Math.floor(e.x);break;case Kn:e.x=e.x<0?0:1;break;case Pr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Oi:e.y=e.y-Math.floor(e.y);break;case Kn:e.y=e.y<0?0:1;break;case Pr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xt.DEFAULT_IMAGE=null;Xt.DEFAULT_MAPPING=Gd;Xt.DEFAULT_ANISOTROPY=1;class Mt{static{Mt.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*n+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,a;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,M=(f+1)/2,T=(p+1)/2,S=(h+u)/4,A=(d+x)/4,_=(g+m)/4;return w>M&&w>T?w<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(w),s=S/n,a=A/n):M>T?M<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),n=S/s,a=_/s):T<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(T),n=A/a,s=_/a),this.set(n,s,a,t),this}let v=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-x)/v,this.z=(u-h)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class hp extends is{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},a=new Xt(s),r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Wt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new hl(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jn extends hp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Jd extends Xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class dp extends Xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $e{static{$e.prototype.isMatrix4=!0}constructor(e,t,n,s,a,r,o,c,l,h,d,u,f,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,c,l,h,d,u,f,g,x,m)}set(e,t,n,s,a,r,o,c,l,h,d,u,f,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $e().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/cs.setFromMatrixColumn(e,0).length(),a=1/cs.setFromMatrixColumn(e,1).length(),r=1/cs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,a=e.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),d=Math.sin(a);if(e.order==="XYZ"){const u=r*h,f=r*d,g=o*h,x=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-x*l,t[9]=-o*c,t[2]=x-u*l,t[6]=g+f*l,t[10]=r*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,g=l*h,x=l*d;t[0]=u+x*o,t[4]=g*o-f,t[8]=r*l,t[1]=r*d,t[5]=r*h,t[9]=-o,t[2]=f*o-g,t[6]=x+u*o,t[10]=r*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,g=l*h,x=l*d;t[0]=u-x*o,t[4]=-r*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=r*h,t[9]=x-u*o,t[2]=-r*l,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const u=r*h,f=r*d,g=o*h,x=o*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+x,t[1]=c*d,t[5]=x*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const u=r*c,f=r*l,g=o*c,x=o*l;t[0]=c*h,t[4]=x-u*d,t[8]=g*d+f,t[1]=d,t[5]=r*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-x*d}else if(e.order==="XZY"){const u=r*c,f=r*l,g=o*c,x=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+x,t[5]=r*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(up,e,fp)}lookAt(e,t,n){const s=this.elements;return mn.subVectors(e,t),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ti.crossVectors(n,mn),Ti.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ti.crossVectors(n,mn)),Ti.normalize(),Na.crossVectors(mn,Ti),s[0]=Ti.x,s[4]=Na.x,s[8]=mn.x,s[1]=Ti.y,s[5]=Na.y,s[9]=mn.y,s[2]=Ti.z,s[6]=Na.z,s[10]=mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],v=n[3],w=n[7],M=n[11],T=n[15],S=s[0],A=s[4],_=s[8],b=s[12],C=s[1],P=s[5],I=s[9],O=s[13],K=s[2],k=s[6],$=s[10],V=s[14],Q=s[3],ae=s[7],oe=s[11],me=s[15];return a[0]=r*S+o*C+c*K+l*Q,a[4]=r*A+o*P+c*k+l*ae,a[8]=r*_+o*I+c*$+l*oe,a[12]=r*b+o*O+c*V+l*me,a[1]=h*S+d*C+u*K+f*Q,a[5]=h*A+d*P+u*k+f*ae,a[9]=h*_+d*I+u*$+f*oe,a[13]=h*b+d*O+u*V+f*me,a[2]=g*S+x*C+m*K+p*Q,a[6]=g*A+x*P+m*k+p*ae,a[10]=g*_+x*I+m*$+p*oe,a[14]=g*b+x*O+m*V+p*me,a[3]=v*S+w*C+M*K+T*Q,a[7]=v*A+w*P+M*k+T*ae,a[11]=v*_+w*I+M*$+T*oe,a[15]=v*b+w*O+M*V+T*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15],v=c*f-l*u,w=o*f-l*d,M=o*u-c*d,T=r*f-l*h,S=r*u-c*h,A=r*d-o*h;return t*(x*v-m*w+p*M)-n*(g*v-m*T+p*S)+s*(g*w-x*T+p*A)-a*(g*M-x*S+m*A)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],a=e[1],r=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(r*h-o*l)-n*(a*h-o*c)+s*(a*l-r*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],v=t*o-n*r,w=t*c-s*r,M=t*l-a*r,T=n*c-s*o,S=n*l-a*o,A=s*l-a*c,_=h*x-d*g,b=h*m-u*g,C=h*p-f*g,P=d*m-u*x,I=d*p-f*x,O=u*p-f*m,K=v*O-w*I+M*P+T*C-S*b+A*_;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/K;return e[0]=(o*O-c*I+l*P)*k,e[1]=(s*I-n*O-a*P)*k,e[2]=(x*A-m*S+p*T)*k,e[3]=(u*S-d*A-f*T)*k,e[4]=(c*C-r*O-l*b)*k,e[5]=(t*O-s*C+a*b)*k,e[6]=(m*M-g*A-p*w)*k,e[7]=(h*A-u*M+f*w)*k,e[8]=(r*I-o*C+l*_)*k,e[9]=(n*C-t*I-a*_)*k,e[10]=(g*S-x*M+p*v)*k,e[11]=(d*M-h*S-f*v)*k,e[12]=(o*b-r*P-c*_)*k,e[13]=(t*P-n*b+s*_)*k,e[14]=(x*w-g*T-m*v)*k,e[15]=(h*T-d*w+u*v)*k,this}scale(e){const t=this.elements,n=e.x,s=e.y,a=e.z;return t[0]*=n,t[4]*=s,t[8]*=a,t[1]*=n,t[5]*=s,t[9]*=a,t[2]*=n,t[6]*=s,t[10]*=a,t[3]*=n,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),a=1-n,r=e.x,o=e.y,c=e.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,a,r){return this.set(1,n,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,l=a+a,h=r+r,d=o+o,u=a*l,f=a*h,g=a*d,x=r*h,m=r*d,p=o*d,v=c*l,w=c*h,M=c*d,T=n.x,S=n.y,A=n.z;return s[0]=(1-(x+p))*T,s[1]=(f+M)*T,s[2]=(g-w)*T,s[3]=0,s[4]=(f-M)*S,s[5]=(1-(u+p))*S,s[6]=(m+v)*S,s[7]=0,s[8]=(g+w)*A,s[9]=(m-v)*A,s[10]=(1-(u+x))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const a=this.determinantAffine();if(a===0)return n.set(1,1,1),t.identity(),this;let r=cs.set(s[0],s[1],s[2]).length();const o=cs.set(s[4],s[5],s[6]).length(),c=cs.set(s[8],s[9],s[10]).length();a<0&&(r=-r),Cn.copy(this);const l=1/r,h=1/o,d=1/c;return Cn.elements[0]*=l,Cn.elements[1]*=l,Cn.elements[2]*=l,Cn.elements[4]*=h,Cn.elements[5]*=h,Cn.elements[6]*=h,Cn.elements[8]*=d,Cn.elements[9]*=d,Cn.elements[10]*=d,t.setFromRotationMatrix(Cn),n.x=r,n.y=o,n.z=c,this}makePerspective(e,t,n,s,a,r,o=Zn,c=!1){const l=this.elements,h=2*a/(t-e),d=2*a/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s);let g,x;if(c)g=a/(r-a),x=r*a/(r-a);else if(o===Zn)g=-(r+a)/(r-a),x=-2*r*a/(r-a);else if(o===ba)g=-r/(r-a),x=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,a,r,o=Zn,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s);let g,x;if(c)g=1/(r-a),x=r/(r-a);else if(o===Zn)g=-2/(r-a),x=-(r+a)/(r-a);else if(o===ba)g=-1/(r-a),x=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const cs=new L,Cn=new $e,up=new L(0,0,0),fp=new L(1,1,1),Ti=new L,Na=new L,mn=new L,ah=new $e,rh=new ei;class _i{constructor(e=0,t=0,n=0,s=_i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-st(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(st(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-st(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ah.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ah,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rh.setFromEuler(this),this.setFromQuaternion(rh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_i.DEFAULT_ORDER="XYZ";class jd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let pp=0;const oh=new L,ls=new ei,ii=new $e,Ua=new L,Ks=new L,mp=new L,gp=new ei,ch=new L(1,0,0),lh=new L(0,1,0),hh=new L(0,0,1),dh={type:"added"},xp={type:"removed"},hs={type:"childadded",child:null},so={type:"childremoved",child:null};class lt extends is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pp++}),this.uuid=Fn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=lt.DEFAULT_UP.clone();const e=new L,t=new _i,n=new ei,s=new L(1,1,1);function a(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $e},normalMatrix:{value:new Xe}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.multiply(ls),this}rotateOnWorldAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.premultiply(ls),this}rotateX(e){return this.rotateOnAxis(ch,e)}rotateY(e){return this.rotateOnAxis(lh,e)}rotateZ(e){return this.rotateOnAxis(hh,e)}translateOnAxis(e,t){return oh.copy(e).applyQuaternion(this.quaternion),this.position.add(oh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ch,e)}translateY(e){return this.translateOnAxis(lh,e)}translateZ(e){return this.translateOnAxis(hh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ii.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ua.copy(e):Ua.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ii.lookAt(Ks,Ua,this.up):ii.lookAt(Ua,Ks,this.up),this.quaternion.setFromRotationMatrix(ii),s&&(ii.extractRotation(s.matrixWorld),ls.setFromRotationMatrix(ii),this.quaternion.premultiply(ls.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ge("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dh),hs.child=e,this.dispatchEvent(hs),hs.child=null):Ge("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(xp),so.child=e,this.dispatchEvent(so),so.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ii.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ii.multiply(e.parent.matrixWorld)),e.applyMatrix4(ii),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dh),hs.child=e,this.dispatchEvent(hs),hs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,e,mp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,gp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*n-a[8]*s,a[13]+=n-a[1]*t-a[5]*n-a[9]*s,a[14]+=s-a[2]*t-a[6]*n-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];a(e.shapes,d)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),l=r(e.textures),h=r(e.images),d=r(e.shapes),u=r(e.skeletons),f=r(e.animations),g=r(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}lt.DEFAULT_UP=new L(0,1,0);lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Tt extends lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _p={type:"move"};class ao{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){r=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,n),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(_p)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Tt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Qd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},Fa={h:0,s:0,l:0};function ro(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Le{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=_t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=it.workingColorSpace){if(e=ll(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,r=2*n-a;this.r=ro(r,a,e+1/3),this.g=ro(r,a,e),this.b=ro(r,a,e-1/3)}return it.colorSpaceToWorking(this,s),this}setStyle(e,t=_t){function n(a){a!==void 0&&parseFloat(a)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=_t){const n=Qd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=pi(e.r),this.g=pi(e.g),this.b=pi(e.b),this}copyLinearToSRGB(e){return this.r=Ls(e.r),this.g=Ls(e.g),this.b=Ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=_t){return it.workingToColorSpace(tn.copy(this),e),Math.round(st(tn.r*255,0,255))*65536+Math.round(st(tn.g*255,0,255))*256+Math.round(st(tn.b*255,0,255))}getHexString(e=_t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(tn.copy(this),t);const n=tn.r,s=tn.g,a=tn.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const d=r-o;switch(l=h<=.5?d/(r+o):d/(2-r-o),r){case n:c=(s-a)/d+(s<a?6:0);break;case s:c=(a-n)/d+2;break;case a:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(tn.copy(this),t),e.r=tn.r,e.g=tn.g,e.b=tn.b,e}getStyle(e=_t){it.workingToColorSpace(tn.copy(this),e);const t=tn.r,n=tn.g,s=tn.b;return e!==_t?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ei),this.setHSL(Ei.h+e,Ei.s+t,Ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ei),e.getHSL(Fa);const n=ma(Ei.h,Fa.h,t),s=ma(Ei.s,Fa.s,t),a=ma(Ei.l,Fa.l,t);return this.setHSL(n,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*s,this.g=a[1]*t+a[4]*n+a[7]*s,this.b=a[2]*t+a[5]*n+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const tn=new Le;Le.NAMES=Qd;class Fr{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Le(e),this.near=t,this.far=n}clone(){return new Fr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class eu extends lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _i,this.environmentIntensity=1,this.environmentRotation=new _i,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Pn=new L,si=new L,oo=new L,ai=new L,ds=new L,us=new L,uh=new L,co=new L,lo=new L,ho=new L,uo=new Mt,fo=new Mt,po=new Mt;class wn{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Pn.subVectors(e,t),s.cross(Pn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,n,s,a){Pn.subVectors(s,t),si.subVectors(n,t),oo.subVectors(e,t);const r=Pn.dot(Pn),o=Pn.dot(si),c=Pn.dot(oo),l=si.dot(si),h=si.dot(oo),d=r*l-o*o;if(d===0)return a.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(r*h-o*c)*u;return a.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(e,t,n,s,a,r,o,c){return this.getBarycoord(e,t,n,s,ai)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,ai.x),c.addScaledVector(r,ai.y),c.addScaledVector(o,ai.z),c)}static getInterpolatedAttribute(e,t,n,s,a,r){return uo.setScalar(0),fo.setScalar(0),po.setScalar(0),uo.fromBufferAttribute(e,t),fo.fromBufferAttribute(e,n),po.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(uo,a.x),r.addScaledVector(fo,a.y),r.addScaledVector(po,a.z),r}static isFrontFacing(e,t,n,s){return Pn.subVectors(n,t),si.subVectors(e,t),Pn.cross(si).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pn.subVectors(this.c,this.b),si.subVectors(this.a,this.b),Pn.cross(si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return wn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return wn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,a){return wn.getInterpolation(e,this.a,this.b,this.c,t,n,s,a)}containsPoint(e){return wn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return wn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,a=this.c;let r,o;ds.subVectors(s,n),us.subVectors(a,n),co.subVectors(e,n);const c=ds.dot(co),l=us.dot(co);if(c<=0&&l<=0)return t.copy(n);lo.subVectors(e,s);const h=ds.dot(lo),d=us.dot(lo);if(h>=0&&d<=h)return t.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return r=c/(c-h),t.copy(n).addScaledVector(ds,r);ho.subVectors(e,a);const f=ds.dot(ho),g=us.dot(ho);if(g>=0&&f<=g)return t.copy(a);const x=f*l-c*g;if(x<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(us,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return uh.subVectors(a,s),o=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(uh,o);const p=1/(m+x+u);return r=x*p,o=u*p,t.copy(n).addScaledVector(ds,r).addScaledVector(us,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class yi{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(In.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(In.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=In.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,In):In.fromBufferAttribute(a,r),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Oa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Oa.copy(n.boundingBox)),Oa.applyMatrix4(e.matrixWorld),this.union(Oa)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zs),ka.subVectors(this.max,Zs),fs.subVectors(e.a,Zs),ps.subVectors(e.b,Zs),ms.subVectors(e.c,Zs),Ai.subVectors(ps,fs),Ri.subVectors(ms,ps),zi.subVectors(fs,ms);let t=[0,-Ai.z,Ai.y,0,-Ri.z,Ri.y,0,-zi.z,zi.y,Ai.z,0,-Ai.x,Ri.z,0,-Ri.x,zi.z,0,-zi.x,-Ai.y,Ai.x,0,-Ri.y,Ri.x,0,-zi.y,zi.x,0];return!mo(t,fs,ps,ms,ka)||(t=[1,0,0,0,1,0,0,0,1],!mo(t,fs,ps,ms,ka))?!1:(Ba.crossVectors(Ai,Ri),t=[Ba.x,Ba.y,Ba.z],mo(t,fs,ps,ms,ka))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ri),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ri=[new L,new L,new L,new L,new L,new L,new L,new L],In=new L,Oa=new yi,fs=new L,ps=new L,ms=new L,Ai=new L,Ri=new L,zi=new L,Zs=new L,ka=new L,Ba=new L,Gi=new L;function mo(i,e,t,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Gi.fromArray(i,a);const o=s.x*Math.abs(Gi.x)+s.y*Math.abs(Gi.y)+s.z*Math.abs(Gi.z),c=e.dot(Gi),l=t.dot(Gi),h=n.dot(Gi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Bt=new L,za=new He;let Mp=0;class ln extends is{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Mp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ic,this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)za.fromBufferAttribute(this,t),za.applyMatrix3(e),this.setXY(t,za.x,za.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix3(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,a){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array),a=mt(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ic&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class tu extends ln{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class nu extends ln{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ht extends ln{constructor(e,t,n){super(new Float32Array(e),t,n)}}const vp=new yi,Js=new L,go=new L;class ti{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):vp.setFromPoints(e).getCenter(n);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Js.subVectors(e,this.center);const t=Js.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Js,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(go.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Js.copy(e.center).add(go)),this.expandByPoint(Js.copy(e.center).sub(go))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let yp=0;const Sn=new $e,xo=new lt,gs=new L,gn=new yi,js=new yi,$t=new L;class Ot extends is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=Fn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kf(e)?nu:tu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Xe().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Sn.makeRotationFromQuaternion(e),this.applyMatrix4(Sn),this}rotateX(e){return Sn.makeRotationX(e),this.applyMatrix4(Sn),this}rotateY(e){return Sn.makeRotationY(e),this.applyMatrix4(Sn),this}rotateZ(e){return Sn.makeRotationZ(e),this.applyMatrix4(Sn),this}translate(e,t,n){return Sn.makeTranslation(e,t,n),this.applyMatrix4(Sn),this}scale(e,t,n){return Sn.makeScale(e,t,n),this.applyMatrix4(Sn),this}lookAt(e){return xo.lookAt(e),xo.updateMatrix(),this.applyMatrix4(xo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ht(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const a=t[n];gn.setFromBufferAttribute(a),this.morphTargetsRelative?($t.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint($t),$t.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint($t)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ge('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ge("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(gn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];js.setFromBufferAttribute(o),this.morphTargetsRelative?($t.addVectors(gn.min,js.min),gn.expandByPoint($t),$t.addVectors(gn.max,js.max),gn.expandByPoint($t)):(gn.expandByPoint(js.min),gn.expandByPoint(js.max))}gn.getCenter(n);let s=0;for(let a=0,r=e.count;a<r;a++)$t.fromBufferAttribute(e,a),s=Math.max(s,n.distanceToSquared($t));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)$t.fromBufferAttribute(o,l),c&&(gs.fromBufferAttribute(e,l),$t.add(gs)),s=Math.max(s,n.distanceToSquared($t))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ge('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ge("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,a=t.uv;let r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new ln(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));const o=[],c=[];for(let _=0;_<n.count;_++)o[_]=new L,c[_]=new L;const l=new L,h=new L,d=new L,u=new He,f=new He,g=new He,x=new L,m=new L;function p(_,b,C){l.fromBufferAttribute(n,_),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,C),u.fromBufferAttribute(a,_),f.fromBufferAttribute(a,b),g.fromBufferAttribute(a,C),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(P),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(P),o[_].add(x),o[b].add(x),o[C].add(x),c[_].add(m),c[b].add(m),c[C].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let _=0,b=v.length;_<b;++_){const C=v[_],P=C.start,I=C.count;for(let O=P,K=P+I;O<K;O+=3)p(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const w=new L,M=new L,T=new L,S=new L;function A(_){T.fromBufferAttribute(s,_),S.copy(T);const b=o[_];w.copy(b),w.sub(T.multiplyScalar(T.dot(b))).normalize(),M.crossVectors(S,b);const P=M.dot(c[_])<0?-1:1;r.setXYZW(_,w.x,w.y,w.z,P)}for(let _=0,b=v.length;_<b;++_){const C=v[_],P=C.start,I=C.count;for(let O=P,K=P+I;O<K;O+=3)A(e.getX(O+0)),A(e.getX(O+1)),A(e.getX(O+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ln(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new L,a=new L,r=new L,o=new L,c=new L,l=new L,h=new L,d=new L;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),x=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,x),r.fromBufferAttribute(t,m),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),a.fromBufferAttribute(t,u+1),r.fromBufferAttribute(t,u+2),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)$t.fromBufferAttribute(e,t),$t.normalize(),e.setXYZ(t,$t.x,$t.y,$t.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let x=0,m=c.length;x<m;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new ln(u,h,d)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ot,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const a=e.morphAttributes;for(const l in a){const h=[],d=a[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let l=0,h=r.length;l<h;l++){const d=r[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class iu{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ic,this.updateRanges=[],this.version=0,this.uuid=Fn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const an=new L;class Ta{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)an.fromBufferAttribute(this,t),an.applyMatrix4(e),this.setXYZ(t,an.x,an.y,an.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)an.fromBufferAttribute(this,t),an.applyNormalMatrix(e),this.setXYZ(t,an.x,an.y,an.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)an.fromBufferAttribute(this,t),an.transformDirection(e),this.setXYZ(t,an.x,an.y,an.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),s=mt(s,this.array),a=mt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){Ur("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new ln(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ta(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ur("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Sp=0;class An extends is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=Fn(),this.name="",this.type="Material",this.blending=Ps,this.side=mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xo,this.blendDst=qo,this.blendEquation=Ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Le(0,0,0),this.blendAlpha=0,this.depthFunc=Us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ps&&(n.blending=this.blending),this.side!==mi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xo&&(n.blendSrc=this.blendSrc),this.blendDst!==qo&&(n.blendDst=this.blendDst),this.blendEquation!==Ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Us&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Le().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new He().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new He().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Vr extends An{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Le(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let xs;const Qs=new L,_s=new L,Ms=new L,vs=new He,ea=new He,su=new $e,Ga=new L,ta=new L,Ha=new L,fh=new He,_o=new He,ph=new He;class dl extends lt{constructor(e=new Vr){if(super(),this.isSprite=!0,this.type="Sprite",xs===void 0){xs=new Ot;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new iu(t,5);xs.setIndex([0,1,2,0,2,3]),xs.setAttribute("position",new Ta(n,3,0,!1)),xs.setAttribute("uv",new Ta(n,2,3,!1))}this.geometry=xs,this.material=e,this.center=new He(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Ge('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_s.setFromMatrixScale(this.matrixWorld),su.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ms.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_s.multiplyScalar(-Ms.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;Va(Ga.set(-.5,-.5,0),Ms,r,_s,s,a),Va(ta.set(.5,-.5,0),Ms,r,_s,s,a),Va(Ha.set(.5,.5,0),Ms,r,_s,s,a),fh.set(0,0),_o.set(1,0),ph.set(1,1);let o=e.ray.intersectTriangle(Ga,ta,Ha,!1,Qs);if(o===null&&(Va(ta.set(-.5,.5,0),Ms,r,_s,s,a),_o.set(0,1),o=e.ray.intersectTriangle(Ga,Ha,ta,!1,Qs),o===null))return;const c=e.ray.origin.distanceTo(Qs);c<e.near||c>e.far||t.push({distance:c,point:Qs.clone(),uv:wn.getInterpolation(Qs,Ga,ta,Ha,fh,_o,ph,new He),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Va(i,e,t,n,s,a){vs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ea.x=a*vs.x-s*vs.y,ea.y=s*vs.x+a*vs.y):ea.copy(vs),i.copy(e),i.x+=ea.x,i.y+=ea.y,i.applyMatrix4(su)}const oi=new L,Mo=new L,Wa=new L,Ci=new L,vo=new L,Xa=new L,yo=new L;class Wr{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,oi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=oi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(oi.copy(this.origin).addScaledVector(this.direction,t),oi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Mo.copy(e).add(t).multiplyScalar(.5),Wa.copy(t).sub(e).normalize(),Ci.copy(this.origin).sub(Mo);const a=e.distanceTo(t)*.5,r=-this.direction.dot(Wa),o=Ci.dot(this.direction),c=-Ci.dot(Wa),l=Ci.lengthSq(),h=Math.abs(1-r*r);let d,u,f,g;if(h>0)if(d=r*c-o,u=r*o-c,g=a*h,d>=0)if(u>=-g)if(u<=g){const x=1/h;d*=x,u*=x,f=d*(d+r*u+2*o)+u*(r*d+u+2*c)+l}else u=a,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*c)+l;else u=-a,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-r*a+o)),u=d>0?-a:Math.min(Math.max(-a,-c),a),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-a,-c),a),f=u*(u+2*c)+l):(d=Math.max(0,-(r*a+o)),u=d>0?a:Math.min(Math.max(-a,-c),a),f=-d*d+u*(u+2*c)+l);else u=r>0?-a:a,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Mo).addScaledVector(Wa,u),f}intersectSphere(e,t){oi.subVectors(e.center,this.origin);const n=oi.dot(this.direction),s=oi.dot(oi)-n*n,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(a=(e.min.y-u.y)*h,r=(e.max.y-u.y)*h):(a=(e.max.y-u.y)*h,r=(e.min.y-u.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,oi)!==null}intersectTriangle(e,t,n,s,a){vo.subVectors(t,e),Xa.subVectors(n,e),yo.crossVectors(vo,Xa);let r=this.direction.dot(yo),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Ci.subVectors(this.origin,e);const c=o*this.direction.dot(Xa.crossVectors(Ci,Xa));if(c<0)return null;const l=o*this.direction.dot(vo.cross(Ci));if(l<0||c+l>r)return null;const h=-o*Ci.dot(yo);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Un extends An{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mh=new $e,Hi=new Wr,qa=new ti,gh=new L,Ya=new L,$a=new L,Ka=new L,So=new L,Za=new L,xh=new L,Ja=new L;class F extends lt{constructor(e=new Ot,t=new Un){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){Za.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],d=a[c];h!==0&&(So.fromBufferAttribute(d,e),r?Za.addScaledVector(So,h):Za.addScaledVector(So.sub(t),h))}t.add(Za)}return t}raycast(e,t){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),qa.copy(n.boundingSphere),qa.applyMatrix4(a),Hi.copy(e.ray).recast(e.near),!(qa.containsPoint(Hi.origin)===!1&&(Hi.intersectSphere(qa,gh)===null||Hi.origin.distanceToSquared(gh)>(e.far-e.near)**2))&&(mh.copy(a).invert(),Hi.copy(e.ray).applyMatrix4(mh),!(n.boundingBox!==null&&Hi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hi)))}_computeIntersections(e,t,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,d=a.attributes.normal,u=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const m=u[g],p=r[m.materialIndex],v=Math.max(m.start,f.start),w=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=v,T=w;M<T;M+=3){const S=o.getX(M),A=o.getX(M+1),_=o.getX(M+2);s=ja(this,p,e,n,l,h,d,S,A,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const v=o.getX(m),w=o.getX(m+1),M=o.getX(m+2);s=ja(this,r,e,n,l,h,d,v,w,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const m=u[g],p=r[m.materialIndex],v=Math.max(m.start,f.start),w=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let M=v,T=w;M<T;M+=3){const S=M,A=M+1,_=M+2;s=ja(this,p,e,n,l,h,d,S,A,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const v=m,w=m+1,M=m+2;s=ja(this,r,e,n,l,h,d,v,w,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function bp(i,e,t,n,s,a,r,o){let c;if(e.side===sn?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,e.side===mi,o),c===null)return null;Ja.copy(o),Ja.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Ja);return l<t.near||l>t.far?null:{distance:l,point:Ja.clone(),object:i}}function ja(i,e,t,n,s,a,r,o,c,l){i.getVertexPosition(o,Ya),i.getVertexPosition(c,$a),i.getVertexPosition(l,Ka);const h=bp(i,e,t,n,Ya,$a,Ka,xh);if(h){const d=new L;wn.getBarycoord(xh,Ya,$a,Ka,d),s&&(h.uv=wn.getInterpolatedAttribute(s,o,c,l,d,new He)),a&&(h.uv1=wn.getInterpolatedAttribute(a,o,c,l,d,new He)),r&&(h.normal=wn.getInterpolatedAttribute(r,o,c,l,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new L,materialIndex:0};wn.getNormal(Ya,$a,Ka,u.normal),h.face=u,h.barycoord=d}return h}const na=new Mt,_h=new Mt,Mh=new Mt,wp=new Mt,vh=new $e,Qa=new L,bo=new ti,yh=new $e,wo=new Wr;class Tp extends F{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Yl,this.bindMatrix=new $e,this.bindMatrixInverse=new $e,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new yi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Qa),this.boundingBox.expandByPoint(Qa)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ti),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Qa),this.boundingSphere.expandByPoint(Qa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),bo.copy(this.boundingSphere),bo.applyMatrix4(s),e.ray.intersectsSphere(bo)!==!1&&(yh.copy(s).invert(),wo.copy(e.ray).applyMatrix4(yh),!(this.boundingBox!==null&&wo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,wo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Mt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const a=1/e.manhattanLength();a!==1/0?e.multiplyScalar(a):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Yl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Af?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;_h.fromBufferAttribute(s.attributes.skinIndex,e),Mh.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(na.copy(t),t.set(0,0,0,0)):(na.set(...t,1),t.set(0,0,0)),na.applyMatrix4(this.bindMatrix);for(let a=0;a<4;a++){const r=Mh.getComponent(a);if(r!==0){const o=_h.getComponent(a);vh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(wp.copy(na).applyMatrix4(vh),r)}}return t.isVector4&&(t.w=na.w),t.applyMatrix4(this.bindMatrixInverse)}}class au extends lt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ul extends Xt{constructor(e=null,t=1,n=1,s,a,r,o,c,l=Vt,h=Vt,d,u){super(null,r,o,c,l,h,s,a,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Sh=new $e,Ep=new $e;class fl{constructor(e=[],t=[]){this.uuid=Fn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new $e)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new $e;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let a=0,r=e.length;a<r;a++){const o=e[a]?e[a].matrixWorld:Ep;Sh.multiplyMatrices(o,t[a]),Sh.toArray(n,a*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new fl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new ul(t,e,e,En,Tn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const a=e.bones[n];let r=t[a];r===void 0&&(Ie("Skeleton: No bone found with UUID:",a),r=new au),this.bones.push(r),this.boneInverses.push(new $e().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,a=t.length;s<a;s++){const r=t[s];e.bones.push(r.uuid);const o=n[s];e.boneInverses.push(o.toArray())}return e}}class Lc extends ln{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ys=new $e,bh=new $e,er=[],wh=new yi,Ap=new $e,ia=new F,sa=new ti;class at extends F{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Lc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ap)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new yi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ys),wh.copy(e.boundingBox).applyMatrix4(ys),this.boundingBox.union(wh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ti),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ys),sa.copy(e.boundingSphere).applyMatrix4(ys),this.boundingSphere.union(sa)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,a=n.length+1,r=e*a+1;for(let o=0;o<n.length;o++)n[o]=s[r+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ia.geometry=this.geometry,ia.material=this.material,ia.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),sa.copy(this.boundingSphere),sa.applyMatrix4(n),e.ray.intersectsSphere(sa)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,ys),bh.multiplyMatrices(n,ys),ia.matrixWorld=bh,ia.raycast(e,er);for(let r=0,o=er.length;r<o;r++){const c=er[r];c.instanceId=a,c.object=this,t.push(c)}er.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Lc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ul(new Float32Array(s*this.count),s,this.count,il,Tn));const a=this.morphTexture.source.data.data;let r=0;for(let l=0;l<n.length;l++)r+=n[l];const o=this.geometry.morphTargetsRelative?1:1-r,c=s*e;return a[c]=o,a.set(n,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const To=new L,Rp=new L,Cp=new Xe;class qi{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=To.subVectors(n,t).cross(Rp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(To),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Cp.getNormalMatrix(e),s=this.coplanarPoint(To).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vi=new ti,Pp=new He(.5,.5),tr=new L;class pl{constructor(e=new qi,t=new qi,n=new qi,s=new qi,a=new qi,r=new qi){this.planes=[e,t,n,s,a,r]}set(e,t,n,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Zn,n=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],l=a[3],h=a[4],d=a[5],u=a[6],f=a[7],g=a[8],x=a[9],m=a[10],p=a[11],v=a[12],w=a[13],M=a[14],T=a[15];if(s[0].setComponents(l-r,f-h,p-g,T-v).normalize(),s[1].setComponents(l+r,f+h,p+g,T+v).normalize(),s[2].setComponents(l+o,f+d,p+x,T+w).normalize(),s[3].setComponents(l-o,f-d,p-x,T-w).normalize(),n)s[4].setComponents(c,u,m,M).normalize(),s[5].setComponents(l-c,f-u,p-m,T-M).normalize();else if(s[4].setComponents(l-c,f-u,p-m,T-M).normalize(),t===Zn)s[5].setComponents(l+c,f+u,p+m,T+M).normalize();else if(t===ba)s[5].setComponents(c,u,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vi)}intersectsSprite(e){Vi.center.set(0,0,0);const t=Pp.distanceTo(e.center);return Vi.radius=.7071067811865476+t,Vi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(tr.x=s.normal.x>0?e.max.x:e.min.x,tr.y=s.normal.y>0?e.max.y:e.min.y,tr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(tr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ru extends An{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Or=new L,kr=new L,Th=new $e,aa=new Wr,nr=new ti,Eo=new L,Eh=new L;class ml extends lt{constructor(e=new Ot,t=new ru){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,a=t.count;s<a;s++)Or.fromBufferAttribute(t,s-1),kr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Or.distanceTo(kr);e.setAttribute("lineDistance",new ht(n,1))}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(s),nr.radius+=a,e.ray.intersectsSphere(nr)===!1)return;Th.copy(s).invert(),aa.copy(e.ray).applyMatrix4(Th);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let x=f,m=g-1;x<m;x+=l){const p=h.getX(x),v=h.getX(x+1),w=ir(this,e,aa,c,p,v,x);w&&t.push(w)}if(this.isLineLoop){const x=h.getX(g-1),m=h.getX(f),p=ir(this,e,aa,c,x,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,r.start),g=Math.min(u.count,r.start+r.count);for(let x=f,m=g-1;x<m;x+=l){const p=ir(this,e,aa,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=ir(this,e,aa,c,g-1,f,g-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ir(i,e,t,n,s,a,r){const o=i.geometry.attributes.position;if(Or.fromBufferAttribute(o,s),kr.fromBufferAttribute(o,a),t.distanceSqToSegment(Or,kr,Eo,Eh)>n)return;Eo.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Eo);if(!(l<e.near||l>e.far))return{distance:l,point:Eh.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const Ah=new L,Rh=new L;class Ip extends ml{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,a=t.count;s<a;s+=2)Ah.fromBufferAttribute(t,s),Rh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ah.distanceTo(Rh);e.setAttribute("lineDistance",new ht(n,1))}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Lp extends ml{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class ou extends An{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Le(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ch=new $e,Dc=new Wr,sr=new ti,ar=new L;class Dp extends lt{constructor(e=new Ot,t=new ou){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,a=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(s),sr.radius+=a,e.ray.intersectsSphere(sr)===!1)return;Ch.copy(s).invert(),Dc.copy(e.ray).applyMatrix4(Ch);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,r.start),f=Math.min(l.count,r.start+r.count);for(let g=u,x=f;g<x;g++){const m=l.getX(g);ar.fromBufferAttribute(d,m),Ph(ar,m,c,s,e,t,this)}}else{const u=Math.max(0,r.start),f=Math.min(d.count,r.start+r.count);for(let g=u,x=f;g<x;g++)ar.fromBufferAttribute(d,g),Ph(ar,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Ph(i,e,t,n,s,a,r){const o=Dc.distanceSqToPoint(i);if(o<t){const c=new L;Dc.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;a.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}class cu extends Xt{constructor(e=[],t=es,n,s,a,r,o,c,l,h){super(e,t,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Vs extends Xt{constructor(e,t,n,s,a,r,o,c,l){super(e,t,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ks extends Xt{constructor(e,t,n=Qn,s,a,r,o=Vt,c=Vt,l,h=xi,d=1){if(h!==xi&&h!==ji)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new hl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Np extends ks{constructor(e,t=Qn,n=es,s,a,r=Vt,o=Vt,c,l=xi){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,a,r,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class lu extends Xt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class U extends Ot{constructor(e=1,t=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,r,a,0),g("z","y","x",1,-1,n,t,-e,r,a,1),g("x","z","y",1,1,e,n,t,s,r,2),g("x","z","y",1,-1,e,n,-t,s,r,3),g("x","y","z",1,-1,e,t,n,s,a,4),g("x","y","z",-1,-1,e,t,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new ht(l,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(d,2));function g(x,m,p,v,w,M,T,S,A,_,b){const C=M/A,P=T/_,I=M/2,O=T/2,K=S/2,k=A+1,$=_+1;let V=0,Q=0;const ae=new L;for(let oe=0;oe<$;oe++){const me=oe*P-O;for(let ce=0;ce<k;ce++){const Ke=ce*C-I;ae[x]=Ke*v,ae[m]=me*w,ae[p]=K,l.push(ae.x,ae.y,ae.z),ae[x]=0,ae[m]=0,ae[p]=S>0?1:-1,h.push(ae.x,ae.y,ae.z),d.push(ce/A),d.push(1-oe/_),V+=1}}for(let oe=0;oe<_;oe++)for(let me=0;me<A;me++){const ce=u+me+k*oe,Ke=u+me+k*(oe+1),ut=u+(me+1)+k*(oe+1),Ve=u+(me+1)+k*oe;c.push(ce,Ke,Ve),c.push(Ke,ut,Ve),Q+=6}o.addGroup(f,Q,b),f+=Q,u+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new U(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class gl extends Ot{constructor(e=1,t=1,n=4,s=8,a=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:a},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),a=Math.max(1,Math.floor(a));const r=[],o=[],c=[],l=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,g=n*2+a,x=s+1,m=new L,p=new L;for(let v=0;v<=g;v++){let w=0,M=0,T=0,S=0;if(v<=n){const b=v/n,C=b*Math.PI/2;M=-h-e*Math.cos(C),T=e*Math.sin(C),S=-e*Math.cos(C),w=b*d}else if(v<=n+a){const b=(v-n)/a;M=-h+b*t,T=e,S=0,w=d+b*u}else{const b=(v-n-a)/n,C=b*Math.PI/2;M=h+e*Math.sin(C),T=e*Math.cos(C),S=e*Math.sin(C),w=d+u+b*d}const A=Math.max(0,Math.min(1,w/f));let _=0;v===0?_=.5/s:v===g&&(_=-.5/s);for(let b=0;b<=s;b++){const C=b/s,P=C*Math.PI*2,I=Math.sin(P),O=Math.cos(P);p.x=-T*O,p.y=M,p.z=T*I,o.push(p.x,p.y,p.z),m.set(-T*O,S,T*I),m.normalize(),c.push(m.x,m.y,m.z),l.push(C+_,A)}if(v>0){const b=(v-1)*x;for(let C=0;C<s;C++){const P=b+C,I=b+C+1,O=v*x+C,K=v*x+C+1;r.push(P,I,O),r.push(I,K,O)}}}this.setIndex(r),this.setAttribute("position",new ht(o,3)),this.setAttribute("normal",new ht(c,3)),this.setAttribute("uv",new ht(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gl(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class xn extends Ot{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],c=[],l=new L,h=new He;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),r.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(r[u]/e+1)/2,h.y=(r[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)a.push(d,d+1,0);this.setIndex(a),this.setAttribute("position",new ht(r,3)),this.setAttribute("normal",new ht(o,3)),this.setAttribute("uv",new ht(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Oe extends Ot{constructor(e=1,t=1,n=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),a=Math.floor(a);const h=[],d=[],u=[],f=[];let g=0;const x=[],m=n/2;let p=0;v(),r===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ht(d,3)),this.setAttribute("normal",new ht(u,3)),this.setAttribute("uv",new ht(f,2));function v(){const M=new L,T=new L;let S=0;const A=(t-e)/n;for(let _=0;_<=a;_++){const b=[],C=_/a,P=C*(t-e)+e;for(let I=0;I<=s;I++){const O=I/s,K=O*c+o,k=Math.sin(K),$=Math.cos(K);T.x=P*k,T.y=-C*n+m,T.z=P*$,d.push(T.x,T.y,T.z),M.set(k,A,$).normalize(),u.push(M.x,M.y,M.z),f.push(O,1-C),b.push(g++)}x.push(b)}for(let _=0;_<s;_++)for(let b=0;b<a;b++){const C=x[b][_],P=x[b+1][_],I=x[b+1][_+1],O=x[b][_+1];(e>0||b!==0)&&(h.push(C,P,O),S+=3),(t>0||b!==a-1)&&(h.push(P,I,O),S+=3)}l.addGroup(p,S,0),p+=S}function w(M){const T=g,S=new He,A=new L;let _=0;const b=M===!0?e:t,C=M===!0?1:-1;for(let I=1;I<=s;I++)d.push(0,m*C,0),u.push(0,C,0),f.push(.5,.5),g++;const P=g;for(let I=0;I<=s;I++){const K=I/s*c+o,k=Math.cos(K),$=Math.sin(K);A.x=b*$,A.y=m*C,A.z=b*k,d.push(A.x,A.y,A.z),u.push(0,C,0),S.x=k*.5+.5,S.y=$*.5*C+.5,f.push(S.x,S.y),g++}for(let I=0;I<s;I++){const O=T+I,K=P+I;M===!0?h.push(K,K+1,O):h.push(K+1,K,O),_+=3}l.addGroup(p,_,M===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ki extends Oe{constructor(e=1,t=1,n=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,n,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new ki(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Mi extends Ot{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,d=e/o,u=t/c,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){const v=p*u-r;for(let w=0;w<l;w++){const M=w*d-a;g.push(M,-v,0),x.push(0,0,1),m.push(w/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){const w=v+l*p,M=v+l*(p+1),T=v+1+l*(p+1),S=v+1+l*p;f.push(w,M,S),f.push(M,T,S)}this.setIndex(f),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(x,3)),this.setAttribute("uv",new ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ln extends Ot{constructor(e=.5,t=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/s,f=new L,g=new He;for(let x=0;x<=s;x++){for(let m=0;m<=n;m++){const p=a+m/n*r;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let x=0;x<s;x++){const m=x*(n+1);for(let p=0;p<n;p++){const v=p+m,w=v,M=v+n+1,T=v+n+2,S=v+1;o.push(w,M,S),o.push(M,T,S)}}this.setIndex(o),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(l,3)),this.setAttribute("uv",new ht(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ln(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ke extends Ot{constructor(e=1,t=32,n=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(r+o,Math.PI);let l=0;const h=[],d=new L,u=new L,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){const v=[],w=p/n,M=r+w*o,T=e*Math.cos(M),S=Math.sqrt(e*e-T*T);let A=0;p===0&&r===0?A=.5/t:p===n&&c===Math.PI&&(A=-.5/t);for(let _=0;_<=t;_++){const b=_/t,C=s+b*a;d.x=-S*Math.cos(C),d.y=T,d.z=S*Math.sin(C),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),m.push(b+A,1-w),v.push(l++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<t;v++){const w=h[p][v+1],M=h[p][v],T=h[p+1][v],S=h[p+1][v+1];(p!==0||r>0)&&f.push(w,M,S),(p!==n-1||c<Math.PI)&&f.push(M,T,S)}this.setIndex(f),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(x,3)),this.setAttribute("uv",new ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ke(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Jt extends Ot{constructor(e=1,t=.4,n=12,s=48,a=Math.PI*2,r=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:a,thetaStart:r,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const c=[],l=[],h=[],d=[],u=new L,f=new L,g=new L;for(let x=0;x<=n;x++){const m=r+x/n*o;for(let p=0;p<=s;p++){const v=p/s*a;f.x=(e+t*Math.cos(m))*Math.cos(v),f.y=(e+t*Math.cos(m))*Math.sin(v),f.z=t*Math.sin(m),l.push(f.x,f.y,f.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/s),d.push(x/n)}}for(let x=1;x<=n;x++)for(let m=1;m<=s;m++){const p=(s+1)*x+m-1,v=(s+1)*(x-1)+m-1,w=(s+1)*(x-1)+m,M=(s+1)*x+m;c.push(p,v,M),c.push(v,w,M)}this.setIndex(c),this.setAttribute("position",new ht(l,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Bs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Ih(s))s.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Ih(s[0])){const a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][n]=a}else e[t][n]=s.slice();else e[t][n]=s}}return e}function rn(i){const e={};for(let t=0;t<i.length;t++){const n=Bs(i[t]);for(const s in n)e[s]=n[s]}return e}function Ih(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Up(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function hu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const Fp={clone:Bs,merge:rn};var Op=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class On extends An{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Op,this.fragmentShader=kp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=Up(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Le().setHex(s.value);break;case"v2":this.uniforms[n].value=new He().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Mt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Xe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new $e().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Bp extends On{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ct extends An{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dr,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ni extends ct{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new He(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return st(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Le(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Le(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Le(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class zp extends An{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dr,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=jc,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Gp extends An{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Hp extends An{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function rr(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Vp(i){function e(s,a){return i[s]-i[a]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Lh(i,e,t){const n=i.length,s=new i.constructor(n);for(let a=0,r=0;r!==n;++a){const o=t[a]*e;for(let c=0;c!==e;++c)s[r++]=i[o+c]}return s}function Wp(i,e,t,n){let s=1,a=i[0];for(;a!==void 0&&a[n]===void 0;)a=i[s++];if(a===void 0)return;let r=a[n];if(r!==void 0)if(Array.isArray(r))do r=a[n],r!==void 0&&(e.push(a.time),t.push(...r)),a=i[s++];while(a!==void 0);else if(r.toArray!==void 0)do r=a[n],r!==void 0&&(e.push(a.time),r.toArray(t,t.length)),a=i[s++];while(a!==void 0);else do r=a[n],r!==void 0&&(e.push(a.time),t.push(r)),a=i[s++];while(a!==void 0)}class Ws{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],a=t[n-1];n:{e:{let r;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<a)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(a=s,s=t[++n],e<s)break e}r=t.length;break t}if(!(e>=a)){const o=t[1];e<o&&(n=2,a=o);for(let c=n-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=a,a=t[--n-1],e>=a)break e}r=n,n=0;break t}break n}for(;n<r;){const o=n+r>>>1;e<t[o]?r=o:n=o+1}if(s=t[n],a=t[n-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,a,s)}return this.interpolate_(n,a,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,a=e*s;for(let r=0;r!==s;++r)t[r]=n[a+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Xp extends Ws{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Kl,endingEnd:Kl}}intervalChanged_(e,t,n){const s=this.parameterPositions;let a=e-2,r=e+1,o=s[a],c=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case Zl:a=e,o=2*t-n;break;case Jl:a=s.length-2,o=t+s[a]-s[a+1];break;default:a=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Zl:r=e,c=2*n-t;break;case Jl:r=1,c=n+s[1]-s[0];break;default:r=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=a*h,this._offsetNext=r*h}interpolate_(e,t,n,s){const a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),x=g*g,m=x*g,p=-u*m+2*u*x-u*g,v=(1+u)*m+(-1.5-2*u)*x+(-.5+u)*g+1,w=(-1-f)*m+(1.5+f)*x+.5*g,M=f*m-f*x;for(let T=0;T!==o;++T)a[T]=p*r[h+T]+v*r[l+T]+w*r[c+T]+M*r[d+T];return a}}class qp extends Ws{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)a[u]=r[l+u]*d+r[c+u]*h;return a}}class Yp extends Ws{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class $p extends Ws{interpolate_(e,t,n,s){const a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const g=(n-t)/(s-t),x=1-g;for(let m=0;m!==o;++m)a[m]=r[l+m]*x+r[c+m]*g;return a}const u=o*2,f=e-1;for(let g=0;g!==o;++g){const x=r[l+g],m=r[c+g],p=f*u+g*2,v=d[p],w=d[p+1],M=e*u+g*2,T=h[M],S=h[M+1];let A=(n-t)/(s-t),_,b,C,P,I;for(let O=0;O<8;O++){_=A*A,b=_*A,C=1-A,P=C*C,I=P*C;const k=I*t+3*P*A*v+3*C*_*T+b*s-n;if(Math.abs(k)<1e-10)break;const $=3*P*(v-t)+6*C*A*(T-v)+3*_*(s-T);if(Math.abs($)<1e-10)break;A=A-k/$,A=Math.max(0,Math.min(1,A))}a[g]=I*x+3*P*A*w+3*C*_*S+b*m}return a}}class kn{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=rr(t,this.TimeBufferType),this.values=rr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:rr(e.times,Array),values:rr(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Yp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new $p(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ya:t=this.InterpolantFactoryMethodDiscrete;break;case Sa:t=this.InterpolantFactoryMethodLinear;break;case Qr:t=this.InterpolantFactoryMethodSmooth;break;case $l:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ya;case this.InterpolantFactoryMethodLinear:return Sa;case this.InterpolantFactoryMethodSmooth:return Qr;case this.InterpolantFactoryMethodBezier:return $l}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let a=0,r=s-1;for(;a!==s&&n[a]<e;)++a;for(;r!==-1&&n[r]>t;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);const o=this.getValueSize();this.times=n.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ge("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,a=n.length;a===0&&(Ge("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let o=0;o!==a;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){Ge("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(r!==null&&r>c){Ge("KeyframeTrack: Out of order keys.",this,o,c,r),e=!1;break}r=c}if(s!==void 0&&Bf(s))for(let o=0,c=s.length;o!==c;++o){const l=s[o];if(isNaN(l)){Ge("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Qr,a=e.length-1;let r=1;for(let o=1;o<a;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{const d=o*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){const x=t[d+g];if(x!==t[u+g]||x!==t[f+g]){c=!0;break}}}if(c){if(o!==r){e[r]=e[o];const d=o*n,u=r*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++r}}if(a>0){e[r]=e[a];for(let o=a*n,c=r*n,l=0;l!==n;++l)t[c+l]=t[o+l];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}kn.prototype.ValueTypeName="";kn.prototype.TimeBufferType=Float32Array;kn.prototype.ValueBufferType=Float32Array;kn.prototype.DefaultInterpolation=Sa;class Xs extends kn{constructor(e,t,n){super(e,t,n)}}Xs.prototype.ValueTypeName="bool";Xs.prototype.ValueBufferType=Array;Xs.prototype.DefaultInterpolation=ya;Xs.prototype.InterpolantFactoryMethodLinear=void 0;Xs.prototype.InterpolantFactoryMethodSmooth=void 0;class du extends kn{constructor(e,t,n,s){super(e,t,n,s)}}du.prototype.ValueTypeName="color";class Ea extends kn{constructor(e,t,n,s){super(e,t,n,s)}}Ea.prototype.ValueTypeName="number";class Kp extends Ws{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t);let l=e*o;for(let h=l+o;l!==h;l+=4)ei.slerpFlat(a,0,r,l-o,r,l,c);return a}}class Aa extends kn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Kp(this.times,this.values,this.getValueSize(),e)}}Aa.prototype.ValueTypeName="quaternion";Aa.prototype.InterpolantFactoryMethodSmooth=void 0;class qs extends kn{constructor(e,t,n){super(e,t,n)}}qs.prototype.ValueTypeName="string";qs.prototype.ValueBufferType=Array;qs.prototype.DefaultInterpolation=ya;qs.prototype.InterpolantFactoryMethodLinear=void 0;qs.prototype.InterpolantFactoryMethodSmooth=void 0;class Br extends kn{constructor(e,t,n,s){super(e,t,n,s)}}Br.prototype.ValueTypeName="vector";class Zp{constructor(e="",t=-1,n=[],s=Rf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Fn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let r=0,o=n.length;r!==o;++r)t.push(jp(n[r]).scale(s));const a=new this(e.name,e.duration,t,e.blendMode);return a.uuid=e.uuid,a.userData=JSON.parse(e.userData||"{}"),a}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let a=0,r=n.length;a!==r;++a)t.push(kn.toJSON(n[a]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const a=t.length,r=[];for(let o=0;o<a;o++){let c=[],l=[];c.push((o+a-1)%a,o,(o+1)%a),l.push(0,1,0);const h=Vp(c);c=Lh(c,1,h),l=Lh(l,1,h),!s&&c[0]===0&&(c.push(a),l.push(l[0])),r.push(new Ea(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},a=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(a);if(h&&h.length>1){const d=h[1];let u=s[d];u||(s[d]=u=[]),u.push(l)}}const r=[];for(const o in s)r.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return r}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const a=this.tracks[n];t=Math.max(t,a.times[a.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Jp(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ea;case"vector":case"vector2":case"vector3":case"vector4":return Br;case"color":return du;case"quaternion":return Aa;case"bool":case"boolean":return Xs;case"string":return qs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function jp(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Jp(i.type);if(i.times===void 0){const t=[],n=[];Wp(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const di={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Dh(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Dh(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Dh(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Qp{constructor(e,t,n){const s=this;let a=!1,r=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,a===!1&&s.onStart!==void 0&&s.onStart(h,r,o),a=!0},this.itemEnd=function(h){r++,s.onProgress!==void 0&&s.onProgress(h,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const em=new Qp;class Ys{constructor(e){this.manager=e!==void 0?e:em,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,a){n.load(e,s,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Ys.DEFAULT_MATERIAL_NAME="__DEFAULT";const ci={};class tm extends Error{constructor(e,t){super(e),this.response=t}}class uu extends Ys{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=di.get(`file:${e}`);if(a!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(a),this.manager.itemEnd(e)},0);return}if(ci[e]!==void 0){ci[e].push({onLoad:t,onProgress:n,onError:s});return}ci[e]=[],ci[e].push({onLoad:t,onProgress:n,onError:s});const r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(r).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=ci[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=u?parseInt(u):0,g=f!==0;let x=0;const m=new ReadableStream({start(p){v();function v(){d.read().then(({done:w,value:M})=>{if(w)p.close();else{x+=M.byteLength;const T=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:f});for(let S=0,A=h.length;S<A;S++){const _=h[S];_.onProgress&&_.onProgress(T)}p.enqueue(M),v()}},w=>{p.error(w)})}}});return new Response(m)}else throw new tm(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{di.add(`file:${e}`,l);const h=ci[e];delete ci[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=ci[e];if(h===void 0)throw this.manager.itemError(e),l;delete ci[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ss=new WeakMap;class nm extends Ys{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,r=di.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)a.manager.itemStart(e),setTimeout(function(){t&&t(r),a.manager.itemEnd(e)},0);else{let d=Ss.get(r);d===void 0&&(d=[],Ss.set(r,d)),d.push({onLoad:t,onError:s})}return r}const o=wa("img");function c(){h(),t&&t(this);const d=Ss.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}Ss.delete(this),a.manager.itemEnd(e)}function l(d){h(),s&&s(d),di.remove(`image:${e}`);const u=Ss.get(this)||[];for(let f=0;f<u.length;f++){const g=u[f];g.onError&&g.onError(d)}Ss.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),di.add(`image:${e}`,o),a.manager.itemStart(e),o.src=e,o}}class xl extends Ys{constructor(e){super(e)}load(e,t,n,s){const a=new Xt,r=new nm(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){a.image=o,a.needsUpdate=!0,t!==void 0&&t(a)},n,s),a}}class Xr extends lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Le(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class im extends Xr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ao=new $e,Nh=new L,Uh=new L;class _l{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.mapType=Mn,this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new pl,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Nh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Nh),Uh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Uh),t.updateMatrixWorld(),Ao.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ao,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ba||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ao)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const or=new L,cr=new ei,Hn=new L;class fu extends lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=Zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(or,cr,Hn),Hn.x===1&&Hn.y===1&&Hn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(or,cr,Hn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(or,cr,Hn),Hn.x===1&&Hn.y===1&&Hn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(or,cr,Hn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Pi=new L,Fh=new He,Oh=new He;class cn extends fu{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(pa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Os*2*Math.atan(Math.tan(pa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z)}getViewSize(e,t){return this.getViewBounds(e,Fh,Oh),t.subVectors(Oh,Fh)}setViewOffset(e,t,n,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(pa*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class sm extends _l{constructor(){super(new cn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Os*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,a=e.distance||t.far;(n!==t.fov||s!==t.aspect||a!==t.far)&&(t.fov=n,t.aspect=s,t.far=a,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class am extends Xr{constructor(e,t,n=0,s=Math.PI/3,a=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.distance=n,this.angle=s,this.penumbra=a,this.decay=r,this.map=null,this.shadow=new sm}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class rm extends _l{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0}}class Ml extends Xr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new rm}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class qr extends fu{constructor(e=-1,t=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-e,r=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class om extends _l{constructor(){super(new qr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wr extends Xr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.shadow=new om}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ga{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Ro=new WeakMap;class cm extends Ys{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,r=di.get(`image-bitmap:${e}`);if(r!==void 0){if(a.manager.itemStart(e),r.then){r.then(l=>{Ro.has(r)===!0?(s&&s(Ro.get(r)),a.manager.itemError(e),a.manager.itemEnd(e)):(t&&t(l),a.manager.itemEnd(e))});return}setTimeout(function(){t&&t(r),a.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(a.options,{colorSpaceConversion:"none"}))}).then(function(l){di.add(`image-bitmap:${e}`,l),t&&t(l),a.manager.itemEnd(e)}).catch(function(l){s&&s(l),Ro.set(c,l),di.remove(`image-bitmap:${e}`),a.manager.itemError(e),a.manager.itemEnd(e)});di.add(`image-bitmap:${e}`,c),a.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const bs=-90,ws=1;class lm extends lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(bs,ws,e,t);s.layers=this.layers,this.add(s);const a=new cn(bs,ws,e,t);a.layers=this.layers,this.add(a);const r=new cn(bs,ws,e,t);r.layers=this.layers,this.add(r);const o=new cn(bs,ws,e,t);o.layers=this.layers,this.add(o);const c=new cn(bs,ws,e,t);c.layers=this.layers,this.add(c);const l=new cn(bs,ws,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,a,r,o,c]=t;for(const l of t)this.remove(l);if(e===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class hm extends cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const vl="\\[\\]\\.:\\/",dm=new RegExp("["+vl+"]","g"),yl="[^"+vl+"]",um="[^"+vl.replace("\\.","")+"]",fm=/((?:WC+[\/:])*)/.source.replace("WC",yl),pm=/(WCOD+)?/.source.replace("WCOD",um),mm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",yl),gm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",yl),xm=new RegExp("^"+fm+pm+mm+gm+"$"),_m=["material","materials","bones","map"];class Mm{constructor(e,t,n){const s=n||gt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=n.length;s!==a;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class gt{constructor(e,t,n){this.path=t,this.parsedPath=n||gt.parseTrackName(t),this.node=gt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new gt.Composite(e,t,n):new gt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(dm,"")}static parseTrackName(e){const t=xm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const a=n.nodeName.substring(s+1);_m.indexOf(a)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=a)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(a){for(let r=0;r<a.length;r++){const o=a[r];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let a=t.propertyIndex;if(e||(e=gt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ge("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ge("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ge("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ge("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ge("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ge("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const r=e[s];if(r===void 0){const l=t.nodeName;Ge("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ge("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[a]!==void 0&&(a=e.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(c=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}gt.Composite=Mm;gt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};gt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};gt.prototype.GetterByBindingType=[gt.prototype._getValue_direct,gt.prototype._getValue_array,gt.prototype._getValue_arrayElement,gt.prototype._getValue_toArray];gt.prototype.SetterByBindingTypeAndVersioning=[[gt.prototype._setValue_direct,gt.prototype._setValue_direct_setNeedsUpdate,gt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_array,gt.prototype._setValue_array_setNeedsUpdate,gt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_arrayElement,gt.prototype._setValue_arrayElement_setNeedsUpdate,gt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_fromArray,gt.prototype._setValue_fromArray_setNeedsUpdate,gt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class pu{static{pu.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const a=this.elements;return a[0]=e,a[2]=t,a[1]=n,a[3]=s,this}}function kh(i,e,t,n){const s=vm(n);switch(t){case Yd:return i*e;case il:return i*e/s.components*s.byteLength;case sl:return i*e/s.components*s.byteLength;case ts:return i*e*2/s.components*s.byteLength;case al:return i*e*2/s.components*s.byteLength;case $d:return i*e*3/s.components*s.byteLength;case En:return i*e*4/s.components*s.byteLength;case rl:return i*e*4/s.components*s.byteLength;case vr:case yr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Sr:case br:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case tc:case ic:return Math.max(i,16)*Math.max(e,8)/4;case ec:case nc:return Math.max(i,8)*Math.max(e,8)/2;case sc:case ac:case oc:case cc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case rc:case Ir:case lc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case hc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case dc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case uc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case fc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case pc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case mc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case gc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case xc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case _c:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Mc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case vc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case yc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Sc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case bc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case wc:case Tc:case Ec:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ac:case Rc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Lr:case Cc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vm(i){switch(i){case Mn:case Vd:return{byteLength:1,components:1};case Ma:case Wd:case gi:return{byteLength:2,components:1};case tl:case nl:return{byteLength:2,components:4};case Qn:case el:case Tn:return{byteLength:4,components:1};case Xd:case qd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jc}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jc);function mu(){let i=null,e=!1,t=null,n=null;function s(a,r){t(a,r),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function ym(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],x=d[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const x=d[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}var Sm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,wm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Em=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Am=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Cm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Um=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Fm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,km=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Hm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Vm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Wm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Xm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,qm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ym=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,$m=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Km=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,e0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,t0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,n0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,i0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,a0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,r0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,o0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,c0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,l0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,h0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,d0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,u0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,f0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,p0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,m0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,g0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,M0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,v0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,y0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,S0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,b0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,w0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,T0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,E0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,C0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,P0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,L0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,N0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,U0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,F0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,O0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,B0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,z0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,G0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,H0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,X0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,q0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Y0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,K0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Z0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,J0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,j0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Q0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,eg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ng=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ig=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ag=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,og=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,cg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,hg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ug=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,pg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,mg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,gg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Cg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Pg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ig=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Dg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ng=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ug=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Og=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Gg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Vg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Wg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Yg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$g=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Jg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ex=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:Sm,alphahash_pars_fragment:bm,alphamap_fragment:wm,alphamap_pars_fragment:Tm,alphatest_fragment:Em,alphatest_pars_fragment:Am,aomap_fragment:Rm,aomap_pars_fragment:Cm,batching_pars_vertex:Pm,batching_vertex:Im,begin_vertex:Lm,beginnormal_vertex:Dm,bsdfs:Nm,iridescence_fragment:Um,bumpmap_pars_fragment:Fm,clipping_planes_fragment:Om,clipping_planes_pars_fragment:km,clipping_planes_pars_vertex:Bm,clipping_planes_vertex:zm,color_fragment:Gm,color_pars_fragment:Hm,color_pars_vertex:Vm,color_vertex:Wm,common:Xm,cube_uv_reflection_fragment:qm,defaultnormal_vertex:Ym,displacementmap_pars_vertex:$m,displacementmap_vertex:Km,emissivemap_fragment:Zm,emissivemap_pars_fragment:Jm,colorspace_fragment:jm,colorspace_pars_fragment:Qm,envmap_fragment:e0,envmap_common_pars_fragment:t0,envmap_pars_fragment:n0,envmap_pars_vertex:i0,envmap_physical_pars_fragment:p0,envmap_vertex:s0,fog_vertex:a0,fog_pars_vertex:r0,fog_fragment:o0,fog_pars_fragment:c0,gradientmap_pars_fragment:l0,lightmap_pars_fragment:h0,lights_lambert_fragment:d0,lights_lambert_pars_fragment:u0,lights_pars_begin:f0,lights_toon_fragment:m0,lights_toon_pars_fragment:g0,lights_phong_fragment:x0,lights_phong_pars_fragment:_0,lights_physical_fragment:M0,lights_physical_pars_fragment:v0,lights_fragment_begin:y0,lights_fragment_maps:S0,lights_fragment_end:b0,lightprobes_pars_fragment:w0,logdepthbuf_fragment:T0,logdepthbuf_pars_fragment:E0,logdepthbuf_pars_vertex:A0,logdepthbuf_vertex:R0,map_fragment:C0,map_pars_fragment:P0,map_particle_fragment:I0,map_particle_pars_fragment:L0,metalnessmap_fragment:D0,metalnessmap_pars_fragment:N0,morphinstance_vertex:U0,morphcolor_vertex:F0,morphnormal_vertex:O0,morphtarget_pars_vertex:k0,morphtarget_vertex:B0,normal_fragment_begin:z0,normal_fragment_maps:G0,normal_pars_fragment:H0,normal_pars_vertex:V0,normal_vertex:W0,normalmap_pars_fragment:X0,clearcoat_normal_fragment_begin:q0,clearcoat_normal_fragment_maps:Y0,clearcoat_pars_fragment:$0,iridescence_pars_fragment:K0,opaque_fragment:Z0,packing:J0,premultiplied_alpha_fragment:j0,project_vertex:Q0,dithering_fragment:eg,dithering_pars_fragment:tg,roughnessmap_fragment:ng,roughnessmap_pars_fragment:ig,shadowmap_pars_fragment:sg,shadowmap_pars_vertex:ag,shadowmap_vertex:rg,shadowmask_pars_fragment:og,skinbase_vertex:cg,skinning_pars_vertex:lg,skinning_vertex:hg,skinnormal_vertex:dg,specularmap_fragment:ug,specularmap_pars_fragment:fg,tonemapping_fragment:pg,tonemapping_pars_fragment:mg,transmission_fragment:gg,transmission_pars_fragment:xg,uv_pars_fragment:_g,uv_pars_vertex:Mg,uv_vertex:vg,worldpos_vertex:yg,background_vert:Sg,background_frag:bg,backgroundCube_vert:wg,backgroundCube_frag:Tg,cube_vert:Eg,cube_frag:Ag,depth_vert:Rg,depth_frag:Cg,distance_vert:Pg,distance_frag:Ig,equirect_vert:Lg,equirect_frag:Dg,linedashed_vert:Ng,linedashed_frag:Ug,meshbasic_vert:Fg,meshbasic_frag:Og,meshlambert_vert:kg,meshlambert_frag:Bg,meshmatcap_vert:zg,meshmatcap_frag:Gg,meshnormal_vert:Hg,meshnormal_frag:Vg,meshphong_vert:Wg,meshphong_frag:Xg,meshphysical_vert:qg,meshphysical_frag:Yg,meshtoon_vert:$g,meshtoon_frag:Kg,points_vert:Zg,points_frag:Jg,shadow_vert:jg,shadow_frag:Qg,sprite_vert:ex,sprite_frag:tx},ve={common:{diffuse:{value:new Le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Le(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},Yn={basic:{uniforms:rn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:rn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Le(0)},envMapIntensity:{value:1}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:rn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Le(0)},specular:{value:new Le(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:rn([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:rn([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Le(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:rn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:rn([ve.points,ve.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:rn([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:rn([ve.common,ve.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:rn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:rn([ve.sprite,ve.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distance:{uniforms:rn([ve.common,ve.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distance_vert,fragmentShader:je.distance_frag},shadow:{uniforms:rn([ve.lights,ve.fog,{color:{value:new Le(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};Yn.physical={uniforms:rn([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Le(0)},specularColor:{value:new Le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const lr={r:0,b:0,g:0},nx=new $e,gu=new Xe;gu.set(-1,0,0,0,1,0,0,0,1);function ix(i,e,t,n,s,a){const r=new Le(0);let o=s===!0?0:1,c,l,h=null,d=0,u=null;function f(v){let w=v.isScene===!0?v.background:null;if(w&&w.isTexture){const M=v.backgroundBlurriness>0;w=e.get(w,M)}return w}function g(v){let w=!1;const M=f(v);M===null?m(r,o):M&&M.isColor&&(m(M,1),w=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(i.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,w){const M=f(w);M&&(M.isCubeTexture||M.mapping===Hr)?(l===void 0&&(l=new F(new U(1,1,1),new On({name:"BackgroundCubeMaterial",uniforms:Bs(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(nx.makeRotationFromEuler(w.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(gu),l.material.toneMapped=it.getTransfer(M.colorSpace)!==pt,(h!==M||d!==M.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,u=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new F(new Mi(2,2),new On({name:"BackgroundMaterial",uniforms:Bs(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=it.getTransfer(M.colorSpace)!==pt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,u=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,w){v.getRGB(lr,hu(i)),t.buffers.color.setClear(lr.r,lr.g,lr.b,w,a)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return r},setClearColor:function(v,w=1){r.set(v),o=w,m(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(r,o)},render:g,addToRenderList:x,dispose:p}}function sx(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let a=s,r=!1;function o(P,I,O,K,k){let $=!1;const V=d(P,K,O,I);a!==V&&(a=V,l(a.object)),$=f(P,K,O,k),$&&g(P,K,O,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),($||r)&&(r=!1,M(P,I,O,K),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return i.createVertexArray()}function l(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function d(P,I,O,K){const k=K.wireframe===!0;let $=n[I.id];$===void 0&&($={},n[I.id]=$);const V=P.isInstancedMesh===!0?P.id:0;let Q=$[V];Q===void 0&&(Q={},$[V]=Q);let ae=Q[O.id];ae===void 0&&(ae={},Q[O.id]=ae);let oe=ae[k];return oe===void 0&&(oe=u(c()),ae[k]=oe),oe}function u(P){const I=[],O=[],K=[];for(let k=0;k<t;k++)I[k]=0,O[k]=0,K[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:O,attributeDivisors:K,object:P,attributes:{},index:null}}function f(P,I,O,K){const k=a.attributes,$=I.attributes;let V=0;const Q=O.getAttributes();for(const ae in Q)if(Q[ae].location>=0){const me=k[ae];let ce=$[ae];if(ce===void 0&&(ae==="instanceMatrix"&&P.instanceMatrix&&(ce=P.instanceMatrix),ae==="instanceColor"&&P.instanceColor&&(ce=P.instanceColor)),me===void 0||me.attribute!==ce||ce&&me.data!==ce.data)return!0;V++}return a.attributesNum!==V||a.index!==K}function g(P,I,O,K){const k={},$=I.attributes;let V=0;const Q=O.getAttributes();for(const ae in Q)if(Q[ae].location>=0){let me=$[ae];me===void 0&&(ae==="instanceMatrix"&&P.instanceMatrix&&(me=P.instanceMatrix),ae==="instanceColor"&&P.instanceColor&&(me=P.instanceColor));const ce={};ce.attribute=me,me&&me.data&&(ce.data=me.data),k[ae]=ce,V++}a.attributes=k,a.attributesNum=V,a.index=K}function x(){const P=a.newAttributes;for(let I=0,O=P.length;I<O;I++)P[I]=0}function m(P){p(P,0)}function p(P,I){const O=a.newAttributes,K=a.enabledAttributes,k=a.attributeDivisors;O[P]=1,K[P]===0&&(i.enableVertexAttribArray(P),K[P]=1),k[P]!==I&&(i.vertexAttribDivisor(P,I),k[P]=I)}function v(){const P=a.newAttributes,I=a.enabledAttributes;for(let O=0,K=I.length;O<K;O++)I[O]!==P[O]&&(i.disableVertexAttribArray(O),I[O]=0)}function w(P,I,O,K,k,$,V){V===!0?i.vertexAttribIPointer(P,I,O,k,$):i.vertexAttribPointer(P,I,O,K,k,$)}function M(P,I,O,K){x();const k=K.attributes,$=O.getAttributes(),V=I.defaultAttributeValues;for(const Q in $){const ae=$[Q];if(ae.location>=0){let oe=k[Q];if(oe===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(oe=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(oe=P.instanceColor)),oe!==void 0){const me=oe.normalized,ce=oe.itemSize,Ke=e.get(oe);if(Ke===void 0)continue;const ut=Ke.buffer,Ve=Ke.type,ee=Ke.bytesPerElement,ue=Ve===i.INT||Ve===i.UNSIGNED_INT||oe.gpuType===el;if(oe.isInterleavedBufferAttribute){const re=oe.data,H=re.stride,j=oe.offset;if(re.isInstancedInterleavedBuffer){for(let de=0;de<ae.locationSize;de++)p(ae.location+de,re.meshPerAttribute);P.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let de=0;de<ae.locationSize;de++)m(ae.location+de);i.bindBuffer(i.ARRAY_BUFFER,ut);for(let de=0;de<ae.locationSize;de++)w(ae.location+de,ce/ae.locationSize,Ve,me,H*ee,(j+ce/ae.locationSize*de)*ee,ue)}else{if(oe.isInstancedBufferAttribute){for(let re=0;re<ae.locationSize;re++)p(ae.location+re,oe.meshPerAttribute);P.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let re=0;re<ae.locationSize;re++)m(ae.location+re);i.bindBuffer(i.ARRAY_BUFFER,ut);for(let re=0;re<ae.locationSize;re++)w(ae.location+re,ce/ae.locationSize,Ve,me,ce*ee,ce/ae.locationSize*re*ee,ue)}}else if(V!==void 0){const me=V[Q];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(ae.location,me);break;case 3:i.vertexAttrib3fv(ae.location,me);break;case 4:i.vertexAttrib4fv(ae.location,me);break;default:i.vertexAttrib1fv(ae.location,me)}}}}v()}function T(){b();for(const P in n){const I=n[P];for(const O in I){const K=I[O];for(const k in K){const $=K[k];for(const V in $)h($[V].object),delete $[V];delete K[k]}}delete n[P]}}function S(P){if(n[P.id]===void 0)return;const I=n[P.id];for(const O in I){const K=I[O];for(const k in K){const $=K[k];for(const V in $)h($[V].object),delete $[V];delete K[k]}}delete n[P.id]}function A(P){for(const I in n){const O=n[I];for(const K in O){const k=O[K];if(k[P.id]===void 0)continue;const $=k[P.id];for(const V in $)h($[V].object),delete $[V];delete k[P.id]}}}function _(P){for(const I in n){const O=n[I],K=P.isInstancedMesh===!0?P.id:0,k=O[K];if(k!==void 0){for(const $ in k){const V=k[$];for(const Q in V)h(V[Q].object),delete V[Q];delete k[$]}delete O[K],Object.keys(O).length===0&&delete n[I]}}}function b(){C(),r=!0,a!==s&&(a=s,l(a.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:C,dispose:T,releaseStatesOfGeometry:S,releaseStatesOfObject:_,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:m,disableUnusedAttributes:v}}function ax(i,e,t){let n;function s(c){n=c}function a(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function r(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,n,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function rx(i,e,t,n){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==En&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const _=A===gi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Mn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Tn&&!_)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ie("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:w,maxFragmentUniforms:M,maxSamples:T,samples:S}}function ox(i){const e=this;let t=null,n=0,s=!1,a=!1;const r=new qi,o=new Xe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||a&&!m)a?h(null):l();else{const v=a?0:n,w=v*4;let M=p.clippingState||null;c.value=M,M=h(g,u,w,f);for(let T=0;T!==w;++T)M[T]=t[T];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=c.value,g!==!0||m===null){const p=f+x*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,M=f;w!==x;++w,M+=4)r.copy(d[w]).applyMatrix4(v,o),r.normal.toArray(m,M),m[M+3]=r.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}const Ni=4,Bh=[.125,.215,.35,.446,.526,.582],Zi=20,cx=256,ra=new qr,zh=new Le;let Co=null,Po=0,Io=0,Lo=!1;const lx=new L;class Nc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,a={}){const{size:r=256,position:o=lx}=a;Co=this._renderer.getRenderTarget(),Po=this._renderer.getActiveCubeFace(),Io=this._renderer.getActiveMipmapLevel(),Lo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Co,Po,Io),this._renderer.xr.enabled=Lo,e.scissorTest=!1,Ts(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===es||e.mapping===Fs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Co=this._renderer.getRenderTarget(),Po=this._renderer.getActiveCubeFace(),Io=this._renderer.getActiveMipmapLevel(),Lo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Wt,minFilter:Wt,generateMipmaps:!1,type:gi,format:En,colorSpace:vn,depthBuffer:!1},s=Gh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gh(e,t,n);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=hx(a)),this._blurMaterial=ux(a,e,t),this._ggxMaterial=dx(a,e,t)}return s}_compileMaterial(e){const t=new F(new Ot,e);this._renderer.compile(t,ra)}_sceneToCubeUV(e,t,n,s,a){const c=new cn(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(zh),d.toneMapping=Jn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new F(new U,new Un({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let p=!1;const v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,p=!0):(m.color.copy(zh),p=!0);for(let w=0;w<6;w++){const M=w%3;M===0?(c.up.set(0,l[w],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+h[w],a.y,a.z)):M===1?(c.up.set(0,0,l[w]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+h[w],a.z)):(c.up.set(0,l[w],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+h[w]));const T=this._cubeSize;Ts(s,M*T,w>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(x,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=v}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===es||e.mapping===Fs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hh());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;Ts(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(r,ra)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[n];o.material=r;const c=r.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=0+l*1.25,f=d*u,{_lodMax:g}=this,x=this._sizeLods[n],m=3*x*(n>g-Ni?n-g+Ni:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,Ts(a,m,p,3*x,2*x),s.setRenderTarget(a),s.render(o,ra),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=g-n,Ts(e,m,p,3*x,2*x),s.setRenderTarget(e),s.render(o,ra)}_blur(e,t,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,n,s,"latitudinal",a),this._halfBlur(r,e,n,n,s,"longitudinal",a)}_halfBlur(e,t,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Ge("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[s];d.material=l;const u=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*Zi-1),x=a/g,m=isFinite(a)?1+Math.floor(h*x):Zi;m>Zi&&Ie(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Zi}`);const p=[];let v=0;for(let A=0;A<Zi;++A){const _=A/x,b=Math.exp(-_*_/2);p.push(b),A===0?v+=b:A<m&&(v+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/v;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=r==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:w}=this;u.dTheta.value=g,u.mipInt.value=w-n;const M=this._sizeLods[s],T=3*M*(s>w-Ni?s-w+Ni:0),S=4*(this._cubeSize-M);Ts(t,T,S,3*M,2*M),c.setRenderTarget(t),c.render(d,ra)}}function hx(i){const e=[],t=[],n=[];let s=i;const a=i-Ni+1+Bh.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Ni?c=Bh[r-i+Ni-1]:r===0&&(c=0),t.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,x=3,m=2,p=1,v=new Float32Array(x*g*f),w=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let S=0;S<f;S++){const A=S%3*2/3-1,_=S>2?0:-1,b=[A,_,0,A+2/3,_,0,A+2/3,_+1,0,A,_,0,A+2/3,_+1,0,A,_+1,0];v.set(b,x*g*S),w.set(u,m*g*S);const C=[S,S,S,S,S,S];M.set(C,p*g*S)}const T=new Ot;T.setAttribute("position",new ln(v,x)),T.setAttribute("uv",new ln(w,m)),T.setAttribute("faceIndex",new ln(M,p)),n.push(new F(T,null)),s>Ni&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Gh(i,e,t){const n=new jn(i,e,t);return n.texture.mapping=Hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ts(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function dx(i,e,t){return new On({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:cx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Yr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function ux(i,e,t){const n=new Float32Array(Zi),s=new L(0,1,0);return new On({name:"SphericalGaussianBlur",defines:{n:Zi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Yr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Hh(){return new On({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Vh(){return new On({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Yr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class xu extends jn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new cu(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new U(5,5,5),a=new On({name:"CubemapFromEquirect",uniforms:Bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:fi});a.uniforms.tEquirect.value=t;const r=new F(s,a),o=t.minFilter;return t.minFilter===hi&&(t.minFilter=Wt),new lm(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,s);e.setRenderTarget(a)}}function fx(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?r(u):a(u)}function a(u){if(u&&u.isTexture){const f=u.mapping;if(f===Jr||f===jr)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const x=new xu(g.height);return x.fromEquirectangularTexture(i,u),e.set(u,x),u.addEventListener("dispose",l),o(x.texture,u.mapping)}else return null}}return u}function r(u){if(u&&u.isTexture){const f=u.mapping,g=f===Jr||f===jr,x=f===es||f===Fs;if(g||x){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new Nc(i)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const v=u.image;return g&&v&&v.height>0||x&&v&&c(v)?(n===null&&(n=new Nc(i)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Jr?u.mapping=es:f===jr&&(u.mapping=Fs),u}function c(u){let f=0;const g=6;for(let x=0;x<g;x++)u[x]!==void 0&&f++;return f===g}function l(u){const f=u.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function px(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Is("WebGLRenderer: "+n+" extension not supported."),s}}}function mx(i,e,t,n){const s={},a=new WeakMap;function r(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",r),delete s[u.id];const f=a.get(u);f&&(e.remove(f),a.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],i.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,g=d.attributes.position;let x=0;if(g===void 0)return;if(f!==null){const v=f.array;x=f.version;for(let w=0,M=v.length;w<M;w+=3){const T=v[w+0],S=v[w+1],A=v[w+2];u.push(T,S,S,A,A,T)}}else{const v=g.array;x=g.version;for(let w=0,M=v.length/3-1;w<M;w+=3){const T=w+0,S=w+1,A=w+2;u.push(T,S,S,A,A,T)}}const m=new(g.count>=65535?nu:tu)(u,1);m.version=x;const p=a.get(d);p&&e.remove(p),a.set(d,m)}function h(d){const u=a.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return a.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function gx(i,e,t){let n;function s(d){n=d}let a,r;function o(d){a=d.type,r=d.bytesPerElement}function c(d,u){i.drawElements(n,u,a,d*r),t.update(u,n,1)}function l(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,a,d*r,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,a,d,0,f);let x=0;for(let m=0;m<f;m++)x+=u[m];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function xx(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(t.calls++,r){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:Ge("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function _x(i,e,t){const n=new WeakMap,s=new Mt;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let C=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var f=C;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),x===!0&&(M=2),m===!0&&(M=3);let T=o.attributes.position.count*M,S=1;T>e.maxTextureSize&&(S=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const A=new Float32Array(T*S*4*d),_=new Jd(A,T,S,d);_.type=Tn,_.needsUpdate=!0;const b=M*4;for(let P=0;P<d;P++){const I=p[P],O=v[P],K=w[P],k=T*S*4*P;for(let $=0;$<I.count;$++){const V=$*b;g===!0&&(s.fromBufferAttribute(I,$),A[k+V+0]=s.x,A[k+V+1]=s.y,A[k+V+2]=s.z,A[k+V+3]=0),x===!0&&(s.fromBufferAttribute(O,$),A[k+V+4]=s.x,A[k+V+5]=s.y,A[k+V+6]=s.z,A[k+V+7]=0),m===!0&&(s.fromBufferAttribute(K,$),A[k+V+8]=s.x,A[k+V+9]=s.y,A[k+V+10]=s.z,A[k+V+11]=K.itemSize===4?s.w:1)}}u={count:d,texture:_,size:new He(T,S)},n.set(o,u),o.addEventListener("dispose",C)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const x=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:a}}function Mx(i,e,t,n,s){let a=new WeakMap;function r(l){const h=s.render.frame,d=l.geometry,u=e.get(l,d);if(a.get(u)!==h&&(e.update(u),a.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),a.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),a.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;a.get(f)!==h&&(f.update(),a.set(f,h))}return u}function o(){a=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const vx={[Ud]:"LINEAR_TONE_MAPPING",[Fd]:"REINHARD_TONE_MAPPING",[Od]:"CINEON_TONE_MAPPING",[Qc]:"ACES_FILMIC_TONE_MAPPING",[Bd]:"AGX_TONE_MAPPING",[zd]:"NEUTRAL_TONE_MAPPING",[kd]:"CUSTOM_TONE_MAPPING"};function yx(i,e,t,n,s,a){const r=new jn(e,t,{type:i,depthBuffer:s,stencilBuffer:a,samples:n?4:0,depthTexture:s?new ks(e,t):void 0}),o=new jn(e,t,{type:gi,depthBuffer:!1,stencilBuffer:!1}),c=new Ot;c.setAttribute("position",new ht([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ht([0,2,0,0,2,0],2));const l=new Bp({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new F(c,l),d=new qr(-1,1,1,-1,0,1);let u=null,f=null,g=!1,x,m=null,p=[],v=!1;this.setSize=function(w,M){r.setSize(w,M),o.setSize(w,M);for(let T=0;T<p.length;T++){const S=p[T];S.setSize&&S.setSize(w,M)}},this.setEffects=function(w){p=w,v=p.length>0&&p[0].isRenderPass===!0;const M=r.width,T=r.height;for(let S=0;S<p.length;S++){const A=p[S];A.setSize&&A.setSize(M,T)}},this.begin=function(w,M){if(g||w.toneMapping===Jn&&p.length===0)return!1;if(m=M,M!==null){const T=M.width,S=M.height;(r.width!==T||r.height!==S)&&this.setSize(T,S)}return v===!1&&w.setRenderTarget(r),x=w.toneMapping,w.toneMapping=Jn,!0},this.hasRenderPass=function(){return v},this.end=function(w,M){w.toneMapping=x,g=!0;let T=r,S=o;for(let A=0;A<p.length;A++){const _=p[A];if(_.enabled!==!1&&(_.render(w,S,T,M),_.needsSwap!==!1)){const b=T;T=S,S=b}}if(u!==w.outputColorSpace||f!==w.toneMapping){u=w.outputColorSpace,f=w.toneMapping,l.defines={},it.getTransfer(u)===pt&&(l.defines.SRGB_TRANSFER="");const A=vx[f];A&&(l.defines[A]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=T.texture,w.setRenderTarget(m),w.render(h,d),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),o.dispose(),c.dispose(),l.dispose()}}const _u=new Xt,Uc=new ks(1,1),Mu=new Jd,vu=new dp,yu=new cu,Wh=[],Xh=[],qh=new Float32Array(16),Yh=new Float32Array(9),$h=new Float32Array(4);function $s(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let a=Wh[s];if(a===void 0&&(a=new Float32Array(s),Wh[s]=a),e!==0){n.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,i[r].toArray(a,o)}return a}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $r(i,e){let t=Xh[e];t===void 0&&(t=new Int32Array(e),Xh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Sx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function bx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),Yt(t,e)}}function wx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),Yt(t,e)}}function Tx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),Yt(t,e)}}function Ex(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;$h.set(n),i.uniformMatrix2fv(this.addr,!1,$h),Yt(t,n)}}function Ax(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;Yh.set(n),i.uniformMatrix3fv(this.addr,!1,Yh),Yt(t,n)}}function Rx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;qh.set(n),i.uniformMatrix4fv(this.addr,!1,qh),Yt(t,n)}}function Cx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Px(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),Yt(t,e)}}function Ix(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),Yt(t,e)}}function Lx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),Yt(t,e)}}function Dx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Nx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),Yt(t,e)}}function Ux(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),Yt(t,e)}}function Fx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),Yt(t,e)}}function Ox(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(Uc.compareFunction=t.isReversedDepthBuffer()?cl:ol,a=Uc):a=_u,t.setTexture2D(e||a,s)}function kx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||vu,s)}function Bx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||yu,s)}function zx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Mu,s)}function Gx(i){switch(i){case 5126:return Sx;case 35664:return bx;case 35665:return wx;case 35666:return Tx;case 35674:return Ex;case 35675:return Ax;case 35676:return Rx;case 5124:case 35670:return Cx;case 35667:case 35671:return Px;case 35668:case 35672:return Ix;case 35669:case 35673:return Lx;case 5125:return Dx;case 36294:return Nx;case 36295:return Ux;case 36296:return Fx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return kx;case 35680:case 36300:case 36308:case 36293:return Bx;case 36289:case 36303:case 36311:case 36292:return zx}}function Hx(i,e){i.uniform1fv(this.addr,e)}function Vx(i,e){const t=$s(e,this.size,2);i.uniform2fv(this.addr,t)}function Wx(i,e){const t=$s(e,this.size,3);i.uniform3fv(this.addr,t)}function Xx(i,e){const t=$s(e,this.size,4);i.uniform4fv(this.addr,t)}function qx(i,e){const t=$s(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Yx(i,e){const t=$s(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function $x(i,e){const t=$s(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Kx(i,e){i.uniform1iv(this.addr,e)}function Zx(i,e){i.uniform2iv(this.addr,e)}function Jx(i,e){i.uniform3iv(this.addr,e)}function jx(i,e){i.uniform4iv(this.addr,e)}function Qx(i,e){i.uniform1uiv(this.addr,e)}function e_(i,e){i.uniform2uiv(this.addr,e)}function t_(i,e){i.uniform3uiv(this.addr,e)}function n_(i,e){i.uniform4uiv(this.addr,e)}function i_(i,e,t){const n=this.cache,s=e.length,a=$r(t,s);qt(n,a)||(i.uniform1iv(this.addr,a),Yt(n,a));let r;this.type===i.SAMPLER_2D_SHADOW?r=Uc:r=_u;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function s_(i,e,t){const n=this.cache,s=e.length,a=$r(t,s);qt(n,a)||(i.uniform1iv(this.addr,a),Yt(n,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||vu,a[r])}function a_(i,e,t){const n=this.cache,s=e.length,a=$r(t,s);qt(n,a)||(i.uniform1iv(this.addr,a),Yt(n,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||yu,a[r])}function r_(i,e,t){const n=this.cache,s=e.length,a=$r(t,s);qt(n,a)||(i.uniform1iv(this.addr,a),Yt(n,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Mu,a[r])}function o_(i){switch(i){case 5126:return Hx;case 35664:return Vx;case 35665:return Wx;case 35666:return Xx;case 35674:return qx;case 35675:return Yx;case 35676:return $x;case 5124:case 35670:return Kx;case 35667:case 35671:return Zx;case 35668:case 35672:return Jx;case 35669:case 35673:return jx;case 5125:return Qx;case 36294:return e_;case 36295:return t_;case 36296:return n_;case 35678:case 36198:case 36298:case 36306:case 35682:return i_;case 35679:case 36299:case 36307:return s_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return r_}}class c_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gx(t.type)}}class l_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=o_(t.type)}}class h_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],n)}}}const Do=/(\w+)(\])?(\[|\.)?/g;function Kh(i,e){i.seq.push(e),i.map[e.id]=e}function d_(i,e,t){const n=i.name,s=n.length;for(Do.lastIndex=0;;){const a=Do.exec(n),r=Do.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Kh(t,l===void 0?new c_(o,i,e):new l_(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new h_(o),Kh(t,d)),t=d}}}class Tr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const o=e.getActiveUniform(t,r),c=e.getUniformLocation(t,o.name);d_(o,c,this)}const s=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,n,s){const a=this.map[t];a!==void 0&&a.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&n.push(r)}return n}}function Zh(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const u_=37297;let f_=0;function p_(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return n.join(`
`)}const Jh=new Xe;function m_(i){it._getMatrix(Jh,it.workingColorSpace,i);const e=`mat3( ${Jh.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(i)){case Nr:return[e,"LinearTransferOETF"];case pt:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function jh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),a=(i.getShaderInfoLog(e)||"").trim();if(n&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+p_(i.getShaderSource(e),o)}else return a}function g_(i,e){const t=m_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const x_={[Ud]:"Linear",[Fd]:"Reinhard",[Od]:"Cineon",[Qc]:"ACESFilmic",[Bd]:"AgX",[zd]:"Neutral",[kd]:"Custom"};function __(i,e){const t=x_[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const hr=new L;function M_(){it.getLuminanceCoefficients(hr);const i=hr.x.toFixed(4),e=hr.y.toFixed(4),t=hr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function v_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ua).join(`
`)}function y_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function S_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(e,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:i.getAttribLocation(e,r),locationSize:o}}return t}function ua(i){return i!==""}function Qh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ed(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const b_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fc(i){return i.replace(b_,T_)}const w_=new Map;function T_(i,e){let t=je[e];if(t===void 0){const n=w_.get(e);if(n!==void 0)t=je[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Fc(t)}const E_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function td(i){return i.replace(E_,A_)}function A_(i,e,t,n){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function nd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const R_={[_r]:"SHADOWMAP_TYPE_PCF",[ha]:"SHADOWMAP_TYPE_VSM"};function C_(i){return R_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const P_={[es]:"ENVMAP_TYPE_CUBE",[Fs]:"ENVMAP_TYPE_CUBE",[Hr]:"ENVMAP_TYPE_CUBE_UV"};function I_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":P_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const L_={[Fs]:"ENVMAP_MODE_REFRACTION"};function D_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":L_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const N_={[jc]:"ENVMAP_BLENDING_MULTIPLY",[Tf]:"ENVMAP_BLENDING_MIX",[Ef]:"ENVMAP_BLENDING_ADD"};function U_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":N_[i.combine]||"ENVMAP_BLENDING_NONE"}function F_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function O_(i,e,t,n){const s=i.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=C_(t),l=I_(t),h=D_(t),d=U_(t),u=F_(t),f=v_(t),g=y_(a),x=s.createProgram();let m,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ua).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ua).join(`
`),p.length>0&&(p+=`
`)):(m=[nd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ua).join(`
`),p=[nd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Jn?"#define TONE_MAPPING":"",t.toneMapping!==Jn?je.tonemapping_pars_fragment:"",t.toneMapping!==Jn?__("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,g_("linearToOutputTexel",t.outputColorSpace),M_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ua).join(`
`)),r=Fc(r),r=Qh(r,t),r=ed(r,t),o=Fc(o),o=Qh(o,t),o=ed(o,t),r=td(r),o=td(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ql?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ql?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=v+m+r,M=v+p+o,T=Zh(s,s.VERTEX_SHADER,w),S=Zh(s,s.FRAGMENT_SHADER,M);s.attachShader(x,T),s.attachShader(x,S),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(P){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(x)||"",O=s.getShaderInfoLog(T)||"",K=s.getShaderInfoLog(S)||"",k=I.trim(),$=O.trim(),V=K.trim();let Q=!0,ae=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,T,S);else{const oe=jh(s,T,"vertex"),me=jh(s,S,"fragment");Ge("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+oe+`
`+me)}else k!==""?Ie("WebGLProgram: Program Info Log:",k):($===""||V==="")&&(ae=!1);ae&&(P.diagnostics={runnable:Q,programLog:k,vertexShader:{log:$,prefix:m},fragmentShader:{log:V,prefix:p}})}s.deleteShader(T),s.deleteShader(S),_=new Tr(s,x),b=S_(s,x)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(x,u_)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=f_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=S,this}let k_=0;class B_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new z_(e),t.set(e,n)),n}}class z_{constructor(e){this.id=k_++,this.code=e,this.usedTimes=0}}function G_(i){return i===ts||i===Ir||i===Lr}function H_(i,e,t,n,s,a){const r=new jd,o=new B_,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function x(_,b,C,P,I,O){const K=P.fog,k=I.geometry,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,V=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Q=e.get(_.envMap||$,V),ae=Q&&Q.mapping===Hr?Q.image.height:null,oe=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Ie("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const me=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ce=me!==void 0?me.length:0;let Ke=0;k.morphAttributes.position!==void 0&&(Ke=1),k.morphAttributes.normal!==void 0&&(Ke=2),k.morphAttributes.color!==void 0&&(Ke=3);let ut,Ve,ee,ue;if(oe){const Re=Yn[oe];ut=Re.vertexShader,Ve=Re.fragmentShader}else{ut=_.vertexShader,Ve=_.fragmentShader;const Re=o.getVertexShaderStage(_),Lt=o.getFragmentShaderStage(_);o.update(_,Re,Lt),ee=Re.id,ue=Lt.id}const re=i.getRenderTarget(),H=i.state.buffers.depth.getReversed(),j=I.isInstancedMesh===!0,de=I.isBatchedMesh===!0,Ae=!!_.map,Te=!!_.matcap,le=!!Q,We=!!_.aoMap,Qe=!!_.lightMap,Rt=!!_.bumpMap&&_.wireframe===!1,Pt=!!_.normalMap,kt=!!_.displacementMap,rt=!!_.emissiveMap,Et=!!_.metalnessMap,vt=!!_.roughnessMap,N=_.anisotropy>0,Gt=_.clearcoat>0,ft=_.dispersion>0,R=_.iridescence>0,y=_.sheen>0,z=_.transmission>0,q=N&&!!_.anisotropyMap,Z=Gt&&!!_.clearcoatMap,he=Gt&&!!_.clearcoatNormalMap,pe=Gt&&!!_.clearcoatRoughnessMap,J=R&&!!_.iridescenceMap,ne=R&&!!_.iridescenceThicknessMap,ge=y&&!!_.sheenColorMap,De=y&&!!_.sheenRoughnessMap,Me=!!_.specularMap,xe=!!_.specularColorMap,Fe=!!_.specularIntensityMap,Be=z&&!!_.transmissionMap,qe=z&&!!_.thicknessMap,D=!!_.gradientMap,fe=!!_.alphaMap,te=_.alphaTest>0,_e=!!_.alphaHash,be=!!_.extensions;let ie=Jn;_.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ie=i.toneMapping);const Pe={shaderID:oe,shaderType:_.type,shaderName:_.name,vertexShader:ut,fragmentShader:Ve,defines:_.defines,customVertexShaderID:ee,customFragmentShaderID:ue,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:de,batchingColor:de&&I._colorsTexture!==null,instancing:j,instancingColor:j&&I.instanceColor!==null,instancingMorph:j&&I.morphTexture!==null,outputColorSpace:re===null?i.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:it.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ae,matcap:Te,envMap:le,envMapMode:le&&Q.mapping,envMapCubeUVHeight:ae,aoMap:We,lightMap:Qe,bumpMap:Rt,normalMap:Pt,displacementMap:kt,emissiveMap:rt,normalMapObjectSpace:Pt&&_.normalMapType===If,normalMapTangentSpace:Pt&&_.normalMapType===Dr,packedNormalMap:Pt&&_.normalMapType===Dr&&G_(_.normalMap.format),metalnessMap:Et,roughnessMap:vt,anisotropy:N,anisotropyMap:q,clearcoat:Gt,clearcoatMap:Z,clearcoatNormalMap:he,clearcoatRoughnessMap:pe,dispersion:ft,iridescence:R,iridescenceMap:J,iridescenceThicknessMap:ne,sheen:y,sheenColorMap:ge,sheenRoughnessMap:De,specularMap:Me,specularColorMap:xe,specularIntensityMap:Fe,transmission:z,transmissionMap:Be,thicknessMap:qe,gradientMap:D,opaque:_.transparent===!1&&_.blending===Ps&&_.alphaToCoverage===!1,alphaMap:fe,alphaTest:te,alphaHash:_e,combine:_.combine,mapUv:Ae&&g(_.map.channel),aoMapUv:We&&g(_.aoMap.channel),lightMapUv:Qe&&g(_.lightMap.channel),bumpMapUv:Rt&&g(_.bumpMap.channel),normalMapUv:Pt&&g(_.normalMap.channel),displacementMapUv:kt&&g(_.displacementMap.channel),emissiveMapUv:rt&&g(_.emissiveMap.channel),metalnessMapUv:Et&&g(_.metalnessMap.channel),roughnessMapUv:vt&&g(_.roughnessMap.channel),anisotropyMapUv:q&&g(_.anisotropyMap.channel),clearcoatMapUv:Z&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:De&&g(_.sheenRoughnessMap.channel),specularMapUv:Me&&g(_.specularMap.channel),specularColorMapUv:xe&&g(_.specularColorMap.channel),specularIntensityMapUv:Fe&&g(_.specularIntensityMap.channel),transmissionMapUv:Be&&g(_.transmissionMap.channel),thicknessMapUv:qe&&g(_.thicknessMap.channel),alphaMapUv:fe&&g(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Pt||N),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!k.attributes.uv&&(Ae||fe),fog:!!K,useFog:_.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&Pt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:H,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:Ke,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:O.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ie,decodeVideoTexture:Ae&&_.map.isVideoTexture===!0&&it.getTransfer(_.map.colorSpace)===pt,decodeVideoTextureEmissive:rt&&_.emissiveMap.isVideoTexture===!0&&it.getTransfer(_.emissiveMap.colorSpace)===pt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===nn,flipSided:_.side===sn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:be&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&_.extensions.multiDraw===!0||de)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function m(_){const b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(const C in _.defines)b.push(C),b.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(p(b,_),v(b,_),b.push(i.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function p(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function v(_,b){r.disableAll(),b.instancing&&r.enable(0),b.instancingColor&&r.enable(1),b.instancingMorph&&r.enable(2),b.matcap&&r.enable(3),b.envMap&&r.enable(4),b.normalMapObjectSpace&&r.enable(5),b.normalMapTangentSpace&&r.enable(6),b.clearcoat&&r.enable(7),b.iridescence&&r.enable(8),b.alphaTest&&r.enable(9),b.vertexColors&&r.enable(10),b.vertexAlphas&&r.enable(11),b.vertexUv1s&&r.enable(12),b.vertexUv2s&&r.enable(13),b.vertexUv3s&&r.enable(14),b.vertexTangents&&r.enable(15),b.anisotropy&&r.enable(16),b.alphaHash&&r.enable(17),b.batching&&r.enable(18),b.dispersion&&r.enable(19),b.batchingColor&&r.enable(20),b.gradientMap&&r.enable(21),b.packedNormalMap&&r.enable(22),b.vertexNormals&&r.enable(23),_.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reversedDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),b.numLightProbeGrids>0&&r.enable(22),b.hasPositionAttribute&&r.enable(23),_.push(r.mask)}function w(_){const b=f[_.type];let C;if(b){const P=Yn[b];C=Fp.clone(P.uniforms)}else C=_.uniforms;return C}function M(_,b){let C=h.get(b);return C!==void 0?++C.usedTimes:(C=new O_(i,b,_,s),l.push(C),h.set(b,C)),C}function T(_){if(--_.usedTimes===0){const b=l.indexOf(_);l[b]=l[l.length-1],l.pop(),h.delete(_.cacheKey),_.destroy()}}function S(_){o.remove(_)}function A(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:w,acquireProgram:M,releaseProgram:T,releaseShaderCache:S,programs:l,dispose:A}}function V_(){let i=new WeakMap;function e(r){return i.has(r)}function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:a}}function W_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function id(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function sd(){const i=[];let e=0;const t=[],n=[],s=[];function a(){e=0,t.length=0,n.length=0,s.length=0}function r(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,x,m,p){let v=i[e];return v===void 0?(v={id:u.id,object:u,geometry:f,material:g,materialVariant:r(u),groupOrder:x,renderOrder:u.renderOrder,z:m,group:p},i[e]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=g,v.materialVariant=r(u),v.groupOrder=x,v.renderOrder=u.renderOrder,v.z=m,v.group=p),e++,v}function c(u,f,g,x,m,p){const v=o(u,f,g,x,m,p);g.transmission>0?n.push(v):g.transparent===!0?s.push(v):t.push(v)}function l(u,f,g,x,m,p){const v=o(u,f,g,x,m,p);g.transmission>0?n.unshift(v):g.transparent===!0?s.unshift(v):t.unshift(v)}function h(u,f,g){t.length>1&&t.sort(u||W_),n.length>1&&n.sort(f||id),s.length>1&&s.sort(f||id),g&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let u=e,f=i.length;u<f;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:a,push:c,unshift:l,finish:d,sort:h}}function X_(){let i=new WeakMap;function e(n,s){const a=i.get(n);let r;return a===void 0?(r=new sd,i.set(n,[r])):s>=a.length?(r=new sd,a.push(r)):r=a[s],r}function t(){i=new WeakMap}return{get:e,dispose:t}}function q_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Le};break;case"SpotLight":t={position:new L,direction:new L,color:new Le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Le,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Le,groundColor:new Le};break;case"RectAreaLight":t={color:new Le,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function Y_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let $_=0;function K_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Z_(i){const e=new q_,t=Y_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const s=new L,a=new $e,r=new $e;function o(l){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,v=0,w=0,M=0,T=0,S=0,A=0;l.sort(K_);for(let b=0,C=l.length;b<C;b++){const P=l[b],I=P.color,O=P.intensity,K=P.distance;let k=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===ts?k=P.shadow.map.texture:k=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=I.r*O,d+=I.g*O,u+=I.b*O;else if(P.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(P.sh.coefficients[$],O);A++}else if(P.isDirectionalLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,Q=t.get(P);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,n.directionalShadow[f]=Q,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=P.shadow.matrix,v++}n.directional[f]=$,f++}else if(P.isSpotLight){const $=e.get(P);$.position.setFromMatrixPosition(P.matrixWorld),$.color.copy(I).multiplyScalar(O),$.distance=K,$.coneCos=Math.cos(P.angle),$.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),$.decay=P.decay,n.spot[x]=$;const V=P.shadow;if(P.map&&(n.spotLightMap[T]=P.map,T++,V.updateMatrices(P),P.castShadow&&S++),n.spotLightMatrix[x]=V.matrix,P.castShadow){const Q=t.get(P);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,n.spotShadow[x]=Q,n.spotShadowMap[x]=k,M++}x++}else if(P.isRectAreaLight){const $=e.get(P);$.color.copy(I).multiplyScalar(O),$.halfWidth.set(P.width*.5,0,0),$.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=$,m++}else if(P.isPointLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),$.distance=P.distance,$.decay=P.decay,P.castShadow){const V=P.shadow,Q=t.get(P);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,Q.shadowCameraNear=V.camera.near,Q.shadowCameraFar=V.camera.far,n.pointShadow[g]=Q,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=P.shadow.matrix,w++}n.point[g]=$,g++}else if(P.isHemisphereLight){const $=e.get(P);$.skyColor.copy(P.color).multiplyScalar(O),$.groundColor.copy(P.groundColor).multiplyScalar(O),n.hemi[p]=$,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const _=n.hash;(_.directionalLength!==f||_.pointLength!==g||_.spotLength!==x||_.rectAreaLength!==m||_.hemiLength!==p||_.numDirectionalShadows!==v||_.numPointShadows!==w||_.numSpotShadows!==M||_.numSpotMaps!==T||_.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+T-S,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=A,_.directionalLength=f,_.pointLength=g,_.spotLength=x,_.rectAreaLength=m,_.hemiLength=p,_.numDirectionalShadows=v,_.numPointShadows=w,_.numSpotShadows=M,_.numSpotMaps=T,_.numLightProbes=A,n.version=$_++)}function c(l,h){let d=0,u=0,f=0,g=0,x=0;const m=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const w=l[p];if(w.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(w.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),r.identity(),a.copy(w.matrixWorld),a.premultiply(m),r.extractRotation(a),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(r),M.halfHeight.applyMatrix4(r),g++}else if(w.isPointLight){const M=n.point[u];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),u++}else if(w.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),x++}}}return{setup:o,setupView:c,state:n}}function ad(i){const e=new Z_(i),t=[],n=[],s=[];function a(u){d.camera=u,t.length=0,n.length=0,s.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function c(u){s.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:c}}function J_(i){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new ad(i),e.set(s,[o])):a>=r.length?(o=new ad(i),r.push(o)):o=r[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const j_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Q_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,eM=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],tM=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],rd=new $e,oa=new L,No=new L;function nM(i,e,t){let n=new pl;const s=new He,a=new He,r=new Mt,o=new Gp,c=new Hp,l={},h=t.maxTextureSize,d={[mi]:sn,[sn]:mi,[nn]:nn},u=new On({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:j_,fragmentShader:Q_}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ot;g.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new F(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_r;let p=this.type;this.render=function(S,A,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;this.type===Nd&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=_r);const b=i.getRenderTarget(),C=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),I=i.state;I.setBlending(fi),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const O=p!==this.type;O&&A.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(k=>k.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,k=S.length;K<k;K++){const $=S[K],V=$.shadow;if(V===void 0){Ie("WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const Q=V.getFrameExtents();s.multiply(Q),a.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/Q.x),s.x=a.x*Q.x,V.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/Q.y),s.y=a.y*Q.y,V.mapSize.y=a.y));const ae=i.state.buffers.depth.getReversed();if(V.camera._reversedDepth=ae,V.map===null||O===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===ha){if($.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new jn(s.x,s.y,{format:ts,type:gi,minFilter:Wt,magFilter:Wt,generateMipmaps:!1}),V.map.texture.name=$.name+".shadowMap",V.map.depthTexture=new ks(s.x,s.y,Tn),V.map.depthTexture.name=$.name+".shadowMapDepth",V.map.depthTexture.format=xi,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Vt,V.map.depthTexture.magFilter=Vt}else $.isPointLight?(V.map=new xu(s.x),V.map.depthTexture=new Np(s.x,Qn)):(V.map=new jn(s.x,s.y),V.map.depthTexture=new ks(s.x,s.y,Qn)),V.map.depthTexture.name=$.name+".shadowMap",V.map.depthTexture.format=xi,this.type===_r?(V.map.depthTexture.compareFunction=ae?cl:ol,V.map.depthTexture.minFilter=Wt,V.map.depthTexture.magFilter=Wt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Vt,V.map.depthTexture.magFilter=Vt);V.camera.updateProjectionMatrix()}const oe=V.map.isWebGLCubeRenderTarget?6:1;for(let me=0;me<oe;me++){if(V.map.isWebGLCubeRenderTarget)i.setRenderTarget(V.map,me),i.clear();else{me===0&&(i.setRenderTarget(V.map),i.clear());const ce=V.getViewport(me);r.set(a.x*ce.x,a.y*ce.y,a.x*ce.z,a.y*ce.w),I.viewport(r)}if($.isPointLight){const ce=V.camera,Ke=V.matrix,ut=$.distance||ce.far;ut!==ce.far&&(ce.far=ut,ce.updateProjectionMatrix()),oa.setFromMatrixPosition($.matrixWorld),ce.position.copy(oa),No.copy(ce.position),No.add(eM[me]),ce.up.copy(tM[me]),ce.lookAt(No),ce.updateMatrixWorld(),Ke.makeTranslation(-oa.x,-oa.y,-oa.z),rd.multiplyMatrices(ce.projectionMatrix,ce.matrixWorldInverse),V._frustum.setFromProjectionMatrix(rd,ce.coordinateSystem,ce.reversedDepth)}else V.updateMatrices($);n=V.getFrustum(),M(A,_,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===ha&&v(V,_),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,C,P)};function v(S,A){const _=e.update(x);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new jn(s.x,s.y,{format:ts,type:gi})),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(A,null,_,u,x,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(A,null,_,f,x,null)}function w(S,A,_,b){let C=null;const P=_.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)C=P;else if(C=_.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const I=C.uuid,O=A.uuid;let K=l[I];K===void 0&&(K={},l[I]=K);let k=K[O];k===void 0&&(k=C.clone(),K[O]=k,A.addEventListener("dispose",T)),C=k}if(C.visible=A.visible,C.wireframe=A.wireframe,b===ha?C.side=A.shadowSide!==null?A.shadowSide:A.side:C.side=A.shadowSide!==null?A.shadowSide:d[A.side],C.alphaMap=A.alphaMap,C.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,C.map=A.map,C.clipShadows=A.clipShadows,C.clippingPlanes=A.clippingPlanes,C.clipIntersection=A.clipIntersection,C.displacementMap=A.displacementMap,C.displacementScale=A.displacementScale,C.displacementBias=A.displacementBias,C.wireframeLinewidth=A.wireframeLinewidth,C.linewidth=A.linewidth,_.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const I=i.properties.get(C);I.light=_}return C}function M(S,A,_,b,C){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&C===ha)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,S.matrixWorld);const O=e.update(S),K=S.material;if(Array.isArray(K)){const k=O.groups;for(let $=0,V=k.length;$<V;$++){const Q=k[$],ae=K[Q.materialIndex];if(ae&&ae.visible){const oe=w(S,ae,b,C);S.onBeforeShadow(i,S,A,_,O,oe,Q),i.renderBufferDirect(_,null,O,oe,S,Q),S.onAfterShadow(i,S,A,_,O,oe,Q)}}}else if(K.visible){const k=w(S,K,b,C);S.onBeforeShadow(i,S,A,_,O,k,null),i.renderBufferDirect(_,null,O,k,S,null),S.onAfterShadow(i,S,A,_,O,k,null)}}const I=S.children;for(let O=0,K=I.length;O<K;O++)M(I[O],A,_,b,C)}function T(S){S.target.removeEventListener("dispose",T);for(const _ in l){const b=l[_],C=S.target.uuid;C in b&&(b[C].dispose(),delete b[C])}}}function iM(i,e){function t(){let D=!1;const fe=new Mt;let te=null;const _e=new Mt(0,0,0,0);return{setMask:function(be){te!==be&&!D&&(i.colorMask(be,be,be,be),te=be)},setLocked:function(be){D=be},setClear:function(be,ie,Pe,Re,Lt){Lt===!0&&(be*=Re,ie*=Re,Pe*=Re),fe.set(be,ie,Pe,Re),_e.equals(fe)===!1&&(i.clearColor(be,ie,Pe,Re),_e.copy(fe))},reset:function(){D=!1,te=null,_e.set(-1,0,0,0)}}}function n(){let D=!1,fe=!1,te=null,_e=null,be=null;return{setReversed:function(ie){if(fe!==ie){const Pe=e.get("EXT_clip_control");ie?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),fe=ie;const Re=be;be=null,this.setClear(Re)}},getReversed:function(){return fe},setTest:function(ie){ie?re(i.DEPTH_TEST):H(i.DEPTH_TEST)},setMask:function(ie){te!==ie&&!D&&(i.depthMask(ie),te=ie)},setFunc:function(ie){if(fe&&(ie=Hf[ie]),_e!==ie){switch(ie){case Yo:i.depthFunc(i.NEVER);break;case $o:i.depthFunc(i.ALWAYS);break;case Ko:i.depthFunc(i.LESS);break;case Us:i.depthFunc(i.LEQUAL);break;case Zo:i.depthFunc(i.EQUAL);break;case Jo:i.depthFunc(i.GEQUAL);break;case jo:i.depthFunc(i.GREATER);break;case Qo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}_e=ie}},setLocked:function(ie){D=ie},setClear:function(ie){be!==ie&&(be=ie,fe&&(ie=1-ie),i.clearDepth(ie))},reset:function(){D=!1,te=null,_e=null,be=null,fe=!1}}}function s(){let D=!1,fe=null,te=null,_e=null,be=null,ie=null,Pe=null,Re=null,Lt=null;return{setTest:function(bt){D||(bt?re(i.STENCIL_TEST):H(i.STENCIL_TEST))},setMask:function(bt){fe!==bt&&!D&&(i.stencilMask(bt),fe=bt)},setFunc:function(bt,Bn,zn){(te!==bt||_e!==Bn||be!==zn)&&(i.stencilFunc(bt,Bn,zn),te=bt,_e=Bn,be=zn)},setOp:function(bt,Bn,zn){(ie!==bt||Pe!==Bn||Re!==zn)&&(i.stencilOp(bt,Bn,zn),ie=bt,Pe=Bn,Re=zn)},setLocked:function(bt){D=bt},setClear:function(bt){Lt!==bt&&(i.clearStencil(bt),Lt=bt)},reset:function(){D=!1,fe=null,te=null,_e=null,be=null,ie=null,Pe=null,Re=null,Lt=null}}}const a=new t,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],x=null,m=!1,p=null,v=null,w=null,M=null,T=null,S=null,A=null,_=new Le(0,0,0),b=0,C=!1,P=null,I=null,O=null,K=null,k=null;const $=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,Q=0;const ae=i.getParameter(i.VERSION);ae.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ae)[1]),V=Q>=1):ae.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ae)[1]),V=Q>=2);let oe=null,me={};const ce=i.getParameter(i.SCISSOR_BOX),Ke=i.getParameter(i.VIEWPORT),ut=new Mt().fromArray(ce),Ve=new Mt().fromArray(Ke);function ee(D,fe,te,_e){const be=new Uint8Array(4),ie=i.createTexture();i.bindTexture(D,ie),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<te;Pe++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,_e,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(fe+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return ie}const ue={};ue[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),ue[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ue[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),re(i.DEPTH_TEST),r.setFunc(Us),Rt(!1),Pt(Vl),re(i.CULL_FACE),We(fi);function re(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function H(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function j(D,fe){return u[D]!==fe?(i.bindFramebuffer(D,fe),u[D]=fe,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function de(D,fe){let te=g,_e=!1;if(D){te=f.get(fe),te===void 0&&(te=[],f.set(fe,te));const be=D.textures;if(te.length!==be.length||te[0]!==i.COLOR_ATTACHMENT0){for(let ie=0,Pe=be.length;ie<Pe;ie++)te[ie]=i.COLOR_ATTACHMENT0+ie;te.length=be.length,_e=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,_e=!0);_e&&i.drawBuffers(te)}function Ae(D){return x!==D?(i.useProgram(D),x=D,!0):!1}const Te={[Ki]:i.FUNC_ADD,[cf]:i.FUNC_SUBTRACT,[lf]:i.FUNC_REVERSE_SUBTRACT};Te[hf]=i.MIN,Te[df]=i.MAX;const le={[uf]:i.ZERO,[ff]:i.ONE,[pf]:i.SRC_COLOR,[Xo]:i.SRC_ALPHA,[vf]:i.SRC_ALPHA_SATURATE,[_f]:i.DST_COLOR,[gf]:i.DST_ALPHA,[mf]:i.ONE_MINUS_SRC_COLOR,[qo]:i.ONE_MINUS_SRC_ALPHA,[Mf]:i.ONE_MINUS_DST_COLOR,[xf]:i.ONE_MINUS_DST_ALPHA,[yf]:i.CONSTANT_COLOR,[Sf]:i.ONE_MINUS_CONSTANT_COLOR,[bf]:i.CONSTANT_ALPHA,[wf]:i.ONE_MINUS_CONSTANT_ALPHA};function We(D,fe,te,_e,be,ie,Pe,Re,Lt,bt){if(D===fi){m===!0&&(H(i.BLEND),m=!1);return}if(m===!1&&(re(i.BLEND),m=!0),D!==of){if(D!==p||bt!==C){if((v!==Ki||T!==Ki)&&(i.blendEquation(i.FUNC_ADD),v=Ki,T=Ki),bt)switch(D){case Ps:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wl:i.blendFunc(i.ONE,i.ONE);break;case Xl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ql:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ge("WebGLState: Invalid blending: ",D);break}else switch(D){case Ps:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Xl:Ge("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ql:Ge("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ge("WebGLState: Invalid blending: ",D);break}w=null,M=null,S=null,A=null,_.set(0,0,0),b=0,p=D,C=bt}return}be=be||fe,ie=ie||te,Pe=Pe||_e,(fe!==v||be!==T)&&(i.blendEquationSeparate(Te[fe],Te[be]),v=fe,T=be),(te!==w||_e!==M||ie!==S||Pe!==A)&&(i.blendFuncSeparate(le[te],le[_e],le[ie],le[Pe]),w=te,M=_e,S=ie,A=Pe),(Re.equals(_)===!1||Lt!==b)&&(i.blendColor(Re.r,Re.g,Re.b,Lt),_.copy(Re),b=Lt),p=D,C=!1}function Qe(D,fe){D.side===nn?H(i.CULL_FACE):re(i.CULL_FACE);let te=D.side===sn;fe&&(te=!te),Rt(te),D.blending===Ps&&D.transparent===!1?We(fi):We(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const _e=D.stencilWrite;o.setTest(_e),_e&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),rt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?re(i.SAMPLE_ALPHA_TO_COVERAGE):H(i.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(D){P!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),P=D)}function Pt(D){D!==af?(re(i.CULL_FACE),D!==I&&(D===Vl?i.cullFace(i.BACK):D===rf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):H(i.CULL_FACE),I=D}function kt(D){D!==O&&(V&&i.lineWidth(D),O=D)}function rt(D,fe,te){D?(re(i.POLYGON_OFFSET_FILL),(K!==fe||k!==te)&&(K=fe,k=te,r.getReversed()&&(fe=-fe),i.polygonOffset(fe,te))):H(i.POLYGON_OFFSET_FILL)}function Et(D){D?re(i.SCISSOR_TEST):H(i.SCISSOR_TEST)}function vt(D){D===void 0&&(D=i.TEXTURE0+$-1),oe!==D&&(i.activeTexture(D),oe=D)}function N(D,fe,te){te===void 0&&(oe===null?te=i.TEXTURE0+$-1:te=oe);let _e=me[te];_e===void 0&&(_e={type:void 0,texture:void 0},me[te]=_e),(_e.type!==D||_e.texture!==fe)&&(oe!==te&&(i.activeTexture(te),oe=te),i.bindTexture(D,fe||ue[D]),_e.type=D,_e.texture=fe)}function Gt(){const D=me[oe];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ft(){try{i.compressedTexImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function y(){try{i.texSubImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function z(){try{i.texSubImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function q(){try{i.compressedTexSubImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function Z(){try{i.compressedTexSubImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function he(){try{i.texStorage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function pe(){try{i.texStorage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function J(){try{i.texImage2D(...arguments)}catch(D){Ge("WebGLState:",D)}}function ne(){try{i.texImage3D(...arguments)}catch(D){Ge("WebGLState:",D)}}function ge(D){return d[D]!==void 0?d[D]:i.getParameter(D)}function De(D,fe){d[D]!==fe&&(i.pixelStorei(D,fe),d[D]=fe)}function Me(D){ut.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ut.copy(D))}function xe(D){Ve.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Ve.copy(D))}function Fe(D,fe){let te=l.get(fe);te===void 0&&(te=new WeakMap,l.set(fe,te));let _e=te.get(D);_e===void 0&&(_e=i.getUniformBlockIndex(fe,D.name),te.set(D,_e))}function Be(D,fe){const _e=l.get(fe).get(D);c.get(fe)!==_e&&(i.uniformBlockBinding(fe,_e,D.__bindingPointIndex),c.set(fe,_e))}function qe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},oe=null,me={},u={},f=new WeakMap,g=[],x=null,m=!1,p=null,v=null,w=null,M=null,T=null,S=null,A=null,_=new Le(0,0,0),b=0,C=!1,P=null,I=null,O=null,K=null,k=null,ut.set(0,0,i.canvas.width,i.canvas.height),Ve.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:re,disable:H,bindFramebuffer:j,drawBuffers:de,useProgram:Ae,setBlending:We,setMaterial:Qe,setFlipSided:Rt,setCullFace:Pt,setLineWidth:kt,setPolygonOffset:rt,setScissorTest:Et,activeTexture:vt,bindTexture:N,unbindTexture:Gt,compressedTexImage2D:ft,compressedTexImage3D:R,texImage2D:J,texImage3D:ne,pixelStorei:De,getParameter:ge,updateUBOMapping:Fe,uniformBlockBinding:Be,texStorage2D:he,texStorage3D:pe,texSubImage2D:y,texSubImage3D:z,compressedTexSubImage2D:q,compressedTexSubImage3D:Z,scissor:Me,viewport:xe,reset:qe}}function sM(i,e,t,n,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new He,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,y){return g?new OffscreenCanvas(R,y):wa("canvas")}function m(R,y,z){let q=1;const Z=ft(R);if((Z.width>z||Z.height>z)&&(q=z/Math.max(Z.width,Z.height)),q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const he=Math.floor(q*Z.width),pe=Math.floor(q*Z.height);u===void 0&&(u=x(he,pe));const J=y?x(he,pe):u;return J.width=he,J.height=pe,J.getContext("2d").drawImage(R,0,0,he,pe),Ie("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+he+"x"+pe+")."),J}else return"data"in R&&Ie("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function p(R){return R.generateMipmaps}function v(R){i.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,y,z,q,Z,he=!1){if(R!==null){if(i[R]!==void 0)return i[R];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let pe;q&&(pe=e.get("EXT_texture_norm16"),pe||Ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=y;if(y===i.RED&&(z===i.FLOAT&&(J=i.R32F),z===i.HALF_FLOAT&&(J=i.R16F),z===i.UNSIGNED_BYTE&&(J=i.R8),z===i.UNSIGNED_SHORT&&pe&&(J=pe.R16_EXT),z===i.SHORT&&pe&&(J=pe.R16_SNORM_EXT)),y===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.R8UI),z===i.UNSIGNED_SHORT&&(J=i.R16UI),z===i.UNSIGNED_INT&&(J=i.R32UI),z===i.BYTE&&(J=i.R8I),z===i.SHORT&&(J=i.R16I),z===i.INT&&(J=i.R32I)),y===i.RG&&(z===i.FLOAT&&(J=i.RG32F),z===i.HALF_FLOAT&&(J=i.RG16F),z===i.UNSIGNED_BYTE&&(J=i.RG8),z===i.UNSIGNED_SHORT&&pe&&(J=pe.RG16_EXT),z===i.SHORT&&pe&&(J=pe.RG16_SNORM_EXT)),y===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.RG8UI),z===i.UNSIGNED_SHORT&&(J=i.RG16UI),z===i.UNSIGNED_INT&&(J=i.RG32UI),z===i.BYTE&&(J=i.RG8I),z===i.SHORT&&(J=i.RG16I),z===i.INT&&(J=i.RG32I)),y===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.RGB8UI),z===i.UNSIGNED_SHORT&&(J=i.RGB16UI),z===i.UNSIGNED_INT&&(J=i.RGB32UI),z===i.BYTE&&(J=i.RGB8I),z===i.SHORT&&(J=i.RGB16I),z===i.INT&&(J=i.RGB32I)),y===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),z===i.UNSIGNED_INT&&(J=i.RGBA32UI),z===i.BYTE&&(J=i.RGBA8I),z===i.SHORT&&(J=i.RGBA16I),z===i.INT&&(J=i.RGBA32I)),y===i.RGB&&(z===i.UNSIGNED_SHORT&&pe&&(J=pe.RGB16_EXT),z===i.SHORT&&pe&&(J=pe.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),y===i.RGBA){const ne=he?Nr:it.getTransfer(Z);z===i.FLOAT&&(J=i.RGBA32F),z===i.HALF_FLOAT&&(J=i.RGBA16F),z===i.UNSIGNED_BYTE&&(J=ne===pt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&pe&&(J=pe.RGBA16_EXT),z===i.SHORT&&pe&&(J=pe.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function T(R,y){let z;return R?y===null||y===Qn||y===va?z=i.DEPTH24_STENCIL8:y===Tn?z=i.DEPTH32F_STENCIL8:y===Ma&&(z=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Qn||y===va?z=i.DEPTH_COMPONENT24:y===Tn?z=i.DEPTH_COMPONENT32F:y===Ma&&(z=i.DEPTH_COMPONENT16),z}function S(R,y){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Vt&&R.minFilter!==Wt?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function A(R){const y=R.target;y.removeEventListener("dispose",A),b(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&d.delete(y)}function _(R){const y=R.target;y.removeEventListener("dispose",_),P(y)}function b(R){const y=n.get(R);if(y.__webglInit===void 0)return;const z=R.source,q=f.get(z);if(q){const Z=q[y.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&C(R),Object.keys(q).length===0&&f.delete(z)}n.remove(R)}function C(R){const y=n.get(R);i.deleteTexture(y.__webglTexture);const z=R.source,q=f.get(z);delete q[y.__cacheKey],r.memory.textures--}function P(R){const y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(y.__webglFramebuffer[q]))for(let Z=0;Z<y.__webglFramebuffer[q].length;Z++)i.deleteFramebuffer(y.__webglFramebuffer[q][Z]);else i.deleteFramebuffer(y.__webglFramebuffer[q]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[q])}else{if(Array.isArray(y.__webglFramebuffer))for(let q=0;q<y.__webglFramebuffer.length;q++)i.deleteFramebuffer(y.__webglFramebuffer[q]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let q=0;q<y.__webglColorRenderbuffer.length;q++)y.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[q]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const z=R.textures;for(let q=0,Z=z.length;q<Z;q++){const he=n.get(z[q]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),r.memory.textures--),n.remove(z[q])}n.remove(R)}let I=0;function O(){I=0}function K(){return I}function k(R){I=R}function $(){const R=I;return R>=s.maxTextures&&Ie("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function V(R){const y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function Q(R,y){const z=n.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){const q=R.image;if(q===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{H(z,R,y);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+y)}function ae(R,y){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){H(z,R,y);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+y)}function oe(R,y){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){H(z,R,y);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+y)}function me(R,y){const z=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){j(z,R,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+y)}const ce={[Oi]:i.REPEAT,[Kn]:i.CLAMP_TO_EDGE,[Pr]:i.MIRRORED_REPEAT},Ke={[Vt]:i.NEAREST,[Hd]:i.NEAREST_MIPMAP_NEAREST,[da]:i.NEAREST_MIPMAP_LINEAR,[Wt]:i.LINEAR,[Mr]:i.LINEAR_MIPMAP_NEAREST,[hi]:i.LINEAR_MIPMAP_LINEAR},ut={[Lf]:i.NEVER,[Of]:i.ALWAYS,[Df]:i.LESS,[ol]:i.LEQUAL,[Nf]:i.EQUAL,[cl]:i.GEQUAL,[Uf]:i.GREATER,[Ff]:i.NOTEQUAL};function Ve(R,y){if(y.type===Tn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Wt||y.magFilter===Mr||y.magFilter===da||y.magFilter===hi||y.minFilter===Wt||y.minFilter===Mr||y.minFilter===da||y.minFilter===hi)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ce[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ce[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ce[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Ke[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Ke[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ut[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Vt||y.minFilter!==da&&y.minFilter!==hi||y.type===Tn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function ee(R,y){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",A));const q=y.source;let Z=f.get(q);Z===void 0&&(Z={},f.set(q,Z));const he=V(y);if(he!==R.__cacheKey){Z[he]===void 0&&(Z[he]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,z=!0),Z[he].usedTimes++;const pe=Z[R.__cacheKey];pe!==void 0&&(Z[R.__cacheKey].usedTimes--,pe.usedTimes===0&&C(y)),R.__cacheKey=he,R.__webglTexture=Z[he].texture}return z}function ue(R,y,z){return Math.floor(Math.floor(R/z)/y)}function re(R,y,z,q){const he=R.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,z,q,y.data);else{he.sort((De,Me)=>De.start-Me.start);let pe=0;for(let De=1;De<he.length;De++){const Me=he[pe],xe=he[De],Fe=Me.start+Me.count,Be=ue(xe.start,y.width,4),qe=ue(Me.start,y.width,4);xe.start<=Fe+1&&Be===qe&&ue(xe.start+xe.count-1,y.width,4)===Be?Me.count=Math.max(Me.count,xe.start+xe.count-Me.start):(++pe,he[pe]=xe)}he.length=pe+1;const J=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),ge=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let De=0,Me=he.length;De<Me;De++){const xe=he[De],Fe=Math.floor(xe.start/4),Be=Math.ceil(xe.count/4),qe=Fe%y.width,D=Math.floor(Fe/y.width),fe=Be,te=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,qe),t.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,qe,D,fe,te,z,q,y.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,J),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,ge)}}function H(R,y,z){let q=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(q=i.TEXTURE_3D);const Z=ee(R,y),he=y.source;t.bindTexture(q,R.__webglTexture,i.TEXTURE0+z);const pe=n.get(he);if(he.version!==pe.__version||Z===!0){if(t.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const te=it.getPrimaries(it.workingColorSpace),_e=y.colorSpace===Di?null:it.getPrimaries(y.colorSpace),be=y.colorSpace===Di||te===_e?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment);let ne=m(y.image,!1,s.maxTextureSize);ne=Gt(y,ne);const ge=a.convert(y.format,y.colorSpace),De=a.convert(y.type);let Me=M(y.internalFormat,ge,De,y.normalized,y.colorSpace,y.isVideoTexture);Ve(q,y);let xe;const Fe=y.mipmaps,Be=y.isVideoTexture!==!0,qe=pe.__version===void 0||Z===!0,D=he.dataReady,fe=S(y,ne);if(y.isDepthTexture)Me=T(y.format===ji,y.type),qe&&(Be?t.texStorage2D(i.TEXTURE_2D,1,Me,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Me,ne.width,ne.height,0,ge,De,null));else if(y.isDataTexture)if(Fe.length>0){Be&&qe&&t.texStorage2D(i.TEXTURE_2D,fe,Me,Fe[0].width,Fe[0].height);for(let te=0,_e=Fe.length;te<_e;te++)xe=Fe[te],Be?D&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,xe.width,xe.height,ge,De,xe.data):t.texImage2D(i.TEXTURE_2D,te,Me,xe.width,xe.height,0,ge,De,xe.data);y.generateMipmaps=!1}else Be?(qe&&t.texStorage2D(i.TEXTURE_2D,fe,Me,ne.width,ne.height),D&&re(y,ne,ge,De)):t.texImage2D(i.TEXTURE_2D,0,Me,ne.width,ne.height,0,ge,De,ne.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Be&&qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Me,Fe[0].width,Fe[0].height,ne.depth);for(let te=0,_e=Fe.length;te<_e;te++)if(xe=Fe[te],y.format!==En)if(ge!==null)if(Be){if(D)if(y.layerUpdates.size>0){const be=kh(xe.width,xe.height,y.format,y.type);for(const ie of y.layerUpdates){const Pe=xe.data.subarray(ie*be/xe.data.BYTES_PER_ELEMENT,(ie+1)*be/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,ie,xe.width,xe.height,1,ge,Pe)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,xe.width,xe.height,ne.depth,ge,xe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,Me,xe.width,xe.height,ne.depth,0,xe.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,xe.width,xe.height,ne.depth,ge,De,xe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,Me,xe.width,xe.height,ne.depth,0,ge,De,xe.data)}else{Be&&qe&&t.texStorage2D(i.TEXTURE_2D,fe,Me,Fe[0].width,Fe[0].height);for(let te=0,_e=Fe.length;te<_e;te++)xe=Fe[te],y.format!==En?ge!==null?Be?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,xe.width,xe.height,ge,xe.data):t.compressedTexImage2D(i.TEXTURE_2D,te,Me,xe.width,xe.height,0,xe.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?D&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,xe.width,xe.height,ge,De,xe.data):t.texImage2D(i.TEXTURE_2D,te,Me,xe.width,xe.height,0,ge,De,xe.data)}else if(y.isDataArrayTexture)if(Be){if(qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Me,ne.width,ne.height,ne.depth),D)if(y.layerUpdates.size>0){const te=kh(ne.width,ne.height,y.format,y.type);for(const _e of y.layerUpdates){const be=ne.data.subarray(_e*te/ne.data.BYTES_PER_ELEMENT,(_e+1)*te/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,_e,ne.width,ne.height,1,ge,De,be)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ge,De,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Me,ne.width,ne.height,ne.depth,0,ge,De,ne.data);else if(y.isData3DTexture)Be?(qe&&t.texStorage3D(i.TEXTURE_3D,fe,Me,ne.width,ne.height,ne.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ge,De,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Me,ne.width,ne.height,ne.depth,0,ge,De,ne.data);else if(y.isFramebufferTexture){if(qe)if(Be)t.texStorage2D(i.TEXTURE_2D,fe,Me,ne.width,ne.height);else{let te=ne.width,_e=ne.height;for(let be=0;be<fe;be++)t.texImage2D(i.TEXTURE_2D,be,Me,te,_e,0,ge,De,null),te>>=1,_e>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in i){const te=i.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ne.parentNode!==te){te.appendChild(ne),d.add(y),te.onpaint=_e=>{const be=_e.changedElements;for(const ie of d)be.includes(ie.image)&&(ie.needsUpdate=!0)},te.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{const be=i.RGBA,ie=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,ie,Pe,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Fe.length>0){if(Be&&qe){const te=ft(Fe[0]);t.texStorage2D(i.TEXTURE_2D,fe,Me,te.width,te.height)}for(let te=0,_e=Fe.length;te<_e;te++)xe=Fe[te],Be?D&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ge,De,xe):t.texImage2D(i.TEXTURE_2D,te,Me,ge,De,xe);y.generateMipmaps=!1}else if(Be){if(qe){const te=ft(ne);t.texStorage2D(i.TEXTURE_2D,fe,Me,te.width,te.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,De,ne)}else t.texImage2D(i.TEXTURE_2D,0,Me,ge,De,ne);p(y)&&v(q),pe.__version=he.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function j(R,y,z){if(y.image.length!==6)return;const q=ee(R,y),Z=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+z);const he=n.get(Z);if(Z.version!==he.__version||q===!0){t.activeTexture(i.TEXTURE0+z);const pe=it.getPrimaries(it.workingColorSpace),J=y.colorSpace===Di?null:it.getPrimaries(y.colorSpace),ne=y.colorSpace===Di||pe===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);const ge=y.isCompressedTexture||y.image[0].isCompressedTexture,De=y.image[0]&&y.image[0].isDataTexture,Me=[];for(let ie=0;ie<6;ie++)!ge&&!De?Me[ie]=m(y.image[ie],!0,s.maxCubemapSize):Me[ie]=De?y.image[ie].image:y.image[ie],Me[ie]=Gt(y,Me[ie]);const xe=Me[0],Fe=a.convert(y.format,y.colorSpace),Be=a.convert(y.type),qe=M(y.internalFormat,Fe,Be,y.normalized,y.colorSpace),D=y.isVideoTexture!==!0,fe=he.__version===void 0||q===!0,te=Z.dataReady;let _e=S(y,xe);Ve(i.TEXTURE_CUBE_MAP,y);let be;if(ge){D&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,_e,qe,xe.width,xe.height);for(let ie=0;ie<6;ie++){be=Me[ie].mipmaps;for(let Pe=0;Pe<be.length;Pe++){const Re=be[Pe];y.format!==En?Fe!==null?D?te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,0,0,Re.width,Re.height,Fe,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,qe,Re.width,Re.height,0,Re.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,0,0,Re.width,Re.height,Fe,Be,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,qe,Re.width,Re.height,0,Fe,Be,Re.data)}}}else{if(be=y.mipmaps,D&&fe){be.length>0&&_e++;const ie=ft(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,_e,qe,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(De){D?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Me[ie].width,Me[ie].height,Fe,Be,Me[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,qe,Me[ie].width,Me[ie].height,0,Fe,Be,Me[ie].data);for(let Pe=0;Pe<be.length;Pe++){const Lt=be[Pe].image[ie].image;D?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,0,0,Lt.width,Lt.height,Fe,Be,Lt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,qe,Lt.width,Lt.height,0,Fe,Be,Lt.data)}}else{D?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Fe,Be,Me[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,qe,Fe,Be,Me[ie]);for(let Pe=0;Pe<be.length;Pe++){const Re=be[Pe];D?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,0,0,Fe,Be,Re.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,qe,Fe,Be,Re.image[ie])}}}p(y)&&v(i.TEXTURE_CUBE_MAP),he.__version=Z.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function de(R,y,z,q,Z,he){const pe=a.convert(z.format,z.colorSpace),J=a.convert(z.type),ne=M(z.internalFormat,pe,J,z.normalized,z.colorSpace),ge=n.get(y),De=n.get(z);if(De.__renderTarget=y,!ge.__hasExternalTextures){const Me=Math.max(1,y.width>>he),xe=Math.max(1,y.height>>he);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,he,ne,Me,xe,y.depth,0,pe,J,null):t.texImage2D(Z,he,ne,Me,xe,0,pe,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),vt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,Z,De.__webglTexture,0,Et(y)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,Z,De.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(R,y,z){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){const q=y.depthTexture,Z=q&&q.isDepthTexture?q.type:null,he=T(y.stencilBuffer,Z),pe=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;vt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et(y),he,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et(y),he,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,he,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,pe,i.RENDERBUFFER,R)}else{const q=y.textures;for(let Z=0;Z<q.length;Z++){const he=q[Z],pe=a.convert(he.format,he.colorSpace),J=a.convert(he.type),ne=M(he.internalFormat,pe,J,he.normalized,he.colorSpace);vt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et(y),ne,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et(y),ne,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,ne,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(R,y,z){const q=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=n.get(y.depthTexture);if(Z.__renderTarget=y,(!Z.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),q){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,y.depthTexture.addEventListener("dispose",A)),Z.__webglTexture===void 0){Z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Ve(i.TEXTURE_CUBE_MAP,y.depthTexture);const ge=a.convert(y.depthTexture.format),De=a.convert(y.depthTexture.type);let Me;y.depthTexture.format===xi?Me=i.DEPTH_COMPONENT24:y.depthTexture.format===ji&&(Me=i.DEPTH24_STENCIL8);for(let xe=0;xe<6;xe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,Me,y.width,y.height,0,ge,De,null)}}else Q(y.depthTexture,0);const he=Z.__webglTexture,pe=Et(y),J=q?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,ne=y.depthTexture.format===ji?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(y.depthTexture.format===xi)vt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,J,he,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,ne,J,he,0);else if(y.depthTexture.format===ji)vt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,J,he,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,ne,J,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function le(R){const y=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){const q=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),q){const Z=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,q.removeEventListener("dispose",Z)};q.addEventListener("dispose",Z),y.__depthDisposeCallback=Z}y.__boundDepthTexture=q}if(R.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let q=0;q<6;q++)Te(y.__webglFramebuffer[q],R,q);else{const q=R.texture.mipmaps;q&&q.length>0?Te(y.__webglFramebuffer[0],R,0):Te(y.__webglFramebuffer,R,0)}else if(z){y.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[q]),y.__webglDepthbuffer[q]===void 0)y.__webglDepthbuffer[q]=i.createRenderbuffer(),Ae(y.__webglDepthbuffer[q],R,!1);else{const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=y.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,he)}}else{const q=R.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Ae(y.__webglDepthbuffer,R,!1);else{const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function We(R,y,z){const q=n.get(R);y!==void 0&&de(q.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&le(R)}function Qe(R){const y=R.texture,z=n.get(R),q=n.get(y);R.addEventListener("dispose",_);const Z=R.textures,he=R.isWebGLCubeRenderTarget===!0,pe=Z.length>1;if(pe||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=y.version,r.memory.textures++),he){z.__webglFramebuffer=[];for(let J=0;J<6;J++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[J]=[];for(let ne=0;ne<y.mipmaps.length;ne++)z.__webglFramebuffer[J][ne]=i.createFramebuffer()}else z.__webglFramebuffer[J]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let J=0;J<y.mipmaps.length;J++)z.__webglFramebuffer[J]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(pe)for(let J=0,ne=Z.length;J<ne;J++){const ge=n.get(Z[J]);ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture(),r.memory.textures++)}if(R.samples>0&&vt(R)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let J=0;J<Z.length;J++){const ne=Z[J];z.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[J]);const ge=a.convert(ne.format,ne.colorSpace),De=a.convert(ne.type),Me=M(ne.internalFormat,ge,De,ne.normalized,ne.colorSpace,R.isXRRenderTarget===!0),xe=Et(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,xe,Me,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,z.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ae(z.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Ve(i.TEXTURE_CUBE_MAP,y);for(let J=0;J<6;J++)if(y.mipmaps&&y.mipmaps.length>0)for(let ne=0;ne<y.mipmaps.length;ne++)de(z.__webglFramebuffer[J][ne],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ne);else de(z.__webglFramebuffer[J],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(y)&&v(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(pe){for(let J=0,ne=Z.length;J<ne;J++){const ge=Z[J],De=n.get(ge);let Me=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Me=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,De.__webglTexture),Ve(Me,ge),de(z.__webglFramebuffer,R,ge,i.COLOR_ATTACHMENT0+J,Me,0),p(ge)&&v(Me)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(J=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,q.__webglTexture),Ve(J,y),y.mipmaps&&y.mipmaps.length>0)for(let ne=0;ne<y.mipmaps.length;ne++)de(z.__webglFramebuffer[ne],R,y,i.COLOR_ATTACHMENT0,J,ne);else de(z.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,J,0);p(y)&&v(J),t.unbindTexture()}R.depthBuffer&&le(R)}function Rt(R){const y=R.textures;for(let z=0,q=y.length;z<q;z++){const Z=y[z];if(p(Z)){const he=w(R),pe=n.get(Z).__webglTexture;t.bindTexture(he,pe),v(he),t.unbindTexture()}}}const Pt=[],kt=[];function rt(R){if(R.samples>0){if(vt(R)===!1){const y=R.textures,z=R.width,q=R.height;let Z=i.COLOR_BUFFER_BIT;const he=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=n.get(R),J=y.length>1;if(J)for(let ge=0;ge<y.length;ge++)t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer);const ne=R.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let ge=0;ge<y.length;ge++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,pe.__webglColorRenderbuffer[ge]);const De=n.get(y[ge]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,De,0)}i.blitFramebuffer(0,0,z,q,0,0,z,q,Z,i.NEAREST),c===!0&&(Pt.length=0,kt.length=0,Pt.push(i.COLOR_ATTACHMENT0+ge),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Pt.push(he),kt.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,kt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Pt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let ge=0;ge<y.length;ge++){t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,pe.__webglColorRenderbuffer[ge]);const De=n.get(y[ge]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,De,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function Et(R){return Math.min(s.maxSamples,R.samples)}function vt(R){const y=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function N(R){const y=r.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function Gt(R,y){const z=R.colorSpace,q=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==vn&&z!==Di&&(it.getTransfer(z)===pt?(q!==En||Z!==Mn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ge("WebGLTextures: Unsupported texture color space:",z)),y}function ft(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=O,this.getTextureUnits=K,this.setTextureUnits=k,this.setTexture2D=Q,this.setTexture2DArray=ae,this.setTexture3D=oe,this.setTextureCube=me,this.rebindTextures=We,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=Rt,this.updateMultisampleRenderTarget=rt,this.setupDepthRenderbuffer=le,this.setupFrameBufferTexture=de,this.useMultisampledRTT=vt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function aM(i,e){function t(n,s=Di){let a;const r=it.getTransfer(s);if(n===Mn)return i.UNSIGNED_BYTE;if(n===tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Xd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Vd)return i.BYTE;if(n===Wd)return i.SHORT;if(n===Ma)return i.UNSIGNED_SHORT;if(n===el)return i.INT;if(n===Qn)return i.UNSIGNED_INT;if(n===Tn)return i.FLOAT;if(n===gi)return i.HALF_FLOAT;if(n===Yd)return i.ALPHA;if(n===$d)return i.RGB;if(n===En)return i.RGBA;if(n===xi)return i.DEPTH_COMPONENT;if(n===ji)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===sl)return i.RED_INTEGER;if(n===ts)return i.RG;if(n===al)return i.RG_INTEGER;if(n===rl)return i.RGBA_INTEGER;if(n===vr||n===yr||n===Sr||n===br)if(r===pt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===vr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===yr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Sr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===br)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===vr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===yr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Sr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===br)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ec||n===tc||n===nc||n===ic)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===ec)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===tc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===nc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ic)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===sc||n===ac||n===rc||n===oc||n===cc||n===Ir||n===lc)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===sc||n===ac)return r===pt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===rc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(n===oc)return a.COMPRESSED_R11_EAC;if(n===cc)return a.COMPRESSED_SIGNED_R11_EAC;if(n===Ir)return a.COMPRESSED_RG11_EAC;if(n===lc)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===hc||n===dc||n===uc||n===fc||n===pc||n===mc||n===gc||n===xc||n===_c||n===Mc||n===vc||n===yc||n===Sc||n===bc)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===hc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===dc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===uc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===pc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===mc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===gc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_c)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Mc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Sc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bc)return r===pt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wc||n===Tc||n===Ec)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===wc)return r===pt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Tc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ec)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ac||n===Rc||n===Lr||n===Cc)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===Ac)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Rc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Lr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Cc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===va?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const rM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,oM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class cM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new lu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new On({vertexShader:rM,fragmentShader:oM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new F(new Mi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lM extends is{constructor(e,t){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const x=typeof XRWebGLBinding<"u",m=new cM,p={},v=t.getContextAttributes();let w=null,M=null;const T=[],S=[],A=new He;let _=null;const b=new cn;b.viewport=new Mt;const C=new cn;C.viewport=new Mt;const P=[b,C],I=new hm;let O=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ue=T[ee];return ue===void 0&&(ue=new ao,T[ee]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(ee){let ue=T[ee];return ue===void 0&&(ue=new ao,T[ee]=ue),ue.getGripSpace()},this.getHand=function(ee){let ue=T[ee];return ue===void 0&&(ue=new ao,T[ee]=ue),ue.getHandSpace()};function k(ee){const ue=S.indexOf(ee.inputSource);if(ue===-1)return;const re=T[ue];re!==void 0&&(re.update(ee.inputSource,ee.frame,l||r),re.dispatchEvent({type:ee.type,data:ee.inputSource}))}function $(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",V);for(let ee=0;ee<T.length;ee++){const ue=S[ee];ue!==null&&(S[ee]=null,T[ee].disconnect(ue))}O=null,K=null,m.reset();for(const ee in p)delete p[ee];e.setRenderTarget(w),f=null,u=null,d=null,s=null,M=null,Ve.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){a=ee,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){o=ee,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(ee){l=ee},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",$),s.addEventListener("inputsourceschange",V),v.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,H=null,j=null;v.depth&&(j=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=v.stencil?ji:xi,H=v.stencil?va:Qn);const de={colorFormat:t.RGBA8,depthFormat:j,scaleFactor:a};d=this.getBinding(),u=d.createProjectionLayer(de),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new jn(u.textureWidth,u.textureHeight,{format:En,type:Mn,depthTexture:new ks(u.textureWidth,u.textureHeight,H,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const re={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,t,re),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new jn(f.framebufferWidth,f.framebufferHeight,{format:En,type:Mn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),Ve.setContext(s),Ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function V(ee){for(let ue=0;ue<ee.removed.length;ue++){const re=ee.removed[ue],H=S.indexOf(re);H>=0&&(S[H]=null,T[H].disconnect(re))}for(let ue=0;ue<ee.added.length;ue++){const re=ee.added[ue];let H=S.indexOf(re);if(H===-1){for(let de=0;de<T.length;de++)if(de>=S.length){S.push(re),H=de;break}else if(S[de]===null){S[de]=re,H=de;break}if(H===-1)break}const j=T[H];j&&j.connect(re)}}const Q=new L,ae=new L;function oe(ee,ue,re){Q.setFromMatrixPosition(ue.matrixWorld),ae.setFromMatrixPosition(re.matrixWorld);const H=Q.distanceTo(ae),j=ue.projectionMatrix.elements,de=re.projectionMatrix.elements,Ae=j[14]/(j[10]-1),Te=j[14]/(j[10]+1),le=(j[9]+1)/j[5],We=(j[9]-1)/j[5],Qe=(j[8]-1)/j[0],Rt=(de[8]+1)/de[0],Pt=Ae*Qe,kt=Ae*Rt,rt=H/(-Qe+Rt),Et=rt*-Qe;if(ue.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Et),ee.translateZ(rt),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),j[10]===-1)ee.projectionMatrix.copy(ue.projectionMatrix),ee.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{const vt=Ae+rt,N=Te+rt,Gt=Pt-Et,ft=kt+(H-Et),R=le*Te/N*vt,y=We*Te/N*vt;ee.projectionMatrix.makePerspective(Gt,ft,R,y,vt,N),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function me(ee,ue){ue===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ue.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let ue=ee.near,re=ee.far;m.texture!==null&&(m.depthNear>0&&(ue=m.depthNear),m.depthFar>0&&(re=m.depthFar)),I.near=C.near=b.near=ue,I.far=C.far=b.far=re,(O!==I.near||K!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),O=I.near,K=I.far),I.layers.mask=ee.layers.mask|6,b.layers.mask=I.layers.mask&-5,C.layers.mask=I.layers.mask&-3;const H=ee.parent,j=I.cameras;me(I,H);for(let de=0;de<j.length;de++)me(j[de],H);j.length===2?oe(I,b,C):I.projectionMatrix.copy(b.projectionMatrix),ce(ee,I,H)};function ce(ee,ue,re){re===null?ee.matrix.copy(ue.matrixWorld):(ee.matrix.copy(re.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ue.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ue.projectionMatrix),ee.projectionMatrixInverse.copy(ue.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Os*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(ee){c=ee,u!==null&&(u.fixedFoveation=ee),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ee)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(ee){return p[ee]};let Ke=null;function ut(ee,ue){if(h=ue.getViewerPose(l||r),g=ue,h!==null){const re=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let H=!1;re.length!==I.cameras.length&&(I.cameras.length=0,H=!0);for(let Te=0;Te<re.length;Te++){const le=re[Te];let We=null;if(f!==null)We=f.getViewport(le);else{const Rt=d.getViewSubImage(u,le);We=Rt.viewport,Te===0&&(e.setRenderTargetTextures(M,Rt.colorTexture,Rt.depthStencilTexture),e.setRenderTarget(M))}let Qe=P[Te];Qe===void 0&&(Qe=new cn,Qe.layers.enable(Te),Qe.viewport=new Mt,P[Te]=Qe),Qe.matrix.fromArray(le.transform.matrix),Qe.matrix.decompose(Qe.position,Qe.quaternion,Qe.scale),Qe.projectionMatrix.fromArray(le.projectionMatrix),Qe.projectionMatrixInverse.copy(Qe.projectionMatrix).invert(),Qe.viewport.set(We.x,We.y,We.width,We.height),Te===0&&(I.matrix.copy(Qe.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),H===!0&&I.cameras.push(Qe)}const j=s.enabledFeatures;if(j&&j.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const Te=d.getDepthInformation(re[0]);Te&&Te.isValid&&Te.texture&&m.init(Te,s.renderState)}if(j&&j.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let Te=0;Te<re.length;Te++){const le=re[Te].camera;if(le){let We=p[le];We||(We=new lu,p[le]=We);const Qe=d.getCameraImage(le);We.sourceTexture=Qe}}}}for(let re=0;re<T.length;re++){const H=S[re],j=T[re];H!==null&&j!==void 0&&j.update(H,ue,l||r)}Ke&&Ke(ee,ue),ue.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ue}),g=null}const Ve=new mu;Ve.setAnimationLoop(ut),this.setAnimationLoop=function(ee){Ke=ee},this.dispose=function(){}}}const hM=new $e,Su=new Xe;Su.set(-1,0,0,0,1,0,0,0,1);function dM(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,hu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,w,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?a(m,p):p.isMeshLambertMaterial?(a(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(m,p),d(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),x(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,v,w):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===sn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===sn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=e.get(p),w=v.envMap,M=v.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(hM.makeRotationFromEuler(M)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Su),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=w*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===sn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const v=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function uM(i,e,t,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,T){const S=T.program;n.uniformBlockBinding(M,S)}function l(M,T){let S=s[M.id];S===void 0&&(m(M),S=h(M),s[M.id]=S,M.addEventListener("dispose",v));const A=T.program;n.updateUBOMapping(M,A);const _=e.render.frame;a[M.id]!==_&&(u(M),a[M.id]=_)}function h(M){const T=d();M.__bindingPointIndex=T;const S=i.createBuffer(),A=M.__size,_=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,A,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,S),S}function d(){for(let M=0;M<o;M++)if(r.indexOf(M)===-1)return r.push(M),M;return Ge("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const T=s[M.id],S=M.uniforms,A=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let _=0,b=S.length;_<b;_++){const C=S[_];if(Array.isArray(C))for(let P=0,I=C.length;P<I;P++)f(C[P],_,P,A);else f(C,_,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,T,S,A){if(x(M,T,S,A)===!0){const _=M.__offset,b=M.value;if(Array.isArray(b)){let C=0;for(let P=0;P<b.length;P++){const I=b[P],O=p(I);g(I,M.__data,C),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(C+=O.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(b,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,M.__data)}}function g(M,T,S){typeof M=="number"||typeof M=="boolean"?T[0]=M:M.isMatrix3?(T[0]=M.elements[0],T[1]=M.elements[1],T[2]=M.elements[2],T[3]=0,T[4]=M.elements[3],T[5]=M.elements[4],T[6]=M.elements[5],T[7]=0,T[8]=M.elements[6],T[9]=M.elements[7],T[10]=M.elements[8],T[11]=0):ArrayBuffer.isView(M)?T.set(new M.constructor(M.buffer,M.byteOffset,T.length)):M.toArray(T,S)}function x(M,T,S,A){const _=M.value,b=T+"_"+S;if(A[b]===void 0)return typeof _=="number"||typeof _=="boolean"?A[b]=_:ArrayBuffer.isView(_)?A[b]=_.slice():A[b]=_.clone(),!0;{const C=A[b];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return A[b]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(C.equals(_)===!1)return C.copy(_),!0}}return!1}function m(M){const T=M.uniforms;let S=0;const A=16;for(let b=0,C=T.length;b<C;b++){const P=Array.isArray(T[b])?T[b]:[T[b]];for(let I=0,O=P.length;I<O;I++){const K=P[I],k=Array.isArray(K.value)?K.value:[K.value];for(let $=0,V=k.length;$<V;$++){const Q=k[$],ae=p(Q),oe=S%A,me=oe%ae.boundary,ce=oe+me;S+=me,ce!==0&&A-ce<ae.storage&&(S+=A-ce),K.__data=new Float32Array(ae.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=S,S+=ae.storage}}}const _=S%A;return _>0&&(S+=A-_),M.__size=S,M.__cache={},this}function p(M){const T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=48,T.storage=48):M.isMatrix4?(T.boundary=64,T.storage=64):M.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(T.boundary=16,T.storage=M.byteLength):Ie("WebGLRenderer: Unsupported uniform value type.",M),T}function v(M){const T=M.target;T.removeEventListener("dispose",v);const S=r.indexOf(T.__bindingPointIndex);r.splice(S,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete a[T.id]}function w(){for(const M in s)i.deleteBuffer(s[M]);r=[],s={},a={}}return{bind:c,update:l,dispose:w}}const fM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Vn=null;function pM(){return Vn===null&&(Vn=new ul(fM,16,16,ts,gi),Vn.name="DFG_LUT",Vn.minFilter=Wt,Vn.magFilter=Wt,Vn.wrapS=Kn,Vn.wrapT=Kn,Vn.generateMipmaps=!1,Vn.needsUpdate=!0),Vn}class mM{constructor(e={}){const{canvas:t=zf(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Mn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=r;const x=f,m=new Set([rl,al,sl]),p=new Set([Mn,Qn,Ma,va,tl,nl]),v=new Uint32Array(4),w=new Int32Array(4),M=new L;let T=null,S=null;const A=[],_=[];let b=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,I=null,O=null,K=null,k=null;this._outputColorSpace=_t;let $=0,V=0,Q=null,ae=-1,oe=null;const me=new Mt,ce=new Mt;let Ke=null;const ut=new Le(0);let Ve=0,ee=t.width,ue=t.height,re=1,H=null,j=null;const de=new Mt(0,0,ee,ue),Ae=new Mt(0,0,ee,ue);let Te=!1;const le=new pl;let We=!1,Qe=!1;const Rt=new $e,Pt=new L,kt=new Mt,rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Et=!1;function vt(){return Q===null?re:1}let N=n;function Gt(E,B){return t.getContext(E,B)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Jc}`),t.addEventListener("webglcontextlost",Lt,!1),t.addEventListener("webglcontextrestored",bt,!1),t.addEventListener("webglcontextcreationerror",Bn,!1),N===null){const B="webgl2";if(N=Gt(B,E),N===null)throw Gt(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(E){throw Ge("WebGLRenderer: "+E.message),E}let ft,R,y,z,q,Z,he,pe,J,ne,ge,De,Me,xe,Fe,Be,qe,D,fe,te,_e,be,ie;function Pe(){ft=new px(N),ft.init(),_e=new aM(N,ft),R=new rx(N,ft,e,_e),y=new iM(N,ft),R.reversedDepthBuffer&&u&&y.buffers.depth.setReversed(!0),O=N.createFramebuffer(),K=N.createFramebuffer(),k=N.createFramebuffer(),z=new xx(N),q=new V_,Z=new sM(N,ft,y,q,R,_e,z),he=new fx(C),pe=new ym(N),be=new sx(N,pe),J=new mx(N,pe,z,be),ne=new Mx(N,J,pe,be,z),D=new _x(N,R,Z),Fe=new ox(q),ge=new H_(C,he,ft,R,be,Fe),De=new dM(C,q),Me=new X_,xe=new J_(ft),qe=new ix(C,he,y,ne,g,c),Be=new nM(C,ne,R),ie=new uM(N,z,R,y),fe=new ax(N,ft,z),te=new gx(N,ft,z),z.programs=ge.programs,C.capabilities=R,C.extensions=ft,C.properties=q,C.renderLists=Me,C.shadowMap=Be,C.state=y,C.info=z}Pe(),x!==Mn&&(b=new yx(x,t.width,t.height,o,s,a));const Re=new lM(C,N);this.xr=Re,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const E=ft.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ft.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(E){E!==void 0&&(re=E,this.setSize(ee,ue,!1))},this.getSize=function(E){return E.set(ee,ue)},this.setSize=function(E,B,Y=!0){if(Re.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}ee=E,ue=B,t.width=Math.floor(E*re),t.height=Math.floor(B*re),Y===!0&&(t.style.width=E+"px",t.style.height=B+"px"),b!==null&&b.setSize(t.width,t.height),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(ee*re,ue*re).floor()},this.setDrawingBufferSize=function(E,B,Y){ee=E,ue=B,re=Y,t.width=Math.floor(E*Y),t.height=Math.floor(B*Y),this.setViewport(0,0,E,B)},this.setEffects=function(E){if(x===Mn){Ge("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let B=0;B<E.length;B++)if(E[B].isOutputPass===!0){Ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(me)},this.getViewport=function(E){return E.copy(de)},this.setViewport=function(E,B,Y,W){E.isVector4?de.set(E.x,E.y,E.z,E.w):de.set(E,B,Y,W),y.viewport(me.copy(de).multiplyScalar(re).round())},this.getScissor=function(E){return E.copy(Ae)},this.setScissor=function(E,B,Y,W){E.isVector4?Ae.set(E.x,E.y,E.z,E.w):Ae.set(E,B,Y,W),y.scissor(ce.copy(Ae).multiplyScalar(re).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(E){y.setScissorTest(Te=E)},this.setOpaqueSort=function(E){H=E},this.setTransparentSort=function(E){j=E},this.getClearColor=function(E){return E.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor(...arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha(...arguments)},this.clear=function(E=!0,B=!0,Y=!0){let W=0;if(E){let X=!1;if(Q!==null){const Se=Q.texture.format;X=m.has(Se)}if(X){const Se=Q.texture.type,Ee=p.has(Se),ye=qe.getClearColor(),Ce=qe.getClearAlpha(),Ne=ye.r,Ye=ye.g,et=ye.b;Ee?(v[0]=Ne,v[1]=Ye,v[2]=et,v[3]=Ce,N.clearBufferuiv(N.COLOR,0,v)):(w[0]=Ne,w[1]=Ye,w[2]=et,w[3]=Ce,N.clearBufferiv(N.COLOR,0,w))}else W|=N.COLOR_BUFFER_BIT}B&&(W|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(W|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&N.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),I=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Lt,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",Bn,!1),qe.dispose(),Me.dispose(),xe.dispose(),q.dispose(),he.dispose(),ne.dispose(),be.dispose(),ie.dispose(),ge.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",Dl),Re.removeEventListener("sessionend",Nl),Bi.stop()};function Lt(E){E.preventDefault(),Ur("WebGLRenderer: Context Lost."),P=!0}function bt(){Ur("WebGLRenderer: Context Restored."),P=!1;const E=z.autoReset,B=Be.enabled,Y=Be.autoUpdate,W=Be.needsUpdate,X=Be.type;Pe(),z.autoReset=E,Be.enabled=B,Be.autoUpdate=Y,Be.needsUpdate=W,Be.type=X}function Bn(E){Ge("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function zn(E){const B=E.target;B.removeEventListener("dispose",zn),Ku(B)}function Ku(E){Zu(E),q.remove(E)}function Zu(E){const B=q.get(E).programs;B!==void 0&&(B.forEach(function(Y){ge.releaseProgram(Y)}),E.isShaderMaterial&&ge.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,Y,W,X,Se){B===null&&(B=rt);const Ee=X.isMesh&&X.matrixWorld.determinantAffine()<0,ye=Qu(E,B,Y,W,X);y.setMaterial(W,Ee);let Ce=Y.index,Ne=1;if(W.wireframe===!0){if(Ce=J.getWireframeAttribute(Y),Ce===void 0)return;Ne=2}const Ye=Y.drawRange,et=Y.attributes.position;let Ue=Ye.start*Ne,xt=(Ye.start+Ye.count)*Ne;Se!==null&&(Ue=Math.max(Ue,Se.start*Ne),xt=Math.min(xt,(Se.start+Se.count)*Ne)),Ce!==null?(Ue=Math.max(Ue,0),xt=Math.min(xt,Ce.count)):et!=null&&(Ue=Math.max(Ue,0),xt=Math.min(xt,et.count));const Nt=xt-Ue;if(Nt<0||Nt===1/0)return;be.setup(X,W,ye,Y,Ce);let Dt,yt=fe;if(Ce!==null&&(Dt=pe.get(Ce),yt=te,yt.setIndex(Dt)),X.isMesh)W.wireframe===!0?(y.setLineWidth(W.wireframeLinewidth*vt()),yt.setMode(N.LINES)):yt.setMode(N.TRIANGLES);else if(X.isLine){let Qt=W.linewidth;Qt===void 0&&(Qt=1),y.setLineWidth(Qt*vt()),X.isLineSegments?yt.setMode(N.LINES):X.isLineLoop?yt.setMode(N.LINE_LOOP):yt.setMode(N.LINE_STRIP)}else X.isPoints?yt.setMode(N.POINTS):X.isSprite&&yt.setMode(N.TRIANGLES);if(X.isBatchedMesh)if(ft.get("WEBGL_multi_draw"))yt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Qt=X._multiDrawStarts,we=X._multiDrawCounts,pn=X._multiDrawCount,ot=Ce?pe.get(Ce).bytesPerElement:1,yn=q.get(W).currentProgram.getUniforms();for(let Gn=0;Gn<pn;Gn++)yn.setValue(N,"_gl_DrawID",Gn),yt.render(Qt[Gn]/ot,we[Gn])}else if(X.isInstancedMesh)yt.renderInstances(Ue,Nt,X.count);else if(Y.isInstancedBufferGeometry){const Qt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,we=Math.min(Y.instanceCount,Qt);yt.renderInstances(Ue,Nt,we)}else yt.render(Ue,Nt)};function Ll(E,B,Y){E.transparent===!0&&E.side===nn&&E.forceSinglePass===!1?(E.side=sn,E.needsUpdate=!0,Da(E,B,Y),E.side=mi,E.needsUpdate=!0,Da(E,B,Y),E.side=nn):Da(E,B,Y)}this.compile=function(E,B,Y=null){Y===null&&(Y=E),S=xe.get(Y),S.init(B),_.push(S),Y.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),E!==Y&&E.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),S.setupLights();const W=new Set;return E.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Se=X.material;if(Se)if(Array.isArray(Se))for(let Ee=0;Ee<Se.length;Ee++){const ye=Se[Ee];Ll(ye,Y,X),W.add(ye)}else Ll(Se,Y,X),W.add(Se)}),S=_.pop(),W},this.compileAsync=function(E,B,Y=null){const W=this.compile(E,B,Y);return new Promise(X=>{function Se(){if(W.forEach(function(Ee){q.get(Ee).currentProgram.isReady()&&W.delete(Ee)}),W.size===0){X(E);return}setTimeout(Se,10)}ft.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Kr=null;function Ju(E){Kr&&Kr(E)}function Dl(){Bi.stop()}function Nl(){Bi.start()}const Bi=new mu;Bi.setAnimationLoop(Ju),typeof self<"u"&&Bi.setContext(self),this.setAnimationLoop=function(E){Kr=E,Re.setAnimationLoop(E),E===null?Bi.stop():Bi.start()},Re.addEventListener("sessionstart",Dl),Re.addEventListener("sessionend",Nl),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){Ge("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;I!==null&&I.renderStart(E,B);const Y=Re.enabled===!0&&Re.isPresenting===!0,W=b!==null&&(Q===null||Y)&&b.begin(C,Q);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(B),B=Re.getCamera()),E.isScene===!0&&E.onBeforeRender(C,E,B,Q),S=xe.get(E,_.length),S.init(B),S.state.textureUnits=Z.getTextureUnits(),_.push(S),Rt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),le.setFromProjectionMatrix(Rt,Zn,B.reversedDepth),Qe=this.localClippingEnabled,We=Fe.init(this.clippingPlanes,Qe),T=Me.get(E,A.length),T.init(),A.push(T),Re.enabled===!0&&Re.isPresenting===!0){const Ee=C.xr.getDepthSensingMesh();Ee!==null&&Zr(Ee,B,-1/0,C.sortObjects)}Zr(E,B,0,C.sortObjects),T.finish(),C.sortObjects===!0&&T.sort(H,j,B.reversedDepth),Et=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,Et&&qe.addToRenderList(T,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),We===!0&&Fe.beginShadows();const X=S.state.shadowsArray;if(Be.render(X,E,B),We===!0&&Fe.endShadows(),(W&&b.hasRenderPass())===!1){const Ee=T.opaque,ye=T.transmissive;if(S.setupLights(),B.isArrayCamera){const Ce=B.cameras;if(ye.length>0)for(let Ne=0,Ye=Ce.length;Ne<Ye;Ne++){const et=Ce[Ne];Fl(Ee,ye,E,et)}Et&&qe.render(E);for(let Ne=0,Ye=Ce.length;Ne<Ye;Ne++){const et=Ce[Ne];Ul(T,E,et,et.viewport)}}else ye.length>0&&Fl(Ee,ye,E,B),Et&&qe.render(E),Ul(T,E,B)}Q!==null&&V===0&&(Z.updateMultisampleRenderTarget(Q),Z.updateRenderTargetMipmap(Q)),W&&b.end(C),E.isScene===!0&&E.onAfterRender(C,E,B),be.resetDefaultState(),ae=-1,oe=null,_.pop(),_.length>0?(S=_[_.length-1],Z.setTextureUnits(S.state.textureUnits),We===!0&&Fe.setGlobalState(C.clippingPlanes,S.state.camera)):S=null,A.pop(),A.length>0?T=A[A.length-1]:T=null,I!==null&&I.renderEnd()};function Zr(E,B,Y,W){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLightProbeGrid)S.pushLightProbeGrid(E);else if(E.isLight)S.pushLight(E),E.castShadow&&S.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||le.intersectsSprite(E)){W&&kt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Rt);const Ee=ne.update(E),ye=E.material;ye.visible&&T.push(E,Ee,ye,Y,kt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||le.intersectsObject(E))){const Ee=ne.update(E),ye=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),kt.copy(E.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),kt.copy(Ee.boundingSphere.center)),kt.applyMatrix4(E.matrixWorld).applyMatrix4(Rt)),Array.isArray(ye)){const Ce=Ee.groups;for(let Ne=0,Ye=Ce.length;Ne<Ye;Ne++){const et=Ce[Ne],Ue=ye[et.materialIndex];Ue&&Ue.visible&&T.push(E,Ee,Ue,Y,kt.z,et)}}else ye.visible&&T.push(E,Ee,ye,Y,kt.z,null)}}const Se=E.children;for(let Ee=0,ye=Se.length;Ee<ye;Ee++)Zr(Se[Ee],B,Y,W)}function Ul(E,B,Y,W){const{opaque:X,transmissive:Se,transparent:Ee}=E;S.setupLightsView(Y),We===!0&&Fe.setGlobalState(C.clippingPlanes,Y),W&&y.viewport(me.copy(W)),X.length>0&&La(X,B,Y),Se.length>0&&La(Se,B,Y),Ee.length>0&&La(Ee,B,Y),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function Fl(E,B,Y,W){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[W.id]===void 0){const Ue=ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[W.id]=new jn(1,1,{generateMipmaps:!0,type:Ue?gi:Mn,minFilter:hi,samples:Math.max(4,R.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace})}const Se=S.state.transmissionRenderTarget[W.id],Ee=W.viewport||me;Se.setSize(Ee.z*C.transmissionResolutionScale,Ee.w*C.transmissionResolutionScale);const ye=C.getRenderTarget(),Ce=C.getActiveCubeFace(),Ne=C.getActiveMipmapLevel();C.setRenderTarget(Se),C.getClearColor(ut),Ve=C.getClearAlpha(),Ve<1&&C.setClearColor(16777215,.5),C.clear(),Et&&qe.render(Y);const Ye=C.toneMapping;C.toneMapping=Jn;const et=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),S.setupLightsView(W),We===!0&&Fe.setGlobalState(C.clippingPlanes,W),La(E,Y,W),Z.updateMultisampleRenderTarget(Se),Z.updateRenderTargetMipmap(Se),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let xt=0,Nt=B.length;xt<Nt;xt++){const Dt=B[xt],{object:yt,geometry:Qt,material:we,group:pn}=Dt;if(we.side===nn&&yt.layers.test(W.layers)){const ot=we.side;we.side=sn,we.needsUpdate=!0,Ol(yt,Y,W,Qt,we,pn),we.side=ot,we.needsUpdate=!0,Ue=!0}}Ue===!0&&(Z.updateMultisampleRenderTarget(Se),Z.updateRenderTargetMipmap(Se))}C.setRenderTarget(ye,Ce,Ne),C.setClearColor(ut,Ve),et!==void 0&&(W.viewport=et),C.toneMapping=Ye}function La(E,B,Y){const W=B.isScene===!0?B.overrideMaterial:null;for(let X=0,Se=E.length;X<Se;X++){const Ee=E[X],{object:ye,geometry:Ce,group:Ne}=Ee;let Ye=Ee.material;Ye.allowOverride===!0&&W!==null&&(Ye=W),ye.layers.test(Y.layers)&&Ol(ye,B,Y,Ce,Ye,Ne)}}function Ol(E,B,Y,W,X,Se){E.onBeforeRender(C,B,Y,W,X,Se),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),X.onBeforeRender(C,B,Y,W,E,Se),X.transparent===!0&&X.side===nn&&X.forceSinglePass===!1?(X.side=sn,X.needsUpdate=!0,C.renderBufferDirect(Y,B,W,X,E,Se),X.side=mi,X.needsUpdate=!0,C.renderBufferDirect(Y,B,W,X,E,Se),X.side=nn):C.renderBufferDirect(Y,B,W,X,E,Se),E.onAfterRender(C,B,Y,W,X,Se)}function Da(E,B,Y){B.isScene!==!0&&(B=rt);const W=q.get(E),X=S.state.lights,Se=S.state.shadowsArray,Ee=X.state.version,ye=ge.getParameters(E,X.state,Se,B,Y,S.state.lightProbeGridArray),Ce=ge.getProgramCacheKey(ye);let Ne=W.programs;W.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?B.environment:null,W.fog=B.fog;const Ye=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;W.envMap=he.get(E.envMap||W.environment,Ye),W.envMapRotation=W.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,Ne===void 0&&(E.addEventListener("dispose",zn),Ne=new Map,W.programs=Ne);let et=Ne.get(Ce);if(et!==void 0){if(W.currentProgram===et&&W.lightsStateVersion===Ee)return Bl(E,ye),et}else ye.uniforms=ge.getUniforms(E),I!==null&&E.isNodeMaterial&&I.build(E,Y,ye),E.onBeforeCompile(ye,C),et=ge.acquireProgram(ye,Ce),Ne.set(Ce,et),W.uniforms=ye.uniforms;const Ue=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ue.clippingPlanes=Fe.uniform),Bl(E,ye),W.needsLights=tf(E),W.lightsStateVersion=Ee,W.needsLights&&(Ue.ambientLightColor.value=X.state.ambient,Ue.lightProbe.value=X.state.probe,Ue.directionalLights.value=X.state.directional,Ue.directionalLightShadows.value=X.state.directionalShadow,Ue.spotLights.value=X.state.spot,Ue.spotLightShadows.value=X.state.spotShadow,Ue.rectAreaLights.value=X.state.rectArea,Ue.ltc_1.value=X.state.rectAreaLTC1,Ue.ltc_2.value=X.state.rectAreaLTC2,Ue.pointLights.value=X.state.point,Ue.pointLightShadows.value=X.state.pointShadow,Ue.hemisphereLights.value=X.state.hemi,Ue.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ue.spotLightMatrix.value=X.state.spotLightMatrix,Ue.spotLightMap.value=X.state.spotLightMap,Ue.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=S.state.lightProbeGridArray.length>0,W.currentProgram=et,W.uniformsList=null,et}function kl(E){if(E.uniformsList===null){const B=E.currentProgram.getUniforms();E.uniformsList=Tr.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function Bl(E,B){const Y=q.get(E);Y.outputColorSpace=B.outputColorSpace,Y.batching=B.batching,Y.batchingColor=B.batchingColor,Y.instancing=B.instancing,Y.instancingColor=B.instancingColor,Y.instancingMorph=B.instancingMorph,Y.skinning=B.skinning,Y.morphTargets=B.morphTargets,Y.morphNormals=B.morphNormals,Y.morphColors=B.morphColors,Y.morphTargetsCount=B.morphTargetsCount,Y.numClippingPlanes=B.numClippingPlanes,Y.numIntersection=B.numClipIntersection,Y.vertexAlphas=B.vertexAlphas,Y.vertexTangents=B.vertexTangents,Y.toneMapping=B.toneMapping}function ju(E,B){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;M.setFromMatrixPosition(B.matrixWorld);for(let Y=0,W=E.length;Y<W;Y++){const X=E[Y];if(X.texture!==null&&X.boundingBox.containsPoint(M))return X}return null}function Qu(E,B,Y,W,X){B.isScene!==!0&&(B=rt),Z.resetTextureUnits();const Se=B.fog,Ee=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?B.environment:null,ye=Q===null?C.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:it.workingColorSpace,Ce=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Ne=he.get(W.envMap||Ee,Ce),Ye=W.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,et=!!Y.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ue=!!Y.morphAttributes.position,xt=!!Y.morphAttributes.normal,Nt=!!Y.morphAttributes.color;let Dt=Jn;W.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Dt=C.toneMapping);const yt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Qt=yt!==void 0?yt.length:0,we=q.get(W),pn=S.state.lights;if(We===!0&&(Qe===!0||E!==oe)){const wt=E===oe&&W.id===ae;Fe.setState(W,E,wt)}let ot=!1;W.version===we.__version?(we.needsLights&&we.lightsStateVersion!==pn.state.version||we.outputColorSpace!==ye||X.isBatchedMesh&&we.batching===!1||!X.isBatchedMesh&&we.batching===!0||X.isBatchedMesh&&we.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&we.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&we.instancing===!1||!X.isInstancedMesh&&we.instancing===!0||X.isSkinnedMesh&&we.skinning===!1||!X.isSkinnedMesh&&we.skinning===!0||X.isInstancedMesh&&we.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&we.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&we.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&we.instancingMorph===!1&&X.morphTexture!==null||we.envMap!==Ne||W.fog===!0&&we.fog!==Se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Fe.numPlanes||we.numIntersection!==Fe.numIntersection)||we.vertexAlphas!==Ye||we.vertexTangents!==et||we.morphTargets!==Ue||we.morphNormals!==xt||we.morphColors!==Nt||we.toneMapping!==Dt||we.morphTargetsCount!==Qt||!!we.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(ot=!0):(ot=!0,we.__version=W.version);let yn=we.currentProgram;ot===!0&&(yn=Da(W,B,X),I&&W.isNodeMaterial&&I.onUpdateProgram(W,yn,we));let Gn=!1,Si=!1,ss=!1;const St=yn.getUniforms(),Ut=we.uniforms;if(y.useProgram(yn.program)&&(Gn=!0,Si=!0,ss=!0),W.id!==ae&&(ae=W.id,Si=!0),we.needsLights){const wt=ju(S.state.lightProbeGridArray,X);we.lightProbeGrid!==wt&&(we.lightProbeGrid=wt,Si=!0)}if(Gn||oe!==E){y.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),St.setValue(N,"projectionMatrix",E.projectionMatrix),St.setValue(N,"viewMatrix",E.matrixWorldInverse);const wi=St.map.cameraPosition;wi!==void 0&&wi.setValue(N,Pt.setFromMatrixPosition(E.matrixWorld)),R.logarithmicDepthBuffer&&St.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&St.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),oe!==E&&(oe=E,Si=!0,ss=!0)}if(we.needsLights&&(pn.state.directionalShadowMap.length>0&&St.setValue(N,"directionalShadowMap",pn.state.directionalShadowMap,Z),pn.state.spotShadowMap.length>0&&St.setValue(N,"spotShadowMap",pn.state.spotShadowMap,Z),pn.state.pointShadowMap.length>0&&St.setValue(N,"pointShadowMap",pn.state.pointShadowMap,Z)),X.isSkinnedMesh){St.setOptional(N,X,"bindMatrix"),St.setOptional(N,X,"bindMatrixInverse");const wt=X.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),St.setValue(N,"boneTexture",wt.boneTexture,Z))}X.isBatchedMesh&&(St.setOptional(N,X,"batchingTexture"),St.setValue(N,"batchingTexture",X._matricesTexture,Z),St.setOptional(N,X,"batchingIdTexture"),St.setValue(N,"batchingIdTexture",X._indirectTexture,Z),St.setOptional(N,X,"batchingColorTexture"),X._colorsTexture!==null&&St.setValue(N,"batchingColorTexture",X._colorsTexture,Z));const bi=Y.morphAttributes;if((bi.position!==void 0||bi.normal!==void 0||bi.color!==void 0)&&D.update(X,Y,yn),(Si||we.receiveShadow!==X.receiveShadow)&&(we.receiveShadow=X.receiveShadow,St.setValue(N,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&B.environment!==null&&(Ut.envMapIntensity.value=B.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=pM()),Si){if(St.setValue(N,"toneMappingExposure",C.toneMappingExposure),we.needsLights&&ef(Ut,ss),Se&&W.fog===!0&&De.refreshFogUniforms(Ut,Se),De.refreshMaterialUniforms(Ut,W,re,ue,S.state.transmissionRenderTarget[E.id]),we.needsLights&&we.lightProbeGrid){const wt=we.lightProbeGrid;Ut.probesSH.value=wt.texture,Ut.probesMin.value.copy(wt.boundingBox.min),Ut.probesMax.value.copy(wt.boundingBox.max),Ut.probesResolution.value.copy(wt.resolution)}Tr.upload(N,kl(we),Ut,Z)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Tr.upload(N,kl(we),Ut,Z),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&St.setValue(N,"center",X.center),St.setValue(N,"modelViewMatrix",X.modelViewMatrix),St.setValue(N,"normalMatrix",X.normalMatrix),St.setValue(N,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const wt=W.uniformsGroups;for(let wi=0,as=wt.length;wi<as;wi++){const zl=wt[wi];ie.update(zl,yn),ie.bind(zl,yn)}}return yn}function ef(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function tf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(E,B,Y){const W=q.get(E);W.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),q.get(E.texture).__webglTexture=B,q.get(E.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:Y,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,B){const Y=q.get(E);Y.__webglFramebuffer=B,Y.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,Y=0){Q=E,$=B,V=Y;let W=null,X=!1,Se=!1;if(E){const ye=q.get(E);if(ye.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(N.FRAMEBUFFER,ye.__webglFramebuffer),me.copy(E.viewport),ce.copy(E.scissor),Ke=E.scissorTest,y.viewport(me),y.scissor(ce),y.setScissorTest(Ke),ae=-1;return}else if(ye.__webglFramebuffer===void 0)Z.setupRenderTarget(E);else if(ye.__hasExternalTextures)Z.rebindTextures(E,q.get(E.texture).__webglTexture,q.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ye=E.depthTexture;if(ye.__boundDepthTexture!==Ye){if(Ye!==null&&q.has(Ye)&&(E.width!==Ye.image.width||E.height!==Ye.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(E)}}const Ce=E.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(Se=!0);const Ne=q.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ne[B])?W=Ne[B][Y]:W=Ne[B],X=!0):E.samples>0&&Z.useMultisampledRTT(E)===!1?W=q.get(E).__webglMultisampledFramebuffer:Array.isArray(Ne)?W=Ne[Y]:W=Ne,me.copy(E.viewport),ce.copy(E.scissor),Ke=E.scissorTest}else me.copy(de).multiplyScalar(re).floor(),ce.copy(Ae).multiplyScalar(re).floor(),Ke=Te;if(Y!==0&&(W=O),y.bindFramebuffer(N.FRAMEBUFFER,W)&&y.drawBuffers(E,W),y.viewport(me),y.scissor(ce),y.setScissorTest(Ke),X){const ye=q.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,ye.__webglTexture,Y)}else if(Se){const ye=B;for(let Ce=0;Ce<E.textures.length;Ce++){const Ne=q.get(E.textures[Ce]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ce,Ne.__webglTexture,Y,ye)}}else if(E!==null&&Y!==0){const ye=q.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ye.__webglTexture,Y)}ae=-1},this.readRenderTargetPixels=function(E,B,Y,W,X,Se,Ee,ye=0){if(!(E&&E.isWebGLRenderTarget)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce){y.bindFramebuffer(N.FRAMEBUFFER,Ce);try{const Ne=E.textures[ye],Ye=Ne.format,et=Ne.type;if(E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ye),!R.textureFormatReadable(Ye)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(et)){Ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-W&&Y>=0&&Y<=E.height-X&&N.readPixels(B,Y,W,X,_e.convert(Ye),_e.convert(et),Se)}finally{const Ne=Q!==null?q.get(Q).__webglFramebuffer:null;y.bindFramebuffer(N.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(E,B,Y,W,X,Se,Ee,ye=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce)if(B>=0&&B<=E.width-W&&Y>=0&&Y<=E.height-X){y.bindFramebuffer(N.FRAMEBUFFER,Ce);const Ne=E.textures[ye],Ye=Ne.format,et=Ne.type;if(E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ye),!R.textureFormatReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ue=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ue),N.bufferData(N.PIXEL_PACK_BUFFER,Se.byteLength,N.STREAM_READ),N.readPixels(B,Y,W,X,_e.convert(Ye),_e.convert(et),0);const xt=Q!==null?q.get(Q).__webglFramebuffer:null;y.bindFramebuffer(N.FRAMEBUFFER,xt);const Nt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Gf(N,Nt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ue),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Se),N.deleteBuffer(Ue),N.deleteSync(Nt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,B=null,Y=0){const W=Math.pow(2,-Y),X=Math.floor(E.image.width*W),Se=Math.floor(E.image.height*W),Ee=B!==null?B.x:0,ye=B!==null?B.y:0;Z.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,Y,0,0,Ee,ye,X,Se),y.unbindTexture()},this.copyTextureToTexture=function(E,B,Y=null,W=null,X=0,Se=0){let Ee,ye,Ce,Ne,Ye,et,Ue,xt,Nt;const Dt=E.isCompressedTexture?E.mipmaps[Se]:E.image;if(Y!==null)Ee=Y.max.x-Y.min.x,ye=Y.max.y-Y.min.y,Ce=Y.isBox3?Y.max.z-Y.min.z:1,Ne=Y.min.x,Ye=Y.min.y,et=Y.isBox3?Y.min.z:0;else{const Ut=Math.pow(2,-X);Ee=Math.floor(Dt.width*Ut),ye=Math.floor(Dt.height*Ut),E.isDataArrayTexture?Ce=Dt.depth:E.isData3DTexture?Ce=Math.floor(Dt.depth*Ut):Ce=1,Ne=0,Ye=0,et=0}W!==null?(Ue=W.x,xt=W.y,Nt=W.z):(Ue=0,xt=0,Nt=0);const yt=_e.convert(B.format),Qt=_e.convert(B.type);let we;B.isData3DTexture?(Z.setTexture3D(B,0),we=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Z.setTexture2DArray(B,0),we=N.TEXTURE_2D_ARRAY):(Z.setTexture2D(B,0),we=N.TEXTURE_2D),y.activeTexture(N.TEXTURE0),y.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),y.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),y.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const pn=y.getParameter(N.UNPACK_ROW_LENGTH),ot=y.getParameter(N.UNPACK_IMAGE_HEIGHT),yn=y.getParameter(N.UNPACK_SKIP_PIXELS),Gn=y.getParameter(N.UNPACK_SKIP_ROWS),Si=y.getParameter(N.UNPACK_SKIP_IMAGES);y.pixelStorei(N.UNPACK_ROW_LENGTH,Dt.width),y.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Dt.height),y.pixelStorei(N.UNPACK_SKIP_PIXELS,Ne),y.pixelStorei(N.UNPACK_SKIP_ROWS,Ye),y.pixelStorei(N.UNPACK_SKIP_IMAGES,et);const ss=E.isDataArrayTexture||E.isData3DTexture,St=B.isDataArrayTexture||B.isData3DTexture;if(E.isDepthTexture){const Ut=q.get(E),bi=q.get(B),wt=q.get(Ut.__renderTarget),wi=q.get(bi.__renderTarget);y.bindFramebuffer(N.READ_FRAMEBUFFER,wt.__webglFramebuffer),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,wi.__webglFramebuffer);for(let as=0;as<Ce;as++)ss&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,q.get(E).__webglTexture,X,et+as),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,q.get(B).__webglTexture,Se,Nt+as)),N.blitFramebuffer(Ne,Ye,Ee,ye,Ue,xt,Ee,ye,N.DEPTH_BUFFER_BIT,N.NEAREST);y.bindFramebuffer(N.READ_FRAMEBUFFER,null),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(X!==0||E.isRenderTargetTexture||q.has(E)){const Ut=q.get(E),bi=q.get(B);y.bindFramebuffer(N.READ_FRAMEBUFFER,K),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,k);for(let wt=0;wt<Ce;wt++)ss?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ut.__webglTexture,X,et+wt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ut.__webglTexture,X),St?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,bi.__webglTexture,Se,Nt+wt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,bi.__webglTexture,Se),X!==0?N.blitFramebuffer(Ne,Ye,Ee,ye,Ue,xt,Ee,ye,N.COLOR_BUFFER_BIT,N.NEAREST):St?N.copyTexSubImage3D(we,Se,Ue,xt,Nt+wt,Ne,Ye,Ee,ye):N.copyTexSubImage2D(we,Se,Ue,xt,Ne,Ye,Ee,ye);y.bindFramebuffer(N.READ_FRAMEBUFFER,null),y.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else St?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(we,Se,Ue,xt,Nt,Ee,ye,Ce,yt,Qt,Dt.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(we,Se,Ue,xt,Nt,Ee,ye,Ce,yt,Dt.data):N.texSubImage3D(we,Se,Ue,xt,Nt,Ee,ye,Ce,yt,Qt,Dt):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Se,Ue,xt,Ee,ye,yt,Qt,Dt.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Se,Ue,xt,Dt.width,Dt.height,yt,Dt.data):N.texSubImage2D(N.TEXTURE_2D,Se,Ue,xt,Ee,ye,yt,Qt,Dt);y.pixelStorei(N.UNPACK_ROW_LENGTH,pn),y.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ot),y.pixelStorei(N.UNPACK_SKIP_PIXELS,yn),y.pixelStorei(N.UNPACK_SKIP_ROWS,Gn),y.pixelStorei(N.UNPACK_SKIP_IMAGES,Si),Se===0&&B.generateMipmaps&&N.generateMipmap(we),y.unbindTexture()},this.initRenderTarget=function(E){q.get(E).__webglFramebuffer===void 0&&Z.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Z.setTextureCube(E,0):E.isData3DTexture?Z.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Z.setTexture2DArray(E,0):Z.setTexture2D(E,0),y.unbindTexture()},this.resetState=function(){$=0,V=0,Q=null,y.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}function Je(i){const e=i.replace(/^\/+/,""),t="/golf-cart-hero/";return t.endsWith("/")?`${t}${e}`:`${t}/${e}`}const od={yamaha:Je("assets/carts/game/yamaha-opentop.png"),evolution:Je("assets/carts/game/evolution-opentop.png"),hotrod:Je("assets/carts/game/hotrod-opentop.png")};function gM(i){const e=document.createElement("canvas");e.width=i.naturalWidth||i.width,e.height=i.naturalHeight||i.height;const t=e.getContext("2d",{willReadFrequently:!0});t.drawImage(i,0,0);const n=t.getImageData(0,0,e.width,e.height),s=n.data;for(let r=0;r<s.length;r+=4){const o=s[r],c=s[r+1],l=s[r+2],h=s[r+3];if(h<8)continue;const d=c-Math.max(o,l);if(c>90&&d>30){const u=d>65?0:Math.max(0,1-(d-30)/35);s[r+3]=Math.min(h,Math.round(u*255))}}t.putImageData(n,0,0);const a=new Vs(e);return a.colorSpace=_t,a.anisotropy=8,a.needsUpdate=!0,a}function xM(i){return new Promise((e,t)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>e(n),n.onerror=()=>t(new Error(`Failed to load ${i}`)),n.src=i})}async function _M(){const i={},e=Object.keys(od);return await Promise.all(e.map(async t=>{const n=od[t];if(n)try{const s=await xM(n);i[t]=gM(s)}catch(s){console.warn(`[cartSprites] ${t} failed`,s)}})),i}const Uo={asphalt:Je("assets/textures/terrain/asphalt.jpg"),grass:Je("assets/textures/terrain/grass.jpg"),fairway:Je("assets/textures/terrain/fairway.jpg"),sidewalk:Je("assets/textures/terrain/sidewalk.jpg"),water:Je("assets/textures/terrain/water.jpg"),curb:Je("assets/textures/terrain/curb.jpg"),stucco:Je("assets/textures/buildings/stucco.jpg"),roof:Je("assets/textures/buildings/roof_terracotta.jpg"),woodDoor:Je("assets/textures/buildings/wood_door.jpg"),glass:Je("assets/textures/buildings/glass.jpg"),palmBark:Je("assets/textures/foliage/palm_bark.jpg"),palmBarkAlt:Je("assets/textures/foliage/palm_bark_alt.jpg"),palmFrond:Je("assets/textures/foliage/palm_frond.jpg"),cartYamaha:Je("assets/textures/carts/paint_yamaha.jpg"),cartEvolution:Je("assets/textures/carts/paint_evolution.jpg"),cartHotrod:Je("assets/textures/carts/paint_hotrod.jpg")};function Wn(i,e=.85,t=.15){return new ct({color:i,roughness:e,metalness:t})}function Ct(i,e,t={}){const n=new ct({color:t.color??"#ffffff",roughness:t.rough??.85,metalness:t.metal??.12,transparent:t.transparent??!1,opacity:t.opacity??1});if(i){const s=i.clone();s.wrapS=s.wrapT=Oi;const a=t.repeat??1;s.repeat.set(a,a),s.colorSpace=_t,s.needsUpdate=!0,n.map=s}else n.color=new Le(e);return n}function MM(i,e=1){return i.wrapS=i.wrapT=Oi,i.repeat.set(e,e),i.colorSpace=_t,i.anisotropy=8,i.needsUpdate=!0,i}async function vM(){const i=new xl,e={},{loadHazardSprites:t}=await Hl(async()=>{const{loadHazardSprites:r}=await Promise.resolve().then(()=>Ov);return{loadHazardSprites:r}},void 0),{loadCartGlbs:n}=await Hl(async()=>{const{loadCartGlbs:r}=await Promise.resolve().then(()=>Sy);return{loadCartGlbs:r}},void 0);let s={};await Promise.all([...Object.keys(Uo).map(r=>new Promise(o=>{i.load(Uo[r],c=>{e[r]=MM(c,1),o()},void 0,()=>{console.warn(`[assets] Failed to load ${Uo[r]}`),o()})})),t().catch(r=>{console.warn("[assets] Hazard sprites failed",r)}),_M().then(r=>{s=r}).catch(r=>{console.warn("[assets] Cart photo sprites failed",r)}),n().catch(r=>{console.warn("[assets] Cart GLB models failed",r)})]);const a=bu(e);return{textures:e,materials:a,cartSprites:s,ready:!0}}function bu(i){const e=i;return{asphalt:Ct(e.asphalt,"#5a6270",{rough:.88,metal:.15,repeat:8,color:"#e8e8ea"}),asphaltDark:Ct(e.asphalt,"#4a515a",{rough:.9,metal:.12,repeat:10,color:"#d0d0d4"}),grass:Ct(e.grass,"#45a862",{rough:.92,metal:.04,repeat:14,color:"#d8f0d0"}),grassDeep:Ct(e.grass,"#2f8a50",{rough:.92,metal:.04,repeat:18,color:"#b0e0b0"}),fairway:Ct(e.fairway,"#55c878",{rough:.88,metal:.04,repeat:10,color:"#d0f5d8"}),sidewalk:Ct(e.sidewalk,"#e0d8cc",{rough:.86,metal:.08,repeat:6,color:"#fff8f0"}),water:Ct(e.water,"#3ab0d8",{rough:.1,metal:.5,repeat:4,transparent:!0,opacity:.88,color:"#c8f0ff"}),curb:Ct(e.curb,"#48a868",{rough:.82,metal:.08,repeat:4,color:"#d0f0d0"}),stucco:Ct(e.stucco,"#f5ecde",{rough:.88,metal:.06,repeat:3,color:"#fffaf2"}),stuccoAlt:Ct(e.stucco,"#f0e6d6",{rough:.88,metal:.06,repeat:3.5,color:"#fff6ea"}),roof:Ct(e.roof,"#d06050",{rough:.78,metal:.12,repeat:4,color:"#ffe0d8"}),roofBlue:Ct(e.roof,"#4a8aaa",{rough:.78,metal:.12,repeat:4,color:"#a0c8e8"}),roofGreen:Ct(e.roof,"#3d8a5a",{rough:.78,metal:.12,repeat:4,color:"#90d0a0"}),woodDoor:Ct(e.woodDoor,"#6b4a32",{rough:.8,metal:.1,repeat:1.5}),glass:Ct(e.glass,"#7ec8e8",{rough:.15,metal:.65,repeat:1,transparent:!0,opacity:.75}),palmBark:Ct(e.palmBark??e.palmBarkAlt,"#8b5a2b",{rough:.92,metal:.05,repeat:2}),palmFrond:Ct(e.palmFrond,"#1f6b4a",{rough:.88,metal:.05,repeat:2}),palmFrondLite:Ct(e.palmFrond,"#2a8a4a",{rough:.88,metal:.05,repeat:2.5,color:"#d0f0d0"}),cartPaint:{yamaha:Ct(e.cartYamaha,"#2f6f4e",{rough:.35,metal:.45,repeat:2}),evolution:Ct(e.cartEvolution,"#3aa6c9",{rough:.32,metal:.5,repeat:2}),hotrod:Ct(e.cartHotrod,"#e85d4c",{rough:.3,metal:.55,repeat:2})},line:Wn("#f4f4f0",.45,.35),center:Wn("#f0c93a",.45,.35),sand:Wn("#e8d5a8",.9,.1),plaza:Wn("#e8dcc8",.85,.15),parking:Wn("#6b7582",.85,.25),lamp:Wn("#e8e0c8",.3,.7),cloud:Wn("#ffffff",.95,.05),hedge:Wn("#2d6b3a",.95,.08),driveway:Ct(e.sidewalk,"#9a958c",{rough:.9,metal:.1,repeat:2}),fence:Wn("#c4b49a",.85,.12),shrub:Wn("#3d8a4a",.95,.08),window:Ct(e.glass,"#7ec8e8",{rough:.2,metal:.55,repeat:1,transparent:!0,opacity:.8}),door:Ct(e.woodDoor,"#6b4a32",{rough:.8,metal:.1,repeat:1})}}function yM(){return bu({})}const Sl=[{amountUsd:1,label:"Cart-path tip",blurb:"Red supporter flag",flagColor:"#c62828",flagName:"Red"},{amountUsd:3,label:"Happy-hour tip",blurb:"Blue supporter flag",flagColor:"#1e88e5",flagName:"Blue"},{amountUsd:5,label:"Lanai legend tip",blurb:"Gold supporter flag",flagColor:"#d4af37",flagName:"Gold"}],wu="vgch-donation-highest-usd",cd="vgch-donation-sessions";function SM(i){return Sl.find(e=>e.amountUsd===i)?.flagColor??"#c62828"}function ld(i){return Sl.find(e=>e.amountUsd===i)?.flagName??"Red"}function bl(i){return i===1||i===3||i===5}function ns(){try{const i=localStorage.getItem(wu);if(!i)return null;const e=Number(i);return bl(e)?e:null}catch{return null}}function bM(i){if(!bl(i))return ns();const e=ns(),t=e==null?i:Math.max(e,i);try{localStorage.setItem(wu,String(t))}catch{}return t}function wM(i){if(!i)return!1;try{const e=JSON.parse(localStorage.getItem(cd)||"[]");if(e.includes(i))return!1;for(e.push(i);e.length>40;)e.shift();return localStorage.setItem(cd,JSON.stringify(e)),!0}catch{return!0}}function wl(i){return"/golf-cart-hero/".includes("golf-cart-hero")?`/api/golf-cart-hero/donate/${i}`:`/api/donate/${i}`}async function TM(i){try{const e=await fetch(wl("checkout"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amountUsd:i})}),t=await e.json();return!e.ok||!t.url?{error:t.error||"Could not start checkout"}:{url:t.url}}catch{return{error:"Could not reach the tip server. Run the game with `npm run dev` and set STRIPE_SECRET_KEY in .env.local."}}}async function EM(i){try{const e=await fetch(wl("confirm"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:i})}),t=await e.json();if(!e.ok)return{ok:!1,error:t.error||"Could not verify tip"};const n=t.amountUsd;let s=null;return typeof n=="number"&&bl(n)&&(wM(i)?s=bM(n):s=ns()),{ok:!0,amountUsd:n,tier:s,message:t.message||"Thanks for the tip!"}}catch{return{ok:!1,error:"Could not verify tip with the server."}}}async function AM(){try{const i=await fetch(wl("status"));return i.ok?!!(await i.json()).ready:!1}catch{return!1}}function fa(){try{if(new URLSearchParams(window.location.search).get("native")==="1")return!0}catch{}return/GolfCartHeroNative|VillagesEverythingApp/i.test(navigator.userAgent||"")}const Tl="vgch-control-settings",RM=.4,CM=2,Oc={steerSens:1,driveSens:1},kc=1,Ra=10,Qi=5;let Ui=PM();function Bc(i){return Number.isFinite(i)?Math.min(CM,Math.max(RM,i)):1}function Tu(i){return{steerSens:Bc(i.steerSens),driveSens:Bc(i.driveSens)}}function PM(){try{const i=localStorage.getItem(Tl);if(!i)return{...Oc};const e=JSON.parse(i);return Tu({steerSens:e.steerSens??1,driveSens:e.driveSens??1})}catch{return{...Oc}}}function xa(){return Ui}function IM(i){Ui=Tu({...Ui,...i});try{localStorage.setItem(Tl,JSON.stringify(Ui))}catch{}return Ui}function hd(){Ui={...Oc};try{localStorage.setItem(Tl,JSON.stringify(Ui))}catch{}return Ui}function LM(i){const e=Math.min(Ra,Math.max(kc,Math.round(i)));return e<=Qi?.45+(e-1)*(1-.45)/(Qi-1):1+(e-Qi)*1/(Ra-Qi)}function dd(i){const e=Bc(i);return e<=1?Math.round(1+(e-.45)*(Qi-1)/(1-.45)):Math.round(Qi+(e-1)*(Ra-Qi)/1)}function Fo(i){return i<=2?"Gentle":i<=4?"Soft":i===5?"Default":i<=7?"Snappy":"Twitchy"}const DM=2,NM=13,UM=2,FM=10,OM=9,kM=.7;function ud(){const i=window.screen?.orientation?.angle;if(typeof i=="number"){const t=(Math.round(i/90)*90%360+360)%360;return t===90||t===180||t===270?t:0}const e=window.orientation;return e===90?90:e===-90||e===270?270:e===180?180:window.innerWidth>window.innerHeight?90:0}function BM(i,e,t){switch(t){case 90:return{roll:i,pitch:-e};case 180:return{roll:-e,pitch:-i};case 270:return{roll:-i,pitch:e};default:return{roll:e,pitch:i}}}function zM(i,e,t,n){let s=i,a=e;const r=t;n===90?(s=e,a=-i):n===180?(s=-i,a=-e):n===270&&(s=-e,a=i);const o=Math.atan2(s,Math.hypot(a,r))*180/Math.PI,c=Math.atan2(a,Math.hypot(s,r))*180/Math.PI;return{roll:o,pitch:c}}function Oo(i,e,t){const n=Math.abs(i);if(n<=e)return 0;const s=Math.min(1,(n-e)/Math.max(1,t-e)),a=Math.pow(s,.72);return Math.sign(i)*a}function GM(){return/Android/i.test(navigator.userAgent||"")}function Er(){if(typeof window>"u")return!1;if(fa()||GM())return!0;const i=window.matchMedia("(pointer: coarse)").matches,e=window.matchMedia("(hover: none)").matches;return(i||e)&&window.innerWidth<1100}class HM{steer=0;throttle=0;brake=0;available=!1;listening=!1;rawRoll=0;rawPitch=90;smoothRoll=0;smoothPitch=90;restRoll=0;restPitch=70;hasSample=!1;calibrating=!0;calibT=0;calibRoll=0;calibPitch=0;calibN=0;gotOrientation=!1;unsubs=[];get ready(){return this.hasSample}async start(){if(this.stop(),this.listening=!0,this.calibrating=!0,this.calibT=0,this.calibN=0,this.calibRoll=0,this.calibPitch=0,this.hasSample=!1,this.gotOrientation=!1,this.steer=0,this.throttle=0,this.brake=0,!await this.requestPermission())return this.listening=!1,!1;const t=r=>{if(r.beta==null||r.gamma==null)return;this.gotOrientation=!0;const o=BM(r.beta,r.gamma,ud());this.pushSample(o.roll,o.pitch)},n=r=>{if(this.gotOrientation)return;const o=r.accelerationIncludingGravity;if(!o||o.x==null||o.y==null||o.z==null)return;const c=zM(o.x,o.y,o.z,ud());this.pushSample(c.roll,c.pitch)};window.addEventListener("deviceorientation",t,!0),window.addEventListener("deviceorientationabsolute",t,!0),window.addEventListener("devicemotion",n,!0),this.unsubs.push(()=>{window.removeEventListener("deviceorientation",t,!0),window.removeEventListener("deviceorientationabsolute",t,!0),window.removeEventListener("devicemotion",n,!0)});const s=()=>this.recenter();window.addEventListener("orientationchange",s);const a=window.screen?.orientation;return a?.addEventListener?.("change",s),this.unsubs.push(()=>{window.removeEventListener("orientationchange",s),a?.removeEventListener?.("change",s)}),this.available=!0,!0}stop(){this.listening=!1,this.steer=0,this.throttle=0,this.brake=0;for(const e of this.unsubs)e();this.unsubs=[]}recenter(){this.calibrating=!0,this.calibT=0,this.calibN=0,this.calibRoll=0,this.calibPitch=0,this.steer=0,this.throttle=0,this.brake=0,this.hasSample&&(this.restRoll=this.smoothRoll,this.restPitch=this.smoothPitch)}update(e){if(!this.listening||!this.hasSample){this.steer=0,this.throttle=0,this.brake=0;return}const t=1-Math.exp(-26*e);if(this.smoothRoll+=(this.rawRoll-this.smoothRoll)*t,this.smoothPitch+=(this.rawPitch-this.smoothPitch)*t,this.calibrating)if(this.calibT+=e,this.calibRoll+=this.smoothRoll,this.calibPitch+=this.smoothPitch,this.calibN+=1,this.calibT>=kM&&this.calibN>4)this.restRoll=this.calibRoll/this.calibN,this.restPitch=this.calibPitch/this.calibN,this.calibrating=!1;else{this.steer=0,this.throttle=0,this.brake=0;return}const n=this.smoothRoll-this.restRoll,s=this.smoothPitch-this.restPitch,{steerSens:a,driveSens:r}=xa(),o=NM/a,c=Math.max(.55,DM/Math.sqrt(a)),l=FM/r,h=OM/r,d=Math.max(.55,UM/Math.sqrt(r));this.steer=Oo(n,c,o);const u=Oo(-s,d,l),f=Oo(s,d,h);this.throttle=Math.max(0,u),this.brake=Math.max(0,f)}pushSample(e,t){!Number.isFinite(e)||!Number.isFinite(t)||(this.rawRoll=e,this.rawPitch=t,this.hasSample||(this.smoothRoll=e,this.smoothPitch=t,this.hasSample=!0))}async requestPermission(){try{const e=DeviceOrientationEvent;if(typeof e.requestPermission=="function"&&await e.requestPermission()!=="granted")return!1;const t=DeviceMotionEvent;if(typeof t.requestPermission=="function")try{await t.requestPermission()}catch{}return!0}catch{return!1}}}class VM{state={throttle:!1,brake:!1,left:!1,right:!1,fire:!1,gate:!1,pause:!1};enabled=!1;tilt=new HM;pausePressed=!1;firePressed=!1;gatePressed=!1;constructor(){window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}destroy(){this.tilt.stop(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp)}get steerAxis(){return this.state.left&&!this.state.right?-1:this.state.right&&!this.state.left?1:this.state.left&&this.state.right?0:this.tilt.steer}get throttleAmount(){return this.state.throttle?1:this.tilt.throttle}get brakeAmount(){return this.state.brake?1:this.tilt.brake}update(e){this.tilt.update(e)}async startTilt(){return this.tilt.start()}stopTilt(){this.tilt.stop()}recenterTilt(){this.tilt.recenter()}isTypingTarget(e){if(!(e instanceof HTMLElement))return!1;const t=e.tagName;if(t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.isContentEditable)return!0;const n=document.activeElement;if(n instanceof HTMLElement){const s=n.tagName;if(s==="INPUT"||s==="TEXTAREA"||s==="SELECT"||n.isContentEditable)return!0}return!1}onKeyDown=e=>{if(!(!this.enabled||this.isTypingTarget(e.target))&&!e.repeat)switch(e.code){case"ArrowUp":case"KeyW":this.state.throttle=!0,e.preventDefault();break;case"ArrowDown":case"KeyS":this.state.brake=!0,e.preventDefault();break;case"ArrowLeft":case"KeyA":this.state.left=!0,e.preventDefault();break;case"ArrowRight":case"KeyD":this.state.right=!0,e.preventDefault();break;case"Space":case"KeyE":case"KeyF":this.state.fire=!0,this.firePressed=!0,e.preventDefault();break;case"KeyG":this.state.gate=!0,this.gatePressed=!0,e.preventDefault();break;case"Escape":case"KeyP":this.pausePressed=!0,e.preventDefault();break}};onKeyUp=e=>{switch(e.code){case"ArrowUp":case"KeyW":this.state.throttle=!1;break;case"ArrowDown":case"KeyS":this.state.brake=!1;break;case"ArrowLeft":case"KeyA":this.state.left=!1;break;case"ArrowRight":case"KeyD":this.state.right=!1;break;case"Space":case"KeyE":case"KeyF":this.state.fire=!1;break;case"KeyG":this.state.gate=!1;break}};set(e){e.fire===!0&&(this.firePressed=!0),e.gate===!0&&(this.gatePressed=!0),Object.assign(this.state,e)}consumeFire(){return this.enabled&&this.firePressed?(this.firePressed=!1,!0):!1}consumePause(){return this.pausePressed?(this.pausePressed=!1,!0):!1}consumeGatePass(){return this.enabled&&this.gatePressed?(this.gatePressed=!1,!0):!1}reset(){this.state={throttle:!1,brake:!1,left:!1,right:!1,fire:!1,gate:!1,pause:!1},this.pausePressed=!1,this.firePressed=!1,this.gatePressed=!1}}const fd={"spanish-springs":{areaId:"spanish-springs",src:Je("assets/music/spanish-springs-full.mp3"),title:"Flamenco Melody",artist:"JCZA",vibe:"Spanish guitar · plaza nights"},"lake-sumter":{areaId:"lake-sumter",src:Je("assets/music/lake-sumter-full.mp3"),title:"Dimensions in Blue",artist:"USAF Band of the West · Dimensions in Blue",vibe:"Lakeside big-band jazz"},brownwood:{areaId:"brownwood",src:Je("assets/music/brownwood-full.mp3"),title:"The Great One Step",artist:"Victor Dance Orchestra (public domain)",vibe:"Old-time dance · paddock energy"},eastport:{areaId:"eastport",src:Je("assets/music/eastport-full.mp3"),title:"BugaBlue",artist:"US Army Blues",vibe:"Mid-century blues · pavilion cool"},"sawgrass-grove":{areaId:"sawgrass-grove",src:Je("assets/music/sawgrass-grove-full.mp3"),title:"Bossa Nova Groove",artist:"Play-along bossa (Wikimedia Commons)",vibe:"Citrus grove · easy bossa"}},pd=.52;class WM{audio=null;currentArea=null;unlocked=!1;muted=!1;preferredOn=!0;ctx=null;constructor(){this.muted=!1,this.preferredOn=!0;try{localStorage.removeItem("vgch-music-muted"),localStorage.removeItem("vgch-music-off")}catch{}}isMuted(){return this.muted||!this.preferredOn}unlock(){this.unlocked=!0,this.resumeContext(),this.tryPlay()}setMuted(e){this.muted=e,this.preferredOn=!e;try{localStorage.setItem("vgch-music-muted",e?"1":"0"),localStorage.setItem("vgch-music-off",e?"1":"0")}catch{}this.audio&&(this.audio.muted=e,!e&&this.unlocked?this.tryPlay():this.audio.pause())}toggleMute(){return this.setMuted(!this.isMuted()),this.isMuted()}getTrack(e){return fd[e]??fd["spanish-springs"]}playForArea(e){return this.prepareForRace(e),this.startNow(),this.getTrack(e)}prepareForRace(e){this.unlocked=!0,this.resumeContext();const t=this.getTrack(e);if(this.currentArea===e&&this.audio){this.audio.volume=0,this.tryPlay();return}this.stop(),this.currentArea=e,this.audio=this.makePlayer(t.src),this.audio.volume=0,this.tryPlay()}startNow(){this.audio&&(this.audio.volume=pd,this.tryPlay())}makePlayer(e){const t=new Audio;return t.loop=!0,t.preload="auto",t.volume=pd,t.muted=this.muted||!this.preferredOn,t.setAttribute("playsinline","true"),t.setAttribute("webkit-playsinline","true"),t.style.display="none",document.body.appendChild(t),t.addEventListener("canplay",()=>this.tryPlay()),t.addEventListener("canplaythrough",()=>this.tryPlay()),t.addEventListener("error",()=>{console.warn("[music] failed to load",e,t.error)}),t.src=e,t.load(),t}resumeContext(){try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx||(this.ctx=new e),this.ctx.state==="suspended"&&this.ctx.resume()}catch{}}tryPlay(){if(!this.audio||!this.preferredOn||this.muted)return;const e=this.audio.play();e&&e.catch(t=>{console.warn("[music] play blocked",t),window.setTimeout(()=>{this.audio&&this.unlocked&&!this.muted&&this.audio.play().catch(()=>{})},250)})}stop(){this.audio&&(this.audio.pause(),this.audio.removeAttribute("src"),this.audio.load(),this.audio.remove(),this.audio=null),this.currentArea=null}}const Ca=new WM;class XM{ctx=null;lastAt={};unlock(){this.ensure()}countdown(e){const t=e>=3?392:e===2?440:494;this.beep(t,.11,"square",.09)}go(){this.beep(523,.1,"square",.1),this.beep(784,.22,"triangle",.12,.09)}fire(e){e==="fireball"?(this.sweep(220,90,.22,"sawtooth",.07),this.noise(.08,.04)):e==="loofah"?(this.beep(180,.14,"triangle",.08),this.beep(140,.16,"sine",.05,.04)):e==="bolt"?(this.beep(1240,.05,"square",.06),this.sweep(980,220,.16,"sawtooth",.05),this.noise(.05,.03)):(this.beep(880,.06,"square",.07),this.sweep(720,280,.12,"triangle",.05))}empty(){this.beep(160,.07,"square",.04)}pickup(){this.beep(523,.07,"triangle",.08),this.beep(659,.07,"triangle",.08,.06),this.beep(784,.12,"triangle",.09,.12)}gatePass(){this.beep(698,.08,"sine",.08),this.beep(880,.16,"sine",.09,.07)}gateMiss(){this.beep(196,.12,"square",.05)}gateThud(){this.gap("gate-thud",.35)&&(this.beep(70,.12,"sine",.12),this.noise(.05,.05))}hazard(){this.sweep(240,80,.22,"sawtooth",.08),this.noise(.1,.06)}tagged(){this.sweep(620,180,.18,"square",.07)}spinOut(){this.sweep(340,90,.32,"sawtooth",.08)}bump(){this.gap("bump",.4)&&(this.beep(110,.08,"triangle",.08),this.noise(.04,.04))}smash(){this.noise(.12,.07),this.beep(140,.1,"square",.05)}lap(){this.beep(659,.08,"triangle",.08),this.beep(880,.14,"triangle",.09,.07)}checkpoint(){this.beep(784,.08,"sine",.07),this.beep(988,.14,"sine",.08,.08)}finish(){this.beep(523,.1,"triangle",.1),this.beep(659,.1,"triangle",.1,.1),this.beep(784,.12,"triangle",.1,.2),this.beep(1046,.28,"triangle",.11,.32)}gap(e,t){const n=performance.now()/1e3;return(this.lastAt[e]??0)+t>n?!1:(this.lastAt[e]=n,!0)}ensure(){if(Ca.isMuted())return null;try{const e=window.AudioContext||window.webkitAudioContext;return e?(this.ctx||(this.ctx=new e),this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx):null}catch{return null}}beep(e,t,n,s,a=0){const r=this.ensure();if(!r)return;const o=r.currentTime+a,c=r.createOscillator(),l=r.createGain();c.type=n,c.frequency.setValueAtTime(e,o),l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s,o+.012),l.gain.exponentialRampToValueAtTime(1e-4,o+t),c.connect(l),l.connect(r.destination),c.start(o),c.stop(o+t+.02)}sweep(e,t,n,s,a){const r=this.ensure();if(!r)return;const o=r.currentTime,c=r.createOscillator(),l=r.createGain();c.type=s,c.frequency.setValueAtTime(e,o),c.frequency.exponentialRampToValueAtTime(Math.max(40,t),o+n),l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(a,o+.015),l.gain.exponentialRampToValueAtTime(1e-4,o+n),c.connect(l),l.connect(r.destination),c.start(o),c.stop(o+n+.02)}noise(e,t){const n=this.ensure();if(!n)return;const s=Math.floor(n.sampleRate*e),a=n.createBuffer(1,s,n.sampleRate),r=a.getChannelData(0);for(let d=0;d<s;d++)r[d]=Math.random()*2-1;const o=n.createBufferSource(),c=n.createGain(),l=n.createBiquadFilter();l.type="lowpass",l.frequency.value=1400,o.buffer=a;const h=n.currentTime;c.gain.setValueAtTime(t,h),c.gain.exponentialRampToValueAtTime(1e-4,h+e),o.connect(l),l.connect(c),c.connect(n.destination),o.start(h),o.stop(h+e+.02)}}const zt=new XM,zs=[{id:"yamaha",name:"Yamaha Drive2",shortName:"Yamaha",blurb:"Classic white Drive2 — open top, cream seats. Shoots golf balls.",color:"#f2f2f0",accent:"#1a1a1c",topSpeed:32,accel:18,handling:1.15,offRoadGrip:.42,emoji:"⛽",powerType:"gas"},{id:"evolution",name:"Evolution Cruiser",shortName:"Evolution",blurb:"Cyan electric cruiser — open top, orange rims. Shoots loofahs.",color:"#2ec4d6",accent:"#1a9aab",topSpeed:29,accel:22,handling:1.35,offRoadGrip:.48,emoji:"🔋",powerType:"electric"},{id:"hotrod",name:"Street Rod",shortName:"Hot Rod",blurb:"Blue/silver street rod — open top, chrome grille. Shoots fireballs.",color:"#2a6db5",accent:"#d8dde2",topSpeed:38,accel:19,handling:.95,offRoadGrip:.35,emoji:"🔥",powerType:"hotrod"},{id:"cybertruck",name:"Tesla Cybertruck",shortName:"Cybertruck",blurb:"Silver angular pickup — closed cabin, no driver shown. Shoots lightning bolts. Drive through lightning storms to recharge.",color:"#e4e8ee",accent:"#111111",topSpeed:40,accel:26,handling:.88,offRoadGrip:.62,emoji:"⚡",powerType:"electric"}];function qM(i){return zs.find(e=>e.id===i)??zs[0]}const Gs=[{id:"alligator",name:"Alligator Al",species:"American Alligator",emoji:"🐊",blurb:"Retention-pond royalty. Unfazed by water hazards — maybe a little too unfazed.",luck:1.05,color:"#2f6f4e"},{id:"turtle",name:"Shelly Slowlane",species:"Florida Softshell",emoji:"🐢",blurb:"Knows every crosswalk. Will NOT hit other turtles. Moral high ground included.",luck:1.1,color:"#5c8a4a"},{id:"manatee",name:"Mo the Manatee",species:"West Indian Manatee",emoji:"🦭",blurb:"Gentle giant energy. Bumper padding for days. Snack holder always stocked.",luck:1.08,color:"#7a8fa0"},{id:"armadillo",name:"Armie Armadillo",species:"Nine-banded Armadillo",emoji:"armadillo",blurb:"Armored for errant golf balls. Rolls through chaos like a lanai tank.",luck:1.12,color:"#8b7355"},{id:"raccoon",name:"Ricky Raccoon",species:"Florida Raccoon",emoji:"🦝",blurb:"Night-market strategist. Can smell a free sample from three villages away.",luck:1.06,color:"#5a5a62"},{id:"pelican",name:"Penny Pelican",species:"Brown Pelican",emoji:"pelican",blurb:"Aerial awareness of every square stage. Dive-bomb vibes, cart-path manners.",luck:1.07,color:"#3a4a5c"},{id:"ibis",name:"Ivy Ibis",species:"White Ibis",emoji:"🦢",blurb:"Lawn-party scout. That curved beak is pure square-side style.",luck:1.09,color:"#f0f0f0"},{id:"otter",name:"Otto Otter",species:"River Otter",emoji:"🦦",blurb:"Playful line-taker. Treats every roundabout like a waterslide.",luck:1.1,color:"#6b5344"}];function Ar(i){return i.emoji==="armadillo"?"🦔":i.emoji==="pelican"?"🐦":i.emoji}function YM(i){return Gs.find(e=>e.id===i)??Gs[0]}function $M(i){const e=Gs.filter(n=>!i.includes(n.id)),t=e.length?e:Gs;return t[Math.floor(Math.random()*t.length)]}const Rr={"golf-ball":{type:"golf-ball",name:"Errant Golf Ball",emoji:"⛳",scorePenalty:80,speedMul:.45,duration:1.2,radius:2.2,message:"FORE! Bonked by a Titleist!",color:"#ffffff",scale:1.2},turtle:{type:"turtle",name:"Road Turtle",emoji:"🐢",scorePenalty:120,speedMul:.35,duration:1.6,radius:2.4,message:"You hit a turtle! Shell of a mistake.",color:"#5c8a4a",scale:1.4},alligator:{type:"alligator",name:"Retention Pond Gator",emoji:"🐊",scorePenalty:150,speedMul:.3,duration:1.8,radius:3.2,message:"Gator chomp! Stay out of the ponds!",color:"#2f6f4e",scale:1.8},lightning:{type:"lightning",name:"Florida Lightning",emoji:"⚡",scorePenalty:100,speedMul:.25,duration:1.4,radius:3.6,message:"Lightning strike! Cart electronics fried.",color:"#c8d8f0",scale:1.35},wanderer:{type:"wanderer",name:"Tipsy Wanderer",emoji:"🥴",scorePenalty:140,speedMul:.4,duration:1.5,radius:2.2,message:"Near-miss with a square-night wanderer!",color:"#e85d4c",scale:1.5},cop:{type:"cop",name:"Cart Cop",emoji:"🚓",scorePenalty:200,speedMul:.2,duration:2.4,radius:2.8,message:"Ticket issued! Slow down, hot rod.",color:"#3a5a9a",scale:1.6},"porch-police":{type:"porch-police",name:"Porch Police",emoji:"👴",scorePenalty:60,speedMul:.5,duration:2,radius:2.5,message:`"SLOW DOWN!! This isn't Daytona!"`,color:"#8b7355",scale:1.5},"palm-frond":{type:"palm-frond",name:"Storm Fronds",emoji:"🌿",scorePenalty:70,speedMul:.42,duration:1.5,radius:2.6,message:"Palm fronds on the path! After the storm.",color:"#2f6b3a",scale:1.6},sinkhole:{type:"sinkhole",name:"Cart-Path Sinkhole",emoji:"🕳",scorePenalty:160,speedMul:0,duration:5,radius:3.4,message:"Sinkhole! You're stuck — wait it out.",color:"#e85d14",scale:2.4}},KM={alligator:!0,turtle:!0,wanderer:!0,cop:!0,"porch-police":!0,lightning:!0},zc={lat:28.88,lon:-81.98},ZM=110540,JM=111320*Math.cos(zc.lat*Math.PI/180),md=.12;function jM(i,e){return{x:(e-zc.lon)*JM*md,z:(i-zc.lat)*ZM*md}}const QM=[{id:"spanish-springs",name:"Spanish Springs Town Square",shortName:"Spanish Springs",kind:"town-square",lat:28.9404332,lon:-81.9503209,note:"OG southwest plaza · free outdoor bands",theme:"southwest"},{id:"lake-sumter",name:"Sumter Landing",shortName:"Sumter Landing",kind:"town-square",lat:28.9082192,lon:-81.9747144,note:"Lakeside boardwalk · lighthouse · coastal market",theme:"lakeside"},{id:"brownwood",name:"Brownwood Paddock Square",shortName:"Brownwood",kind:"town-square",lat:28.8444857,lon:-82.0221819,note:"Old Florida ranch square · south side",theme:"western"},{id:"eastport",name:"Eastport Town Square",shortName:"Eastport",kind:"town-square",lat:28.9125,lon:-81.928,note:"Mid-century European-American charm · Central Lake",theme:"midcentury"},{id:"sawgrass-grove",name:"Sawgrass Grove",shortName:"Sawgrass Grove",kind:"town-square",lat:28.7898509,lon:-81.9688595,note:"Orange-grove canopy · Market & Boxcar Stage",theme:"modern"},{id:"paradise",name:"Paradise Recreation",shortName:"Paradise",kind:"rec-center",lat:28.9345,lon:-81.9585,theme:"tuscan",note:"Tuscan villa regional complex"},{id:"la-hacienda",name:"La Hacienda Recreation",shortName:"La Hacienda",kind:"rec-center",lat:28.926,lon:-81.962,theme:"spanish"},{id:"lake-miona",name:"Lake Miona Recreation",shortName:"Lake Miona",kind:"rec-center",lat:28.8963356,lon:-81.9803263},{id:"colony-cottage",name:"Colony Cottage Recreation",shortName:"Colony Cottage",kind:"rec-center",lat:28.8661073,lon:-81.9613156},{id:"eisenhower",name:"Eisenhower Recreation",shortName:"Eisenhower",kind:"rec-center",lat:28.8481852,lon:-82.0149853},{id:"rohan",name:"Rohan Recreation",shortName:"Rohan",kind:"rec-center",lat:28.8249475,lon:-81.9716178},{id:"fenney",name:"Fenney Recreation",shortName:"Fenney",kind:"rec-center",lat:28.7960684,lon:-82.0384196},{id:"everglades",name:"Everglades Recreation",shortName:"Everglades",kind:"rec-center",lat:28.8044378,lon:-82.0070714},{id:"savannah",name:"Savannah Recreation",shortName:"Savannah",kind:"rec-center",lat:28.918,lon:-81.955},{id:"mulberry-grove",name:"Mulberry Grove Recreation",shortName:"Mulberry Grove",kind:"rec-center",lat:28.9,lon:-81.945},{id:"laurel-manor",name:"Laurel Manor Recreation",shortName:"Laurel Manor",kind:"rec-center",lat:28.89,lon:-81.99},{id:"seabreeze",name:"SeaBreeze Recreation",shortName:"SeaBreeze",kind:"rec-center",lat:28.875,lon:-81.97},{id:"olympia",name:"Olympia Recreation",shortName:"Olympia",kind:"rec-center",lat:28.905,lon:-81.915}],Rn=QM.map(i=>{const e=jM(i.lat,i.lon);return{id:i.id,name:i.name,shortName:i.shortName,kind:i.kind,x:e.x,y:e.z,lat:i.lat,lon:i.lon,note:i.note,theme:i.theme}});function ev(){let i=1/0,e=-1/0,t=1/0,n=-1/0;for(const a of Rn)i=Math.min(i,a.x),e=Math.max(e,a.x),t=Math.min(t,a.y),n=Math.max(n,a.y);const s=900;return{minX:i-s,maxX:e+s,minY:t-s,maxY:n+s,width:e-i+s*2,height:n-t+s*2}}const Kt=ev();Rn.filter(i=>i.kind==="town-square");Rn.filter(i=>i.kind==="rec-center");const Ds=[{id:"spanish-springs",name:"Spanish Springs",shortName:"Spanish Springs",blurb:"Original southwest plaza — adobe stucco, red-tile roofs, plaza fountain, and free outdoor-band nights on Main Street.",themeLine:"Spanish colonial · original square",area:"North Villages · 1120 Main Street energy",highlights:["Spanish colonial / southwest plaza architecture","Adobe stucco, viga vibes & terra-cotta roofs","Central fountain plaza & palm-lined walks","Near Sharon L. Morse Performing Arts Center","Nightly outdoor entertainment tradition"],recCenterIds:["paradise","la-hacienda","rohan"],squareLandmarkId:"spanish-springs",emoji:"🏜️",cardGradient:"linear-gradient(135deg, #c45c48 0%, #e8b84a 45%, #1f6b4a 100%)",theme:{skyTop:"#4a7ab0",skyMid:"#e8c48a",skyBottom:"#f5d9a8",fog:"#e8d4b0",grass:"#4a9a58",grassDeep:"#2f7a40",asphalt:"#5a5550",sidewalk:"#e8dcc8",curb:"#c45c48",water:"#3a9ab8",stucco:["#f0e0c8","#e8d4b0","#f5e8d0","#d4c4a8","#f8e8c8"],roof:"#c45c48",roofAlt:"#a84838",plaza:"#e8dcc0",accent:"#e8b84a",landmarkStyle:"southwest"}},{id:"lake-sumter",name:"Sumter Landing",shortName:"Sumter Landing",blurb:"Lakeside market square — lighthouse silhouette, boardwalk pastels, and golden-hour water on Lake Sumter.",themeLine:"Coastal market · lighthouse & boardwalk",area:"Central Villages · 1000 Lake Sumter Landing",highlights:["Lighthouse landmark & waterfront market energy","Northeast seaside / Key West–inspired pastels","Gazebo plaza & boardwalk cart-path feel","Central hub of The Villages cart network","Lake views & marina-town storefronts"],recCenterIds:["lake-miona","laurel-manor","seabreeze","mulberry-grove"],squareLandmarkId:"lake-sumter",emoji:"🗼",cardGradient:"linear-gradient(135deg, #3aa6c9 0%, #7ec8e8 40%, #e8b84a 100%)",theme:{skyTop:"#3a8ec8",skyMid:"#8ec8e8",skyBottom:"#d8f0f8",fog:"#b8dce8",grass:"#3d9b5f",grassDeep:"#2a7a48",asphalt:"#4a5562",sidewalk:"#e0e8e8",curb:"#3aa6c9",water:"#2a90b8",stucco:["#f0f4f8","#e0ecf0","#d0e0e8","#f8f0e8","#c8e0f0"],roof:"#4a7a9a",roofAlt:"#c47848",plaza:"#e8f0f4",accent:"#3aa6c9",landmarkStyle:"lighthouse"}},{id:"brownwood",name:"Brownwood Paddock Square",shortName:"Brownwood",blurb:"Old Florida ranch square — 1800s cattle-country western flair, rustic storefronts, windmills, and paddock energy.",themeLine:"Old West · Florida ranch heritage",area:"South Villages · 2705 W Torch Lake Drive",highlights:["Old World Florida / cattle-hunter heritage","Barn-style & false-front western shops","Windmill, water-tower & paddock vibes","South-side main stage for live bands","Rustic wood tones & cowboy décor"],recCenterIds:["eisenhower","colony-cottage","fenney"],squareLandmarkId:"brownwood",emoji:"🤠",cardGradient:"linear-gradient(135deg, #8b5a2b 0%, #c47848 40%, #e8b84a 100%)",theme:{skyTop:"#5a7a9a",skyMid:"#d4a86a",skyBottom:"#e8d0a0",fog:"#e0c898",grass:"#6a9a48",grassDeep:"#4a7a30",asphalt:"#5a5048",sidewalk:"#d8c8a8",curb:"#8b5a2b",water:"#4a8a78",stucco:["#e8d8c0","#d0b890","#c4a878","#f0e4c8","#b89868"],roof:"#6b4030",roofAlt:"#8b5a2b",plaza:"#d8c8a0",accent:"#c47848",landmarkStyle:"western"}},{id:"eastport",name:"Eastport",shortName:"Eastport",blurb:"Eastern social hub — European-inspired mid-century charm, open plazas, and Art Deco pavilion energy around Central Lake.",themeLine:"Mid-century · European-American charm",area:"East Villages · Central Lake / Morse corridor",highlights:["European-inspired architecture with mid-century touches","Art Deco / pavilion plazas (no Old West or Key West)","Open lake-adjacent gathering energy","Near Olympia Rec & eastern cart paths","Newest full square lifestyle hub"],recCenterIds:["savannah","mulberry-grove","olympia"],squareLandmarkId:"eastport",emoji:"🏛️",cardGradient:"linear-gradient(135deg, #5a7a9a 0%, #e8b84a 50%, #e85d4c 100%)",theme:{skyTop:"#5a8ab8",skyMid:"#b0c8d8",skyBottom:"#f0e8d8",fog:"#d0dce8",grass:"#48a060",grassDeep:"#308048",asphalt:"#4a5058",sidewalk:"#e8e4dc",curb:"#5a7a9a",water:"#4890b0",stucco:["#f8f0e8","#e8e0d0","#d8d0c0","#f0e8d8","#c8d0d8"],roof:"#5a6a7a",roofAlt:"#e85d4c",plaza:"#ece8e0",accent:"#e8b84a",landmarkStyle:"midcentury"}},{id:"sawgrass-grove",name:"Sawgrass Grove",shortName:"Sawgrass Grove",blurb:"Orange-grove canopy & Market food hall — Boxcar Stage nights, golf-adjacent greens, and modern SE Florida gathering energy.",themeLine:"Citrus canopy · Market & Boxcar Stage",area:"Southeast Villages · 766 Marilee Place",highlights:["Orange grove–inspired canopy & open-air Market","Boxcar Stage free live entertainment","Golf shop / Southern Oaks adjacent lifestyle","Modern Florida greens & multi-use plaza","Newest SE cart-path social loop"],recCenterIds:["everglades","fenney","olympia"],squareLandmarkId:"sawgrass-grove",emoji:"🍊",cardGradient:"linear-gradient(135deg, #1f6b4a 0%, #3aa6c9 50%, #e8b84a 100%)",theme:{skyTop:"#3a90b8",skyMid:"#90d0b0",skyBottom:"#d8f0d8",fog:"#b8e0c8",grass:"#3d9b5f",grassDeep:"#1f6b4a",asphalt:"#4a5560",sidewalk:"#e0ebe4",curb:"#1f6b4a",water:"#2a98b0",stucco:["#f0f8f4","#e0f0e8","#d0e8d8","#f8fff8","#c8e8d0"],roof:"#3d7a5a",roofAlt:"#4a7a9a",plaza:"#e4f0e8",accent:"#f0a830",landmarkStyle:"modern"}}];function _a(i){return Ds.find(e=>e.id===i)??Ds[0]}const zr=[{id:"lanai-learner",name:"Lanai Learner",blurb:"Sunday drivers. They wave a lot and miss a few turns. Perfect for first cart-path laps.",emoji:"🪑",aiSkillMin:.72,aiSkillMax:.84,roadGrip:.55,lookAheadMin:10,lookAheadMax:16,cornerCare:.35,rubberBand:.65,cardGradient:"linear-gradient(135deg, #7ec8e8 0%, #c8e8d0 100%)"},{id:"happy-hour",name:"Happy Hour Hotshot",blurb:"Square-night energy. Solid pack that stays on the path and keeps you honest.",emoji:"🍹",aiSkillMin:.9,aiSkillMax:1.02,roadGrip:.82,lookAheadMin:16,lookAheadMax:24,cornerCare:.62,rubberBand:1,cardGradient:"linear-gradient(135deg, #e8b84a 0%, #e85d4c 100%)"},{id:"turnpike-terror",name:"Turnpike Terror",blurb:"Bridge-bandit pace. Tight lines, early apexes, zero mercy on the multi-modal.",emoji:"🌉",aiSkillMin:1.05,aiSkillMax:1.16,roadGrip:.95,lookAheadMin:22,lookAheadMax:34,cornerCare:.88,rubberBand:1.15,cardGradient:"linear-gradient(135deg, #5a2a28 0%, #c45c48 50%, #e8b84a 100%)"}];function tv(i){return zr.find(e=>e.id===i)??zr[1]}const Ze=8.5,_n=1.1,ui=2.4,Dn=Ze+_n+ui+10,It=Ze+_n+ui+.8,Ji=Ze+_n+ui+2.2,Cr=3,Eu=7.2;function vi(i,e){return Math.hypot(e.x-i.x,e.y-i.y)}function Au(i){return function(){let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}let on=[],Pa=[],hn=[],$n=[];const nv=.42,iv=.9,gd=4.4,dr=13,ur=.55;function fr(i){return i.open??0}function Hs(i,e){let t=e-i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Zt(i,e){return Math.atan2(e.y-i.y,e.x-i.x)}function ko(i,e){if(i.length<3)return i.map(d=>({...d}));const t=i.length,n=[];let s=0;for(let d=0;d<t;d++){const u=vi(i[d],i[(d+1)%t]);n.push(u),s+=u}if(s<e*4)return i.map(d=>({...d}));const a=[],r=Math.max(48,Math.round(s/e)),o=s/r;let c=0,l=0,h=0;for(let d=0;d<r;d++){for(h=d*o;l+n[c]<h-1e-9;)l+=n[c],c=(c+1)%t;const u=h-l,f=n[c]>1e-9?u/n[c]:0,g=i[c],x=i[(c+1)%t];a.push({x:g.x+(x.x-g.x)*f,y:g.y+(x.y-g.y)*f})}return a}function sv(i,e,t){const n=i.length;let s=0;for(let a=0;a<t;a++){const r=i[(e+a-1+n)%n],o=i[(e+a)%n],c=i[(e+a+1)%n];s+=Math.abs(Hs(Zt(r,o),Zt(o,c)))}return s}function av(i,e,t,n){const s=i.length;for(let a=0;a<t;a++){const r=i[(e+a)%s];if(Fi(r.x,r.y,n))return!0}return!1}function rv(i,e=18){const t=i.length;if(t<e+2)return 0;const n=Ze+24;let s=-1,a=1/0,r=0,o=1/0;for(let h=0;h<t;h++){const d=sv(i,h,e);d<o&&(o=d,r=h),!av(i,h,e,n)&&d<a&&(a=d,s=h)}const c=s>=0?s:r,l=s>=0?Math.min(3,Math.floor(e/5)):0;return(c+l)%t}function ov(i){if(!i.length)return i;const e=Ze+22;if(!Fi(i[0].x,i[0].y,e))return i;for(let t=1;t<i.length;t++)if(!Fi(i[t].x,i[t].y,e))return[...i.slice(t),...i.slice(0,t)];return i}const Li=85;function cv(i){let e=0;const t=i.length;for(let n=0;n<t;n++){const s=Math.abs(Ru(i,n));s>e&&(e=s)}return e*180/Math.PI}function Ru(i,e){const t=i.length,n=i[(e-1+t)%t],s=i[e],a=i[(e+1)%t];return Hs(Zt(n,s),Zt(s,a))}function lv(i,e,t,n){const s=Math.min(t,Li),a=Math.min(e,s-1);let r=Array.from({length:i},()=>a+n()*(s-a));for(let c=0;c<60;c++){const l=r.reduce((d,u)=>d+u,0)||1;r=r.map(d=>d/l*360);let h=!1;if(r=r.map(d=>d<a?(h=!0,a):d>s?(h=!0,s):d),!h){const u=360-r.reduce((g,x)=>g+x,0);if(Math.abs(u)<.05)break;const f=u/i;r=r.map(g=>Math.min(s,Math.max(a,g+f)))}}r=r.map(c=>Math.min(s,Math.max(a,c)));const o=r.reduce((c,l)=>c+l,0)||1;return r=r.map(c=>c/o*360),r.map(c=>Math.min(s,Math.max(a,c)))}function hv(i,e,t,n,s){const a=i.length,r=[];let o=t;for(let c=0;c<a;c++){const l=e*(.94+s()*.12);r.push({x:Math.cos(o)*l,y:Math.sin(o)*l*n}),o+=i[c]*Math.PI/180}return r}function Gc(i,e){let t=i.map(n=>({...n}));for(let n=0;n<e;n++){const s=t.length,a=[];for(let r=0;r<s;r++){const o=t[r],c=t[(r+1)%s];a.push({x:o.x*.75+c.x*.25,y:o.y*.75+c.y*.25}),a.push({x:o.x*.25+c.x*.75,y:o.y*.25+c.y*.75})}t=a}return t}function Wi(i,e){const t=e*Math.PI/180;let n=i.map(s=>({x:s.x,y:s.y,elev:s.elev}));for(let s=0;s<40;s++){const a=n.length;if(a<4)break;let r=!1;const o=[];for(let h=0;h<a;h++){const d=n[(h-1+a)%a],u=n[h],f=n[(h+1)%a],g=Hs(Zt(d,u),Zt(u,f)),x=Math.abs(g);if(x<=t+1e-4){o.push({...u});continue}r=!0;const m=vi(d,u),p=vi(u,f),v=x/2,w=Math.tan(Math.min(v,Math.PI/2-.05)),M=Math.min(m*.45,p*.45,18,12*w+2),T=Zt(d,u),S=Zt(u,f),A={x:u.x-Math.cos(T)*M,y:u.y-Math.sin(T)*M},_={x:u.x+Math.cos(S)*M,y:u.y+Math.sin(S)*M},b=Math.max(2,Math.ceil(x/t));for(let C=0;C<=b;C++){const P=C/b,I={x:u.x*.55+(A.x+_.x)*.225,y:u.y*.55+(A.y+_.y)*.225},O=1-P;o.push({x:O*O*A.x+2*O*P*I.x+P*P*_.x,y:O*O*A.y+2*O*P*I.y+P*P*_.y})}}const c=o.length,l=[];for(let h=0;h<c;h++){const d=o[(h-1+c)%c],u=o[h],f=o[(h+1)%c];l.push({x:d.x*.15+u.x*.7+f.x*.15,y:d.y*.15+u.y*.7+f.y*.15,elev:u.elev})}if(n=l,!r)break}for(let s=0;s<25;s++){const a=n.length;let r=!1;const o=[];for(let c=0;c<a;c++){const l=n[c],h=n[(c+1)%a];o.push(l),Math.abs(Ru(n,c))>t&&(r=!0,o.push({x:(l.x+h.x)*.5,y:(l.y+h.y)*.5}))}if(n=o,!r)break}return Cu(n,1.1)}function dv(i,e=Date.now()){const t=Au(e>>>0),n=_a(i),s=Rn.find(v=>v.id===n.squareLandmarkId),a=s?.x??0,r=s?.y??0,o=14+Math.floor(t()*6),c=lv(o,14,38,t),l=175+t()*55,h=.82+t()*.28,d=t()*Math.PI*2;let u=hv(c,l,d,h,t),f=0,g=0;for(const v of u)f+=v.x,g+=v.y;f/=u.length,g/=u.length;for(const v of u)v.x=a+(v.x-f),v.y=r+(v.y-g);for(let v=0;v<u.length;v++){if(v%3!==0)continue;const w=u[v].x-a,M=u[v].y-r,T=Math.hypot(w,M)||1,S=1+.08+t()*.14;u[v]={x:a+w/T*T*S,y:r+M/T*T*S}}let x=Gc(u,2);x=Gc(x,1),x=ko(x,5),x=Cu(x,1.2),x=Wi(x,Li),x=ko(x,5),x=Wi(x,Li);const m=3+Math.floor(t()*3);x=xd(x,m,t),x=Wi(x,Li),x=ko(x,5),x=Wi(x,Li),cv(x)>90&&(console.warn("[track] turn > 90° detected; regenerating safe regular loop"),x=gv(a,r,170+t()*30,16),x=Wi(x,Li),hn=[],x=xd(x,3,t),x=Wi(x,Li));const p=rv(x,14);return p>0&&(x=[...x.slice(p),...x.slice(0,p)]),x=Wi(x,Li),x=ov(x),xv(x,t),mv(x,t),x}function xd(i,e,t){hn=[];const n=i.length;if(n<60||e<1)return i;const s=Math.max(8,Math.floor(n*.06)),a=n-s*2;if(a<e*10)return i;const r=[];for(let c=0;c<e;c++){const l=s+Math.floor((c+.5)/e*a),h=Math.floor((t()-.5)*(a/e)*.35);r.push(Math.max(s,Math.min(n-s-1,l+h)))}r.sort((c,l)=>l-c);let o=i.map(c=>({x:c.x,y:c.y,elev:c.elev}));for(const c of r){const l=o[Math.min(c,o.length-1)];if(hn.some(u=>Math.hypot(u.x-l.x,u.y-l.y)<u.radius*3.2))continue;const h=18+t()*10,d=uv(o,c,h,t);o=d.path,hn.push(d.site)}return o}function uv(i,e,t,n){const s=i.length,a=(e%s+s)%s,r=i[a],o=i[(a-3+s)%s],c=i[(a+3)%s],l=Zt(o,c),h=r.x,d=r.y,u=l-Math.PI/2,f=Math.PI*2*(.78+n()*.14),g=Math.max(22,Math.ceil(f*t/4.2)),x=[];for(let v=0;v<=g;v++){const w=v/g,M=u+f*w;x.push({x:h+Math.cos(M)*t,y:d+Math.sin(M)*t})}const m=v=>Math.hypot(v.x-h,v.y-d)>t*.92,p=[];for(let v=0;v<a;v++)m(i[v])&&p.push({...i[v]});for(const v of x)p.push(v);for(let v=a;v<s;v++)m(i[v])&&p.push({...i[v]});return p.length<24?{path:i,site:{x:h,y:d,radius:t,islandRadius:t*.48}}:{path:p,site:{x:h,y:d,radius:t,islandRadius:t*(.42+n()*.08)}}}const Hc="Edenfield Verandas West",fv=["Country Club","Mira Mesa","Del Mar","Valle Verde","Orange Blossom Gardens","El Cortez","La Reynalda","Silver Lake","La Zamora","Hacienda","Pine Ridge","Pine Hills","De Allende","De La Vista","Palo Alto","Rio Grande","Rio Ponderosa","Rio Ranchero","Tierra Del Sol","Alhambra","Santiago","Santo Domingo","Belle Aire","Glenbrook","Polo Ridge","Summerhill","Briar Meadow","Piedmont","Calumet Grove","Springdale","Chatham","Woodbury","Ashland","Belvedere","Bonnybrook","Liberty Park","Lynnhaven","Poinciana","Sunset Pointe","Winifred","Amelia","Caroline","Largo","Mallory Square","Sabal Chase","Tall Trees","Virginia Trace","Bonita","Duval","Hadley","Hemingway","Buttonwood","Pennecamp","St. Charles","St. James","Tamarind Grove","Sanibel","Charlotte","Fernandina","Gilchrist","Pinellas","Collier","Hillsborough","Lake Deaton","Dunedin","LaBelle","Osceola Hills","Fenney","DeSoto","McClure","Chitty Chatty","Linden","DeLuna","Monarch Grove","Bradford","Hawkins","St. Catherine","Citrus Grove","Cason Hammock","Richmond","Dabney","Lake Denham","Newell","Moultrie Creek","Shady Brook","Oak Hollow","Edenfield","LaGrange"];function pv(i,e){const t=Math.max(0,i),n=fv.filter(a=>a!==Hc);for(let a=n.length-1;a>0;a--){const r=Math.floor(e()*(a+1)),o=n[a];n[a]=n[r],n[r]=o}const s=[Hc,...n.slice(0,Math.max(0,t-1))];for(let a=s.length-1;a>0;a--){const r=Math.floor(e()*(a+1)),o=s[a];s[a]=s[r],s[r]=o}return s.slice(0,t)}function mv(i,e){$n=[];const t=i.length;if(t<50)return;const n=[0];for(let l=0;l<t;l++)n.push(n[l]+vi(i[l],i[(l+1)%t]));const s=n[t]||1,a=3+Math.floor(e()*3),r=[],o=[];for(let l=0;l<a;l++){let h=Math.floor((l+.5)/a*t)%t,d=-1/0;const u=Math.floor(t/a),f=Math.floor(l/a*t);for(let p=0;p<u;p++){const v=(f+p)%t,w=n[v]/s;if(w<.1||w>.92||r.some(b=>Math.abs(b-w)<.12))continue;const M=i[v];if((M.elev??0)>.8||hn.some(b=>Math.hypot(b.x-M.x,b.y-M.y)<b.radius+Ze+_n+ui+20))continue;const T=i[(v-2+t)%t],S=i[(v+2)%t],_=2.5-Math.abs(Hs(Zt(T,M),Zt(M,S)))*4+e()*.25;_>d&&(d=_,h=v)}if(d===-1/0)continue;const g=i[h];if(hn.some(p=>Math.hypot(p.x-g.x,p.y-g.y)<p.radius+Ze+_n+ui+20))continue;const x=i[(h+1)%t],m=n[h]/s;r.push(m),o.push({x:g.x,y:g.y,angle:Zt(g,x),dist:n[h],phase:e()*8,open:0,hold:0})}if(!o.length){let l=-1,h=-1/0;for(let d=0;d<t;d++){const u=n[d]/s;if(u<.08||u>.94)continue;const f=i[d];if((f.elev??0)>.8||hn.some(v=>Math.hypot(v.x-f.x,v.y-f.y)<v.radius+Ze+12))continue;const g=i[(d-2+t)%t],x=i[(d+2)%t],p=2-Math.abs(Hs(Zt(g,f),Zt(f,x)))*3;p>h&&(h=p,l=d)}if(l>=0){const d=i[l],u=i[(l+1)%t];o.push({x:d.x,y:d.y,angle:Zt(d,u),dist:n[l],phase:e()*8,open:0,hold:0})}}const c=pv(o.length,e);$n=o.map((l,h)=>({...l,label:c[h]??Hc}))}function gv(i,e,t,n){const s=[];for(let a=0;a<n;a++){const r=a/n*Math.PI*2;s.push({x:i+Math.cos(r)*t,y:e+Math.sin(r)*t*.88})}return Gc(s,2)}function xv(i,e){Pa=[];const t=i.length;if(t<40)return;const n=[0];for(let c=0;c<t;c++)n.push(n[c]+vi(i[c],i[(c+1)%t]));const s=n[t]||1,a=2+(e()>.45?1:0),r=56,o=[];for(let c=0;c<a;c++){let l=-1,h=-1/0;const d=Math.floor(t/a),u=Math.floor(c/a*t);for(let w=0;w<d;w++){const M=(u+w)%t,T=n[M]/s;if(T<.08||T>.94||o.some(P=>Math.abs(P-T)<.18))continue;const S=i[M];if(hn.some(P=>Math.hypot(P.x-S.x,P.y-S.y)<P.radius+r+24))continue;const A=i[(M-2+t)%t],_=i[(M+2)%t],C=2-Math.abs(Hs(Zt(A,i[M]),Zt(i[M],_)))*3+e()*.2;C>h&&(h=C,l=M)}if(l<0)continue;const f=n[l]/s;o.push(f);const g=42+e()*14,x=Eu*(.95+e()*.08),m=n[l];for(let w=0;w<t;w++){const M=i[w];if(hn.some(b=>Math.hypot(b.x-M.x,b.y-M.y)<b.radius+16))continue;let T=Math.abs(n[w]-m);if(T=Math.min(T,s-T),T>=g)continue;const S=T/g,A=Math.cos(S*Math.PI/2),_=x*A*A;M.elev=Math.max(M.elev??0,_)}const p=i[l],v=i[(l+1)%t];Pa.push({x:p.x,y:p.y,angle:Zt(p,v),dist:m,peakElev:x,halfSpan:g})}for(const c of i)c.elev===void 0&&(c.elev=0)}function Cu(i,e){if(i.length<4)return i;const t=[{...i[0]}];for(let n=1;n<i.length;n++){const s=t[t.length-1];vi(s,i[n])>=e&&t.push({...i[n]})}return t.length>2&&vi(t[t.length-1],t[0])<e&&t.pop(),t}function Pu(i,e){return Pa=[],hn=[],$n=[],on=dv(i,e??Date.now()^Math.random()*1e9),on}on.length||Pu("spanish-springs",12648430);function _v(i=5){const e=on,t=[];let n=0;for(let s=0;s<e.length;s++){const a=e[s],r=e[(s+1)%e.length],o=vi(a,r),c=Math.max(1,Math.ceil(o/i)),l=a.elev??0,h=r.elev??0;for(let d=0;d<c;d++){const u=d/c,f=a.x+(r.x-a.x)*u,g=a.y+(r.y-a.y)*u,x=l+(h-l)*u,m=Math.atan2(r.y-a.y,r.x-a.x);t.push({x:f,y:g,angle:m,dist:n+o*u,segment:s,elev:x})}n+=o}if(t.length>4){const s=t.map(a=>a.angle);for(let a=0;a<t.length;a++){const r=t[(a-1+t.length)%t.length].angle,o=t[a].angle,c=t[(a+1)%t.length].angle,l=Math.cos(r)+Math.cos(o)*2+Math.cos(c),h=Math.sin(r)+Math.sin(o)*2+Math.sin(c);s[a]=Math.atan2(h,l)}for(let a=0;a<t.length;a++)t[a].angle=s[a]}return t}function Mv(i){if(!i.length)return 1;const e=i[i.length-1];return e.dist+vi(e,i[0])}function Yi(i,e,t){let n=0,s=1/0;const a=Math.max(1,Math.floor(i.length/400));for(let c=0;c<i.length;c+=a){const l=i[c],h=(l.x-e)**2+(l.y-t)**2;h<s&&(s=h,n=c)}const r=Math.max(0,n-a*2),o=Math.min(i.length-1,n+a*2);for(let c=r;c<=o;c++){const l=i[c],h=(l.x-e)**2+(l.y-t)**2;h<s&&(s=h,n=c)}return{sample:i[n],index:n,distToRoad:Math.sqrt(s)}}function _d(i,e,t,n,s=.14){const a=i.length;if(!a)return{sample:{x:0,y:0,angle:0,dist:0,segment:0,elev:0},index:0,distToRoad:0};const r=Math.max(48,Math.floor(a*s));let o=(n%a+a)%a,c=1/0;for(let d=-r;d<=r;d++){const u=((n+d)%a+a)%a,f=i[u],g=(f.x-e)**2+(f.y-t)**2;g<c&&(c=g,o=u)}const l=Math.sqrt(c),h=Yi(i,e,t);return h.distToRoad+10<l?h:{sample:i[o],index:o,distToRoad:l}}function Iu(i,e){let t=1/0;const n=on;for(let s=0;s<n.length;s++){const a=n[s],r=n[(s+1)%n.length],o=vv(i,e,a.x,a.y,r.x,r.y);o<t&&(t=o)}return t}function vv(i,e,t,n,s,a){const r=s-t,o=a-n,c=i-t,l=e-n,h=r*r+o*o||1;let d=(c*r+l*o)/h;d=Math.max(0,Math.min(1,d));const u=t+r*d,f=n+o*d;return Math.hypot(i-u,e-f)}function dt(i,e,t){return Iu(i,e)>=t}function Fi(i,e,t=0){for(const n of hn)if(Math.hypot(i-n.x,e-n.y)<n.radius+t)return!0;return!1}function yv(i=12648430){const e=[],t=Au(i>>>0),n=on;if(!n.length)return e;let s=1/0,a=-1/0,r=1/0,o=-1/0;for(const l of n)s=Math.min(s,l.x),a=Math.max(a,l.x),r=Math.min(r,l.y),o=Math.max(o,l.y);const c=90;s-=c,a+=c,r-=c,o+=c;for(const l of Rn.filter(h=>h.kind==="town-square"))if(!(l.x<s||l.x>a||l.y<r||l.y>o)){dt(l.x,l.y,Ze+2)&&e.push({x:l.x,y:l.y,r:38,kind:"plaza"});for(let h=0;h<10;h++){const d=t()*Math.PI*2,u=l.x+Math.cos(d)*(48+t()*20),f=l.y+Math.sin(d)*(48+t()*20);if(dt(u,f,Dn)){e.push({x:u,y:f,r:22,kind:"parking"});break}}}for(let l=0;l<18;l++){const h=Math.floor(t()*n.length),d=n[h],u=n[(h+1)%n.length],f=Math.atan2(u.y-d.y,u.x-d.x)+Math.PI/2,g=t()>.5?1:-1,x=Dn+16+t()*40,m=d.x+Math.cos(f)*x*g,p=d.y+Math.sin(f)*x*g,v=12+t()*18;dt(m,p,v+It)&&e.push({x:m,y:p,r:v,kind:"pond"})}for(let l=0;l<10;l++){const h=Math.floor(t()*n.length),d=n[h],u=n[(h+1)%n.length],f=Math.atan2(u.y-d.y,u.x-d.x)+Math.PI/2,g=t()>.5?1:-1,x=Dn+30+t()*40,m=d.x+Math.cos(f)*x*g,p=d.y+Math.sin(f)*x*g,v=30+t()*28;dt(m,p,v*.55+It)&&e.push({x:m,y:p,r:v,kind:"golf"})}for(let l=0;l<n.length;l+=2){const h=n[l],d=n[(l+1)%n.length],u=Math.atan2(d.y-h.y,d.x-h.x)+Math.PI/2;for(const f of[-1,1]){const g=Ji+1.5+t()*2;{const x=h.x+Math.cos(u)*g*f,m=h.y+Math.sin(u)*g*f;dt(x,m,Ji)&&l%4===0&&e.push({x,y:m,r:6+t()*4,kind:"palm-grove"})}for(const x of[24,36,50,68]){if(t()>.78&&x>40)continue;const m=(t()-.5)*3,p=h.x+Math.cos(u)*(x+m)*f,v=h.y+Math.sin(u)*(x+m)*f;!dt(p,v,Dn)||Rn.some(M=>Math.hypot(M.x-p,M.y-v)<40)||e.push({x:p,y:v,r:9+t()*10,kind:t()>.88?"palm-grove":"houses"})}}}for(let l=0;l<90;l++){const h=s+t()*(a-s),d=r+t()*(o-r),u=Iu(h,d);u<Dn||u>120&&t()>.35||Rn.some(g=>Math.hypot(g.x-h,g.y-d)<48)||e.push({x:h,y:d,r:12+t()*18,kind:t()>.8?"palm-grove":"houses"})}return e}function Md(i,e=0){const t=i[Math.min(5,i.length-1)],n=Math.cos(t.angle+Math.PI/2),s=Math.sin(t.angle+Math.PI/2),a=(e-1.5)*3;return{x:t.x+n*a,y:t.y+s*a,angle:t.angle}}const Cs=8,Sv=3;function Bo(i){return i==="hotrod"?"fireball":i==="evolution"?"loofah":i==="cybertruck"?"bolt":"golf-ball"}function $i(i){return i==="fireball"?"Fireball":i==="loofah"?"Loofah":i==="bolt"?"Lightning":"Golf ball"}function El(i){return i==="fireball"?"🔥":i==="loofah"?"🧽":i==="bolt"?"⚡":"⛳"}class bv{constructor(e){this.config=e;const t=(Date.now()^Math.random()*2147483647)>>>0;this.areaId=e.areaId,this.difficulty=tv(e.difficultyId);const n=_a(e.areaId);this.areaName=n.shortName,Pu(e.areaId,t),this.samples=_v(5),this.decor=yv(t^2654435769),this.totalLen=Mv(this.samples),this.playerAmmo=Bo(e.cartId),this.ponds=this.decor.filter(s=>s.kind==="pond").map(s=>({x:s.x,y:s.y,r:s.r})),this.buildSolids(),this.spawnAmmoPickups(),this.spawnRacers();for(let s=0;s<6;s++)this.spawnHazardAhead(70+s*55,s%2===0);this.spawnTimer=2.2}config;samples;decor;solids=[];ponds=[];ammoPickups=[];totalLen;racers=[];hazards=[];projectiles=[];events=[];time=0;countdown=3.6;running=!1;finished=!1;hazardId=1;solidId=1;projId=1;pickupId=1;spawnTimer=0;nearbyLandmark=null;upcomingHazard=null;playerAmmo;areaId;areaName;difficulty;justWentGreen=!1;gateHintCool=0;wrongWaySec=0;wrongWayAlert=!1;spawnAmmoPickups(){const e=["golf-ball","fireball","loofah","bolt"];let t=0;for(let n=12;n<this.samples.length;n+=28){const s=this.samples[n],a=Math.cos(s.angle+Math.PI/2),r=Math.sin(s.angle+Math.PI/2),o=(Math.floor(n/28)%2===0?1:-1)*2.2,c=e[t%e.length];t++,this.ammoPickups.push({id:this.pickupId++,x:s.x+a*o,y:s.y+r*o,kind:c,active:!0,phase:Math.random()*Math.PI*2,respawnIn:0})}}buildSolids(){for(const e of this.decor)if(e.kind==="houses"){if(Yi(this.samples,e.x,e.y).distToRoad<Ze+8)continue;this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:Math.max(2.4,Math.min(3.8,e.r*.22)),kind:"house",destroyed:!1})}else if(e.kind==="palm-grove"){if(Yi(this.samples,e.x,e.y).distToRoad<Ze+5)continue;this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:1.6,kind:"prop",destroyed:!1})}for(const e of Rn){if(Yi(this.samples,e.x,e.y).distToRoad<Ze+6)continue;const n=e.kind==="town-square"?5.5:e.kind==="rec-center"?4.5:2.5;this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:n,kind:"landmark",destroyed:!1})}for(const e of hn)this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:Math.max(3.5,e.islandRadius*.92),kind:"island",destroyed:!1});for(let e=0;e<$n.length;e++){const t=$n[e];this.solids.push({id:this.solidId++,x:t.x,y:t.y,radius:Ze*.92,kind:"gate",destroyed:!1,gateIndex:e})}}spawnRacers(){const e=qM(this.config.cartId),t=YM(this.config.driverId),n=[t.id],s=(this.config.playerName||"").trim().slice(0,20)||"Racer",a=Math.min(5,Math.max(0,this.samples.length-1)),r=this.totalLen>0?Math.min(.2,this.samples[a].dist/this.totalLen):0,o=Md(this.samples,1);this.racers.push({id:"player",name:s,isPlayer:!0,cart:e,driver:t,x:o.x,y:o.y,angle:o.angle,speed:0,steerVel:0,lapProgress:r,lap:0,place:1,finished:!1,finishTime:0,roadIndex:a,effectTimer:0,effectSpeedMul:1,score:0,hazardsHit:0,hazardsDodged:0,checkpoints:new Set,aiTargetIndex:0,aiSkill:1,fireCooldown:0,ammo:Cs,inWater:!1,offRoad:!1,spinOutTimer:0,spinVel:0,waveTimer:0,trapTimer:0,trapIgnoreId:0});const c=this.difficulty;for(let l=0;l<4;l++){const h=zs[l%zs.length],d=$M(n);n.push(d.id);const u=Md(this.samples,l===0?0:l+1),f=c.aiSkillMax-c.aiSkillMin;this.racers.push({id:`ai-${l}`,name:d.name,isPlayer:!1,cart:h,driver:d,x:u.x,y:u.y,angle:u.angle,speed:0,steerVel:0,lapProgress:r,lap:0,place:l+2,finished:!1,finishTime:0,roadIndex:a,effectTimer:0,effectSpeedMul:1,score:0,hazardsHit:0,hazardsDodged:0,checkpoints:new Set,aiTargetIndex:4+l*3,aiSkill:c.aiSkillMin+Math.random()*f,fireCooldown:1+Math.random()*2,ammo:Cs,inWater:!1,offRoad:!1,spinOutTimer:0,spinVel:0,waveTimer:0,trapTimer:0,trapIgnoreId:0})}}update(e,t){for(const n of this.events)n.ttl-=e;if(this.events=this.events.filter(n=>n.ttl>0),!this.finished){if(this.countdown>0){const n=Math.ceil(this.countdown);this.countdown-=e;const s=Math.ceil(this.countdown);s!==n&&s>0&&(this.pushEvent("banner",String(s),void 0,.9),zt.countdown(s)),this.countdown<=0&&(this.running=!0,this.justWentGreen=!0,zt.go(),this.pushEvent("banner","GO!",`${this.areaName} · ${$i(this.playerAmmo)}s · Space`,1.8)),this.updateNearbyLandmark(),this.updateHazardWarn();return}this.time+=e,this.updateCommunityGates(e),this.spawnTimer-=e,this.spawnTimer<=0&&(this.spawnHazardAhead(80+Math.random()*120,Math.random()>.4),Math.random()<.28&&this.spawnHazardAhead(140+Math.random()*80,!1),this.spawnTimer=2.8+Math.random()*2.6),this.updateHazards(e),this.updateProjectiles(e),this.updateAmmoPickups(e);for(const n of this.racers)n.finished||(n.fireCooldown>0&&(n.fireCooldown-=e),n.waveTimer>0&&(n.waveTimer-=e),this.updateTerrainFlags(n),n.isPlayer?(this.drivePlayer(n,e,t),(t.consumeGatePass()||t.state.gate&&n.waveTimer<=0)&&this.playerWaveGatePass(n),(t.consumeFire()||t.state.fire&&n.fireCooldown<=0)&&this.tryFire(n)):(this.driveAI(n,e),n.fireCooldown<=0&&n.ammo>0&&Math.random()<.01&&this.tryFire(n)),this.applyMotion(n,e),this.resolveSolidCollisions(n),this.collectAmmo(n));this.resolveCartCollisions();for(const n of this.racers)n.finished||(this.updateProgress(n,e),this.checkCheckpoints(n),this.checkHazardHits(n));this.updatePlaces(),this.checkRaceOver(),this.updateNearbyLandmark(),this.updateHazardWarn()}}stopEarly(){if(this.finished)return;const e=this.getPlayer();e.finished||(e.finished=!0,e.finishTime=this.time,e.speed=0),this.finished=!0,this.running=!1,this.finalizeScores(),e.score=Math.round(Math.max(0,e.score*.85)),this.pushEvent("banner","Race stopped","Saved to results",2)}updateCommunityGates(e){for(const n of $n)n.hold>0?(n.hold-=e,n.open=Math.min(1,(n.open??0)+e/nv)):n.open=Math.max(0,(n.open??0)-e/iv);this.gateHintCool>0&&(this.gateHintCool-=e);const t=this.getPlayer();t&&!t.finished&&this.maybeHintGatePass(t)}nearestWaveableGate(e){let t=null;const n=Math.cos(e.angle),s=Math.sin(e.angle);for(const a of $n){const r=a.x-e.x,o=a.y-e.y,c=Math.hypot(r,o);c>dr+4||r*n+o*s<-3||(!t||c<t.dist)&&(t={site:a,dist:c})}return t}playerWaveGatePass(e){e.waveTimer=1.15;const t=this.nearestWaveableGate(e);if(!t||t.dist>dr){zt.gateMiss(),this.pushEvent("toast","Too far from the post","Get next to the gate and wave",1.5);return}t.site.hold=gd,zt.gatePass(),this.pushEvent("toast","Gate pass!",t.site.label,1.3)}maybeHintGatePass(e){if(this.gateHintCool>0||e.waveTimer>0)return;const t=this.nearestWaveableGate(e);!t||t.dist>dr||fr(t.site)>=ur||(this.gateHintCool=3.2,this.pushEvent("toast","Wave your gate pass","G or the Pass button",1.8))}updateTerrainFlags(e){const t=Yi(this.samples,e.x,e.y);e.offRoad=t.distToRoad>=Ze+1.2,e.inWater=!1;for(const n of this.ponds)if(Math.hypot(e.x-n.x,e.y-n.y)<n.r*.92){e.inWater=!0;break}}tryFire(e){if(e.fireCooldown>0||e.finished||e.trapTimer>0)return;if(e.ammo<=0){e.isPlayer&&(zt.empty(),this.pushEvent("toast","Out of ammo!",e.cart.id==="cybertruck"?"Drive through a lightning storm":"Drive over a recharge pad",1.4)),e.fireCooldown=.4;return}const t=Bo(e.cart.id),n=t==="fireball"?92:t==="bolt"?96:t==="loofah"?78:88,s=e.cart.id==="cybertruck"?3.15:2.6;this.projectiles.push({id:this.projId++,x:e.x+Math.cos(e.angle)*s,y:e.y+Math.sin(e.angle)*s,vx:Math.cos(e.angle)*n,vy:Math.sin(e.angle)*n,life:2.2,kind:t,ownerId:e.id,radius:t==="loofah"?1.15:t==="fireball"?1.05:t==="bolt"?1.25:.75,spin:t==="bolt"?0:(Math.random()-.5)*14}),e.ammo-=1,e.fireCooldown=t==="fireball"?.55:t==="loofah"?.7:t==="bolt"?.52:.48,e.isPlayer&&zt.fire(t)}updateAmmoPickups(e){for(const t of this.ammoPickups)t.phase+=e*3,!t.active&&t.respawnIn>0&&(t.respawnIn-=e,t.respawnIn<=0&&(t.active=!0,t.respawnIn=0))}collectAmmo(e){const t=Bo(e.cart.id);for(const n of this.ammoPickups)if(!(!n.active||n.kind!==t)&&Math.hypot(n.x-e.x,n.y-e.y)<2.8){if(e.ammo>=Cs)continue;const s=e.ammo;e.ammo=Math.min(Cs,e.ammo+Sv),n.active=!1,n.respawnIn=12,e.isPlayer&&(zt.pickup(),this.pushEvent("toast",`${El(t)} Ammo recharged!`,`${s} → ${e.ammo} ${$i(t)}s`,1.5))}}updateProjectiles(e){for(const t of this.projectiles){t.life-=e,t.x+=t.vx*e,t.y+=t.vy*e,t.spin+=e*(t.kind==="golf-ball"?18:t.kind==="loofah"?10:6);for(const n of this.hazards)if(n.active&&Math.hypot(n.x-t.x,n.y-t.y)<t.radius+Rr[n.type].radius){n.active=!1,t.life=0;const s=this.racers.find(a=>a.id===t.ownerId);s?.isPlayer&&(s.score+=90,s.hazardsDodged+=1,zt.tagged(),this.pushEvent("toast",`${$i(t.kind)} hit!`,`+90 · ${Rr[n.type].name} cleared`,1.4));break}if(!(t.life<=0)){for(const n of this.solids)if(!(n.destroyed||n.kind==="landmark"||n.kind==="gate"||n.kind==="island")&&Math.hypot(n.x-t.x,n.y-t.y)<t.radius+n.radius){n.destroyed=!0,t.life=0;const s=this.racers.find(a=>a.id===t.ownerId);s?.isPlayer&&(s.score+=60,zt.smash(),this.pushEvent("toast","Obstacle obliterated!",`+60 · ${$i(t.kind)}`,1.3));break}if(!(t.life<=0)){for(const n of this.racers)if(!(n.id===t.ownerId||n.finished)&&Math.hypot(n.x-t.x,n.y-t.y)<t.radius+1.5){this.applySpinOut(n,t.kind),t.life=0;const s=this.racers.find(a=>a.id===t.ownerId);s?.isPlayer?(s.score+=40,zt.tagged(),this.pushEvent("toast","Rival tagged!",`+40 · ${$i(t.kind)}`,1.2)):n.isPlayer&&(zt.spinOut(),this.pushEvent("toast","Spin out!",`${$i(t.kind)} from a rival`,1.4));break}}}}this.projectiles=this.projectiles.filter(t=>t.life>0)}resolveSolidCollisions(e){const s=Yi(this.samples,e.x,e.y).distToRoad<Ze+1.2;for(const a of this.solids){if(a.destroyed)continue;if(a.kind==="gate"){if(a.gateIndex==null)continue;const p=$n[a.gateIndex];if(!p||fr(p)>=ur)continue}if(s&&a.kind!=="prop"&&a.kind!=="gate"&&a.kind!=="island")continue;const r=e.x-a.x,o=e.y-a.y,c=Math.hypot(r,o),l=a.radius+1.35;if(c>=l||c<1e-5)continue;const h=l-c;if(a.kind==="gate"){const p=e.speed<-.05?-1:1,v=Math.min(h,1.35);e.x-=Math.cos(e.angle)*p*v,e.y-=Math.sin(e.angle)*p*v,e.speed=0,e.steerVel=0,e.isPlayer&&zt.gateThud();continue}const d=r/c,u=o/c,f=Math.min(h,1.8);e.x+=d*f,e.y+=u*f;const g=Math.cos(e.angle)*e.speed,x=Math.sin(e.angle)*e.speed,m=g*d+x*u;if(m<0){const p=g-m*d,v=x-m*u,w=e.speed<0?-1:1,M=Math.hypot(p,v)*.55;M<.8?e.speed=0:(e.speed=M*w,w>0&&M>1.5&&(e.angle=Math.atan2(v,p)))}}}resolveCartCollisions(){for(let e=0;e<this.racers.length;e++)for(let t=e+1;t<this.racers.length;t++){const n=this.racers[e],s=this.racers[t],r=(n.cart.id==="cybertruck"||s.cart.id==="cybertruck"?1.85:1.55)*2,o=s.x-n.x,c=s.y-n.y,l=Math.hypot(o,c);if(l>=r||l<1e-4)continue;const h=o/l,d=c/l,u=r-l;n.x-=h*u*.52,n.y-=d*u*.52,s.x+=h*u*.52,s.y+=d*u*.52;const f=Math.cos(n.angle)*n.speed,g=Math.sin(n.angle)*n.speed,x=Math.cos(s.angle)*s.speed,m=Math.sin(s.angle)*s.speed,p=(f-x)*h+(g-m)*d;if(p>=0)continue;const v=-1.42*p/2;let w=f+v*h,M=g+v*d,T=x-v*h,S=m-v*d;const A=-d,_=h,b=Math.min(6,Math.abs(p)*.15);w+=A*b*(n.isPlayer?.7:1),M+=_*b*(n.isPlayer?.7:1),T-=A*b*(s.isPlayer?.7:1),S-=_*b*(s.isPlayer?.7:1);const C=Math.min(n.cart.topSpeed,Math.hypot(w,M)*.88),P=Math.min(s.cart.topSpeed,Math.hypot(T,S)*.88);n.speed=n.speed<0?-Math.min(C,n.cart.topSpeed*.42):C,s.speed=s.speed<0?-Math.min(P,s.cart.topSpeed*.42):P,n.speed>1.2&&(n.angle=Math.atan2(M,w)),s.speed>1.2&&(s.angle=Math.atan2(S,T)),Math.abs(p)>8&&(n.effectTimer=Math.max(n.effectTimer,.35),n.effectSpeedMul=Math.min(n.effectSpeedMul,.55),s.effectTimer=Math.max(s.effectTimer,.35),s.effectSpeedMul=Math.min(s.effectSpeedMul,.55),(n.isPlayer||s.isPlayer)&&(zt.bump(),this.pushEvent("toast","Cart bump!","Watch the pack",1.2)))}}pushEvent(e,t,n,s=1.5){this.events.push({kind:e,text:t,sub:n,ttl:s})}applySpinOut(e,t){const n=t==="fireball"?1.55:t==="bolt"?1.45:t==="loofah"?1.35:1.2,s=t==="fireball"?11:t==="bolt"?10:t==="loofah"?9:8;e.spinOutTimer=Math.max(e.spinOutTimer,n),e.spinVel=(Math.random()>.5?1:-1)*(s+Math.random()*4),e.speed*=.28,e.effectTimer=Math.max(e.effectTimer,n),e.effectSpeedMul=Math.min(e.effectSpeedMul,.28),e.steerVel=0}tickTrap(e,t){return e.trapTimer<=0?!1:(e.trapTimer=Math.max(0,e.trapTimer-t),e.speed=0,e.steerVel=0,e.trapTimer<=0&&(e.effectSpeedMul=1,e.effectTimer=0,e.speed=Math.max(e.speed,10)),!0)}updateSpinOut(e,t){if(e.spinOutTimer<=0){e.spinVel*=Math.exp(-8*t),Math.abs(e.spinVel)<.05&&(e.spinVel=0);return}e.spinOutTimer-=t;const n=Math.max(0,e.spinOutTimer),s=Math.min(1,n/.45);e.angle+=e.spinVel*s*t,e.spinVel*=Math.exp(-1.1*t),e.speed*=Math.exp(-1.4*t),e.spinOutTimer<=0&&(e.spinOutTimer=0,e.spinVel*=.2,e.effectSpeedMul=Math.max(e.effectSpeedMul,.55))}drivePlayer(e,t,n){if(this.tickTrap(e,t))return;this.updateSpinOut(e,t);const s=e.cart,a=xa();let r=s.topSpeed*e.effectSpeedMul*e.driver.luck,o=s.accel*(.62+a.driveSens*.38),c=r*.62;e.inWater?(r*=.18,c*=.18,o*=.2):e.offRoad&&(r*=s.offRoadGrip,c*=s.offRoadGrip,o*=.42),e.effectTimer>0&&(e.effectTimer-=t,e.effectTimer<=0&&(e.effectSpeedMul=1));const l=e.spinOutTimer>.05,h=l?.12:1,d=n.brakeAmount,u=n.throttleAmount;if(d>.04&&d>=u){const A=d;e.speed>.35?e.speed-=o*2.6*t*A:l||(e.speed-=o*2.5*t*A)}else u>.04?e.speed<0?e.speed+=s.accel*3.2*t*h*u:e.speed+=o*t*h*u:(e.speed>0?e.speed-=s.accel*1.35*t:e.speed<0&&(e.speed+=s.accel*1.5*t),Math.abs(e.speed)<.15&&(e.speed=0));e.speed=Math.max(-c,Math.min(r,e.speed));const f=e.speed<-.12,g=Math.abs(e.speed),x=Math.min(1,g/Math.max(1,r)),m=n.state.left!==n.state.right,p=.62+a.steerSens*.38,v=m?s.handling*(f?1.55:.55+x*.7)*h*p:f?s.handling*1.85*h:s.handling*(.28+x*.5)*h,w=n.steerAxis;let M=0;l||(M=w*v,f&&(M=-M));const T=m?(f?12:9.4)*p:f?10.5:Math.abs(w)>.04?6.4:8.2;e.steerVel+=(M-e.steerVel)*Math.min(1,T*t);const S=s.handling*(m?f?1.85:1.28:f?2.05:.85);e.steerVel=Math.max(-S,Math.min(S,e.steerVel)),l||(e.angle+=e.steerVel*t)}driveAI(e,t){if(this.tickTrap(e,t)||(this.updateSpinOut(e,t),e.effectTimer>0&&(e.effectTimer-=t,e.effectTimer<=0&&e.spinOutTimer<=0&&(e.effectSpeedMul=1)),e.spinOutTimer>.08))return;const n=this.difficulty,s=this.getPlayer(),a=s.lap+s.lapProgress,r=e.lap+e.lapProgress,o=a-r,c=n.rubberBand,l=o>.08?1+.08*c+Math.min(.2*c,o*.4*c):o<-.14?.9:1,h=_d(this.samples,e.x,e.y,e.roadIndex,.16);e.roadIndex=h.index;const d=h.distToRoad<Ze+.8;e.offRoad=!d&&!e.inWater;const u=n.lookAheadMax-n.lookAheadMin,f=n.lookAheadMin+Math.floor(u*Math.min(1,Math.max(0,e.aiSkill-.7)/.5)),g=(h.index+f)%this.samples.length,x=this.samples[g],m=e.id.charCodeAt(e.id.length-1)%5,p=(1.15-n.roadGrip*.35)*1.6;let v=(m-2)*(p/2);h.distToRoad>Ze*.55&&(v=0);const w=Math.cos(x.angle+Math.PI/2),M=Math.sin(x.angle+Math.PI/2);let T=x.x+w*v,S=x.y+M*v;if(h.distToRoad>1.2){const ce=Math.min(1,n.roadGrip*(.45+h.distToRoad*.08));T=T*(1-ce)+h.sample.x*ce,S=S*(1-ce)+h.sample.y*ce}let _=Math.atan2(S-e.y,T-e.x)-e.angle;for(;_>Math.PI;)_-=Math.PI*2;for(;_<-Math.PI;)_+=Math.PI*2;const b=d?1:1.35+n.roadGrip*.5,C=e.cart.handling*e.aiSkill*(.9+n.roadGrip*.35)*b;e.angle+=Math.max(-C*t,Math.min(C*t,_));let P=1;const I=Math.max(6,Math.floor(f*.55)),O=this.samples[h.index];let k=this.samples[(h.index+I)%this.samples.length].angle-O.angle;for(;k>Math.PI;)k-=Math.PI*2;for(;k<-Math.PI;)k+=Math.PI*2;P=1-Math.min(1,Math.abs(k)/.9)*(.18+n.cornerCare*.42);let V=e.cart.topSpeed*.97*e.aiSkill*e.effectSpeedMul*l*P;e.inWater?V*=.18:e.offRoad&&(V*=e.cart.offRoadGrip*(.55+n.roadGrip*.35));let Q=V;const ae=14+n.roadGrip*10;for(const ce of this.hazards){if(!ce.active||ce.type==="lightning"&&e.cart.id==="cybertruck")continue;const Ke=Math.hypot(ce.x-e.x,ce.y-e.y);if(Ke<ae){Q*=Ke<7?.55:.8;let Ve=Math.atan2(e.y-ce.y,e.x-ce.x)-e.angle;for(;Ve>Math.PI;)Ve-=Math.PI*2;for(;Ve<-Math.PI;)Ve+=Math.PI*2;const ee=1.6+n.roadGrip*1.4;e.angle+=Math.max(-ee*t,Math.min(ee*t,Ve*(.4+n.roadGrip*.35)))}}const oe=this.nearestWaveableGate(e);oe&&fr(oe.site)<ur&&(oe.dist<dr+2&&(e.waveTimer=Math.max(e.waveTimer,.9),oe.site.hold=gd),oe.dist<11&&fr(oe.site)<ur&&(Q*=.12));for(const ce of this.solids){if(ce.destroyed||ce.kind==="gate")continue;const Ke=Math.hypot(ce.x-e.x,ce.y-e.y);if(Ke<ce.radius+6){let Ve=Math.atan2(e.y-ce.y,e.x-ce.x)-e.angle;for(;Ve>Math.PI;)Ve-=Math.PI*2;for(;Ve<-Math.PI;)Ve+=Math.PI*2;e.angle+=Math.max(-2.2*t,Math.min(2.2*t,Ve*.45)),Ke<ce.radius+3&&(Q*=.5)}}Math.hypot(s.x-e.x,s.y-e.y)<12&&r>a-.02&&n.roadGrip>.7&&(Q=Math.max(Q,Math.abs(s.speed)*1.04)),e.speed<Q?e.speed+=e.cart.accel*e.aiSkill*1.2*t:e.speed-=e.cart.accel*.5*t,e.speed=Math.max(0,Math.min(V*1.02,e.speed))}applyMotion(e,t){if(e.trapTimer>0){e.speed=0;return}e.x+=Math.cos(e.angle)*e.speed*t,e.y+=Math.sin(e.angle)*e.speed*t,e.x=Math.max(pr.minX,Math.min(pr.maxX,e.x)),e.y=Math.max(pr.minY,Math.min(pr.maxY,e.y))}updateProgress(e,t){const n=this.samples.length;if(!n||this.totalLen<=1)return;const s=_d(this.samples,e.x,e.y,e.roadIndex,.16),a=e.roadIndex,r=e.lapProgress;e.roadIndex=s.index,e.lapProgress=Math.min(.9999,Math.max(0,s.sample.dist/this.totalLen));const o=e.lapProgress-r,c=a>n*.7&&s.index<n*.3&&(s.index+n-a)%n<n*.35,l=o<-.45;Math.abs(e.speed)>.4&&(l||c)&&r>.55&&(e.lap+=1,e.isPlayer&&e.lap<Cr&&(zt.lap(),this.pushEvent("banner",`Lap ${e.lap+1}`,`${e.lap} of ${Cr} complete`,1.4)),e.lap>=Cr&&!e.finished&&(e.finished=!0,e.finishTime=this.time,e.speed*=.25,e.isPlayer&&(zt.finish(),this.pushEvent("banner","Finished!","Pull into the lanai",2)))),e.isPlayer&&this.running&&(e.score+=Math.max(0,e.speed)*1.8*t,this.updateWrongWay(e,t,r))}updateWrongWay(e,t,n){if(!this.running||e.finished||e.trapTimer>0){this.wrongWaySec=Math.max(0,this.wrongWaySec-t*3),this.wrongWaySec<1&&(this.wrongWayAlert=!1);return}const s=this.samples[e.roadIndex];if(!s)return;if(Yi(this.samples,e.x,e.y).distToRoad>Ze*2.4){this.wrongWaySec=Math.max(0,this.wrongWaySec-t*2),this.wrongWaySec<1&&(this.wrongWayAlert=!1);return}let r=e.angle-s.angle;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;const o=Math.abs(r)>1.85;let c=e.lapProgress-n;c>.5&&(c-=1),c<-.5&&(c+=1);const l=Math.abs(e.speed)>1.4,h=l&&c<-7e-4;l&&(o||h)?(this.wrongWaySec+=t,this.wrongWaySec>=5&&(this.wrongWayAlert=!0)):(this.wrongWaySec=Math.max(0,this.wrongWaySec-t*2.4),this.wrongWaySec<1.1&&(this.wrongWayAlert=!1))}checkCheckpoints(e){for(const t of Rn)if(!(t.kind!=="town-square"&&t.kind!=="rec-center")&&!e.checkpoints.has(t.id)&&Math.hypot(t.x-e.x,t.y-e.y)<35&&(e.checkpoints.add(t.id),e.isPlayer)){const n=t.kind==="town-square"?250:150;e.score+=n,zt.checkpoint(),this.pushEvent("checkpoint",t.shortName,`+${n} · ${t.kind==="town-square"?"Town Square":"Rec Center"}`,2)}}nearRoundabout(e,t,n=14){for(const s of hn)if(Math.hypot(e-s.x,t-s.y)<s.radius+Ze+n)return!0;return!1}spawnHazardAhead(e,t){const n=this.getPlayer(),s=this.totalLen/this.samples.length,a=Math.max(8,Math.floor(e/Math.max(1,s)));let r=(n.roadIndex+a)%this.samples.length,o=this.samples[r];if(this.nearRoundabout(o.x,o.y,16)){let S=!1;for(let A=4;A<48;A+=3){const _=(r+A)%this.samples.length,b=this.samples[_];if(!this.nearRoundabout(b.x,b.y,14)){r=_,o=b,S=!0;break}}if(!S)return}const c=["golf-ball","turtle","alligator","lightning","wanderer","cop","porch-police","palm-frond","sinkhole"],l=[1.3,1.4,1.2,.9,1.1,.85,1.2,1.25,.7];let h=l.reduce((S,A)=>S+A,0),d=Math.random()*h,u="turtle";for(let S=0;S<c.length;S++)if(d-=l[S],d<=0){u=c[S];break}const f=Math.cos(o.angle+Math.PI/2),g=Math.sin(o.angle+Math.PI/2),x=t?(Math.random()-.5)*2.5:(Math.random()-.5)*(Ze*1.3);let m=o.x+f*x,p=o.y+g*x;if(this.nearRoundabout(m,p,12))return;let v=0,w=0,M=o.angle;if(u==="golf-ball"){const S=Math.random()>.5?1:-1;m=o.x+f*Ze*1.8*S,p=o.y+g*Ze*1.8*S,v=-f*S*(14+Math.random()*12),w=-g*S*(14+Math.random()*12),M=Math.atan2(w,v)}else if(u==="alligator"){const S=Math.random()>.5?1:-1,A=3.6+Math.random()*2.2;m=o.x+f*(Ze+6)*S,p=o.y+g*(Ze+6)*S,v=-f*S*A,w=-g*S*A,M=Math.atan2(w,v)}else if(u==="wanderer"||u==="porch-police"){const S=Math.random()>.5?1:-1,A=2+Math.random()*1.4;m=o.x+f*(Ze+3.5)*S,p=o.y+g*(Ze+3.5)*S,v=-f*S*A,w=-g*S*A,M=Math.atan2(w,v)}else if(u==="turtle"){const S=1.2+Math.random()*1,A=Math.random()>.5?1:-1;v=Math.cos(o.angle)*S*A,w=Math.sin(o.angle)*S*A,M=Math.atan2(w,v)}else if(u==="cop"){M=o.angle+Math.PI;const S=2.5+Math.random()*2;v=Math.cos(M)*S,w=Math.sin(M)*S}else(u==="palm-frond"||u==="sinkhole")&&(v=0,w=0,M=o.angle+(Math.random()-.5)*.8,u==="sinkhole"&&(m=o.x+f*(Math.random()-.5)*3.2,p=o.y+g*(Math.random()-.5)*3.2));this.hazards.push({id:this.hazardId++,type:u,x:m,y:p,vx:v,vy:w,life:u==="lightning"?7:u==="sinkhole"?22:18,maxLife:u==="lightning"?7:u==="sinkhole"?22:18,active:!0,angle:M,phase:Math.random()*Math.PI*2,faceSign:1});const T=this.hazards.filter(S=>S.active);if(T.length>12){T.sort((S,A)=>S.id-A.id);for(let S=0;S<T.length-12;S++)T[S].active=!1}}updateHazards(e){for(const t of this.hazards){if(!t.active)continue;if(t.life-=e,t.x+=t.vx*e,t.y+=t.vy*e,Math.hypot(t.vx,t.vy)>.15&&(t.angle=Math.atan2(t.vy,t.vx)),this.nearRoundabout(t.x,t.y,10)){t.active=!1;continue}t.life<=0&&(t.active=!1)}this.hazards=this.hazards.filter(t=>t.active)}checkHazardHits(e){if(!(e.trapTimer>0)){e.trapIgnoreId&&!this.hazards.some(t=>t.active&&t.id===e.trapIgnoreId)&&(e.trapIgnoreId=0);for(const t of this.hazards){if(!t.active)continue;const n=Rr[t.type],s=Math.hypot(t.x-e.x,t.y-e.y);if(t.type==="sinkhole"&&e.trapIgnoreId===t.id){s>n.radius+6&&(e.trapIgnoreId=0);continue}if(s<n.radius+1.4){if(t.type==="lightning"&&e.cart.id==="cybertruck"){t.active=!1;const a=e.ammo;if(e.ammo=Math.min(Cs,e.ammo+4),e.isPlayer){zt.pickup();const r=e.ammo-a;this.pushEvent("toast",r>0?"Lightning absorbed!":"Storm cells full",r>0?`+${r} lightning bolts`:"Bolts already charged",1.8)}continue}e.effectTimer=n.duration,e.effectSpeedMul=n.speedMul,e.speed*=n.speedMul,e.hazardsHit+=1,t.type==="sinkhole"?(e.trapTimer=n.duration,e.trapIgnoreId=t.id,e.speed=0,e.steerVel=0,e.x=e.x*.35+t.x*.65,e.y=e.y*.35+t.y*.65):t.active=!1,e.isPlayer&&(e.score=Math.max(0,e.score-n.scorePenalty),zt.hazard(),this.pushEvent("toast",n.message,`−${n.scorePenalty} pts`,2.4))}}}}updatePlaces(){const e=n=>n.finished?1e3+(1e3-n.finishTime):n.lap+n.lapProgress;[...this.racers].sort((n,s)=>e(s)-e(n)).forEach((n,s)=>{n.place=s+1})}checkRaceOver(){const e=this.getPlayer();if(!e.finished)return;const t=this.racers.every(s=>s.finished),n=this.time-e.finishTime;(t||n>8)&&(this.finished=!0,this.running=!1,this.finalizeScores())}finalizeScores(){for(const e of this.racers){const t=e.place===1?1e3:e.place===2?700:e.place===3?450:250,n=e.finished?Math.max(0,500-e.finishTime*1.5):0;e.isPlayer?(e.score+=t+n+e.checkpoints.size*20,e.score=Math.round(e.score)):e.score=Math.round(t+e.lap*200+e.checkpoints.size*50)}}updateNearbyLandmark(){const e=this.getPlayer();let t=null,n=50;for(const s of Rn){const a=Math.hypot(s.x-e.x,s.y-e.y);a<n&&(n=a,t=s.shortName)}this.nearbyLandmark=t}updateHazardWarn(){const e=this.getPlayer();let t=null,n=45;for(const s of this.hazards){if(!s.active)continue;let r=Math.atan2(s.y-e.y,s.x-e.x)-e.angle;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;if(Math.abs(r)>1.1)continue;const o=Math.hypot(s.x-e.x,s.y-e.y);o<n&&(n=o,t=s)}this.upcomingHazard=t?"Watch the path!":null}getPlayer(){return this.racers.find(e=>e.isPlayer)}getResult(){const e=this.getPlayer();return{racers:[...this.racers].sort((t,n)=>t.place-n.place),player:e,timeSec:e.finishTime||this.time,score:e.score,areaName:this.areaName}}}const pr={minX:Kt.minX+20,maxX:Kt.maxX-20,minY:Kt.minY+20,maxY:Kt.maxY-20},Ia={sunset:"#e85d4c",gold:"#e8b84a"},Xn={name:"The Villages Golf Cart Hero",tagline:"Mario Kart energy. Cart-path chaos. Florida edition.",sisterApp:"The Villages Everything App",sisterAppUrl:"https://www.thevillageseverythingapp.com",playUrl:"https://www.thevillageseverythingapp.com/golf-cart-hero/",leaderboard:"Lanai Legends",leaderboardTag:"Screened-in glory. Cart-path bragging rights."},Lu="vgch-lanai-legends-v1",Al=15;function Gr(){try{const i=localStorage.getItem(Lu);if(!i)return[];const e=JSON.parse(i);return Array.isArray(e)?e.filter(t=>t&&typeof t.score=="number"&&t.playerName).sort((t,n)=>n.score-t.score).slice(0,Al):[]}catch{return[]}}function wv(i){const e=[...i].sort((t,n)=>n.score-t.score).slice(0,Al);return localStorage.setItem(Lu,JSON.stringify(e)),e}function Tv(i){const e={...i,id:`lb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,date:new Date().toISOString()},t=Gr();return t.push(e),wv(t)}function Ev(i){const e=Gr();return e.length<Al?i>0:i>(e[e.length-1]?.score??0)}function ca(){return Xn.leaderboard}function Av(){const i=localStorage.getItem("vgch-difficulty-id");return i&&zr.some(e=>e.id===i)?i:"happy-hour"}function Rv(){const i=localStorage.getItem("vgch-area-id");return i==="eastwood"?(localStorage.setItem("vgch-area-id","eastport"),"eastport"):i&&Ds.some(e=>e.id===i)?i:"spanish-springs"}class Cv{root;select={playerName:localStorage.getItem("vgch-player-name")||"",cartId:"yamaha",driverId:"alligator",areaId:Rv(),difficultyId:Av()};handlers;constructor(e,t){this.root=e,this.handlers=t}clear(){this.root.innerHTML=""}showMenu(e){this.clear();const t=Gr().slice(0,5),n=ns(),s=n?`Your cart flies a <strong>${ld(n)}</strong> supporter flag (highest tip $${n}).`:"Enjoying the chaos? Tip $1, $3, or $5 and earn a colored mascot flag on your cart.",a=e?.donateBanner?`<div class="donate-banner">${un(e.donateBanner)}</div>`:"";this.root.innerHTML=`
      <div class="screen panel-host">
        <p class="brand-kicker">From the makers of ${Xn.sisterApp}</p>
        <div class="menu-title-row">
          <img
            class="menu-mascot"
            src="${Je("assets/mascot-hero.png")}"
            alt="Golf Cart Hero mascot driving a cart"
            width="200"
            height="200"
          />
          <h1>${Xn.name}</h1>
        </div>
        <p class="tagline">${Xn.tagline}</p>
        ${a}
        <div class="panel">
          <p style="margin:0;color:var(--muted);text-align:center">
            Choose one of <strong>five themed Town Square areas</strong>, pick a cart &amp; Florida critter,
            then race a fresh local loop. Dodge gators, golf balls, and the porch police.
          </p>
          <div class="btn-row">
            <button class="btn-primary" id="btn-play">Pick a Square</button>
            <button class="btn-secondary" id="btn-how">How to Play</button>
            <button class="btn-secondary" id="btn-settings">Settings</button>
            <button class="btn-gold" id="btn-lb">${ca()}</button>
            ${fa()?"":'<button class="btn-sunset" id="btn-donate">Tip the Dev ⛳</button>'}
          </div>
          <div class="help-keys">
            <span class="key"><kbd>W</kbd>/<kbd>↑</kbd> Gas</span>
            <span class="key"><kbd>S</kbd>/<kbd>↓</kbd> Brake / Reverse</span>
            <span class="key"><kbd>A</kbd>/<kbd>←</kbd> Left</span>
            <span class="key"><kbd>D</kbd>/<kbd>→</kbd> Right</span>
            <span class="key"><kbd>Space</kbd> Fire</span>
            <span class="key"><kbd>G</kbd> Gate pass</span>
          </div>
        </div>
        ${fa()?"":`<div class="panel tight donate-teaser" id="menu-donate">
          <div class="donate-teaser-row">
            <img class="donate-mascot-sm" src="${Je("assets/mascot-logo.jpg")}" alt="Golf-ball mascot" width="72" height="72" />
            <div>
              <h2 style="font-size:1.05rem;margin:0">Buy me a cart-path coffee</h2>
              <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.88rem">${s}</p>
            </div>
          </div>
        </div>`}
        <div class="panel tight" id="menu-lb">
          <h2 style="font-size:1.15rem">🏆 ${ca()}</h2>
          <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.88rem">${Xn.leaderboardTag}</p>
          ${this.renderLeaderboardList(t)}
        </div>
        <p class="footer-note">
          Fan-made whimsical racer · not affiliated with The Villages® ·
          <a href="${Xn.sisterAppUrl}" target="_blank" rel="noopener noreferrer">${Xn.sisterApp}</a>
          · <a href="${Je("privacy.html")}">Privacy</a>
        </p>
      </div>
    `,this.root.querySelector("#btn-play").addEventListener("click",()=>{zt.unlock(),this.handlers.onStartSelect()}),this.root.querySelector("#btn-how").addEventListener("click",()=>this.handlers.onShowHow()),this.root.querySelector("#btn-settings").addEventListener("click",()=>{this.handlers.onShowSettings()}),this.root.querySelector("#btn-lb").addEventListener("click",()=>{this.showFullLeaderboard()}),this.root.querySelector("#btn-donate")?.addEventListener("click",()=>{this.handlers.onShowDonate()}),this.root.querySelector("#menu-donate")?.addEventListener("click",()=>{this.handlers.onShowDonate()}),this.scrollMenuToTop()}scrollMenuToTop(){const e=this.root.querySelector(".screen");e instanceof HTMLElement&&(e.scrollTop=0)}showDonate(e){if(fa()){this.handlers.onBackMenu();return}this.clear();const t=ns(),n=t?`Highest tip on this device: <strong>$${t}</strong> · <span class="flag-pill flag-${t}">${ld(t)} flag</span> unlocked`:"No tip yet — pick an amount below. Your highest tip keeps the matching flag forever on this browser.",s=e?.notice?`<div class="donate-banner">${un(e.notice)}</div>`:"";this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">Tip jar · Stripe secure checkout</p>
        <h1>Support Golf Cart Hero</h1>
        <p class="tagline">If you’re enjoying the ride, buy the golf-ball mascot a coffee. Tips use the same Stripe account as ${Xn.sisterApp}.</p>
        ${s}
        <div class="panel donate-panel">
          <div class="donate-hero">
            <img class="donate-mascot" src="${Je("assets/mascot-logo.jpg")}" alt="Golf-ball mascot from The Villages Everything App" width="160" height="160" />
            <div>
              <p style="margin:0;color:var(--muted);line-height:1.45">
                After you tip, every future race shows a <strong>supporter flag</strong> on the cart you pick —
                colored for your <em>highest</em> donation:
              </p>
              <ul class="donate-flag-legend">
                <li><span class="flag-swatch red"></span> <strong>$1</strong> Red flag + mascot</li>
                <li><span class="flag-swatch blue"></span> <strong>$3</strong> Blue flag + mascot</li>
                <li><span class="flag-swatch gold"></span> <strong>$5</strong> Gold flag + mascot</li>
              </ul>
              <p class="donate-status">${n}</p>
            </div>
          </div>
          <div class="donate-amounts" role="list" id="donate-amounts"></div>
          <p id="donate-error" class="donate-error" style="display:none"></p>
          <p class="donate-secure-note">Secure checkout powered by Stripe. You’ll return here after paying; the flag unlocks immediately on this device.</p>
          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back to Menu</button>
          </div>
        </div>
      </div>
    `;const a=this.root.querySelector("#donate-amounts");a.innerHTML=Sl.map(c=>`
        <button type="button" class="donate-amount-card ${t===c.amountUsd?"is-highest":""}" data-amount="${c.amountUsd}" role="listitem">
          <img src="${Je("assets/mascot-logo.jpg")}" alt="" class="donate-amount-mascot" width="48" height="48" />
          <strong>$${c.amountUsd}</strong>
          <span>${un(c.label)}</span>
          <em>${un(c.blurb)}</em>
          <span class="flag-pill flag-${c.amountUsd}">${c.flagName} flag</span>
        </button>`).join("");const r=this.root.querySelector("#donate-error"),o=c=>{a.querySelectorAll("button").forEach(l=>{l.disabled=c})};a.querySelectorAll("[data-amount]").forEach(c=>{c.addEventListener("click",async()=>{const l=Number(c.dataset.amount);if(r.style.display="none",o(!0),c.classList.add("checking-out"),!await AM()){r.textContent="Stripe isn’t configured yet. Add STRIPE_SECRET_KEY to .env.local and restart npm run dev.",r.style.display="block",o(!1),c.classList.remove("checking-out");return}const d=await TM(l);if(d.url){window.location.href=d.url;return}r.textContent=d.error||"Checkout failed",r.style.display="block",o(!1),c.classList.remove("checking-out")})}),this.root.querySelector("#btn-back").addEventListener("click",()=>{this.handlers.onBackMenu()})}showFullLeaderboard(){this.clear();const e=Gr();this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">High scores</p>
        <h1>🏆 ${ca()}</h1>
        <p class="tagline">${Xn.leaderboardTag}</p>
        <div class="panel">
          ${this.renderLeaderboardList(e)}
          <div class="btn-row">
            <button class="btn-primary" id="btn-back">Back</button>
          </div>
        </div>
      </div>
    `,this.root.querySelector("#btn-back").addEventListener("click",()=>this.handlers.onBackMenu())}renderLeaderboardList(e){return e.length?`<ol class="leaderboard">${e.map((t,n)=>{const s=zs.find(o=>o.id===t.cartId)?.shortName??t.cartId,a=Gs.find(o=>o.id===t.driverId),r=a?Ar(a):"🏎️";return`<li>
          <span class="rank">#${n+1}</span>
          <div class="who">${un(t.playerName)} ${r}
            <span>${s} · P${t.place} · ${vd(t.timeSec)}</span>
          </div>
          <span class="score">${t.score.toLocaleString()}</span>
        </li>`}).join("")}</ol>`:'<p class="empty-lb">No legends yet — finish a race to claim the first lanai seat.</p>'}showHow(){this.clear(),this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">Cart-path handbook</p>
        <h1>How to Play</h1>
        <div class="panel" style="max-width:640px">
          <p style="margin-top:0"><strong>Goal:</strong> Pick a themed Town Square area, then complete <strong>3 laps</strong> of a local cart-path loop around that square and nearby rec centers (map-placed). Fresh path every race.</p>
          <p><strong>Areas:</strong> Spanish Springs (southwest plaza) · Sumter Landing (lighthouse lakeside) · Brownwood Paddock Square (Old Florida ranch) · Eastport (mid-century charm) · Sawgrass Grove (orange-grove Market).</p>
          <p><strong>Rival skill:</strong> Lanai Learner (easy) · Happy Hour Hotshot (medium) · Turnpike Terror (hard). AI holds the cart path better as difficulty rises.</p>
          <p><strong>Camera:</strong> Mario Kart–style chase cam — behind your cart, looking down the road (not top-down).</p>
          <p><strong>Controls:</strong> WASD / arrows to drive. <strong>S / ↓</strong> brakes, then reverses. <strong>Space</strong> (or ●) to fire. <strong>G</strong> (or Pass) waves your HOA gate pass at a community gate — gates stay closed until you wave up close. On phones, tilt left/right to steer, tip the phone forward to go, and tip it back to brake. Tune how twitchy that feels in <strong>Settings</strong> — every phone and every driver is different.</p>
          <p><strong>Weapons by cart:</strong> Yamaha → golf balls · Hot Rod → fireballs · Evolution → loofahs. Limited ammo (8). Drive over matching <strong>recharge pads</strong> on the road for +3. Off-path is slow; ponds are crawl-speed.</p>
          <p><strong>Hazards</strong> appear on the road ahead — no name tags. Learn them by sight:</p>
          <ul style="color:var(--muted);line-height:1.5;margin:0;padding-left:1.2rem">
            <li>White dimpled golf ball zipping across</li>
            <li>Turtle with plated shell and little legs</li>
            <li>Green gator with snout, ridges, and tail</li>
            <li>Storm cloud with a thin blue-white lightning strike</li>
            <li>Tipsy villager (bright shirt, cup, leaning)</li>
            <li>White cart with red/blue light bar (cart cop)</li>
            <li>Older villager with cane, arm raised (“slow down!”)</li>
            <li>Palm fronds on the pavement (after a storm)</li>
            <li>Big yellow/orange pothole with cones — fall in and you’re stuck about 5 seconds</li>
          </ul>
          <p><strong>Score:</strong> Speed + landmark bonuses − hazard penalties + finish place. Top runs land on the <em>${ca()}</em> board.</p>
          ${fa()?"":"<p><strong>Tips:</strong> From the main menu, tip $1 / $3 / $5 via Stripe. Your highest tip paints a supporter flag on every cart you race — red, blue, or gold — with the golf-ball mascot logo.</p>"}
          <p><strong>Villages flavor:</strong> Every loop has several <strong>roundabouts</strong> and occasional <strong>community gates</strong>. Pull up to the post and wave your gate pass — they will not open by themselves.</p>
          <div class="btn-row">
            <button class="btn-primary" id="btn-back">Got it</button>
          </div>
        </div>
      </div>
    `,this.root.querySelector("#btn-back").addEventListener("click",()=>this.handlers.onBackMenu())}showSettings(){this.clear();const e=xa();this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">Cart-path cockpit</p>
        <h1>Settings</h1>
        <p class="tagline">Every phone and every pair of hands is different. Set how strongly the cart answers left, right, gas, and brake.</p>
        <div class="panel settings-panel">
          ${this.renderSensitivitySliders(e)}
          <div class="btn-row">
            <button class="btn-secondary" id="btn-reset-feel" type="button">Reset to default</button>
            ${Er()?'<button class="btn-secondary" id="btn-recenter-tilt" type="button">Recenter tilt</button>':""}
            <button class="btn-primary" id="btn-back">Done</button>
          </div>
        </div>
      </div>
    `,this.bindSensitivitySliders(this.root),this.root.querySelector("#btn-reset-feel")?.addEventListener("click",()=>{hd(),this.showSettings()}),this.root.querySelector("#btn-recenter-tilt")?.addEventListener("click",()=>{this.handlers.onRecenterTilt()}),this.root.querySelector("#btn-back").addEventListener("click",()=>this.handlers.onBackMenu())}renderSensitivitySliders(e){const t=dd(e.steerSens),n=dd(e.driveSens);return`
      <div class="feel-sliders">
        <label class="feel-row">
          <div class="feel-head">
            <span class="feel-title">Steering · left / right</span>
            <span class="feel-value" data-feel="steer">${Fo(t)}</span>
          </div>
          <input
            class="feel-slider"
            id="feel-steer"
            type="range"
            min="${kc}"
            max="${Ra}"
            step="1"
            value="${t}"
            aria-label="Steering sensitivity"
          />
          <div class="feel-ends"><span>Gentle</span><span>Twitchy</span></div>
          <p class="feel-hint">Phones: how far you tilt to turn. Keyboard / on-screen arrows: how quickly the cart yaws.</p>
        </label>
        <label class="feel-row">
          <div class="feel-head">
            <span class="feel-title">Drive · forward / back</span>
            <span class="feel-value" data-feel="drive">${Fo(n)}</span>
          </div>
          <input
            class="feel-slider"
            id="feel-drive"
            type="range"
            min="${kc}"
            max="${Ra}"
            step="1"
            value="${n}"
            aria-label="Gas and brake sensitivity"
          />
          <div class="feel-ends"><span>Gentle</span><span>Twitchy</span></div>
          <p class="feel-hint">Phones: how far you tip for gas or brake. Keyboard / buttons: how quickly you speed up or reverse.</p>
        </label>
      </div>
    `}bindSensitivitySliders(e){const t=e.querySelector("#feel-steer"),n=e.querySelector("#feel-drive"),s=(a,r,o)=>{if(!a)return;const c=()=>{const l=Number(a.value);IM({[r]:LM(l)});const h=e.querySelector(`[data-feel="${o}"]`);h&&(h.textContent=Fo(l))};a.addEventListener("input",c),a.addEventListener("change",c)};s(t,"steerSens","steer"),s(n,"driveSens","drive")}showAreaSelect(){this.clear();const e=this.select.areaId;this.root.innerHTML=`
      <div class="screen screen-areas">
        <p class="brand-kicker">Town Square · drive areas</p>
        <h1>Where to Race?</h1>
        <p class="tagline">Pick a Town Square. Each one has its own loop and soundtrack.</p>
        <div class="panel">
          <p class="section-label" style="margin-top:0">Choose a Town Square</p>
          <div class="choice-grid area-grid" id="areas"></div>
          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back</button>
            <button class="btn-primary" id="btn-continue">Choose Cart &amp; Driver</button>
          </div>
        </div>
      </div>
    `;const t=this.root.querySelector("#areas"),n={"spanish-springs":"Original plaza","lake-sumter":"Lake & lighthouse",brownwood:"Old Florida ranch",eastport:"East-side hub","sawgrass-grove":"Grove & market"};t.innerHTML=Ds.map(s=>`
      <button type="button" class="choice-card area-card ${s.id===e?"selected":""}" data-area="${s.id}">
        <div class="area-banner" style="background:${s.cardGradient}">
          <span class="area-emoji">${s.emoji}</span>
        </div>
        <div class="title">${un(s.shortName)}</div>
        <div class="area-theme-line">${un(n[s.id]??s.themeLine)}</div>
      </button>`).join(""),t.querySelectorAll("[data-area]").forEach(s=>{s.addEventListener("click",()=>{this.select.areaId=s.dataset.area,localStorage.setItem("vgch-area-id",this.select.areaId),t.querySelectorAll(".area-card").forEach(a=>a.classList.remove("selected")),s.classList.add("selected")})}),this.root.querySelector("#btn-back").addEventListener("click",()=>{this.handlers.onBackMenu()}),this.root.querySelector("#btn-continue").addEventListener("click",()=>{localStorage.setItem("vgch-area-id",this.select.areaId),this.showSelect()})}showSelect(){this.clear();const e=Ds.find(o=>o.id===this.select.areaId)??Ds[0];this.root.innerHTML=`
      <div class="screen screen-garage">
        <p class="brand-kicker">Garage · critter paddock</p>
        <h1>Choose Your Ride</h1>
        <div class="panel garage-panel">
          <div class="area-picked">
            <span class="area-picked-emoji">${e.emoji}</span>
            <div>
              <strong>${un(e.name)}</strong>
              <div class="sub" style="margin:0">${un(e.themeLine)}</div>
            </div>
            <button type="button" class="btn-secondary btn-compact" id="btn-change-area">Change area</button>
          </div>

          <div class="name-block" id="name-block">
            <label class="section-label name-label" for="player-name">Your racer name (required)</label>
            <input
              class="name-input"
              id="player-name"
              type="text"
              maxlength="20"
              placeholder="Type your name — e.g. Lanai Larry"
              value="${Lv(this.select.playerName)}"
              autocomplete="nickname"
              spellcheck="false"
            />
            <p id="name-hint" class="name-hint">This shows on the leaderboard, HUD, and above your cart. Every player should enter their own name.</p>
          </div>

          <p class="section-label">Rival pack skill</p>
          <div class="choice-grid area-grid" id="difficulties"></div>

          <p class="section-label">Vehicle</p>
          <div class="choice-grid" id="carts"></div>

          <p class="section-label">Driver (Florida critters)</p>
          <div class="choice-grid" id="drivers"></div>

          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back</button>
            <button class="btn-primary" id="btn-race">Hit the Cart Path</button>
          </div>
        </div>
      </div>
    `;const t=this.root.querySelector("#difficulties");t.innerHTML=zr.map(o=>`
      <button type="button" class="choice-card ${o.id===this.select.difficultyId?"selected":""}" data-diff="${o.id}">
        <div class="area-banner" style="background:${o.cardGradient}">
          <span class="area-emoji">${o.emoji}</span>
        </div>
        <div class="title">${un(o.name)}</div>
        <div class="sub">${un(o.blurb)}</div>
      </button>`).join("");const n=this.root.querySelector("#carts");n.innerHTML=zs.map(o=>`
      <button type="button" class="choice-card cart-photo-card ${o.id===this.select.cartId?"selected":""}" data-cart="${o.id}">
        <img class="cart-ref-thumb cart-photo-thumb" src="${Je(`assets/carts/refs/${o.id}.jpg`)}" alt="${o.name}" width="200" height="140" />
        <div class="title">${o.emoji} ${o.name}</div>
        <div class="sub">${o.blurb}</div>
        <div class="stat-pills">
          <span class="pill fast">Top ${Math.round(o.topSpeed)}</span>
          <span class="pill accel">Accel ${Math.round(o.accel)}</span>
          <span class="pill handle">Handle ${o.handling.toFixed(1)}</span>
        </div>
      </button>`).join("");const s=this.root.querySelector("#drivers");s.innerHTML=Gs.map(o=>`
      <button type="button" class="choice-card ${o.id===this.select.driverId?"selected":""}" data-driver="${o.id}">
        <span class="emoji">${Ar(o)}</span>
        <div class="title">${o.name}</div>
        <div class="sub">${o.species}. ${o.blurb}</div>
      </button>`).join("");const a=this.root.querySelector("#player-name"),r=()=>{this.select.playerName=a.value.slice(0,20),localStorage.setItem("vgch-player-name",this.select.playerName.trim())};a.addEventListener("input",r),a.addEventListener("change",r),this.select.playerName.trim()||setTimeout(()=>a.focus(),50),t.querySelectorAll("[data-diff]").forEach(o=>{o.addEventListener("click",()=>{r(),this.select.difficultyId=o.dataset.diff,localStorage.setItem("vgch-difficulty-id",this.select.difficultyId),this.showSelect()})}),n.querySelectorAll("[data-cart]").forEach(o=>{o.addEventListener("click",()=>{r(),this.select.cartId=o.dataset.cart,this.showSelect()})}),s.querySelectorAll("[data-driver]").forEach(o=>{o.addEventListener("click",()=>{r(),this.select.driverId=o.dataset.driver,this.showSelect()})}),this.root.querySelector("#btn-change-area").addEventListener("click",()=>{r(),this.showAreaSelect()}),this.root.querySelector("#btn-back").addEventListener("click",()=>{r(),this.showAreaSelect()}),this.root.querySelector("#btn-race").addEventListener("click",()=>{r();const o=a.value.trim().slice(0,20);if(o.length<2){a.focus(),a.style.borderColor="var(--sunset)";const c=this.root.querySelector("#name-hint");c&&(c.textContent="Please enter at least 2 characters for your racer name.",c.style.color="var(--sunset)");return}this.select.playerName=o,localStorage.setItem("vgch-player-name",o),localStorage.setItem("vgch-area-id",this.select.areaId),localStorage.setItem("vgch-difficulty-id",this.select.difficultyId),this.handlers.onRace({...this.select})})}showRaceHud(){this.clear(),this.root.innerHTML=`
      <div class="screen hud">
        <div class="hud-race">
          <div class="hud-vitals">
            <div class="hud-chip"><span class="label">Place</span><span id="hud-place">1st</span></div>
            <div class="hud-chip"><span class="label">Lap</span><span id="hud-lap">1 / 3</span></div>
          </div>
          <div class="mini-map-wrap" title="Track overview">
            <div class="mini-map-label">Map</div>
            <canvas id="minimap" width="168" height="168"></canvas>
          </div>
        </div>
        <div class="hud-center">
          <div class="wrong-way" id="hud-wrong-way" hidden>WRONG WAY</div>
          <div class="banner" id="hud-banner" style="display:none"></div>
          <div class="banner sub" id="hud-toast" style="display:none"></div>
        </div>
        <button type="button" class="btn-stop-race" id="btn-stop-race" title="End race early">■ Stop</button>
        <button type="button" class="btn-hud-settings" id="btn-hud-settings" title="Control sensitivity">⚙</button>
        <div class="hud-settings" id="hud-settings" hidden>
          <div class="hud-settings-card">
            <div class="hud-settings-top">
              <strong>Control feel</strong>
              <button type="button" class="btn-secondary btn-compact" id="hud-settings-close">Close</button>
            </div>
            ${this.renderSensitivitySliders(xa())}
            <div class="hud-settings-actions">
              <button type="button" class="btn-secondary btn-compact" id="hud-settings-reset">Reset</button>
              ${Er()?'<button type="button" class="btn-secondary btn-compact" id="hud-settings-recenter">Recenter tilt</button>':""}
            </div>
          </div>
        </div>
        <div class="touch-controls" id="touch">
          <div class="touch-pad touch-drive">
            <button class="touch-btn" data-k="left">◀</button>
            <button class="touch-btn" data-k="right">▶</button>
          </div>
          <div class="touch-pad touch-actions">
            <button class="touch-btn touch-gate" data-k="gate" aria-label="Gate pass">
              <span class="touch-btn-k">G</span>
              <span class="touch-btn-sub">Pass</span>
            </button>
            <button class="touch-btn touch-fire" data-k="fire">●</button>
            <button class="touch-btn touch-drive" data-k="brake">⬇</button>
            <button class="touch-btn touch-drive" data-k="throttle">⬆</button>
          </div>
        </div>
        <div class="tilt-hint" id="tilt-hint" hidden>
          <span>Tilt to drive · tip forward to go · back to brake</span>
          <button type="button" class="tilt-recenter" id="tilt-recenter">Recenter</button>
        </div>
      </div>
    `,this.root.querySelector("#btn-stop-race").addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.handlers.onStopRace()});const e=this.root.querySelector("#hud-settings");this.root.querySelector("#btn-hud-settings")?.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),e&&(e.hidden=!e.hidden)}),this.root.querySelector("#hud-settings-close")?.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),e&&(e.hidden=!0)}),this.root.querySelector("#hud-settings-reset")?.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),hd();const o=this.root.querySelector(".hud-settings-card")?.querySelector(".feel-sliders");o&&(o.outerHTML=this.renderSensitivitySliders(xa()),this.bindSensitivitySliders(this.root))}),this.root.querySelector("#hud-settings-recenter")?.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.handlers.onRecenterTilt()});const t=this.root.querySelector("#touch");(matchMedia("(pointer: coarse)").matches||window.innerWidth<900)&&(t.classList.add("show"),Er()&&this.setDrivePadMode("tilt")),this.bindSensitivitySliders(this.root),this.root.querySelector("#tilt-recenter")?.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.handlers.onRecenterTilt();const r=this.root.querySelector("#tilt-hint");r&&(r.classList.add("flash"),window.setTimeout(()=>r.classList.remove("flash"),700))});const s=(a,r)=>{const o=l=>{l.preventDefault(),this.handlers.onTouch(r,!0)},c=l=>{l.preventDefault(),this.handlers.onTouch(r,!1)};a.addEventListener("pointerdown",o),a.addEventListener("pointerup",c),a.addEventListener("pointerleave",c),a.addEventListener("pointercancel",c)};this.root.querySelectorAll("[data-k]").forEach(a=>{s(a,a.dataset.k)})}setDrivePadMode(e){const t=this.root.querySelector(".screen.hud"),n=this.root.querySelector("#touch"),s=this.root.querySelector("#tilt-hint");n&&(n.classList.add("show"),e==="tilt"?(t?.classList.add("tilt-drive"),n.classList.add("tilt-mode"),s&&(s.hidden=!1)):(t?.classList.remove("tilt-drive"),n.classList.remove("tilt-mode"),s&&(s.hidden=!0)))}updateHud(e){const t=this.root.querySelector("#hud-place"),n=this.root.querySelector("#hud-lap");if(!t||!n)return;t.textContent=Vc(e.place);const s=Math.min(e.lap+1,e.laps);n.textContent=`${s} / ${e.laps}`;const a=this.root.querySelector("#hud-wrong-way");a&&(a.hidden=!e.wrongWay);const r=this.root.querySelector("#hud-banner"),o=this.root.querySelector("#hud-toast");e.banner?(r.style.display="block",r.textContent=e.banner):r.style.display="none",e.toast?(o.style.display="block",o.textContent=e.toast,o.style.background=e.toast.includes("path")?"rgba(28,36,48,0.72)":"rgba(232,93,76,0.85)"):e.landmark?(o.style.display="block",o.textContent=`📍 ${e.landmark}`,o.style.background="rgba(31,107,74,0.85)"):(o.style.display="none",o.style.background="")}getMiniMapCanvas(){return this.root.querySelector("#minimap")}showResults(e,t){this.clear();const n=e.player,s=Ev(e.score),a=e.areaName?` · ${un(e.areaName)}`:"",r=e.racers.map(l=>`<div class="result-row${l.isPlayer?" you":""}">
          <strong>${Vc(l.place)}</strong>
          <div>${un(l.name)} ${Ar(l.driver)}
            <div style="font-size:0.78rem;color:var(--muted)">${l.cart.shortName}${l.finished?"":" · DNF"}</div>
          </div>
          <strong>${l.isPlayer?e.score.toLocaleString():"—"}</strong>
        </div>`).join("");this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">${s?"New lanai energy":"Race complete"}${a}</p>
        <h1>${n.place===1?"Village Champion!":n.place===2?"Silver Square!":n.place===3?"Bronze Cart Path!":"Finished!"}</h1>
        <p class="tagline">Score <strong>${e.score.toLocaleString()}</strong> · ${vd(e.timeSec)} · ${n.hazardsHit} hazards hit · ${n.checkpoints.size} landmarks</p>
        <div class="panel">
          <h2 style="font-size:1.15rem;margin-bottom:0.25rem">Finishing order</h2>
          <div class="results-grid">${r}</div>
          <div class="btn-row">
            ${t?'<button class="btn-gold" id="btn-submit" disabled>Saved ✓</button>':`<button class="btn-gold" id="btn-submit">Save to ${ca()}</button>`}
            <button class="btn-sunset" id="btn-share">Copy challenge</button>
            <button class="btn-primary" id="btn-again">Race Again</button>
            <button class="btn-secondary" id="btn-menu">Main Menu</button>
          </div>
        </div>
      </div>
    `,this.root.querySelector("#btn-again").addEventListener("click",()=>this.handlers.onPlayAgain()),this.root.querySelector("#btn-menu").addEventListener("click",()=>this.handlers.onBackMenu());const o=this.root.querySelector("#btn-share");o?.addEventListener("click",async()=>{const l=Pv(e),h=await Iv(l);o&&(o.textContent=h?"Copied ✓":"Copy failed"),window.setTimeout(()=>{o&&(o.textContent="Copy challenge")},1800)});const c=this.root.querySelector("#btn-submit");t||c.addEventListener("click",()=>{Tv({playerName:n.name,score:e.score,place:n.place,timeSec:e.timeSec,cartId:n.cart.id,driverId:n.driver.id,laps:n.lap,hazardsHit:n.hazardsHit}),c.disabled=!0,c.textContent="Saved ✓"})}}function Pv(i){const e=Vc(i.player.place),t=i.areaName?` at ${i.areaName}`:"";return`I scored ${i.score.toLocaleString()} (${e})${t} on Golf Cart Hero (Lanai Legends) — beat me: ${Xn.playUrl}`}async function Iv(i){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(i),!0}catch{}try{const e=document.createElement("textarea");e.value=i,e.setAttribute("readonly",""),e.style.position="fixed",e.style.left="-9999px",document.body.appendChild(e),e.select();const t=document.execCommand("copy");return e.remove(),t}catch{return!1}}function Vc(i){return i===1?"1st":i===2?"2nd":i===3?"3rd":`${i}th`}function vd(i){const e=Math.max(0,i),t=Math.floor(e/60),n=Math.floor(e%60),s=Math.floor(e%1*10);return`${t}:${n.toString().padStart(2,"0")}.${s}`}function un(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Lv(i){return un(i)}class Dv extends eu{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new U;e.deleteAttribute("uv");const t=new ct({side:sn}),n=new ct,s=new Ml(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const a=new F(e,t);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const r=new at(e,n,6),o=new lt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const c=new F(e,Es(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new F(e,Es(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const h=new F(e,Es(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const d=new F(e,Es(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);const u=new F(e,Es(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);const f=new F(e,Es(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Es(i){return new zp({color:0,emissive:16777215,emissiveIntensity:i})}const Nv={alligator:Je("assets/hazards/alligator.jpg"),turtle:Je("assets/hazards/turtle.jpg"),lightning:Je("assets/hazards/lightning.jpg"),wanderer:Je("assets/hazards/wanderer.jpg"),cop:Je("assets/hazards/cop.jpg"),"porch-police":Je("assets/hazards/porch-police.jpg")},Du={alligator:2.8,turtle:1.7,lightning:4.2,wanderer:3.4,cop:2.9,"porch-police":3.5},Rl=new Map;let Nu=!1,mr=null;function Uv(i){const e=document.createElement("canvas");e.width=i.naturalWidth||i.width,e.height=i.naturalHeight||i.height;const t=e.getContext("2d");t.drawImage(i,0,0);const n=t.getImageData(0,0,e.width,e.height),s=n.data;for(let r=0;r<s.length;r+=4){const o=s[r],c=s[r+1],l=s[r+2],h=Math.min(o,c,l),d=Math.max(o,c,l);if(h>235&&d-h<28)s[r+3]=0;else if(h>210&&d-h<35){const u=(h-210)/25;s[r+3]=Math.round(s[r+3]*(1-u))}}t.putImageData(n,0,0);const a=new Vs(e);return a.colorSpace=_t,a.needsUpdate=!0,a}function Fv(i){return new Promise((e,t)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>e(n),n.onerror=()=>t(new Error(`Failed to load ${i}`)),n.src=i})}function Uu(){return mr||(Nu=!0,mr=(async()=>{const i=Object.entries(Nv).filter(e=>!!e[1]);await Promise.all(i.map(async([e,t])=>{try{const n=await Fv(t),s=Uv(n),a=new Vr({map:s,transparent:!0,depthWrite:!1,alphaTest:.08,fog:!1});Rl.set(e,a)}catch(n){console.warn(`[hazards] sprite load failed for ${e}`,n)}}))})(),mr)}function Fu(i){return Rl.has(i)}function Ou(i){Nu||Uu();const e=Rl.get(i);if(!e)return null;const t=new dl(e),n=Du[i]??2.5;return t.scale.set(n*1.05,n,1),t.center.set(.5,0),t.position.y=.05,t}const Ov=Object.freeze(Object.defineProperty({__proto__:null,HAZARD_SPRITE_HEIGHT:Du,createHazardSprite:Ou,hasHazardSprite:Fu,loadHazardSprites:Uu},Symbol.toStringTag,{value:"Module"}));function yd(i,e){if(e===Cf)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Pc||e===Kd){let t=i.getIndex();if(t===null){const r=[],o=i.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)r.push(c);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===Pc)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const a=i.clone();return a.setIndex(s),a.clearGroups(),a}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function kv(i){const e=new Map,t=new Map,n=i.clone();return ku(i,n,function(s,a){e.set(a,s),t.set(s,a)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const a=s,r=e.get(s),o=r.skeleton.bones;a.skeleton=r.skeleton.clone(),a.bindMatrix.copy(r.bindMatrix),a.skeleton.bones=o.map(function(c){return t.get(c)}),a.bind(a.skeleton,a.bindMatrix)}),n}function ku(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)ku(i.children[n],e.children[n],t)}class Bv extends Ys{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Wv(t)}),this.register(function(t){return new Xv(t)}),this.register(function(t){return new ey(t)}),this.register(function(t){return new ty(t)}),this.register(function(t){return new ny(t)}),this.register(function(t){return new Yv(t)}),this.register(function(t){return new $v(t)}),this.register(function(t){return new Kv(t)}),this.register(function(t){return new Zv(t)}),this.register(function(t){return new Vv(t)}),this.register(function(t){return new Jv(t)}),this.register(function(t){return new qv(t)}),this.register(function(t){return new Qv(t)}),this.register(function(t){return new jv(t)}),this.register(function(t){return new Gv(t)}),this.register(function(t){return new Sd(t,nt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Sd(t,nt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new iy(t)})}load(e,t,n,s){const a=this;let r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){const l=ga.extractUrlBase(e);r=ga.resolveURL(l,this.path)}else r=ga.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){s?s(l):console.error(l),a.manager.itemError(e),a.manager.itemEnd(e)},c=new uu(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{a.parse(l,r,function(h){t(h),a.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let a;const r={},o={},c=new TextDecoder;if(typeof e=="string")a=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===Bu){try{r[nt.KHR_BINARY_GLTF]=new sy(e)}catch(d){s&&s(d);return}a=JSON.parse(r[nt.KHR_BINARY_GLTF].content)}else a=JSON.parse(c.decode(e));else a=e;if(a.asset===void 0||a.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new xy(a,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,r[d.name]=!0}if(a.extensionsUsed)for(let h=0;h<a.extensionsUsed.length;++h){const d=a.extensionsUsed[h],u=a.extensionsRequired||[];switch(d){case nt.KHR_MATERIALS_UNLIT:r[d]=new Hv;break;case nt.KHR_DRACO_MESH_COMPRESSION:r[d]=new ay(a,this.dracoLoader);break;case nt.KHR_TEXTURE_TRANSFORM:r[d]=new ry;break;case nt.KHR_MESH_QUANTIZATION:r[d]=new oy;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(r),l.setPlugins(o),l.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,a){n.parse(e,t,s,a)})}}function zv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Ft(i,e,t){const n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const nt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Gv{constructor(e){this.parser=e,this.name=nt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const a=t[n];a.extensions&&a.extensions[this.name]&&a.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,a.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const a=t.json,c=((a.extensions&&a.extensions[this.name]||{}).lights||[])[e];let l;const h=new Le(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],vn);const d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new wr(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Ml(h),l.distance=d;break;case"spot":l=new am(h),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),qn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,a=n.json.nodes[e],o=(a.extensions&&a.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class Hv{constructor(){this.name=nt.KHR_MATERIALS_UNLIT}getMaterialType(){return Un}extendParams(e,t,n){const s=[];e.color=new Le(1,1,1),e.opacity=1;const a=t.pbrMetallicRoughness;if(a){if(Array.isArray(a.baseColorFactor)){const r=a.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],vn),e.opacity=r[3]}a.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",a.baseColorTexture,_t))}return Promise.all(s)}}class Vv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class Wv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const a=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new He(a,a)}return Promise.all(s)}}class Xv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class qv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class Yv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new Le(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const a=n.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],vn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,_t)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class $v{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class Kv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const a=n.attenuationColor||[1,1,1];return t.attenuationColor=new Le().setRGB(a[0],a[1],a[2],vn),Promise.all(s)}}class Zv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IOR}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class Jv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const a=n.specularColorFactor||[1,1,1];return t.specularColor=new Le().setRGB(a[0],a[1],a[2],vn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,_t)),Promise.all(s)}}class jv{constructor(e){this.parser=e,this.name=nt.EXT_MATERIALS_BUMP}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class Qv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?ni:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class ey{constructor(e){this.parser=e,this.name=nt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const a=s.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,a.source,r)}}class ty{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,a=s.textures[e];if(!a.extensions||!a.extensions[t])return null;const r=a.extensions[t],o=s.images[r.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,r.source,c)}}class ny{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,a=s.textures[e];if(!a.extensions||!a.extensions[t])return null;const r=a.extensions[t],o=s.images[r.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,r.source,c)}}class Sd{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],a=this.parser.getDependency("buffer",s.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return a.then(function(o){const c=s.byteOffset||0,l=s.byteLength||0,h=s.count,d=s.byteStride,u=new Uint8Array(o,c,l);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(h,d,u,s.mode,s.filter).then(function(f){return f.buffer}):r.ready.then(function(){const f=new ArrayBuffer(h*d);return r.decodeGltfBuffer(new Uint8Array(f),h,d,u,s.mode,s.filter),f})})}else return null}}class iy{constructor(e){this.name=nt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==bn.TRIANGLES&&l.mode!==bn.TRIANGLE_STRIP&&l.mode!==bn.TRIANGLE_FAN&&l.mode!==void 0)return null;const r=n.extensions[this.name].attributes,o=[],c={};for(const l in r)o.push(this.parser.getDependency("accessor",r[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),d=h.isGroup?h.children:[h],u=l[0].count,f=[];for(const g of d){const x=new $e,m=new L,p=new ei,v=new L(1,1,1),w=new at(g.geometry,g.material,u);for(let M=0;M<u;M++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,M),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,M),c.SCALE&&v.fromBufferAttribute(c.SCALE,M),w.setMatrixAt(M,x.compose(m,p,v));for(const M in c)if(M==="_COLOR_0"){const T=c[M];w.instanceColor=new Lc(T.array,T.itemSize,T.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&g.geometry.setAttribute(M,c[M]);lt.prototype.copy.call(w,g),this.parser.assignFinalMaterial(w),f.push(w)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Bu="glTF",la=12,bd={JSON:1313821514,BIN:5130562};class sy{constructor(e){this.name=nt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,la),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Bu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-la,a=new DataView(e,la);let r=0;for(;r<s;){const o=a.getUint32(r,!0);r+=4;const c=a.getUint32(r,!0);if(r+=4,c===bd.JSON){const l=new Uint8Array(e,la+r,o);this.content=n.decode(l)}else if(c===bd.BIN){const l=la+r;this.body=e.slice(l,l+o)}r+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class ay{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=nt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,a=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,o={},c={},l={};for(const h in r){const d=Wc[h]||h.toLowerCase();o[d]=r[h]}for(const h in e.attributes){const d=Wc[h]||h.toLowerCase();if(r[h]!==void 0){const u=n.accessors[e.attributes[h]],f=Ns[u.componentType];l[d]=f.name,c[d]=u.normalized===!0}}return t.getDependency("bufferView",a).then(function(h){return new Promise(function(d,u){s.decodeDracoFile(h,function(f){for(const g in f.attributes){const x=f.attributes[g],m=c[g];m!==void 0&&(x.normalized=m)}d(f)},o,l,vn,u)})})}}class ry{constructor(){this.name=nt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class oy{constructor(){this.name=nt.KHR_MESH_QUANTIZATION}}class zu extends Ws{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,a=e*s*3+s;for(let r=0;r!==s;r++)t[r]=n[a+r];return t}interpolate_(e,t,n,s){const a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=s-t,d=(n-t)/h,u=d*d,f=u*d,g=e*l,x=g-l,m=-2*f+3*u,p=f-u,v=1-m,w=p-u+d;for(let M=0;M!==o;M++){const T=r[x+M+o],S=r[x+M+c]*h,A=r[g+M+o],_=r[g+M]*h;a[M]=v*T+w*S+m*A+p*_}return a}}const cy=new ei;class ly extends zu{interpolate_(e,t,n,s){const a=super.interpolate_(e,t,n,s);return cy.fromArray(a).normalize().toArray(a),a}}const bn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ns={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},wd={9728:Vt,9729:Wt,9984:Hd,9985:Mr,9986:da,9987:hi},Td={33071:Kn,33648:Pr,10497:Oi},zo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Wc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ii={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},hy={CUBICSPLINE:void 0,LINEAR:Sa,STEP:ya},Go={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function dy(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new ct({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:mi})),i.DefaultMaterial}function Xi(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function qn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function uy(i,e,t){let n=!1,s=!1,a=!1;for(let l=0,h=e.length;l<h;l++){const d=e[l];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(a=!0),n&&s&&a)break}if(!n&&!s&&!a)return Promise.resolve(i);const r=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const d=e[l];if(n){const u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;r.push(u)}if(s){const u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;o.push(u)}if(a){const u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;c.push(u)}}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],d=l[1],u=l[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=d),a&&(i.morphAttributes.color=u),i.morphTargetsRelative=!0,i})}function fy(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function py(i){let e;const t=i.extensions&&i.extensions[nt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ho(t.attributes):e=i.indices+":"+Ho(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Ho(i.targets[n]);return e}function Ho(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Xc(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function my(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const gy=new $e;class xy{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new zv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,a=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,a=o.indexOf("Firefox")>-1,r=a?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||a&&r<98?this.textureLoader=new xl(this.options.manager):this.textureLoader=new cm(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new uu(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,a=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){const o={scene:r[0][s.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:s.asset,parser:n,userData:{}};return Xi(a,o,s),qn(o,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,a=t.length;s<a;s++){const r=t[s].joints;for(let o=0,c=r.length;o<c;o++)e[r[o]].isBone=!0}for(let s=0,a=e.length;s<a;s++){const r=e[s];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),a=(r,o)=>{const c=this.associations.get(r);c!=null&&this.associations.set(o,c);for(const[l,h]of r.children.entries())a(h,o.children[l])};return a(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const a=e(t[s]);a&&n.push(a)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(a){return a.loadNode&&a.loadNode(t)});break;case"mesh":s=this._invokeOne(function(a){return a.loadMesh&&a.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(a){return a.loadBufferView&&a.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(a){return a.loadMaterial&&a.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(a){return a.loadTexture&&a.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(a){return a.loadAnimation&&a.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(a){return a!=this&&a.getDependency&&a.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(a,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[nt.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(a,r){n.load(ga.resolveURL(t.uri,s.path),a,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,a=t.byteOffset||0;return n.slice(a,a+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const r=zo[s.type],o=Ns[s.componentType],c=s.normalized===!0,l=new o(s.count*r);return Promise.resolve(new ln(l,r,c))}const a=[];return s.bufferView!==void 0?a.push(this.getDependency("bufferView",s.bufferView)):a.push(null),s.sparse!==void 0&&(a.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),a.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(a).then(function(r){const o=r[0],c=zo[s.type],l=Ns[s.componentType],h=l.BYTES_PER_ELEMENT,d=h*c,u=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let x,m;if(f&&f!==d){const p=Math.floor(u/f),v="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let w=t.cache.get(v);w||(x=new l(o,p*f,s.count*f/h),w=new iu(x,f/h),t.cache.add(v,w)),m=new Ta(w,c,u%f/h,g)}else o===null?x=new l(s.count*c):x=new l(o,u,s.count*c),m=new ln(x,c,g);if(s.sparse!==void 0){const p=zo.SCALAR,v=Ns[s.sparse.indices.componentType],w=s.sparse.indices.byteOffset||0,M=s.sparse.values.byteOffset||0,T=new v(r[1],w,s.sparse.count*p),S=new l(r[2],M,s.sparse.count*c);o!==null&&(m=new ln(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let A=0,_=T.length;A<_;A++){const b=T[A];if(m.setX(b,S[A*c]),c>=2&&m.setY(b,S[A*c+1]),c>=3&&m.setZ(b,S[A*c+2]),c>=4&&m.setW(b,S[A*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,a=t.textures[e].source,r=t.images[a];let o=this.textureLoader;if(r.uri){const c=n.manager.getHandler(r.uri);c!==null&&(o=c)}return this.loadTextureImage(e,a,o)}loadTextureImage(e,t,n){const s=this,a=this.json,r=a.textures[e],o=a.images[t],c=(o.uri||o.bufferView)+":"+r.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=r.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const u=(a.samplers||{})[r.sampler]||{};return h.magFilter=wd[u.magFilter]||Wt,h.minFilter=wd[u.minFilter]||hi,h.wrapS=Td[u.wrapS]||Oi,h.wrapT=Td[u.wrapT]||Oi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Vt&&h.minFilter!==Wt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,s=this.json,a=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const r=s.images[e],o=self.URL||self.webkitURL;let c=r.uri||"",l=!1;if(r.bufferView!==void 0)c=n.getDependency("bufferView",r.bufferView).then(function(d){l=!0;const u=new Blob([d],{type:r.mimeType});return c=o.createObjectURL(u),c});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(d){return new Promise(function(u,f){let g=u;t.isImageBitmapLoader===!0&&(g=function(x){const m=new Xt(x);m.needsUpdate=!0,u(m)}),t.load(ga.resolveURL(d,a.path),g,void 0,f)})}).then(function(d){return l===!0&&o.revokeObjectURL(c),qn(d,r),d.userData.mimeType=r.mimeType||my(r.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){const a=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),a.extensions[nt.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[nt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=a.associations.get(r);r=a.extensions[nt.KHR_TEXTURE_TRANSFORM].extendTexture(r,o),a.associations.set(r,c)}}return s!==void 0&&(r.colorSpace=s),e[t]=r,r})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,a=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new ou,An.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new ru,An.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(s||a||r){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),a&&(o+="vertex-colors:"),r&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),a&&(c.vertexColors=!0),r&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return ct}loadMaterial(e){const t=this,n=this.json,s=this.extensions,a=n.materials[e];let r;const o={},c=a.extensions||{},l=[];if(c[nt.KHR_MATERIALS_UNLIT]){const d=s[nt.KHR_MATERIALS_UNLIT];r=d.getMaterialType(),l.push(d.extendParams(o,a,t))}else{const d=a.pbrMetallicRoughness||{};if(o.color=new Le(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],vn),o.opacity=u[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",d.baseColorTexture,_t)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),r=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}a.doubleSided===!0&&(o.side=nn);const h=a.alphaMode||Go.OPAQUE;if(h===Go.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Go.MASK&&(o.alphaTest=a.alphaCutoff!==void 0?a.alphaCutoff:.5)),a.normalTexture!==void 0&&r!==Un&&(l.push(t.assignTexture(o,"normalMap",a.normalTexture)),o.normalScale=new He(1,1),a.normalTexture.scale!==void 0)){const d=a.normalTexture.scale;o.normalScale.set(d,d)}if(a.occlusionTexture!==void 0&&r!==Un&&(l.push(t.assignTexture(o,"aoMap",a.occlusionTexture)),a.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=a.occlusionTexture.strength)),a.emissiveFactor!==void 0&&r!==Un){const d=a.emissiveFactor;o.emissive=new Le().setRGB(d[0],d[1],d[2],vn)}return a.emissiveTexture!==void 0&&r!==Un&&l.push(t.assignTexture(o,"emissiveMap",a.emissiveTexture,_t)),Promise.all(l).then(function(){const d=new r(o);return a.name&&(d.name=a.name),qn(d,a),t.associations.set(d,{materials:e}),a.extensions&&Xi(s,d,a),d})}createUniqueName(e){const t=gt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function a(o){return n[nt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return Ed(c,o,t)})}const r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=py(l),d=s[h];if(d)r.push(d.promise);else{let u;l.extensions&&l.extensions[nt.KHR_DRACO_MESH_COMPRESSION]?u=a(l):u=Ed(new Ot,l,t),s[h]={primitive:l,promise:u},r.push(u)}}return Promise.all(r)}loadMesh(e){const t=this,n=this.json,s=this.extensions,a=n.meshes[e],r=a.primitives,o=[];for(let c=0,l=r.length;c<l;c++){const h=r[c].material===void 0?dy(this.cache):this.getDependency("material",r[c].material);o.push(h)}return o.push(t.loadGeometries(r)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],d=[];for(let f=0,g=h.length;f<g;f++){const x=h[f],m=r[f];let p;const v=l[f];if(m.mode===bn.TRIANGLES||m.mode===bn.TRIANGLE_STRIP||m.mode===bn.TRIANGLE_FAN||m.mode===void 0)p=a.isSkinnedMesh===!0?new Tp(x,v):new F(x,v),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===bn.TRIANGLE_STRIP?p.geometry=yd(p.geometry,Kd):m.mode===bn.TRIANGLE_FAN&&(p.geometry=yd(p.geometry,Pc));else if(m.mode===bn.LINES)p=new Ip(x,v);else if(m.mode===bn.LINE_STRIP)p=new ml(x,v);else if(m.mode===bn.LINE_LOOP)p=new Lp(x,v);else if(m.mode===bn.POINTS)p=new Dp(x,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&fy(p,a),p.name=t.createUniqueName(a.name||"mesh_"+e),qn(p,a),m.extensions&&Xi(s,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,g=d.length;f<g;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return a.extensions&&Xi(s,d[0],a),d[0];const u=new Tt;a.extensions&&Xi(s,u,a),t.associations.set(u,{meshes:e});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new cn(ap.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new qr(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),qn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,a=t.joints.length;s<a;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const a=s.pop(),r=s,o=[],c=[];for(let l=0,h=r.length;l<h;l++){const d=r[l];if(d){o.push(d);const u=new $e;a!==null&&u.fromArray(a.array,l*16),c.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new fl(o,c)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],a=s.name?s.name:"animation_"+e,r=[],o=[],c=[],l=[],h=[];for(let d=0,u=s.channels.length;d<u;d++){const f=s.channels[d],g=s.samplers[f.sampler],x=f.target,m=x.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,v=s.parameters!==void 0?s.parameters[g.output]:g.output;x.node!==void 0&&(r.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",v)),l.push(g),h.push(x))}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(d){const u=d[0],f=d[1],g=d[2],x=d[3],m=d[4],p=[];for(let w=0,M=u.length;w<M;w++){const T=u[w],S=f[w],A=g[w],_=x[w],b=m[w];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const C=n._createAnimationTracks(T,S,A,_,b);if(C)for(let P=0;P<C.length;P++)p.push(C[P])}const v=new Zp(a,void 0,p);return qn(v,s),v})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(a){const r=n._getNodeRef(n.meshCache,s.mesh,a);return s.weights!==void 0&&r.traverse(function(o){if(o.isMesh)for(let c=0,l=s.weights.length;c<l;c++)o.morphTargetInfluences[c]=s.weights[c]}),r})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],a=n._loadNodeShallow(e),r=[],o=s.children||[];for(let l=0,h=o.length;l<h;l++)r.push(n.getDependency("node",o[l]));const c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([a,Promise.all(r),c]).then(function(l){const h=l[0],d=l[1],u=l[2];u!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(u,gy)});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);if(h.userData.pivot!==void 0&&d.length>0){const f=h.userData.pivot,g=d[0];h.pivot=new L().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const a=t.nodes[e],r=a.name?s.createUniqueName(a.name):"",o=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),a.camera!==void 0&&o.push(s.getDependency("camera",a.camera).then(function(l){return s._getNodeRef(s.cameraCache,a.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(a.isBone===!0?h=new au:l.length>1?h=new Tt:l.length===1?h=l[0]:h=new lt,h!==l[0])for(let d=0,u=l.length;d<u;d++)h.add(l[d]);if(a.name&&(h.userData.name=a.name,h.name=r),qn(h,a),a.extensions&&Xi(n,h,a),a.matrix!==void 0){const d=new $e;d.fromArray(a.matrix),h.applyMatrix4(d)}else a.translation!==void 0&&h.position.fromArray(a.translation),a.rotation!==void 0&&h.quaternion.fromArray(a.rotation),a.scale!==void 0&&h.scale.fromArray(a.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(a.mesh!==void 0&&s.meshCache.refs[a.mesh]>1){const d=s.associations.get(h);s.associations.set(h,{...d})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,a=new Tt;n.name&&(a.name=s.createUniqueName(n.name)),qn(a,n),n.extensions&&Xi(t,a,n);const r=n.nodes||[],o=[];for(let c=0,l=r.length;c<l;c++)o.push(s.getDependency("node",r[c]));return Promise.all(o).then(function(c){for(let h=0,d=c.length;h<d;h++){const u=c[h];u.parent!==null?a.add(kv(u)):a.add(u)}const l=h=>{const d=new Map;for(const[u,f]of s.associations)(u instanceof An||u instanceof Xt)&&d.set(u,f);return h.traverse(u=>{const f=s.associations.get(u);f!=null&&d.set(u,f)}),d};return s.associations=l(a),a})}_createAnimationTracks(e,t,n,s,a){const r=[],o=e.name?e.name:e.uuid,c=[];function l(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}Ii[a.path]===Ii.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(o);let h;switch(Ii[a.path]){case Ii.weights:h=Ea;break;case Ii.rotation:h=Aa;break;case Ii.translation:case Ii.scale:h=Br;break;default:n.itemSize===1?h=Ea:h=Br;break}const d=s.interpolation!==void 0?hy[s.interpolation]:Sa,u=this._getArrayFromAccessor(n);for(let f=0,g=c.length;f<g;f++){const x=new h(c[f]+"."+Ii[a.path],t.array,u,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),r.push(x)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Xc(t.constructor),s=new Float32Array(t.length);for(let a=0,r=t.length;a<r;a++)s[a]=t[a]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof Aa?ly:zu;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function _y(i,e,t){const n=e.attributes,s=new yi;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(s.set(new L(c[0],c[1],c[2]),new L(l[0],l[1],l[2])),o.normalized){const h=Xc(Ns[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const a=e.targets;if(a!==void 0){const o=new L,c=new L;for(let l=0,h=a.length;l<h;l++){const d=a[l];if(d.POSITION!==void 0){const u=t.json.accessors[d.POSITION],f=u.min,g=u.max;if(f!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),u.normalized){const x=Xc(Ns[u.componentType]);c.multiplyScalar(x)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;const r=new ti;s.getCenter(r.center),r.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=r}function Ed(i,e,t){const n=e.attributes,s=[];function a(r,o){return t.getDependency("accessor",r).then(function(c){i.setAttribute(o,c)})}for(const r in n){const o=Wc[r]||r.toLowerCase();o in i.attributes||s.push(a(n[r],o))}if(e.indices!==void 0&&!i.index){const r=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(r)}return it.workingColorSpace!==vn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${it.workingColorSpace}" not supported.`),qn(i,e),_y(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?uy(i,e.targets,t):i})}const Ad={yamaha:Je("assets/models/carts/yamaha.glb"),evolution:Je("assets/models/carts/evolution.glb"),hotrod:Je("assets/models/carts/hotrod.glb"),cybertruck:Je("assets/models/carts/cybertruck.glb")},Cl={};let gr=null;function My(i){return i.traverse(e=>{const t=e;if(t.isMesh){t.castShadow=!0,t.receiveShadow=!0;const n=Array.isArray(t.material)?t.material:[t.material];for(const s of n){const a=s;a?.map&&(a.map.colorSpace=_t)}}}),i}function vy(){return gr||(gr=(async()=>{const i=new Bv,e=Object.keys(Ad);await Promise.all(e.map(t=>new Promise(n=>{i.load(Ad[t],s=>{Cl[t]=My(s.scene),console.info(`[cartGlb] Loaded ${t}.glb`),n()},void 0,s=>{console.warn(`[cartGlb] Failed to load ${t}.glb — procedural fallback`,s),n()})})))})(),gr)}function Gu(i){return!!Cl[i]}function Hu(i){const e=Cl[i];if(!e)return null;const t=e.clone(!0);t.traverse(s=>{const a=s;a.isMesh&&a.material&&(Array.isArray(a.material)?a.material=a.material.map(r=>r.clone()):a.material=a.material.clone())}),i==="cybertruck"&&yy(t);const n=new Tt;return n.name=`cart-glb-${i}`,n.add(t),n}function yy(i){const e=new Le("#f2f5f9");i.traverse(t=>{const n=t;if(!n.isMesh||!n.material)return;const s=Array.isArray(n.material)?n.material:[n.material];for(const a of s){const r=a;if(!r?.isMeshStandardMaterial||r.emissive&&r.emissive.getHex()>0||r.transparent)continue;const o=r.color.r*.3+r.color.g*.4+r.color.b*.2;(r.metalness>.35||o>.4)&&(r.color.copy(e),r.metalness=.92,r.roughness=.1,r.envMapIntensity=2.15,r.needsUpdate=!0)}})}const Sy=Object.freeze(Object.defineProperty({__proto__:null,cloneCartGlb:Hu,hasCartGlb:Gu,loadCartGlbs:vy},Symbol.toStringTag,{value:"Module"})),by=new xl;let xr=null,Rd=!1;function wy(){return xr||(Rd||(Rd=!0,by.load(Je("assets/mascot-logo.jpg"),i=>{i.colorSpace=_t,xr=i;for(const e of qc)e.map=i,e.color.setHex(16777215),e.needsUpdate=!0;qc.length=0},void 0,()=>{console.warn("[assets] Could not load mascot-logo.jpg for donor flags")})),xr)}const qc=[];function ze(i,e=.7,t=.2){return new ct({color:i,roughness:e,metalness:t})}function G(i,e,t,n,s,a){const r=new F(i,e);return r.position.set(t,n,s),(a?.sx!=null||a?.sy!=null||a?.sz!=null)&&r.scale.set(a.sx??1,a.sy??1,a.sz??1),a?.rx&&(r.rotation.x=a.rx),a?.ry&&(r.rotation.y=a.ry),a?.rz&&(r.rotation.z=a.rz),r.castShadow=a?.cast!==!1,r.receiveShadow=!0,r}function Ty(i,e,t,n,s,a){const r=new Tt;t&&r.scale.setScalar(i.id==="cybertruck"?1.04:1.14);const o=Gu(i.id)?Hu(i.id):null;if(o?r.add(o):i.id==="cybertruck"?Py(r):i.id==="evolution"?Ly(r,i,n):i.id==="hotrod"?Dy(r,i,n):Iy(r,i,n),i.id!=="cybertruck"&&Ay(r,i,e),t){const c=(s||"YOU").slice(0,16),l=Vu(c,"#1c2430",Ia.gold),h=i.id==="cybertruck"?2.45:2.15;l.position.set(0,h,i.id==="evolution"?.1:i.id==="cybertruck"?.2:.05),l.scale.set(Math.max(2.2,c.length*.28),.7,1),l.name="nameplate",r.add(l),a&&Ey(r,i,a)}return r.rotation.order="YXZ",r}function Ey(i,e,t){const n=new Tt;n.name="donation-flag";const s=SM(t),a=e.id==="cybertruck"?-1.85:e.id==="evolution"?-1.15:e.id==="hotrod"?-1.05:-1.2,r=e.id==="cybertruck"?1.35:1.2;n.position.set(.55,r,a);const o=ze("#4a4038",.65,.35),c=ze(s,.45,.4);n.add(G(new Oe(.028,.032,1.05,8),o,0,.52,0,{cast:!1})),n.add(G(new ke(.05,8,8),c,0,1.08,0,{cast:!1}));const l=new ct({color:s,roughness:.75,metalness:t===5?.45:.12,side:nn}),h=new F(new Mi(.72,.48),l);if(h.position.set(.38,.82,0),h.rotation.y=Math.PI/2,h.castShadow=!1,h.receiveShadow=!1,n.add(h),t===5){const g=new F(new Mi(.74,.06),new ct({color:"#fff3c4",roughness:.35,metalness:.7,side:nn}));g.position.set(.38,1.04,0),g.rotation.y=Math.PI/2,n.add(g)}const d=new Un({color:s,transparent:!0,side:nn,depthWrite:!1}),u=wy();u?(d.map=u,d.color.setHex(16777215)):qc.push(d);const f=new F(new xn(.16,20),d);f.position.set(.4,.82,.01),f.rotation.y=Math.PI/2,n.add(f),n.rotation.z=-.08,n.rotation.y=.15,i.add(n)}function Ay(i,e,t){const n=e.id==="evolution"?.22:e.id==="hotrod"?.08:.12,s=.28,a=1.08,r=1,o=ze(Cy(t),.75,.08),c=ze("#f5efe4",.8,.05);i.add(G(new ke(.28*r,14,12),o,s,a+.22*r,n,{sx:.95,sy:1.05,sz:.85})),i.add(G(new ke(.16*r,12,10),c,s,a+.12*r,n+.12*r,{sx:1.1,sy:.9,sz:.7,cast:!1})),i.add(G(new ke(.2*r,12,10),o,s,a+.52*r,n+.02,{sx:1,sy:.95,sz:.9}));const l=Vu(Ar(t),"#000","transparent");l.position.set(s,a+.58*r,n+.02);const h=1.85*r;l.scale.set(h,h,1),l.name="driver-emoji",i.add(l),Ry(i,s,a,n,o)}function Ry(i,e,t,n,s){const a=new Tt;a.name="gate-pass-arm",a.position.set(e+.26,t+.38,n+.06),a.rotation.z=.85,a.rotation.x=.15;const r=new F(new gl(.045,.22,4,8),s);r.position.set(.14,0,0),r.rotation.z=Math.PI/2,a.add(r);const o=new F(new U(.2,.13,.012),ze("#f4efe4",.55,.08));o.position.set(.3,.02,.02),o.rotation.y=.15,a.add(o);const c=new F(new U(.2,.028,.014),ze("#1f6b4a",.45,.1));c.position.set(.3,.045,.02),a.add(c);const l=new F(new U(.04,.03,.015),ze("#e8b84a",.3,.7));l.position.set(.24,-.01,.022),a.add(l),i.add(a)}function Cy(i){const e=i.id;return e==="alligator"?"#3d7a48":e==="turtle"?"#5a8a40":e==="manatee"?"#8a9aaa":e==="armadillo"?"#9a8060":e==="raccoon"?"#6a6058":e==="pelican"?"#e8e0d0":e==="ibis"?"#f0f0f0":e==="otter"?"#8a6a48":i.color||"#6a8a5a"}function Py(i){const e=ze("#f2f5f9",.1,.92),t=ze("#141416",.82,.12),n=ze("#2a2c30",.78,.08),s=new ct({color:"#14161a",roughness:.08,metalness:.7,transparent:!0,opacity:.9}),a=new ct({color:"#f4f7fb",emissive:"#eef4ff",emissiveIntensity:1.2,roughness:.15,metalness:.4}),r=new ct({color:"#ff2a2a",emissive:"#ff1a1a",emissiveIntensity:1.1,roughness:.25,metalness:.3}),o=ze("#0c0c0e",.94,.04),c=ze("#161618",.55,.35);i.add(G(new U(1.72,.78,2.4),e,0,.9,.35)),i.add(G(new U(1.7,.16,3.4),n,0,.36,.05,{cast:!1})),i.add(G(new U(1.22,.03,.85),s,0,1.42,.82,{rx:.52,cast:!1})),i.add(G(new U(.03,.3,.82),s,-.91,1.36,.1,{cast:!1})),i.add(G(new U(.03,.3,.82),s,.91,1.36,.1,{cast:!1})),i.add(G(new U(1.58,.045,.06),a,0,.78,1.92,{cast:!1})),i.add(G(new U(1.68,.055,1.64),t,0,1.42,-1.15,{rx:-.35})),i.add(G(new U(.1,1.15,1.42),e,-.84,1.05,-1.2)),i.add(G(new U(.1,1.15,1.42),e,.84,1.05,-1.2)),i.add(G(new U(1.68,.7,.08),e,0,.82,-1.9,{rx:.04})),i.add(G(new U(1.58,.05,.05),r,0,1.16,-1.94,{cast:!1})),i.add(G(new U(1.72,.22,.32),t,0,.4,-2.02));const l=1.5,h=2.15,d=.46;for(const[u,f]of[[-l/2,h/2],[l/2,h/2],[-l/2,-h/2],[l/2,-h/2]]){const g=new F(new Oe(d,d,.32,24),o);g.rotation.z=Math.PI/2,g.position.set(u,.46,f),g.castShadow=!0,i.add(g);const x=new F(new Oe(d*.78,d*.78,.34,22),c);x.rotation.z=Math.PI/2,x.position.set(u,.46,f),i.add(x)}}function Iy(i,e,t){const n=ze("#f7f7f5",.22,.48),s=ze("#ecece8",.32,.38),a=ze("#121214",.48,.32),r=ze("#1a1a1c",.78,.12),o=ze("#2a2a2e",.82,.1),c=ze("#f0ebe4",.68,.08),l=ze("#c4c8cc",.28,.78),h=ze("#141416",.92,.05),d=ze("#fff8e8",.12,.95),u=ze("#e8a030",.4,.35);i.add(G(new U(1.55,.12,2.6),r,0,.36,0)),i.add(G(new U(.14,.07,1.7),a,-.8,.34,-.05)),i.add(G(new U(.14,.07,1.7),a,.8,.34,-.05)),i.add(G(new U(1.42,.48,2),n,0,.72,-.1)),i.add(G(new ke(.45,16,12),n,-.62,.62,.15,{sx:.55,sy:.75,sz:1.8})),i.add(G(new ke(.45,16,12),n,.62,.62,.15,{sx:.55,sy:.75,sz:1.8})),i.add(G(new U(1.28,.5,.78),n,0,.74,1.1)),i.add(G(new ke(.62,18,14),n,0,.72,1.05,{sx:1.05,sy:.58,sz:.82})),i.add(G(new ke(.5,16,14),n,-.58,.55,1,{sx:.78,sy:.88,sz:1.2})),i.add(G(new ke(.5,16,14),n,.58,.55,1,{sx:.78,sy:.88,sz:1.2})),i.add(G(new U(1.22,.2,.32),a,0,.4,1.45)),i.add(G(new U(1.05,.1,.14),r,0,.48,1.55)),i.add(G(new Oe(.1,.11,.09,14),d,-.38,.66,1.5,{rx:Math.PI/2})),i.add(G(new Oe(.1,.11,.09,14),d,.38,.66,1.5,{rx:Math.PI/2})),i.add(G(new Jt(.11,.018,8,16),a,-.38,.66,1.5,{cast:!1})),i.add(G(new Jt(.11,.018,8,16),a,.38,.66,1.5,{cast:!1})),i.add(G(new U(.12,.05,.04),u,-.72,.72,1.15,{cast:!1})),i.add(G(new U(.12,.05,.04),u,.72,.72,1.15,{cast:!1})),i.add(G(new Oe(.1,.1,.04,16),a,0,.72,1.52,{rx:Math.PI/2})),i.add(G(new Oe(.07,.07,.03,16),l,0,.72,1.54,{rx:Math.PI/2,cast:!1})),i.add(G(new U(1.42,.48,.62),n,0,.72,-1.2)),i.add(G(new ke(.44,14,12),n,-.55,.56,-1.12,{sx:.72,sy:.78,sz:1.1})),i.add(G(new ke(.44,14,12),n,.55,.56,-1.12,{sx:.72,sy:.78,sz:1.1})),i.add(G(new U(.95,.08,.05),ze("#c02828",.35,.45),0,.7,-1.52)),i.add(G(new U(.55,.08,.03),a,.72,.58,-.35,{cast:!1})),i.add(G(new U(1.28,.22,.4),r,0,.98,.5)),i.add(G(new U(.55,.06,.22),l,0,1.08,.48,{cast:!1})),i.add(G(new Oe(.04,.05,.36,8),a,.32,.95,.36,{rx:.9}));const f=new F(new Jt(.19,.03,10,18),a);f.position.set(.32,1.1,.3),f.rotation.x=Math.PI/2.35,i.add(f),i.add(G(new U(.055,.62,.055),a,-.68,1.22,.55)),i.add(G(new U(.055,.62,.055),a,.68,1.22,.55)),i.add(G(new U(1.4,.05,.05),a,0,1.55,.55)),i.add(G(new U(1.38,.05,.05),a,0,.95,.58)),i.add(G(new U(1.35,.04,.04),a,0,1.25,.56)),i.add(G(new U(1.3,.55,.035),t.glass,0,1.25,.56,{rx:-.06,cast:!1})),i.add(G(new U(.14,.1,.08),a,-.78,1.35,.52)),i.add(G(new U(.14,.1,.08),a,.78,1.35,.52)),i.add(G(new U(.1,.08,.02),l,-.78,1.35,.58,{cast:!1})),i.add(G(new U(.1,.08,.02),l,.78,1.35,.58,{cast:!1}));for(const g of[-.34,.34])i.add(G(new U(.5,.16,.52),o,g,.96,.02)),i.add(G(new U(.42,.12,.44),c,g,1.03,.02,{cast:!1})),i.add(G(new U(.5,.58,.15),o,g,1.3,-.24)),i.add(G(new U(.4,.45,.1),c,g,1.32,-.2,{cast:!1})),i.add(G(new U(.34,.16,.12),c,g,1.62,-.24));i.add(G(new U(1.28,.15,.44),o,0,.96,-.8)),i.add(G(new U(1.18,.1,.36),c,0,1.02,-.8,{cast:!1})),i.add(G(new U(1.28,.52,.13),o,0,1.26,-1.02)),i.add(G(new U(1.18,.42,.09),c,0,1.28,-.98,{cast:!1})),i.add(G(new U(.1,.3,.48),s,-.72,1,-.05)),i.add(G(new U(.1,.3,.48),s,.72,1,-.05)),Pl(i,{track:1,wheelBase:1.62,radius:.42,width:.32,y:.42,tire:h,rim:a,hub:l,spokes:!0,spokeColor:a})}function Ly(i,e,t){const n=ze("#2fd0e0",.3,.48),s=ze("#5ee0ec",.32,.42),a=ze("#121418",.5,.3),r=ze("#1e2228",.65,.2),o=ze("#eef3f6",.78,.08),c=ze("#4ec8d8",.45,.3),l=ze("#ff7a28",.35,.4),h=ze("#e85a10",.4,.35),d=ze("#141416",.92,.05),u=ze("#e8f6ff",.15,.9),f=ze("#c0c6cc",.3,.7);i.add(G(new U(1.68,.14,2.55),r,0,.36,0)),i.add(G(new U(1.52,.5,2.15),n,0,.72,-.08)),i.add(G(new U(1.7,.28,2.35),a,0,.48,-.05)),i.add(G(new U(.22,.07,1.7),a,-.9,.34,-.05)),i.add(G(new U(.22,.07,1.7),a,.9,.34,-.05));for(const m of[.25,-.35])i.add(G(new U(.18,.03,.08),f,-.9,.38,m,{cast:!1})),i.add(G(new U(.18,.03,.08),f,.9,.38,m,{cast:!1}));i.add(G(new U(1.55,.52,.7),n,0,.74,1.28)),i.add(G(new U(.7,.18,.55),s,0,.95,1.2)),i.add(G(new U(1.4,.18,.35),a,0,.42,1.52)),i.add(G(new U(.28,.22,.06),r,0,.78,1.62)),i.add(G(new Oe(.08,.08,.04,10),f,0,.78,1.65,{rx:Math.PI/2,cast:!1})),i.add(G(new U(.42,.1,.07),u,-.48,.72,1.6)),i.add(G(new U(.42,.1,.07),u,.48,.72,1.6)),i.add(G(new U(.48,.16,.05),a,-.48,.72,1.56,{cast:!1})),i.add(G(new U(.48,.16,.05),a,.48,.72,1.56,{cast:!1})),i.add(G(new ke(.48,14,12),n,-.72,.55,1.15,{sx:.78,sy:.88,sz:1.2})),i.add(G(new ke(.48,14,12),n,.72,.55,1.15,{sx:.78,sy:.88,sz:1.2})),i.add(G(new Jt(.38,.06,8,16),a,-.72,.42,1.15,{rx:Math.PI/2,cast:!1})),i.add(G(new Jt(.38,.06,8,16),a,.72,.42,1.15,{rx:Math.PI/2,cast:!1}));for(const m of[.15,-.55])i.add(G(new Oe(.2,.2,.06,16),a,-.84,.78,m,{rz:Math.PI/2})),i.add(G(new Jt(.16,.035,8,16),f,-.84,.78,m,{rz:Math.PI/2,cast:!1})),i.add(G(new Oe(.2,.2,.06,16),a,.84,.78,m,{rz:Math.PI/2})),i.add(G(new Jt(.16,.035,8,16),f,.84,.78,m,{rz:Math.PI/2,cast:!1}));i.add(G(new U(.06,.1,2.2),s,-.88,.55,-.15,{cast:!1})),i.add(G(new U(.06,.1,2.2),s,.88,.55,-.15,{cast:!1})),i.add(G(new U(1.58,.48,.55),n,0,.72,-1.45)),i.add(G(new ke(.42,12,10),n,-.65,.55,-1.35,{sx:.7,sy:.8,sz:1.05})),i.add(G(new ke(.42,12,10),n,.65,.55,-1.35,{sx:.7,sy:.8,sz:1.05})),i.add(G(new U(1,.1,.06),ze("#ff4040",.35,.5),0,.75,-1.72)),i.add(G(new U(.06,.62,.06),f,-.74,1.22,.7)),i.add(G(new U(.06,.62,.06),f,.74,1.22,.7)),i.add(G(new U(1.52,.06,.06),f,0,1.55,.68)),i.add(G(new U(1.5,.05,.05),a,0,.95,.76)),i.add(G(new U(1.44,.58,.04),t.glass,0,1.25,.7,{rx:-.1,cast:!1})),i.add(G(new U(.04,.45,.03),a,-.12,1.22,.76,{rz:.28,cast:!1})),i.add(G(new U(.08,.5,.45),n,-.84,1.2,-1.25)),i.add(G(new U(.08,.5,.45),n,.84,1.2,-1.25)),i.add(G(new U(.08,.06,.22),a,-.9,1.38,.62)),i.add(G(new U(.15,.12,.06),a,-.98,1.4,.52)),i.add(G(new U(.08,.06,.22),a,.9,1.38,.62)),i.add(G(new U(.15,.12,.06),a,.95,1.4,.52));const g=[.25,-.55];for(const m of g)for(const p of[-.36,.36])i.add(G(new U(.5,.15,.44),o,p,.98,m)),i.add(G(new U(.5,.55,.12),o,p,1.28,m-.2)),i.add(G(new U(.28,.13,.1),o,p,1.58,m-.2)),i.add(G(new U(.08,.11,.36),c,p-.26,1.1,m)),i.add(G(new U(.08,.11,.36),c,p+.26,1.1,m));i.add(G(new U(1.4,.28,.42),r,0,.98,.58)),i.add(G(new U(.45,.08,.22),s,0,1.1,.55,{cast:!1}));const x=new F(new Jt(.17,.028,8,14),a);x.position.set(.32,1.15,.42),x.rotation.x=Math.PI/2.35,i.add(x),i.add(G(new Oe(.04,.05,.32,8),a,.32,1,.48,{rx:.85})),Pl(i,{track:1.08,wheelBase:1.65,radius:.45,width:.35,y:.45,tire:d,rim:l,hub:h,spokes:!0,spokeColor:l})}function Dy(i,e,t){const n=ze("#2a72c4",.24,.58),s=ze("#1c5a9e",.28,.52),a=ze("#3a82d4",.26,.55),r=ze("#e8ecf0",.28,.62),o=ze("#d4d9e0",.36,.5),c=ze("#f0f4f6",.14,.95),l=ze("#121214",.52,.28),h=ze("#1a1a1c",.8,.12),d=ze("#2a4f9a",.7,.15),u=ze("#d4dae4",.68,.1),f=ze("#7ec8f0",.32,.42),g=ze("#b0e4ff",.28,.48),x=ze("#101012",.92,.05),m=ze("#fff8e0",.14,.95);i.add(G(new U(1.55,.12,2.4),h,0,.36,0)),i.add(G(new U(.2,.06,1.15),o,-.84,.32,-.05)),i.add(G(new U(.2,.06,1.15),o,.84,.32,-.05)),i.add(G(new U(1.38,.58,1.55),n,0,.78,-.22)),i.add(G(new U(1.42,.05,1.5),c,0,1.06,-.2,{cast:!1})),i.add(G(new U(.08,.48,.95),s,-.68,.85,-.08)),i.add(G(new U(.08,.48,.95),s,.68,.85,-.08)),i.add(G(new U(.04,.06,1.2),c,-.72,.95,-.1,{cast:!1})),i.add(G(new U(.04,.06,1.2),c,.72,.95,-.1,{cast:!1})),i.add(G(new ke(.62,18,16),r,-.7,.56,.95,{sx:.92,sy:.74,sz:1.3})),i.add(G(new ke(.62,18,16),r,.7,.56,.95,{sx:.92,sy:.74,sz:1.3})),i.add(G(new ke(.32,14,12),r,-.55,.46,1.48,{sx:.95,sy:.72,sz:.9})),i.add(G(new ke(.32,14,12),r,.55,.46,1.48,{sx:.95,sy:.72,sz:.9})),i.add(G(new U(.78,.5,.72),r,0,.72,1.15)),i.add(G(new U(.42,.16,.68),o,0,1,1.08)),i.add(G(new ke(.38,14,12),r,0,.88,1.22,{sx:.95,sy:.48,sz:.72}));for(let v=-5;v<=5;v++)i.add(G(new U(.032,.44,.05),c,v*.06,.64,1.54,{cast:!1}));i.add(G(new U(.76,.05,.06),c,0,.88,1.54)),i.add(G(new U(.76,.05,.06),c,0,.4,1.54)),i.add(G(new U(.05,.5,.06),c,-.36,.64,1.54)),i.add(G(new U(.05,.5,.06),c,.36,.64,1.54)),i.add(G(new U(1.6,.1,.15),c,0,.28,1.6)),i.add(G(new ke(.11,12,10),c,-.8,.28,1.6)),i.add(G(new ke(.11,12,10),c,.8,.28,1.6)),i.add(G(new U(.09,.16,.12),c,-.48,.35,1.65)),i.add(G(new U(.09,.16,.12),c,.48,.35,1.65)),i.add(G(new ke(.14,14,12),m,-.74,.72,1.38)),i.add(G(new ke(.14,14,12),m,.74,.72,1.38)),i.add(G(new Jt(.15,.024,8,16),c,-.74,.72,1.38,{cast:!1})),i.add(G(new Jt(.15,.024,8,16),c,.74,.72,1.38,{cast:!1}));for(const v of[-1,1]){const w=v*.82;i.add(G(new U(.06,.1,.7),f,w,.62,.75,{cast:!1})),i.add(G(new U(.05,.16,.45),g,w,.72,1,{cast:!1})),i.add(G(new U(.045,.22,.28),f,w,.82,1.15,{cast:!1})),i.add(G(new U(.04,.12,.5),g,w,.55,.65,{cast:!1})),i.add(G(new U(.035,.18,.2),f,w,.9,1.25,{cast:!1}))}i.add(G(new ke(.52,16,14),a,-.64,.56,-1.05,{sx:.88,sy:.74,sz:1.2})),i.add(G(new ke(.52,16,14),a,.64,.56,-1.05,{sx:.88,sy:.74,sz:1.2})),i.add(G(new U(1.36,.5,.58),n,0,.74,-1.15)),i.add(G(new U(.95,.05,.05),c,0,.7,-1.45,{cast:!1})),i.add(G(new U(1.2,.12,.35),s,0,1,-1.25)),i.add(G(new U(1.28,.1,1.05),h,0,.5,-.08)),i.add(G(new U(1.22,.22,.4),l,0,.98,.48)),i.add(G(new U(.38,.06,.2),c,0,1.08,.45,{cast:!1})),i.add(G(new Oe(.035,.04,.32,8),l,.28,.95,.34,{rx:.95}));const p=new F(new Jt(.18,.03,10,18),l);p.position.set(.28,1.1,.28),p.rotation.x=Math.PI/2.4,i.add(p);for(const v of[-.34,.34])i.add(G(new U(.52,.16,.5),d,v,.96,0)),i.add(G(new U(.42,.1,.4),u,v,1.03,.02,{cast:!1})),i.add(G(new U(.52,.55,.14),d,v,1.28,-.22)),i.add(G(new U(.4,.4,.1),u,v,1.3,-.18,{cast:!1}));i.add(G(new U(1.18,.05,.05),c,0,1.48,.5)),i.add(G(new U(.05,.52,.05),c,-.56,1.2,.52)),i.add(G(new U(.05,.52,.05),c,.56,1.2,.52)),i.add(G(new U(1.12,.5,.04),t.glass,0,1.2,.52,{rx:-.16,cast:!1})),i.add(G(new U(.14,.09,.02),ze("#e8c84a",.48,.22),.38,1.38,.56,{cast:!1})),Pl(i,{track:1.02,wheelBase:1.55,radius:.42,width:.3,y:.42,tire:x,rim:c,hub:c,spokes:!0,spokeColor:c})}function Pl(i,e){const t=[[-e.track/2,e.wheelBase/2],[e.track/2,e.wheelBase/2],[-e.track/2,-e.wheelBase/2],[e.track/2,-e.wheelBase/2]];for(const[n,s]of t){const a=new F(new Oe(e.radius,e.radius,e.width,18),e.tire);if(a.rotation.z=Math.PI/2,a.position.set(n,e.y,s),a.castShadow=!0,i.add(a),e.whitewall){const c=new F(new Oe(e.radius*.72,e.radius*.72,e.width*1.05,16),e.whitewall);c.rotation.z=Math.PI/2,c.position.set(n,e.y,s),i.add(c)}const r=new F(new Oe(e.radius*.55,e.radius*.55,e.width*1.1,14),e.rim);r.rotation.z=Math.PI/2,r.position.set(n,e.y,s),i.add(r);const o=new F(new Oe(e.radius*.22,e.radius*.22,e.width*1.2,10),e.hub);if(o.rotation.z=Math.PI/2,o.position.set(n,e.y,s),i.add(o),e.spokes){const c=e.spokeColor??e.rim;for(let l=0;l<5;l++){const h=l/5*Math.PI*2,d=new F(new U(e.radius*.08,e.radius*.9,e.width*.15),c);d.position.set(n,e.y,s),d.rotation.z=Math.PI/2,d.rotation.x=h,i.add(d)}}}}function Vu(i,e,t){const n=document.createElement("canvas");n.width=512,n.height=128;const s=n.getContext("2d");s.clearRect(0,0,512,128),t!=="transparent"&&(s.fillStyle=t,s.beginPath(),s.roundRect(8,16,496,96,24),s.fill()),s.fillStyle=e,s.font="bold 48px DM Sans, system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,256,64);const a=new Vs(n);return a.colorSpace=_t,new dl(new Vr({map:a,transparent:!0,depthTest:!0}))}class Ny{renderer;scene;camera;racerMeshes=new Map;hazardMeshes=new Map;projectileMeshes=new Map;solidMarkers=new Map;pickupMeshes=new Map;gateArms=[];camPos=new L;camTarget=new L;lookAhead=new L;tmp=new L;clock=0;houseGeo;palmTrunkGeo;palmLeafGeo;materials;areaTheme=_a("spanish-springs").theme;activeAreaId="spanish-springs";cameraNeedsSnap=!0;trackBounds={minX:-200,maxX:200,minY:-200,maxY:200,cx:0,cz:0};constructor(e,t){this.materials=t??yM(),this.renderer=new mM({canvas:e,antialias:!0,powerPreference:"high-performance",alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(window.innerWidth,window.innerHeight,!1),this.renderer.outputColorSpace=_t,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Nd,this.renderer.toneMapping=Qc,this.renderer.toneMappingExposure=1.22,this.scene=new eu,this.scene.background=new Le("#7ec8ef"),this.scene.fog=new Fr("#c8e8f8",280,1100);const n=new Nc(this.renderer);this.scene.environment=n.fromScene(new Dv,.04).texture,this.scene.environmentIntensity=.85,n.dispose(),this.camera=new cn(58,window.innerWidth/Math.max(1,window.innerHeight),.35,2800),this.houseGeo=new U(1,1,1),this.palmTrunkGeo=new Oe(.16,.24,1,12),this.palmLeafGeo=new ki(1.1,1.85,8)}setMaterials(e){this.materials=e}buildWorld(e,t,n){n&&(this.activeAreaId=n,this.areaTheme=_a(n).theme);const s=this.areaTheme;for(this.trackBounds=Oy(e,160);this.scene.children.length;)this.scene.remove(this.scene.children[0]);this.racerMeshes.clear(),this.hazardMeshes.clear(),this.projectileMeshes.clear(),this.solidMarkers.clear(),this.pickupMeshes.clear(),this.gateArms=[],this.scene.background=new Le(s.skyBottom);const a=Math.max(this.trackBounds.maxX-this.trackBounds.minX,this.trackBounds.maxY-this.trackBounds.minY),r=Math.max(380,a*1.1),o=Math.max(1400,a*3.5);this.scene.fog=new Fr(s.skyBottom,r,o),this.camera.far=Math.max(3200,o+600),this.camera.updateProjectionMatrix(),this.materials.grass.color.set(s.grass),this.materials.grassDeep.color.set(s.grassDeep),this.materials.asphalt.color.set("#5a5e68"),this.materials.asphaltDark.color.set("#484c54"),this.materials.sidewalk.color.set(s.sidewalk),this.materials.curb.color.set("#3d9a58"),this.materials.water.color.set(s.water),this.materials.stucco.color.set(s.stucco[0]),this.materials.stuccoAlt.color.set(s.stucco[1]??s.stucco[0]),this.materials.roof.color.set(s.roof),this.materials.roofBlue.color.set(s.roofAlt),this.materials.roofGreen.color.set(s.roof),this.materials.plaza.color.set(s.plaza),this.materials.line.color.set("#ffffff"),this.materials.center.color.set("#f5d040");for(const c of[this.materials.asphalt,this.materials.asphaltDark,this.materials.line,this.materials.center,this.materials.curb,this.materials.sidewalk,this.materials.grass,this.materials.grassDeep,this.materials.fairway,this.materials.plaza,this.materials.parking,this.materials.sand])c.fog=!1;this.addLights(s),this.addGround(),this.addRoad(e),this.addSidewalks(e),this.addBridges(e),this.addRoundabouts(),this.addCommunityGates(),this.addDecor(t),this.addLandmarks(n),this.addStreetFurniture(e),this.addRoadsideDetail(e),this.addSkyDecor(),this.cameraNeedsSnap=!0,this.renderer.compile(this.scene,this.camera)}snapCameraToPlayer(e){this.cameraNeedsSnap=!0,this.updateCamera(e,1/60)}addLights(e){const t=new im(e.skyBottom,e.grassDeep,1.15);this.scene.add(t);const n=new wr("#fff6e0",1.75);n.position.set(140,200,90),n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.camera.near=5,n.shadow.camera.far=700,n.shadow.camera.left=-280,n.shadow.camera.right=280,n.shadow.camera.top=280,n.shadow.camera.bottom=-280,n.position.set(this.trackBounds.cx+140,200,this.trackBounds.cz+90),n.target.position.set(this.trackBounds.cx,0,this.trackBounds.cz),this.scene.add(n.target),n.shadow.bias=-15e-5,n.shadow.normalBias=.04,this.scene.add(n);const s=new wr(e.skyMid,.45);s.position.set(-90,50,-70),this.scene.add(s);const a=new wr(e.accent,.3);a.position.set(40,20,-120),this.scene.add(a);const r=new ke(2200,32,16),o=new On({side:sn,depthWrite:!1,uniforms:{topColor:{value:new Le(e.skyTop)},midColor:{value:new Le(e.skyMid)},bottomColor:{value:new Le(e.skyBottom)}},vertexShader:`
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.15, 0.25, h));
          col = mix(col, topColor, smoothstep(0.2, 0.85, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `});this.scene.add(new F(r,o))}addGround(){const e=this.trackBounds,t=Math.max(900,(e.maxX-e.minX)*2.2),n=Math.max(900,(e.maxY-e.minY)*2.2),s=e.cx,a=e.cz,r=new F(new Mi(t,n,24,24),this.materials.grass);r.rotation.x=-Math.PI/2,r.position.set(s,0,a),r.receiveShadow=!0,r.frustumCulled=!1,this.scene.add(r);const o=new xn(1,16),c=Id(42),l=new lt,h=[this.materials.grassDeep,se("#4aad68",.95,.12),se("#3d9458",.95,.12),se("#5cb87a",.92,.12)],d=(g,x)=>dt(g,x,Ze+4)&&!Fi(g,x,Ze+_n+ui+4);for(const g of h){const x=new at(o,g,70);let m=0;for(let p=0;p<220&&m<70;p++){const v=e.minX+c()*(e.maxX-e.minX),w=e.minY+c()*(e.maxY-e.minY);if(!d(v,w))continue;const M=6+c()*22;l.position.set(v,.02+c()*.02,w),l.scale.set(M,M*(.7+c()*.5),M),l.rotation.x=-Math.PI/2,l.rotation.z=c()*Math.PI,l.updateMatrix(),x.setMatrixAt(m++,l.matrix)}x.count=m,x.receiveShadow=!0,this.scene.add(x)}const u=new at(o,this.materials.sand,50);let f=0;for(let g=0;g<160&&f<50;g++){const x=e.minX+c()*(e.maxX-e.minX),m=e.minY+c()*(e.maxY-e.minY);if(!d(x,m))continue;const p=3+c()*12;l.position.set(x,.03,m),l.scale.set(p,p*.6,p),l.rotation.x=-Math.PI/2,l.updateMatrix(),u.setMatrixAt(f++,l.matrix)}u.count=f,this.scene.add(u)}finalizePathMesh(e){e.frustumCulled=!1,e.geometry.computeBoundingSphere(),e.geometry.computeBoundingBox(),e.geometry.boundingSphere&&(e.geometry.boundingSphere.radius*=1.35),this.scene.add(e)}addRoad(e){if(e.length<2)return;const t=Ze,n=.08,s=_=>n+(_.elev??0),a=[],r=[];for(const _ of e){const b=Math.cos(_.angle+Math.PI/2),C=Math.sin(_.angle+Math.PI/2),P=s(_);a.push(new L(_.x-b*t,P,_.y-C*t)),r.push(new L(_.x+b*t,P,_.y+C*t))}a.push(a[0].clone()),r.push(r[0].clone());const o=new F(li(a,r),this.materials.asphalt);o.receiveShadow=!0,this.finalizePathMesh(o);const c=[],l=[];let h=!1;for(const _ of e){const b=_.elev??0;b>.35&&(h=!0);const C=Math.cos(_.angle+Math.PI/2),P=Math.sin(_.angle+Math.PI/2),I=s(_)-Math.min(.55,.2+b*.06);c.push(new L(_.x-C*(t+.15),I,_.y-P*(t+.15))),l.push(new L(_.x+C*(t+.15),I,_.y+P*(t+.15)))}if(h){c.push(c[0].clone()),l.push(l[0].clone());const _=se("#4a4e56",.85,.12);_.fog=!1;const b=new F(li(c,l),_);b.receiveShadow=!0,this.finalizePathMesh(b)}const d=t*.4,u=_=>s(_)+.005;for(const _ of Vo(e,Ze+1.8))this.finalizePathMesh(new F(li(dn(_,-d,u),dn(_,d,u)),this.materials.asphaltDark));const f=new lt,g=new U(2.6,.06,.2),x=Math.ceil(e.length/3),m=new at(g,this.materials.center,x),p=new at(g,this.materials.center,x);let v=0;for(let _=0;_<e.length&&!(v>=x);_+=3){if(_/3%2>=1)continue;const b=e[_];if(Fi(b.x,b.y,Ze+1.5))continue;const C=Math.cos(b.angle+Math.PI/2),P=Math.sin(b.angle+Math.PI/2),I=.22,O=s(b)+.04;f.position.set(b.x-C*I,O,b.y-P*I),f.rotation.y=-b.angle,f.scale.set(1,1,1),f.updateMatrix(),m.setMatrixAt(v,f.matrix),f.position.set(b.x+C*I,O,b.y+P*I),f.updateMatrix(),p.setMatrixAt(v,f.matrix),v++}m.count=v,p.count=v,m.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0,m.frustumCulled=!1,p.frustumCulled=!1,this.scene.add(m),this.scene.add(p);const w=.55,M=_=>s(_)+.04,T=_=>s(_)-.02,S=t+_n,A=Vo(e,Ze+1.8);for(const _ of A)this.finalizePathMesh(new F(li(dn(_,-t,M),dn(_,-7.95,M)),this.materials.line)),this.finalizePathMesh(new F(li(dn(_,t-w,M),dn(_,t,M)),this.materials.line)),this.finalizePathMesh(new F(li(dn(_,-S,T),dn(_,-t,T)),this.materials.curb)),this.finalizePathMesh(new F(li(dn(_,t,T),dn(_,S,T)),this.materials.curb));this.addRoadDirectionArrows(e),this.addStartFinishGate(e)}addRoadDirectionArrows(e){const t=new lt,n=new U(1.6,.05,.28),s=this.materials.line,a=Math.max(8,Math.floor(e.length/28)),r=Math.floor(e.length/a),o=new at(n,s,r),c=new at(n,s,r);let l=0;for(let h=a;h<e.length&&l<r;h+=a){if(h<12||h>e.length-8)continue;const d=e[h];if(Fi(d.x,d.y,Ze+1.5))continue;const u=Math.cos(d.angle),f=Math.sin(d.angle),g=.12+(d.elev??0),x=d.x,m=d.y;t.position.set(x-f*.35,g,m+u*.35),t.rotation.set(0,-d.angle+.55,0),t.scale.set(1,1,1),t.updateMatrix(),o.setMatrixAt(l,t.matrix),t.position.set(x+f*.35,g,m-u*.35),t.rotation.set(0,-d.angle-.55,0),t.updateMatrix(),c.setMatrixAt(l,t.matrix),l++}o.count=l,c.count=l,o.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0,o.frustumCulled=!1,c.frustumCulled=!1,this.scene.add(o),this.scene.add(c)}addRoundabouts(){if(hn.length)for(const e of hn)this.addRoundaboutIsland(e)}addRoundaboutIsland(e){const t=new Tt,n=.08,s=e.islandRadius,a=Ze,r=new F(new Ln(s+.2,e.radius+a+.55,80),this.materials.asphalt);r.rotation.x=-Math.PI/2,r.position.set(e.x,.09,e.y),r.receiveShadow=!0,t.add(r);const o=new F(new Jt(s+.35,.22,8,40),se("#d8d4cc",.75,.12));o.rotation.x=-Math.PI/2,o.position.set(e.x,n+.12,e.y),o.receiveShadow=!0,t.add(o);const c=new F(new xn(s,40),this.materials.grass);c.rotation.x=-Math.PI/2,c.position.set(e.x,n+.05,e.y),c.receiveShadow=!0,t.add(c);const l=new F(new xn(s*.42,24),se("#8a6a48",.9,.05));l.rotation.x=-Math.PI/2,l.position.set(e.x,n+.07,e.y),t.add(l);const h=new F(new Oe(s*.22,s*.26,.45,16),se("#c8d0d8",.4,.55));h.position.set(e.x,n+.3,e.y),h.castShadow=!0,t.add(h);const d=new F(new xn(s*.16,16),this.materials.water);d.rotation.x=-Math.PI/2,d.position.set(e.x,n+.54,e.y),t.add(d);const u=3+Math.floor((e.x*.1+e.y)%2);for(let _=0;_<u;_++){const b=_/u*Math.PI*2+.4,C=s*.68,P=e.x+Math.cos(b)*C,I=e.y+Math.sin(b)*C,O=new F(this.palmTrunkGeo,this.materials.palmBark);O.position.set(P,n+1.1,I),O.scale.set(.7,2.2,.7),O.castShadow=!0,t.add(O);const K=new F(this.palmLeafGeo,this.materials.palmFrond);K.position.set(P,n+2.5,I),K.scale.setScalar(.55),K.castShadow=!0,t.add(K)}const f=new F(new Ln(s+1.2,s+1.55,48),se("#f5d040",.55,.2));f.rotation.x=-Math.PI/2,f.position.set(e.x,n+.04,e.y),t.add(f);const g=e.radius+a-.28,x=Math.max(s+.65,e.radius-a+.28),m=n+.11,p=new F(new Ln(g-.28,g+.28,72),this.materials.line);p.rotation.x=-Math.PI/2,p.position.set(e.x,m,e.y),t.add(p);const v=new F(new Ln(x-.28,x+.28,72),this.materials.line);v.rotation.x=-Math.PI/2,v.position.set(e.x,m,e.y),t.add(v);const w=e.radius+a+_n*.5,M=new F(new Ln(w-_n*.5,w+_n*.5,72),this.materials.curb);M.rotation.x=-Math.PI/2,M.position.set(e.x,n+.05,e.y),M.receiveShadow=!0,t.add(M);const T=e.radius+a+_n,S=T+ui,A=new F(new Ln(T,S,72),this.materials.sidewalk);A.rotation.x=-Math.PI/2,A.position.set(e.x,n+.07,e.y),A.receiveShadow=!0,t.add(A),this.scene.add(t)}addCommunityGates(){if($n.length)for(const e of $n)this.addCommunityGate(e)}addCommunityGate(e){const t=new Tt,n=Ze,s=Math.cos(e.angle+Math.PI/2),a=Math.sin(e.angle+Math.PI/2),r=Math.cos(e.angle),o=Math.sin(e.angle),c=0,l=se("#efe6d6",.82,.08),h=se("#d4c4a8",.7,.15),d=se("#4a5560",.4,.65),u=se("#c44738",.45,.35),f=se("#f5f5f0",.5,.2),g=.62;for(const A of[-1,1]){const _=new Tt;_.position.set(e.x+s*(n+1.35)*A,c,e.y+a*(n+1.35)*A),_.rotation.y=-e.angle;const b=new F(new U(g*2,2.8,g*2),l);b.position.set(0,1.4,0),b.castShadow=!0,b.receiveShadow=!0,_.add(b);const C=new F(new U(1.48,.28,1.48),h);C.position.set(0,2.9,0),_.add(C);const P=new F(new ke(.22,12,10),se("#fff6d0",.25,.8));P.position.set(0,3.25,0),_.add(P);for(const I of[-1,1]){const O=$y(e.label);O.position.set(I*(g+.04),2.02,0),O.rotation.y=I>0?Math.PI/2:-Math.PI/2,_.add(O)}t.add(_)}for(const A of[-1,1]){const _=e.x+s*(n+2.8)*A-r*.4,b=e.y+a*(n+2.8)*A-o*.4,C=new F(new U(.55,1.1,2.2),se("#c4785a",.85,.08));C.position.set(_,c+.55,b),C.rotation.y=-e.angle,C.castShadow=!0,t.add(C)}const x=e.x+s*(n+.55),m=e.y+a*(n+.55),p=new F(new Oe(.18,.22,1.15,10),d);p.position.set(x,c+.7,m),t.add(p);const v=new Tt;v.position.set(x,c+1.05,m),v.rotation.y=-(e.angle+Math.PI/2);const w=n*2+1.6,M=new F(new U(w,.18,.28),u);M.position.set(-w/2,0,0),M.castShadow=!0,v.add(M);for(let A=0;A<5;A++){const _=new F(new U(w*.08,.2,.3),f);_.position.set(-w*(.15+A*.16),0,0),v.add(_)}const T=new F(new ke(.14,8,8),se("#ff4444",.3,.7));T.position.set(-w+.1,0,0),v.add(T),t.add(v),this.gateArms.push({arm:v,site:e});const S=new F(new U(n*2+1,.05,.9),se("#3a3e48",.8,.1));S.position.set(e.x,c+.1,e.y),S.rotation.y=-e.angle,t.add(S),this.scene.add(t)}updateGates(){for(const{arm:e,site:t}of this.gateArms){const n=t.open??0;e.rotation.z=-n*(Math.PI/2)}}addStartFinishGate(e){if(!e.length)return;const t=Ze,n=e[0],s=Math.cos(n.angle+Math.PI/2),a=Math.sin(n.angle+Math.PI/2),r=Math.cos(n.angle),o=Math.sin(n.angle),c=new Tt,l=8.2,h=se("#e8b84a",.35,.55),d=se("#1c2430",.5,.35),u=new U(.7,l,.7);for(const _ of[-1,1]){const b=new F(u,h);b.position.set(n.x+s*(t+1.1)*_,l/2,n.y+a*(t+1.1)*_),b.castShadow=!0,c.add(b);const C=new F(new U(1.4,.35,1.4),d);C.position.set(n.x+s*(t+1.1)*_,.18,n.y+a*(t+1.1)*_),c.add(C)}const f=t*2+3.2,g=new F(new U(f,.55,.55),h);g.position.set(n.x,l-.4,n.y),g.rotation.y=-n.angle,g.castShadow=!0,c.add(g);const x=14,m=3,p=f/x,v=1.05;for(let _=0;_<m;_++)for(let b=0;b<x;b++){const C=(_+b)%2===0,P=new F(new U(p*.98,v*.95,.12),se(C?"#111318":"#f6f6f2",.55,.15)),I=(b-(x-1)/2)*p;P.position.set(n.x+s*I,l-1.15-_*v,n.y+a*I),P.rotation.y=-n.angle,c.add(P)}const w=new F(new U(f*.55,1.15,.2),se("#e85d4c",.45,.35));w.position.set(n.x-r*.15,l+.55,n.y-o*.15),w.rotation.y=-n.angle,c.add(w);const M=Yc("START / FINISH","#ffffff","#e85d4c");M.position.set(n.x,l+.55,n.y),M.scale.set(12,2.4,1),c.add(M);const T=2.4,S=12,A=t*2/S;for(let _=0;_<3;_++)for(let b=0;b<S;b++){const C=(_+b)%2===0,P=new F(new U(A*.96,.06,T/3-.05),se(C?"#1a1e28":"#f2f2ee",.7,.1)),I=(b-(S-1)/2)*A,O=(_-1)*(T/3);P.position.set(n.x+s*I+r*O,.13,n.y+a*I+o*O),P.rotation.y=-n.angle,c.add(P)}for(const _ of[-1,1]){const b=new F(new Oe(.12,.16,6.5,8),se("#c0c4cc",.45,.5)),C=n.x+s*(t+3.2)*_-r*2,P=n.y+a*(t+3.2)*_-o*2;b.position.set(C,3.25,P),c.add(b);for(let I=0;I<2;I++)for(let O=0;O<3;O++){const K=(I+O)%2===0,k=new F(new U(.55,.45,.06),se(K?"#111":"#fff",.6,.1));k.position.set(C+r*(.4+O*.55),5.8-I*.45,P+o*(.4+O*.55)),c.add(k)}}this.scene.add(c)}addSidewalks(e){const t=Ze+_n,n=t+ui,s=r=>.06+(r.elev??0),a=Ze+_n+ui+2.2;for(const r of Vo(e,a))this.finalizePathMesh(new F(li(dn(r,-n,s),dn(r,-t,s)),this.materials.sidewalk)),this.finalizePathMesh(new F(li(dn(r,t,s),dn(r,n,s)),this.materials.sidewalk))}addBridges(e){if(!Pa.length)return;const t="#e8dcc4",n="#d4c4a0",s="#6b2e28",a="#4a201c";for(const r of Pa){const o=new Tt;o.position.set(r.x,0,r.y),o.rotation.y=-r.angle;const l=(r.peakElev||Eu)+.08,h=8.5,d=1.1,u=l+h,f=Ze,g=se("#5c4838",.55,.35),x=se("#6b2e28",.5,.28),m=se(s,.48,.32),p=se(a,.52,.28),v=se("#d2cdc2",.88,.05),w=110,M=14,T=M/2,S=u+d+.2,A=1.15,_=f+5.4,b=7.2,C=S+.55,P=_+7;Wy(o,{halfLen:w,centerHalf:P,deckY:S,groundY:A,thickX:M,girderH:d,steel:g,railMat:x,deckMat:v,asphalt:this.materials.asphalt,sidewalk:this.materials.sidewalk,towerCream:t});const I=5.4,O=S+b+2.4;for(const k of[-1,1]){const $=k*_,V=new F(new U(I*.82,O,I*.82),se(t,.9,.08));V.position.set(0,O/2,$),V.castShadow=!0,o.add(V);const Q=new F(new U(I,1.2,I),se(n,.88,.1));Q.position.set(0,.6,$),o.add(Q);const ae=new F(new U(I*.95,.7,I*.95),se(t,.82,.12));ae.position.set(0,O+.3,$),o.add(ae);const oe=new F(new Oe(.55,.75,1.1,10),se(n,.7,.15));oe.position.set(0,O+1.15,$),o.add(oe)}for(const k of[-1,1])Xy(o,-_+I*.35,_-I*.35,k*(T+.05),C,b,m,p);for(const k of[-1,1]){const $=qy();$.position.set(k*(T+.35),C+b*.38,0),$.rotation.y=k<0?-Math.PI/2:Math.PI/2,o.add($)}const K=new Ml("#fff0d0",.9,40,2);K.position.set(0,l+h*.45,0),o.add(K),this.scene.add(o)}}addDecor(e){const t=new lt,n=[],s=[],a=[],r=[],o=[];for(const H of e)if(H.kind==="pond"){if(!dt(H.x,H.y,H.r+It))continue;const j=new F(new xn(H.r,28),this.materials.water);j.rotation.x=-Math.PI/2,j.position.set(H.x,.06,H.y),this.scene.add(j);const de=new F(new Ln(H.r*.9,H.r*1.12,28),this.materials.sand);de.rotation.x=-Math.PI/2,de.position.set(H.x,.07,H.y),this.scene.add(de);for(let Ae=0;Ae<5;Ae++){const Te=new F(new xn(.9+Ae%2*.4,8),this.materials.palmFrond);Te.rotation.x=-Math.PI/2,Te.position.set(H.x+Math.cos(Ae*1.7)*H.r*.4,.09,H.y+Math.sin(Ae*1.7)*H.r*.4),this.scene.add(Te)}}else if(H.kind==="golf"){if(!dt(H.x,H.y,H.r*.5+It))continue;const j=new F(new xn(H.r,24),this.materials.fairway);j.rotation.x=-Math.PI/2,j.position.set(H.x,.05,H.y),j.scale.set(1,.6,1),this.scene.add(j);for(let Te=0;Te<3;Te++){const le=new F(new xn(H.r*.12,12),this.materials.sand);le.rotation.x=-Math.PI/2,le.position.set(H.x+Math.cos(Te*2.1)*H.r*.45,.06,H.y+Math.sin(Te*2.1)*H.r*.35),this.scene.add(le)}const de=new F(new Oe(.06,.06,4,6),se("#ffffff",.4,.5));de.position.set(H.x-H.r*.25,2,H.y),this.scene.add(de);const Ae=new F(new U(1.4,.8,.08),se(Ia.sunset,.5,.4));Ae.position.set(H.x-H.r*.25+.7,3.5,H.y),this.scene.add(Ae)}else if(H.kind==="parking"){if(!dt(H.x,H.y,It+4))continue;const j=new F(new U(H.r*2.2,.08,H.r*1.4),this.materials.parking);j.position.set(H.x,.05,H.y),this.scene.add(j);for(let de=-3;de<=3;de++){const Ae=new F(new U(.08,.04,H.r*1.1),this.materials.line);Ae.position.set(H.x+de*(H.r*.28),.1,H.y),this.scene.add(Ae)}}else if(H.kind==="plaza"){if(!dt(H.x,H.y,Ze+1))continue;const j=new F(new Oe(H.r,H.r,.12,28),this.materials.plaza);j.position.set(H.x,.06,H.y),this.scene.add(j)}else if(H.kind==="houses"){if(!dt(H.x,H.y,Dn))continue;let j=0,de=1/0;for(let le=0;le<on.length;le+=2){const We=on[le],Qe=(We.x-H.x)**2+(We.y-H.y)**2;Qe<de&&(de=Qe,j=Math.atan2(We.y-H.y,We.x-H.x))}n.push({x:H.x,z:H.y,yaw:j});const Ae=H.x+Math.cos(j)*6,Te=H.y+Math.sin(j)*6;dt(Ae,Te,It)&&o.push({x:Ae,z:Te,yaw:j}),r.push({x:H.x+Math.cos(j+Math.PI/2)*5,z:H.y+Math.sin(j+Math.PI/2)*5,yaw:j+Math.PI/2,len:8});for(let le=-1;le<=1;le++)a.push({x:H.x+Math.cos(j)*4.5+Math.cos(j+Math.PI/2)*le*2.2,z:H.y+Math.sin(j)*4.5+Math.sin(j+Math.PI/2)*le*2.2,s:.7+Math.abs(le)*.2})}else if(H.kind==="palm-grove")for(let j=0;j<4;j++){const de=H.x+Math.cos(j*1.4)*H.r*.45,Ae=H.y+Math.sin(j*1.4)*H.r*.4;dt(de,Ae,Ji)&&s.push({x:de,z:Ae})}const c=Math.min(n.length,1400),l=[this.materials.stucco,se("#f5efe3",.88,.18),se("#efe4d2",.88,.18),se("#e8ddd0",.88,.18),se("#f0e8da",.88,.18)],h=l.map(H=>new at(this.houseGeo,H,Math.ceil(c/l.length)+8)),d=h.map(()=>0),u=new at(this.houseGeo,this.materials.roof,c),f=new at(this.houseGeo,this.materials.roofBlue,Math.floor(c/2)),g=new at(this.houseGeo,this.materials.roofGreen,Math.floor(c/3)),x=new at(this.houseGeo,this.materials.roof,c),m=new at(this.houseGeo,this.materials.stucco,c),p=new at(this.houseGeo,this.materials.window,c*4),v=new at(this.houseGeo,se("#ffffff",.7,.2),c*4),w=new at(this.houseGeo,this.materials.door,c),M=new at(this.houseGeo,se("#e8e0d0",.85,.2),c),T=new at(this.houseGeo,se("#b07060",.85,.2),c);let S=0,A=0,_=0,b=0,C=0,P=0,I=0,O=0,K=0,k=0,$=0;for(let H=0;H<n.length&&S<c;H++){const j=n[H];if(!dt(j.x,j.z,Dn))continue;const de=5.8+H%5*.45,Ae=4.4+H%4*.35,Te=2.9+H%3*.3,le=j.yaw+Math.PI,We=H%h.length;d[We]<h[We].count&&(t.position.set(j.x,Te/2,j.z),t.scale.set(de,Te,Ae),t.rotation.set(0,-le,0),t.updateMatrix(),h[We].setMatrixAt(d[We]++,t.matrix)),t.position.set(j.x,Te+.95,j.z),t.scale.set(de*1.18,1.35,Ae*1.18),t.rotation.set(0,-le,0),t.updateMatrix();const Qe=H%5;Qe===0&&_<f.count?f.setMatrixAt(_++,t.matrix):Qe===1&&b<g.count?g.setMatrixAt(b++,t.matrix):A<u.count&&u.setMatrixAt(A++,t.matrix),C<x.count&&(t.position.set(j.x+Math.cos(le)*.15,Te+1.55,j.z+Math.sin(le)*.15),t.scale.set(de*.95,.55,Ae*.95),t.updateMatrix(),x.setMatrixAt(C++,t.matrix)),k<M.count&&(t.position.set(j.x+Math.cos(le)*(Ae*.55+.6),.12,j.z+Math.sin(le)*(Ae*.55+.6)),t.scale.set(de*.7,.2,1.6),t.rotation.set(0,-le,0),t.updateMatrix(),M.setMatrixAt(k++,t.matrix)),$<T.count&&H%3!==0&&(t.position.set(j.x+Math.cos(le+Math.PI/2)*(de*.28),Te+2,j.z+Math.sin(le+Math.PI/2)*(de*.28)),t.scale.set(.7,1.6,.7),t.rotation.set(0,-le,0),t.updateMatrix(),T.setMatrixAt($++,t.matrix));const Rt=j.x+Math.cos(le+Math.PI/2)*(de*.58),Pt=j.z+Math.sin(le+Math.PI/2)*(de*.58);dt(Rt,Pt,Dn)&&P<m.count&&(t.position.set(Rt,1.25,Pt),t.scale.set(3.4,2.5,3.8),t.rotation.set(0,-le,0),t.updateMatrix(),m.setMatrixAt(P++,t.matrix),K<w.count&&(t.position.set(Rt+Math.cos(le)*1.95,1.1,Pt+Math.sin(le)*1.95),t.scale.set(2.4,2,.12),t.updateMatrix(),w.setMatrixAt(K++,t.matrix))),K<w.count&&(t.position.set(j.x+Math.cos(le)*(Ae*.52),1.05,j.z+Math.sin(le)*(Ae*.52)),t.scale.set(.95,2,.14),t.rotation.set(0,-le,0),t.updateMatrix(),w.setMatrixAt(K++,t.matrix));const kt=[[.52,1.55,-1.55],[.52,1.55,1.55],[.52,2.35,-1.55],[.52,2.35,1.55],[0,1.7,Ae*.52],[0,1.7,-Ae*.52]];for(const[rt,Et,vt]of kt){if(I>=p.count)break;j.x+Math.cos(le)*(Ae*rt)+Math.cos(le+Math.PI/2)*vt*(rt===0?0:1),j.z+Math.sin(le)*(Ae*rt)+Math.sin(le+Math.PI/2)*vt*(rt===0?0:1);let N=j.x+Math.cos(le)*(Ae*(rt===0?0:rt)),Gt=j.z+Math.sin(le)*(Ae*(rt===0?0:rt));rt===0?(N=j.x+Math.cos(le+Math.PI/2)*vt,Gt=j.z+Math.sin(le+Math.PI/2)*vt):(N=j.x+Math.cos(le)*(Ae*rt)+Math.cos(le+Math.PI/2)*vt,Gt=j.z+Math.sin(le)*(Ae*rt)+Math.sin(le+Math.PI/2)*vt),t.position.set(N,Et,Gt),t.scale.set(rt===0?.12:1.05,.95,rt===0?1.05:.12),t.rotation.set(0,-le,0),t.updateMatrix(),p.setMatrixAt(I++,t.matrix),O<v.count&&(t.position.set(N,Et,Gt),t.scale.set(rt===0?.16:1.2,1.1,rt===0?1.2:.16),t.updateMatrix(),v.setMatrixAt(O++,t.matrix))}S++}for(const H of h)H.castShadow=!0,H.receiveShadow=!0,this.scene.add(H);u.castShadow=!0,x.castShadow=!0,this.scene.add(u),this.scene.add(f),this.scene.add(g),this.scene.add(x),this.scene.add(m),this.scene.add(p),this.scene.add(v),this.scene.add(w),this.scene.add(M),this.scene.add(T);const V=new at(this.houseGeo,this.materials.driveway,Math.min(o.length,800));for(let H=0;H<o.length&&H<V.count;H++){const j=o[H];t.position.set(j.x,.04,j.z),t.scale.set(2.4,.08,7),t.rotation.set(0,-j.yaw,0),t.updateMatrix(),V.setMatrixAt(H,t.matrix)}this.scene.add(V);const Q=new at(this.houseGeo,this.materials.hedge,Math.min(r.length,900));for(let H=0;H<r.length&&H<Q.count;H++){const j=r[H];dt(j.x,j.z,It)&&(t.position.set(j.x,.55,j.z),t.scale.set(j.len,1.1,.55),t.rotation.set(0,-j.yaw,0),t.updateMatrix(),Q.setMatrixAt(H,t.matrix))}this.scene.add(Q);const ae=new ke(1,8,6),oe=new at(ae,this.materials.shrub,Math.min(a.length+200,1200));let me=0;for(const H of a){if(me>=oe.count)break;dt(H.x,H.z,It)&&(t.position.set(H.x,.45*H.s,H.z),t.scale.set(H.s,H.s*.85,H.s),t.rotation.set(0,0,0),t.updateMatrix(),oe.setMatrixAt(me++,t.matrix))}for(let H=0;H<on.length;H+=2){const j=on[H],de=on[(H+1)%on.length],Ae=Math.atan2(de.y-j.y,de.x-j.x)+Math.PI/2;for(const Te of[-1,1]){const le=j.x+Math.cos(Ae)*(Ji+1.5)*Te,We=j.y+Math.sin(Ae)*(Ji+1.5)*Te;dt(le,We,Ji)&&(s.push({x:le,z:We}),me<oe.count&&(t.position.set(le+Te*1.2,.35,We),t.scale.set(.8,.6,.8),t.updateMatrix(),oe.setMatrixAt(me++,t.matrix)))}}this.scene.add(oe);const ce=Math.min(s.length,700),Ke=new at(this.palmTrunkGeo,this.materials.palmBark,ce),ut=new at(this.palmLeafGeo,this.materials.palmFrond,ce*6),Ve=new at(this.palmLeafGeo,this.materials.palmFrondLite,ce*3);let ee=0,ue=0,re=0;for(let H=0;H<s.length&&ee<ce;H++){const j=s[H];if(!dt(j.x,j.z,Ji))continue;const de=5+H%6*.65,Ae=(H%5-2)*.04;t.position.set(j.x,de/2,j.z),t.scale.set(1,de,1),t.rotation.set(Ae,H*.7%Math.PI,-Ae*.5),t.updateMatrix(),Ke.setMatrixAt(ee,t.matrix);for(let Te=0;Te<6&&ue<ut.count;Te++){const le=Te/6*Math.PI*2+H*.2;t.position.set(j.x+Math.cos(le)*.35,de+.2,j.z+Math.sin(le)*.35),t.scale.set(1.25,1.15,1.25),t.rotation.set(.75,le,.2),t.updateMatrix(),ut.setMatrixAt(ue++,t.matrix)}for(let Te=0;Te<3&&re<Ve.count;Te++){const le=Te/3*Math.PI*2+.4;t.position.set(j.x+Math.cos(le)*.2,de+.45,j.z+Math.sin(le)*.2),t.scale.set(.95,.9,.95),t.rotation.set(.95,le,0),t.updateMatrix(),Ve.setMatrixAt(re++,t.matrix)}ee++}Ke.castShadow=!0,ut.castShadow=!0,this.scene.add(Ke),this.scene.add(ut),this.scene.add(Ve)}addLandmarks(e){const t=_a(e??this.activeAreaId),n=this.areaTheme,s=new Set([t.squareLandmarkId,...t.recCenterIds]);for(const a of Rn){if(!s.has(a.id)&&a.kind==="town-square"||a.kind==="rec-center"&&!s.has(a.id)||a.kind==="flavor")continue;const r=new Tt;r.position.set(a.x,0,a.y);let o=0,c=1;{let l=1/0;for(let h=0;h<on.length;h+=2){const d=on[h],u=(d.x-a.x)**2+(d.y-a.y)**2;if(u<l){l=u;const f=Math.hypot(a.x-d.x,a.y-d.y)||1;o=(a.x-d.x)/f,c=(a.y-d.y)/f}}}if(a.kind==="town-square"){const l=n.stucco,h=n.landmarkStyle;for(let x=0;x<12;x++){const m=x/12*Math.PI*2,p=h==="western"?30:28,v=Math.cos(m)*p,w=Math.sin(m)*p,M=a.x+v,T=a.y+w;if(!dt(M,T,Dn))continue;let S=7+x%3,A=6.4+x%2*1.4,_=5.5;h==="western"?(S=5.5+x%2,A=7.5+x%3*1.2,_=4.8):h==="lighthouse"?(S=7.5+x%2,A=5.8+x%3*.8,_=5.2):h==="midcentury"?(S=8+x%2*1.5,A=5.5+x%2,_=6):h==="modern"&&(S=7.5+x%3*.8,A=5.2+x%2*1.6,_=5.8);const b=new F(this.houseGeo,se(l[x%l.length],.88,.18));if(b.position.set(v,A/2,w),b.scale.set(S,A,_),b.castShadow=!0,r.add(b),h==="southwest"){const I=new F(this.houseGeo,this.materials.roof);I.position.set(v,A+.9,w),I.scale.set(S+1.2,1.6,_+1),r.add(I)}else if(h==="western"){const I=new F(this.houseGeo,se(n.roofAlt,.75,.15));I.position.set(v*.96,A+.6,w*.96),I.scale.set(S+.4,2.2,.4),r.add(I);const O=new F(this.houseGeo,this.materials.roof);O.position.set(v,A+.4,w),O.scale.set(S+.6,.5,_+.4),r.add(O)}else if(h==="lighthouse"){const I=new F(this.houseGeo,x%2===0?this.materials.roof:this.materials.roofBlue);I.position.set(v,A+.85,w),I.scale.set(S+1,1.5,_+.8),r.add(I)}else if(h==="midcentury"){const I=new F(this.houseGeo,this.materials.roof);I.position.set(v,A+.35,w),I.scale.set(S+1.4,.45,_+1.2),r.add(I);const O=new F(this.houseGeo,se(n.roofAlt,.5,.25));O.position.set(v*.97,A+.55,w*.97),O.scale.set(S+1.5,.25,.35),r.add(O)}else{const I=new F(this.houseGeo,x%2===0?this.materials.roofGreen:this.materials.roof);I.position.set(v,A+.55,w),I.scale.set(S+1.1,.7,_+.9),r.add(I)}const C=new F(this.houseGeo,se(x%2===0?n.accent:n.roofAlt,.55,.18));C.position.set(v*.9,2.2,w*.9),C.scale.set(Math.min(S-.5,6.2),.22,1.35),r.add(C);const P=new F(this.houseGeo,this.materials.window);P.position.set(v*.86,1.7,w*.86),P.scale.set(Math.min(S-1.5,4.2),1.5,.18),r.add(P)}Uy(r,n);const d=o*30,u=c*30;if(dt(a.x+d,a.y+u,Dn)){const x=new F(new U(16,1.4,9),se(n.roof,.7,.25));x.position.set(d,.7,u),r.add(x);const m=new F(new U(18,.3,10),se(n.plaza,.6,.2));m.position.set(d,4.2,u),r.add(m)}const f=o*18+c*10,g=c*18-o*10;if(dt(a.x+f,a.y+g,It)){const x=this.makeSign(a.shortName,n.accent);x.position.set(f,0,g),r.add(x)}}else if(a.kind==="rec-center"){const l=o*8,h=c*8,d=new F(this.houseGeo,se("#e8f4ec",.9,.25));if(d.position.set(l,3.5,h),d.scale.set(18,7,12),d.castShadow=!0,dt(a.x+l,a.y+h,Dn)){r.add(d);const x=new F(this.houseGeo,this.materials.roofGreen);x.position.set(l,7.5,h),x.scale.set(20,1.5,14),r.add(x);const m=new F(this.houseGeo,se("#cfe8d8",.7,.2));m.position.set(l+o*8,2.2,h+c*8),m.scale.set(6,.4,4),r.add(m)}const u=l+c*14,f=h-o*14;if(dt(a.x+u,a.y+f,It+4)){const x=new F(new U(10,.4,6),this.materials.water);x.position.set(u,.2,f),r.add(x);const m=new F(new U(14,.12,10),this.materials.sand);m.position.set(u,.08,f),r.add(m)}const g=this.makeSign(a.shortName,this.areaTheme.accent);g.position.set(l+o*14,0,h+c*14),dt(a.x+g.position.x,a.y+g.position.z,It)&&r.add(g)}else dt(a.x,a.y,It)&&r.add(this.makeSign(a.shortName,"#ffffff"));this.scene.add(r)}}makeSign(e,t){const n=new Tt,s=new F(new Oe(.12,.12,4,6),se("#666",.5,.4));s.position.y=2,n.add(s);const a=new F(new U(Math.max(6,e.length*.55),1.4,.2),se(t,.5,.4));a.position.y=4.2,n.add(a);const r=Yc(e,"#1c2430",t);return r.position.set(0,4.2,.2),r.scale.set(8,2.2,1),n.add(r),n}addStreetFurniture(e){const t=new Oe(.08,.12,3.8,6),n=new U(.08,.08,.9),s=new ke(.22,8,8),a=Math.min(Math.floor(e.length/3),280),r=new at(t,se("#4a4a52",.5,.4),a),o=new at(n,se("#4a4a52",.5,.4),a),c=new at(s,this.materials.lamp,a),l=new lt;let h=0;const d=It+.8;for(let x=0;x<e.length&&h<a;x+=3){const m=e[x],p=Math.cos(m.angle+Math.PI/2),v=Math.sin(m.angle+Math.PI/2),w=x%6<3?1:-1,M=m.x+p*d*w,T=m.y+v*d*w;dt(M,T,It)&&(l.position.set(M,1.9,T),l.scale.set(1,1,1),l.rotation.set(0,0,0),l.updateMatrix(),r.setMatrixAt(h,l.matrix),l.position.set(M+p*w*.35,3.7,T+v*w*.35),l.scale.set(1,1,1),l.rotation.set(0,-m.angle,0),l.updateMatrix(),o.setMatrixAt(h,l.matrix),l.position.set(M+p*w*.7,3.55,T+v*w*.7),l.rotation.set(0,0,0),l.updateMatrix(),c.setMatrixAt(h,l.matrix),h++)}this.scene.add(r),this.scene.add(o),this.scene.add(c);const u=new Oe(.18,.22,.7,8),f=new at(u,se(Ia.sunset,.55,.3),60);let g=0;for(let x=4;x<e.length&&g<60;x+=11){const m=e[x],p=Math.cos(m.angle+Math.PI/2),v=Math.sin(m.angle+Math.PI/2),w=m.x+p*(It+.5),M=m.y+v*(It+.5);dt(w,M,It)&&(l.position.set(w,.35,M),l.scale.set(1,1,1),l.updateMatrix(),f.setMatrixAt(g++,l.matrix))}this.scene.add(f)}addRoadsideDetail(e){const t=new lt,n=[se("#e85d4c",.7,.15),se("#e8b84a",.7,.15),se("#f0f0f8",.7,.1),se("#c45c9a",.7,.15),se("#3aa6c9",.7,.15)],s=new U(1,.25,2.2),a=new ke(.22,8,6),r=new at(s,se("#5a4030",.9,.15),160),o=n.map(x=>new at(a,x,200)),c=o.map(()=>0);let l=0;for(let x=1;x<e.length&&l<r.count;x+=4){const m=e[x],p=Math.cos(m.angle+Math.PI/2),v=Math.sin(m.angle+Math.PI/2),w=x%8<4?1:-1,M=m.x+p*(It+2.8)*w,T=m.y+v*(It+2.8)*w;if(!(!dt(M,T,It+1)||Fi(M,T,Ze+6))){t.position.set(M,.14,T),t.scale.set(1,1,1),t.rotation.set(0,-m.angle,0),t.updateMatrix(),r.setMatrixAt(l++,t.matrix);for(let S=0;S<5;S++){const A=(x+S)%o.length;c[A]>=o[A].count||(t.position.set(M+Math.cos(m.angle)*(S-2)*.35+p*w*.15,.38,T+Math.sin(m.angle)*(S-2)*.35+v*w*.15),t.scale.set(.7+S%3*.15,.7,.7),t.rotation.set(0,0,0),t.updateMatrix(),o[A].setMatrixAt(c[A]++,t.matrix))}}}this.scene.add(r);for(const x of o)this.scene.add(x);const h=new Oe(.06,.07,3.2,6),d=new U(1.8,.35,.08),u=new at(h,se("#6a6a72",.5,.4),40),f=new at(d,se("#1f6b4a",.5,.25),40);let g=0;for(let x=0;x<e.length&&g<40;x+=Math.floor(e.length/40)){const m=e[x],p=Math.cos(m.angle+Math.PI/2),v=Math.sin(m.angle+Math.PI/2),w=m.x+p*(It+1.5),M=m.y+v*(It+1.5);dt(w,M,It)&&(t.position.set(w,1.6,M),t.scale.set(1,1,1),t.rotation.set(0,0,0),t.updateMatrix(),u.setMatrixAt(g,t.matrix),t.position.set(w,3,M),t.rotation.set(0,-m.angle,0),t.updateMatrix(),f.setMatrixAt(g,t.matrix),g++)}this.scene.add(u),this.scene.add(f)}addSkyDecor(){const e=new ke(1,12,10),t=new at(e,this.materials.cloud,120),n=new lt,s=Id(99);let a=0;for(let c=0;c<36&&a<120;c++){const l=Kt.minX+s()*Kt.width,h=48+s()*40,d=Kt.minY+s()*Kt.height,u=7+s()*10;for(let f=0;f<3&&a<120;f++){n.position.set(l+(f-1)*u*.55,h+(f===1?u*.15:0),d+(s()-.5)*u*.3);const g=u*(.7+s()*.5);n.scale.set(g*1.5,g*.65,g*1.1),n.updateMatrix(),t.setMatrixAt(a++,n.matrix)}}this.scene.add(t);const r=new ke(1,16,10),o=new at(r,se("#5a9a62",.95,.08),24);for(let c=0;c<24;c++){const l=c/24*Math.PI*2,h=Math.max(Kt.width,Kt.height)*.48,d=(Kt.minX+Kt.maxX)/2+Math.cos(l)*h,u=(Kt.minY+Kt.maxY)/2+Math.sin(l)*h;n.position.set(d,-8,u),n.scale.set(40+c%5*8,18+c%3*4,40+c%4*6),n.rotation.set(0,0,0),n.updateMatrix(),o.setMatrixAt(c,n.matrix)}this.scene.add(o)}ensureRacers(e,t){for(const n of e)if(!this.racerMeshes.has(n.id)){const s=Ty(n.cart,n.driver,n.isPlayer,this.materials,n.isPlayer?n.name:void 0,n.isPlayer?t??null:null);this.scene.add(s),this.racerMeshes.set(n.id,s)}}syncProjectiles(e){const t=new Set;for(const n of e){t.add(n.id);let s=this.projectileMeshes.get(n.id);s||(s=Wu(n.kind),this.scene.add(s),this.projectileMeshes.set(n.id,s));const a=n.kind==="fireball"?1.1+Math.sin(this.clock*18)*.08:n.kind==="bolt"?1.05+Math.sin(this.clock*20+n.id)*.07:.85+Math.sin(this.clock*10+n.id)*.05;if(s.position.set(n.x,a,n.y),s.rotation.y=Math.atan2(n.vy,n.vx),n.kind==="bolt"){s.rotation.x=0,s.rotation.z=Math.sin(this.clock*28+n.id)*.12;const r=1+Math.sin(this.clock*26+n.id)*.08;s.scale.setScalar(r)}else if(s.rotation.x=n.spin*.35,s.rotation.z=n.spin*.2,n.kind==="fireball"){const r=1+Math.sin(this.clock*22+n.id)*.18;s.scale.setScalar(r)}}for(const[n,s]of this.projectileMeshes)t.has(n)||(this.scene.remove(s),this.projectileMeshes.delete(n))}syncAmmoPickups(e){const t=new Set;for(const n of e){t.add(n.id);let s=this.pickupMeshes.get(n.id);if(s||(s=Fy(n.kind),this.scene.add(s),this.pickupMeshes.set(n.id,s)),s.visible=n.active,!n.active)continue;const a=.35+Math.sin(n.phase)*.12;s.position.set(n.x,a,n.y),s.rotation.y=n.phase*.6}for(const[n,s]of this.pickupMeshes)t.has(n)||(this.scene.remove(s),this.pickupMeshes.delete(n))}syncSolids(e){for(const t of e)if(!(t.kind==="landmark"||t.kind==="gate"||t.kind==="island")&&t.destroyed){const n=this.solidMarkers.get(t.id);n&&(this.scene.remove(n),this.solidMarkers.delete(t.id))}}markSolidDestroyed(e){const t=this.solidMarkers.get(e);t&&(this.scene.remove(t),this.solidMarkers.delete(e))}syncHazards(e){const t=new Set;for(const n of e){if(!n.active)continue;t.add(n.id);let s=this.hazardMeshes.get(n.id);if(s&&!s.isSprite&&Fu(n.type)&&(this.scene.remove(s.root),this.hazardMeshes.delete(n.id),s=void 0),!s){const o=Gy(n);s={id:n.id,root:o.root,isSprite:o.isSprite,sprite:o.sprite,baseScaleX:o.sprite?Math.abs(o.sprite.scale.x):1,baseScaleY:o.sprite?o.sprite.scale.y:1},this.scene.add(s.root),this.hazardMeshes.set(n.id,s)}const a=n.type==="golf-ball"?Math.abs(Math.sin(this.clock*8+n.phase))*.28:n.type==="turtle"?Math.sin(this.clock*2+n.phase)*.04:n.type==="lightning"?Math.sin(this.clock*6+n.phase)*.08:0,r=this.elevAt(n.x,n.y,this.lastSamples);if(s.root.position.set(n.x,a+r,n.y),n.type==="golf-ball"&&!s.isSprite)s.root.rotation.x=this.clock*9+n.phase,s.root.rotation.z=this.clock*6;else if(n.type==="sinkhole")s.root.rotation.y=0;else if(!s.isSprite)s.root.rotation.y=-n.angle+Math.PI/2;else if(s.sprite&&s.baseScaleX){Hy(n,this.camera);const o=KM[n.type]?1:-1,c=n.faceSign*o,l=n.type==="lightning"?.94+Math.sin(this.clock*18+n.phase)*.08:1;s.sprite.scale.x=s.baseScaleX*c*l,s.sprite.scale.y=(s.baseScaleY??s.baseScaleX)*l}}for(const[n,s]of this.hazardMeshes)t.has(n)||(this.scene.remove(s.root),this.hazardMeshes.delete(n))}elevAt(e,t,n){const s=n??[];if(!s.length){let c=0,l=1/0;for(const h of on){const d=(h.x-e)**2+(h.y-t)**2;d<l&&(l=d,c=h.elev??0)}return c}let a=0,r=1/0;const o=Math.max(1,Math.floor(s.length/300));for(let c=0;c<s.length;c+=o){const l=s[c],h=(l.x-e)**2+(l.y-t)**2;h<r&&(r=h,a=l.elev??0)}return a}lastSamples=[];updateRacers(e,t){t&&(this.lastSamples=t);for(const n of e){const s=this.racerMeshes.get(n.id);if(!s)continue;const a=this.elevAt(n.x,n.y,this.lastSamples),r=n.trapTimer>0?.58:0;s.position.set(n.x,.15+a-r,n.y),s.rotation.y=-n.angle+Math.PI/2;const o=s.getObjectByName("gate-pass-arm");if(o)if(n.waveTimer>0){const c=Math.sin(n.waveTimer*22)*.55;o.rotation.z=-.15+c,o.rotation.x=-1.05,o.rotation.y=.35}else o.rotation.z=.85,o.rotation.x=.15,o.rotation.y=0}}updateCamera(e,t){const n=Math.min(1,Math.abs(e.speed)/36),s=this.elevAt(e.x,e.y,this.lastSamples),a=11+n*3.5,r=6.2+n*1.2+s,o=32+n*8,c=1.1+n*.3+s,l=e.x-Math.cos(e.angle)*a,h=e.y-Math.sin(e.angle)*a;if(this.tmp.set(l,r,h),this.lookAhead.set(e.x+Math.cos(e.angle)*o,c,e.y+Math.sin(e.angle)*o),this.cameraNeedsSnap)this.camPos.copy(this.tmp),this.camTarget.copy(this.lookAhead),this.cameraNeedsSnap=!1;else{const d=1-Math.pow(2e-4,t);this.camPos.lerp(this.tmp,d),this.camTarget.lerp(this.lookAhead,Math.min(1,d*1.25))}this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)}render(e){this.clock+=e,this.renderer.render(this.scene,this.camera)}resize(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t,!1)}dispose(){this.renderer.dispose()}renderMenuBackdrop(e){this.scene.background=new Le().setHSL(.35+Math.sin(e*2e-4)*.02,.45,.35),this.camera.position.set(0,40,80),this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera)}}function se(i,e,t){return new ct({color:i,roughness:e,metalness:t})}function Uy(i,e){const t=e.landmarkStyle,n=new F(new Oe(14,14,.18,28),se(e.plaza,.85,.08));if(n.position.y=.09,n.receiveShadow=!0,i.add(n),t==="lighthouse"){const s=new F(new Oe(2.4,2.8,1.2,12),se("#d8e4ec",.75,.15));s.position.y=.6,i.add(s);const a=new F(new Oe(1.35,1.85,14,14),se("#f4f8fc",.65,.18));a.position.y=8,a.castShadow=!0,i.add(a);for(const l of[4.5,9.5,13]){const h=new F(new Oe(1.5,1.5,1.1,14),se(l===9.5?e.accent:"#c45c48",.5,.25));h.position.y=l,i.add(h)}const r=new F(new Oe(2.1,1.55,2.2,10),se("#e8b84a",.35,.45));r.position.y=16,i.add(r);const o=new F(new ke(.65,12,12),new ct({color:"#fff8c0",emissive:"#ffe080",emissiveIntensity:.9,roughness:.2,metalness:.5}));o.position.y=17.6,i.add(o);const c=new F(new U(3.2,.35,10),se("#8b6a4a",.8,.1));c.position.set(0,.25,12),i.add(c)}else if(t==="western"){const s=new F(new Oe(.28,.38,13,8),se("#6b5344",.8,.15));s.position.y=6.5,s.castShadow=!0,i.add(s);for(let c=0;c<4;c++){const l=c*Math.PI/2,h=new F(new U(.28,5.2,.9),se("#c4a574",.75,.12));h.position.set(Math.cos(l)*2.6,13,Math.sin(l)*2.6),h.rotation.z=l,i.add(h)}for(const[c,l]of[[-2.2,-2.2],[2.2,-2.2],[-2.2,2.2],[2.2,2.2]]){const h=new F(new Oe(.12,.16,7,6),se("#5a4030",.85,.15));h.position.set(9+c,3.5,l),i.add(h)}const a=new F(new Oe(2.6,2.6,3.2,14),se("#8b7355",.7,.22));a.position.set(9,8.5,0),a.castShadow=!0,i.add(a);const r=new F(new ki(3,1.4,10),se(e.roof,.7,.2));r.position.set(9,10.8,0),i.add(r);const o=new F(new U(8,.15,.15),se("#4a3428",.85,.1));o.position.set(-6,1.1,6),i.add(o)}else if(t==="southwest"){const s=new F(new Oe(5.2,5.8,1.1,20),se(e.plaza,.75,.15));s.position.y=.55,s.castShadow=!0,i.add(s);const a=new F(new Oe(4.2,4.2,.55,20),se(e.water,.12,.55));a.position.y=1.15,i.add(a);const r=new F(new Oe(2.2,2.6,1.4,14),se(e.stucco[1]??e.stucco[0],.8,.12));r.position.y=1.9,i.add(r);const o=new F(new Oe(.28,.45,2.8,8),se(e.accent,.45,.35));o.position.y=3.6,i.add(o);const c=new F(new ke(.45,10,10),se(e.water,.2,.4));c.position.y=5.2,i.add(c);for(let l=0;l<6;l++){const h=l/6*Math.PI*2,d=new F(new Oe(.55,.7,1.1,8),se(e.roof,.7,.15));d.position.set(Math.cos(h)*8,.55,Math.sin(h)*8),i.add(d);const u=new F(new ke(.55,8,8),se(e.grassDeep,.9,.05));u.position.set(Math.cos(h)*8,1.35,Math.sin(h)*8),i.add(u)}}else if(t==="midcentury"){const s=new F(new U(14,.35,14),se(e.plaza,.7,.15));s.position.y=.18,i.add(s);for(const[l,h]of[[-5,-5],[5,-5],[-5,5],[5,5]]){const d=new F(new Oe(.32,.38,7,10),se(e.stucco[0],.75,.18));d.position.set(l,3.6,h),d.castShadow=!0,i.add(d)}const a=new F(new U(16,.28,16),se(e.roof,.55,.28));a.position.y=7.2,a.rotation.x=.06,i.add(a);const r=new F(new U(16.2,.35,.6),se(e.roofAlt,.5,.25));r.position.set(0,7.35,0),i.add(r);const o=new F(new U(4,.9,4),se(e.accent,.45,.3));o.position.y=.55,i.add(o);const c=new F(new U(3.2,.25,3.2),se(e.water,.15,.5));c.position.y=1.05,i.add(c)}else{const s=new F(new Oe(11,11,.22,28),se(e.plaza,.7,.15));s.position.y=.12,i.add(s);for(let o=0;o<8;o++){const c=o/8*Math.PI*2,l=Math.cos(c)*7.5,h=Math.sin(c)*7.5,d=new F(new Oe(.12,.16,5.5,6),se("#5a7060",.75,.15));d.position.set(l,2.75,h),i.add(d);const u=new F(new ke(1.4,10,10),se(o%2===0?e.accent:e.grass,.55,.1));u.position.set(l,5.6,h),u.scale.y=.55,i.add(u)}const a=new F(new Jt(2.8,.45,10,28),se(e.accent,.35,.45));a.position.y=3.8,a.rotation.x=Math.PI/2.4,i.add(a);const r=new F(new U(8,.5,4),se(e.roof,.7,.2));r.position.set(0,.35,10),i.add(r)}}function Wu(i){const e=new Tt;if(i==="golf-ball"){const t=new F(new ke(.38,24,20),new ct({color:"#f7f7f2",roughness:.45,metalness:.08}));t.castShadow=!0,e.add(t);for(let s=0;s<18;s++){const a=Math.acos(1-2*(s+.5)/18),r=Math.PI*(1+Math.sqrt(5))*s,o=.36,c=new F(new ke(.035,6,6),se("#d8d8d4",.6,.05));c.position.set(o*Math.sin(a)*Math.cos(r),o*Math.sin(a)*Math.sin(r),o*Math.cos(a)),e.add(c)}const n=new F(new ke(.42,12,10),new ct({color:"#ffffff",roughness:.2,metalness:.1,transparent:!0,opacity:.15}));e.add(n)}else if(i==="fireball"){const t=new F(new ke(.28,16,14),new ct({color:"#1a0800",roughness:.9,metalness:.1,emissive:"#ff2200",emissiveIntensity:.8}));t.castShadow=!0,e.add(t);const n=new F(new ke(.42,14,12),new ct({color:"#ff5510",roughness:.5,metalness:.15,emissive:"#ff4400",emissiveIntensity:.6,transparent:!0,opacity:.92}));e.add(n);const s=new F(new ke(.58,12,10),new ct({color:"#ffcc33",roughness:.35,metalness:.1,emissive:"#ffaa00",emissiveIntensity:.45,transparent:!0,opacity:.45}));e.add(s);for(let a=0;a<4;a++){const r=a/4*Math.PI*2,o=new F(new ki(.14,.55,6),new ct({color:a%2===0?"#ff6622":"#ffdd44",roughness:.4,emissive:"#ff6600",emissiveIntensity:.5,transparent:!0,opacity:.75}));o.position.set(Math.cos(r)*.15,Math.sin(r)*.15,-.45),o.rotation.x=Math.PI/2,e.add(o)}}else if(i==="bolt"){const t=new ct({color:"#f4fbff",roughness:.12,metalness:.25,emissive:"#7ecbff",emissiveIntensity:1.55}),n=new ct({color:"#4aa8ff",roughness:.35,metalness:.1,emissive:"#2a7dff",emissiveIntensity:.55,transparent:!0,opacity:.35,side:nn}),s=[{x:-.85,y:.22,len:.62,ang:-.72},{x:-.38,y:-.08,len:.7,ang:.78},{x:.12,y:.18,len:.62,ang:-.7},{x:.58,y:-.1,len:.68,ang:.74},{x:.98,y:.12,len:.42,ang:-.55}];for(const r of s){const o=new F(new U(r.len,.14,.1),t);o.position.set(r.x,r.y,0),o.rotation.z=r.ang,o.castShadow=!0,e.add(o);const c=new F(new U(r.len+.12,.28,.04),n);c.position.set(r.x,r.y,0),c.rotation.z=r.ang,e.add(c)}const a=new F(new ki(.12,.32,8),t);a.rotation.z=-Math.PI/2,a.position.set(1.28,.02,0),e.add(a)}else{const t=new ct({color:"#e0b85a",roughness:.95,metalness:.02}),n=se("#c49a40",.98,.02),s=new F(new ke(.42,16,12),t);s.scale.set(1.15,.85,1),s.castShadow=!0,e.add(s);for(let r=0;r<22;r++){const o=Math.acos(1-2*(r+.5)/22),c=Math.PI*(1+Math.sqrt(5))*r,l=.38,h=new F(new ke(.06,6,6),n);h.position.set(l*Math.sin(o)*Math.cos(c)*1.15,l*Math.sin(o)*Math.sin(c)*.85,l*Math.cos(o)),e.add(h)}const a=new F(new Jt(.22,.035,6,14),se("#8b6914",.85,.1));a.position.set(.35,.15,0),a.rotation.y=Math.PI/2,e.add(a);for(let r=0;r<6;r++){const o=new F(new Oe(.015,.02,.35,4),se("#d4a84a",.9,.05));o.position.set((r-2.5)*.08,.25,.2),o.rotation.z=(r-2.5)*.15,o.rotation.x=.4,e.add(o)}}return e}function Fy(i){const e=new Tt,t=i==="fireball"?"#e85d4c":i==="loofah"?"#e8b84a":"#3aa6c9",n=new F(new Oe(1.4,1.5,.12,20),new ct({color:t,roughness:.4,metalness:.35,emissive:t,emissiveIntensity:.35}));n.receiveShadow=!0,e.add(n);const s=new F(new Jt(1.05,.08,8,24),new ct({color:"#fff8ee",roughness:.3,metalness:.4,emissive:"#ffffff",emissiveIntensity:.2}));s.rotation.x=Math.PI/2,s.position.y=.1,e.add(s);const a=Wu(i);a.scale.setScalar(.85),a.position.y=.85,e.add(a);const r=Yc(`${El(i)} ${$i(i)}`,"#1c2430","rgba(255,248,238,0.9)");return r.position.set(0,1.6,0),r.scale.set(3.2,.9,1),e.add(r),e}function dn(i,e,t){return i.map(n=>{const s=Math.cos(n.angle+Math.PI/2),a=Math.sin(n.angle+Math.PI/2);return new L(n.x+s*e,t(n),n.y+a*e)})}function Vo(i,e){const t=[];let n=[];const s=a=>Fi(a.x,a.y,e);for(const a of i)s(a)?(n.length>=2&&t.push(n),n=[]):n.push(a);if(n.length>=2&&t.push(n),t.length>=2&&i.length>=2&&!s(i[0])&&!s(i[i.length-1])&&t[0][0]===i[0]&&t[t.length-1][t[t.length-1].length-1]===i[i.length-1]){const a=t.pop();t[0]=a.concat(t[0])}return t}function li(i,e){const t=Math.min(i.length,e.length),n=[],s=[],a=[],r=[];for(let c=0;c<t;c++){const l=i[c],h=e[c];if(n.push(l.x,l.y,l.z,h.x,h.y,h.z),s.push(0,1,0,0,1,0),a.push(0,c*.1,1,c*.1),c<t-1){const d=c*2,u=d+1,f=d+2,g=d+3;r.push(d,u,f,u,g,f)}}const o=new Ot;return o.setAttribute("position",new ht(n,3)),o.setAttribute("normal",new ht(s,3)),o.setAttribute("uv",new ht(a,2)),o.setIndex(r),o.computeBoundingSphere(),o.computeBoundingBox(),o}function Oy(i,e){let t=1/0,n=-1/0,s=1/0,a=-1/0;for(const r of i)t=Math.min(t,r.x),n=Math.max(n,r.x),s=Math.min(s,r.y),a=Math.max(a,r.y);return Number.isFinite(t)?{minX:t-e,maxX:n+e,minY:s-e,maxY:a+e,cx:(t+n)/2,cz:(s+a)/2}:{minX:-200,maxX:200,minY:-200,maxY:200,cx:0,cz:0}}function ky(){const i=new Tt,e=new F(new ke(.55,24,20),new ct({color:"#f4f4ef",roughness:.42,metalness:.08}));e.castShadow=!0,e.position.y=.58,i.add(e);for(let t=0;t<22;t++){const n=Math.acos(1-2*(t+.5)/22),s=Math.PI*(1+Math.sqrt(5))*t,a=.53,r=new F(new ke(.045,6,6),se("#cfcfc8",.65,.04));r.position.set(a*Math.sin(n)*Math.cos(s),.58+a*Math.sin(n)*Math.sin(s),a*Math.cos(n)),i.add(r)}return i}function By(){const i=new Tt;for(let e=0;e<3;e++){const t=new Tt,n=new F(new Oe(.035,.055,2.6,6),se("#6b4a28",.88,.04));n.rotation.z=Math.PI/2,n.position.y=.07,t.add(n);for(let s=0;s<9;s++){const a=new F(new U(.62,.025,.15),se(s%2?"#2a6a38":"#3d8f4a",.72,.04)),r=s/8*2.2-1.1;a.position.set(r,.09,s%2?.24:-.24),a.rotation.y=s%2?.45:-.45,a.rotation.z=r*.08,t.add(a)}t.rotation.y=e*2.15+.25,t.position.set((e-1)*.22,e*.02,(e-1)*.12),i.add(t)}return i}function zy(){const i=new Tt,e=new F(new ki(2.2,1.45,20,1,!0),new ct({color:"#060504",roughness:1,metalness:0,side:nn}));e.position.y=-.58,i.add(e);const t=new F(new xn(.32,12),new ct({color:"#030201",roughness:1}));t.rotation.x=-Math.PI/2,t.position.y=-1.25,i.add(t);const n=new F(new Jt(2.28,.32,8,24),se("#6e6a60",.95,.02));n.rotation.x=Math.PI/2,n.position.y=.18,n.castShadow=!0,i.add(n);const s=new F(new Ln(2.05,2.65,32),new ct({color:"#f5c518",roughness:.5,metalness:.04,emissive:"#c49208",emissiveIntensity:.45}));s.rotation.x=-Math.PI/2,s.position.y=.1,i.add(s);const a=new F(new Ln(2.65,3.05,32),new ct({color:"#e85d14",roughness:.48,metalness:.04,emissive:"#9a2e00",emissiveIntensity:.32}));a.rotation.x=-Math.PI/2,a.position.y=.09,i.add(a);for(let c=0;c<8;c++){const l=new F(new U(.85,.14,.42),se(c%2?"#5f5b52":"#4c4840",.92,.04)),h=c/8*Math.PI*2+.18;l.position.set(Math.cos(h)*2.2,.26,Math.sin(h)*2.2),l.rotation.y=h,l.rotation.z=.38+c%3*.1,l.castShadow=!0,i.add(l)}const r=new ct({color:"#f25c12",roughness:.42,emissive:"#7a2200",emissiveIntensity:.22}),o=new ct({color:"#fff8ee",roughness:.38});for(let c=0;c<3;c++){const l=c/3*Math.PI*2+.55,h=Math.cos(l)*2.85,d=Math.sin(l)*2.85,u=new F(new ki(.24,.82,8),r);u.position.set(h,.48,d),u.castShadow=!0,i.add(u);const f=new F(new Oe(.19,.21,.09,8),o);f.position.set(h,.36,d),i.add(f);const g=new F(new U(.42,.07,.42),r);g.position.set(h,.07,d),i.add(g)}return i}function Gy(i){if(i.type==="golf-ball")return{root:ky(),isSprite:!1};if(i.type==="palm-frond")return{root:By(),isSprite:!1};if(i.type==="sinkhole")return{root:zy(),isSprite:!1};const e=new Tt,t=Ou(i.type);if(t){const r=new F(new xn(.7,16),new Un({color:"#1c2430",transparent:!0,opacity:.28,depthWrite:!1}));return r.rotation.x=-Math.PI/2,r.position.y=.04,e.add(r),e.add(t),{root:e,isSprite:!0,sprite:t}}const n=Rr[i.type],s=n.scale*.55,a=new F(new ke(.55*s,12,10),se(n.color,.55,.2));return a.position.y=.55*s,a.castShadow=!0,e.add(a),{root:e,isSprite:!1}}const As=new L,Wo=new L,Cd=new ei;function Hy(i,e){const t=Math.hypot(i.vx,i.vy),n=t>.12?i.vx:Math.cos(i.angle),s=t>.12?i.vy:Math.sin(i.angle);Cd.copy(e.quaternion).invert(),Wo.set(n,0,s).applyQuaternion(Cd),As.set(1,0,0).applyQuaternion(e.quaternion),As.y=0,As.lengthSq()>1e-6&&As.normalize();const a=n*As.x+s*As.z,r=Math.abs(Wo.x)>.08?Wo.x:a,o=.18;r>o?i.faceSign=1:r<-o&&(i.faceSign=-1)}function Pd(i){const e=Math.min(1,Math.max(0,i));return e*e*(3-2*e)}function Vy(i,e,t,n){const a=i-e,r=[];for(let o=0;o<=12;o++){const c=o/12;r.push({z:-i+c*a,y:n+(t-n)*Pd(c)})}r.push({z:e,y:t});for(let o=1;o<=12;o++){const c=o/12;r.push({z:e+c*a,y:n+(t-n)*Pd(1-c)})}return r}function Rs(i,e,t,n,s,a=0){if(e.length<2)return;const r=[],o=[];for(const d of e){const u=d.y+n,f=d.y-n;r.push(a-t,u,d.z),r.push(a+t,u,d.z),r.push(a+t,f,d.z),r.push(a-t,f,d.z)}for(let d=0;d<e.length-1;d++){const u=d*4,f=u+4;o.push(u,f,f+1,u,f+1,u+1),o.push(u+3,u+2,f+2,u+3,f+2,f+3),o.push(u+1,f+1,f+2,u+1,f+2,u+2),o.push(u,u+3,f+3,u,f+3,f)}o.push(0,1,2,0,2,3);const c=(e.length-1)*4;o.push(c,c+3,c+2,c,c+2,c+1);const l=new Ot;l.setAttribute("position",new ht(r,3)),l.setIndex(o),l.computeVertexNormals();const h=new F(l,s);h.castShadow=!0,h.receiveShadow=!0,i.add(h)}function Wy(i,e){const t=Vy(e.halfLen,e.centerHalf,e.deckY,e.groundY),n=.21;Rs(i,t,e.thickX*.5,n,e.deckMat),Rs(i,t.map(s=>({z:s.z,y:s.y+.24})),3.8,.04,e.asphalt);for(const s of[-1,1]){Rs(i,t.map(r=>({z:r.z,y:r.y+.26})),1.6,.05,e.sidewalk,s*6.2);const a=s*(e.thickX*.5-.16);Rs(i,t.map(r=>({z:r.z,y:r.y+1.18})),.06,.06,e.railMat,a),Rs(i,t.map(r=>({z:r.z,y:r.y+.72})),.04,.04,e.railMat,a);for(let r=0;r<t.length;r+=2){const o=t[r],c=new F(new U(.12,1.18,.12),e.railMat);c.position.set(a,o.y+.78,o.z),i.add(c)}Rs(i,t.map(r=>({z:r.z,y:r.y-n-e.girderH*.5-.08})),.42,e.girderH*.5,e.steel,s*(e.thickX*.5-1.2))}for(let s=2;s<t.length-2;s+=3){const a=t[s];if(Math.abs(a.z)<e.centerHalf-.5)continue;const r=Math.max(1.2,a.y+.2);for(const o of[-1,1]){const c=new F(new U(2.8,r,2.8),se(e.towerCream,.9,.08));c.position.set(o*(e.thickX*.5-1.4),r/2,a.z),c.castShadow=!0,i.add(c)}}}function Xy(i,e,t,n,s,a,r,o){const c=t-e,l=12,h=[];for(let u=0;u<=l;u++){const f=u/l;h.push({z:e+f*c,y:s+4*a*f*(1-f)})}for(let u=0;u<l;u++){const f=h[u],g=h[u+1],x=g.z-f.z,m=g.y-f.y,p=Math.hypot(x,m),v=new F(new U(.36,.36,p),r);v.position.set(n,(f.y+g.y)/2,(f.z+g.z)/2),v.rotation.x=-Math.atan2(m,x),v.castShadow=!0,i.add(v)}const d=new F(new U(.38,.38,c),r);d.position.set(n,s,(e+t)/2),d.castShadow=!0,i.add(d);for(let u=1;u<l;u++){const f=h[u].y-s,g=new F(new U(.16,Math.max(.2,f),.16),u%2===0?r:o);g.position.set(n,s+f/2,h[u].z),i.add(g)}for(let u=0;u<l;u++){const f={z:h[u].z,y:s},g=h[u+1],x=g.z-f.z,m=g.y-f.y,p=Math.hypot(x,m),v=new F(new U(.12,.12,p),o);v.position.set(n,(f.y+g.y)/2,(f.z+g.z)/2),v.rotation.x=-Math.atan2(m,x),i.add(v)}}function qy(){const i=document.createElement("canvas");i.width=2048,i.height=512;const e=i.getContext("2d");e.clearRect(0,0,2048,512),e.textAlign="center",e.textBaseline="middle",e.font="italic 800 248px Georgia, 'Palatino Linotype', 'Times New Roman', serif",e.lineJoin="round",e.miterLimit=2,e.strokeStyle="#0f3d38",e.lineWidth=16,e.strokeText("The Villages",1024,268),e.fillStyle="#2ea892",e.fillText("The Villages",1024,268);const t=new Vs(i);return t.colorSpace=_t,new F(new Mi(24,6),new Un({map:t,transparent:!0,depthTest:!0,side:nn}))}function Yy(i){const e=i.trim().split(/\s+/);if(e.length<=1)return[i];if(i.length<=14)return[i];const t=Math.ceil(e.length/2);return[e.slice(0,t).join(" "),e.slice(t).join(" ")]}function $y(i){const e=Yy(i),t=document.createElement("canvas");t.width=1024,t.height=320;const n=t.getContext("2d");n.fillStyle="#f7f1e6",n.fillRect(0,0,1024,320),n.strokeStyle="#8a7048",n.lineWidth=16,n.strokeRect(10,10,1004,300),n.fillStyle="#1c2430",n.textAlign="center",n.textBaseline="middle";let s=e.length>1?78:92;const a=()=>Math.max(...e.map(h=>n.measureText(h).width))<=900;for(n.font=`800 ${s}px "DM Sans", system-ui, sans-serif`;s>40&&!a();)s-=4,n.font=`800 ${s}px "DM Sans", system-ui, sans-serif`;const r=s+10,o=160-(e.length-1)*r/2;for(let h=0;h<e.length;h++)n.fillText(e[h],512,o+h*r);const c=new Vs(t);c.colorSpace=_t,c.anisotropy=8;const l=e.length>1?1.05:.86;return new F(new Mi(3.35,l),new Un({map:c,toneMapped:!1,depthTest:!0}))}function Yc(i,e,t){const n=document.createElement("canvas");n.width=512,n.height=128;const s=n.getContext("2d");s.clearRect(0,0,512,128),t!=="transparent"&&(s.fillStyle=t,Ky(s,8,16,496,96,24),s.fill()),s.fillStyle=e,s.font="bold 48px DM Sans, system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,256,64);const a=new Vs(n);a.colorSpace=_t;const r=new Vr({map:a,transparent:!0,depthTest:!0});return new dl(r)}function Ky(i,e,t,n,s,a){i.beginPath(),i.moveTo(e+a,t),i.arcTo(e+n,t,e+n,t+s,a),i.arcTo(e+n,t+s,e,t+s,a),i.arcTo(e,t+s,e,t,a),i.arcTo(e,t,e+n,t,a),i.closePath()}function Id(i){return function(){let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Zy(i,e,t,n){const s=i.canvas.width,a=i.canvas.height;i.clearRect(0,0,s,a);const r=i.createRadialGradient(s/2,a/2,10,s/2,a/2,s*.7);r.addColorStop(0,"#1a5a3c"),r.addColorStop(1,"#0c2e20"),i.fillStyle=r,i.fillRect(0,0,s,a);let o=1/0,c=-1/0,l=1/0,h=-1/0;for(let M=0;M<t.length;M+=3){const T=t[M];o=Math.min(o,T.x),c=Math.max(c,T.x),l=Math.min(l,T.y),h=Math.max(h,T.y)}Number.isFinite(o)||(o=Kt.minX,c=Kt.maxX,l=Kt.minY,h=Kt.maxY);const d=28;o-=d,c+=d,l-=d,h+=d;const u=Math.max(40,c-o),f=Math.max(40,h-l),g=Math.min(s/u,a/f)*.92,x=(s-u*g)/2,m=(a-f*g)/2,p=M=>x+(M-o)*g,v=M=>a-(m+(M-l)*g);i.fillStyle="rgba(61, 155, 95, 0.35)",i.fillRect(0,0,s,a),i.strokeStyle="rgba(70, 76, 88, 0.98)",i.lineWidth=9,i.lineJoin="round",i.lineCap="round",i.beginPath();for(let M=0;M<t.length;M+=2){const T=t[M];M===0?i.moveTo(p(T.x),v(T.y)):i.lineTo(p(T.x),v(T.y))}if(i.closePath(),i.stroke(),i.strokeStyle="rgba(245, 208, 64, 0.9)",i.lineWidth=2.2,i.stroke(),t[0]){const M=t[0];i.fillStyle="#e85d4c",i.beginPath(),i.arc(p(M.x),v(M.y),4.5,0,Math.PI*2),i.fill(),i.fillStyle="#fff",i.font="bold 8px DM Sans, sans-serif",i.textAlign="center",i.fillText("S",p(M.x),v(M.y)+3)}for(const M of Rn)M.kind==="town-square"&&(M.x<o-40||M.x>c+40||M.y<l-40||M.y>h+40||(i.fillStyle=Ia.gold,i.beginPath(),i.arc(p(M.x),v(M.y),3.5,0,Math.PI*2),i.fill(),i.fillStyle="rgba(255,255,255,0.85)",i.font="bold 7px DM Sans, sans-serif",i.textAlign="center",i.fillText(M.shortName.slice(0,10),p(M.x),v(M.y)-6)));for(const M of n)M.active&&(i.fillStyle="rgba(232, 93, 76, 0.85)",i.beginPath(),i.arc(p(M.x),v(M.y),2,0,Math.PI*2),i.fill());const w=[...e].sort((M,T)=>(M.isPlayer?1:0)-(T.isPlayer?1:0));for(const M of w){const T=p(M.x),S=v(M.y);M.isPlayer?(i.save(),i.translate(T,S),i.rotate(-M.angle),i.fillStyle=Ia.gold,i.beginPath(),i.moveTo(7,0),i.lineTo(-5,4.5),i.lineTo(-5,-4.5),i.closePath(),i.fill(),i.strokeStyle="#1c2430",i.lineWidth=1,i.stroke(),i.restore(),i.fillStyle="#fff",i.font="bold 8px DM Sans, sans-serif",i.textAlign="center",i.fillText("YOU",T,S+12)):(i.fillStyle=M.cart.color,i.beginPath(),i.arc(T,S,3.2,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(255,255,255,0.5)",i.lineWidth=1,i.stroke())}}const Jy=document.getElementById("game"),Xu=document.getElementById("ui"),At=new VM;let $c=null,Ht=new Ny(Jy),tt=null,jt="loading",Kc=null,qu=!1,Zc=0,Il=!1;const fn=new Cv(Xu,{onStartSelect:()=>{jt="area",fn.showAreaSelect()},onShowHow:()=>{jt="how",fn.showHow()},onShowSettings:()=>{jt="menu",fn.showSettings()},onShowLeaderboard:()=>{},onShowDonate:()=>{jt="menu",fn.showDonate()},onBackMenu:()=>{jy()},onRace:i=>Ld(i),onPlayAgain:()=>{Kc?Ld(Kc):(At.enabled=!1,At.reset(),jt="area",fn.showAreaSelect())},onStopRace:()=>{jt==="race"&&tt&&!tt.finished&&tt.stopEarly()},onTouch:(i,e)=>{i==="throttle"&&At.set({throttle:e}),i==="brake"&&At.set({brake:e}),i==="left"&&At.set({left:e}),i==="right"&&At.set({right:e}),i==="fire"&&At.set({fire:e}),i==="gate"&&At.set({gate:e})},onRecenterTilt:()=>At.recenterTilt()});function Yu(){const i=window.innerWidth,e=window.innerHeight;Ht.resize(i,e)}function Ld(i){Kc=i,qu=!1,Ca.prepareForRace(i.areaId),zt.unlock(),At.reset(),At.enabled=!0,Er()?At.startTilt().then(e=>{if(jt==="race"){if(!e){fn.setDrivePadMode("buttons");return}window.setTimeout(()=>{jt==="race"&&!At.tilt.ready&&fn.setDrivePadMode("buttons")},1600)}}):At.stopTilt(),$c&&Ht.setMaterials($c.materials),tt=new bv({playerName:i.playerName,cartId:i.cartId,driverId:i.driverId,areaId:i.areaId,difficultyId:i.difficultyId}),Ht.buildWorld(tt.samples,tt.decor,tt.areaId),Ht.ensureRacers(tt.racers,ns()),Ht.snapCameraToPlayer(tt.getPlayer()),Ht.render(0),Il=!0,jt="race",fn.showRaceHud(),Zc=performance.now()}function jy(){At.enabled=!1,At.stopTilt(),At.reset(),Ca.stop(),tt=null,Il=!1,jt="menu",fn.showMenu()}function $u(i){requestAnimationFrame($u);const e=Math.min(.05,(i-Zc)/1e3||.016);if(Zc=i,jt==="race"&&tt){At.update(e),tt.update(e,At),tt.justWentGreen&&(tt.justWentGreen=!1,Ca.startNow()),Ht.ensureRacers(tt.racers,ns()),Ht.updateRacers(tt.racers,tt.samples),Ht.syncHazards(tt.hazards),Ht.syncProjectiles(tt.projectiles),Ht.syncSolids(tt.solids),Ht.syncAmmoPickups(tt.ammoPickups),Ht.updateGates(),Ht.updateCamera(tt.getPlayer(),e),Ht.render(e);const t=tt.getPlayer(),n=tt.events.find(o=>o.kind==="banner"),s=tt.events.find(o=>o.kind==="toast"||o.kind==="checkpoint"),a=s?s.sub?`${s.text} — ${s.sub}`:s.text:tt.upcomingHazard?tt.upcomingHazard:null;fn.updateHud({place:t.place,lap:t.lap,laps:Cr,score:t.score,time:tt.time,playerName:t.name,areaName:tt.areaName,ammoLabel:`${El(tt.playerAmmo)} ${t.ammo}/${Cs}`,banner:n?.text??null,toast:a,landmark:s||tt.upcomingHazard?null:tt.nearbyLandmark,wrongWay:tt.wrongWayAlert});const r=fn.getMiniMapCanvas();if(r){const o=r.getContext("2d");o&&Zy(o,tt.racers,tt.samples,tt.hazards)}tt.finished&&jt==="race"&&(At.enabled=!1,At.stopTilt(),At.reset(),Ca.stop(),jt="results",fn.showResults(tt.getResult(),qu))}else jt!=="loading"?(At.enabled&&(At.enabled=!1,At.reset()),Il?Ht.render(e):Ht.renderMenuBackdrop(i)):Ht.renderMenuBackdrop(i)}Xu.innerHTML=`
  <div class="screen">
    <p class="brand-kicker">Art pack loading</p>
    <h1>The Villages Golf Cart Hero</h1>
    <p class="tagline">Loading photoreal texture packs for carts, houses, palms &amp; terrain…</p>
    <div class="panel tight" style="text-align:center">
      <p style="margin:0;color:var(--muted)">This only happens once at startup.</p>
    </div>
  </div>
`;Yu();window.addEventListener("resize",Yu);requestAnimationFrame($u);async function Dd(){const i=new URLSearchParams(window.location.search),e=i.get("donate"),t=i.get("session_id");if(e||t){const n=window.location.pathname||"/";window.history.replaceState({},"",n)}if(e==="canceled")return"Checkout canceled — no charge. You can tip anytime from the menu.";if(e==="success"&&t){const n=await EM(t);return n.ok?n.message||(n.tier?`Thanks! $${n.amountUsd} tip recorded — ${n.tier===5?"Gold":n.tier===3?"Blue":"Red"} flag unlocked.`:"Thanks for the tip!"):n.error||"Could not verify tip. If you were charged, the flag may still unlock after refresh."}return null}vM().then(async i=>{$c=i,Ht.setMaterials(i.materials);const e=Object.keys(i.textures).length;console.info(`[assets] Loaded ${e} textures`);const t=await Dd();jt="menu",fn.showMenu({donateBanner:t})}).catch(async i=>{console.error("[assets] Load failed, using solid materials",i);const e=await Dd();jt="menu",fn.showMenu({donateBanner:e})});window.addEventListener("keydown",i=>{if(jt!=="race")return;const e=i.target;if(e instanceof HTMLElement){const t=e.tagName;if(t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.isContentEditable)return}["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","g","G"].includes(i.key)&&i.preventDefault()},{passive:!1});

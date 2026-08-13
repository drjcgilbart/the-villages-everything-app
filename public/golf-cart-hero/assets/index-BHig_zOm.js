(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Ou="modulepreload",ku=function(i){return"/golf-cart-hero/"+i},yl={},Sl=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let l=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};var a=l;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");s=l(t.map(h=>{if(h=ku(h),h in yl)return;yl[h]=!0;const d=h.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${u}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Ou,d||(f.as="script"),f.crossOrigin="",f.href=h,c&&f.setAttribute("nonce",c),document.head.appendChild(f),d)return new Promise((g,_)=>{f.addEventListener("load",g),f.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return s.then(o=>{for(const c of o||[])c.status==="rejected"&&r(c.reason);return e().catch(r)})};const Fc="185",Bu=0,bl=1,zu=2,aa=1,fd=2,Qs=3,ci=0,on=1,fn=2,ai=0,ys=1,wl=2,Tl=3,El=4,Gu=5,zi=100,Hu=101,Vu=102,Wu=103,Xu=104,qu=200,Yu=201,$u=202,Ku=203,Uo=204,Fo=205,Zu=206,Ju=207,ju=208,Qu=209,ef=210,tf=211,nf=212,sf=213,rf=214,Oo=0,ko=1,Bo=2,Es=3,zo=4,Go=5,Ho=6,Vo=7,pd=0,af=1,of=2,Wn=0,md=1,gd=2,_d=3,Oc=4,xd=5,Md=6,vd=7,Al="attached",cf="detached",yd=300,Xi=301,As=302,Ha=303,Va=304,Ia=306,Ri=1e3,Hn=1001,Ma=1002,Gt=1003,Sd=1004,er=1005,Ht=1006,oa=1007,ii=1008,pn=1009,bd=1010,wd=1011,hr=1012,kc=1013,qn=1014,Sn=1015,li=1016,Bc=1017,zc=1018,dr=1020,Td=35902,Ed=35899,Ad=1021,Rd=1022,bn=1023,hi=1026,Vi=1027,Gc=1028,Hc=1029,qi=1030,Vc=1031,Wc=1033,ca=33776,la=33777,ha=33778,da=33779,Wo=35840,Xo=35841,qo=35842,Yo=35843,$o=36196,Ko=37492,Zo=37496,Jo=37488,jo=37489,va=37490,Qo=37491,ec=37808,tc=37809,nc=37810,ic=37811,sc=37812,rc=37813,ac=37814,oc=37815,cc=37816,lc=37817,hc=37818,dc=37819,uc=37820,fc=37821,pc=36492,mc=36494,gc=36495,_c=36283,xc=36284,ya=36285,Mc=36286,ur=2300,fr=2301,Wa=2302,Rl=2303,Cl=2400,Pl=2401,Il=2402,lf=2500,hf=0,Cd=1,vc=2,df=3200,yc=0,uf=1,wi="",wt="srgb",gn="srgb-linear",Sa="linear",dt="srgb",ji=7680,Ll=519,ff=512,pf=513,mf=514,Xc=515,gf=516,_f=517,qc=518,xf=519,Sc=35044,Dl="300 es",Vn=2e3,pr=2001;function Mf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function vf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function mr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function yf(){const i=mr("canvas");return i.style.display="block",i}const Nl={};function ba(...i){const e="THREE."+i.shift();console.log(e,...i)}function Pd(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ie(...i){i=Pd(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ke(...i){i=Pd(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ss(...i){const e=i.join(" ");e in Nl||(Nl[e]=!0,Ie(...i))}function Sf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const bf={[Oo]:ko,[Bo]:Ho,[zo]:Vo,[Es]:Go,[ko]:Oo,[Ho]:Bo,[Vo]:zo,[Go]:Es};class Ki{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ul=1234567;const ar=Math.PI/180,Rs=180/Math.PI;function Cn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(jt[i&255]+jt[i>>8&255]+jt[i>>16&255]+jt[i>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function Yc(i,e){return(i%e+e)%e}function wf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Tf(i,e,t){return i!==e?(t-i)/(e-i):0}function or(i,e,t){return(1-t)*i+t*e}function Ef(i,e,t,n){return or(i,e,1-Math.exp(-t*n))}function Af(i,e=1){return e-Math.abs(Yc(i,e*2)-e)}function Rf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Cf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Pf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function If(i,e){return i+Math.random()*(e-i)}function Lf(i){return i*(.5-Math.random())}function Df(i){i!==void 0&&(Ul=i);let e=Ul+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Nf(i){return i*ar}function Uf(i){return i*Rs}function Ff(i){return(i&i-1)===0&&i!==0}function Of(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function kf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Bf(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*d,c*u,o*l);break;case"YZY":i.set(c*u,o*h,c*d,o*l);break;case"ZXZ":i.set(c*d,c*u,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ut(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const zf={DEG2RAD:ar,RAD2DEG:Rs,generateUUID:Cn,clamp:st,euclideanModulo:Yc,mapLinear:wf,inverseLerp:Tf,lerp:or,damp:Ef,pingpong:Af,smoothstep:Rf,smootherstep:Cf,randInt:Pf,randFloat:If,randFloatSpread:Lf,seededRandom:Df,degToRad:Nf,radToDeg:Uf,isPowerOfTwo:Ff,ceilPowerOfTwo:Of,floorPowerOfTwo:kf,setQuaternionFromProperEuler:Bf,normalize:ut,denormalize:Rn};class Ge{static{Ge.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(d!==_||c!==u||l!==f||h!==g){let m=c*u+l*f+h*g+d*_;m<0&&(u=-u,f=-f,g=-g,_=-_,m=-m);let p=1-o;if(m<.9995){const y=Math.acos(m),A=Math.sin(y);p=Math.sin(p*y)/A,o=Math.sin(o*y)/A,c=c*p+u*o,l=l*p+f*o,h=h*p+g*o,d=d*p+_*o}else{c=c*p+u*o,l=l*p+f*o,h=h*p+g*o,d=d*p+_*o;const y=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=y,l*=y,h*=y,d*=y}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-o*f,e[t+2]=l*g+h*f+o*u-c*d,e[t+3]=h*g-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),d=o(r/2),u=c(n/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{static{D.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=s+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Xa.copy(this).projectOnVector(e),this.sub(Xa)}reflect(e){return this.sub(Xa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xa=new D,Fl=new Yn;class Ve{static{Ve.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],y=s[1],A=s[4],M=s[7],T=s[2],b=s[5],R=s[8];return r[0]=a*_+o*y+c*T,r[3]=a*m+o*A+c*b,r[6]=a*p+o*M+c*R,r[1]=l*_+h*y+d*T,r[4]=l*m+h*A+d*b,r[7]=l*p+h*M+d*R,r[2]=u*_+f*y+g*T,r[5]=u*m+f*A+g*b,r[8]=u*p+f*M+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,g=t*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*l-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=u*_,e[4]=(h*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(qa.makeScale(e,t)),this}rotate(e){return Ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(qa.makeRotation(-e)),this}translate(e,t){return Ss("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(qa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const qa=new Ve,Ol=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kl=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gf(){const i={enabled:!0,workingColorSpace:gn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===dt&&(s.r=oi(s.r),s.g=oi(s.g),s.b=oi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(s.r=bs(s.r),s.g=bs(s.g),s.b=bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===wi?Sa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ss("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ss("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[gn]:{primaries:e,whitePoint:n,transfer:Sa,toXYZ:Ol,fromXYZ:kl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wt},outputColorSpaceConfig:{drawingBufferColorSpace:wt}},[wt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:Ol,fromXYZ:kl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wt}}}),i}const it=Gf();function oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Qi;class Hf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qi===void 0&&(Qi=mr("canvas")),Qi.width=e.width,Qi.height=e.height;const s=Qi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Qi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=mr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=oi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(oi(t[n]/255)*255):t[n]=oi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vf=0;class $c{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=Cn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ya(s[a].image)):r.push(Ya(s[a]))}else r=Ya(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ya(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let Wf=0;const $a=new D;class Vt extends Ki{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,n=Hn,s=Hn,r=Ht,a=ii,o=bn,c=pn,l=Vt.DEFAULT_ANISOTROPY,h=wi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Cn(),this.name="",this.source=new $c(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ge(0,0),this.repeat=new Ge(1,1),this.center=new Ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize($a).x}get height(){return this.source.getSize($a).y}get depth(){return this.source.getSize($a).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==yd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ri:e.x=e.x-Math.floor(e.x);break;case Hn:e.x=e.x<0?0:1;break;case Ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ri:e.y=e.y-Math.floor(e.y);break;case Hn:e.y=e.y<0?0:1;break;case Ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=yd;Vt.DEFAULT_ANISOTROPY=1;class _t{static{_t.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(l+1)/2,M=(f+1)/2,T=(p+1)/2,b=(h+u)/4,R=(d+_)/4,x=(g+m)/4;return A>M&&A>T?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=b/n,r=R/n):M>T?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=b/s,r=x/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=R/r,s=x/r),this.set(n,s,r,t),this}let y=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(d-_)/y,this.z=(u-h)/y,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xf extends Ki{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ht,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Vt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ht,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new $c(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xn extends Xf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Id extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qf extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ye{static{Ye.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,c,l,h,d,u,f,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,d,u,f,g,_,m)}set(e,t,n,s,r,a,o,c,l,h,d,u,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ye().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/es.setFromMatrixColumn(e,0).length(),r=1/es.setFromMatrixColumn(e,1).length(),a=1/es.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,g=o*h,_=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-_*l,t[9]=-o*c,t[2]=_-u*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,g=l*h,_=l*d;t[0]=u+_*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=_+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,g=l*h,_=l*d;t[0]=u-_*o,t[4]=-a*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=_-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,g=o*h,_=o*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+_,t[1]=c*d,t[5]=_*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,g=o*c,_=o*l;t[0]=c*h,t[4]=_-u*d,t[8]=g*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-_*d}else if(e.order==="XZY"){const u=a*c,f=a*l,g=o*c,_=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+_,t[5]=a*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yf,e,$f)}lookAt(e,t,n){const s=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),gi.crossVectors(n,hn),gi.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),gi.crossVectors(n,hn)),gi.normalize(),Tr.crossVectors(hn,gi),s[0]=gi.x,s[4]=Tr.x,s[8]=hn.x,s[1]=gi.y,s[5]=Tr.y,s[9]=hn.y,s[2]=gi.z,s[6]=Tr.z,s[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],y=n[3],A=n[7],M=n[11],T=n[15],b=s[0],R=s[4],x=s[8],w=s[12],I=s[1],P=s[5],S=s[9],L=s[13],O=s[2],N=s[6],V=s[10],B=s[14],Z=s[3],ie=s[7],ce=s[11],ae=s[15];return r[0]=a*b+o*I+c*O+l*Z,r[4]=a*R+o*P+c*N+l*ie,r[8]=a*x+o*S+c*V+l*ce,r[12]=a*w+o*L+c*B+l*ae,r[1]=h*b+d*I+u*O+f*Z,r[5]=h*R+d*P+u*N+f*ie,r[9]=h*x+d*S+u*V+f*ce,r[13]=h*w+d*L+u*B+f*ae,r[2]=g*b+_*I+m*O+p*Z,r[6]=g*R+_*P+m*N+p*ie,r[10]=g*x+_*S+m*V+p*ce,r[14]=g*w+_*L+m*B+p*ae,r[3]=y*b+A*I+M*O+T*Z,r[7]=y*R+A*P+M*N+T*ie,r[11]=y*x+A*S+M*V+T*ce,r[15]=y*w+A*L+M*B+T*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15],y=c*f-l*u,A=o*f-l*d,M=o*u-c*d,T=a*f-l*h,b=a*u-c*h,R=a*d-o*h;return t*(_*y-m*A+p*M)-n*(g*y-m*T+p*b)+s*(g*A-_*T+p*R)-r*(g*M-_*b+m*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],y=t*o-n*a,A=t*c-s*a,M=t*l-r*a,T=n*c-s*o,b=n*l-r*o,R=s*l-r*c,x=h*_-d*g,w=h*m-u*g,I=h*p-f*g,P=d*m-u*_,S=d*p-f*_,L=u*p-f*m,O=y*L-A*S+M*P+T*I-b*w+R*x;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/O;return e[0]=(o*L-c*S+l*P)*N,e[1]=(s*S-n*L-r*P)*N,e[2]=(_*R-m*b+p*T)*N,e[3]=(u*b-d*R-f*T)*N,e[4]=(c*I-a*L-l*w)*N,e[5]=(t*L-s*I+r*w)*N,e[6]=(m*M-g*R-p*A)*N,e[7]=(h*R-u*M+f*A)*N,e[8]=(a*S-o*I+l*x)*N,e[9]=(n*I-t*S-r*x)*N,e[10]=(g*b-_*M+p*y)*N,e[11]=(d*M-h*b-f*y)*N,e[12]=(o*w-a*P-c*x)*N,e[13]=(t*P-n*w+s*x)*N,e[14]=(_*A-g*T-m*y)*N,e[15]=(h*T-d*A+u*y)*N,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,g=r*d,_=a*h,m=a*d,p=o*d,y=c*l,A=c*h,M=c*d,T=n.x,b=n.y,R=n.z;return s[0]=(1-(_+p))*T,s[1]=(f+M)*T,s[2]=(g-A)*T,s[3]=0,s[4]=(f-M)*b,s[5]=(1-(u+p))*b,s[6]=(m+y)*b,s[7]=0,s[8]=(g+A)*R,s[9]=(m-y)*R,s[10]=(1-(u+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=es.set(s[0],s[1],s[2]).length();const o=es.set(s[4],s[5],s[6]).length(),c=es.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Tn.copy(this);const l=1/a,h=1/o,d=1/c;return Tn.elements[0]*=l,Tn.elements[1]*=l,Tn.elements[2]*=l,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=d,Tn.elements[9]*=d,Tn.elements[10]*=d,t.setFromRotationMatrix(Tn),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,s,r,a,o=Vn,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s);let g,_;if(c)g=r/(a-r),_=a*r/(a-r);else if(o===Vn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===pr)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Vn,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s);let g,_;if(c)g=1/(a-r),_=a/(a-r);else if(o===Vn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===pr)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const es=new D,Tn=new Ye,Yf=new D(0,0,0),$f=new D(1,1,1),gi=new D,Tr=new D,hn=new D,Bl=new Ye,zl=new Yn;class Ci{constructor(e=0,t=0,n=0,s=Ci.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-st(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(st(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Bl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zl.setFromEuler(this),this.setFromQuaternion(zl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ci.DEFAULT_ORDER="XYZ";class Ld{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Kf=0;const Gl=new D,ts=new Yn,Zn=new Ye,Er=new D,ks=new D,Zf=new D,Jf=new Yn,Hl=new D(1,0,0),Vl=new D(0,1,0),Wl=new D(0,0,1),Xl={type:"added"},jf={type:"removed"},ns={type:"childadded",child:null},Ka={type:"childremoved",child:null};class lt extends Ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=Cn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=lt.DEFAULT_UP.clone();const e=new D,t=new Ci,n=new Yn,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ye},normalMatrix:{value:new Ve}}),this.matrix=new Ye,this.matrixWorld=new Ye,this.matrixAutoUpdate=lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ld,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ts.setFromAxisAngle(e,t),this.quaternion.multiply(ts),this}rotateOnWorldAxis(e,t){return ts.setFromAxisAngle(e,t),this.quaternion.premultiply(ts),this}rotateX(e){return this.rotateOnAxis(Hl,e)}rotateY(e){return this.rotateOnAxis(Vl,e)}rotateZ(e){return this.rotateOnAxis(Wl,e)}translateOnAxis(e,t){return Gl.copy(e).applyQuaternion(this.quaternion),this.position.add(Gl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hl,e)}translateY(e){return this.translateOnAxis(Vl,e)}translateZ(e){return this.translateOnAxis(Wl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Er.copy(e):Er.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zn.lookAt(ks,Er,this.up):Zn.lookAt(Er,ks,this.up),this.quaternion.setFromRotationMatrix(Zn),s&&(Zn.extractRotation(s.matrixWorld),ts.setFromRotationMatrix(Zn),this.quaternion.premultiply(ts.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xl),ns.child=e,this.dispatchEvent(ns),ns.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jf),Ka.child=e,this.dispatchEvent(Ka),Ka.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xl),ns.child=e,this.dispatchEvent(ns),ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,e,Zf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,Jf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}lt.DEFAULT_UP=new D(0,1,0);lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ot extends lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qf={type:"move"};class Za{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qf)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ot;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Dd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},Ar={h:0,s:0,l:0};function Ja(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ue{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=it.workingColorSpace){if(e=Yc(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ja(a,r,e+1/3),this.g=Ja(a,r,e),this.b=Ja(a,r,e-1/3)}return it.colorSpaceToWorking(this,s),this}setStyle(e,t=wt){function n(r){r!==void 0&&parseFloat(r)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wt){const n=Dd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=oi(e.r),this.g=oi(e.g),this.b=oi(e.b),this}copyLinearToSRGB(e){return this.r=bs(e.r),this.g=bs(e.g),this.b=bs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wt){return it.workingToColorSpace(Qt.copy(this),e),Math.round(st(Qt.r*255,0,255))*65536+Math.round(st(Qt.g*255,0,255))*256+Math.round(st(Qt.b*255,0,255))}getHexString(e=wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(Qt.copy(this),t);const n=Qt.r,s=Qt.g,r=Qt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=wt){it.workingToColorSpace(Qt.copy(this),e);const t=Qt.r,n=Qt.g,s=Qt.b;return e!==wt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(Ar);const n=or(_i.h,Ar.h,t),s=or(_i.s,Ar.s,t),r=or(_i.l,Ar.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qt=new Ue;Ue.NAMES=Dd;class wa{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ue(e),this.near=t,this.far=n}clone(){return new wa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ep extends lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ci,this.environmentIntensity=1,this.environmentRotation=new Ci,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const En=new D,Jn=new D,ja=new D,jn=new D,is=new D,ss=new D,ql=new D,Qa=new D,eo=new D,to=new D,no=new _t,io=new _t,so=new _t;class yn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),En.subVectors(e,t),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){En.subVectors(s,t),Jn.subVectors(n,t),ja.subVectors(e,t);const a=En.dot(En),o=En.dot(Jn),c=En.dot(ja),l=Jn.dot(Jn),h=Jn.dot(ja),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(a*h-o*c)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,jn.x),c.addScaledVector(a,jn.y),c.addScaledVector(o,jn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return no.setScalar(0),io.setScalar(0),so.setScalar(0),no.fromBufferAttribute(e,t),io.fromBufferAttribute(e,n),so.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(no,r.x),a.addScaledVector(io,r.y),a.addScaledVector(so,r.z),a}static isFrontFacing(e,t,n,s){return En.subVectors(n,t),Jn.subVectors(e,t),En.cross(Jn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),Jn.subVectors(this.a,this.b),En.cross(Jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return yn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;is.subVectors(s,n),ss.subVectors(r,n),Qa.subVectors(e,n);const c=is.dot(Qa),l=ss.dot(Qa);if(c<=0&&l<=0)return t.copy(n);eo.subVectors(e,s);const h=is.dot(eo),d=ss.dot(eo);if(h>=0&&d<=h)return t.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(is,a);to.subVectors(e,r);const f=is.dot(to),g=ss.dot(to);if(g>=0&&f<=g)return t.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(ss,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return ql.subVectors(r,s),o=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(ql,o);const p=1/(m+_+u);return a=_*p,o=u*p,t.copy(n).addScaledVector(is,a).addScaledVector(ss,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ui{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(An.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(An.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=An.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,An):An.fromBufferAttribute(r,a),An.applyMatrix4(e.matrixWorld),this.expandByPoint(An);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,An),An.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bs),Cr.subVectors(this.max,Bs),rs.subVectors(e.a,Bs),as.subVectors(e.b,Bs),os.subVectors(e.c,Bs),xi.subVectors(as,rs),Mi.subVectors(os,as),Ii.subVectors(rs,os);let t=[0,-xi.z,xi.y,0,-Mi.z,Mi.y,0,-Ii.z,Ii.y,xi.z,0,-xi.x,Mi.z,0,-Mi.x,Ii.z,0,-Ii.x,-xi.y,xi.x,0,-Mi.y,Mi.x,0,-Ii.y,Ii.x,0];return!ro(t,rs,as,os,Cr)||(t=[1,0,0,0,1,0,0,0,1],!ro(t,rs,as,os,Cr))?!1:(Pr.crossVectors(xi,Mi),t=[Pr.x,Pr.y,Pr.z],ro(t,rs,as,os,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,An).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(An).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Qn=[new D,new D,new D,new D,new D,new D,new D,new D],An=new D,Rr=new ui,rs=new D,as=new D,os=new D,xi=new D,Mi=new D,Ii=new D,Bs=new D,Cr=new D,Pr=new D,Li=new D;function ro(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Li.fromArray(i,r);const o=s.x*Math.abs(Li.x)+s.y*Math.abs(Li.y)+s.z*Math.abs(Li.z),c=e.dot(Li),l=t.dot(Li),h=n.dot(Li);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Ft=new D,Ir=new Ge;let tp=0;class cn extends Ki{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:tp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sc,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyMatrix3(e),this.setXY(t,Ir.x,Ir.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Rn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Rn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Rn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Rn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Nd extends cn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ud extends cn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class pt extends cn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const np=new ui,zs=new D,ao=new D;class $n{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):np.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;zs.subVectors(e,this.center);const t=zs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(zs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ao.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(zs.copy(e.center).add(ao)),this.expandByPoint(zs.copy(e.center).sub(ao))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ip=0;const xn=new Ye,oo=new lt,cs=new D,dn=new ui,Gs=new ui,Yt=new D;class qt extends Ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Cn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Mf(e)?Ud:Nd)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return xn.makeRotationFromQuaternion(e),this.applyMatrix4(xn),this}rotateX(e){return xn.makeRotationX(e),this.applyMatrix4(xn),this}rotateY(e){return xn.makeRotationY(e),this.applyMatrix4(xn),this}rotateZ(e){return xn.makeRotationZ(e),this.applyMatrix4(xn),this}translate(e,t,n){return xn.makeTranslation(e,t,n),this.applyMatrix4(xn),this}scale(e,t,n){return xn.makeScale(e,t,n),this.applyMatrix4(xn),this}lookAt(e){return oo.lookAt(e),oo.updateMatrix(),this.applyMatrix4(oo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new pt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(Yt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Yt),Yt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Yt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $n);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Yt.addVectors(dn.min,Gs.min),dn.expandByPoint(Yt),Yt.addVectors(dn.max,Gs.max),dn.expandByPoint(Yt)):(dn.expandByPoint(Gs.min),dn.expandByPoint(Gs.max))}dn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Yt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Yt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Yt.fromBufferAttribute(o,l),c&&(cs.fromBufferAttribute(e,l),Yt.add(cs)),s=Math.max(s,n.distanceToSquared(Yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new cn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let x=0;x<n.count;x++)o[x]=new D,c[x]=new D;const l=new D,h=new D,d=new D,u=new Ge,f=new Ge,g=new Ge,_=new D,m=new D;function p(x,w,I){l.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,I),u.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,I),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(P),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(P),o[x].add(_),o[w].add(_),o[I].add(_),c[x].add(m),c[w].add(m),c[I].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let x=0,w=y.length;x<w;++x){const I=y[x],P=I.start,S=I.count;for(let L=P,O=P+S;L<O;L+=3)p(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const A=new D,M=new D,T=new D,b=new D;function R(x){T.fromBufferAttribute(s,x),b.copy(T);const w=o[x];A.copy(w),A.sub(T.multiplyScalar(T.dot(w))).normalize(),M.crossVectors(b,w);const P=M.dot(c[x])<0?-1:1;a.setXYZW(x,A.x,A.y,A.z,P)}for(let x=0,w=y.length;x<w;++x){const I=y[x],P=I.start,S=I.count;for(let L=P,O=P+S;L<O;L+=3)R(e.getX(L+0)),R(e.getX(L+1)),R(e.getX(L+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new cn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new D,r=new D,a=new D,o=new D,c=new D,l=new D,h=new D,d=new D;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),_=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Yt.fromBufferAttribute(e,t),Yt.normalize(),e.setXYZ(t,Yt.x,Yt.y,Yt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new cn(u,h,d)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Sc,this.updateRanges=[],this.version=0,this.uuid=Cn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const en=new D;class gr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)en.fromBufferAttribute(this,t),en.applyMatrix4(e),this.setXYZ(t,en.x,en.y,en.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)en.fromBufferAttribute(this,t),en.applyNormalMatrix(e),this.setXYZ(t,en.x,en.y,en.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)en.fromBufferAttribute(this,t),en.transformDirection(e),this.setXYZ(t,en.x,en.y,en.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Rn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Rn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Rn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Rn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ba("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new cn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new gr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ba("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let sp=0;class Pn extends Ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=Cn(),this.name="",this.type="Material",this.blending=ys,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uo,this.blendDst=Fo,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ll,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ji,this.stencilZFail=ji,this.stencilZPass=ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(n.blending=this.blending),this.side!==ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Uo&&(n.blendSrc=this.blendSrc),this.blendDst!==Fo&&(n.blendDst=this.blendDst),this.blendEquation!==zi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ll&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ue().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ge().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ge().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class La extends Pn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ls;const Hs=new D,hs=new D,ds=new D,us=new Ge,Vs=new Ge,Od=new Ye,Lr=new D,Ws=new D,Dr=new D,Yl=new Ge,co=new Ge,$l=new Ge;class Kc extends lt{constructor(e=new La){if(super(),this.isSprite=!0,this.type="Sprite",ls===void 0){ls=new qt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Fd(t,5);ls.setIndex([0,1,2,0,2,3]),ls.setAttribute("position",new gr(n,3,0,!1)),ls.setAttribute("uv",new gr(n,2,3,!1))}this.geometry=ls,this.material=e,this.center=new Ge(.5,.5),this.count=1}raycast(e,t){e.camera===null&&ke('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),hs.setFromMatrixScale(this.matrixWorld),Od.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ds.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&hs.multiplyScalar(-ds.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Nr(Lr.set(-.5,-.5,0),ds,a,hs,s,r),Nr(Ws.set(.5,-.5,0),ds,a,hs,s,r),Nr(Dr.set(.5,.5,0),ds,a,hs,s,r),Yl.set(0,0),co.set(1,0),$l.set(1,1);let o=e.ray.intersectTriangle(Lr,Ws,Dr,!1,Hs);if(o===null&&(Nr(Ws.set(-.5,.5,0),ds,a,hs,s,r),co.set(0,1),o=e.ray.intersectTriangle(Lr,Dr,Ws,!1,Hs),o===null))return;const c=e.ray.origin.distanceTo(Hs);c<e.near||c>e.far||t.push({distance:c,point:Hs.clone(),uv:yn.getInterpolation(Hs,Lr,Ws,Dr,Yl,co,$l,new Ge),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Nr(i,e,t,n,s,r){us.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Vs.x=r*us.x-s*us.y,Vs.y=s*us.x+r*us.y):Vs.copy(us),i.copy(e),i.x+=Vs.x,i.y+=Vs.y,i.applyMatrix4(Od)}const ei=new D,lo=new D,Ur=new D,vi=new D,ho=new D,Fr=new D,uo=new D;class Da{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){lo.copy(e).add(t).multiplyScalar(.5),Ur.copy(t).sub(e).normalize(),vi.copy(this.origin).sub(lo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ur),o=vi.dot(this.direction),c=-vi.dot(Ur),l=vi.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*c-o,u=a*o-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(lo).addScaledVector(Ur,u),f}intersectSphere(e,t){ei.subVectors(e.center,this.origin);const n=ei.dot(this.direction),s=ei.dot(ei)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,s,r){ho.subVectors(t,e),Fr.subVectors(n,e),uo.crossVectors(ho,Fr);let a=this.direction.dot(uo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;vi.subVectors(this.origin,e);const c=o*this.direction.dot(Fr.crossVectors(vi,Fr));if(c<0)return null;const l=o*this.direction.dot(ho.cross(vi));if(l<0||c+l>a)return null;const h=-o*vi.dot(uo);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class si extends Pn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ci,this.combine=pd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Kl=new Ye,Di=new Da,Or=new $n,Zl=new D,kr=new D,Br=new D,zr=new D,fo=new D,Gr=new D,Jl=new D,Hr=new D;class Y extends lt{constructor(e=new qt,t=new si){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Gr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(fo.fromBufferAttribute(d,e),a?Gr.addScaledVector(fo,h):Gr.addScaledVector(fo.sub(t),h))}t.add(Gr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(r),Di.copy(e.ray).recast(e.near),!(Or.containsPoint(Di.origin)===!1&&(Di.intersectSphere(Or,Zl)===null||Di.origin.distanceToSquared(Zl)>(e.far-e.near)**2))&&(Kl.copy(r).invert(),Di.copy(e.ray).applyMatrix4(Kl),!(n.boundingBox!==null&&Di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Di)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),A=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=y,T=A;M<T;M+=3){const b=o.getX(M),R=o.getX(M+1),x=o.getX(M+2);s=Vr(this,p,e,n,l,h,d,b,R,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=o.getX(m),A=o.getX(m+1),M=o.getX(m+2);s=Vr(this,a,e,n,l,h,d,y,A,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),A=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let M=y,T=A;M<T;M+=3){const b=M,R=M+1,x=M+2;s=Vr(this,p,e,n,l,h,d,b,R,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=m,A=m+1,M=m+2;s=Vr(this,a,e,n,l,h,d,y,A,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function rp(i,e,t,n,s,r,a,o){let c;if(e.side===on?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===ci,o),c===null)return null;Hr.copy(o),Hr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Hr);return l<t.near||l>t.far?null:{distance:l,point:Hr.clone(),object:i}}function Vr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,kr),i.getVertexPosition(c,Br),i.getVertexPosition(l,zr);const h=rp(i,e,t,n,kr,Br,zr,Jl);if(h){const d=new D;yn.getBarycoord(Jl,kr,Br,zr,d),s&&(h.uv=yn.getInterpolatedAttribute(s,o,c,l,d,new Ge)),r&&(h.uv1=yn.getInterpolatedAttribute(r,o,c,l,d,new Ge)),a&&(h.normal=yn.getInterpolatedAttribute(a,o,c,l,d,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new D,materialIndex:0};yn.getNormal(kr,Br,zr,u.normal),h.face=u,h.barycoord=d}return h}const Xs=new _t,jl=new _t,Ql=new _t,ap=new _t,eh=new Ye,Wr=new D,po=new $n,th=new Ye,mo=new Da;class op extends Y{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Al,this.bindMatrix=new Ye,this.bindMatrixInverse=new Ye,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ui),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Wr),this.boundingBox.expandByPoint(Wr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new $n),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Wr),this.boundingSphere.expandByPoint(Wr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),po.copy(this.boundingSphere),po.applyMatrix4(s),e.ray.intersectsSphere(po)!==!1&&(th.copy(s).invert(),mo.copy(e.ray).applyMatrix4(th),!(this.boundingBox!==null&&mo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,mo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new _t,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Al?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===cf?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;jl.fromBufferAttribute(s.attributes.skinIndex,e),Ql.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Xs.copy(t),t.set(0,0,0,0)):(Xs.set(...t,1),t.set(0,0,0)),Xs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=Ql.getComponent(r);if(a!==0){const o=jl.getComponent(r);eh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(ap.copy(Xs).applyMatrix4(eh),a)}}return t.isVector4&&(t.w=Xs.w),t.applyMatrix4(this.bindMatrixInverse)}}class kd extends lt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Zc extends Vt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=Gt,h=Gt,d,u){super(null,a,o,c,l,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const nh=new Ye,cp=new Ye;class Jc{constructor(e=[],t=[]){this.uuid=Cn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ye)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ye;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:cp;nh.multiplyMatrices(o,t[r]),nh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Jc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Zc(t,e,e,bn,Sn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Ie("Skeleton: No bone found with UUID:",r),a=new kd),this.bones.push(a),this.boneInverses.push(new Ye().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=n[s];e.boneInverses.push(o.toArray())}return e}}class bc extends cn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const fs=new Ye,ih=new Ye,Xr=[],sh=new ui,lp=new Ye,qs=new Y,Ys=new $n;class et extends Y{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,lp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,fs),sh.copy(e.boundingBox).applyMatrix4(fs),this.boundingBox.union(sh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $n),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,fs),Ys.copy(e.boundingSphere).applyMatrix4(fs),this.boundingSphere.union(Ys)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(qs.geometry=this.geometry,qs.material=this.material,qs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ys.copy(this.boundingSphere),Ys.applyMatrix4(n),e.ray.intersectsSphere(Ys)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,fs),ih.multiplyMatrices(n,fs),qs.matrixWorld=ih,qs.raycast(e,Xr);for(let a=0,o=Xr.length;a<o;a++){const c=Xr[a];c.instanceId=r,c.object=this,t.push(c)}Xr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new bc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zc(new Float32Array(s*this.count),s,this.count,Gc,Sn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const go=new D,hp=new D,dp=new Ve;class Oi{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=go.subVectors(n,t).cross(hp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(go),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||dp.getNormalMatrix(e),s=this.coplanarPoint(go).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ni=new $n,up=new Ge(.5,.5),qr=new D;class jc{constructor(e=new Oi,t=new Oi,n=new Oi,s=new Oi,r=new Oi,a=new Oi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Vn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],y=r[12],A=r[13],M=r[14],T=r[15];if(s[0].setComponents(l-a,f-h,p-g,T-y).normalize(),s[1].setComponents(l+a,f+h,p+g,T+y).normalize(),s[2].setComponents(l+o,f+d,p+_,T+A).normalize(),s[3].setComponents(l-o,f-d,p-_,T-A).normalize(),n)s[4].setComponents(c,u,m,M).normalize(),s[5].setComponents(l-c,f-u,p-m,T-M).normalize();else if(s[4].setComponents(l-c,f-u,p-m,T-M).normalize(),t===Vn)s[5].setComponents(l+c,f+u,p+m,T+M).normalize();else if(t===pr)s[5].setComponents(c,u,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ni.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ni.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ni)}intersectsSprite(e){Ni.center.set(0,0,0);const t=up.distanceTo(e.center);return Ni.radius=.7071067811865476+t,Ni.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ni)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(qr.x=s.normal.x>0?e.max.x:e.min.x,qr.y=s.normal.y>0?e.max.y:e.min.y,qr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(qr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Bd extends Pn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ta=new D,Ea=new D,rh=new Ye,$s=new Da,Yr=new $n,_o=new D,ah=new D;class Qc extends lt{constructor(e=new qt,t=new Bd){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ta.fromBufferAttribute(t,s-1),Ea.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ta.distanceTo(Ea);e.setAttribute("lineDistance",new pt(n,1))}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(s),Yr.radius+=r,e.ray.intersectsSphere(Yr)===!1)return;rh.copy(s).invert(),$s.copy(e.ray).applyMatrix4(rh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=h.getX(_),y=h.getX(_+1),A=$r(this,e,$s,c,p,y,_);A&&t.push(A)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=$r(this,e,$s,c,_,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=$r(this,e,$s,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=$r(this,e,$s,c,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function $r(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Ta.fromBufferAttribute(o,s),Ea.fromBufferAttribute(o,r),t.distanceSqToSegment(Ta,Ea,_o,ah)>n)return;_o.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(_o);if(!(l<e.near||l>e.far))return{distance:l,point:ah.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const oh=new D,ch=new D;class fp extends Qc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)oh.fromBufferAttribute(t,s),ch.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+oh.distanceTo(ch);e.setAttribute("lineDistance",new pt(n,1))}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class pp extends Qc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class zd extends Pn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const lh=new Ye,wc=new Da,Kr=new $n,Zr=new D;class mp extends lt{constructor(e=new qt,t=new zd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Kr.copy(n.boundingSphere),Kr.applyMatrix4(s),Kr.radius+=r,e.ray.intersectsSphere(Kr)===!1)return;lh.copy(s).invert(),wc.copy(e.ray).applyMatrix4(lh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=u,_=f;g<_;g++){const m=l.getX(g);Zr.fromBufferAttribute(d,m),hh(Zr,m,c,s,e,t,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,_=f;g<_;g++)Zr.fromBufferAttribute(d,g),hh(Zr,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function hh(i,e,t,n,s,r,a){const o=wc.distanceSqToPoint(i);if(o<t){const c=new D;wc.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Gd extends Vt{constructor(e=[],t=Xi,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Na extends Vt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Cs extends Vt{constructor(e,t,n=qn,s,r,a,o=Gt,c=Gt,l,h=hi,d=1){if(h!==hi&&h!==Vi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $c(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class gp extends Cs{constructor(e,t=qn,n=Xi,s,r,a=Gt,o=Gt,c,l=hi){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Hd extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class z extends qt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new pt(l,3)),this.setAttribute("normal",new pt(h,3)),this.setAttribute("uv",new pt(d,2));function g(_,m,p,y,A,M,T,b,R,x,w){const I=M/R,P=T/x,S=M/2,L=T/2,O=b/2,N=R+1,V=x+1;let B=0,Z=0;const ie=new D;for(let ce=0;ce<V;ce++){const ae=ce*P-L;for(let pe=0;pe<N;pe++){const Ze=pe*I-S;ie[_]=Ze*y,ie[m]=ae*A,ie[p]=O,l.push(ie.x,ie.y,ie.z),ie[_]=0,ie[m]=0,ie[p]=b>0?1:-1,h.push(ie.x,ie.y,ie.z),d.push(pe/R),d.push(1-ce/x),B+=1}}for(let ce=0;ce<x;ce++)for(let ae=0;ae<R;ae++){const pe=u+ae+N*ce,Ze=u+ae+N*(ce+1),Je=u+(ae+1)+N*(ce+1),tt=u+(ae+1)+N*ce;c.push(pe,Ze,tt),c.push(Ze,Je,tt),Z+=6}o.addGroup(f,Z,w),f+=Z,u+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new z(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class vn extends qt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new D,h=new Ge;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new pt(a,3)),this.setAttribute("normal",new pt(o,3)),this.setAttribute("uv",new pt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ze extends qt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const _=[],m=n/2;let p=0;y(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new pt(d,3)),this.setAttribute("normal",new pt(u,3)),this.setAttribute("uv",new pt(f,2));function y(){const M=new D,T=new D;let b=0;const R=(t-e)/n;for(let x=0;x<=r;x++){const w=[],I=x/r,P=I*(t-e)+e;for(let S=0;S<=s;S++){const L=S/s,O=L*c+o,N=Math.sin(O),V=Math.cos(O);T.x=P*N,T.y=-I*n+m,T.z=P*V,d.push(T.x,T.y,T.z),M.set(N,R,V).normalize(),u.push(M.x,M.y,M.z),f.push(L,1-I),w.push(g++)}_.push(w)}for(let x=0;x<s;x++)for(let w=0;w<r;w++){const I=_[w][x],P=_[w+1][x],S=_[w+1][x+1],L=_[w][x+1];(e>0||w!==0)&&(h.push(I,P,L),b+=3),(t>0||w!==r-1)&&(h.push(P,S,L),b+=3)}l.addGroup(p,b,0),p+=b}function A(M){const T=g,b=new Ge,R=new D;let x=0;const w=M===!0?e:t,I=M===!0?1:-1;for(let S=1;S<=s;S++)d.push(0,m*I,0),u.push(0,I,0),f.push(.5,.5),g++;const P=g;for(let S=0;S<=s;S++){const O=S/s*c+o,N=Math.cos(O),V=Math.sin(O);R.x=w*V,R.y=m*I,R.z=w*N,d.push(R.x,R.y,R.z),u.push(0,I,0),b.x=N*.5+.5,b.y=V*.5*I+.5,f.push(b.x,b.y),g++}for(let S=0;S<s;S++){const L=T+S,O=P+S;M===!0?h.push(O,O+1,L):h.push(O+1,O,L),x+=3}l.addGroup(p,x,M===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ze(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class yr extends ze{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new yr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Yi extends qt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,d=e/o,u=t/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*u-a;for(let A=0;A<l;A++){const M=A*d-r;g.push(M,-y,0),_.push(0,0,1),m.push(A/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<o;y++){const A=y+l*p,M=y+l*(p+1),T=y+1+l*(p+1),b=y+1+l*p;f.push(A,M,b),f.push(M,T,b)}this.setIndex(f),this.setAttribute("position",new pt(g,3)),this.setAttribute("normal",new pt(_,3)),this.setAttribute("uv",new pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Aa extends qt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/s,f=new D,g=new Ge;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const y=p+m,A=y,M=y+n+1,T=y+n+2,b=y+1;o.push(A,M,b),o.push(M,T,b)}}this.setIndex(o),this.setAttribute("position",new pt(c,3)),this.setAttribute("normal",new pt(l,3)),this.setAttribute("uv",new pt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Aa(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Be extends qt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new D,u=new D,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const y=[],A=p/n,M=a+A*o,T=e*Math.cos(M),b=Math.sqrt(e*e-T*T);let R=0;p===0&&a===0?R=.5/t:p===n&&c===Math.PI&&(R=-.5/t);for(let x=0;x<=t;x++){const w=x/t,I=s+w*r;d.x=-b*Math.cos(I),d.y=T,d.z=b*Math.sin(I),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(w+R,1-A),y.push(l++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){const A=h[p][y+1],M=h[p][y],T=h[p+1][y],b=h[p+1][y+1];(p!==0||a>0)&&f.push(A,M,b),(p!==n-1||c<Math.PI)&&f.push(M,T,b)}this.setIndex(f),this.setAttribute("position",new pt(g,3)),this.setAttribute("normal",new pt(_,3)),this.setAttribute("uv",new pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Be(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Zt extends qt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const c=[],l=[],h=[],d=[],u=new D,f=new D,g=new D;for(let _=0;_<=n;_++){const m=a+_/n*o;for(let p=0;p<=s;p++){const y=p/s*r;f.x=(e+t*Math.cos(m))*Math.cos(y),f.y=(e+t*Math.cos(m))*Math.sin(y),f.z=t*Math.sin(m),l.push(f.x,f.y,f.z),u.x=e*Math.cos(y),u.y=e*Math.sin(y),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/s),d.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=s;m++){const p=(s+1)*_+m-1,y=(s+1)*(_-1)+m-1,A=(s+1)*(_-1)+m,M=(s+1)*_+m;c.push(p,y,M),c.push(y,A,M)}this.setIndex(c),this.setAttribute("position",new pt(l,3)),this.setAttribute("normal",new pt(h,3)),this.setAttribute("uv",new pt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Ps(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(dh(s))s.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(dh(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function tn(i){const e={};for(let t=0;t<i.length;t++){const n=Ps(i[t]);for(const s in n)e[s]=n[s]}return e}function dh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function _p(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Vd(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const xp={clone:Ps,merge:tn};var Mp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ln extends Pn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mp,this.fragmentShader=vp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ps(e.uniforms),this.uniformsGroups=_p(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ue().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ge().fromArray(s.value);break;case"v3":this.uniforms[n].value=new D().fromArray(s.value);break;case"v4":this.uniforms[n].value=new _t().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ve().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ye().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class yp extends Ln{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class zt extends Pn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yc,this.normalScale=new Ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ci,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Kn extends zt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ge(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return st(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Sp extends Pn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=df,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class bp extends Pn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Jr(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function wp(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function uh(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let c=0;c!==e;++c)s[a++]=i[o+c]}return s}function Tp(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}class Ds{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Ep extends Ds{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Cl,endingEnd:Cl}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Pl:r=e,o=2*t-n;break;case Il:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Pl:a=e,c=2*n-t;break;case Il:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),_=g*g,m=_*g,p=-u*m+2*u*_-u*g,y=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*g+1,A=(-1-f)*m+(1.5+f)*_+.5*g,M=f*m-f*_;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+y*a[l+T]+A*a[c+T]+M*a[d+T];return r}}class Ap extends Ds{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[l+u]*d+a[c+u]*h;return r}}class Rp extends Ds{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class Cp extends Ds{interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const g=(n-t)/(s-t),_=1-g;for(let m=0;m!==o;++m)r[m]=a[l+m]*_+a[c+m]*g;return r}const u=o*2,f=e-1;for(let g=0;g!==o;++g){const _=a[l+g],m=a[c+g],p=f*u+g*2,y=d[p],A=d[p+1],M=e*u+g*2,T=h[M],b=h[M+1];let R=(n-t)/(s-t),x,w,I,P,S;for(let L=0;L<8;L++){x=R*R,w=x*R,I=1-R,P=I*I,S=P*I;const N=S*t+3*P*R*y+3*I*x*T+w*s-n;if(Math.abs(N)<1e-10)break;const V=3*P*(y-t)+6*I*R*(T-y)+3*x*(s-T);if(Math.abs(V)<1e-10)break;R=R-N/V,R=Math.max(0,Math.min(1,R))}r[g]=S*_+3*P*R*A+3*I*x*b+w*m}return r}}class Dn{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Jr(t,this.TimeBufferType),this.values=Jr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Jr(e.times,Array),values:Jr(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Rp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ap(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ep(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Cp(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case fr:t=this.InterpolantFactoryMethodLinear;break;case Wa:t=this.InterpolantFactoryMethodSmooth;break;case Rl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return fr;case this.InterpolantFactoryMethodSmooth:return Wa;case this.InterpolantFactoryMethodBezier:return Rl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){ke("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){ke("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&vf(s))for(let o=0,c=s.length;o!==c;++o){const l=s[o];if(isNaN(l)){ke("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Wa,r=e.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{const d=o*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){const _=t[d+g];if(_!==t[u+g]||_!==t[f+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const d=o*n,u=a*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}Dn.prototype.ValueTypeName="";Dn.prototype.TimeBufferType=Float32Array;Dn.prototype.ValueBufferType=Float32Array;Dn.prototype.DefaultInterpolation=fr;class Ns extends Dn{constructor(e,t,n){super(e,t,n)}}Ns.prototype.ValueTypeName="bool";Ns.prototype.ValueBufferType=Array;Ns.prototype.DefaultInterpolation=ur;Ns.prototype.InterpolantFactoryMethodLinear=void 0;Ns.prototype.InterpolantFactoryMethodSmooth=void 0;class Wd extends Dn{constructor(e,t,n,s){super(e,t,n,s)}}Wd.prototype.ValueTypeName="color";class _r extends Dn{constructor(e,t,n,s){super(e,t,n,s)}}_r.prototype.ValueTypeName="number";class Pp extends Ds{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t);let l=e*o;for(let h=l+o;l!==h;l+=4)Yn.slerpFlat(r,0,a,l-o,a,l,c);return r}}class xr extends Dn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Pp(this.times,this.values,this.getValueSize(),e)}}xr.prototype.ValueTypeName="quaternion";xr.prototype.InterpolantFactoryMethodSmooth=void 0;class Us extends Dn{constructor(e,t,n){super(e,t,n)}}Us.prototype.ValueTypeName="string";Us.prototype.ValueBufferType=Array;Us.prototype.DefaultInterpolation=ur;Us.prototype.InterpolantFactoryMethodLinear=void 0;Us.prototype.InterpolantFactoryMethodSmooth=void 0;class Ra extends Dn{constructor(e,t,n,s){super(e,t,n,s)}}Ra.prototype.ValueTypeName="vector";class Ip{constructor(e="",t=-1,n=[],s=lf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Cn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Dp(n[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Dn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const h=wp(c);c=uh(c,1,h),l=uh(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new _r(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(r);if(h&&h.length>1){const d=h[1];let u=s[d];u||(s[d]=u=[]),u.push(l)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Lp(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return _r;case"vector":case"vector2":case"vector3":case"vector4":return Ra;case"color":return Wd;case"quaternion":return xr;case"bool":case"boolean":return Ns;case"string":return Us}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Dp(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Lp(i.type);if(i.times===void 0){const t=[],n=[];Tp(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const ri={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(fh(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!fh(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function fh(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Np{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Up=new Np;class Fs{constructor(e){this.manager=e!==void 0?e:Up,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Fs.DEFAULT_MATERIAL_NAME="__DEFAULT";const ti={};class Fp extends Error{constructor(e,t){super(e),this.response=t}}class Xd extends Fs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ri.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ti[e]!==void 0){ti[e].push({onLoad:t,onProgress:n,onError:s});return}ti[e]=[],ti[e].push({onLoad:t,onProgress:n,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=ti[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=u?parseInt(u):0,g=f!==0;let _=0;const m=new ReadableStream({start(p){y();function y(){d.read().then(({done:A,value:M})=>{if(A)p.close();else{_+=M.byteLength;const T=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let b=0,R=h.length;b<R;b++){const x=h[b];x.onProgress&&x.onProgress(T)}p.enqueue(M),y()}},A=>{p.error(A)})}}});return new Response(m)}else throw new Fp(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{ri.add(`file:${e}`,l);const h=ti[e];delete ti[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=ti[e];if(h===void 0)throw this.manager.itemError(e),l;delete ti[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ps=new WeakMap;class Op extends Fs{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ri.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=ps.get(a);d===void 0&&(d=[],ps.set(a,d)),d.push({onLoad:t,onError:s})}return a}const o=mr("img");function c(){h(),t&&t(this);const d=ps.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}ps.delete(this),r.manager.itemEnd(e)}function l(d){h(),s&&s(d),ri.remove(`image:${e}`);const u=ps.get(this)||[];for(let f=0;f<u.length;f++){const g=u[f];g.onError&&g.onError(d)}ps.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ri.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class el extends Fs{constructor(e){super(e)}load(e,t,n,s){const r=new Vt,a=new Op(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class Ua extends lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class kp extends Ua{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const xo=new Ye,ph=new D,mh=new D;class tl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ge(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new Ye,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jc,this._frameExtents=new Ge(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;ph.setFromMatrixPosition(e.matrixWorld),t.position.copy(ph),mh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mh),t.updateMatrixWorld(),xo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xo,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===pr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(xo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const jr=new D,Qr=new Yn,On=new D;class qd extends lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ye,this.projectionMatrix=new Ye,this.projectionMatrixInverse=new Ye,this.coordinateSystem=Vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(jr,Qr,On),On.x===1&&On.y===1&&On.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(jr,Qr,On.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(jr,Qr,On),On.x===1&&On.y===1&&On.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(jr,Qr,On.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const yi=new D,gh=new Ge,_h=new Ge;class sn extends qd{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(yi.x,yi.y).multiplyScalar(-e/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yi.x,yi.y).multiplyScalar(-e/yi.z)}getViewSize(e,t){return this.getViewBounds(e,gh,_h),t.subVectors(_h,gh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ar*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Bp extends tl{constructor(){super(new sn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Rs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class zp extends Ua{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Bp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Gp extends tl{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0}}class ua extends Ua{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Gp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Fa extends qd{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Hp extends tl{constructor(){super(new Fa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fa extends Ua{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(lt.DEFAULT_UP),this.updateMatrix(),this.target=new lt,this.shadow=new Hp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class cr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Mo=new WeakMap;class Vp extends Fs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ri.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{Mo.has(a)===!0?(s&&s(Mo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){ri.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e)}).catch(function(l){s&&s(l),Mo.set(c,l),ri.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ri.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ms=-90,gs=1;class Wp extends lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(ms,gs,e,t);s.layers=this.layers,this.add(s);const r=new sn(ms,gs,e,t);r.layers=this.layers,this.add(r);const a=new sn(ms,gs,e,t);a.layers=this.layers,this.add(a);const o=new sn(ms,gs,e,t);o.layers=this.layers,this.add(o);const c=new sn(ms,gs,e,t);c.layers=this.layers,this.add(c);const l=new sn(ms,gs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Xp extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const nl="\\[\\]\\.:\\/",qp=new RegExp("["+nl+"]","g"),il="[^"+nl+"]",Yp="[^"+nl.replace("\\.","")+"]",$p=/((?:WC+[\/:])*)/.source.replace("WC",il),Kp=/(WCOD+)?/.source.replace("WCOD",Yp),Zp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",il),Jp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",il),jp=new RegExp("^"+$p+Kp+Zp+Jp+"$"),Qp=["material","materials","bones","map"];class em{constructor(e,t,n){const s=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ft{constructor(e,t,n){this.path=t,this.parsedPath=n||ft.parseTrackName(t),this.node=ft.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ft.Composite(e,t,n):new ft(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(qp,"")}static parseTrackName(e){const t=jp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Qp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=ft.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[s];if(a===void 0){const l=t.nodeName;ke("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ft.Composite=em;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Yd{static{Yd.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}}function xh(i,e,t,n){const s=tm(n);switch(t){case Ad:return i*e;case Gc:return i*e/s.components*s.byteLength;case Hc:return i*e/s.components*s.byteLength;case qi:return i*e*2/s.components*s.byteLength;case Vc:return i*e*2/s.components*s.byteLength;case Rd:return i*e*3/s.components*s.byteLength;case bn:return i*e*4/s.components*s.byteLength;case Wc:return i*e*4/s.components*s.byteLength;case ca:case la:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ha:case da:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xo:case Yo:return Math.max(i,16)*Math.max(e,8)/4;case Wo:case qo:return Math.max(i,8)*Math.max(e,8)/2;case $o:case Ko:case Jo:case jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Zo:case va:case Qo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ec:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case tc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case nc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ic:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case sc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case rc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ac:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case oc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case cc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case lc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case hc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case dc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case uc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case fc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case pc:case mc:case gc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case _c:case xc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ya:case Mc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function tm(i){switch(i){case pn:case bd:return{byteLength:1,components:1};case hr:case wd:case li:return{byteLength:2,components:1};case Bc:case zc:return{byteLength:2,components:4};case qn:case kc:case Sn:return{byteLength:4,components:1};case Td:case Ed:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fc}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fc);function $d(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function nm(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const _=d[f];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var im=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sm=`#ifdef USE_ALPHAHASH
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
#endif`,rm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,am=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,om=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lm=`#ifdef USE_AOMAP
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
#endif`,hm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dm=`#ifdef USE_BATCHING
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
#endif`,um=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,gm=`#ifdef USE_IRIDESCENCE
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
#endif`,_m=`#ifdef USE_BUMPMAP
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
#endif`,xm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ym=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,bm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,wm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Tm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Em=`#define PI 3.141592653589793
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
} // validated`,Am=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Rm=`vec3 transformedNormal = objectNormal;
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
#endif`,Cm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Im=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Nm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Um=`#ifdef USE_ENVMAP
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
#endif`,Fm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Om=`#ifdef USE_ENVMAP
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
#endif`,km=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Bm=`#ifdef USE_ENVMAP
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
#endif`,zm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wm=`#ifdef USE_GRADIENTMAP
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
}`,Xm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ym=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$m=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Km=`#ifdef USE_ENVMAP
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
#endif`,Zm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,e0=`PhysicalMaterial material;
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
#endif`,t0=`uniform sampler2D dfgLUT;
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
}`,n0=`
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
#endif`,i0=`#if defined( RE_IndirectDiffuse )
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
#endif`,s0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,r0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,a0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,o0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,c0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,l0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,h0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,d0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,u0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,f0=`#if defined( USE_POINTS_UV )
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
#endif`,p0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,m0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,g0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,x0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,M0=`#ifdef USE_MORPHTARGETS
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
#endif`,v0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,y0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,S0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,b0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,E0=`#ifdef USE_NORMALMAP
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
#endif`,A0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,R0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,C0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,P0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,I0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,L0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,D0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,N0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,U0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,F0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,O0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,k0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,B0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,z0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,G0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,H0=`float getShadowMask() {
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
}`,V0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,W0=`#ifdef USE_SKINNING
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
#endif`,X0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,q0=`#ifdef USE_SKINNING
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
#endif`,Y0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,K0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Z0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,J0=`#ifdef USE_TRANSMISSION
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
#endif`,j0=`#ifdef USE_TRANSMISSION
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
#endif`,Q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ng=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ig=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sg=`uniform sampler2D t2D;
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
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ag=`#ifdef ENVMAP_TYPE_CUBE
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
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lg=`#include <common>
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
}`,hg=`#if DEPTH_PACKING == 3200
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
}`,dg=`#define DISTANCE
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
}`,ug=`#define DISTANCE
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
}`,fg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,pg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mg=`uniform float scale;
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
}`,gg=`uniform vec3 diffuse;
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
}`,_g=`#include <common>
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
}`,xg=`uniform vec3 diffuse;
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
}`,Mg=`#define LAMBERT
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
}`,vg=`#define LAMBERT
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
}`,yg=`#define MATCAP
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
}`,Sg=`#define MATCAP
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
}`,bg=`#define NORMAL
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
}`,wg=`#define NORMAL
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
}`,Tg=`#define PHONG
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
}`,Eg=`#define PHONG
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
}`,Ag=`#define STANDARD
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
}`,Rg=`#define STANDARD
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
}`,Cg=`#define TOON
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
}`,Pg=`#define TOON
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
}`,Ig=`uniform float size;
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
}`,Lg=`uniform vec3 diffuse;
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
}`,Dg=`#include <common>
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
}`,Ng=`uniform vec3 color;
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
}`,Ug=`uniform float rotation;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:im,alphahash_pars_fragment:sm,alphamap_fragment:rm,alphamap_pars_fragment:am,alphatest_fragment:om,alphatest_pars_fragment:cm,aomap_fragment:lm,aomap_pars_fragment:hm,batching_pars_vertex:dm,batching_vertex:um,begin_vertex:fm,beginnormal_vertex:pm,bsdfs:mm,iridescence_fragment:gm,bumpmap_pars_fragment:_m,clipping_planes_fragment:xm,clipping_planes_pars_fragment:Mm,clipping_planes_pars_vertex:vm,clipping_planes_vertex:ym,color_fragment:Sm,color_pars_fragment:bm,color_pars_vertex:wm,color_vertex:Tm,common:Em,cube_uv_reflection_fragment:Am,defaultnormal_vertex:Rm,displacementmap_pars_vertex:Cm,displacementmap_vertex:Pm,emissivemap_fragment:Im,emissivemap_pars_fragment:Lm,colorspace_fragment:Dm,colorspace_pars_fragment:Nm,envmap_fragment:Um,envmap_common_pars_fragment:Fm,envmap_pars_fragment:Om,envmap_pars_vertex:km,envmap_physical_pars_fragment:Km,envmap_vertex:Bm,fog_vertex:zm,fog_pars_vertex:Gm,fog_fragment:Hm,fog_pars_fragment:Vm,gradientmap_pars_fragment:Wm,lightmap_pars_fragment:Xm,lights_lambert_fragment:qm,lights_lambert_pars_fragment:Ym,lights_pars_begin:$m,lights_toon_fragment:Zm,lights_toon_pars_fragment:Jm,lights_phong_fragment:jm,lights_phong_pars_fragment:Qm,lights_physical_fragment:e0,lights_physical_pars_fragment:t0,lights_fragment_begin:n0,lights_fragment_maps:i0,lights_fragment_end:s0,lightprobes_pars_fragment:r0,logdepthbuf_fragment:a0,logdepthbuf_pars_fragment:o0,logdepthbuf_pars_vertex:c0,logdepthbuf_vertex:l0,map_fragment:h0,map_pars_fragment:d0,map_particle_fragment:u0,map_particle_pars_fragment:f0,metalnessmap_fragment:p0,metalnessmap_pars_fragment:m0,morphinstance_vertex:g0,morphcolor_vertex:_0,morphnormal_vertex:x0,morphtarget_pars_vertex:M0,morphtarget_vertex:v0,normal_fragment_begin:y0,normal_fragment_maps:S0,normal_pars_fragment:b0,normal_pars_vertex:w0,normal_vertex:T0,normalmap_pars_fragment:E0,clearcoat_normal_fragment_begin:A0,clearcoat_normal_fragment_maps:R0,clearcoat_pars_fragment:C0,iridescence_pars_fragment:P0,opaque_fragment:I0,packing:L0,premultiplied_alpha_fragment:D0,project_vertex:N0,dithering_fragment:U0,dithering_pars_fragment:F0,roughnessmap_fragment:O0,roughnessmap_pars_fragment:k0,shadowmap_pars_fragment:B0,shadowmap_pars_vertex:z0,shadowmap_vertex:G0,shadowmask_pars_fragment:H0,skinbase_vertex:V0,skinning_pars_vertex:W0,skinning_vertex:X0,skinnormal_vertex:q0,specularmap_fragment:Y0,specularmap_pars_fragment:$0,tonemapping_fragment:K0,tonemapping_pars_fragment:Z0,transmission_fragment:J0,transmission_pars_fragment:j0,uv_pars_fragment:Q0,uv_pars_vertex:eg,uv_vertex:tg,worldpos_vertex:ng,background_vert:ig,background_frag:sg,backgroundCube_vert:rg,backgroundCube_frag:ag,cube_vert:og,cube_frag:cg,depth_vert:lg,depth_frag:hg,distance_vert:dg,distance_frag:ug,equirect_vert:fg,equirect_frag:pg,linedashed_vert:mg,linedashed_frag:gg,meshbasic_vert:_g,meshbasic_frag:xg,meshlambert_vert:Mg,meshlambert_frag:vg,meshmatcap_vert:yg,meshmatcap_frag:Sg,meshnormal_vert:bg,meshnormal_frag:wg,meshphong_vert:Tg,meshphong_frag:Eg,meshphysical_vert:Ag,meshphysical_frag:Rg,meshtoon_vert:Cg,meshtoon_frag:Pg,points_vert:Ig,points_frag:Lg,shadow_vert:Dg,shadow_frag:Ng,sprite_vert:Ug,sprite_frag:Fg},ve={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new Ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new D},probesMax:{value:new D},probesResolution:{value:new D}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new Ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},Gn={basic:{uniforms:tn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:tn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ue(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:tn([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:tn([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:tn([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ue(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:tn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:tn([ve.points,ve.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:tn([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:tn([ve.common,ve.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:tn([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:tn([ve.sprite,ve.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:tn([ve.common,ve.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:tn([ve.lights,ve.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};Gn.physical={uniforms:tn([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new Ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new Ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new Ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const ea={r:0,b:0,g:0},Og=new Ye,Kd=new Ve;Kd.set(-1,0,0,0,1,0,0,0,1);function kg(i,e,t,n,s,r){const a=new Ue(0);let o=s===!0?0:1,c,l,h=null,d=0,u=null;function f(y){let A=y.isScene===!0?y.background:null;if(A&&A.isTexture){const M=y.backgroundBlurriness>0;A=e.get(A,M)}return A}function g(y){let A=!1;const M=f(y);M===null?m(a,o):M&&M.isColor&&(m(M,1),A=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(y,A){const M=f(A);M&&(M.isCubeTexture||M.mapping===Ia)?(l===void 0&&(l=new Y(new z(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:Ps(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Og.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Kd),l.material.toneMapped=it.getTransfer(M.colorSpace)!==dt,(h!==M||d!==M.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,u=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Y(new Yi(2,2),new Ln({name:"BackgroundMaterial",uniforms:Ps(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=it.getTransfer(M.colorSpace)!==dt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function m(y,A){y.getRGB(ea,Vd(i)),t.buffers.color.setClear(ea.r,ea.g,ea.b,A,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,A=1){a.set(y),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:g,addToRenderList:_,dispose:p}}function Bg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(P,S,L,O,N){let V=!1;const B=d(P,O,L,S);r!==B&&(r=B,l(r.object)),V=f(P,O,L,N),V&&g(P,O,L,N),N!==null&&e.update(N,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,M(P,S,L,O),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return i.createVertexArray()}function l(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function d(P,S,L,O){const N=O.wireframe===!0;let V=n[S.id];V===void 0&&(V={},n[S.id]=V);const B=P.isInstancedMesh===!0?P.id:0;let Z=V[B];Z===void 0&&(Z={},V[B]=Z);let ie=Z[L.id];ie===void 0&&(ie={},Z[L.id]=ie);let ce=ie[N];return ce===void 0&&(ce=u(c()),ie[N]=ce),ce}function u(P){const S=[],L=[],O=[];for(let N=0;N<t;N++)S[N]=0,L[N]=0,O[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:L,attributeDivisors:O,object:P,attributes:{},index:null}}function f(P,S,L,O){const N=r.attributes,V=S.attributes;let B=0;const Z=L.getAttributes();for(const ie in Z)if(Z[ie].location>=0){const ae=N[ie];let pe=V[ie];if(pe===void 0&&(ie==="instanceMatrix"&&P.instanceMatrix&&(pe=P.instanceMatrix),ie==="instanceColor"&&P.instanceColor&&(pe=P.instanceColor)),ae===void 0||ae.attribute!==pe||pe&&ae.data!==pe.data)return!0;B++}return r.attributesNum!==B||r.index!==O}function g(P,S,L,O){const N={},V=S.attributes;let B=0;const Z=L.getAttributes();for(const ie in Z)if(Z[ie].location>=0){let ae=V[ie];ae===void 0&&(ie==="instanceMatrix"&&P.instanceMatrix&&(ae=P.instanceMatrix),ie==="instanceColor"&&P.instanceColor&&(ae=P.instanceColor));const pe={};pe.attribute=ae,ae&&ae.data&&(pe.data=ae.data),N[ie]=pe,B++}r.attributes=N,r.attributesNum=B,r.index=O}function _(){const P=r.newAttributes;for(let S=0,L=P.length;S<L;S++)P[S]=0}function m(P){p(P,0)}function p(P,S){const L=r.newAttributes,O=r.enabledAttributes,N=r.attributeDivisors;L[P]=1,O[P]===0&&(i.enableVertexAttribArray(P),O[P]=1),N[P]!==S&&(i.vertexAttribDivisor(P,S),N[P]=S)}function y(){const P=r.newAttributes,S=r.enabledAttributes;for(let L=0,O=S.length;L<O;L++)S[L]!==P[L]&&(i.disableVertexAttribArray(L),S[L]=0)}function A(P,S,L,O,N,V,B){B===!0?i.vertexAttribIPointer(P,S,L,N,V):i.vertexAttribPointer(P,S,L,O,N,V)}function M(P,S,L,O){_();const N=O.attributes,V=L.getAttributes(),B=S.defaultAttributeValues;for(const Z in V){const ie=V[Z];if(ie.location>=0){let ce=N[Z];if(ce===void 0&&(Z==="instanceMatrix"&&P.instanceMatrix&&(ce=P.instanceMatrix),Z==="instanceColor"&&P.instanceColor&&(ce=P.instanceColor)),ce!==void 0){const ae=ce.normalized,pe=ce.itemSize,Ze=e.get(ce);if(Ze===void 0)continue;const Je=Ze.buffer,tt=Ze.type,ee=Ze.bytesPerElement,ue=tt===i.INT||tt===i.UNSIGNED_INT||ce.gpuType===kc;if(ce.isInterleavedBufferAttribute){const oe=ce.data,H=oe.stride,Q=ce.offset;if(oe.isInstancedInterleavedBuffer){for(let de=0;de<ie.locationSize;de++)p(ie.location+de,oe.meshPerAttribute);P.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let de=0;de<ie.locationSize;de++)m(ie.location+de);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let de=0;de<ie.locationSize;de++)A(ie.location+de,pe/ie.locationSize,tt,ae,H*ee,(Q+pe/ie.locationSize*de)*ee,ue)}else{if(ce.isInstancedBufferAttribute){for(let oe=0;oe<ie.locationSize;oe++)p(ie.location+oe,ce.meshPerAttribute);P.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let oe=0;oe<ie.locationSize;oe++)m(ie.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let oe=0;oe<ie.locationSize;oe++)A(ie.location+oe,pe/ie.locationSize,tt,ae,pe*ee,pe/ie.locationSize*oe*ee,ue)}}else if(B!==void 0){const ae=B[Z];if(ae!==void 0)switch(ae.length){case 2:i.vertexAttrib2fv(ie.location,ae);break;case 3:i.vertexAttrib3fv(ie.location,ae);break;case 4:i.vertexAttrib4fv(ie.location,ae);break;default:i.vertexAttrib1fv(ie.location,ae)}}}}y()}function T(){w();for(const P in n){const S=n[P];for(const L in S){const O=S[L];for(const N in O){const V=O[N];for(const B in V)h(V[B].object),delete V[B];delete O[N]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const S=n[P.id];for(const L in S){const O=S[L];for(const N in O){const V=O[N];for(const B in V)h(V[B].object),delete V[B];delete O[N]}}delete n[P.id]}function R(P){for(const S in n){const L=n[S];for(const O in L){const N=L[O];if(N[P.id]===void 0)continue;const V=N[P.id];for(const B in V)h(V[B].object),delete V[B];delete N[P.id]}}}function x(P){for(const S in n){const L=n[S],O=P.isInstancedMesh===!0?P.id:0,N=L[O];if(N!==void 0){for(const V in N){const B=N[V];for(const Z in B)h(B[Z].object),delete B[Z];delete N[V]}delete L[O],Object.keys(L).length===0&&delete n[S]}}}function w(){I(),a=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function zg(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Gg(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==bn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===li&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==pn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Sn&&!x)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ie("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:M,maxSamples:T,samples:b}}function Hg(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Oi,o=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const y=r?0:n,A=y*4;let M=p.clippingState||null;c.value=M,M=h(g,u,A,f);for(let T=0;T!==A;++T)M[T]=t[T];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,y=u.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let A=0,M=f;A!==_;++A,M+=4)a.copy(d[A]).applyMatrix4(y,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const Ti=4,Mh=[.125,.215,.35,.446,.526,.582],Gi=20,Vg=256,Ks=new Fa,vh=new Ue;let vo=null,yo=0,So=0,bo=!1;const Wg=new D;class yh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Wg}=r;vo=this._renderer.getRenderTarget(),yo=this._renderer.getActiveCubeFace(),So=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(vo,yo,So),this._renderer.xr.enabled=bo,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xi||e.mapping===As?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vo=this._renderer.getRenderTarget(),yo=this._renderer.getActiveCubeFace(),So=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ht,minFilter:Ht,generateMipmaps:!1,type:li,format:bn,colorSpace:gn,depthBuffer:!1},s=Sh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sh(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Xg(r)),this._blurMaterial=Yg(r,e,t),this._ggxMaterial=qg(r,e,t)}return s}_compileMaterial(e){const t=new Y(new qt,e);this._renderer.compile(t,Ks)}_sceneToCubeUV(e,t,n,s,r){const c=new sn(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(vh),d.toneMapping=Wn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Y(new z,new si({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let p=!1;const y=e.background;y?y.isColor&&(m.color.copy(y),e.background=null,p=!0):(m.color.copy(vh),p=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[A],r.y,r.z)):M===1?(c.up.set(0,0,l[A]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[A],r.z)):(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[A]));const T=this._cubeSize;_s(s,M*T,A>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(_,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=y}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Xi||e.mapping===As;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;_s(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Ks)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=0+l*1.25,f=d*u,{_lodMax:g}=this,_=this._sizeLods[n],m=3*_*(n>g-Ti?n-g+Ti:0),p=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,_s(r,m,p,3*_,2*_),s.setRenderTarget(r),s.render(o,Ks),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,_s(e,m,p,3*_,2*_),s.setRenderTarget(e),s.render(o,Ks)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ke("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[s];d.material=l;const u=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Gi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Gi;m>Gi&&Ie(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Gi}`);const p=[];let y=0;for(let R=0;R<Gi;++R){const x=R/_,w=Math.exp(-x*x/2);p.push(w),R===0?y+=w:R<m&&(y+=2*w)}for(let R=0;R<p.length;R++)p[R]=p[R]/y;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:A}=this;u.dTheta.value=g,u.mipInt.value=A-n;const M=this._sizeLods[s],T=3*M*(s>A-Ti?s-A+Ti:0),b=4*(this._cubeSize-M);_s(t,T,b,3*M,2*M),c.setRenderTarget(t),c.render(d,Ks)}}function Xg(i){const e=[],t=[],n=[];let s=i;const r=i-Ti+1+Mh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Ti?c=Mh[a-i+Ti-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),A=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let b=0;b<f;b++){const R=b%3*2/3-1,x=b>2?0:-1,w=[R,x,0,R+2/3,x,0,R+2/3,x+1,0,R,x,0,R+2/3,x+1,0,R,x+1,0];y.set(w,_*g*b),A.set(u,m*g*b);const I=[b,b,b,b,b,b];M.set(I,p*g*b)}const T=new qt;T.setAttribute("position",new cn(y,_)),T.setAttribute("uv",new cn(A,m)),T.setAttribute("faceIndex",new cn(M,p)),n.push(new Y(T,null)),s>Ti&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Sh(i,e,t){const n=new Xn(i,e,t);return n.texture.mapping=Ia,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function qg(i,e,t){return new Ln({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Vg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Oa(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Yg(i,e,t){const n=new Float32Array(Gi),s=new D(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:Gi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Oa(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function bh(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oa(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function wh(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Oa(){return`

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
	`}class Zd extends Xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Gd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new z(5,5,5),r=new Ln({name:"CubemapFromEquirect",uniforms:Ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:ai});r.uniforms.tEquirect.value=t;const a=new Y(s,r),o=t.minFilter;return t.minFilter===ii&&(t.minFilter=Ht),new Wp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function $g(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Ha||f===Va)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const _=new Zd(g.height);return _.fromEquirectangularTexture(i,u),e.set(u,_),u.addEventListener("dispose",l),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,g=f===Ha||f===Va,_=f===Xi||f===As;if(g||_){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new yh(i)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const y=u.image;return g&&y&&y.height>0||_&&y&&c(y)?(n===null&&(n=new yh(i)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Ha?u.mapping=Xi:f===Va&&(u.mapping=As),u}function c(u){let f=0;const g=6;for(let _=0;_<g;_++)u[_]!==void 0&&f++;return f===g}function l(u){const f=u.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Kg(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Ss("WebGLRenderer: "+n+" extension not supported."),s}}}function Zg(i,e,t,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],i.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(g===void 0)return;if(f!==null){const y=f.array;_=f.version;for(let A=0,M=y.length;A<M;A+=3){const T=y[A+0],b=y[A+1],R=y[A+2];u.push(T,b,b,R,R,T)}}else{const y=g.array;_=g.version;for(let A=0,M=y.length/3-1;A<M;A+=3){const T=A+0,b=A+1,R=A+2;u.push(T,b,b,R,R,T)}}const m=new(g.count>=65535?Ud:Nd)(u,1);m.version=_;const p=r.get(d);p&&e.remove(p),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function Jg(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function l(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let _=0;for(let m=0;m<f;m++)_+=u[m];t.update(_,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function jg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:ke("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Qg(i,e,t){const n=new WeakMap,s=new _t;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let I=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",I)};var f=I;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let T=o.attributes.position.count*M,b=1;T>e.maxTextureSize&&(b=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const R=new Float32Array(T*b*4*d),x=new Id(R,T,b,d);x.type=Sn,x.needsUpdate=!0;const w=M*4;for(let P=0;P<d;P++){const S=p[P],L=y[P],O=A[P],N=T*b*4*P;for(let V=0;V<S.count;V++){const B=V*w;g===!0&&(s.fromBufferAttribute(S,V),R[N+B+0]=s.x,R[N+B+1]=s.y,R[N+B+2]=s.z,R[N+B+3]=0),_===!0&&(s.fromBufferAttribute(L,V),R[N+B+4]=s.x,R[N+B+5]=s.y,R[N+B+6]=s.z,R[N+B+7]=0),m===!0&&(s.fromBufferAttribute(O,V),R[N+B+8]=s.x,R[N+B+9]=s.y,R[N+B+10]=s.z,R[N+B+11]=O.itemSize===4?s.w:1)}}u={count:d,texture:x,size:new Ge(T,b)},n.set(o,u),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function e_(i,e,t,n,s){let r=new WeakMap;function a(l){const h=s.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const t_={[md]:"LINEAR_TONE_MAPPING",[gd]:"REINHARD_TONE_MAPPING",[_d]:"CINEON_TONE_MAPPING",[Oc]:"ACES_FILMIC_TONE_MAPPING",[Md]:"AGX_TONE_MAPPING",[vd]:"NEUTRAL_TONE_MAPPING",[xd]:"CUSTOM_TONE_MAPPING"};function n_(i,e,t,n,s,r){const a=new Xn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Cs(e,t):void 0}),o=new Xn(e,t,{type:li,depthBuffer:!1,stencilBuffer:!1}),c=new qt;c.setAttribute("position",new pt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new pt([0,2,0,0,2,0],2));const l=new yp({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Y(c,l),d=new Fa(-1,1,1,-1,0,1);let u=null,f=null,g=!1,_,m=null,p=[],y=!1;this.setSize=function(A,M){a.setSize(A,M),o.setSize(A,M);for(let T=0;T<p.length;T++){const b=p[T];b.setSize&&b.setSize(A,M)}},this.setEffects=function(A){p=A,y=p.length>0&&p[0].isRenderPass===!0;const M=a.width,T=a.height;for(let b=0;b<p.length;b++){const R=p[b];R.setSize&&R.setSize(M,T)}},this.begin=function(A,M){if(g||A.toneMapping===Wn&&p.length===0)return!1;if(m=M,M!==null){const T=M.width,b=M.height;(a.width!==T||a.height!==b)&&this.setSize(T,b)}return y===!1&&A.setRenderTarget(a),_=A.toneMapping,A.toneMapping=Wn,!0},this.hasRenderPass=function(){return y},this.end=function(A,M){A.toneMapping=_,g=!0;let T=a,b=o;for(let R=0;R<p.length;R++){const x=p[R];if(x.enabled!==!1&&(x.render(A,b,T,M),x.needsSwap!==!1)){const w=T;T=b,b=w}}if(u!==A.outputColorSpace||f!==A.toneMapping){u=A.outputColorSpace,f=A.toneMapping,l.defines={},it.getTransfer(u)===dt&&(l.defines.SRGB_TRANSFER="");const R=t_[f];R&&(l.defines[R]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=T.texture,A.setRenderTarget(m),A.render(h,d),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const Jd=new Vt,Tc=new Cs(1,1),jd=new Id,Qd=new qf,eu=new Gd,Th=[],Eh=[],Ah=new Float32Array(16),Rh=new Float32Array(9),Ch=new Float32Array(4);function Os(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Th[s];if(r===void 0&&(r=new Float32Array(s),Th[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ka(i,e){let t=Eh[e];t===void 0&&(t=new Int32Array(e),Eh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function i_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function s_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2fv(this.addr,e),Xt(t,e)}}function r_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;i.uniform3fv(this.addr,e),Xt(t,e)}}function a_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4fv(this.addr,e),Xt(t,e)}}function o_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Ch.set(n),i.uniformMatrix2fv(this.addr,!1,Ch),Xt(t,n)}}function c_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Rh.set(n),i.uniformMatrix3fv(this.addr,!1,Rh),Xt(t,n)}}function l_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Ah.set(n),i.uniformMatrix4fv(this.addr,!1,Ah),Xt(t,n)}}function h_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function d_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2iv(this.addr,e),Xt(t,e)}}function u_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3iv(this.addr,e),Xt(t,e)}}function f_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4iv(this.addr,e),Xt(t,e)}}function p_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function m_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2uiv(this.addr,e),Xt(t,e)}}function g_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3uiv(this.addr,e),Xt(t,e)}}function __(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4uiv(this.addr,e),Xt(t,e)}}function x_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Tc.compareFunction=t.isReversedDepthBuffer()?qc:Xc,r=Tc):r=Jd,t.setTexture2D(e||r,s)}function M_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Qd,s)}function v_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||eu,s)}function y_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||jd,s)}function S_(i){switch(i){case 5126:return i_;case 35664:return s_;case 35665:return r_;case 35666:return a_;case 35674:return o_;case 35675:return c_;case 35676:return l_;case 5124:case 35670:return h_;case 35667:case 35671:return d_;case 35668:case 35672:return u_;case 35669:case 35673:return f_;case 5125:return p_;case 36294:return m_;case 36295:return g_;case 36296:return __;case 35678:case 36198:case 36298:case 36306:case 35682:return x_;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return v_;case 36289:case 36303:case 36311:case 36292:return y_}}function b_(i,e){i.uniform1fv(this.addr,e)}function w_(i,e){const t=Os(e,this.size,2);i.uniform2fv(this.addr,t)}function T_(i,e){const t=Os(e,this.size,3);i.uniform3fv(this.addr,t)}function E_(i,e){const t=Os(e,this.size,4);i.uniform4fv(this.addr,t)}function A_(i,e){const t=Os(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function R_(i,e){const t=Os(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function C_(i,e){const t=Os(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function P_(i,e){i.uniform1iv(this.addr,e)}function I_(i,e){i.uniform2iv(this.addr,e)}function L_(i,e){i.uniform3iv(this.addr,e)}function D_(i,e){i.uniform4iv(this.addr,e)}function N_(i,e){i.uniform1uiv(this.addr,e)}function U_(i,e){i.uniform2uiv(this.addr,e)}function F_(i,e){i.uniform3uiv(this.addr,e)}function O_(i,e){i.uniform4uiv(this.addr,e)}function k_(i,e,t){const n=this.cache,s=e.length,r=ka(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Tc:a=Jd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function B_(i,e,t){const n=this.cache,s=e.length,r=ka(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Qd,r[a])}function z_(i,e,t){const n=this.cache,s=e.length,r=ka(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||eu,r[a])}function G_(i,e,t){const n=this.cache,s=e.length,r=ka(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||jd,r[a])}function H_(i){switch(i){case 5126:return b_;case 35664:return w_;case 35665:return T_;case 35666:return E_;case 35674:return A_;case 35675:return R_;case 35676:return C_;case 5124:case 35670:return P_;case 35667:case 35671:return I_;case 35668:case 35672:return L_;case 35669:case 35673:return D_;case 5125:return N_;case 36294:return U_;case 36295:return F_;case 36296:return O_;case 35678:case 36198:case 36298:case 36306:case 35682:return k_;case 35679:case 36299:case 36307:return B_;case 35680:case 36300:case 36308:case 36293:return z_;case 36289:case 36303:case 36311:case 36292:return G_}}class V_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=S_(t.type)}}class W_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=H_(t.type)}}class X_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const wo=/(\w+)(\])?(\[|\.)?/g;function Ph(i,e){i.seq.push(e),i.map[e.id]=e}function q_(i,e,t){const n=i.name,s=n.length;for(wo.lastIndex=0;;){const r=wo.exec(n),a=wo.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Ph(t,l===void 0?new V_(o,i,e):new W_(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new X_(o),Ph(t,d)),t=d}}}class pa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);q_(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Ih(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Y_=37297;let $_=0;function K_(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Lh=new Ve;function Z_(i){it._getMatrix(Lh,it.workingColorSpace,i);const e=`mat3( ${Lh.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(i)){case Sa:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Dh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+K_(i.getShaderSource(e),o)}else return r}function J_(i,e){const t=Z_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const j_={[md]:"Linear",[gd]:"Reinhard",[_d]:"Cineon",[Oc]:"ACESFilmic",[Md]:"AgX",[vd]:"Neutral",[xd]:"Custom"};function Q_(i,e){const t=j_[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ta=new D;function ex(){it.getLuminanceCoefficients(ta);const i=ta.x.toFixed(4),e=ta.y.toFixed(4),t=ta.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function tx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function nx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ix(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function tr(i){return i!==""}function Nh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Uh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const sx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ec(i){return i.replace(sx,ax)}const rx=new Map;function ax(i,e){let t=$e[e];if(t===void 0){const n=rx.get(e);if(n!==void 0)t=$e[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ec(t)}const ox=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fh(i){return i.replace(ox,cx)}function cx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oh(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}const lx={[aa]:"SHADOWMAP_TYPE_PCF",[Qs]:"SHADOWMAP_TYPE_VSM"};function hx(i){return lx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const dx={[Xi]:"ENVMAP_TYPE_CUBE",[As]:"ENVMAP_TYPE_CUBE",[Ia]:"ENVMAP_TYPE_CUBE_UV"};function ux(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":dx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const fx={[As]:"ENVMAP_MODE_REFRACTION"};function px(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":fx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const mx={[pd]:"ENVMAP_BLENDING_MULTIPLY",[af]:"ENVMAP_BLENDING_MIX",[of]:"ENVMAP_BLENDING_ADD"};function gx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":mx[i.combine]||"ENVMAP_BLENDING_NONE"}function _x(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function xx(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=hx(t),l=ux(t),h=px(t),d=gx(t),u=_x(t),f=tx(t),g=nx(r),_=s.createProgram();let m,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(tr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(tr).join(`
`),p.length>0&&(p+=`
`)):(m=[Oh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),p=[Oh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wn?"#define TONE_MAPPING":"",t.toneMapping!==Wn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Wn?Q_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,J_("linearToOutputTexel",t.outputColorSpace),ex(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(tr).join(`
`)),a=Ec(a),a=Nh(a,t),a=Uh(a,t),o=Ec(o),o=Nh(o,t),o=Uh(o,t),a=Fh(a),o=Fh(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Dl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const A=y+m+a,M=y+p+o,T=Ih(s,s.VERTEX_SHADER,A),b=Ih(s,s.FRAGMENT_SHADER,M);s.attachShader(_,T),s.attachShader(_,b),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(P){if(i.debug.checkShaderErrors){const S=s.getProgramInfoLog(_)||"",L=s.getShaderInfoLog(T)||"",O=s.getShaderInfoLog(b)||"",N=S.trim(),V=L.trim(),B=O.trim();let Z=!0,ie=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,T,b);else{const ce=Dh(s,T,"vertex"),ae=Dh(s,b,"fragment");ke("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+N+`
`+ce+`
`+ae)}else N!==""?Ie("WebGLProgram: Program Info Log:",N):(V===""||B==="")&&(ie=!1);ie&&(P.diagnostics={runnable:Z,programLog:N,vertexShader:{log:V,prefix:m},fragmentShader:{log:B,prefix:p}})}s.deleteShader(T),s.deleteShader(b),x=new pa(s,_),w=ix(s,_)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(_,Y_)),I},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=b,this}let Mx=0;class vx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new yx(e),t.set(e,n)),n}}class yx{constructor(e){this.id=Mx++,this.code=e,this.usedTimes=0}}function Sx(i){return i===qi||i===va||i===ya}function bx(i,e,t,n,s,r){const a=new Ld,o=new vx,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function _(x,w,I,P,S,L){const O=P.fog,N=S.geometry,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?P.environment:null,B=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Z=e.get(x.envMap||V,B),ie=Z&&Z.mapping===Ia?Z.image.height:null,ce=f[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&Ie("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const ae=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,pe=ae!==void 0?ae.length:0;let Ze=0;N.morphAttributes.position!==void 0&&(Ze=1),N.morphAttributes.normal!==void 0&&(Ze=2),N.morphAttributes.color!==void 0&&(Ze=3);let Je,tt,ee,ue;if(ce){const Re=Gn[ce];Je=Re.vertexShader,tt=Re.fragmentShader}else{Je=x.vertexShader,tt=x.fragmentShader;const Re=o.getVertexShaderStage(x),Pt=o.getFragmentShaderStage(x);o.update(x,Re,Pt),ee=Re.id,ue=Pt.id}const oe=i.getRenderTarget(),H=i.state.buffers.depth.getReversed(),Q=S.isInstancedMesh===!0,de=S.isBatchedMesh===!0,Ae=!!x.map,Te=!!x.matcap,le=!!Z,He=!!x.aoMap,je=!!x.lightMap,Et=!!x.bumpMap&&x.wireframe===!1,Ct=!!x.normalMap,Ut=!!x.displacementMap,at=!!x.emissiveMap,Tt=!!x.metalnessMap,xt=!!x.roughnessMap,F=x.anisotropy>0,kt=x.clearcoat>0,ht=x.dispersion>0,C=x.iridescence>0,v=x.sheen>0,G=x.transmission>0,$=F&&!!x.anisotropyMap,J=kt&&!!x.clearcoatMap,he=kt&&!!x.clearcoatNormalMap,me=kt&&!!x.clearcoatRoughnessMap,j=C&&!!x.iridescenceMap,ne=C&&!!x.iridescenceThicknessMap,ge=v&&!!x.sheenColorMap,Le=v&&!!x.sheenRoughnessMap,Me=!!x.specularMap,_e=!!x.specularColorMap,Fe=!!x.specularIntensityMap,Oe=G&&!!x.transmissionMap,We=G&&!!x.thicknessMap,U=!!x.gradientMap,fe=!!x.alphaMap,te=x.alphaTest>0,xe=!!x.alphaHash,be=!!x.extensions;let se=Wn;x.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(se=i.toneMapping);const Pe={shaderID:ce,shaderType:x.type,shaderName:x.name,vertexShader:Je,fragmentShader:tt,defines:x.defines,customVertexShaderID:ee,customFragmentShaderID:ue,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:de,batchingColor:de&&S._colorsTexture!==null,instancing:Q,instancingColor:Q&&S.instanceColor!==null,instancingMorph:Q&&S.morphTexture!==null,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:it.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ae,matcap:Te,envMap:le,envMapMode:le&&Z.mapping,envMapCubeUVHeight:ie,aoMap:He,lightMap:je,bumpMap:Et,normalMap:Ct,displacementMap:Ut,emissiveMap:at,normalMapObjectSpace:Ct&&x.normalMapType===uf,normalMapTangentSpace:Ct&&x.normalMapType===yc,packedNormalMap:Ct&&x.normalMapType===yc&&Sx(x.normalMap.format),metalnessMap:Tt,roughnessMap:xt,anisotropy:F,anisotropyMap:$,clearcoat:kt,clearcoatMap:J,clearcoatNormalMap:he,clearcoatRoughnessMap:me,dispersion:ht,iridescence:C,iridescenceMap:j,iridescenceThicknessMap:ne,sheen:v,sheenColorMap:ge,sheenRoughnessMap:Le,specularMap:Me,specularColorMap:_e,specularIntensityMap:Fe,transmission:G,transmissionMap:Oe,thicknessMap:We,gradientMap:U,opaque:x.transparent===!1&&x.blending===ys&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:te,alphaHash:xe,combine:x.combine,mapUv:Ae&&g(x.map.channel),aoMapUv:He&&g(x.aoMap.channel),lightMapUv:je&&g(x.lightMap.channel),bumpMapUv:Et&&g(x.bumpMap.channel),normalMapUv:Ct&&g(x.normalMap.channel),displacementMapUv:Ut&&g(x.displacementMap.channel),emissiveMapUv:at&&g(x.emissiveMap.channel),metalnessMapUv:Tt&&g(x.metalnessMap.channel),roughnessMapUv:xt&&g(x.roughnessMap.channel),anisotropyMapUv:$&&g(x.anisotropyMap.channel),clearcoatMapUv:J&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:me&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Le&&g(x.sheenRoughnessMap.channel),specularMapUv:Me&&g(x.specularMap.channel),specularColorMapUv:_e&&g(x.specularColorMap.channel),specularIntensityMapUv:Fe&&g(x.specularIntensityMap.channel),transmissionMapUv:Oe&&g(x.transmissionMap.channel),thicknessMapUv:We&&g(x.thicknessMap.channel),alphaMapUv:fe&&g(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(Ct||F),vertexNormals:!!N.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:S.isPoints===!0&&!!N.attributes.uv&&(Ae||fe),fog:!!O,useFog:x.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||N.attributes.normal===void 0&&Ct===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:H,skinning:S.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:Ze,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:L.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:se,decodeVideoTexture:Ae&&x.map.isVideoTexture===!0&&it.getTransfer(x.map.colorSpace)===dt,decodeVideoTextureEmissive:at&&x.emissiveMap.isVideoTexture===!0&&it.getTransfer(x.emissiveMap.colorSpace)===dt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===fn,flipSided:x.side===on,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:be&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&x.extensions.multiDraw===!0||de)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function m(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)w.push(I),w.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(p(w,x),y(w,x),w.push(i.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function y(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function A(x){const w=f[x.type];let I;if(w){const P=Gn[w];I=xp.clone(P.uniforms)}else I=x.uniforms;return I}function M(x,w){let I=h.get(w);return I!==void 0?++I.usedTimes:(I=new xx(i,w,x,s),l.push(I),h.set(w,I)),I}function T(x){if(--x.usedTimes===0){const w=l.indexOf(x);l[w]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function R(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:A,acquireProgram:M,releaseProgram:T,releaseShaderCache:b,programs:l,dispose:R}}function wx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Tx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function kh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Bh(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,_,m,p){let y=i[e];return y===void 0?(y={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:p},i[e]=y):(y.id=u.id,y.object=u,y.geometry=f,y.material=g,y.materialVariant=a(u),y.groupOrder=_,y.renderOrder=u.renderOrder,y.z=m,y.group=p),e++,y}function c(u,f,g,_,m,p){const y=o(u,f,g,_,m,p);g.transmission>0?n.push(y):g.transparent===!0?s.push(y):t.push(y)}function l(u,f,g,_,m,p){const y=o(u,f,g,_,m,p);g.transmission>0?n.unshift(y):g.transparent===!0?s.unshift(y):t.unshift(y)}function h(u,f,g){t.length>1&&t.sort(u||Tx),n.length>1&&n.sort(f||kh),s.length>1&&s.sort(f||kh),g&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let u=e,f=i.length;u<f;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:d,sort:h}}function Ex(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Bh,i.set(n,[a])):s>=r.length?(a=new Bh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ax(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ue};break;case"SpotLight":t={position:new D,direction:new D,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Rx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Cx=0;function Px(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Ix(i){const e=new Ax,t=Rx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new Ye,a=new Ye;function o(l){let h=0,d=0,u=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,y=0,A=0,M=0,T=0,b=0,R=0;l.sort(Px);for(let w=0,I=l.length;w<I;w++){const P=l[w],S=P.color,L=P.intensity,O=P.distance;let N=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===qi?N=P.shadow.map.texture:N=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=S.r*L,d+=S.g*L,u+=S.b*L;else if(P.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(P.sh.coefficients[V],L);R++}else if(P.isDirectionalLight){const V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const B=P.shadow,Z=t.get(P);Z.shadowIntensity=B.intensity,Z.shadowBias=B.bias,Z.shadowNormalBias=B.normalBias,Z.shadowRadius=B.radius,Z.shadowMapSize=B.mapSize,n.directionalShadow[f]=Z,n.directionalShadowMap[f]=N,n.directionalShadowMatrix[f]=P.shadow.matrix,y++}n.directional[f]=V,f++}else if(P.isSpotLight){const V=e.get(P);V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(S).multiplyScalar(L),V.distance=O,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,n.spot[_]=V;const B=P.shadow;if(P.map&&(n.spotLightMap[T]=P.map,T++,B.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[_]=B.matrix,P.castShadow){const Z=t.get(P);Z.shadowIntensity=B.intensity,Z.shadowBias=B.bias,Z.shadowNormalBias=B.normalBias,Z.shadowRadius=B.radius,Z.shadowMapSize=B.mapSize,n.spotShadow[_]=Z,n.spotShadowMap[_]=N,M++}_++}else if(P.isRectAreaLight){const V=e.get(P);V.color.copy(S).multiplyScalar(L),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=V,m++}else if(P.isPointLight){const V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),V.distance=P.distance,V.decay=P.decay,P.castShadow){const B=P.shadow,Z=t.get(P);Z.shadowIntensity=B.intensity,Z.shadowBias=B.bias,Z.shadowNormalBias=B.normalBias,Z.shadowRadius=B.radius,Z.shadowMapSize=B.mapSize,Z.shadowCameraNear=B.camera.near,Z.shadowCameraFar=B.camera.far,n.pointShadow[g]=Z,n.pointShadowMap[g]=N,n.pointShadowMatrix[g]=P.shadow.matrix,A++}n.point[g]=V,g++}else if(P.isHemisphereLight){const V=e.get(P);V.skyColor.copy(P.color).multiplyScalar(L),V.groundColor.copy(P.groundColor).multiplyScalar(L),n.hemi[p]=V,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const x=n.hash;(x.directionalLength!==f||x.pointLength!==g||x.spotLength!==_||x.rectAreaLength!==m||x.hemiLength!==p||x.numDirectionalShadows!==y||x.numPointShadows!==A||x.numSpotShadows!==M||x.numSpotMaps!==T||x.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=A,n.pointShadowMap.length=A,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=A,n.spotLightMatrix.length=M+T-b,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,x.directionalLength=f,x.pointLength=g,x.spotLength=_,x.rectAreaLength=m,x.hemiLength=p,x.numDirectionalShadows=y,x.numPointShadows=A,x.numSpotShadows=M,x.numSpotMaps=T,x.numLightProbes=R,n.version=Cx++)}function c(l,h){let d=0,u=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,y=l.length;p<y;p++){const A=l[p];if(A.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(A.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(A.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(A.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(A.width*.5,0,0),M.halfHeight.set(0,A.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(A.isPointLight){const M=n.point[u];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(m),u++}else if(A.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(A.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function zh(i){const e=new Ix(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function c(u){s.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Lx(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new zh(i),e.set(s,[o])):r>=a.length?(o=new zh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Dx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Nx=`uniform sampler2D shadow_pass;
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
}`,Ux=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],Fx=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Gh=new Ye,Zs=new D,To=new D;function Ox(i,e,t){let n=new jc;const s=new Ge,r=new Ge,a=new _t,o=new Sp,c=new bp,l={},h=t.maxTextureSize,d={[ci]:on,[on]:ci,[fn]:fn},u=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ge},radius:{value:4}},vertexShader:Dx,fragmentShader:Nx}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new qt;g.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Y(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=aa;let p=this.type;this.render=function(b,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===fd&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=aa);const w=i.getRenderTarget(),I=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),S=i.state;S.setBlending(ai),S.buffers.depth.getReversed()===!0?S.buffers.color.setClear(0,0,0,0):S.buffers.color.setClear(1,1,1,1),S.buffers.depth.setTest(!0),S.setScissorTest(!1);const L=p!==this.type;L&&R.traverse(function(O){O.material&&(Array.isArray(O.material)?O.material.forEach(N=>N.needsUpdate=!0):O.material.needsUpdate=!0)});for(let O=0,N=b.length;O<N;O++){const V=b[O],B=V.shadow;if(B===void 0){Ie("WebGLShadowMap:",V,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Z=B.getFrameExtents();s.multiply(Z),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Z.x),s.x=r.x*Z.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Z.y),s.y=r.y*Z.y,B.mapSize.y=r.y));const ie=i.state.buffers.depth.getReversed();if(B.camera._reversedDepth=ie,B.map===null||L===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Qs){if(V.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Xn(s.x,s.y,{format:qi,type:li,minFilter:Ht,magFilter:Ht,generateMipmaps:!1}),B.map.texture.name=V.name+".shadowMap",B.map.depthTexture=new Cs(s.x,s.y,Sn),B.map.depthTexture.name=V.name+".shadowMapDepth",B.map.depthTexture.format=hi,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Gt,B.map.depthTexture.magFilter=Gt}else V.isPointLight?(B.map=new Zd(s.x),B.map.depthTexture=new gp(s.x,qn)):(B.map=new Xn(s.x,s.y),B.map.depthTexture=new Cs(s.x,s.y,qn)),B.map.depthTexture.name=V.name+".shadowMap",B.map.depthTexture.format=hi,this.type===aa?(B.map.depthTexture.compareFunction=ie?qc:Xc,B.map.depthTexture.minFilter=Ht,B.map.depthTexture.magFilter=Ht):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Gt,B.map.depthTexture.magFilter=Gt);B.camera.updateProjectionMatrix()}const ce=B.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<ce;ae++){if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,ae),i.clear();else{ae===0&&(i.setRenderTarget(B.map),i.clear());const pe=B.getViewport(ae);a.set(r.x*pe.x,r.y*pe.y,r.x*pe.z,r.y*pe.w),S.viewport(a)}if(V.isPointLight){const pe=B.camera,Ze=B.matrix,Je=V.distance||pe.far;Je!==pe.far&&(pe.far=Je,pe.updateProjectionMatrix()),Zs.setFromMatrixPosition(V.matrixWorld),pe.position.copy(Zs),To.copy(pe.position),To.add(Ux[ae]),pe.up.copy(Fx[ae]),pe.lookAt(To),pe.updateMatrixWorld(),Ze.makeTranslation(-Zs.x,-Zs.y,-Zs.z),Gh.multiplyMatrices(pe.projectionMatrix,pe.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Gh,pe.coordinateSystem,pe.reversedDepth)}else B.updateMatrices(V);n=B.getFrustum(),M(R,x,B.camera,V,this.type)}B.isPointLightShadow!==!0&&this.type===Qs&&y(B,x),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(w,I,P)};function y(b,R){const x=e.update(_);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Xn(s.x,s.y,{format:qi,type:li})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,x,u,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,x,f,_,null)}function A(b,R,x,w){let I=null;const P=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)I=P;else if(I=x.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const S=I.uuid,L=R.uuid;let O=l[S];O===void 0&&(O={},l[S]=O);let N=O[L];N===void 0&&(N=I.clone(),O[L]=N,R.addEventListener("dispose",T)),I=N}if(I.visible=R.visible,I.wireframe=R.wireframe,w===Qs?I.side=R.shadowSide!==null?R.shadowSide:R.side:I.side=R.shadowSide!==null?R.shadowSide:d[R.side],I.alphaMap=R.alphaMap,I.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,I.map=R.map,I.clipShadows=R.clipShadows,I.clippingPlanes=R.clippingPlanes,I.clipIntersection=R.clipIntersection,I.displacementMap=R.displacementMap,I.displacementScale=R.displacementScale,I.displacementBias=R.displacementBias,I.wireframeLinewidth=R.wireframeLinewidth,I.linewidth=R.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const S=i.properties.get(I);S.light=x}return I}function M(b,R,x,w,I){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&I===Qs)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);const L=e.update(b),O=b.material;if(Array.isArray(O)){const N=L.groups;for(let V=0,B=N.length;V<B;V++){const Z=N[V],ie=O[Z.materialIndex];if(ie&&ie.visible){const ce=A(b,ie,w,I);b.onBeforeShadow(i,b,R,x,L,ce,Z),i.renderBufferDirect(x,null,L,ce,b,Z),b.onAfterShadow(i,b,R,x,L,ce,Z)}}}else if(O.visible){const N=A(b,O,w,I);b.onBeforeShadow(i,b,R,x,L,N,null),i.renderBufferDirect(x,null,L,N,b,null),b.onAfterShadow(i,b,R,x,L,N,null)}}const S=b.children;for(let L=0,O=S.length;L<O;L++)M(S[L],R,x,w,I)}function T(b){b.target.removeEventListener("dispose",T);for(const x in l){const w=l[x],I=b.target.uuid;I in w&&(w[I].dispose(),delete w[I])}}}function kx(i,e){function t(){let U=!1;const fe=new _t;let te=null;const xe=new _t(0,0,0,0);return{setMask:function(be){te!==be&&!U&&(i.colorMask(be,be,be,be),te=be)},setLocked:function(be){U=be},setClear:function(be,se,Pe,Re,Pt){Pt===!0&&(be*=Re,se*=Re,Pe*=Re),fe.set(be,se,Pe,Re),xe.equals(fe)===!1&&(i.clearColor(be,se,Pe,Re),xe.copy(fe))},reset:function(){U=!1,te=null,xe.set(-1,0,0,0)}}}function n(){let U=!1,fe=!1,te=null,xe=null,be=null;return{setReversed:function(se){if(fe!==se){const Pe=e.get("EXT_clip_control");se?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),fe=se;const Re=be;be=null,this.setClear(Re)}},getReversed:function(){return fe},setTest:function(se){se?oe(i.DEPTH_TEST):H(i.DEPTH_TEST)},setMask:function(se){te!==se&&!U&&(i.depthMask(se),te=se)},setFunc:function(se){if(fe&&(se=bf[se]),xe!==se){switch(se){case Oo:i.depthFunc(i.NEVER);break;case ko:i.depthFunc(i.ALWAYS);break;case Bo:i.depthFunc(i.LESS);break;case Es:i.depthFunc(i.LEQUAL);break;case zo:i.depthFunc(i.EQUAL);break;case Go:i.depthFunc(i.GEQUAL);break;case Ho:i.depthFunc(i.GREATER);break;case Vo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xe=se}},setLocked:function(se){U=se},setClear:function(se){be!==se&&(be=se,fe&&(se=1-se),i.clearDepth(se))},reset:function(){U=!1,te=null,xe=null,be=null,fe=!1}}}function s(){let U=!1,fe=null,te=null,xe=null,be=null,se=null,Pe=null,Re=null,Pt=null;return{setTest:function(yt){U||(yt?oe(i.STENCIL_TEST):H(i.STENCIL_TEST))},setMask:function(yt){fe!==yt&&!U&&(i.stencilMask(yt),fe=yt)},setFunc:function(yt,Nn,Un){(te!==yt||xe!==Nn||be!==Un)&&(i.stencilFunc(yt,Nn,Un),te=yt,xe=Nn,be=Un)},setOp:function(yt,Nn,Un){(se!==yt||Pe!==Nn||Re!==Un)&&(i.stencilOp(yt,Nn,Un),se=yt,Pe=Nn,Re=Un)},setLocked:function(yt){U=yt},setClear:function(yt){Pt!==yt&&(i.clearStencil(yt),Pt=yt)},reset:function(){U=!1,fe=null,te=null,xe=null,be=null,se=null,Pe=null,Re=null,Pt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],_=null,m=!1,p=null,y=null,A=null,M=null,T=null,b=null,R=null,x=new Ue(0,0,0),w=0,I=!1,P=null,S=null,L=null,O=null,N=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Z=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(ie)[1]),B=Z>=1):ie.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),B=Z>=2);let ce=null,ae={};const pe=i.getParameter(i.SCISSOR_BOX),Ze=i.getParameter(i.VIEWPORT),Je=new _t().fromArray(pe),tt=new _t().fromArray(Ze);function ee(U,fe,te,xe){const be=new Uint8Array(4),se=i.createTexture();i.bindTexture(U,se),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<te;Pe++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,xe,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(fe+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return se}const ue={};ue[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),ue[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ue[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(i.DEPTH_TEST),a.setFunc(Es),Et(!1),Ct(bl),oe(i.CULL_FACE),He(ai);function oe(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function H(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Q(U,fe){return u[U]!==fe?(i.bindFramebuffer(U,fe),u[U]=fe,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function de(U,fe){let te=g,xe=!1;if(U){te=f.get(fe),te===void 0&&(te=[],f.set(fe,te));const be=U.textures;if(te.length!==be.length||te[0]!==i.COLOR_ATTACHMENT0){for(let se=0,Pe=be.length;se<Pe;se++)te[se]=i.COLOR_ATTACHMENT0+se;te.length=be.length,xe=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,xe=!0);xe&&i.drawBuffers(te)}function Ae(U){return _!==U?(i.useProgram(U),_=U,!0):!1}const Te={[zi]:i.FUNC_ADD,[Hu]:i.FUNC_SUBTRACT,[Vu]:i.FUNC_REVERSE_SUBTRACT};Te[Wu]=i.MIN,Te[Xu]=i.MAX;const le={[qu]:i.ZERO,[Yu]:i.ONE,[$u]:i.SRC_COLOR,[Uo]:i.SRC_ALPHA,[ef]:i.SRC_ALPHA_SATURATE,[ju]:i.DST_COLOR,[Zu]:i.DST_ALPHA,[Ku]:i.ONE_MINUS_SRC_COLOR,[Fo]:i.ONE_MINUS_SRC_ALPHA,[Qu]:i.ONE_MINUS_DST_COLOR,[Ju]:i.ONE_MINUS_DST_ALPHA,[tf]:i.CONSTANT_COLOR,[nf]:i.ONE_MINUS_CONSTANT_COLOR,[sf]:i.CONSTANT_ALPHA,[rf]:i.ONE_MINUS_CONSTANT_ALPHA};function He(U,fe,te,xe,be,se,Pe,Re,Pt,yt){if(U===ai){m===!0&&(H(i.BLEND),m=!1);return}if(m===!1&&(oe(i.BLEND),m=!0),U!==Gu){if(U!==p||yt!==I){if((y!==zi||T!==zi)&&(i.blendEquation(i.FUNC_ADD),y=zi,T=zi),yt)switch(U){case ys:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case wl:i.blendFunc(i.ONE,i.ONE);break;case Tl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case El:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ke("WebGLState: Invalid blending: ",U);break}else switch(U){case ys:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case wl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Tl:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case El:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",U);break}A=null,M=null,b=null,R=null,x.set(0,0,0),w=0,p=U,I=yt}return}be=be||fe,se=se||te,Pe=Pe||xe,(fe!==y||be!==T)&&(i.blendEquationSeparate(Te[fe],Te[be]),y=fe,T=be),(te!==A||xe!==M||se!==b||Pe!==R)&&(i.blendFuncSeparate(le[te],le[xe],le[se],le[Pe]),A=te,M=xe,b=se,R=Pe),(Re.equals(x)===!1||Pt!==w)&&(i.blendColor(Re.r,Re.g,Re.b,Pt),x.copy(Re),w=Pt),p=U,I=!1}function je(U,fe){U.side===fn?H(i.CULL_FACE):oe(i.CULL_FACE);let te=U.side===on;fe&&(te=!te),Et(te),U.blending===ys&&U.transparent===!1?He(ai):He(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const xe=U.stencilWrite;o.setTest(xe),xe&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),at(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):H(i.SAMPLE_ALPHA_TO_COVERAGE)}function Et(U){P!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),P=U)}function Ct(U){U!==Bu?(oe(i.CULL_FACE),U!==S&&(U===bl?i.cullFace(i.BACK):U===zu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):H(i.CULL_FACE),S=U}function Ut(U){U!==L&&(B&&i.lineWidth(U),L=U)}function at(U,fe,te){U?(oe(i.POLYGON_OFFSET_FILL),(O!==fe||N!==te)&&(O=fe,N=te,a.getReversed()&&(fe=-fe),i.polygonOffset(fe,te))):H(i.POLYGON_OFFSET_FILL)}function Tt(U){U?oe(i.SCISSOR_TEST):H(i.SCISSOR_TEST)}function xt(U){U===void 0&&(U=i.TEXTURE0+V-1),ce!==U&&(i.activeTexture(U),ce=U)}function F(U,fe,te){te===void 0&&(ce===null?te=i.TEXTURE0+V-1:te=ce);let xe=ae[te];xe===void 0&&(xe={type:void 0,texture:void 0},ae[te]=xe),(xe.type!==U||xe.texture!==fe)&&(ce!==te&&(i.activeTexture(te),ce=te),i.bindTexture(U,fe||ue[U]),xe.type=U,xe.texture=fe)}function kt(){const U=ae[ce];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ht(){try{i.compressedTexImage2D(...arguments)}catch(U){ke("WebGLState:",U)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(U){ke("WebGLState:",U)}}function v(){try{i.texSubImage2D(...arguments)}catch(U){ke("WebGLState:",U)}}function G(){try{i.texSubImage3D(...arguments)}catch(U){ke("WebGLState:",U)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(U){ke("WebGLState:",U)}}function J(){try{i.compressedTexSubImage3D(...arguments)}catch(U){ke("WebGLState:",U)}}function he(){try{i.texStorage2D(...arguments)}catch(U){ke("WebGLState:",U)}}function me(){try{i.texStorage3D(...arguments)}catch(U){ke("WebGLState:",U)}}function j(){try{i.texImage2D(...arguments)}catch(U){ke("WebGLState:",U)}}function ne(){try{i.texImage3D(...arguments)}catch(U){ke("WebGLState:",U)}}function ge(U){return d[U]!==void 0?d[U]:i.getParameter(U)}function Le(U,fe){d[U]!==fe&&(i.pixelStorei(U,fe),d[U]=fe)}function Me(U){Je.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Je.copy(U))}function _e(U){tt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),tt.copy(U))}function Fe(U,fe){let te=l.get(fe);te===void 0&&(te=new WeakMap,l.set(fe,te));let xe=te.get(U);xe===void 0&&(xe=i.getUniformBlockIndex(fe,U.name),te.set(U,xe))}function Oe(U,fe){const xe=l.get(fe).get(U);c.get(fe)!==xe&&(i.uniformBlockBinding(fe,xe,U.__bindingPointIndex),c.set(fe,xe))}function We(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},ce=null,ae={},u={},f=new WeakMap,g=[],_=null,m=!1,p=null,y=null,A=null,M=null,T=null,b=null,R=null,x=new Ue(0,0,0),w=0,I=!1,P=null,S=null,L=null,O=null,N=null,Je.set(0,0,i.canvas.width,i.canvas.height),tt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:oe,disable:H,bindFramebuffer:Q,drawBuffers:de,useProgram:Ae,setBlending:He,setMaterial:je,setFlipSided:Et,setCullFace:Ct,setLineWidth:Ut,setPolygonOffset:at,setScissorTest:Tt,activeTexture:xt,bindTexture:F,unbindTexture:kt,compressedTexImage2D:ht,compressedTexImage3D:C,texImage2D:j,texImage3D:ne,pixelStorei:Le,getParameter:ge,updateUBOMapping:Fe,uniformBlockBinding:Oe,texStorage2D:he,texStorage3D:me,texSubImage2D:v,texSubImage3D:G,compressedTexSubImage2D:$,compressedTexSubImage3D:J,scissor:Me,viewport:_e,reset:We}}function Bx(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ge,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,v){return g?new OffscreenCanvas(C,v):mr("canvas")}function m(C,v,G){let $=1;const J=ht(C);if((J.width>G||J.height>G)&&($=G/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const he=Math.floor($*J.width),me=Math.floor($*J.height);u===void 0&&(u=_(he,me));const j=v?_(he,me):u;return j.width=he,j.height=me,j.getContext("2d").drawImage(C,0,0,he,me),Ie("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+he+"x"+me+")."),j}else return"data"in C&&Ie("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function p(C){return C.generateMipmaps}function y(C){i.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(C,v,G,$,J,he=!1){if(C!==null){if(i[C]!==void 0)return i[C];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let me;$&&(me=e.get("EXT_texture_norm16"),me||Ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=v;if(v===i.RED&&(G===i.FLOAT&&(j=i.R32F),G===i.HALF_FLOAT&&(j=i.R16F),G===i.UNSIGNED_BYTE&&(j=i.R8),G===i.UNSIGNED_SHORT&&me&&(j=me.R16_EXT),G===i.SHORT&&me&&(j=me.R16_SNORM_EXT)),v===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.R8UI),G===i.UNSIGNED_SHORT&&(j=i.R16UI),G===i.UNSIGNED_INT&&(j=i.R32UI),G===i.BYTE&&(j=i.R8I),G===i.SHORT&&(j=i.R16I),G===i.INT&&(j=i.R32I)),v===i.RG&&(G===i.FLOAT&&(j=i.RG32F),G===i.HALF_FLOAT&&(j=i.RG16F),G===i.UNSIGNED_BYTE&&(j=i.RG8),G===i.UNSIGNED_SHORT&&me&&(j=me.RG16_EXT),G===i.SHORT&&me&&(j=me.RG16_SNORM_EXT)),v===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.RG8UI),G===i.UNSIGNED_SHORT&&(j=i.RG16UI),G===i.UNSIGNED_INT&&(j=i.RG32UI),G===i.BYTE&&(j=i.RG8I),G===i.SHORT&&(j=i.RG16I),G===i.INT&&(j=i.RG32I)),v===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.RGB8UI),G===i.UNSIGNED_SHORT&&(j=i.RGB16UI),G===i.UNSIGNED_INT&&(j=i.RGB32UI),G===i.BYTE&&(j=i.RGB8I),G===i.SHORT&&(j=i.RGB16I),G===i.INT&&(j=i.RGB32I)),v===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),G===i.UNSIGNED_INT&&(j=i.RGBA32UI),G===i.BYTE&&(j=i.RGBA8I),G===i.SHORT&&(j=i.RGBA16I),G===i.INT&&(j=i.RGBA32I)),v===i.RGB&&(G===i.UNSIGNED_SHORT&&me&&(j=me.RGB16_EXT),G===i.SHORT&&me&&(j=me.RGB16_SNORM_EXT),G===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),v===i.RGBA){const ne=he?Sa:it.getTransfer(J);G===i.FLOAT&&(j=i.RGBA32F),G===i.HALF_FLOAT&&(j=i.RGBA16F),G===i.UNSIGNED_BYTE&&(j=ne===dt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT&&me&&(j=me.RGBA16_EXT),G===i.SHORT&&me&&(j=me.RGBA16_SNORM_EXT),G===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function T(C,v){let G;return C?v===null||v===qn||v===dr?G=i.DEPTH24_STENCIL8:v===Sn?G=i.DEPTH32F_STENCIL8:v===hr&&(G=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===qn||v===dr?G=i.DEPTH_COMPONENT24:v===Sn?G=i.DEPTH_COMPONENT32F:v===hr&&(G=i.DEPTH_COMPONENT16),G}function b(C,v){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Gt&&C.minFilter!==Ht?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function R(C){const v=C.target;v.removeEventListener("dispose",R),w(v),v.isVideoTexture&&h.delete(v),v.isHTMLTexture&&d.delete(v)}function x(C){const v=C.target;v.removeEventListener("dispose",x),P(v)}function w(C){const v=n.get(C);if(v.__webglInit===void 0)return;const G=C.source,$=f.get(G);if($){const J=$[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&I(C),Object.keys($).length===0&&f.delete(G)}n.remove(C)}function I(C){const v=n.get(C);i.deleteTexture(v.__webglTexture);const G=C.source,$=f.get(G);delete $[v.__cacheKey],a.memory.textures--}function P(C){const v=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let J=0;J<v.__webglFramebuffer[$].length;J++)i.deleteFramebuffer(v.__webglFramebuffer[$][J]);else i.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)i.deleteFramebuffer(v.__webglFramebuffer[$]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const G=C.textures;for(let $=0,J=G.length;$<J;$++){const he=n.get(G[$]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),a.memory.textures--),n.remove(G[$])}n.remove(C)}let S=0;function L(){S=0}function O(){return S}function N(C){S=C}function V(){const C=S;return C>=s.maxTextures&&Ie("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),S+=1,C}function B(C){const v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function Z(C,v){const G=n.get(C);if(C.isVideoTexture&&F(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&G.__version!==C.version){const $=C.image;if($===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{H(G,C,v);return}}else C.isExternalTexture&&(G.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+v)}function ie(C,v){const G=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){H(G,C,v);return}else C.isExternalTexture&&(G.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+v)}function ce(C,v){const G=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){H(G,C,v);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+v)}function ae(C,v){const G=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&G.__version!==C.version){Q(G,C,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+v)}const pe={[Ri]:i.REPEAT,[Hn]:i.CLAMP_TO_EDGE,[Ma]:i.MIRRORED_REPEAT},Ze={[Gt]:i.NEAREST,[Sd]:i.NEAREST_MIPMAP_NEAREST,[er]:i.NEAREST_MIPMAP_LINEAR,[Ht]:i.LINEAR,[oa]:i.LINEAR_MIPMAP_NEAREST,[ii]:i.LINEAR_MIPMAP_LINEAR},Je={[ff]:i.NEVER,[xf]:i.ALWAYS,[pf]:i.LESS,[Xc]:i.LEQUAL,[mf]:i.EQUAL,[qc]:i.GEQUAL,[gf]:i.GREATER,[_f]:i.NOTEQUAL};function tt(C,v){if(v.type===Sn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ht||v.magFilter===oa||v.magFilter===er||v.magFilter===ii||v.minFilter===Ht||v.minFilter===oa||v.minFilter===er||v.minFilter===ii)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,pe[v.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,pe[v.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,pe[v.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Ze[v.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Ze[v.minFilter]),v.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Je[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Gt||v.minFilter!==er&&v.minFilter!==ii||v.type===Sn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ee(C,v){let G=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",R));const $=v.source;let J=f.get($);J===void 0&&(J={},f.set($,J));const he=B(v);if(he!==C.__cacheKey){J[he]===void 0&&(J[he]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),J[he].usedTimes++;const me=J[C.__cacheKey];me!==void 0&&(J[C.__cacheKey].usedTimes--,me.usedTimes===0&&I(v)),C.__cacheKey=he,C.__webglTexture=J[he].texture}return G}function ue(C,v,G){return Math.floor(Math.floor(C/G)/v)}function oe(C,v,G,$){const he=C.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,G,$,v.data);else{he.sort((Le,Me)=>Le.start-Me.start);let me=0;for(let Le=1;Le<he.length;Le++){const Me=he[me],_e=he[Le],Fe=Me.start+Me.count,Oe=ue(_e.start,v.width,4),We=ue(Me.start,v.width,4);_e.start<=Fe+1&&Oe===We&&ue(_e.start+_e.count-1,v.width,4)===Oe?Me.count=Math.max(Me.count,_e.start+_e.count-Me.start):(++me,he[me]=_e)}he.length=me+1;const j=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),ge=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let Le=0,Me=he.length;Le<Me;Le++){const _e=he[Le],Fe=Math.floor(_e.start/4),Oe=Math.ceil(_e.count/4),We=Fe%v.width,U=Math.floor(Fe/v.width),fe=Oe,te=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,We),t.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,We,U,fe,te,G,$,v.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,j),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,ge)}}function H(C,v,G){let $=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=i.TEXTURE_3D);const J=ee(C,v),he=v.source;t.bindTexture($,C.__webglTexture,i.TEXTURE0+G);const me=n.get(he);if(he.version!==me.__version||J===!0){if(t.activeTexture(i.TEXTURE0+G),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const te=it.getPrimaries(it.workingColorSpace),xe=v.colorSpace===wi?null:it.getPrimaries(v.colorSpace),be=v.colorSpace===wi||te===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment);let ne=m(v.image,!1,s.maxTextureSize);ne=kt(v,ne);const ge=r.convert(v.format,v.colorSpace),Le=r.convert(v.type);let Me=M(v.internalFormat,ge,Le,v.normalized,v.colorSpace,v.isVideoTexture);tt($,v);let _e;const Fe=v.mipmaps,Oe=v.isVideoTexture!==!0,We=me.__version===void 0||J===!0,U=he.dataReady,fe=b(v,ne);if(v.isDepthTexture)Me=T(v.format===Vi,v.type),We&&(Oe?t.texStorage2D(i.TEXTURE_2D,1,Me,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Me,ne.width,ne.height,0,ge,Le,null));else if(v.isDataTexture)if(Fe.length>0){Oe&&We&&t.texStorage2D(i.TEXTURE_2D,fe,Me,Fe[0].width,Fe[0].height);for(let te=0,xe=Fe.length;te<xe;te++)_e=Fe[te],Oe?U&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,_e.width,_e.height,ge,Le,_e.data):t.texImage2D(i.TEXTURE_2D,te,Me,_e.width,_e.height,0,ge,Le,_e.data);v.generateMipmaps=!1}else Oe?(We&&t.texStorage2D(i.TEXTURE_2D,fe,Me,ne.width,ne.height),U&&oe(v,ne,ge,Le)):t.texImage2D(i.TEXTURE_2D,0,Me,ne.width,ne.height,0,ge,Le,ne.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Oe&&We&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Me,Fe[0].width,Fe[0].height,ne.depth);for(let te=0,xe=Fe.length;te<xe;te++)if(_e=Fe[te],v.format!==bn)if(ge!==null)if(Oe){if(U)if(v.layerUpdates.size>0){const be=xh(_e.width,_e.height,v.format,v.type);for(const se of v.layerUpdates){const Pe=_e.data.subarray(se*be/_e.data.BYTES_PER_ELEMENT,(se+1)*be/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,se,_e.width,_e.height,1,ge,Pe)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,_e.width,_e.height,ne.depth,ge,_e.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,Me,_e.width,_e.height,ne.depth,0,_e.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,_e.width,_e.height,ne.depth,ge,Le,_e.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,Me,_e.width,_e.height,ne.depth,0,ge,Le,_e.data)}else{Oe&&We&&t.texStorage2D(i.TEXTURE_2D,fe,Me,Fe[0].width,Fe[0].height);for(let te=0,xe=Fe.length;te<xe;te++)_e=Fe[te],v.format!==bn?ge!==null?Oe?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,_e.width,_e.height,ge,_e.data):t.compressedTexImage2D(i.TEXTURE_2D,te,Me,_e.width,_e.height,0,_e.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?U&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,_e.width,_e.height,ge,Le,_e.data):t.texImage2D(i.TEXTURE_2D,te,Me,_e.width,_e.height,0,ge,Le,_e.data)}else if(v.isDataArrayTexture)if(Oe){if(We&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Me,ne.width,ne.height,ne.depth),U)if(v.layerUpdates.size>0){const te=xh(ne.width,ne.height,v.format,v.type);for(const xe of v.layerUpdates){const be=ne.data.subarray(xe*te/ne.data.BYTES_PER_ELEMENT,(xe+1)*te/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,xe,ne.width,ne.height,1,ge,Le,be)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ge,Le,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Me,ne.width,ne.height,ne.depth,0,ge,Le,ne.data);else if(v.isData3DTexture)Oe?(We&&t.texStorage3D(i.TEXTURE_3D,fe,Me,ne.width,ne.height,ne.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ge,Le,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Me,ne.width,ne.height,ne.depth,0,ge,Le,ne.data);else if(v.isFramebufferTexture){if(We)if(Oe)t.texStorage2D(i.TEXTURE_2D,fe,Me,ne.width,ne.height);else{let te=ne.width,xe=ne.height;for(let be=0;be<fe;be++)t.texImage2D(i.TEXTURE_2D,be,Me,te,xe,0,ge,Le,null),te>>=1,xe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in i){const te=i.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ne.parentNode!==te){te.appendChild(ne),d.add(v),te.onpaint=xe=>{const be=xe.changedElements;for(const se of d)be.includes(se.image)&&(se.needsUpdate=!0)},te.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{const be=i.RGBA,se=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,se,Pe,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Fe.length>0){if(Oe&&We){const te=ht(Fe[0]);t.texStorage2D(i.TEXTURE_2D,fe,Me,te.width,te.height)}for(let te=0,xe=Fe.length;te<xe;te++)_e=Fe[te],Oe?U&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ge,Le,_e):t.texImage2D(i.TEXTURE_2D,te,Me,ge,Le,_e);v.generateMipmaps=!1}else if(Oe){if(We){const te=ht(ne);t.texStorage2D(i.TEXTURE_2D,fe,Me,te.width,te.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,Le,ne)}else t.texImage2D(i.TEXTURE_2D,0,Me,ge,Le,ne);p(v)&&y($),me.__version=he.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function Q(C,v,G){if(v.image.length!==6)return;const $=ee(C,v),J=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+G);const he=n.get(J);if(J.version!==he.__version||$===!0){t.activeTexture(i.TEXTURE0+G);const me=it.getPrimaries(it.workingColorSpace),j=v.colorSpace===wi?null:it.getPrimaries(v.colorSpace),ne=v.colorSpace===wi||me===j?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);const ge=v.isCompressedTexture||v.image[0].isCompressedTexture,Le=v.image[0]&&v.image[0].isDataTexture,Me=[];for(let se=0;se<6;se++)!ge&&!Le?Me[se]=m(v.image[se],!0,s.maxCubemapSize):Me[se]=Le?v.image[se].image:v.image[se],Me[se]=kt(v,Me[se]);const _e=Me[0],Fe=r.convert(v.format,v.colorSpace),Oe=r.convert(v.type),We=M(v.internalFormat,Fe,Oe,v.normalized,v.colorSpace),U=v.isVideoTexture!==!0,fe=he.__version===void 0||$===!0,te=J.dataReady;let xe=b(v,_e);tt(i.TEXTURE_CUBE_MAP,v);let be;if(ge){U&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,We,_e.width,_e.height);for(let se=0;se<6;se++){be=Me[se].mipmaps;for(let Pe=0;Pe<be.length;Pe++){const Re=be[Pe];v.format!==bn?Fe!==null?U?te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe,0,0,Re.width,Re.height,Fe,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe,We,Re.width,Re.height,0,Re.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe,0,0,Re.width,Re.height,Fe,Oe,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe,We,Re.width,Re.height,0,Fe,Oe,Re.data)}}}else{if(be=v.mipmaps,U&&fe){be.length>0&&xe++;const se=ht(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,We,se.width,se.height)}for(let se=0;se<6;se++)if(Le){U?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Me[se].width,Me[se].height,Fe,Oe,Me[se].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,We,Me[se].width,Me[se].height,0,Fe,Oe,Me[se].data);for(let Pe=0;Pe<be.length;Pe++){const Pt=be[Pe].image[se].image;U?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe+1,0,0,Pt.width,Pt.height,Fe,Oe,Pt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe+1,We,Pt.width,Pt.height,0,Fe,Oe,Pt.data)}}else{U?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Fe,Oe,Me[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,We,Fe,Oe,Me[se]);for(let Pe=0;Pe<be.length;Pe++){const Re=be[Pe];U?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe+1,0,0,Fe,Oe,Re.image[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Pe+1,We,Fe,Oe,Re.image[se])}}}p(v)&&y(i.TEXTURE_CUBE_MAP),he.__version=J.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function de(C,v,G,$,J,he){const me=r.convert(G.format,G.colorSpace),j=r.convert(G.type),ne=M(G.internalFormat,me,j,G.normalized,G.colorSpace),ge=n.get(v),Le=n.get(G);if(Le.__renderTarget=v,!ge.__hasExternalTextures){const Me=Math.max(1,v.width>>he),_e=Math.max(1,v.height>>he);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,he,ne,Me,_e,v.depth,0,me,j,null):t.texImage2D(J,he,ne,Me,_e,0,me,j,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),xt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,J,Le.__webglTexture,0,Tt(v)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,J,Le.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(C,v,G){if(i.bindRenderbuffer(i.RENDERBUFFER,C),v.depthBuffer){const $=v.depthTexture,J=$&&$.isDepthTexture?$.type:null,he=T(v.stencilBuffer,J),me=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;xt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt(v),he,v.width,v.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt(v),he,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,he,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,C)}else{const $=v.textures;for(let J=0;J<$.length;J++){const he=$[J],me=r.convert(he.format,he.colorSpace),j=r.convert(he.type),ne=M(he.internalFormat,me,j,he.normalized,he.colorSpace);xt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt(v),ne,v.width,v.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt(v),ne,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,ne,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(C,v,G){const $=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(v.depthTexture);if(J.__renderTarget=v,(!J.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),$){if(J.__webglInit===void 0&&(J.__webglInit=!0,v.depthTexture.addEventListener("dispose",R)),J.__webglTexture===void 0){J.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),tt(i.TEXTURE_CUBE_MAP,v.depthTexture);const ge=r.convert(v.depthTexture.format),Le=r.convert(v.depthTexture.type);let Me;v.depthTexture.format===hi?Me=i.DEPTH_COMPONENT24:v.depthTexture.format===Vi&&(Me=i.DEPTH24_STENCIL8);for(let _e=0;_e<6;_e++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Me,v.width,v.height,0,ge,Le,null)}}else Z(v.depthTexture,0);const he=J.__webglTexture,me=Tt(v),j=$?i.TEXTURE_CUBE_MAP_POSITIVE_X+G:i.TEXTURE_2D,ne=v.depthTexture.format===Vi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(v.depthTexture.format===hi)xt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,j,he,0,me):i.framebufferTexture2D(i.FRAMEBUFFER,ne,j,he,0);else if(v.depthTexture.format===Vi)xt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,j,he,0,me):i.framebufferTexture2D(i.FRAMEBUFFER,ne,j,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function le(C){const v=n.get(C),G=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){const $=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=$}if(C.depthTexture&&!v.__autoAllocateDepthBuffer)if(G)for(let $=0;$<6;$++)Te(v.__webglFramebuffer[$],C,$);else{const $=C.texture.mipmaps;$&&$.length>0?Te(v.__webglFramebuffer[0],C,0):Te(v.__webglFramebuffer,C,0)}else if(G){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=i.createRenderbuffer(),Ae(v.__webglDepthbuffer[$],C,!1);else{const J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=v.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,he)}}else{const $=C.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Ae(v.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(C,v,G){const $=n.get(C);v!==void 0&&de($.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&le(C)}function je(C){const v=C.texture,G=n.get(C),$=n.get(v);C.addEventListener("dispose",x);const J=C.textures,he=C.isWebGLCubeRenderTarget===!0,me=J.length>1;if(me||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=v.version,a.memory.textures++),he){G.__webglFramebuffer=[];for(let j=0;j<6;j++)if(v.mipmaps&&v.mipmaps.length>0){G.__webglFramebuffer[j]=[];for(let ne=0;ne<v.mipmaps.length;ne++)G.__webglFramebuffer[j][ne]=i.createFramebuffer()}else G.__webglFramebuffer[j]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){G.__webglFramebuffer=[];for(let j=0;j<v.mipmaps.length;j++)G.__webglFramebuffer[j]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(me)for(let j=0,ne=J.length;j<ne;j++){const ge=n.get(J[j]);ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&xt(C)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let j=0;j<J.length;j++){const ne=J[j];G.__webglColorRenderbuffer[j]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[j]);const ge=r.convert(ne.format,ne.colorSpace),Le=r.convert(ne.type),Me=M(ne.internalFormat,ge,Le,ne.normalized,ne.colorSpace,C.isXRRenderTarget===!0),_e=Tt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,_e,Me,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,G.__webglColorRenderbuffer[j])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Ae(G.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),tt(i.TEXTURE_CUBE_MAP,v);for(let j=0;j<6;j++)if(v.mipmaps&&v.mipmaps.length>0)for(let ne=0;ne<v.mipmaps.length;ne++)de(G.__webglFramebuffer[j][ne],C,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ne);else de(G.__webglFramebuffer[j],C,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);p(v)&&y(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let j=0,ne=J.length;j<ne;j++){const ge=J[j],Le=n.get(ge);let Me=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Me=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,Le.__webglTexture),tt(Me,ge),de(G.__webglFramebuffer,C,ge,i.COLOR_ATTACHMENT0+j,Me,0),p(ge)&&y(Me)}t.unbindTexture()}else{let j=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(j=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(j,$.__webglTexture),tt(j,v),v.mipmaps&&v.mipmaps.length>0)for(let ne=0;ne<v.mipmaps.length;ne++)de(G.__webglFramebuffer[ne],C,v,i.COLOR_ATTACHMENT0,j,ne);else de(G.__webglFramebuffer,C,v,i.COLOR_ATTACHMENT0,j,0);p(v)&&y(j),t.unbindTexture()}C.depthBuffer&&le(C)}function Et(C){const v=C.textures;for(let G=0,$=v.length;G<$;G++){const J=v[G];if(p(J)){const he=A(C),me=n.get(J).__webglTexture;t.bindTexture(he,me),y(he),t.unbindTexture()}}}const Ct=[],Ut=[];function at(C){if(C.samples>0){if(xt(C)===!1){const v=C.textures,G=C.width,$=C.height;let J=i.COLOR_BUFFER_BIT;const he=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=n.get(C),j=v.length>1;if(j)for(let ge=0;ge<v.length;ge++)t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);const ne=C.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let ge=0;ge<v.length;ge++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),j){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,me.__webglColorRenderbuffer[ge]);const Le=n.get(v[ge]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Le,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,J,i.NEAREST),c===!0&&(Ct.length=0,Ut.length=0,Ct.push(i.COLOR_ATTACHMENT0+ge),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ct.push(he),Ut.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ut)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ct))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),j)for(let ge=0;ge<v.length;ge++){t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,me.__webglColorRenderbuffer[ge]);const Le=n.get(v[ge]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,Le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const v=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function Tt(C){return Math.min(s.maxSamples,C.samples)}function xt(C){const v=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function F(C){const v=a.render.frame;h.get(C)!==v&&(h.set(C,v),C.update())}function kt(C,v){const G=C.colorSpace,$=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||G!==gn&&G!==wi&&(it.getTransfer(G)===dt?($!==bn||J!==pn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",G)),v}function ht(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=V,this.resetTextureUnits=L,this.getTextureUnits=O,this.setTextureUnits=N,this.setTexture2D=Z,this.setTexture2DArray=ie,this.setTexture3D=ce,this.setTextureCube=ae,this.rebindTextures=He,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Et,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=le,this.setupFrameBufferTexture=de,this.useMultisampledRTT=xt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function zx(i,e){function t(n,s=wi){let r;const a=it.getTransfer(s);if(n===pn)return i.UNSIGNED_BYTE;if(n===Bc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===zc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Td)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ed)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===bd)return i.BYTE;if(n===wd)return i.SHORT;if(n===hr)return i.UNSIGNED_SHORT;if(n===kc)return i.INT;if(n===qn)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===li)return i.HALF_FLOAT;if(n===Ad)return i.ALPHA;if(n===Rd)return i.RGB;if(n===bn)return i.RGBA;if(n===hi)return i.DEPTH_COMPONENT;if(n===Vi)return i.DEPTH_STENCIL;if(n===Gc)return i.RED;if(n===Hc)return i.RED_INTEGER;if(n===qi)return i.RG;if(n===Vc)return i.RG_INTEGER;if(n===Wc)return i.RGBA_INTEGER;if(n===ca||n===la||n===ha||n===da)if(a===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ca)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===la)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ha)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ca)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===la)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ha)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===da)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Wo||n===Xo||n===qo||n===Yo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Wo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===qo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Yo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$o||n===Ko||n===Zo||n===Jo||n===jo||n===va||n===Qo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===$o||n===Ko)return a===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Zo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Jo)return r.COMPRESSED_R11_EAC;if(n===jo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===va)return r.COMPRESSED_RG11_EAC;if(n===Qo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===cc||n===lc||n===hc||n===dc||n===uc||n===fc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ec)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===tc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===nc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ic)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===sc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===rc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ac)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===oc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===cc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===lc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===hc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===dc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===uc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===pc||n===mc||n===gc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===pc)return a===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===mc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===gc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_c||n===xc||n===ya||n===Mc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===_c)return r.COMPRESSED_RED_RGTC1_EXT;if(n===xc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ya)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Mc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Hx=`
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

}`;class Vx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Hd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ln({vertexShader:Gx,fragmentShader:Hx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Y(new Yi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Wx extends Ki{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Vx,p={},y=t.getContextAttributes();let A=null,M=null;const T=[],b=[],R=new Ge;let x=null;const w=new sn;w.viewport=new _t;const I=new sn;I.viewport=new _t;const P=[w,I],S=new Xp;let L=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ue=T[ee];return ue===void 0&&(ue=new Za,T[ee]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(ee){let ue=T[ee];return ue===void 0&&(ue=new Za,T[ee]=ue),ue.getGripSpace()},this.getHand=function(ee){let ue=T[ee];return ue===void 0&&(ue=new Za,T[ee]=ue),ue.getHandSpace()};function N(ee){const ue=b.indexOf(ee.inputSource);if(ue===-1)return;const oe=T[ue];oe!==void 0&&(oe.update(ee.inputSource,ee.frame,l||a),oe.dispatchEvent({type:ee.type,data:ee.inputSource}))}function V(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",B);for(let ee=0;ee<T.length;ee++){const ue=b[ee];ue!==null&&(b[ee]=null,T[ee].disconnect(ue))}L=null,O=null,m.reset();for(const ee in p)delete p[ee];e.setRenderTarget(A),f=null,u=null,d=null,s=null,M=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){r=ee,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){o=ee,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(ee){l=ee},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",V),s.addEventListener("inputsourceschange",B),y.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,H=null,Q=null;y.depth&&(Q=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=y.stencil?Vi:hi,H=y.stencil?dr:qn);const de={colorFormat:t.RGBA8,depthFormat:Q,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(de),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new Xn(u.textureWidth,u.textureHeight,{format:bn,type:pn,depthTexture:new Cs(u.textureWidth,u.textureHeight,H,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const oe={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Xn(f.framebufferWidth,f.framebufferHeight,{format:bn,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),tt.setContext(s),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(ee){for(let ue=0;ue<ee.removed.length;ue++){const oe=ee.removed[ue],H=b.indexOf(oe);H>=0&&(b[H]=null,T[H].disconnect(oe))}for(let ue=0;ue<ee.added.length;ue++){const oe=ee.added[ue];let H=b.indexOf(oe);if(H===-1){for(let de=0;de<T.length;de++)if(de>=b.length){b.push(oe),H=de;break}else if(b[de]===null){b[de]=oe,H=de;break}if(H===-1)break}const Q=T[H];Q&&Q.connect(oe)}}const Z=new D,ie=new D;function ce(ee,ue,oe){Z.setFromMatrixPosition(ue.matrixWorld),ie.setFromMatrixPosition(oe.matrixWorld);const H=Z.distanceTo(ie),Q=ue.projectionMatrix.elements,de=oe.projectionMatrix.elements,Ae=Q[14]/(Q[10]-1),Te=Q[14]/(Q[10]+1),le=(Q[9]+1)/Q[5],He=(Q[9]-1)/Q[5],je=(Q[8]-1)/Q[0],Et=(de[8]+1)/de[0],Ct=Ae*je,Ut=Ae*Et,at=H/(-je+Et),Tt=at*-je;if(ue.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Tt),ee.translateZ(at),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Q[10]===-1)ee.projectionMatrix.copy(ue.projectionMatrix),ee.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{const xt=Ae+at,F=Te+at,kt=Ct-Tt,ht=Ut+(H-Tt),C=le*Te/F*xt,v=He*Te/F*xt;ee.projectionMatrix.makePerspective(kt,ht,C,v,xt,F),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function ae(ee,ue){ue===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ue.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let ue=ee.near,oe=ee.far;m.texture!==null&&(m.depthNear>0&&(ue=m.depthNear),m.depthFar>0&&(oe=m.depthFar)),S.near=I.near=w.near=ue,S.far=I.far=w.far=oe,(L!==S.near||O!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),L=S.near,O=S.far),S.layers.mask=ee.layers.mask|6,w.layers.mask=S.layers.mask&-5,I.layers.mask=S.layers.mask&-3;const H=ee.parent,Q=S.cameras;ae(S,H);for(let de=0;de<Q.length;de++)ae(Q[de],H);Q.length===2?ce(S,w,I):S.projectionMatrix.copy(w.projectionMatrix),pe(ee,S,H)};function pe(ee,ue,oe){oe===null?ee.matrix.copy(ue.matrixWorld):(ee.matrix.copy(oe.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ue.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ue.projectionMatrix),ee.projectionMatrixInverse.copy(ue.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Rs*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(ee){c=ee,u!==null&&(u.fixedFoveation=ee),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ee)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(S)},this.getCameraTexture=function(ee){return p[ee]};let Ze=null;function Je(ee,ue){if(h=ue.getViewerPose(l||a),g=ue,h!==null){const oe=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let H=!1;oe.length!==S.cameras.length&&(S.cameras.length=0,H=!0);for(let Te=0;Te<oe.length;Te++){const le=oe[Te];let He=null;if(f!==null)He=f.getViewport(le);else{const Et=d.getViewSubImage(u,le);He=Et.viewport,Te===0&&(e.setRenderTargetTextures(M,Et.colorTexture,Et.depthStencilTexture),e.setRenderTarget(M))}let je=P[Te];je===void 0&&(je=new sn,je.layers.enable(Te),je.viewport=new _t,P[Te]=je),je.matrix.fromArray(le.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(le.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(He.x,He.y,He.width,He.height),Te===0&&(S.matrix.copy(je.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),H===!0&&S.cameras.push(je)}const Q=s.enabledFeatures;if(Q&&Q.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const Te=d.getDepthInformation(oe[0]);Te&&Te.isValid&&Te.texture&&m.init(Te,s.renderState)}if(Q&&Q.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let Te=0;Te<oe.length;Te++){const le=oe[Te].camera;if(le){let He=p[le];He||(He=new Hd,p[le]=He);const je=d.getCameraImage(le);He.sourceTexture=je}}}}for(let oe=0;oe<T.length;oe++){const H=b[oe],Q=T[oe];H!==null&&Q!==void 0&&Q.update(H,ue,l||a)}Ze&&Ze(ee,ue),ue.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ue}),g=null}const tt=new $d;tt.setAnimationLoop(Je),this.setAnimationLoop=function(ee){Ze=ee},this.dispose=function(){}}}const Xx=new Ye,tu=new Ve;tu.set(-1,0,0,0,1,0,0,0,1);function qx(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Vd(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,A,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,y,A):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===on&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===on&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=e.get(p),A=y.envMap,M=y.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(Xx.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(tu),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,y,A){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=A*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===on&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Yx(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,T){const b=T.program;n.uniformBlockBinding(M,b)}function l(M,T){let b=s[M.id];b===void 0&&(m(M),b=h(M),s[M.id]=b,M.addEventListener("dispose",y));const R=T.program;n.updateUBOMapping(M,R);const x=e.render.frame;r[M.id]!==x&&(u(M),r[M.id]=x)}function h(M){const T=d();M.__bindingPointIndex=T;const b=i.createBuffer(),R=M.__size,x=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,b),b}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const T=s[M.id],b=M.uniforms,R=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let x=0,w=b.length;x<w;x++){const I=b[x];if(Array.isArray(I))for(let P=0,S=I.length;P<S;P++)f(I[P],x,P,R);else f(I,x,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,T,b,R){if(_(M,T,b,R)===!0){const x=M.__offset,w=M.value;if(Array.isArray(w)){let I=0;for(let P=0;P<w.length;P++){const S=w[P],L=p(S);g(S,M.__data,I),typeof S!="number"&&typeof S!="boolean"&&!S.isMatrix3&&!ArrayBuffer.isView(S)&&(I+=L.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,M.__data)}}function g(M,T,b){typeof M=="number"||typeof M=="boolean"?T[0]=M:M.isMatrix3?(T[0]=M.elements[0],T[1]=M.elements[1],T[2]=M.elements[2],T[3]=0,T[4]=M.elements[3],T[5]=M.elements[4],T[6]=M.elements[5],T[7]=0,T[8]=M.elements[6],T[9]=M.elements[7],T[10]=M.elements[8],T[11]=0):ArrayBuffer.isView(M)?T.set(new M.constructor(M.buffer,M.byteOffset,T.length)):M.toArray(T,b)}function _(M,T,b,R){const x=M.value,w=T+"_"+b;if(R[w]===void 0)return typeof x=="number"||typeof x=="boolean"?R[w]=x:ArrayBuffer.isView(x)?R[w]=x.slice():R[w]=x.clone(),!0;{const I=R[w];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return R[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function m(M){const T=M.uniforms;let b=0;const R=16;for(let w=0,I=T.length;w<I;w++){const P=Array.isArray(T[w])?T[w]:[T[w]];for(let S=0,L=P.length;S<L;S++){const O=P[S],N=Array.isArray(O.value)?O.value:[O.value];for(let V=0,B=N.length;V<B;V++){const Z=N[V],ie=p(Z),ce=b%R,ae=ce%ie.boundary,pe=ce+ae;b+=ae,pe!==0&&R-pe<ie.storage&&(b+=R-pe),O.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=b,b+=ie.storage}}}const x=b%R;return x>0&&(b+=R-x),M.__size=b,M.__cache={},this}function p(M){const T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=48,T.storage=48):M.isMatrix4?(T.boundary=64,T.storage=64):M.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(T.boundary=16,T.storage=M.byteLength):Ie("WebGLRenderer: Unsupported uniform value type.",M),T}function y(M){const T=M.target;T.removeEventListener("dispose",y);const b=a.indexOf(T.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function A(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:A}}const $x=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let kn=null;function Kx(){return kn===null&&(kn=new Zc($x,16,16,qi,li),kn.name="DFG_LUT",kn.minFilter=Ht,kn.magFilter=Ht,kn.wrapS=Hn,kn.wrapT=Hn,kn.generateMipmaps=!1,kn.needsUpdate=!0),kn}class Zx{constructor(e={}){const{canvas:t=yf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=pn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const _=f,m=new Set([Wc,Vc,Hc]),p=new Set([pn,qn,hr,dr,Bc,zc]),y=new Uint32Array(4),A=new Int32Array(4),M=new D;let T=null,b=null;const R=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let P=!1,S=null,L=null,O=null,N=null;this._outputColorSpace=wt;let V=0,B=0,Z=null,ie=-1,ce=null;const ae=new _t,pe=new _t;let Ze=null;const Je=new Ue(0);let tt=0,ee=t.width,ue=t.height,oe=1,H=null,Q=null;const de=new _t(0,0,ee,ue),Ae=new _t(0,0,ee,ue);let Te=!1;const le=new jc;let He=!1,je=!1;const Et=new Ye,Ct=new D,Ut=new _t,at={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Tt=!1;function xt(){return Z===null?oe:1}let F=n;function kt(E,k){return t.getContext(E,k)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Fc}`),t.addEventListener("webglcontextlost",Pt,!1),t.addEventListener("webglcontextrestored",yt,!1),t.addEventListener("webglcontextcreationerror",Nn,!1),F===null){const k="webgl2";if(F=kt(k,E),F===null)throw kt(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(E){throw ke("WebGLRenderer: "+E.message),E}let ht,C,v,G,$,J,he,me,j,ne,ge,Le,Me,_e,Fe,Oe,We,U,fe,te,xe,be,se;function Pe(){ht=new Kg(F),ht.init(),xe=new zx(F,ht),C=new Gg(F,ht,e,xe),v=new kx(F,ht),C.reversedDepthBuffer&&u&&v.buffers.depth.setReversed(!0),L=F.createFramebuffer(),O=F.createFramebuffer(),N=F.createFramebuffer(),G=new jg(F),$=new wx,J=new Bx(F,ht,v,$,C,xe,G),he=new $g(I),me=new nm(F),be=new Bg(F,me),j=new Zg(F,me,G,be),ne=new e_(F,j,me,be,G),U=new Qg(F,C,J),Fe=new Hg($),ge=new bx(I,he,ht,C,be,Fe),Le=new qx(I,$),Me=new Ex,_e=new Lx(ht),We=new kg(I,he,v,ne,g,c),Oe=new Ox(I,ne,C),se=new Yx(F,G,C,v),fe=new zg(F,ht,G),te=new Jg(F,ht,G),G.programs=ge.programs,I.capabilities=C,I.extensions=ht,I.properties=$,I.renderLists=Me,I.shadowMap=Oe,I.state=v,I.info=G}Pe(),_!==pn&&(w=new n_(_,t.width,t.height,o,s,r));const Re=new Wx(I,F);this.xr=Re,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=ht.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ht.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(E){E!==void 0&&(oe=E,this.setSize(ee,ue,!1))},this.getSize=function(E){return E.set(ee,ue)},this.setSize=function(E,k,K=!0){if(Re.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}ee=E,ue=k,t.width=Math.floor(E*oe),t.height=Math.floor(k*oe),K===!0&&(t.style.width=E+"px",t.style.height=k+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(ee*oe,ue*oe).floor()},this.setDrawingBufferSize=function(E,k,K){ee=E,ue=k,oe=K,t.width=Math.floor(E*K),t.height=Math.floor(k*K),this.setViewport(0,0,E,k)},this.setEffects=function(E){if(_===pn){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let k=0;k<E.length;k++)if(E[k].isOutputPass===!0){Ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(ae)},this.getViewport=function(E){return E.copy(de)},this.setViewport=function(E,k,K,X){E.isVector4?de.set(E.x,E.y,E.z,E.w):de.set(E,k,K,X),v.viewport(ae.copy(de).multiplyScalar(oe).round())},this.getScissor=function(E){return E.copy(Ae)},this.setScissor=function(E,k,K,X){E.isVector4?Ae.set(E.x,E.y,E.z,E.w):Ae.set(E,k,K,X),v.scissor(pe.copy(Ae).multiplyScalar(oe).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(E){v.setScissorTest(Te=E)},this.setOpaqueSort=function(E){H=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor(...arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha(...arguments)},this.clear=function(E=!0,k=!0,K=!0){let X=0;if(E){let q=!1;if(Z!==null){const Se=Z.texture.format;q=m.has(Se)}if(q){const Se=Z.texture.type,Ee=p.has(Se),ye=We.getClearColor(),Ce=We.getClearAlpha(),De=ye.r,Xe=ye.g,Qe=ye.b;Ee?(y[0]=De,y[1]=Xe,y[2]=Qe,y[3]=Ce,F.clearBufferuiv(F.COLOR,0,y)):(A[0]=De,A[1]=Xe,A[2]=Qe,A[3]=Ce,F.clearBufferiv(F.COLOR,0,A))}else X|=F.COLOR_BUFFER_BIT}k&&(X|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(X|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&F.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),S=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Pt,!1),t.removeEventListener("webglcontextrestored",yt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),We.dispose(),Me.dispose(),_e.dispose(),$.dispose(),he.dispose(),ne.dispose(),be.dispose(),se.dispose(),ge.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",fl),Re.removeEventListener("sessionend",pl),Pi.stop()};function Pt(E){E.preventDefault(),ba("WebGLRenderer: Context Lost."),P=!0}function yt(){ba("WebGLRenderer: Context Restored."),P=!1;const E=G.autoReset,k=Oe.enabled,K=Oe.autoUpdate,X=Oe.needsUpdate,q=Oe.type;Pe(),G.autoReset=E,Oe.enabled=k,Oe.autoUpdate=K,Oe.needsUpdate=X,Oe.type=q}function Nn(E){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Un(E){const k=E.target;k.removeEventListener("dispose",Un),Pu(k)}function Pu(E){Iu(E),$.remove(E)}function Iu(E){const k=$.get(E).programs;k!==void 0&&(k.forEach(function(K){ge.releaseProgram(K)}),E.isShaderMaterial&&ge.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,K,X,q,Se){k===null&&(k=at);const Ee=q.isMesh&&q.matrixWorld.determinantAffine()<0,ye=Nu(E,k,K,X,q);v.setMaterial(X,Ee);let Ce=K.index,De=1;if(X.wireframe===!0){if(Ce=j.getWireframeAttribute(K),Ce===void 0)return;De=2}const Xe=K.drawRange,Qe=K.attributes.position;let Ne=Xe.start*De,mt=(Xe.start+Xe.count)*De;Se!==null&&(Ne=Math.max(Ne,Se.start*De),mt=Math.min(mt,(Se.start+Se.count)*De)),Ce!==null?(Ne=Math.max(Ne,0),mt=Math.min(mt,Ce.count)):Qe!=null&&(Ne=Math.max(Ne,0),mt=Math.min(mt,Qe.count));const Lt=mt-Ne;if(Lt<0||Lt===1/0)return;be.setup(q,X,ye,K,Ce);let It,Mt=fe;if(Ce!==null&&(It=me.get(Ce),Mt=te,Mt.setIndex(It)),q.isMesh)X.wireframe===!0?(v.setLineWidth(X.wireframeLinewidth*xt()),Mt.setMode(F.LINES)):Mt.setMode(F.TRIANGLES);else if(q.isLine){let Jt=X.linewidth;Jt===void 0&&(Jt=1),v.setLineWidth(Jt*xt()),q.isLineSegments?Mt.setMode(F.LINES):q.isLineLoop?Mt.setMode(F.LINE_LOOP):Mt.setMode(F.LINE_STRIP)}else q.isPoints?Mt.setMode(F.POINTS):q.isSprite&&Mt.setMode(F.TRIANGLES);if(q.isBatchedMesh)if(ht.get("WEBGL_multi_draw"))Mt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Jt=q._multiDrawStarts,we=q._multiDrawCounts,ln=q._multiDrawCount,ot=Ce?me.get(Ce).bytesPerElement:1,_n=$.get(X).currentProgram.getUniforms();for(let Fn=0;Fn<ln;Fn++)_n.setValue(F,"_gl_DrawID",Fn),Mt.render(Jt[Fn]/ot,we[Fn])}else if(q.isInstancedMesh)Mt.renderInstances(Ne,Lt,q.count);else if(K.isInstancedBufferGeometry){const Jt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,we=Math.min(K.instanceCount,Jt);Mt.renderInstances(Ne,Lt,we)}else Mt.render(Ne,Lt)};function ul(E,k,K){E.transparent===!0&&E.side===fn&&E.forceSinglePass===!1?(E.side=on,E.needsUpdate=!0,wr(E,k,K),E.side=ci,E.needsUpdate=!0,wr(E,k,K),E.side=fn):wr(E,k,K)}this.compile=function(E,k,K=null){K===null&&(K=E),b=_e.get(K),b.init(k),x.push(b),K.traverseVisible(function(q){q.isLight&&q.layers.test(k.layers)&&(b.pushLight(q),q.castShadow&&b.pushShadow(q))}),E!==K&&E.traverseVisible(function(q){q.isLight&&q.layers.test(k.layers)&&(b.pushLight(q),q.castShadow&&b.pushShadow(q))}),b.setupLights();const X=new Set;return E.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Se=q.material;if(Se)if(Array.isArray(Se))for(let Ee=0;Ee<Se.length;Ee++){const ye=Se[Ee];ul(ye,K,q),X.add(ye)}else ul(Se,K,q),X.add(Se)}),b=x.pop(),X},this.compileAsync=function(E,k,K=null){const X=this.compile(E,k,K);return new Promise(q=>{function Se(){if(X.forEach(function(Ee){$.get(Ee).currentProgram.isReady()&&X.delete(Ee)}),X.size===0){q(E);return}setTimeout(Se,10)}ht.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let za=null;function Lu(E){za&&za(E)}function fl(){Pi.stop()}function pl(){Pi.start()}const Pi=new $d;Pi.setAnimationLoop(Lu),typeof self<"u"&&Pi.setContext(self),this.setAnimationLoop=function(E){za=E,Re.setAnimationLoop(E),E===null?Pi.stop():Pi.start()},Re.addEventListener("sessionstart",fl),Re.addEventListener("sessionend",pl),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;S!==null&&S.renderStart(E,k);const K=Re.enabled===!0&&Re.isPresenting===!0,X=w!==null&&(Z===null||K)&&w.begin(I,Z);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(k),k=Re.getCamera()),E.isScene===!0&&E.onBeforeRender(I,E,k,Z),b=_e.get(E,x.length),b.init(k),b.state.textureUnits=J.getTextureUnits(),x.push(b),Et.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),le.setFromProjectionMatrix(Et,Vn,k.reversedDepth),je=this.localClippingEnabled,He=Fe.init(this.clippingPlanes,je),T=Me.get(E,R.length),T.init(),R.push(T),Re.enabled===!0&&Re.isPresenting===!0){const Ee=I.xr.getDepthSensingMesh();Ee!==null&&Ga(Ee,k,-1/0,I.sortObjects)}Ga(E,k,0,I.sortObjects),T.finish(),I.sortObjects===!0&&T.sort(H,Q,k.reversedDepth),Tt=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,Tt&&We.addToRenderList(T,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),He===!0&&Fe.beginShadows();const q=b.state.shadowsArray;if(Oe.render(q,E,k),He===!0&&Fe.endShadows(),(X&&w.hasRenderPass())===!1){const Ee=T.opaque,ye=T.transmissive;if(b.setupLights(),k.isArrayCamera){const Ce=k.cameras;if(ye.length>0)for(let De=0,Xe=Ce.length;De<Xe;De++){const Qe=Ce[De];gl(Ee,ye,E,Qe)}Tt&&We.render(E);for(let De=0,Xe=Ce.length;De<Xe;De++){const Qe=Ce[De];ml(T,E,Qe,Qe.viewport)}}else ye.length>0&&gl(Ee,ye,E,k),Tt&&We.render(E),ml(T,E,k)}Z!==null&&B===0&&(J.updateMultisampleRenderTarget(Z),J.updateRenderTargetMipmap(Z)),X&&w.end(I),E.isScene===!0&&E.onAfterRender(I,E,k),be.resetDefaultState(),ie=-1,ce=null,x.pop(),x.length>0?(b=x[x.length-1],J.setTextureUnits(b.state.textureUnits),He===!0&&Fe.setGlobalState(I.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?T=R[R.length-1]:T=null,S!==null&&S.renderEnd()};function Ga(E,k,K,X){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)K=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLightProbeGrid)b.pushLightProbeGrid(E);else if(E.isLight)b.pushLight(E),E.castShadow&&b.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||le.intersectsSprite(E)){X&&Ut.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Et);const Ee=ne.update(E),ye=E.material;ye.visible&&T.push(E,Ee,ye,K,Ut.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||le.intersectsObject(E))){const Ee=ne.update(E),ye=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ut.copy(E.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Ut.copy(Ee.boundingSphere.center)),Ut.applyMatrix4(E.matrixWorld).applyMatrix4(Et)),Array.isArray(ye)){const Ce=Ee.groups;for(let De=0,Xe=Ce.length;De<Xe;De++){const Qe=Ce[De],Ne=ye[Qe.materialIndex];Ne&&Ne.visible&&T.push(E,Ee,Ne,K,Ut.z,Qe)}}else ye.visible&&T.push(E,Ee,ye,K,Ut.z,null)}}const Se=E.children;for(let Ee=0,ye=Se.length;Ee<ye;Ee++)Ga(Se[Ee],k,K,X)}function ml(E,k,K,X){const{opaque:q,transmissive:Se,transparent:Ee}=E;b.setupLightsView(K),He===!0&&Fe.setGlobalState(I.clippingPlanes,K),X&&v.viewport(ae.copy(X)),q.length>0&&br(q,k,K),Se.length>0&&br(Se,k,K),Ee.length>0&&br(Ee,k,K),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function gl(E,k,K,X){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[X.id]===void 0){const Ne=ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[X.id]=new Xn(1,1,{generateMipmaps:!0,type:Ne?li:pn,minFilter:ii,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace})}const Se=b.state.transmissionRenderTarget[X.id],Ee=X.viewport||ae;Se.setSize(Ee.z*I.transmissionResolutionScale,Ee.w*I.transmissionResolutionScale);const ye=I.getRenderTarget(),Ce=I.getActiveCubeFace(),De=I.getActiveMipmapLevel();I.setRenderTarget(Se),I.getClearColor(Je),tt=I.getClearAlpha(),tt<1&&I.setClearColor(16777215,.5),I.clear(),Tt&&We.render(K);const Xe=I.toneMapping;I.toneMapping=Wn;const Qe=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),b.setupLightsView(X),He===!0&&Fe.setGlobalState(I.clippingPlanes,X),br(E,K,X),J.updateMultisampleRenderTarget(Se),J.updateRenderTargetMipmap(Se),ht.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let mt=0,Lt=k.length;mt<Lt;mt++){const It=k[mt],{object:Mt,geometry:Jt,material:we,group:ln}=It;if(we.side===fn&&Mt.layers.test(X.layers)){const ot=we.side;we.side=on,we.needsUpdate=!0,_l(Mt,K,X,Jt,we,ln),we.side=ot,we.needsUpdate=!0,Ne=!0}}Ne===!0&&(J.updateMultisampleRenderTarget(Se),J.updateRenderTargetMipmap(Se))}I.setRenderTarget(ye,Ce,De),I.setClearColor(Je,tt),Qe!==void 0&&(X.viewport=Qe),I.toneMapping=Xe}function br(E,k,K){const X=k.isScene===!0?k.overrideMaterial:null;for(let q=0,Se=E.length;q<Se;q++){const Ee=E[q],{object:ye,geometry:Ce,group:De}=Ee;let Xe=Ee.material;Xe.allowOverride===!0&&X!==null&&(Xe=X),ye.layers.test(K.layers)&&_l(ye,k,K,Ce,Xe,De)}}function _l(E,k,K,X,q,Se){E.onBeforeRender(I,k,K,X,q,Se),E.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),q.onBeforeRender(I,k,K,X,E,Se),q.transparent===!0&&q.side===fn&&q.forceSinglePass===!1?(q.side=on,q.needsUpdate=!0,I.renderBufferDirect(K,k,X,q,E,Se),q.side=ci,q.needsUpdate=!0,I.renderBufferDirect(K,k,X,q,E,Se),q.side=fn):I.renderBufferDirect(K,k,X,q,E,Se),E.onAfterRender(I,k,K,X,q,Se)}function wr(E,k,K){k.isScene!==!0&&(k=at);const X=$.get(E),q=b.state.lights,Se=b.state.shadowsArray,Ee=q.state.version,ye=ge.getParameters(E,q.state,Se,k,K,b.state.lightProbeGridArray),Ce=ge.getProgramCacheKey(ye);let De=X.programs;X.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?k.environment:null,X.fog=k.fog;const Xe=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;X.envMap=he.get(E.envMap||X.environment,Xe),X.envMapRotation=X.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,De===void 0&&(E.addEventListener("dispose",Un),De=new Map,X.programs=De);let Qe=De.get(Ce);if(Qe!==void 0){if(X.currentProgram===Qe&&X.lightsStateVersion===Ee)return Ml(E,ye),Qe}else ye.uniforms=ge.getUniforms(E),S!==null&&E.isNodeMaterial&&S.build(E,K,ye),E.onBeforeCompile(ye,I),Qe=ge.acquireProgram(ye,Ce),De.set(Ce,Qe),X.uniforms=ye.uniforms;const Ne=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ne.clippingPlanes=Fe.uniform),Ml(E,ye),X.needsLights=Fu(E),X.lightsStateVersion=Ee,X.needsLights&&(Ne.ambientLightColor.value=q.state.ambient,Ne.lightProbe.value=q.state.probe,Ne.directionalLights.value=q.state.directional,Ne.directionalLightShadows.value=q.state.directionalShadow,Ne.spotLights.value=q.state.spot,Ne.spotLightShadows.value=q.state.spotShadow,Ne.rectAreaLights.value=q.state.rectArea,Ne.ltc_1.value=q.state.rectAreaLTC1,Ne.ltc_2.value=q.state.rectAreaLTC2,Ne.pointLights.value=q.state.point,Ne.pointLightShadows.value=q.state.pointShadow,Ne.hemisphereLights.value=q.state.hemi,Ne.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ne.spotLightMatrix.value=q.state.spotLightMatrix,Ne.spotLightMap.value=q.state.spotLightMap,Ne.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=b.state.lightProbeGridArray.length>0,X.currentProgram=Qe,X.uniformsList=null,Qe}function xl(E){if(E.uniformsList===null){const k=E.currentProgram.getUniforms();E.uniformsList=pa.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function Ml(E,k){const K=$.get(E);K.outputColorSpace=k.outputColorSpace,K.batching=k.batching,K.batchingColor=k.batchingColor,K.instancing=k.instancing,K.instancingColor=k.instancingColor,K.instancingMorph=k.instancingMorph,K.skinning=k.skinning,K.morphTargets=k.morphTargets,K.morphNormals=k.morphNormals,K.morphColors=k.morphColors,K.morphTargetsCount=k.morphTargetsCount,K.numClippingPlanes=k.numClippingPlanes,K.numIntersection=k.numClipIntersection,K.vertexAlphas=k.vertexAlphas,K.vertexTangents=k.vertexTangents,K.toneMapping=k.toneMapping}function Du(E,k){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;M.setFromMatrixPosition(k.matrixWorld);for(let K=0,X=E.length;K<X;K++){const q=E[K];if(q.texture!==null&&q.boundingBox.containsPoint(M))return q}return null}function Nu(E,k,K,X,q){k.isScene!==!0&&(k=at),J.resetTextureUnits();const Se=k.fog,Ee=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?k.environment:null,ye=Z===null?I.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:it.workingColorSpace,Ce=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,De=he.get(X.envMap||Ee,Ce),Xe=X.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Qe=!!K.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ne=!!K.morphAttributes.position,mt=!!K.morphAttributes.normal,Lt=!!K.morphAttributes.color;let It=Wn;X.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(It=I.toneMapping);const Mt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Jt=Mt!==void 0?Mt.length:0,we=$.get(X),ln=b.state.lights;if(He===!0&&(je===!0||E!==ce)){const St=E===ce&&X.id===ie;Fe.setState(X,E,St)}let ot=!1;X.version===we.__version?(we.needsLights&&we.lightsStateVersion!==ln.state.version||we.outputColorSpace!==ye||q.isBatchedMesh&&we.batching===!1||!q.isBatchedMesh&&we.batching===!0||q.isBatchedMesh&&we.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&we.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&we.instancing===!1||!q.isInstancedMesh&&we.instancing===!0||q.isSkinnedMesh&&we.skinning===!1||!q.isSkinnedMesh&&we.skinning===!0||q.isInstancedMesh&&we.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&we.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&we.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&we.instancingMorph===!1&&q.morphTexture!==null||we.envMap!==De||X.fog===!0&&we.fog!==Se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Fe.numPlanes||we.numIntersection!==Fe.numIntersection)||we.vertexAlphas!==Xe||we.vertexTangents!==Qe||we.morphTargets!==Ne||we.morphNormals!==mt||we.morphColors!==Lt||we.toneMapping!==It||we.morphTargetsCount!==Jt||!!we.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(ot=!0):(ot=!0,we.__version=X.version);let _n=we.currentProgram;ot===!0&&(_n=wr(X,k,q),S&&X.isNodeMaterial&&S.onUpdateProgram(X,_n,we));let Fn=!1,fi=!1,Zi=!1;const vt=_n.getUniforms(),Dt=we.uniforms;if(v.useProgram(_n.program)&&(Fn=!0,fi=!0,Zi=!0),X.id!==ie&&(ie=X.id,fi=!0),we.needsLights){const St=Du(b.state.lightProbeGridArray,q);we.lightProbeGrid!==St&&(we.lightProbeGrid=St,fi=!0)}if(Fn||ce!==E){v.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),vt.setValue(F,"projectionMatrix",E.projectionMatrix),vt.setValue(F,"viewMatrix",E.matrixWorldInverse);const mi=vt.map.cameraPosition;mi!==void 0&&mi.setValue(F,Ct.setFromMatrixPosition(E.matrixWorld)),C.logarithmicDepthBuffer&&vt.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&vt.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),ce!==E&&(ce=E,fi=!0,Zi=!0)}if(we.needsLights&&(ln.state.directionalShadowMap.length>0&&vt.setValue(F,"directionalShadowMap",ln.state.directionalShadowMap,J),ln.state.spotShadowMap.length>0&&vt.setValue(F,"spotShadowMap",ln.state.spotShadowMap,J),ln.state.pointShadowMap.length>0&&vt.setValue(F,"pointShadowMap",ln.state.pointShadowMap,J)),q.isSkinnedMesh){vt.setOptional(F,q,"bindMatrix"),vt.setOptional(F,q,"bindMatrixInverse");const St=q.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),vt.setValue(F,"boneTexture",St.boneTexture,J))}q.isBatchedMesh&&(vt.setOptional(F,q,"batchingTexture"),vt.setValue(F,"batchingTexture",q._matricesTexture,J),vt.setOptional(F,q,"batchingIdTexture"),vt.setValue(F,"batchingIdTexture",q._indirectTexture,J),vt.setOptional(F,q,"batchingColorTexture"),q._colorsTexture!==null&&vt.setValue(F,"batchingColorTexture",q._colorsTexture,J));const pi=K.morphAttributes;if((pi.position!==void 0||pi.normal!==void 0||pi.color!==void 0)&&U.update(q,K,_n),(fi||we.receiveShadow!==q.receiveShadow)&&(we.receiveShadow=q.receiveShadow,vt.setValue(F,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&k.environment!==null&&(Dt.envMapIntensity.value=k.environmentIntensity),Dt.dfgLUT!==void 0&&(Dt.dfgLUT.value=Kx()),fi){if(vt.setValue(F,"toneMappingExposure",I.toneMappingExposure),we.needsLights&&Uu(Dt,Zi),Se&&X.fog===!0&&Le.refreshFogUniforms(Dt,Se),Le.refreshMaterialUniforms(Dt,X,oe,ue,b.state.transmissionRenderTarget[E.id]),we.needsLights&&we.lightProbeGrid){const St=we.lightProbeGrid;Dt.probesSH.value=St.texture,Dt.probesMin.value.copy(St.boundingBox.min),Dt.probesMax.value.copy(St.boundingBox.max),Dt.probesResolution.value.copy(St.resolution)}pa.upload(F,xl(we),Dt,J)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(pa.upload(F,xl(we),Dt,J),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&vt.setValue(F,"center",q.center),vt.setValue(F,"modelViewMatrix",q.modelViewMatrix),vt.setValue(F,"normalMatrix",q.normalMatrix),vt.setValue(F,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){const St=X.uniformsGroups;for(let mi=0,Ji=St.length;mi<Ji;mi++){const vl=St[mi];se.update(vl,_n),se.bind(vl,_n)}}return _n}function Uu(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Fu(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(E,k,K){const X=$.get(E);X.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),$.get(E.texture).__webglTexture=k,$.get(E.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:K,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,k){const K=$.get(E);K.__webglFramebuffer=k,K.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,K=0){Z=E,V=k,B=K;let X=null,q=!1,Se=!1;if(E){const ye=$.get(E);if(ye.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(F.FRAMEBUFFER,ye.__webglFramebuffer),ae.copy(E.viewport),pe.copy(E.scissor),Ze=E.scissorTest,v.viewport(ae),v.scissor(pe),v.setScissorTest(Ze),ie=-1;return}else if(ye.__webglFramebuffer===void 0)J.setupRenderTarget(E);else if(ye.__hasExternalTextures)J.rebindTextures(E,$.get(E.texture).__webglTexture,$.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Xe=E.depthTexture;if(ye.__boundDepthTexture!==Xe){if(Xe!==null&&$.has(Xe)&&(E.width!==Xe.image.width||E.height!==Xe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(E)}}const Ce=E.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(Se=!0);const De=$.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(De[k])?X=De[k][K]:X=De[k],q=!0):E.samples>0&&J.useMultisampledRTT(E)===!1?X=$.get(E).__webglMultisampledFramebuffer:Array.isArray(De)?X=De[K]:X=De,ae.copy(E.viewport),pe.copy(E.scissor),Ze=E.scissorTest}else ae.copy(de).multiplyScalar(oe).floor(),pe.copy(Ae).multiplyScalar(oe).floor(),Ze=Te;if(K!==0&&(X=L),v.bindFramebuffer(F.FRAMEBUFFER,X)&&v.drawBuffers(E,X),v.viewport(ae),v.scissor(pe),v.setScissorTest(Ze),q){const ye=$.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,ye.__webglTexture,K)}else if(Se){const ye=k;for(let Ce=0;Ce<E.textures.length;Ce++){const De=$.get(E.textures[Ce]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ce,De.__webglTexture,K,ye)}}else if(E!==null&&K!==0){const ye=$.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ye.__webglTexture,K)}ie=-1},this.readRenderTargetPixels=function(E,k,K,X,q,Se,Ee,ye=0){if(!(E&&E.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=$.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce){v.bindFramebuffer(F.FRAMEBUFFER,Ce);try{const De=E.textures[ye],Xe=De.format,Qe=De.type;if(E.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ye),!C.textureFormatReadable(Xe)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!C.textureTypeReadable(Qe)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-X&&K>=0&&K<=E.height-q&&F.readPixels(k,K,X,q,xe.convert(Xe),xe.convert(Qe),Se)}finally{const De=Z!==null?$.get(Z).__webglFramebuffer:null;v.bindFramebuffer(F.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(E,k,K,X,q,Se,Ee,ye=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=$.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce)if(k>=0&&k<=E.width-X&&K>=0&&K<=E.height-q){v.bindFramebuffer(F.FRAMEBUFFER,Ce);const De=E.textures[ye],Xe=De.format,Qe=De.type;if(E.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ye),!C.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!C.textureTypeReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Ne),F.bufferData(F.PIXEL_PACK_BUFFER,Se.byteLength,F.STREAM_READ),F.readPixels(k,K,X,q,xe.convert(Xe),xe.convert(Qe),0);const mt=Z!==null?$.get(Z).__webglFramebuffer:null;v.bindFramebuffer(F.FRAMEBUFFER,mt);const Lt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Sf(F,Lt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Ne),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Se),F.deleteBuffer(Ne),F.deleteSync(Lt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,k=null,K=0){const X=Math.pow(2,-K),q=Math.floor(E.image.width*X),Se=Math.floor(E.image.height*X),Ee=k!==null?k.x:0,ye=k!==null?k.y:0;J.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,K,0,0,Ee,ye,q,Se),v.unbindTexture()},this.copyTextureToTexture=function(E,k,K=null,X=null,q=0,Se=0){let Ee,ye,Ce,De,Xe,Qe,Ne,mt,Lt;const It=E.isCompressedTexture?E.mipmaps[Se]:E.image;if(K!==null)Ee=K.max.x-K.min.x,ye=K.max.y-K.min.y,Ce=K.isBox3?K.max.z-K.min.z:1,De=K.min.x,Xe=K.min.y,Qe=K.isBox3?K.min.z:0;else{const Dt=Math.pow(2,-q);Ee=Math.floor(It.width*Dt),ye=Math.floor(It.height*Dt),E.isDataArrayTexture?Ce=It.depth:E.isData3DTexture?Ce=Math.floor(It.depth*Dt):Ce=1,De=0,Xe=0,Qe=0}X!==null?(Ne=X.x,mt=X.y,Lt=X.z):(Ne=0,mt=0,Lt=0);const Mt=xe.convert(k.format),Jt=xe.convert(k.type);let we;k.isData3DTexture?(J.setTexture3D(k,0),we=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(J.setTexture2DArray(k,0),we=F.TEXTURE_2D_ARRAY):(J.setTexture2D(k,0),we=F.TEXTURE_2D),v.activeTexture(F.TEXTURE0),v.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),v.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),v.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);const ln=v.getParameter(F.UNPACK_ROW_LENGTH),ot=v.getParameter(F.UNPACK_IMAGE_HEIGHT),_n=v.getParameter(F.UNPACK_SKIP_PIXELS),Fn=v.getParameter(F.UNPACK_SKIP_ROWS),fi=v.getParameter(F.UNPACK_SKIP_IMAGES);v.pixelStorei(F.UNPACK_ROW_LENGTH,It.width),v.pixelStorei(F.UNPACK_IMAGE_HEIGHT,It.height),v.pixelStorei(F.UNPACK_SKIP_PIXELS,De),v.pixelStorei(F.UNPACK_SKIP_ROWS,Xe),v.pixelStorei(F.UNPACK_SKIP_IMAGES,Qe);const Zi=E.isDataArrayTexture||E.isData3DTexture,vt=k.isDataArrayTexture||k.isData3DTexture;if(E.isDepthTexture){const Dt=$.get(E),pi=$.get(k),St=$.get(Dt.__renderTarget),mi=$.get(pi.__renderTarget);v.bindFramebuffer(F.READ_FRAMEBUFFER,St.__webglFramebuffer),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,mi.__webglFramebuffer);for(let Ji=0;Ji<Ce;Ji++)Zi&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,$.get(E).__webglTexture,q,Qe+Ji),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,$.get(k).__webglTexture,Se,Lt+Ji)),F.blitFramebuffer(De,Xe,Ee,ye,Ne,mt,Ee,ye,F.DEPTH_BUFFER_BIT,F.NEAREST);v.bindFramebuffer(F.READ_FRAMEBUFFER,null),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(q!==0||E.isRenderTargetTexture||$.has(E)){const Dt=$.get(E),pi=$.get(k);v.bindFramebuffer(F.READ_FRAMEBUFFER,O),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,N);for(let St=0;St<Ce;St++)Zi?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Dt.__webglTexture,q,Qe+St):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Dt.__webglTexture,q),vt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,pi.__webglTexture,Se,Lt+St):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,pi.__webglTexture,Se),q!==0?F.blitFramebuffer(De,Xe,Ee,ye,Ne,mt,Ee,ye,F.COLOR_BUFFER_BIT,F.NEAREST):vt?F.copyTexSubImage3D(we,Se,Ne,mt,Lt+St,De,Xe,Ee,ye):F.copyTexSubImage2D(we,Se,Ne,mt,De,Xe,Ee,ye);v.bindFramebuffer(F.READ_FRAMEBUFFER,null),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else vt?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(we,Se,Ne,mt,Lt,Ee,ye,Ce,Mt,Jt,It.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(we,Se,Ne,mt,Lt,Ee,ye,Ce,Mt,It.data):F.texSubImage3D(we,Se,Ne,mt,Lt,Ee,ye,Ce,Mt,Jt,It):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Se,Ne,mt,Ee,ye,Mt,Jt,It.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Se,Ne,mt,It.width,It.height,Mt,It.data):F.texSubImage2D(F.TEXTURE_2D,Se,Ne,mt,Ee,ye,Mt,Jt,It);v.pixelStorei(F.UNPACK_ROW_LENGTH,ln),v.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ot),v.pixelStorei(F.UNPACK_SKIP_PIXELS,_n),v.pixelStorei(F.UNPACK_SKIP_ROWS,Fn),v.pixelStorei(F.UNPACK_SKIP_IMAGES,fi),Se===0&&k.generateMipmaps&&F.generateMipmap(we),v.unbindTexture()},this.initRenderTarget=function(E){$.get(E).__webglFramebuffer===void 0&&J.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?J.setTextureCube(E,0):E.isData3DTexture?J.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?J.setTexture2DArray(E,0):J.setTexture2D(E,0),v.unbindTexture()},this.resetState=function(){V=0,B=0,Z=null,v.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}function Ke(i){const e=i.replace(/^\/+/,""),t="/golf-cart-hero/";return t.endsWith("/")?`${t}${e}`:`${t}/${e}`}const Hh={yamaha:Ke("assets/carts/game/yamaha-opentop.png"),evolution:Ke("assets/carts/game/evolution-opentop.png"),hotrod:Ke("assets/carts/game/hotrod-opentop.png")};function Jx(i){const e=document.createElement("canvas");e.width=i.naturalWidth||i.width,e.height=i.naturalHeight||i.height;const t=e.getContext("2d",{willReadFrequently:!0});t.drawImage(i,0,0);const n=t.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a+=4){const o=s[a],c=s[a+1],l=s[a+2],h=s[a+3];if(h<8)continue;const d=c-Math.max(o,l);if(c>90&&d>30){const u=d>65?0:Math.max(0,1-(d-30)/35);s[a+3]=Math.min(h,Math.round(u*255))}}t.putImageData(n,0,0);const r=new Na(e);return r.colorSpace=wt,r.anisotropy=8,r.needsUpdate=!0,r}function jx(i){return new Promise((e,t)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>e(n),n.onerror=()=>t(new Error(`Failed to load ${i}`)),n.src=i})}async function Qx(){const i={},e=Object.keys(Hh);return await Promise.all(e.map(async t=>{try{const n=await jx(Hh[t]);i[t]=Jx(n)}catch(n){console.warn(`[cartSprites] ${t} failed`,n)}})),i}const Eo={asphalt:Ke("assets/textures/terrain/asphalt.jpg"),grass:Ke("assets/textures/terrain/grass.jpg"),fairway:Ke("assets/textures/terrain/fairway.jpg"),sidewalk:Ke("assets/textures/terrain/sidewalk.jpg"),water:Ke("assets/textures/terrain/water.jpg"),curb:Ke("assets/textures/terrain/curb.jpg"),stucco:Ke("assets/textures/buildings/stucco.jpg"),roof:Ke("assets/textures/buildings/roof_terracotta.jpg"),woodDoor:Ke("assets/textures/buildings/wood_door.jpg"),glass:Ke("assets/textures/buildings/glass.jpg"),palmBark:Ke("assets/textures/foliage/palm_bark.jpg"),palmBarkAlt:Ke("assets/textures/foliage/palm_bark_alt.jpg"),palmFrond:Ke("assets/textures/foliage/palm_frond.jpg"),cartYamaha:Ke("assets/textures/carts/paint_yamaha.jpg"),cartEvolution:Ke("assets/textures/carts/paint_evolution.jpg"),cartHotrod:Ke("assets/textures/carts/paint_hotrod.jpg")};function Bn(i,e=.85,t=.15){return new zt({color:i,roughness:e,metalness:t})}function At(i,e,t={}){const n=new zt({color:t.color??"#ffffff",roughness:t.rough??.85,metalness:t.metal??.12,transparent:t.transparent??!1,opacity:t.opacity??1});if(i){const s=i.clone();s.wrapS=s.wrapT=Ri;const r=t.repeat??1;s.repeat.set(r,r),s.colorSpace=wt,s.needsUpdate=!0,n.map=s}else n.color=new Ue(e);return n}function eM(i,e=1){return i.wrapS=i.wrapT=Ri,i.repeat.set(e,e),i.colorSpace=wt,i.anisotropy=8,i.needsUpdate=!0,i}async function tM(){const i=new el,e={},{loadHazardSprites:t}=await Sl(async()=>{const{loadHazardSprites:a}=await Promise.resolve().then(()=>nv);return{loadHazardSprites:a}},void 0),{loadCartGlbs:n}=await Sl(async()=>{const{loadCartGlbs:a}=await Promise.resolve().then(()=>zv);return{loadCartGlbs:a}},void 0);let s={};await Promise.all([...Object.keys(Eo).map(a=>new Promise(o=>{i.load(Eo[a],c=>{e[a]=eM(c,1),o()},void 0,()=>{console.warn(`[assets] Failed to load ${Eo[a]}`),o()})})),t().catch(a=>{console.warn("[assets] Hazard sprites failed",a)}),Qx().then(a=>{s=a}).catch(a=>{console.warn("[assets] Cart photo sprites failed",a)}),n().catch(a=>{console.warn("[assets] Cart GLB models failed",a)})]);const r=nu(e);return{textures:e,materials:r,cartSprites:s,ready:!0}}function nu(i){const e=i;return{asphalt:At(e.asphalt,"#5a6270",{rough:.88,metal:.15,repeat:8,color:"#e8e8ea"}),asphaltDark:At(e.asphalt,"#4a515a",{rough:.9,metal:.12,repeat:10,color:"#d0d0d4"}),grass:At(e.grass,"#45a862",{rough:.92,metal:.04,repeat:14,color:"#d8f0d0"}),grassDeep:At(e.grass,"#2f8a50",{rough:.92,metal:.04,repeat:18,color:"#b0e0b0"}),fairway:At(e.fairway,"#55c878",{rough:.88,metal:.04,repeat:10,color:"#d0f5d8"}),sidewalk:At(e.sidewalk,"#e0d8cc",{rough:.86,metal:.08,repeat:6,color:"#fff8f0"}),water:At(e.water,"#3ab0d8",{rough:.1,metal:.5,repeat:4,transparent:!0,opacity:.88,color:"#c8f0ff"}),curb:At(e.curb,"#48a868",{rough:.82,metal:.08,repeat:4,color:"#d0f0d0"}),stucco:At(e.stucco,"#f5ecde",{rough:.88,metal:.06,repeat:3,color:"#fffaf2"}),stuccoAlt:At(e.stucco,"#f0e6d6",{rough:.88,metal:.06,repeat:3.5,color:"#fff6ea"}),roof:At(e.roof,"#d06050",{rough:.78,metal:.12,repeat:4,color:"#ffe0d8"}),roofBlue:At(e.roof,"#4a8aaa",{rough:.78,metal:.12,repeat:4,color:"#a0c8e8"}),roofGreen:At(e.roof,"#3d8a5a",{rough:.78,metal:.12,repeat:4,color:"#90d0a0"}),woodDoor:At(e.woodDoor,"#6b4a32",{rough:.8,metal:.1,repeat:1.5}),glass:At(e.glass,"#7ec8e8",{rough:.15,metal:.65,repeat:1,transparent:!0,opacity:.75}),palmBark:At(e.palmBark??e.palmBarkAlt,"#8b5a2b",{rough:.92,metal:.05,repeat:2}),palmFrond:At(e.palmFrond,"#1f6b4a",{rough:.88,metal:.05,repeat:2}),palmFrondLite:At(e.palmFrond,"#2a8a4a",{rough:.88,metal:.05,repeat:2.5,color:"#d0f0d0"}),cartPaint:{yamaha:At(e.cartYamaha,"#2f6f4e",{rough:.35,metal:.45,repeat:2}),evolution:At(e.cartEvolution,"#3aa6c9",{rough:.32,metal:.5,repeat:2}),hotrod:At(e.cartHotrod,"#e85d4c",{rough:.3,metal:.55,repeat:2})},line:Bn("#f4f4f0",.45,.35),center:Bn("#f0c93a",.45,.35),sand:Bn("#e8d5a8",.9,.1),plaza:Bn("#e8dcc8",.85,.15),parking:Bn("#6b7582",.85,.25),lamp:Bn("#e8e0c8",.3,.7),cloud:Bn("#ffffff",.95,.05),hedge:Bn("#2d6b3a",.95,.08),driveway:At(e.sidewalk,"#9a958c",{rough:.9,metal:.1,repeat:2}),fence:Bn("#c4b49a",.85,.12),shrub:Bn("#3d8a4a",.95,.08),window:At(e.glass,"#7ec8e8",{rough:.2,metal:.55,repeat:1,transparent:!0,opacity:.8}),door:At(e.woodDoor,"#6b4a32",{rough:.8,metal:.1,repeat:1})}}function nM(){return nu({})}const sl=[{amountUsd:1,label:"Cart-path tip",blurb:"Red supporter flag",flagColor:"#c62828",flagName:"Red"},{amountUsd:3,label:"Happy-hour tip",blurb:"Blue supporter flag",flagColor:"#1e88e5",flagName:"Blue"},{amountUsd:5,label:"Lanai legend tip",blurb:"Gold supporter flag",flagColor:"#d4af37",flagName:"Gold"}],iu="vgch-donation-highest-usd",Vh="vgch-donation-sessions";function iM(i){return sl.find(e=>e.amountUsd===i)?.flagColor??"#c62828"}function Wh(i){return sl.find(e=>e.amountUsd===i)?.flagName??"Red"}function rl(i){return i===1||i===3||i===5}function $i(){try{const i=localStorage.getItem(iu);if(!i)return null;const e=Number(i);return rl(e)?e:null}catch{return null}}function sM(i){if(!rl(i))return $i();const e=$i(),t=e==null?i:Math.max(e,i);try{localStorage.setItem(iu,String(t))}catch{}return t}function rM(i){if(!i)return!1;try{const e=JSON.parse(localStorage.getItem(Vh)||"[]");if(e.includes(i))return!1;for(e.push(i);e.length>40;)e.shift();return localStorage.setItem(Vh,JSON.stringify(e)),!0}catch{return!0}}async function aM(i){try{const e=await fetch("/api/donate/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amountUsd:i})}),t=await e.json();return!e.ok||!t.url?{error:t.error||"Could not start checkout"}:{url:t.url}}catch{return{error:"Could not reach the tip server. Run the game with `npm run dev` and set STRIPE_SECRET_KEY in .env.local."}}}async function oM(i){try{const e=await fetch("/api/donate/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:i})}),t=await e.json();if(!e.ok)return{ok:!1,error:t.error||"Could not verify tip"};const n=t.amountUsd;let s=null;return typeof n=="number"&&rl(n)&&(rM(i)?s=sM(n):s=$i()),{ok:!0,amountUsd:n,tier:s,message:t.message||"Thanks for the tip!"}}catch{return{ok:!1,error:"Could not verify tip with the server."}}}async function cM(){try{const i=await fetch("/api/donate/status");return i.ok?!!(await i.json()).ready:!1}catch{return!1}}function nr(){try{if(new URLSearchParams(window.location.search).get("native")==="1")return!0}catch{}return/GolfCartHeroNative/i.test(navigator.userAgent||"")}const lM=5,hM=28,Xh=5,dM=22,uM=20,fM=1;function qh(){const i=window.screen?.orientation?.angle;if(typeof i=="number"){const t=(Math.round(i/90)*90%360+360)%360;return t===90||t===180||t===270?t:0}const e=window.orientation;return e===90?90:e===-90||e===270?270:e===180?180:window.innerWidth>window.innerHeight?90:0}function pM(i,e,t){switch(t){case 90:return{roll:i,pitch:-e};case 180:return{roll:-e,pitch:-i};case 270:return{roll:-i,pitch:e};default:return{roll:e,pitch:i}}}function mM(i,e,t,n){let s=i,r=e;const a=t;n===90?(s=e,r=-i):n===180?(s=-i,r=-e):n===270&&(s=-e,r=i);const o=Math.atan2(s,Math.hypot(r,a))*180/Math.PI,c=Math.atan2(r,Math.hypot(s,a))*180/Math.PI;return{roll:o,pitch:c}}function Ao(i,e,t){const n=Math.abs(i);if(n<=e)return 0;const s=Math.min(1,(n-e)/Math.max(1,t-e)),r=s*s*(3-2*s);return Math.sign(i)*r}function gM(){return/Android/i.test(navigator.userAgent||"")}function su(){if(typeof window>"u")return!1;if(nr()||gM())return!0;const i=window.matchMedia("(pointer: coarse)").matches,e=window.matchMedia("(hover: none)").matches;return(i||e)&&window.innerWidth<1100}class _M{steer=0;throttle=0;brake=0;available=!1;listening=!1;rawRoll=0;rawPitch=90;smoothRoll=0;smoothPitch=90;restRoll=0;restPitch=70;hasSample=!1;calibrating=!0;calibT=0;calibRoll=0;calibPitch=0;calibN=0;gotOrientation=!1;unsubs=[];get ready(){return this.hasSample}async start(){if(this.stop(),this.listening=!0,this.calibrating=!0,this.calibT=0,this.calibN=0,this.calibRoll=0,this.calibPitch=0,this.hasSample=!1,this.gotOrientation=!1,this.steer=0,this.throttle=0,this.brake=0,!await this.requestPermission())return this.listening=!1,!1;const t=a=>{if(a.beta==null||a.gamma==null)return;this.gotOrientation=!0;const o=pM(a.beta,a.gamma,qh());this.pushSample(o.roll,o.pitch)},n=a=>{if(this.gotOrientation)return;const o=a.accelerationIncludingGravity;if(!o||o.x==null||o.y==null||o.z==null)return;const c=mM(o.x,o.y,o.z,qh());this.pushSample(c.roll,c.pitch)};window.addEventListener("deviceorientation",t,!0),window.addEventListener("deviceorientationabsolute",t,!0),window.addEventListener("devicemotion",n,!0),this.unsubs.push(()=>{window.removeEventListener("deviceorientation",t,!0),window.removeEventListener("deviceorientationabsolute",t,!0),window.removeEventListener("devicemotion",n,!0)});const s=()=>this.recenter();window.addEventListener("orientationchange",s);const r=window.screen?.orientation;return r?.addEventListener?.("change",s),this.unsubs.push(()=>{window.removeEventListener("orientationchange",s),r?.removeEventListener?.("change",s)}),this.available=!0,!0}stop(){this.listening=!1,this.steer=0,this.throttle=0,this.brake=0;for(const e of this.unsubs)e();this.unsubs=[]}recenter(){this.calibrating=!0,this.calibT=0,this.calibN=0,this.calibRoll=0,this.calibPitch=0,this.steer=0,this.throttle=0,this.brake=0,this.hasSample&&(this.restRoll=this.smoothRoll,this.restPitch=this.smoothPitch)}update(e){if(!this.listening||!this.hasSample){this.steer=0,this.throttle=0,this.brake=0;return}const t=1-Math.exp(-16*e);if(this.smoothRoll+=(this.rawRoll-this.smoothRoll)*t,this.smoothPitch+=(this.rawPitch-this.smoothPitch)*t,this.calibrating)if(this.calibT+=e,this.calibRoll+=this.smoothRoll,this.calibPitch+=this.smoothPitch,this.calibN+=1,this.calibT>=fM&&this.calibN>4)this.restRoll=this.calibRoll/this.calibN,this.restPitch=this.calibPitch/this.calibN,this.calibrating=!1;else{this.steer=0,this.throttle=0,this.brake=0;return}const n=this.smoothRoll-this.restRoll,s=this.smoothPitch-this.restPitch;this.steer=Ao(n,lM,hM);const r=Ao(-s,Xh,dM),a=Ao(s,Xh,uM);this.throttle=Math.max(0,r),this.brake=Math.max(0,a)}pushSample(e,t){!Number.isFinite(e)||!Number.isFinite(t)||(this.rawRoll=e,this.rawPitch=t,this.hasSample||(this.smoothRoll=e,this.smoothPitch=t,this.hasSample=!0))}async requestPermission(){try{const e=DeviceOrientationEvent;if(typeof e.requestPermission=="function"&&await e.requestPermission()!=="granted")return!1;const t=DeviceMotionEvent;if(typeof t.requestPermission=="function")try{await t.requestPermission()}catch{}return!0}catch{return!1}}}class xM{state={throttle:!1,brake:!1,left:!1,right:!1,fire:!1,pause:!1};enabled=!1;tilt=new _M;pausePressed=!1;firePressed=!1;constructor(){window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}destroy(){this.tilt.stop(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp)}get steerAxis(){return this.state.left&&!this.state.right?-1:this.state.right&&!this.state.left?1:this.state.left&&this.state.right?0:this.tilt.steer}get throttleAmount(){return this.state.throttle?1:this.tilt.throttle}get brakeAmount(){return this.state.brake?1:this.tilt.brake}update(e){this.tilt.update(e)}async startTilt(){return this.tilt.start()}stopTilt(){this.tilt.stop()}recenterTilt(){this.tilt.recenter()}isTypingTarget(e){if(!(e instanceof HTMLElement))return!1;const t=e.tagName;if(t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.isContentEditable)return!0;const n=document.activeElement;if(n instanceof HTMLElement){const s=n.tagName;if(s==="INPUT"||s==="TEXTAREA"||s==="SELECT"||n.isContentEditable)return!0}return!1}onKeyDown=e=>{if(!(!this.enabled||this.isTypingTarget(e.target))&&!e.repeat)switch(e.code){case"ArrowUp":case"KeyW":this.state.throttle=!0,e.preventDefault();break;case"ArrowDown":case"KeyS":this.state.brake=!0,e.preventDefault();break;case"ArrowLeft":case"KeyA":this.state.left=!0,e.preventDefault();break;case"ArrowRight":case"KeyD":this.state.right=!0,e.preventDefault();break;case"Space":case"KeyE":case"KeyF":this.state.fire=!0,this.firePressed=!0,e.preventDefault();break;case"Escape":case"KeyP":this.pausePressed=!0,e.preventDefault();break}};onKeyUp=e=>{switch(e.code){case"ArrowUp":case"KeyW":this.state.throttle=!1;break;case"ArrowDown":case"KeyS":this.state.brake=!1;break;case"ArrowLeft":case"KeyA":this.state.left=!1;break;case"ArrowRight":case"KeyD":this.state.right=!1;break;case"Space":case"KeyE":case"KeyF":this.state.fire=!1;break}};set(e){e.fire===!0&&(this.firePressed=!0),Object.assign(this.state,e)}consumeFire(){return this.enabled&&this.firePressed?(this.firePressed=!1,!0):!1}consumePause(){return this.pausePressed?(this.pausePressed=!1,!0):!1}reset(){this.state={throttle:!1,brake:!1,left:!1,right:!1,fire:!1,pause:!1},this.pausePressed=!1,this.firePressed=!1}}const Yh={"spanish-springs":{areaId:"spanish-springs",src:Ke("assets/music/spanish-springs.ogg"),title:"Flamenco Melody",artist:"JCZA",vibe:"Spanish guitar · plaza nights"},"lake-sumter":{areaId:"lake-sumter",src:Ke("assets/music/lake-sumter.mp3"),title:"Dimensions in Blue",artist:"USAF Band of the West · Dimensions in Blue",vibe:"Lakeside big-band jazz"},brownwood:{areaId:"brownwood",src:Ke("assets/music/brownwood.mp3"),title:"The Great One Step",artist:"Victor Dance Orchestra (public domain)",vibe:"Old-time dance · paddock energy"},eastport:{areaId:"eastport",src:Ke("assets/music/eastport.ogg"),title:"BugaBlue",artist:"US Army Blues",vibe:"Mid-century blues · pavilion cool"},"sawgrass-grove":{areaId:"sawgrass-grove",src:Ke("assets/music/sawgrass-grove.ogg"),title:"Bossa Nova Groove",artist:"Play-along bossa (Wikimedia Commons)",vibe:"Citrus grove · easy bossa"}},MM=.38;class vM{audio=null;currentArea=null;unlocked=!1;muted=!1;preferredOn=!0;constructor(){try{this.muted=localStorage.getItem("vgch-music-muted")==="1",this.preferredOn=localStorage.getItem("vgch-music-off")!=="1"}catch{}}isMuted(){return this.muted||!this.preferredOn}unlock(){this.unlocked=!0,this.audio&&this.preferredOn&&!this.muted&&this.audio.play().catch(()=>{})}setMuted(e){this.muted=e,this.preferredOn=!e;try{localStorage.setItem("vgch-music-muted",e?"1":"0"),localStorage.setItem("vgch-music-off",e?"1":"0")}catch{}this.audio&&(this.audio.muted=e,!e&&this.unlocked?this.audio.play().catch(()=>{}):this.audio.pause())}toggleMute(){return this.setMuted(!this.isMuted()),this.isMuted()}getTrack(e){return Yh[e]??Yh["spanish-springs"]}playForArea(e){this.unlocked=!0;const t=this.getTrack(e);if(this.currentArea===e&&this.audio)return this.preferredOn&&!this.muted&&this.audio.play().catch(()=>{}),t;this.stop(),this.currentArea=e;const n=new Audio(t.src);return n.loop=!0,n.volume=MM,n.preload="auto",n.muted=this.muted||!this.preferredOn,this.audio=n,this.preferredOn&&!this.muted&&n.play().catch(s=>{console.warn("[music] Autoplay blocked until user gesture",s)}),t}stop(){this.audio&&(this.audio.pause(),this.audio.src="",this.audio=null),this.currentArea=null}}const Ei=new vM,Is=[{id:"yamaha",name:"Yamaha Drive2",shortName:"Yamaha",blurb:"Classic white Drive2 — open top, cream seats. Shoots golf balls.",color:"#f2f2f0",accent:"#1a1a1c",topSpeed:32,accel:18,handling:1.15,offRoadGrip:.42,emoji:"⛽",powerType:"gas"},{id:"evolution",name:"Evolution Cruiser",shortName:"Evolution",blurb:"Cyan electric cruiser — open top, orange rims. Shoots loofahs.",color:"#2ec4d6",accent:"#1a9aab",topSpeed:29,accel:22,handling:1.35,offRoadGrip:.48,emoji:"🔋",powerType:"electric"},{id:"hotrod",name:"Street Rod",shortName:"Hot Rod",blurb:"Blue/silver street rod — open top, chrome grille. Shoots fireballs.",color:"#2a6db5",accent:"#d8dde2",topSpeed:38,accel:19,handling:.95,offRoadGrip:.35,emoji:"🔥",powerType:"hotrod"}];function yM(i){return Is.find(e=>e.id===i)??Is[0]}const Ls=[{id:"alligator",name:"Alligator Al",species:"American Alligator",emoji:"🐊",blurb:"Retention-pond royalty. Unfazed by water hazards — maybe a little too unfazed.",luck:1.05,color:"#2f6f4e"},{id:"turtle",name:"Shelly Slowlane",species:"Florida Softshell",emoji:"🐢",blurb:"Knows every crosswalk. Will NOT hit other turtles. Moral high ground included.",luck:1.1,color:"#5c8a4a"},{id:"manatee",name:"Mo the Manatee",species:"West Indian Manatee",emoji:"🦭",blurb:"Gentle giant energy. Bumper padding for days. Snack holder always stocked.",luck:1.08,color:"#7a8fa0"},{id:"armadillo",name:"Armie Armadillo",species:"Nine-banded Armadillo",emoji:"armadillo",blurb:"Armored for errant golf balls. Rolls through chaos like a lanai tank.",luck:1.12,color:"#8b7355"},{id:"raccoon",name:"Ricky Raccoon",species:"Florida Raccoon",emoji:"🦝",blurb:"Night-market strategist. Can smell a free sample from three villages away.",luck:1.06,color:"#5a5a62"},{id:"pelican",name:"Penny Pelican",species:"Brown Pelican",emoji:"pelican",blurb:"Aerial awareness of every square stage. Dive-bomb vibes, cart-path manners.",luck:1.07,color:"#3a4a5c"},{id:"ibis",name:"Ivy Ibis",species:"White Ibis",emoji:"🦢",blurb:"Lawn-party scout. That curved beak is pure square-side style.",luck:1.09,color:"#f0f0f0"},{id:"otter",name:"Otto Otter",species:"River Otter",emoji:"🦦",blurb:"Playful line-taker. Treats every roundabout like a waterslide.",luck:1.1,color:"#6b5344"}];function ma(i){return i.emoji==="armadillo"?"🦔":i.emoji==="pelican"?"🐦":i.emoji}function SM(i){return Ls.find(e=>e.id===i)??Ls[0]}function bM(i){const e=Ls.filter(n=>!i.includes(n.id)),t=e.length?e:Ls;return t[Math.floor(Math.random()*t.length)]}const ga={"golf-ball":{type:"golf-ball",name:"Errant Golf Ball",emoji:"⛳",scorePenalty:80,speedMul:.45,duration:1.2,radius:2.2,message:"FORE! Bonked by a Titleist!",color:"#ffffff",scale:1.2},turtle:{type:"turtle",name:"Road Turtle",emoji:"🐢",scorePenalty:120,speedMul:.35,duration:1.6,radius:2.4,message:"You hit a turtle! Shell of a mistake.",color:"#5c8a4a",scale:1.4},alligator:{type:"alligator",name:"Retention Pond Gator",emoji:"🐊",scorePenalty:150,speedMul:.3,duration:1.8,radius:3.2,message:"Gator chomp! Stay out of the ponds!",color:"#2f6f4e",scale:1.8},lightning:{type:"lightning",name:"Florida Lightning",emoji:"⚡",scorePenalty:100,speedMul:.25,duration:1.4,radius:3.6,message:"Lightning strike! Cart electronics fried.",color:"#c8d8f0",scale:1.35},wanderer:{type:"wanderer",name:"Tipsy Wanderer",emoji:"🥴",scorePenalty:140,speedMul:.4,duration:1.5,radius:2.2,message:"Near-miss with a square-night wanderer!",color:"#e85d4c",scale:1.5},cop:{type:"cop",name:"Cart Cop",emoji:"🚓",scorePenalty:200,speedMul:.2,duration:2.4,radius:2.8,message:"Ticket issued! Slow down, hot rod.",color:"#3a5a9a",scale:1.6},"porch-police":{type:"porch-police",name:"Porch Police",emoji:"👴",scorePenalty:60,speedMul:.5,duration:2,radius:2.5,message:`"SLOW DOWN!! This isn't Daytona!"`,color:"#8b7355",scale:1.5}},wM={alligator:!0,turtle:!0,wanderer:!0,cop:!0,"porch-police":!0,"golf-ball":!0,lightning:!0},Ac={lat:28.88,lon:-81.98},TM=110540,EM=111320*Math.cos(Ac.lat*Math.PI/180),$h=.12;function AM(i,e){return{x:(e-Ac.lon)*EM*$h,z:(i-Ac.lat)*TM*$h}}const RM=[{id:"spanish-springs",name:"Spanish Springs Town Square",shortName:"Spanish Springs",kind:"town-square",lat:28.9404332,lon:-81.9503209,note:"OG southwest plaza · free outdoor bands",theme:"southwest"},{id:"lake-sumter",name:"Sumter Landing",shortName:"Sumter Landing",kind:"town-square",lat:28.9082192,lon:-81.9747144,note:"Lakeside boardwalk · lighthouse · coastal market",theme:"lakeside"},{id:"brownwood",name:"Brownwood Paddock Square",shortName:"Brownwood",kind:"town-square",lat:28.8444857,lon:-82.0221819,note:"Old Florida ranch square · south side",theme:"western"},{id:"eastport",name:"Eastport Town Square",shortName:"Eastport",kind:"town-square",lat:28.9125,lon:-81.928,note:"Mid-century European-American charm · Central Lake",theme:"midcentury"},{id:"sawgrass-grove",name:"Sawgrass Grove",shortName:"Sawgrass Grove",kind:"town-square",lat:28.7898509,lon:-81.9688595,note:"Orange-grove canopy · Market & Boxcar Stage",theme:"modern"},{id:"paradise",name:"Paradise Recreation",shortName:"Paradise",kind:"rec-center",lat:28.9345,lon:-81.9585,theme:"tuscan",note:"Tuscan villa regional complex"},{id:"la-hacienda",name:"La Hacienda Recreation",shortName:"La Hacienda",kind:"rec-center",lat:28.926,lon:-81.962,theme:"spanish"},{id:"lake-miona",name:"Lake Miona Recreation",shortName:"Lake Miona",kind:"rec-center",lat:28.8963356,lon:-81.9803263},{id:"colony-cottage",name:"Colony Cottage Recreation",shortName:"Colony Cottage",kind:"rec-center",lat:28.8661073,lon:-81.9613156},{id:"eisenhower",name:"Eisenhower Recreation",shortName:"Eisenhower",kind:"rec-center",lat:28.8481852,lon:-82.0149853},{id:"rohan",name:"Rohan Recreation",shortName:"Rohan",kind:"rec-center",lat:28.8249475,lon:-81.9716178},{id:"fenney",name:"Fenney Recreation",shortName:"Fenney",kind:"rec-center",lat:28.7960684,lon:-82.0384196},{id:"everglades",name:"Everglades Recreation",shortName:"Everglades",kind:"rec-center",lat:28.8044378,lon:-82.0070714},{id:"savannah",name:"Savannah Recreation",shortName:"Savannah",kind:"rec-center",lat:28.918,lon:-81.955},{id:"mulberry-grove",name:"Mulberry Grove Recreation",shortName:"Mulberry Grove",kind:"rec-center",lat:28.9,lon:-81.945},{id:"laurel-manor",name:"Laurel Manor Recreation",shortName:"Laurel Manor",kind:"rec-center",lat:28.89,lon:-81.99},{id:"seabreeze",name:"SeaBreeze Recreation",shortName:"SeaBreeze",kind:"rec-center",lat:28.875,lon:-81.97},{id:"olympia",name:"Olympia Recreation",shortName:"Olympia",kind:"rec-center",lat:28.905,lon:-81.915}],wn=RM.map(i=>{const e=AM(i.lat,i.lon);return{id:i.id,name:i.name,shortName:i.shortName,kind:i.kind,x:e.x,y:e.z,lat:i.lat,lon:i.lon,note:i.note,theme:i.theme}});function CM(){let i=1/0,e=-1/0,t=1/0,n=-1/0;for(const r of wn)i=Math.min(i,r.x),e=Math.max(e,r.x),t=Math.min(t,r.y),n=Math.max(n,r.y);const s=900;return{minX:i-s,maxX:e+s,minY:t-s,maxY:n+s,width:e-i+s*2,height:n-t+s*2}}const Kt=CM();wn.filter(i=>i.kind==="town-square");wn.filter(i=>i.kind==="rec-center");const ws=[{id:"spanish-springs",name:"Spanish Springs",shortName:"Spanish Springs",blurb:"Original southwest plaza — adobe stucco, red-tile roofs, plaza fountain, and free outdoor-band nights on Main Street.",themeLine:"Spanish colonial · original square",area:"North Villages · 1120 Main Street energy",highlights:["Spanish colonial / southwest plaza architecture","Adobe stucco, viga vibes & terra-cotta roofs","Central fountain plaza & palm-lined walks","Near Sharon L. Morse Performing Arts Center","Nightly outdoor entertainment tradition"],recCenterIds:["paradise","la-hacienda","rohan"],squareLandmarkId:"spanish-springs",emoji:"🏜️",cardGradient:"linear-gradient(135deg, #c45c48 0%, #e8b84a 45%, #1f6b4a 100%)",theme:{skyTop:"#4a7ab0",skyMid:"#e8c48a",skyBottom:"#f5d9a8",fog:"#e8d4b0",grass:"#4a9a58",grassDeep:"#2f7a40",asphalt:"#5a5550",sidewalk:"#e8dcc8",curb:"#c45c48",water:"#3a9ab8",stucco:["#f0e0c8","#e8d4b0","#f5e8d0","#d4c4a8","#f8e8c8"],roof:"#c45c48",roofAlt:"#a84838",plaza:"#e8dcc0",accent:"#e8b84a",landmarkStyle:"southwest"}},{id:"lake-sumter",name:"Sumter Landing",shortName:"Sumter Landing",blurb:"Lakeside market square — lighthouse silhouette, boardwalk pastels, and golden-hour water on Lake Sumter.",themeLine:"Coastal market · lighthouse & boardwalk",area:"Central Villages · 1000 Lake Sumter Landing",highlights:["Lighthouse landmark & waterfront market energy","Northeast seaside / Key West–inspired pastels","Gazebo plaza & boardwalk cart-path feel","Central hub of The Villages cart network","Lake views & marina-town storefronts"],recCenterIds:["lake-miona","laurel-manor","seabreeze","mulberry-grove"],squareLandmarkId:"lake-sumter",emoji:"🗼",cardGradient:"linear-gradient(135deg, #3aa6c9 0%, #7ec8e8 40%, #e8b84a 100%)",theme:{skyTop:"#3a8ec8",skyMid:"#8ec8e8",skyBottom:"#d8f0f8",fog:"#b8dce8",grass:"#3d9b5f",grassDeep:"#2a7a48",asphalt:"#4a5562",sidewalk:"#e0e8e8",curb:"#3aa6c9",water:"#2a90b8",stucco:["#f0f4f8","#e0ecf0","#d0e0e8","#f8f0e8","#c8e0f0"],roof:"#4a7a9a",roofAlt:"#c47848",plaza:"#e8f0f4",accent:"#3aa6c9",landmarkStyle:"lighthouse"}},{id:"brownwood",name:"Brownwood Paddock Square",shortName:"Brownwood",blurb:"Old Florida ranch square — 1800s cattle-country western flair, rustic storefronts, windmills, and paddock energy.",themeLine:"Old West · Florida ranch heritage",area:"South Villages · 2705 W Torch Lake Drive",highlights:["Old World Florida / cattle-hunter heritage","Barn-style & false-front western shops","Windmill, water-tower & paddock vibes","South-side main stage for live bands","Rustic wood tones & cowboy décor"],recCenterIds:["eisenhower","colony-cottage","fenney"],squareLandmarkId:"brownwood",emoji:"🤠",cardGradient:"linear-gradient(135deg, #8b5a2b 0%, #c47848 40%, #e8b84a 100%)",theme:{skyTop:"#5a7a9a",skyMid:"#d4a86a",skyBottom:"#e8d0a0",fog:"#e0c898",grass:"#6a9a48",grassDeep:"#4a7a30",asphalt:"#5a5048",sidewalk:"#d8c8a8",curb:"#8b5a2b",water:"#4a8a78",stucco:["#e8d8c0","#d0b890","#c4a878","#f0e4c8","#b89868"],roof:"#6b4030",roofAlt:"#8b5a2b",plaza:"#d8c8a0",accent:"#c47848",landmarkStyle:"western"}},{id:"eastport",name:"Eastport",shortName:"Eastport",blurb:"Eastern social hub — European-inspired mid-century charm, open plazas, and Art Deco pavilion energy around Central Lake.",themeLine:"Mid-century · European-American charm",area:"East Villages · Central Lake / Morse corridor",highlights:["European-inspired architecture with mid-century touches","Art Deco / pavilion plazas (no Old West or Key West)","Open lake-adjacent gathering energy","Near Olympia Rec & eastern cart paths","Newest full square lifestyle hub"],recCenterIds:["savannah","mulberry-grove","olympia"],squareLandmarkId:"eastport",emoji:"🏛️",cardGradient:"linear-gradient(135deg, #5a7a9a 0%, #e8b84a 50%, #e85d4c 100%)",theme:{skyTop:"#5a8ab8",skyMid:"#b0c8d8",skyBottom:"#f0e8d8",fog:"#d0dce8",grass:"#48a060",grassDeep:"#308048",asphalt:"#4a5058",sidewalk:"#e8e4dc",curb:"#5a7a9a",water:"#4890b0",stucco:["#f8f0e8","#e8e0d0","#d8d0c0","#f0e8d8","#c8d0d8"],roof:"#5a6a7a",roofAlt:"#e85d4c",plaza:"#ece8e0",accent:"#e8b84a",landmarkStyle:"midcentury"}},{id:"sawgrass-grove",name:"Sawgrass Grove",shortName:"Sawgrass Grove",blurb:"Orange-grove canopy & Market food hall — Boxcar Stage nights, golf-adjacent greens, and modern SE Florida gathering energy.",themeLine:"Citrus canopy · Market & Boxcar Stage",area:"Southeast Villages · 766 Marilee Place",highlights:["Orange grove–inspired canopy & open-air Market","Boxcar Stage free live entertainment","Golf shop / Southern Oaks adjacent lifestyle","Modern Florida greens & multi-use plaza","Newest SE cart-path social loop"],recCenterIds:["everglades","fenney","olympia"],squareLandmarkId:"sawgrass-grove",emoji:"🍊",cardGradient:"linear-gradient(135deg, #1f6b4a 0%, #3aa6c9 50%, #e8b84a 100%)",theme:{skyTop:"#3a90b8",skyMid:"#90d0b0",skyBottom:"#d8f0d8",fog:"#b8e0c8",grass:"#3d9b5f",grassDeep:"#1f6b4a",asphalt:"#4a5560",sidewalk:"#e0ebe4",curb:"#1f6b4a",water:"#2a98b0",stucco:["#f0f8f4","#e0f0e8","#d0e8d8","#f8fff8","#c8e8d0"],roof:"#3d7a5a",roofAlt:"#4a7a9a",plaza:"#e4f0e8",accent:"#f0a830",landmarkStyle:"modern"}}];function lr(i){return ws.find(e=>e.id===i)??ws[0]}const Ca=[{id:"lanai-learner",name:"Lanai Learner",blurb:"Sunday drivers. They wave a lot and miss a few turns. Perfect for first cart-path laps.",emoji:"🪑",aiSkillMin:.72,aiSkillMax:.84,roadGrip:.55,lookAheadMin:10,lookAheadMax:16,cornerCare:.35,rubberBand:.65,cardGradient:"linear-gradient(135deg, #7ec8e8 0%, #c8e8d0 100%)"},{id:"happy-hour",name:"Happy Hour Hotshot",blurb:"Square-night energy. Solid pack that stays on the path and keeps you honest.",emoji:"🍹",aiSkillMin:.9,aiSkillMax:1.02,roadGrip:.82,lookAheadMin:16,lookAheadMax:24,cornerCare:.62,rubberBand:1,cardGradient:"linear-gradient(135deg, #e8b84a 0%, #e85d4c 100%)"},{id:"turnpike-terror",name:"Turnpike Terror",blurb:"Bridge-bandit pace. Tight lines, early apexes, zero mercy on the multi-modal.",emoji:"🌉",aiSkillMin:1.05,aiSkillMax:1.16,roadGrip:.95,lookAheadMin:22,lookAheadMax:34,cornerCare:.88,rubberBand:1.15,cardGradient:"linear-gradient(135deg, #5a2a28 0%, #c45c48 50%, #e8b84a 100%)"}];function PM(i){return Ca.find(e=>e.id===i)??Ca[1]}const gt=8.5,Wi=1.1,Ba=2.4,un=gt+Wi+Ba+10,bt=gt+Wi+Ba+.8,Hi=gt+Wi+Ba+2.2,_a=3,ru=7.2;function di(i,e){return Math.hypot(e.x-i.x,e.y-i.y)}function au(i){return function(){let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}let nn=[],Mr=[],In=[],Ai=[];const Ms=1.6,ir=1.1,Rc=3.4,ou=1.1,xa=Ms+ir+Rc+ou;function cu(i,e){const t=((i+e)%xa+xa)%xa;return t<Ms?0:t<Ms+ir?(t-Ms)/ir:t<Ms+ir+Rc?1:1-(t-(Ms+ir+Rc))/ou}function Sr(i,e){let t=e-i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function an(i,e){return Math.atan2(e.y-i.y,e.x-i.x)}function Ro(i,e){if(i.length<3)return i.map(d=>({...d}));const t=i.length,n=[];let s=0;for(let d=0;d<t;d++){const u=di(i[d],i[(d+1)%t]);n.push(u),s+=u}if(s<e*4)return i.map(d=>({...d}));const r=[],a=Math.max(48,Math.round(s/e)),o=s/a;let c=0,l=0,h=0;for(let d=0;d<a;d++){for(h=d*o;l+n[c]<h-1e-9;)l+=n[c],c=(c+1)%t;const u=h-l,f=n[c]>1e-9?u/n[c]:0,g=i[c],_=i[(c+1)%t];r.push({x:g.x+(_.x-g.x)*f,y:g.y+(_.y-g.y)*f})}return r}function IM(i,e,t){const n=i.length;let s=0;for(let r=0;r<t;r++){const a=i[(e+r-1+n)%n],o=i[(e+r)%n],c=i[(e+r+1)%n];s+=Math.abs(Sr(an(a,o),an(o,c)))}return s}function LM(i,e=18){const t=i.length;if(t<e+2)return 0;let n=0,s=1/0;for(let r=0;r<t;r++){const a=IM(i,r,e);a<s&&(s=a,n=r)}return(n+Math.floor(e/3))%t}const bi=85;function DM(i){let e=0;const t=i.length;for(let n=0;n<t;n++){const s=Math.abs(lu(i,n));s>e&&(e=s)}return e*180/Math.PI}function lu(i,e){const t=i.length,n=i[(e-1+t)%t],s=i[e],r=i[(e+1)%t];return Sr(an(n,s),an(s,r))}function NM(i,e,t,n){const s=Math.min(t,bi),r=Math.min(e,s-1);let a=Array.from({length:i},()=>r+n()*(s-r));for(let c=0;c<60;c++){const l=a.reduce((d,u)=>d+u,0)||1;a=a.map(d=>d/l*360);let h=!1;if(a=a.map(d=>d<r?(h=!0,r):d>s?(h=!0,s):d),!h){const u=360-a.reduce((g,_)=>g+_,0);if(Math.abs(u)<.05)break;const f=u/i;a=a.map(g=>Math.min(s,Math.max(r,g+f)))}}a=a.map(c=>Math.min(s,Math.max(r,c)));const o=a.reduce((c,l)=>c+l,0)||1;return a=a.map(c=>c/o*360),a.map(c=>Math.min(s,Math.max(r,c)))}function UM(i,e,t,n,s){const r=i.length,a=[];let o=t;for(let c=0;c<r;c++){const l=e*(.94+s()*.12);a.push({x:Math.cos(o)*l,y:Math.sin(o)*l*n}),o+=i[c]*Math.PI/180}return a}function Cc(i,e){let t=i.map(n=>({...n}));for(let n=0;n<e;n++){const s=t.length,r=[];for(let a=0;a<s;a++){const o=t[a],c=t[(a+1)%s];r.push({x:o.x*.75+c.x*.25,y:o.y*.75+c.y*.25}),r.push({x:o.x*.25+c.x*.75,y:o.y*.25+c.y*.75})}t=r}return t}function Ui(i,e){const t=e*Math.PI/180;let n=i.map(s=>({x:s.x,y:s.y,elev:s.elev}));for(let s=0;s<40;s++){const r=n.length;if(r<4)break;let a=!1;const o=[];for(let h=0;h<r;h++){const d=n[(h-1+r)%r],u=n[h],f=n[(h+1)%r],g=Sr(an(d,u),an(u,f)),_=Math.abs(g);if(_<=t+1e-4){o.push({...u});continue}a=!0;const m=di(d,u),p=di(u,f),y=_/2,A=Math.tan(Math.min(y,Math.PI/2-.05)),M=Math.min(m*.45,p*.45,18,12*A+2),T=an(d,u),b=an(u,f),R={x:u.x-Math.cos(T)*M,y:u.y-Math.sin(T)*M},x={x:u.x+Math.cos(b)*M,y:u.y+Math.sin(b)*M},w=Math.max(2,Math.ceil(_/t));for(let I=0;I<=w;I++){const P=I/w,S={x:u.x*.55+(R.x+x.x)*.225,y:u.y*.55+(R.y+x.y)*.225},L=1-P;o.push({x:L*L*R.x+2*L*P*S.x+P*P*x.x,y:L*L*R.y+2*L*P*S.y+P*P*x.y})}}const c=o.length,l=[];for(let h=0;h<c;h++){const d=o[(h-1+c)%c],u=o[h],f=o[(h+1)%c];l.push({x:d.x*.15+u.x*.7+f.x*.15,y:d.y*.15+u.y*.7+f.y*.15,elev:u.elev})}if(n=l,!a)break}for(let s=0;s<25;s++){const r=n.length;let a=!1;const o=[];for(let c=0;c<r;c++){const l=n[c],h=n[(c+1)%r];o.push(l),Math.abs(lu(n,c))>t&&(a=!0,o.push({x:(l.x+h.x)*.5,y:(l.y+h.y)*.5}))}if(n=o,!a)break}return hu(n,1.1)}function FM(i,e=Date.now()){const t=au(e>>>0),n=lr(i),s=wn.find(y=>y.id===n.squareLandmarkId),r=s?.x??0,a=s?.y??0,o=14+Math.floor(t()*6),c=NM(o,14,38,t),l=175+t()*55,h=.82+t()*.28,d=t()*Math.PI*2;let u=UM(c,l,d,h,t),f=0,g=0;for(const y of u)f+=y.x,g+=y.y;f/=u.length,g/=u.length;for(const y of u)y.x=r+(y.x-f),y.y=a+(y.y-g);for(let y=0;y<u.length;y++){if(y%3!==0)continue;const A=u[y].x-r,M=u[y].y-a,T=Math.hypot(A,M)||1,b=1+.08+t()*.14;u[y]={x:r+A/T*T*b,y:a+M/T*T*b}}let _=Cc(u,2);_=Cc(_,1),_=Ro(_,5),_=hu(_,1.2),_=Ui(_,bi),_=Ro(_,5),_=Ui(_,bi);const m=3+Math.floor(t()*3);_=Kh(_,m,t),_=Ui(_,bi),_=Ro(_,5),_=Ui(_,bi),DM(_)>90&&(console.warn("[track] turn > 90° detected; regenerating safe regular loop"),_=BM(r,a,170+t()*30,16),_=Ui(_,bi),In=[],_=Kh(_,3,t),_=Ui(_,bi));const p=LM(_,14);return p>0&&(_=[..._.slice(p),..._.slice(0,p)]),_=Ui(_,bi),zM(_,t),kM(_,t),_}function Kh(i,e,t){In=[];const n=i.length;if(n<60||e<1)return i;const s=Math.max(8,Math.floor(n*.06)),r=n-s*2;if(r<e*10)return i;const a=[];for(let c=0;c<e;c++){const l=s+Math.floor((c+.5)/e*r),h=Math.floor((t()-.5)*(r/e)*.35);a.push(Math.max(s,Math.min(n-s-1,l+h)))}a.sort((c,l)=>l-c);let o=i.map(c=>({x:c.x,y:c.y,elev:c.elev}));for(const c of a){const l=o[Math.min(c,o.length-1)];if(In.some(u=>Math.hypot(u.x-l.x,u.y-l.y)<u.radius*3.2))continue;const h=18+t()*10,d=OM(o,c,h,t);o=d.path,In.push(d.site)}return o}function OM(i,e,t,n){const s=i.length,r=(e%s+s)%s,a=i[r],o=i[(r-3+s)%s],c=i[(r+3)%s],l=an(o,c),h=a.x,d=a.y,u=l-Math.PI/2,f=Math.PI*2*(.78+n()*.14),g=Math.max(22,Math.ceil(f*t/4.2)),_=[];for(let y=0;y<=g;y++){const A=y/g,M=u+f*A;_.push({x:h+Math.cos(M)*t,y:d+Math.sin(M)*t})}const m=y=>Math.hypot(y.x-h,y.y-d)>t*.92,p=[];for(let y=0;y<r;y++)m(i[y])&&p.push({...i[y]});for(const y of _)p.push(y);for(let y=r;y<s;y++)m(i[y])&&p.push({...i[y]});return p.length<24?{path:i,site:{x:h,y:d,radius:t,islandRadius:t*.48}}:{path:p,site:{x:h,y:d,radius:t,islandRadius:t*(.42+n()*.08)}}}const Zh=["Residents","Village Gate","Cart Path","Guest Lane","Neighborhood","Welcome","HOA Entry","Private Rd"];function kM(i,e){Ai=[];const t=i.length;if(t<50)return;const n=[0];for(let o=0;o<t;o++)n.push(n[o]+di(i[o],i[(o+1)%t]));const s=n[t]||1,r=3+Math.floor(e()*3),a=[];for(let o=0;o<r;o++){let c=Math.floor((o+.5)/r*t)%t,l=-1/0;const h=Math.floor(t/r),d=Math.floor(o/r*t);for(let _=0;_<h;_++){const m=(d+_)%t,p=n[m]/s;if(p<.1||p>.92||a.some(R=>Math.abs(R-p)<.12))continue;const y=i[m];if((y.elev??0)>.8||In.some(R=>Math.hypot(R.x-y.x,R.y-y.y)<R.radius+14))continue;const A=i[(m-2+t)%t],M=i[(m+2)%t],b=2.5-Math.abs(Sr(an(A,y),an(y,M)))*4+e()*.25;b>l&&(l=b,c=m)}const u=i[c],f=i[(c+1)%t],g=n[c]/s;a.push(g),Ai.push({x:u.x,y:u.y,angle:an(u,f),dist:n[c],phase:e()*xa,label:Zh[Math.floor(e()*Zh.length)]})}}function BM(i,e,t,n){const s=[];for(let r=0;r<n;r++){const a=r/n*Math.PI*2;s.push({x:i+Math.cos(a)*t,y:e+Math.sin(a)*t*.88})}return Cc(s,2)}function zM(i,e){Mr=[];const t=i.length;if(t<40)return;const n=[0];for(let o=0;o<t;o++)n.push(n[o]+di(i[o],i[(o+1)%t]));const s=n[t]||1,r=2+(e()>.45?1:0),a=[];for(let o=0;o<r;o++){let c=Math.floor((o+.35)/r*t)%t,l=-1/0;const h=Math.floor(t/r),d=Math.floor(o/r*t);for(let y=0;y<h;y++){const A=(d+y)%t,M=n[A]/s;if(M<.08||M>.94||a.some(I=>Math.abs(I-M)<.18))continue;const T=i[A];if(In.some(I=>Math.hypot(I.x-T.x,I.y-T.y)<I.radius+20))continue;const b=i[(A-2+t)%t],R=i[(A+2)%t],w=2-Math.abs(Sr(an(b,i[A]),an(i[A],R)))*3+e()*.2;w>l&&(l=w,c=A)}const u=n[c]/s;a.push(u);const f=42+e()*14,g=ru*(.95+e()*.08),_=n[c];for(let y=0;y<t;y++){let A=Math.abs(n[y]-_);if(A=Math.min(A,s-A),A>=f)continue;const M=A/f,T=Math.cos(M*Math.PI/2),b=g*T*T;i[y].elev=Math.max(i[y].elev??0,b)}const m=i[c],p=i[(c+1)%t];Mr.push({x:m.x,y:m.y,angle:an(m,p),dist:_,peakElev:g,halfSpan:f})}for(const o of i)o.elev===void 0&&(o.elev=0)}function hu(i,e){if(i.length<4)return i;const t=[{...i[0]}];for(let n=1;n<i.length;n++){const s=t[t.length-1];di(s,i[n])>=e&&t.push({...i[n]})}return t.length>2&&di(t[t.length-1],t[0])<e&&t.pop(),t}function du(i,e){return Mr=[],In=[],Ai=[],nn=FM(i,e??Date.now()^Math.random()*1e9),nn}nn.length||du("spanish-springs",12648430);function GM(i=5){const e=nn,t=[];let n=0;for(let s=0;s<e.length;s++){const r=e[s],a=e[(s+1)%e.length],o=di(r,a),c=Math.max(1,Math.ceil(o/i)),l=r.elev??0,h=a.elev??0;for(let d=0;d<c;d++){const u=d/c,f=r.x+(a.x-r.x)*u,g=r.y+(a.y-r.y)*u,_=l+(h-l)*u,m=Math.atan2(a.y-r.y,a.x-r.x);t.push({x:f,y:g,angle:m,dist:n+o*u,segment:s,elev:_})}n+=o}if(t.length>4){const s=t.map(r=>r.angle);for(let r=0;r<t.length;r++){const a=t[(r-1+t.length)%t.length].angle,o=t[r].angle,c=t[(r+1)%t.length].angle,l=Math.cos(a)+Math.cos(o)*2+Math.cos(c),h=Math.sin(a)+Math.sin(o)*2+Math.sin(c);s[r]=Math.atan2(h,l)}for(let r=0;r<t.length;r++)t[r].angle=s[r]}return t}function HM(i){if(!i.length)return 1;const e=i[i.length-1];return e.dist+di(e,i[0])}function vs(i,e,t){let n=0,s=1/0;const r=Math.max(1,Math.floor(i.length/400));for(let c=0;c<i.length;c+=r){const l=i[c],h=(l.x-e)**2+(l.y-t)**2;h<s&&(s=h,n=c)}const a=Math.max(0,n-r*2),o=Math.min(i.length-1,n+r*2);for(let c=a;c<=o;c++){const l=i[c],h=(l.x-e)**2+(l.y-t)**2;h<s&&(s=h,n=c)}return{sample:i[n],index:n,distToRoad:Math.sqrt(s)}}function Jh(i,e,t,n,s=.14){const r=i.length;if(!r)return{sample:{x:0,y:0,angle:0,dist:0,segment:0,elev:0},index:0,distToRoad:0};const a=Math.max(48,Math.floor(r*s));let o=(n%r+r)%r,c=1/0;for(let d=-a;d<=a;d++){const u=((n+d)%r+r)%r,f=i[u],g=(f.x-e)**2+(f.y-t)**2;g<c&&(c=g,o=u)}const l=Math.sqrt(c),h=vs(i,e,t);return h.distToRoad+10<l?h:{sample:i[o],index:o,distToRoad:l}}function uu(i,e){let t=1/0;const n=nn;for(let s=0;s<n.length;s++){const r=n[s],a=n[(s+1)%n.length],o=VM(i,e,r.x,r.y,a.x,a.y);o<t&&(t=o)}return t}function VM(i,e,t,n,s,r){const a=s-t,o=r-n,c=i-t,l=e-n,h=a*a+o*o||1;let d=(c*a+l*o)/h;d=Math.max(0,Math.min(1,d));const u=t+a*d,f=n+o*d;return Math.hypot(i-u,e-f)}function ct(i,e,t){return uu(i,e)>=t}function WM(i=12648430){const e=[],t=au(i>>>0),n=nn;if(!n.length)return e;let s=1/0,r=-1/0,a=1/0,o=-1/0;for(const l of n)s=Math.min(s,l.x),r=Math.max(r,l.x),a=Math.min(a,l.y),o=Math.max(o,l.y);const c=90;s-=c,r+=c,a-=c,o+=c;for(const l of wn.filter(h=>h.kind==="town-square"))if(!(l.x<s||l.x>r||l.y<a||l.y>o)){ct(l.x,l.y,gt+2)&&e.push({x:l.x,y:l.y,r:38,kind:"plaza"});for(let h=0;h<10;h++){const d=t()*Math.PI*2,u=l.x+Math.cos(d)*(48+t()*20),f=l.y+Math.sin(d)*(48+t()*20);if(ct(u,f,un)){e.push({x:u,y:f,r:22,kind:"parking"});break}}}for(let l=0;l<18;l++){const h=Math.floor(t()*n.length),d=n[h],u=n[(h+1)%n.length],f=Math.atan2(u.y-d.y,u.x-d.x)+Math.PI/2,g=t()>.5?1:-1,_=un+16+t()*40,m=d.x+Math.cos(f)*_*g,p=d.y+Math.sin(f)*_*g,y=12+t()*18;ct(m,p,y+bt)&&e.push({x:m,y:p,r:y,kind:"pond"})}for(let l=0;l<10;l++){const h=Math.floor(t()*n.length),d=n[h],u=n[(h+1)%n.length],f=Math.atan2(u.y-d.y,u.x-d.x)+Math.PI/2,g=t()>.5?1:-1,_=un+30+t()*40,m=d.x+Math.cos(f)*_*g,p=d.y+Math.sin(f)*_*g,y=30+t()*28;ct(m,p,y*.55+bt)&&e.push({x:m,y:p,r:y,kind:"golf"})}for(let l=0;l<n.length;l+=2){const h=n[l],d=n[(l+1)%n.length],u=Math.atan2(d.y-h.y,d.x-h.x)+Math.PI/2;for(const f of[-1,1]){const g=Hi+1.5+t()*2;{const _=h.x+Math.cos(u)*g*f,m=h.y+Math.sin(u)*g*f;ct(_,m,Hi)&&l%4===0&&e.push({x:_,y:m,r:6+t()*4,kind:"palm-grove"})}for(const _ of[24,36,50,68]){if(t()>.78&&_>40)continue;const m=(t()-.5)*3,p=h.x+Math.cos(u)*(_+m)*f,y=h.y+Math.sin(u)*(_+m)*f;!ct(p,y,un)||wn.some(M=>Math.hypot(M.x-p,M.y-y)<40)||e.push({x:p,y,r:9+t()*10,kind:t()>.88?"palm-grove":"houses"})}}}for(let l=0;l<90;l++){const h=s+t()*(r-s),d=a+t()*(o-a),u=uu(h,d);u<un||u>120&&t()>.35||wn.some(g=>Math.hypot(g.x-h,g.y-d)<48)||e.push({x:h,y:d,r:12+t()*18,kind:t()>.8?"palm-grove":"houses"})}return e}function jh(i,e=0){const t=i[Math.min(5,i.length-1)],n=Math.cos(t.angle+Math.PI/2),s=Math.sin(t.angle+Math.PI/2),r=(e-1.5)*3;return{x:t.x+n*r,y:t.y+s*r,angle:t.angle}}const sr=8,XM=3;function Co(i){return i==="hotrod"?"fireball":i==="evolution"?"loofah":"golf-ball"}function ki(i){return i==="fireball"?"Fireball":i==="loofah"?"Loofah":"Golf ball"}function al(i){return i==="fireball"?"🔥":i==="loofah"?"🧽":"⛳"}class qM{constructor(e){this.config=e;const t=(Date.now()^Math.random()*2147483647)>>>0;this.areaId=e.areaId,this.difficulty=PM(e.difficultyId);const n=lr(e.areaId);this.areaName=n.shortName,du(e.areaId,t),this.samples=GM(5),this.decor=WM(t^2654435769),this.totalLen=HM(this.samples),this.playerAmmo=Co(e.cartId),this.ponds=this.decor.filter(s=>s.kind==="pond").map(s=>({x:s.x,y:s.y,r:s.r})),this.buildSolids(),this.spawnAmmoPickups(),this.spawnRacers();for(let s=0;s<6;s++)this.spawnHazardAhead(70+s*55,s%2===0);this.spawnTimer=2.2}config;samples;decor;solids=[];ponds=[];ammoPickups=[];totalLen;racers=[];hazards=[];projectiles=[];events=[];time=0;countdown=3.6;running=!1;finished=!1;hazardId=1;solidId=1;projId=1;pickupId=1;spawnTimer=0;nearbyLandmark=null;upcomingHazard=null;playerAmmo;areaId;areaName;difficulty;spawnAmmoPickups(){const e=["golf-ball","fireball","loofah"];let t=0;for(let n=12;n<this.samples.length;n+=28){const s=this.samples[n],r=Math.cos(s.angle+Math.PI/2),a=Math.sin(s.angle+Math.PI/2),o=(Math.floor(n/28)%2===0?1:-1)*2.2,c=e[t%e.length];t++,this.ammoPickups.push({id:this.pickupId++,x:s.x+r*o,y:s.y+a*o,kind:c,active:!0,phase:Math.random()*Math.PI*2,respawnIn:0})}}buildSolids(){for(const e of this.decor)if(e.kind==="houses"){if(vs(this.samples,e.x,e.y).distToRoad<gt+8)continue;this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:Math.max(2.4,Math.min(3.8,e.r*.22)),kind:"house",destroyed:!1})}else if(e.kind==="palm-grove"){if(vs(this.samples,e.x,e.y).distToRoad<gt+5)continue;this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:1.6,kind:"prop",destroyed:!1})}for(const e of wn){if(vs(this.samples,e.x,e.y).distToRoad<gt+6)continue;const n=e.kind==="town-square"?5.5:e.kind==="rec-center"?4.5:2.5;this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:n,kind:"landmark",destroyed:!1})}for(const e of In)this.solids.push({id:this.solidId++,x:e.x,y:e.y,radius:Math.max(3.5,e.islandRadius*.92),kind:"island",destroyed:!1});for(let e=0;e<Ai.length;e++){const t=Ai[e];this.solids.push({id:this.solidId++,x:t.x,y:t.y,radius:gt*.92,kind:"gate",destroyed:!1,gateIndex:e})}}spawnRacers(){const e=yM(this.config.cartId),t=SM(this.config.driverId),n=[t.id],s=(this.config.playerName||"").trim().slice(0,20)||"Racer",r=Math.min(5,Math.max(0,this.samples.length-1)),a=this.totalLen>0?Math.min(.2,this.samples[r].dist/this.totalLen):0,o=jh(this.samples,1);this.racers.push({id:"player",name:s,isPlayer:!0,cart:e,driver:t,x:o.x,y:o.y,angle:o.angle,speed:0,steerVel:0,lapProgress:a,lap:0,place:1,finished:!1,finishTime:0,roadIndex:r,effectTimer:0,effectSpeedMul:1,score:0,hazardsHit:0,hazardsDodged:0,checkpoints:new Set,aiTargetIndex:0,aiSkill:1,fireCooldown:0,ammo:sr,inWater:!1,offRoad:!1,spinOutTimer:0,spinVel:0});const c=this.difficulty;for(let l=0;l<4;l++){const h=Is[l%Is.length],d=bM(n);n.push(d.id);const u=jh(this.samples,l===0?0:l+1),f=c.aiSkillMax-c.aiSkillMin;this.racers.push({id:`ai-${l}`,name:d.name,isPlayer:!1,cart:h,driver:d,x:u.x,y:u.y,angle:u.angle,speed:0,steerVel:0,lapProgress:a,lap:0,place:l+2,finished:!1,finishTime:0,roadIndex:r,effectTimer:0,effectSpeedMul:1,score:0,hazardsHit:0,hazardsDodged:0,checkpoints:new Set,aiTargetIndex:4+l*3,aiSkill:c.aiSkillMin+Math.random()*f,fireCooldown:1+Math.random()*2,ammo:sr,inWater:!1,offRoad:!1,spinOutTimer:0,spinVel:0})}}update(e,t){for(const n of this.events)n.ttl-=e;if(this.events=this.events.filter(n=>n.ttl>0),!this.finished){if(this.countdown>0){const n=Math.ceil(this.countdown);this.countdown-=e;const s=Math.ceil(this.countdown);s!==n&&s>0&&this.pushEvent("banner",String(s),void 0,.9),this.countdown<=0&&(this.running=!0,this.pushEvent("banner","GO!",`${this.areaName} · ${ki(this.playerAmmo)}s · Space`,1.8)),this.updateNearbyLandmark(),this.updateHazardWarn();return}this.time+=e,this.spawnTimer-=e,this.spawnTimer<=0&&(this.spawnHazardAhead(80+Math.random()*120,Math.random()>.4),Math.random()<.28&&this.spawnHazardAhead(140+Math.random()*80,!1),this.spawnTimer=2.8+Math.random()*2.6),this.updateHazards(e),this.updateProjectiles(e),this.updateAmmoPickups(e);for(const n of this.racers)n.finished||(n.fireCooldown>0&&(n.fireCooldown-=e),this.updateTerrainFlags(n),n.isPlayer?(this.drivePlayer(n,e,t),(t.consumeFire()||t.state.fire&&n.fireCooldown<=0)&&this.tryFire(n)):(this.driveAI(n,e),n.fireCooldown<=0&&n.ammo>0&&Math.random()<.01&&this.tryFire(n)),this.applyMotion(n,e),this.resolveSolidCollisions(n),this.collectAmmo(n));this.resolveCartCollisions();for(const n of this.racers)n.finished||(this.updateProgress(n,e),this.checkCheckpoints(n),this.checkHazardHits(n));this.updatePlaces(),this.checkRaceOver(),this.updateNearbyLandmark(),this.updateHazardWarn()}}stopEarly(){if(this.finished)return;const e=this.getPlayer();e.finished||(e.finished=!0,e.finishTime=this.time,e.speed=0),this.finished=!0,this.running=!1,this.finalizeScores(),e.score=Math.round(Math.max(0,e.score*.85)),this.pushEvent("banner","Race stopped","Saved to results",2)}updateTerrainFlags(e){const t=vs(this.samples,e.x,e.y);e.offRoad=t.distToRoad>=gt+1.2,e.inWater=!1;for(const n of this.ponds)if(Math.hypot(e.x-n.x,e.y-n.y)<n.r*.92){e.inWater=!0;break}}tryFire(e){if(e.fireCooldown>0||e.finished)return;if(e.ammo<=0){e.isPlayer&&this.pushEvent("toast","Out of ammo!","Drive over a recharge pad",1.4),e.fireCooldown=.4;return}const t=Co(e.cart.id),n=t==="fireball"?92:t==="loofah"?78:88,s=2.6;this.projectiles.push({id:this.projId++,x:e.x+Math.cos(e.angle)*s,y:e.y+Math.sin(e.angle)*s,vx:Math.cos(e.angle)*n,vy:Math.sin(e.angle)*n,life:2.2,kind:t,ownerId:e.id,radius:t==="loofah"?1.15:t==="fireball"?1.05:.75,spin:(Math.random()-.5)*14}),e.ammo-=1,e.fireCooldown=t==="fireball"?.55:t==="loofah"?.7:.48}updateAmmoPickups(e){for(const t of this.ammoPickups)t.phase+=e*3,!t.active&&t.respawnIn>0&&(t.respawnIn-=e,t.respawnIn<=0&&(t.active=!0,t.respawnIn=0))}collectAmmo(e){const t=Co(e.cart.id);for(const n of this.ammoPickups)if(!(!n.active||n.kind!==t)&&Math.hypot(n.x-e.x,n.y-e.y)<2.8){if(e.ammo>=sr)continue;const s=e.ammo;e.ammo=Math.min(sr,e.ammo+XM),n.active=!1,n.respawnIn=12,e.isPlayer&&this.pushEvent("toast",`${al(t)} Ammo recharged!`,`${s} → ${e.ammo} ${ki(t)}s`,1.5)}}updateProjectiles(e){for(const t of this.projectiles){t.life-=e,t.x+=t.vx*e,t.y+=t.vy*e,t.spin+=e*(t.kind==="golf-ball"?18:t.kind==="loofah"?10:6);for(const n of this.hazards)if(n.active&&Math.hypot(n.x-t.x,n.y-t.y)<t.radius+ga[n.type].radius){n.active=!1,t.life=0;const s=this.racers.find(r=>r.id===t.ownerId);s?.isPlayer&&(s.score+=90,s.hazardsDodged+=1,this.pushEvent("toast",`${ki(t.kind)} hit!`,`+90 · ${ga[n.type].name} cleared`,1.4));break}if(!(t.life<=0)){for(const n of this.solids)if(!(n.destroyed||n.kind==="landmark"||n.kind==="gate"||n.kind==="island")&&Math.hypot(n.x-t.x,n.y-t.y)<t.radius+n.radius){n.destroyed=!0,t.life=0;const s=this.racers.find(r=>r.id===t.ownerId);s?.isPlayer&&(s.score+=60,this.pushEvent("toast","Obstacle obliterated!",`+60 · ${ki(t.kind)}`,1.3));break}if(!(t.life<=0)){for(const n of this.racers)if(!(n.id===t.ownerId||n.finished)&&Math.hypot(n.x-t.x,n.y-t.y)<t.radius+1.5){this.applySpinOut(n,t.kind),t.life=0;const s=this.racers.find(r=>r.id===t.ownerId);s?.isPlayer?(s.score+=40,this.pushEvent("toast","Rival tagged!",`+40 · ${ki(t.kind)}`,1.2)):n.isPlayer&&this.pushEvent("toast","Spin out!",`${ki(t.kind)} from a rival`,1.4);break}}}}this.projectiles=this.projectiles.filter(t=>t.life>0)}resolveSolidCollisions(e){const s=vs(this.samples,e.x,e.y).distToRoad<gt+1.2;for(const r of this.solids){if(r.destroyed)continue;if(r.kind==="gate"){if(r.gateIndex==null)continue;const p=Ai[r.gateIndex];if(!p||cu(this.time,p.phase)>=.55)continue}if(s&&r.kind!=="prop"&&r.kind!=="gate"&&r.kind!=="island")continue;const a=e.x-r.x,o=e.y-r.y,c=Math.hypot(a,o),l=r.radius+1.35;if(c>=l||c<1e-5)continue;const h=a/c,d=o/c,u=l-c,f=Math.min(u,1.8);e.x+=h*f,e.y+=d*f;const g=Math.cos(e.angle)*e.speed,_=Math.sin(e.angle)*e.speed,m=g*h+_*d;if(m<0){const p=g-m*h,y=_-m*d,A=e.speed<0?-1:1,M=Math.hypot(p,y)*.55;M<.8?e.speed=0:(e.speed=M*A,A>0&&M>1.5&&(e.angle=Math.atan2(y,p)))}}}resolveCartCollisions(){for(let n=0;n<this.racers.length;n++)for(let s=n+1;s<this.racers.length;s++){const r=this.racers[n],a=this.racers[s],o=a.x-r.x,c=a.y-r.y,l=Math.hypot(o,c);if(l>=3.1||l<1e-4)continue;const h=o/l,d=c/l,u=3.1-l;r.x-=h*u*.52,r.y-=d*u*.52,a.x+=h*u*.52,a.y+=d*u*.52;const f=Math.cos(r.angle)*r.speed,g=Math.sin(r.angle)*r.speed,_=Math.cos(a.angle)*a.speed,m=Math.sin(a.angle)*a.speed,p=(f-_)*h+(g-m)*d;if(p>=0)continue;const y=-1.42*p/2;let A=f+y*h,M=g+y*d,T=_-y*h,b=m-y*d;const R=-d,x=h,w=Math.min(6,Math.abs(p)*.15);A+=R*w*(r.isPlayer?.7:1),M+=x*w*(r.isPlayer?.7:1),T-=R*w*(a.isPlayer?.7:1),b-=x*w*(a.isPlayer?.7:1);const I=Math.min(r.cart.topSpeed,Math.hypot(A,M)*.88),P=Math.min(a.cart.topSpeed,Math.hypot(T,b)*.88);r.speed=r.speed<0?-Math.min(I,r.cart.topSpeed*.42):I,a.speed=a.speed<0?-Math.min(P,a.cart.topSpeed*.42):P,r.speed>1.2&&(r.angle=Math.atan2(M,A)),a.speed>1.2&&(a.angle=Math.atan2(b,T)),Math.abs(p)>8&&(r.effectTimer=Math.max(r.effectTimer,.35),r.effectSpeedMul=Math.min(r.effectSpeedMul,.55),a.effectTimer=Math.max(a.effectTimer,.35),a.effectSpeedMul=Math.min(a.effectSpeedMul,.55),(r.isPlayer||a.isPlayer)&&this.pushEvent("toast","Cart bump!","Watch the pack",1.2))}}pushEvent(e,t,n,s=1.5){this.events.push({kind:e,text:t,sub:n,ttl:s})}applySpinOut(e,t){const n=t==="fireball"?1.55:t==="loofah"?1.35:1.2,s=t==="fireball"?11:t==="loofah"?9:8;e.spinOutTimer=Math.max(e.spinOutTimer,n),e.spinVel=(Math.random()>.5?1:-1)*(s+Math.random()*4),e.speed*=.28,e.effectTimer=Math.max(e.effectTimer,n),e.effectSpeedMul=Math.min(e.effectSpeedMul,.28),e.steerVel=0}updateSpinOut(e,t){if(e.spinOutTimer<=0){e.spinVel*=Math.exp(-8*t),Math.abs(e.spinVel)<.05&&(e.spinVel=0);return}e.spinOutTimer-=t;const n=Math.max(0,e.spinOutTimer),s=Math.min(1,n/.45);e.angle+=e.spinVel*s*t,e.spinVel*=Math.exp(-1.1*t),e.speed*=Math.exp(-1.4*t),e.spinOutTimer<=0&&(e.spinOutTimer=0,e.spinVel*=.2,e.effectSpeedMul=Math.max(e.effectSpeedMul,.55))}drivePlayer(e,t,n){this.updateSpinOut(e,t);const s=e.cart;let r=s.topSpeed*e.effectSpeedMul*e.driver.luck,a=s.accel,o=r*.42;e.inWater?(r*=.18,o*=.18,a*=.2):e.offRoad&&(r*=s.offRoadGrip,o*=s.offRoadGrip,a*=.42),e.effectTimer>0&&(e.effectTimer-=t,e.effectTimer<=0&&(e.effectSpeedMul=1));const c=e.spinOutTimer>.05,l=c?.12:1,h=n.brakeAmount,d=n.throttleAmount;if(h>.04&&h>=d){const A=h;e.speed>.35?e.speed-=s.accel*2.6*t*A:c||(e.speed-=s.accel*1.35*t*A)}else d>.04?e.speed<0?e.speed+=s.accel*3.2*t*l*d:e.speed+=a*t*l*d:(e.speed>0?e.speed-=s.accel*1.35*t:e.speed<0&&(e.speed+=s.accel*1.5*t),Math.abs(e.speed)<.15&&(e.speed=0));e.speed=Math.max(-o,Math.min(r,e.speed));const u=Math.abs(e.speed),f=Math.min(1,u/Math.max(1,r)),g=s.handling*(.28+f*.5)*l,_=n.steerAxis;let m=0;c||(m=_*g,e.speed<-.2&&(m=-m));const p=Math.abs(_)>.04?6.4:8.2;e.steerVel+=(m-e.steerVel)*Math.min(1,p*t);const y=s.handling*.85;e.steerVel=Math.max(-y,Math.min(y,e.steerVel)),c||(e.angle+=e.steerVel*t)}driveAI(e,t){if(this.updateSpinOut(e,t),e.effectTimer>0&&(e.effectTimer-=t,e.effectTimer<=0&&e.spinOutTimer<=0&&(e.effectSpeedMul=1)),e.spinOutTimer>.08)return;const n=this.difficulty,s=this.getPlayer(),r=s.lap+s.lapProgress,a=e.lap+e.lapProgress,o=r-a,c=n.rubberBand,l=o>.08?1+.08*c+Math.min(.2*c,o*.4*c):o<-.14?.9:1,h=Jh(this.samples,e.x,e.y,e.roadIndex,.16);e.roadIndex=h.index;const d=h.distToRoad<gt+.8;e.offRoad=!d&&!e.inWater;const u=n.lookAheadMax-n.lookAheadMin,f=n.lookAheadMin+Math.floor(u*Math.min(1,Math.max(0,e.aiSkill-.7)/.5)),g=(h.index+f)%this.samples.length,_=this.samples[g],m=e.id.charCodeAt(e.id.length-1)%5,p=(1.15-n.roadGrip*.35)*1.6;let y=(m-2)*(p/2);h.distToRoad>gt*.55&&(y=0);const A=Math.cos(_.angle+Math.PI/2),M=Math.sin(_.angle+Math.PI/2);let T=_.x+A*y,b=_.y+M*y;if(h.distToRoad>1.2){const ae=Math.min(1,n.roadGrip*(.45+h.distToRoad*.08));T=T*(1-ae)+h.sample.x*ae,b=b*(1-ae)+h.sample.y*ae}let x=Math.atan2(b-e.y,T-e.x)-e.angle;for(;x>Math.PI;)x-=Math.PI*2;for(;x<-Math.PI;)x+=Math.PI*2;const w=d?1:1.35+n.roadGrip*.5,I=e.cart.handling*e.aiSkill*(.9+n.roadGrip*.35)*w;e.angle+=Math.max(-I*t,Math.min(I*t,x));let P=1;const S=Math.max(6,Math.floor(f*.55)),L=this.samples[h.index];let N=this.samples[(h.index+S)%this.samples.length].angle-L.angle;for(;N>Math.PI;)N-=Math.PI*2;for(;N<-Math.PI;)N+=Math.PI*2;P=1-Math.min(1,Math.abs(N)/.9)*(.18+n.cornerCare*.42);let B=e.cart.topSpeed*.97*e.aiSkill*e.effectSpeedMul*l*P;e.inWater?B*=.18:e.offRoad&&(B*=e.cart.offRoadGrip*(.55+n.roadGrip*.35));let Z=B;const ie=14+n.roadGrip*10;for(const ae of this.hazards){if(!ae.active)continue;const pe=Math.hypot(ae.x-e.x,ae.y-e.y);if(pe<ie){Z*=pe<7?.55:.8;let Je=Math.atan2(e.y-ae.y,e.x-ae.x)-e.angle;for(;Je>Math.PI;)Je-=Math.PI*2;for(;Je<-Math.PI;)Je+=Math.PI*2;const tt=1.6+n.roadGrip*1.4;e.angle+=Math.max(-tt*t,Math.min(tt*t,Je*(.4+n.roadGrip*.35)))}}for(const ae of this.solids){if(ae.destroyed)continue;const pe=Math.hypot(ae.x-e.x,ae.y-e.y);if(pe<ae.radius+6){let Je=Math.atan2(e.y-ae.y,e.x-ae.x)-e.angle;for(;Je>Math.PI;)Je-=Math.PI*2;for(;Je<-Math.PI;)Je+=Math.PI*2;e.angle+=Math.max(-2.2*t,Math.min(2.2*t,Je*.45)),pe<ae.radius+3&&(Z*=.5)}}Math.hypot(s.x-e.x,s.y-e.y)<12&&a>r-.02&&n.roadGrip>.7&&(Z=Math.max(Z,Math.abs(s.speed)*1.04)),e.speed<Z?e.speed+=e.cart.accel*e.aiSkill*1.2*t:e.speed-=e.cart.accel*.5*t,e.speed=Math.max(0,Math.min(B*1.02,e.speed))}applyMotion(e,t){e.x+=Math.cos(e.angle)*e.speed*t,e.y+=Math.sin(e.angle)*e.speed*t,e.x=Math.max(na.minX,Math.min(na.maxX,e.x)),e.y=Math.max(na.minY,Math.min(na.maxY,e.y))}updateProgress(e,t){const n=this.samples.length;if(!n||this.totalLen<=1)return;const s=Jh(this.samples,e.x,e.y,e.roadIndex,.16),r=e.roadIndex,a=e.lapProgress;e.roadIndex=s.index,e.lapProgress=Math.min(.9999,Math.max(0,s.sample.dist/this.totalLen));const o=e.lapProgress-a,c=r>n*.7&&s.index<n*.3&&(s.index+n-r)%n<n*.35,l=o<-.45;Math.abs(e.speed)>.4&&(l||c)&&a>.55&&(e.lap+=1,e.isPlayer&&e.lap<_a&&this.pushEvent("banner",`Lap ${e.lap+1}`,`${e.lap} of ${_a} complete`,1.4),e.lap>=_a&&!e.finished&&(e.finished=!0,e.finishTime=this.time,e.speed*=.25,e.isPlayer&&this.pushEvent("banner","Finished!","Pull into the lanai",2))),e.isPlayer&&this.running&&(e.score+=Math.max(0,e.speed)*1.8*t)}checkCheckpoints(e){for(const t of wn)if(!(t.kind!=="town-square"&&t.kind!=="rec-center")&&!e.checkpoints.has(t.id)&&Math.hypot(t.x-e.x,t.y-e.y)<35&&(e.checkpoints.add(t.id),e.isPlayer)){const n=t.kind==="town-square"?250:150;e.score+=n,this.pushEvent("checkpoint",t.shortName,`+${n} · ${t.kind==="town-square"?"Town Square":"Rec Center"}`,2)}}nearRoundabout(e,t,n=14){for(const s of In)if(Math.hypot(e-s.x,t-s.y)<s.radius+gt+n)return!0;return!1}spawnHazardAhead(e,t){const n=this.getPlayer(),s=this.totalLen/this.samples.length,r=Math.max(8,Math.floor(e/Math.max(1,s)));let a=(n.roadIndex+r)%this.samples.length,o=this.samples[a];if(this.nearRoundabout(o.x,o.y,16)){let b=!1;for(let R=4;R<48;R+=3){const x=(a+R)%this.samples.length,w=this.samples[x];if(!this.nearRoundabout(w.x,w.y,14)){a=x,o=w,b=!0;break}}if(!b)return}const c=["golf-ball","turtle","alligator","lightning","wanderer","cop","porch-police"],l=[1.3,1.4,1.2,.9,1.1,.85,1.2];let h=l.reduce((b,R)=>b+R,0),d=Math.random()*h,u="turtle";for(let b=0;b<c.length;b++)if(d-=l[b],d<=0){u=c[b];break}const f=Math.cos(o.angle+Math.PI/2),g=Math.sin(o.angle+Math.PI/2),_=t?(Math.random()-.5)*2.5:(Math.random()-.5)*(gt*1.3);let m=o.x+f*_,p=o.y+g*_;if(this.nearRoundabout(m,p,12))return;let y=0,A=0,M=o.angle;if(u==="golf-ball"){const b=Math.random()>.5?1:-1;m=o.x+f*gt*1.8*b,p=o.y+g*gt*1.8*b,y=-f*b*(14+Math.random()*12),A=-g*b*(14+Math.random()*12),M=Math.atan2(A,y)}else if(u==="alligator"){const b=Math.random()>.5?1:-1,R=3.6+Math.random()*2.2;m=o.x+f*(gt+6)*b,p=o.y+g*(gt+6)*b,y=-f*b*R,A=-g*b*R,M=Math.atan2(A,y)}else if(u==="wanderer"||u==="porch-police"){const b=Math.random()>.5?1:-1,R=2+Math.random()*1.4;m=o.x+f*(gt+3.5)*b,p=o.y+g*(gt+3.5)*b,y=-f*b*R,A=-g*b*R,M=Math.atan2(A,y)}else if(u==="turtle"){const b=1.2+Math.random()*1,R=Math.random()>.5?1:-1;y=Math.cos(o.angle)*b*R,A=Math.sin(o.angle)*b*R,M=Math.atan2(A,y)}else if(u==="cop"){M=o.angle+Math.PI;const b=2.5+Math.random()*2;y=Math.cos(M)*b,A=Math.sin(M)*b}this.hazards.push({id:this.hazardId++,type:u,x:m,y:p,vx:y,vy:A,life:u==="lightning"?7:18,maxLife:u==="lightning"?7:18,active:!0,angle:M,phase:Math.random()*Math.PI*2,faceSign:1});const T=this.hazards.filter(b=>b.active);if(T.length>12){T.sort((b,R)=>b.id-R.id);for(let b=0;b<T.length-12;b++)T[b].active=!1}}updateHazards(e){for(const t of this.hazards){if(!t.active)continue;if(t.life-=e,t.x+=t.vx*e,t.y+=t.vy*e,Math.hypot(t.vx,t.vy)>.15&&(t.angle=Math.atan2(t.vy,t.vx)),this.nearRoundabout(t.x,t.y,10)){t.active=!1;continue}t.life<=0&&(t.active=!1)}this.hazards=this.hazards.filter(t=>t.active)}checkHazardHits(e){for(const t of this.hazards){if(!t.active)continue;const n=ga[t.type];Math.hypot(t.x-e.x,t.y-e.y)<n.radius+1.4&&(t.active=!1,e.effectTimer=n.duration,e.effectSpeedMul=n.speedMul,e.speed*=n.speedMul,e.hazardsHit+=1,e.isPlayer&&(e.score=Math.max(0,e.score-n.scorePenalty),this.pushEvent("toast",n.message,`−${n.scorePenalty} pts`,2.4)))}}updatePlaces(){const e=n=>n.finished?1e3+(1e3-n.finishTime):n.lap+n.lapProgress;[...this.racers].sort((n,s)=>e(s)-e(n)).forEach((n,s)=>{n.place=s+1})}checkRaceOver(){const e=this.getPlayer();if(!e.finished)return;const t=this.racers.every(s=>s.finished),n=this.time-e.finishTime;(t||n>8)&&(this.finished=!0,this.running=!1,this.finalizeScores())}finalizeScores(){for(const e of this.racers){const t=e.place===1?1e3:e.place===2?700:e.place===3?450:250,n=e.finished?Math.max(0,500-e.finishTime*1.5):0;e.isPlayer?(e.score+=t+n+e.checkpoints.size*20,e.score=Math.round(e.score)):e.score=Math.round(t+e.lap*200+e.checkpoints.size*50)}}updateNearbyLandmark(){const e=this.getPlayer();let t=null,n=50;for(const s of wn){const r=Math.hypot(s.x-e.x,s.y-e.y);r<n&&(n=r,t=s.shortName)}this.nearbyLandmark=t}updateHazardWarn(){const e=this.getPlayer();let t=null,n=45;for(const s of this.hazards){if(!s.active)continue;let a=Math.atan2(s.y-e.y,s.x-e.x)-e.angle;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;if(Math.abs(a)>1.1)continue;const o=Math.hypot(s.x-e.x,s.y-e.y);o<n&&(n=o,t=s)}this.upcomingHazard=t?"Watch the path!":null}getPlayer(){return this.racers.find(e=>e.isPlayer)}getResult(){const e=this.getPlayer();return{racers:[...this.racers].sort((t,n)=>t.place-n.place),player:e,timeSec:e.finishTime||this.time,score:e.score,areaName:this.areaName}}}const na={minX:Kt.minX+20,maxX:Kt.maxX-20,minY:Kt.minY+20,maxY:Kt.maxY-20},vr={sunset:"#e85d4c",gold:"#e8b84a"},Bi={name:"The Villages Golf Cart Hero",tagline:"Mario Kart energy. Cart-path chaos. Florida edition.",sisterApp:"The Villages Everything App",leaderboard:"Lanai Legends",leaderboardTag:"Screened-in glory. Cart-path bragging rights."},fu="vgch-lanai-legends-v1",ol=15;function Pa(){try{const i=localStorage.getItem(fu);if(!i)return[];const e=JSON.parse(i);return Array.isArray(e)?e.filter(t=>t&&typeof t.score=="number"&&t.playerName).sort((t,n)=>n.score-t.score).slice(0,ol):[]}catch{return[]}}function YM(i){const e=[...i].sort((t,n)=>n.score-t.score).slice(0,ol);return localStorage.setItem(fu,JSON.stringify(e)),e}function $M(i){const e={...i,id:`lb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,date:new Date().toISOString()},t=Pa();return t.push(e),YM(t)}function KM(i){const e=Pa();return e.length<ol?i>0:i>(e[e.length-1]?.score??0)}function Js(){return Bi.leaderboard}function ZM(){const i=localStorage.getItem("vgch-difficulty-id");return i&&Ca.some(e=>e.id===i)?i:"happy-hour"}function JM(){const i=localStorage.getItem("vgch-area-id");return i==="eastwood"?(localStorage.setItem("vgch-area-id","eastport"),"eastport"):i&&ws.some(e=>e.id===i)?i:"spanish-springs"}class jM{root;select={playerName:localStorage.getItem("vgch-player-name")||"",cartId:"yamaha",driverId:"alligator",areaId:JM(),difficultyId:ZM()};handlers;constructor(e,t){this.root=e,this.handlers=t}clear(){this.root.innerHTML=""}showMenu(e){this.clear();const t=Pa().slice(0,5),n=$i(),s=n?`Your cart flies a <strong>${Wh(n)}</strong> supporter flag (highest tip $${n}).`:"Enjoying the chaos? Tip $1, $3, or $5 and earn a colored mascot flag on your cart.",r=e?.donateBanner?`<div class="donate-banner">${$t(e.donateBanner)}</div>`:"";this.root.innerHTML=`
      <div class="screen panel-host">
        <p class="brand-kicker">From the makers of ${Bi.sisterApp}</p>
        <h1>${Bi.name}</h1>
        <p class="tagline">${Bi.tagline}</p>
        ${r}
        <div class="panel">
          <p style="margin:0;color:var(--muted);text-align:center">
            Choose one of <strong>five themed Town Square areas</strong>, pick a cart &amp; Florida critter,
            then race a fresh local loop. Dodge gators, golf balls, and the porch police.
          </p>
          <div class="btn-row">
            <button class="btn-primary" id="btn-play">Pick a Square</button>
            <button class="btn-secondary" id="btn-how">How to Play</button>
            <button class="btn-gold" id="btn-lb">${Js()}</button>
            ${nr()?"":'<button class="btn-sunset" id="btn-donate">Tip the Dev ⛳</button>'}
          </div>
          <div class="help-keys">
            <span class="key"><kbd>W</kbd>/<kbd>↑</kbd> Gas</span>
            <span class="key"><kbd>S</kbd>/<kbd>↓</kbd> Brake / Reverse</span>
            <span class="key"><kbd>A</kbd>/<kbd>←</kbd> Left</span>
            <span class="key"><kbd>D</kbd>/<kbd>→</kbd> Right</span>
            <span class="key"><kbd>Space</kbd> Fire</span>
          </div>
        </div>
        ${nr()?"":`<div class="panel tight donate-teaser" id="menu-donate">
          <div class="donate-teaser-row">
            <img class="donate-mascot-sm" src="${Ke("assets/mascot-logo.jpg")}" alt="Golf-ball mascot" width="72" height="72" />
            <div>
              <h2 style="font-size:1.05rem;margin:0">Buy me a cart-path coffee</h2>
              <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.88rem">${s}</p>
            </div>
          </div>
        </div>`}
        <div class="panel tight" id="menu-lb">
          <h2 style="font-size:1.15rem">🏆 ${Js()}</h2>
          <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.88rem">${Bi.leaderboardTag}</p>
          ${this.renderLeaderboardList(t)}
        </div>
        <p class="footer-note">
          Fan-made whimsical racer · not affiliated with The Villages® ·
          <a href="${Ke("privacy.html")}">Privacy</a>
        </p>
      </div>
    `,this.root.querySelector("#btn-play").addEventListener("click",()=>this.handlers.onStartSelect()),this.root.querySelector("#btn-how").addEventListener("click",()=>this.handlers.onShowHow()),this.root.querySelector("#btn-lb").addEventListener("click",()=>{this.showFullLeaderboard()}),this.root.querySelector("#btn-donate")?.addEventListener("click",()=>{this.handlers.onShowDonate()}),this.root.querySelector("#menu-donate")?.addEventListener("click",()=>{this.handlers.onShowDonate()})}showDonate(e){if(nr()){this.handlers.onBackMenu();return}this.clear();const t=$i(),n=t?`Highest tip on this device: <strong>$${t}</strong> · <span class="flag-pill flag-${t}">${Wh(t)} flag</span> unlocked`:"No tip yet — pick an amount below. Your highest tip keeps the matching flag forever on this browser.",s=e?.notice?`<div class="donate-banner">${$t(e.notice)}</div>`:"";this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">Tip jar · Stripe secure checkout</p>
        <h1>Support Golf Cart Hero</h1>
        <p class="tagline">If you’re enjoying the ride, buy the golf-ball mascot a coffee. Tips use the same Stripe account as ${Bi.sisterApp}.</p>
        ${s}
        <div class="panel donate-panel">
          <div class="donate-hero">
            <img class="donate-mascot" src="${Ke("assets/mascot-logo.jpg")}" alt="Golf-ball mascot from The Villages Everything App" width="160" height="160" />
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
    `;const r=this.root.querySelector("#donate-amounts");r.innerHTML=sl.map(c=>`
        <button type="button" class="donate-amount-card ${t===c.amountUsd?"is-highest":""}" data-amount="${c.amountUsd}" role="listitem">
          <img src="${Ke("assets/mascot-logo.jpg")}" alt="" class="donate-amount-mascot" width="48" height="48" />
          <strong>$${c.amountUsd}</strong>
          <span>${$t(c.label)}</span>
          <em>${$t(c.blurb)}</em>
          <span class="flag-pill flag-${c.amountUsd}">${c.flagName} flag</span>
        </button>`).join("");const a=this.root.querySelector("#donate-error"),o=c=>{r.querySelectorAll("button").forEach(l=>{l.disabled=c})};r.querySelectorAll("[data-amount]").forEach(c=>{c.addEventListener("click",async()=>{const l=Number(c.dataset.amount);if(a.style.display="none",o(!0),c.classList.add("checking-out"),!await cM()){a.textContent="Stripe isn’t configured yet. Add STRIPE_SECRET_KEY to .env.local and restart npm run dev.",a.style.display="block",o(!1),c.classList.remove("checking-out");return}const d=await aM(l);if(d.url){window.location.href=d.url;return}a.textContent=d.error||"Checkout failed",a.style.display="block",o(!1),c.classList.remove("checking-out")})}),this.root.querySelector("#btn-back").addEventListener("click",()=>{this.handlers.onBackMenu()})}showFullLeaderboard(){this.clear();const e=Pa();this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">High scores</p>
        <h1>🏆 ${Js()}</h1>
        <p class="tagline">${Bi.leaderboardTag}</p>
        <div class="panel">
          ${this.renderLeaderboardList(e)}
          <div class="btn-row">
            <button class="btn-primary" id="btn-back">Back</button>
          </div>
        </div>
      </div>
    `,this.root.querySelector("#btn-back").addEventListener("click",()=>this.handlers.onBackMenu())}renderLeaderboardList(e){return e.length?`<ol class="leaderboard">${e.map((t,n)=>{const s=Is.find(o=>o.id===t.cartId)?.shortName??t.cartId,r=Ls.find(o=>o.id===t.driverId),a=r?ma(r):"🏎️";return`<li>
          <span class="rank">#${n+1}</span>
          <div class="who">${$t(t.playerName)} ${a}
            <span>${s} · P${t.place} · ${Po(t.timeSec)}</span>
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
          <p><strong>Controls:</strong> WASD / arrows to drive. <strong>S / ↓</strong> brakes, then reverses. <strong>Space</strong> (or ●) to fire. On phones, tilt left/right to steer, tip the phone forward to go, and tip it back to brake. Tap ● to fire.</p>
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
          </ul>
          <p><strong>Score:</strong> Speed + landmark bonuses − hazard penalties + finish place. Top runs land on the <em>${Js()}</em> board.</p>
          ${nr()?"":"<p><strong>Tips:</strong> From the main menu, tip $1 / $3 / $5 via Stripe. Your highest tip paints a supporter flag on every cart you race — red, blue, or gold — with the golf-ball mascot logo.</p>"}
          <p><strong>Villages flavor:</strong> Every loop has several <strong>roundabouts</strong> and occasional <strong>community gates</strong> that raise before you drive through — just like the real cart paths.</p>
          <div class="btn-row">
            <button class="btn-primary" id="btn-back">Got it</button>
          </div>
        </div>
      </div>
    `,this.root.querySelector("#btn-back").addEventListener("click",()=>this.handlers.onBackMenu())}showAreaSelect(){this.clear();const e=this.select.areaId;this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">Town Square · drive areas</p>
        <h1>Where to Race?</h1>
        <p class="tagline">Each square is its own themed neighborhood loop — with its own real-instrument soundtrack when you race.</p>
        <div class="panel">
          <p class="section-label" style="margin-top:0">Choose a Town Square</p>
          <div class="choice-grid area-grid" id="areas"></div>
          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back</button>
            <button class="btn-primary" id="btn-continue">Choose Cart &amp; Driver</button>
          </div>
        </div>
      </div>
    `;const t=this.root.querySelector("#areas");t.innerHTML=ws.map(n=>{const s=n.highlights.slice(0,3).map(a=>`<li>${$t(a)}</li>`).join(""),r=Ei.getTrack(n.id);return`
      <button type="button" class="choice-card area-card ${n.id===e?"selected":""}" data-area="${n.id}">
        <div class="area-banner" style="background:${n.cardGradient}">
          <span class="area-emoji">${n.emoji}</span>
        </div>
        <div class="title">${$t(n.name)}</div>
        <div class="area-theme-line">${$t(n.themeLine)}</div>
        <div class="sub">${$t(n.blurb)}</div>
        <div class="area-music-line">🎵 ${$t(r.vibe)}</div>
        <ul class="area-highlights">${s}</ul>
      </button>`}).join(""),t.querySelectorAll("[data-area]").forEach(n=>{n.addEventListener("click",()=>{this.select.areaId=n.dataset.area,localStorage.setItem("vgch-area-id",this.select.areaId),this.showAreaSelect()})}),this.root.querySelector("#btn-back").addEventListener("click",()=>{this.handlers.onBackMenu()}),this.root.querySelector("#btn-continue").addEventListener("click",()=>{localStorage.setItem("vgch-area-id",this.select.areaId),this.showSelect()})}showSelect(){this.clear();const e=ws.find(o=>o.id===this.select.areaId)??ws[0];this.root.innerHTML=`
      <div class="screen screen-garage">
        <p class="brand-kicker">Garage · critter paddock</p>
        <h1>Choose Your Ride</h1>
        <div class="panel garage-panel">
          <div class="area-picked">
            <span class="area-picked-emoji">${e.emoji}</span>
            <div>
              <strong>${$t(e.name)}</strong>
              <div class="sub" style="margin:0">${$t(e.themeLine)}</div>
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
              value="${ed(this.select.playerName)}"
              autocomplete="nickname"
              spellcheck="false"
            />
            <p id="name-hint" class="name-hint">This shows on the leaderboard, HUD, and above your cart. Every player should enter their own name.</p>
          </div>

          <p class="section-label">Rival pack skill</p>
          <div class="choice-grid area-grid" id="difficulties"></div>

          <p class="section-label">Golf cart</p>
          <div class="choice-grid" id="carts"></div>

          <p class="section-label">Driver (Florida critters)</p>
          <div class="choice-grid" id="drivers"></div>

          <div class="btn-row">
            <button class="btn-secondary" id="btn-back">Back</button>
            <button class="btn-primary" id="btn-race">Hit the Cart Path</button>
          </div>
        </div>
      </div>
    `;const t=this.root.querySelector("#difficulties");t.innerHTML=Ca.map(o=>`
      <button type="button" class="choice-card ${o.id===this.select.difficultyId?"selected":""}" data-diff="${o.id}">
        <div class="area-banner" style="background:${o.cardGradient}">
          <span class="area-emoji">${o.emoji}</span>
        </div>
        <div class="title">${$t(o.name)}</div>
        <div class="sub">${$t(o.blurb)}</div>
      </button>`).join("");const n=this.root.querySelector("#carts");n.innerHTML=Is.map(o=>`
      <button type="button" class="choice-card cart-photo-card ${o.id===this.select.cartId?"selected":""}" data-cart="${o.id}">
        <img class="cart-ref-thumb cart-photo-thumb" src="${Ke(`assets/carts/refs/${o.id}.jpg`)}" alt="${o.name}" width="200" height="140" />
        <div class="title">${o.emoji} ${o.name}</div>
        <div class="sub">${o.blurb}</div>
        <div class="stat-pills">
          <span class="pill fast">Top ${Math.round(o.topSpeed)}</span>
          <span class="pill accel">Accel ${Math.round(o.accel)}</span>
          <span class="pill handle">Handle ${o.handling.toFixed(1)}</span>
        </div>
      </button>`).join("");const s=this.root.querySelector("#drivers");s.innerHTML=Ls.map(o=>`
      <button type="button" class="choice-card ${o.id===this.select.driverId?"selected":""}" data-driver="${o.id}">
        <span class="emoji">${ma(o)}</span>
        <div class="title">${o.name}</div>
        <div class="sub">${o.species}. ${o.blurb}</div>
      </button>`).join("");const r=this.root.querySelector("#player-name"),a=()=>{this.select.playerName=r.value.slice(0,20),localStorage.setItem("vgch-player-name",this.select.playerName.trim())};r.addEventListener("input",a),r.addEventListener("change",a),this.select.playerName.trim()||setTimeout(()=>r.focus(),50),t.querySelectorAll("[data-diff]").forEach(o=>{o.addEventListener("click",()=>{a(),this.select.difficultyId=o.dataset.diff,localStorage.setItem("vgch-difficulty-id",this.select.difficultyId),this.showSelect()})}),n.querySelectorAll("[data-cart]").forEach(o=>{o.addEventListener("click",()=>{a(),this.select.cartId=o.dataset.cart,this.showSelect()})}),s.querySelectorAll("[data-driver]").forEach(o=>{o.addEventListener("click",()=>{a(),this.select.driverId=o.dataset.driver,this.showSelect()})}),this.root.querySelector("#btn-change-area").addEventListener("click",()=>{a(),this.showAreaSelect()}),this.root.querySelector("#btn-back").addEventListener("click",()=>{a(),this.showAreaSelect()}),this.root.querySelector("#btn-race").addEventListener("click",()=>{a();const o=r.value.trim().slice(0,20);if(o.length<2){r.focus(),r.style.borderColor="var(--sunset)";const c=this.root.querySelector("#name-hint");c&&(c.textContent="Please enter at least 2 characters for your racer name.",c.style.color="var(--sunset)");return}this.select.playerName=o,localStorage.setItem("vgch-player-name",o),localStorage.setItem("vgch-area-id",this.select.areaId),localStorage.setItem("vgch-difficulty-id",this.select.difficultyId),this.handlers.onRace({...this.select})})}showRaceHud(e){this.clear();const t=e?.musicMuted??Ei.isMuted(),n=e?.musicLabel??"Square theme";this.root.innerHTML=`
      <div class="screen hud">
        <div class="hud-top">
          <div class="hud-chip"><span class="label">Area</span><span id="hud-area">—</span></div>
          <div class="hud-chip"><span class="label">Racer</span><span id="hud-name">—</span></div>
          <div class="hud-chip"><span class="label">Place</span><span id="hud-place">1st</span></div>
          <div class="hud-chip"><span class="label">Lap</span><span id="hud-lap">1 / 3</span></div>
          <div class="hud-chip"><span class="label">Score</span><span id="hud-score">0</span></div>
          <div class="hud-chip"><span class="label">Time</span><span id="hud-time">0:00</span></div>
          <div class="hud-chip"><span class="label">Ammo</span><span id="hud-ammo">0/8</span></div>
        </div>
        <div class="hud-music" title="${ed(n)}">
          <span class="hud-music-label" id="hud-music-label">${$t(n)}</span>
          <button type="button" class="btn-music-toggle" id="btn-music-toggle" aria-pressed="${t?"true":"false"}">
            ${t?"🔇 Music":"🔊 Music"}
          </button>
        </div>
        <div class="hud-center">
          <div class="banner" id="hud-banner" style="display:none"></div>
          <div class="banner sub" id="hud-toast" style="display:none"></div>
        </div>
        <div class="mini-map-wrap" title="Track overview">
          <div class="mini-map-label">Map</div>
          <canvas id="minimap" width="168" height="168"></canvas>
        </div>
        <button type="button" class="btn-stop-race" id="btn-stop-race" title="End race early">■ Stop</button>
        <div class="touch-controls" id="touch">
          <div class="touch-pad touch-drive">
            <button class="touch-btn" data-k="left">◀</button>
            <button class="touch-btn" data-k="right">▶</button>
          </div>
          <div class="touch-pad touch-actions">
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
    `,this.root.querySelector("#btn-stop-race").addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),this.handlers.onStopRace()});const s=this.root.querySelector("#btn-music-toggle");s?.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),Ei.unlock();const l=Ei.toggleMute();s.textContent=l?"🔇 Music":"🔊 Music",s.setAttribute("aria-pressed",l?"true":"false")});const r=this.root.querySelector("#touch");(matchMedia("(pointer: coarse)").matches||window.innerWidth<900)&&(r.classList.add("show"),su()&&this.setDrivePadMode("tilt")),this.root.querySelector("#tilt-recenter")?.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),this.handlers.onRecenterTilt();const l=this.root.querySelector("#tilt-hint");l&&(l.classList.add("flash"),window.setTimeout(()=>l.classList.remove("flash"),700))});const o=(c,l)=>{const h=u=>{u.preventDefault(),this.handlers.onTouch(l,!0)},d=u=>{u.preventDefault(),this.handlers.onTouch(l,!1)};c.addEventListener("pointerdown",h),c.addEventListener("pointerup",d),c.addEventListener("pointerleave",d),c.addEventListener("pointercancel",d)};this.root.querySelectorAll("[data-k]").forEach(c=>{o(c,c.dataset.k)})}setDrivePadMode(e){const t=this.root.querySelector(".screen.hud"),n=this.root.querySelector("#touch"),s=this.root.querySelector("#tilt-hint");n&&(n.classList.add("show"),e==="tilt"?(t?.classList.add("tilt-drive"),n.classList.add("tilt-mode"),s&&(s.hidden=!1)):(t?.classList.remove("tilt-drive"),n.classList.remove("tilt-mode"),s&&(s.hidden=!0)))}updateHud(e){const t=this.root.querySelector("#hud-place"),n=this.root.querySelector("#hud-lap"),s=this.root.querySelector("#hud-score"),r=this.root.querySelector("#hud-time"),a=this.root.querySelector("#hud-name"),o=this.root.querySelector("#hud-area"),c=this.root.querySelector("#hud-ammo");if(!t)return;t.textContent=Qh(e.place);const l=Math.min(e.lap+1,e.laps);n.textContent=`${l} / ${e.laps}`,s.textContent=Math.round(e.score).toLocaleString(),r.textContent=Po(e.time),a&&(a.textContent=e.playerName||"—"),o&&(o.textContent=e.areaName||"—"),c&&(c.textContent=e.ammoLabel||"—");const h=this.root.querySelector("#hud-banner"),d=this.root.querySelector("#hud-toast");e.banner?(h.style.display="block",h.textContent=e.banner):h.style.display="none",e.toast?(d.style.display="block",d.textContent=e.toast,d.style.background=e.toast.includes("path")?"rgba(28,36,48,0.72)":"rgba(232,93,76,0.85)"):e.landmark?(d.style.display="block",d.textContent=`📍 ${e.landmark}`,d.style.background="rgba(31,107,74,0.85)"):(d.style.display="none",d.style.background="")}getMiniMapCanvas(){return this.root.querySelector("#minimap")}showResults(e,t){this.clear();const n=e.player,s=KM(e.score),r=e.areaName?` · ${$t(e.areaName)}`:"",a=e.racers.map(c=>`<div class="result-row${c.isPlayer?" you":""}">
          <strong>${Qh(c.place)}</strong>
          <div>${$t(c.name)} ${ma(c.driver)}
            <div style="font-size:0.78rem;color:var(--muted)">${c.cart.shortName}${c.finished?"":" · DNF"}</div>
          </div>
          <strong>${c.isPlayer?e.score.toLocaleString():"—"}</strong>
        </div>`).join("");this.root.innerHTML=`
      <div class="screen">
        <p class="brand-kicker">${s?"New lanai energy":"Race complete"}${r}</p>
        <h1>${n.place===1?"Village Champion!":n.place===2?"Silver Square!":n.place===3?"Bronze Cart Path!":"Finished!"}</h1>
        <p class="tagline">Score <strong>${e.score.toLocaleString()}</strong> · ${Po(e.timeSec)} · ${n.hazardsHit} hazards hit · ${n.checkpoints.size} landmarks</p>
        <div class="panel">
          <h2 style="font-size:1.15rem;margin-bottom:0.25rem">Finishing order</h2>
          <div class="results-grid">${a}</div>
          <div class="btn-row">
            ${t?'<button class="btn-gold" id="btn-submit" disabled>Saved ✓</button>':`<button class="btn-gold" id="btn-submit">Save to ${Js()}</button>`}
            <button class="btn-primary" id="btn-again">Race Again</button>
            <button class="btn-secondary" id="btn-menu">Main Menu</button>
          </div>
        </div>
      </div>
    `,this.root.querySelector("#btn-again").addEventListener("click",()=>this.handlers.onPlayAgain()),this.root.querySelector("#btn-menu").addEventListener("click",()=>this.handlers.onBackMenu());const o=this.root.querySelector("#btn-submit");t||o.addEventListener("click",()=>{$M({playerName:n.name,score:e.score,place:n.place,timeSec:e.timeSec,cartId:n.cart.id,driverId:n.driver.id,laps:n.lap,hazardsHit:n.hazardsHit}),o.disabled=!0,o.textContent="Saved ✓"})}}function Qh(i){return i===1?"1st":i===2?"2nd":i===3?"3rd":`${i}th`}function Po(i){const e=Math.max(0,i),t=Math.floor(e/60),n=Math.floor(e%60),s=Math.floor(e%1*10);return`${t}:${n.toString().padStart(2,"0")}.${s}`}function $t(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ed(i){return $t(i)}const QM={alligator:Ke("assets/hazards/alligator.jpg"),turtle:Ke("assets/hazards/turtle.jpg"),lightning:Ke("assets/hazards/lightning.jpg"),wanderer:Ke("assets/hazards/wanderer.jpg"),cop:Ke("assets/hazards/cop.jpg"),"porch-police":Ke("assets/hazards/porch-police.jpg"),"golf-ball":Ke("assets/hazards/golf-ball.jpg")},pu={alligator:2.8,turtle:1.7,lightning:4.2,wanderer:3.4,cop:2.9,"porch-police":3.5,"golf-ball":1.5},cl=new Map;let mu=!1,ia=null;function ev(i){const e=document.createElement("canvas");e.width=i.naturalWidth||i.width,e.height=i.naturalHeight||i.height;const t=e.getContext("2d");t.drawImage(i,0,0);const n=t.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a+=4){const o=s[a],c=s[a+1],l=s[a+2],h=Math.min(o,c,l),d=Math.max(o,c,l);if(h>235&&d-h<28)s[a+3]=0;else if(h>210&&d-h<35){const u=(h-210)/25;s[a+3]=Math.round(s[a+3]*(1-u))}}t.putImageData(n,0,0);const r=new Na(e);return r.colorSpace=wt,r.needsUpdate=!0,r}function tv(i){return new Promise((e,t)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>e(n),n.onerror=()=>t(new Error(`Failed to load ${i}`)),n.src=i})}function gu(){return ia||(mu=!0,ia=(async()=>{const i=Object.entries(QM);await Promise.all(i.map(async([e,t])=>{try{const n=await tv(t),s=ev(n),r=new La({map:s,transparent:!0,depthWrite:!1,alphaTest:.08,fog:!1});cl.set(e,r)}catch(n){console.warn(`[hazards] sprite load failed for ${e}`,n)}}))})(),ia)}function _u(i){return cl.has(i)}function xu(i){mu||gu();const e=cl.get(i);if(!e)return null;const t=new Kc(e),n=pu[i]??2.5;return t.scale.set(n*1.05,n,1),t.center.set(.5,0),t.position.y=.05,t}const nv=Object.freeze(Object.defineProperty({__proto__:null,HAZARD_SPRITE_HEIGHT:pu,createHazardSprite:xu,hasHazardSprite:_u,loadHazardSprites:gu},Symbol.toStringTag,{value:"Module"}));function td(i,e){if(e===hf)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===vc||e===Cd){let t=i.getIndex();if(t===null){const a=[],o=i.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===vc)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function iv(i){const e=new Map,t=new Map,n=i.clone();return Mu(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Mu(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Mu(i.children[n],e.children[n],t)}class sv extends Fs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new lv(t)}),this.register(function(t){return new hv(t)}),this.register(function(t){return new Mv(t)}),this.register(function(t){return new vv(t)}),this.register(function(t){return new yv(t)}),this.register(function(t){return new uv(t)}),this.register(function(t){return new fv(t)}),this.register(function(t){return new pv(t)}),this.register(function(t){return new mv(t)}),this.register(function(t){return new cv(t)}),this.register(function(t){return new gv(t)}),this.register(function(t){return new dv(t)}),this.register(function(t){return new xv(t)}),this.register(function(t){return new _v(t)}),this.register(function(t){return new av(t)}),this.register(function(t){return new nd(t,nt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new nd(t,nt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Sv(t)})}load(e,t,n,s){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const l=cr.extractUrlBase(e);a=cr.resolveURL(l,this.path)}else a=cr.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Xd(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const a={},o={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===vu){try{a[nt.KHR_BINARY_GLTF]=new bv(e)}catch(d){s&&s(d);return}r=JSON.parse(a[nt.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Fv(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const d=r.extensionsUsed[h],u=r.extensionsRequired||[];switch(d){case nt.KHR_MATERIALS_UNLIT:a[d]=new ov;break;case nt.KHR_DRACO_MESH_COMPRESSION:a[d]=new wv(r,this.dracoLoader);break;case nt.KHR_TEXTURE_TRANSFORM:a[d]=new Tv;break;case nt.KHR_MESH_QUANTIZATION:a[d]=new Ev;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function rv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Nt(i,e,t){const n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const nt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class av{constructor(e){this.parser=e,this.name=nt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const h=new Ue(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],gn);const d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new fa(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new ua(h),l.distance=d;break;case"spot":l=new zp(h),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),zn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class ov{constructor(){this.name=nt.KHR_MATERIALS_UNLIT}getMaterialType(){return si}extendParams(e,t,n){const s=[];e.color=new Ue(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],gn),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,wt))}return Promise.all(s)}}class cv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class lv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ge(r,r)}return Promise.all(s)}}class hv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class dv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class uv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new Ue(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],gn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,wt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class fv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class pv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ue().setRGB(r[0],r[1],r[2],gn),Promise.all(s)}}class mv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IOR}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class gv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ue().setRGB(r[0],r[1],r[2],gn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,wt)),Promise.all(s)}}class _v{constructor(e){this.parser=e,this.name=nt.EXT_MATERIALS_BUMP}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class xv{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Nt(this.parser,e,this.name)!==null?Kn:null}extendMaterialParams(e,t){const n=Nt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class Mv{constructor(e){this.parser=e,this.name=nt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class vv{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}}class yv{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}}class nd{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const c=s.byteOffset||0,l=s.byteLength||0,h=s.count,d=s.byteStride,u=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,d,u,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*d);return a.decodeGltfBuffer(new Uint8Array(f),h,d,u,s.mode,s.filter),f})})}else return null}}class Sv{constructor(e){this.name=nt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==Mn.TRIANGLES&&l.mode!==Mn.TRIANGLE_STRIP&&l.mode!==Mn.TRIANGLE_FAN&&l.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],c={};for(const l in a)o.push(this.parser.getDependency("accessor",a[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),d=h.isGroup?h.children:[h],u=l[0].count,f=[];for(const g of d){const _=new Ye,m=new D,p=new Yn,y=new D(1,1,1),A=new et(g.geometry,g.material,u);for(let M=0;M<u;M++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,M),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,M),c.SCALE&&y.fromBufferAttribute(c.SCALE,M),A.setMatrixAt(M,_.compose(m,p,y));for(const M in c)if(M==="_COLOR_0"){const T=c[M];A.instanceColor=new bc(T.array,T.itemSize,T.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&g.geometry.setAttribute(M,c[M]);lt.prototype.copy.call(A,g),this.parser.assignFinalMaterial(A),f.push(A)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const vu="glTF",js=12,id={JSON:1313821514,BIN:5130562};class bv{constructor(e){this.name=nt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,js),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==vu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-js,r=new DataView(e,js);let a=0;for(;a<s;){const o=r.getUint32(a,!0);a+=4;const c=r.getUint32(a,!0);if(a+=4,c===id.JSON){const l=new Uint8Array(e,js+a,o);this.content=n.decode(l)}else if(c===id.BIN){const l=js+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class wv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=nt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(const h in a){const d=Pc[h]||h.toLowerCase();o[d]=a[h]}for(const h in e.attributes){const d=Pc[h]||h.toLowerCase();if(a[h]!==void 0){const u=n.accessors[e.attributes[h]],f=Ts[u.componentType];l[d]=f.name,c[d]=u.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(d,u){s.decodeDracoFile(h,function(f){for(const g in f.attributes){const _=f.attributes[g],m=c[g];m!==void 0&&(_.normalized=m)}d(f)},o,l,gn,u)})})}}class Tv{constructor(){this.name=nt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Ev{constructor(){this.name=nt.KHR_MESH_QUANTIZATION}}class yu extends Ds{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=s-t,d=(n-t)/h,u=d*d,f=u*d,g=e*l,_=g-l,m=-2*f+3*u,p=f-u,y=1-m,A=p-u+d;for(let M=0;M!==o;M++){const T=a[_+M+o],b=a[_+M+c]*h,R=a[g+M+o],x=a[g+M]*h;r[M]=y*T+A*b+m*R+p*x}return r}}const Av=new Yn;class Rv extends yu{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return Av.fromArray(r).normalize().toArray(r),r}}const Mn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ts={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},sd={9728:Gt,9729:Ht,9984:Sd,9985:oa,9986:er,9987:ii},rd={33071:Hn,33648:Ma,10497:Ri},Io={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Pc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Si={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Cv={CUBICSPLINE:void 0,LINEAR:fr,STEP:ur},Lo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Pv(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new zt({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ci})),i.DefaultMaterial}function Fi(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function zn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Iv(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,h=e.length;l<h;l++){const d=e[l];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const a=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const d=e[l];if(n){const u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;a.push(u)}if(s){const u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;o.push(u)}if(r){const u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;c.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],d=l[1],u=l[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=u),i.morphTargetsRelative=!0,i})}function Lv(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Dv(i){let e;const t=i.extensions&&i.extensions[nt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Do(t.attributes):e=i.indices+":"+Do(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Do(i.targets[n]);return e}function Do(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Ic(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Nv(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Uv=new Ye;class Fv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new rv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new el(this.options.manager):this.textureLoader=new Vp(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Xd(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return Fi(r,o,s),zn(o,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const a=t[s].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(a,o)=>{const c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(const[l,h]of a.children.entries())r(h,o.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[nt.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,a){n.load(cr.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const a=Io[s.type],o=Ts[s.componentType],c=s.normalized===!0,l=new o(s.count*a);return Promise.resolve(new cn(l,a,c))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],c=Io[s.type],l=Ts[s.componentType],h=l.BYTES_PER_ELEMENT,d=h*c,u=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let _,m;if(f&&f!==d){const p=Math.floor(u/f),y="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let A=t.cache.get(y);A||(_=new l(o,p*f,s.count*f/h),A=new Fd(_,f/h),t.cache.add(y,A)),m=new gr(A,c,u%f/h,g)}else o===null?_=new l(s.count*c):_=new l(o,u,s.count*c),m=new cn(_,c,g);if(s.sparse!==void 0){const p=Io.SCALAR,y=Ts[s.sparse.indices.componentType],A=s.sparse.indices.byteOffset||0,M=s.sparse.values.byteOffset||0,T=new y(a[1],A,s.sparse.count*p),b=new l(a[2],M,s.sparse.count*c);o!==null&&(m=new cn(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,x=T.length;R<x;R++){const w=T[R];if(m.setX(w,b[R*c]),c>=2&&m.setY(w,b[R*c+1]),c>=3&&m.setZ(w,b[R*c+2]),c>=4&&m.setW(w,b[R*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const s=this,r=this.json,a=r.textures[e],o=r.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const u=(r.samplers||{})[a.sampler]||{};return h.magFilter=sd[u.magFilter]||Ht,h.minFilter=sd[u.minFilter]||ii,h.wrapS=rd[u.wrapS]||Ri,h.wrapT=rd[u.wrapT]||Ri,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Gt&&h.minFilter!==Ht,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const a=s.images[e],o=self.URL||self.webkitURL;let c=a.uri||"",l=!1;if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(d){l=!0;const u=new Blob([d],{type:a.mimeType});return c=o.createObjectURL(u),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(d){return new Promise(function(u,f){let g=u;t.isImageBitmapLoader===!0&&(g=function(_){const m=new Vt(_);m.needsUpdate=!0,u(m)}),t.load(cr.resolveURL(d,r.path),g,void 0,f)})}).then(function(d){return l===!0&&o.revokeObjectURL(c),zn(d,a),d.userData.mimeType=a.mimeType||Nv(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[nt.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[nt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=r.associations.get(a);a=r.extensions[nt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,c)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new zd,Pn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new Bd,Pn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),r&&(c.vertexColors=!0),a&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return zt}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let a;const o={},c=r.extensions||{},l=[];if(c[nt.KHR_MATERIALS_UNLIT]){const d=s[nt.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),l.push(d.extendParams(o,r,t))}else{const d=r.pbrMetallicRoughness||{};if(o.color=new Ue(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],gn),o.opacity=u[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",d.baseColorTexture,wt)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=fn);const h=r.alphaMode||Lo.OPAQUE;if(h===Lo.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Lo.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==si&&(l.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Ge(1,1),r.normalTexture.scale!==void 0)){const d=r.normalTexture.scale;o.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&a!==si&&(l.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==si){const d=r.emissiveFactor;o.emissive=new Ue().setRGB(d[0],d[1],d[2],gn)}return r.emissiveTexture!==void 0&&a!==si&&l.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,wt)),Promise.all(l).then(function(){const d=new a(o);return r.name&&(d.name=r.name),zn(d,r),t.associations.set(d,{materials:e}),r.extensions&&Fi(s,d,r),d})}createUniqueName(e){const t=ft.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[nt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return ad(c,o,t)})}const a=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=Dv(l),d=s[h];if(d)a.push(d.promise);else{let u;l.extensions&&l.extensions[nt.KHR_DRACO_MESH_COMPRESSION]?u=r(l):u=ad(new qt,l,t),s[h]={primitive:l,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let c=0,l=a.length;c<l;c++){const h=a[c].material===void 0?Pv(this.cache):this.getDependency("material",a[c].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],d=[];for(let f=0,g=h.length;f<g;f++){const _=h[f],m=a[f];let p;const y=l[f];if(m.mode===Mn.TRIANGLES||m.mode===Mn.TRIANGLE_STRIP||m.mode===Mn.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new op(_,y):new Y(_,y),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===Mn.TRIANGLE_STRIP?p.geometry=td(p.geometry,Cd):m.mode===Mn.TRIANGLE_FAN&&(p.geometry=td(p.geometry,vc));else if(m.mode===Mn.LINES)p=new fp(_,y);else if(m.mode===Mn.LINE_STRIP)p=new Qc(_,y);else if(m.mode===Mn.LINE_LOOP)p=new pp(_,y);else if(m.mode===Mn.POINTS)p=new mp(_,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Lv(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),zn(p,r),m.extensions&&Fi(s,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,g=d.length;f<g;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&Fi(s,d[0],r),d[0];const u=new Ot;r.extensions&&Fi(s,u,r),t.associations.set(u,{meshes:e});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new sn(zf.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Fa(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),zn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),a=s,o=[],c=[];for(let l=0,h=a.length;l<h;l++){const d=a[l];if(d){o.push(d);const u=new Ye;r!==null&&u.fromArray(r.array,l*16),c.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Jc(o,c)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],c=[],l=[],h=[];for(let d=0,u=s.channels.length;d<u;d++){const f=s.channels[d],g=s.samplers[f.sampler],_=f.target,m=_.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,y=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",y)),l.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(d){const u=d[0],f=d[1],g=d[2],_=d[3],m=d[4],p=[];for(let A=0,M=u.length;A<M;A++){const T=u[A],b=f[A],R=g[A],x=_[A],w=m[A];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const I=n._createAnimationTracks(T,b,R,x,w);if(I)for(let P=0;P<I.length;P++)p.push(I[P])}const y=new Ip(r,void 0,p);return zn(y,s),y})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=s.weights.length;c<l;c++)o.morphTargetInfluences[c]=s.weights[c]}),a})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let l=0,h=o.length;l<h;l++)a.push(n.getDependency("node",o[l]));const c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),c]).then(function(l){const h=l[0],d=l[1],u=l[2];u!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(u,Uv)});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);if(h.userData.pivot!==void 0&&d.length>0){const f=h.userData.pivot,g=d[0];h.pivot=new D().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(r.isBone===!0?h=new kd:l.length>1?h=new Ot:l.length===1?h=l[0]:h=new lt,h!==l[0])for(let d=0,u=l.length;d<u;d++)h.add(l[d]);if(r.name&&(h.userData.name=r.name,h.name=a),zn(h,r),r.extensions&&Fi(n,h,r),r.matrix!==void 0){const d=new Ye;d.fromArray(r.matrix),h.applyMatrix4(d)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const d=s.associations.get(h);s.associations.set(h,{...d})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new Ot;n.name&&(r.name=s.createUniqueName(n.name)),zn(r,n),n.extensions&&Fi(t,r,n);const a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(s.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let h=0,d=c.length;h<d;h++){const u=c[h];u.parent!==null?r.add(iv(u)):r.add(u)}const l=h=>{const d=new Map;for(const[u,f]of s.associations)(u instanceof Pn||u instanceof Vt)&&d.set(u,f);return h.traverse(u=>{const f=s.associations.get(u);f!=null&&d.set(u,f)}),d};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){const a=[],o=e.name?e.name:e.uuid,c=[];function l(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}Si[r.path]===Si.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(o);let h;switch(Si[r.path]){case Si.weights:h=_r;break;case Si.rotation:h=xr;break;case Si.translation:case Si.scale:h=Ra;break;default:n.itemSize===1?h=_r:h=Ra;break}const d=s.interpolation!==void 0?Cv[s.interpolation]:fr,u=this._getArrayFromAccessor(n);for(let f=0,g=c.length;f<g;f++){const _=new h(c[f]+"."+Si[r.path],t.array,u,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Ic(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof xr?Rv:yu;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Ov(i,e,t){const n=e.attributes,s=new ui;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(s.set(new D(c[0],c[1],c[2]),new D(l[0],l[1],l[2])),o.normalized){const h=Ic(Ts[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new D,c=new D;for(let l=0,h=r.length;l<h;l++){const d=r[l];if(d.POSITION!==void 0){const u=t.json.accessors[d.POSITION],f=u.min,g=u.max;if(f!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),u.normalized){const _=Ic(Ts[u.componentType]);c.multiplyScalar(_)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;const a=new $n;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function ad(i,e,t){const n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(c){i.setAttribute(o,c)})}for(const a in n){const o=Pc[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){const a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return it.workingColorSpace!==gn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${it.workingColorSpace}" not supported.`),zn(i,e),Ov(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?Iv(i,e.targets,t):i})}const od={yamaha:Ke("assets/models/carts/yamaha.glb"),evolution:Ke("assets/models/carts/evolution.glb"),hotrod:Ke("assets/models/carts/hotrod.glb")},ll={};let sa=null;function kv(i){return i.traverse(e=>{const t=e;if(t.isMesh){t.castShadow=!0,t.receiveShadow=!0;const n=Array.isArray(t.material)?t.material:[t.material];for(const s of n){const r=s;r?.map&&(r.map.colorSpace=wt)}}}),i}function Bv(){return sa||(sa=(async()=>{const i=new sv,e=Object.keys(od);await Promise.all(e.map(t=>new Promise(n=>{i.load(od[t],s=>{ll[t]=kv(s.scene),console.info(`[cartGlb] Loaded ${t}.glb`),n()},void 0,s=>{console.warn(`[cartGlb] Failed to load ${t}.glb — procedural fallback`,s),n()})})))})(),sa)}function Su(i){return!!ll[i]}function bu(i){const e=ll[i];if(!e)return null;const t=e.clone(!0);t.traverse(s=>{const r=s;r.isMesh&&r.material&&(Array.isArray(r.material)?r.material=r.material.map(a=>a.clone()):r.material=r.material.clone())});const n=new Ot;return n.name=`cart-glb-${i}`,n.add(t),n}const zv=Object.freeze(Object.defineProperty({__proto__:null,cloneCartGlb:bu,hasCartGlb:Su,loadCartGlbs:Bv},Symbol.toStringTag,{value:"Module"})),Gv=new el;let ra=null,cd=!1;function Hv(){return ra||(cd||(cd=!0,Gv.load(Ke("assets/mascot-logo.jpg"),i=>{i.colorSpace=wt,ra=i;for(const e of Lc)e.map=i,e.color.setHex(16777215),e.needsUpdate=!0;Lc.length=0},void 0,()=>{console.warn("[assets] Could not load mascot-logo.jpg for donor flags")})),ra)}const Lc=[];function qe(i,e=.7,t=.2){return new zt({color:i,roughness:e,metalness:t})}function W(i,e,t,n,s,r){const a=new Y(i,e);return a.position.set(t,n,s),(r?.sx!=null||r?.sy!=null||r?.sz!=null)&&a.scale.set(r.sx??1,r.sy??1,r.sz??1),r?.rx&&(a.rotation.x=r.rx),r?.ry&&(a.rotation.y=r.ry),r?.rz&&(a.rotation.z=r.rz),a.castShadow=r?.cast!==!1,a.receiveShadow=!0,a}function Vv(i,e,t,n,s,r){const a=new Ot;t&&a.scale.setScalar(1.14);const o=Su(i.id)?bu(i.id):null;if(o?a.add(o):i.id==="evolution"?$v(a,i,n):i.id==="hotrod"?Kv(a,i,n):Yv(a,i,n),Xv(a,i,e),t){const c=(s||"YOU").slice(0,16),l=wu(c,"#1c2430",vr.gold);l.position.set(0,2.15,i.id==="evolution"?.1:.05),l.scale.set(Math.max(2.2,c.length*.28),.7,1),l.name="nameplate",a.add(l),r&&Wv(a,i,r)}return a.rotation.order="YXZ",a}function Wv(i,e,t){const n=new Ot;n.name="donation-flag";const s=iM(t),r=e.id==="evolution"?-1.15:e.id==="hotrod"?-1.05:-1.2;n.position.set(.55,1.2,r);const a=qe("#4a4038",.65,.35),o=qe(s,.45,.4);n.add(W(new ze(.028,.032,1.05,8),a,0,.52,0,{cast:!1})),n.add(W(new Be(.05,8,8),o,0,1.08,0,{cast:!1}));const c=new zt({color:s,roughness:.75,metalness:t===5?.45:.12,side:fn}),l=new Y(new Yi(.72,.48),c);if(l.position.set(.38,.82,0),l.rotation.y=Math.PI/2,l.castShadow=!1,l.receiveShadow=!1,n.add(l),t===5){const f=new Y(new Yi(.74,.06),new zt({color:"#fff3c4",roughness:.35,metalness:.7,side:fn}));f.position.set(.38,1.04,0),f.rotation.y=Math.PI/2,n.add(f)}const h=new si({color:s,transparent:!0,side:fn,depthWrite:!1}),d=Hv();d?(h.map=d,h.color.setHex(16777215)):Lc.push(h);const u=new Y(new vn(.16,20),h);u.position.set(.4,.82,.01),u.rotation.y=Math.PI/2,n.add(u),n.rotation.z=-.08,n.rotation.y=.15,i.add(n)}function Xv(i,e,t){const n=e.id==="evolution"?.22:e.id==="hotrod"?.08:.12,s=.28,r=1.08,a=1,o=qe(qv(t),.75,.08),c=qe("#f5efe4",.8,.05);i.add(W(new Be(.28*a,14,12),o,s,r+.22*a,n,{sx:.95,sy:1.05,sz:.85})),i.add(W(new Be(.16*a,12,10),c,s,r+.12*a,n+.12*a,{sx:1.1,sy:.9,sz:.7,cast:!1})),i.add(W(new Be(.2*a,12,10),o,s,r+.52*a,n+.02,{sx:1,sy:.95,sz:.9}));const l=wu(ma(t),"#000","transparent");l.position.set(s,r+.58*a,n+.02);const h=1.85*a;l.scale.set(h,h,1),l.name="driver-emoji",i.add(l)}function qv(i){const e=i.id;return e==="alligator"?"#3d7a48":e==="turtle"?"#5a8a40":e==="manatee"?"#8a9aaa":e==="armadillo"?"#9a8060":e==="raccoon"?"#6a6058":e==="pelican"?"#e8e0d0":e==="ibis"?"#f0f0f0":e==="otter"?"#8a6a48":i.color||"#6a8a5a"}function Yv(i,e,t){const n=qe("#f7f7f5",.22,.48),s=qe("#ecece8",.32,.38),r=qe("#121214",.48,.32),a=qe("#1a1a1c",.78,.12),o=qe("#2a2a2e",.82,.1),c=qe("#f0ebe4",.68,.08),l=qe("#c4c8cc",.28,.78),h=qe("#141416",.92,.05),d=qe("#fff8e8",.12,.95),u=qe("#e8a030",.4,.35);i.add(W(new z(1.55,.12,2.6),a,0,.36,0)),i.add(W(new z(.14,.07,1.7),r,-.8,.34,-.05)),i.add(W(new z(.14,.07,1.7),r,.8,.34,-.05)),i.add(W(new z(1.42,.48,2),n,0,.72,-.1)),i.add(W(new Be(.45,16,12),n,-.62,.62,.15,{sx:.55,sy:.75,sz:1.8})),i.add(W(new Be(.45,16,12),n,.62,.62,.15,{sx:.55,sy:.75,sz:1.8})),i.add(W(new z(1.28,.5,.78),n,0,.74,1.1)),i.add(W(new Be(.62,18,14),n,0,.72,1.05,{sx:1.05,sy:.58,sz:.82})),i.add(W(new Be(.5,16,14),n,-.58,.55,1,{sx:.78,sy:.88,sz:1.2})),i.add(W(new Be(.5,16,14),n,.58,.55,1,{sx:.78,sy:.88,sz:1.2})),i.add(W(new z(1.22,.2,.32),r,0,.4,1.45)),i.add(W(new z(1.05,.1,.14),a,0,.48,1.55)),i.add(W(new ze(.1,.11,.09,14),d,-.38,.66,1.5,{rx:Math.PI/2})),i.add(W(new ze(.1,.11,.09,14),d,.38,.66,1.5,{rx:Math.PI/2})),i.add(W(new Zt(.11,.018,8,16),r,-.38,.66,1.5,{cast:!1})),i.add(W(new Zt(.11,.018,8,16),r,.38,.66,1.5,{cast:!1})),i.add(W(new z(.12,.05,.04),u,-.72,.72,1.15,{cast:!1})),i.add(W(new z(.12,.05,.04),u,.72,.72,1.15,{cast:!1})),i.add(W(new ze(.1,.1,.04,16),r,0,.72,1.52,{rx:Math.PI/2})),i.add(W(new ze(.07,.07,.03,16),l,0,.72,1.54,{rx:Math.PI/2,cast:!1})),i.add(W(new z(1.42,.48,.62),n,0,.72,-1.2)),i.add(W(new Be(.44,14,12),n,-.55,.56,-1.12,{sx:.72,sy:.78,sz:1.1})),i.add(W(new Be(.44,14,12),n,.55,.56,-1.12,{sx:.72,sy:.78,sz:1.1})),i.add(W(new z(.95,.08,.05),qe("#c02828",.35,.45),0,.7,-1.52)),i.add(W(new z(.55,.08,.03),r,.72,.58,-.35,{cast:!1})),i.add(W(new z(1.28,.22,.4),a,0,.98,.5)),i.add(W(new z(.55,.06,.22),l,0,1.08,.48,{cast:!1})),i.add(W(new ze(.04,.05,.36,8),r,.32,.95,.36,{rx:.9}));const f=new Y(new Zt(.19,.03,10,18),r);f.position.set(.32,1.1,.3),f.rotation.x=Math.PI/2.35,i.add(f),i.add(W(new z(.055,.62,.055),r,-.68,1.22,.55)),i.add(W(new z(.055,.62,.055),r,.68,1.22,.55)),i.add(W(new z(1.4,.05,.05),r,0,1.55,.55)),i.add(W(new z(1.38,.05,.05),r,0,.95,.58)),i.add(W(new z(1.35,.04,.04),r,0,1.25,.56)),i.add(W(new z(1.3,.55,.035),t.glass,0,1.25,.56,{rx:-.06,cast:!1})),i.add(W(new z(.14,.1,.08),r,-.78,1.35,.52)),i.add(W(new z(.14,.1,.08),r,.78,1.35,.52)),i.add(W(new z(.1,.08,.02),l,-.78,1.35,.58,{cast:!1})),i.add(W(new z(.1,.08,.02),l,.78,1.35,.58,{cast:!1}));for(const g of[-.34,.34])i.add(W(new z(.5,.16,.52),o,g,.96,.02)),i.add(W(new z(.42,.12,.44),c,g,1.03,.02,{cast:!1})),i.add(W(new z(.5,.58,.15),o,g,1.3,-.24)),i.add(W(new z(.4,.45,.1),c,g,1.32,-.2,{cast:!1})),i.add(W(new z(.34,.16,.12),c,g,1.62,-.24));i.add(W(new z(1.28,.15,.44),o,0,.96,-.8)),i.add(W(new z(1.18,.1,.36),c,0,1.02,-.8,{cast:!1})),i.add(W(new z(1.28,.52,.13),o,0,1.26,-1.02)),i.add(W(new z(1.18,.42,.09),c,0,1.28,-.98,{cast:!1})),i.add(W(new z(.1,.3,.48),s,-.72,1,-.05)),i.add(W(new z(.1,.3,.48),s,.72,1,-.05)),hl(i,{track:1,wheelBase:1.62,radius:.42,width:.32,y:.42,tire:h,rim:r,hub:l,spokes:!0,spokeColor:r})}function $v(i,e,t){const n=qe("#2fd0e0",.3,.48),s=qe("#5ee0ec",.32,.42),r=qe("#121418",.5,.3),a=qe("#1e2228",.65,.2),o=qe("#eef3f6",.78,.08),c=qe("#4ec8d8",.45,.3),l=qe("#ff7a28",.35,.4),h=qe("#e85a10",.4,.35),d=qe("#141416",.92,.05),u=qe("#e8f6ff",.15,.9),f=qe("#c0c6cc",.3,.7);i.add(W(new z(1.68,.14,2.55),a,0,.36,0)),i.add(W(new z(1.52,.5,2.15),n,0,.72,-.08)),i.add(W(new z(1.7,.28,2.35),r,0,.48,-.05)),i.add(W(new z(.22,.07,1.7),r,-.9,.34,-.05)),i.add(W(new z(.22,.07,1.7),r,.9,.34,-.05));for(const m of[.25,-.35])i.add(W(new z(.18,.03,.08),f,-.9,.38,m,{cast:!1})),i.add(W(new z(.18,.03,.08),f,.9,.38,m,{cast:!1}));i.add(W(new z(1.55,.52,.7),n,0,.74,1.28)),i.add(W(new z(.7,.18,.55),s,0,.95,1.2)),i.add(W(new z(1.4,.18,.35),r,0,.42,1.52)),i.add(W(new z(.28,.22,.06),a,0,.78,1.62)),i.add(W(new ze(.08,.08,.04,10),f,0,.78,1.65,{rx:Math.PI/2,cast:!1})),i.add(W(new z(.42,.1,.07),u,-.48,.72,1.6)),i.add(W(new z(.42,.1,.07),u,.48,.72,1.6)),i.add(W(new z(.48,.16,.05),r,-.48,.72,1.56,{cast:!1})),i.add(W(new z(.48,.16,.05),r,.48,.72,1.56,{cast:!1})),i.add(W(new Be(.48,14,12),n,-.72,.55,1.15,{sx:.78,sy:.88,sz:1.2})),i.add(W(new Be(.48,14,12),n,.72,.55,1.15,{sx:.78,sy:.88,sz:1.2})),i.add(W(new Zt(.38,.06,8,16),r,-.72,.42,1.15,{rx:Math.PI/2,cast:!1})),i.add(W(new Zt(.38,.06,8,16),r,.72,.42,1.15,{rx:Math.PI/2,cast:!1}));for(const m of[.15,-.55])i.add(W(new ze(.2,.2,.06,16),r,-.84,.78,m,{rz:Math.PI/2})),i.add(W(new Zt(.16,.035,8,16),f,-.84,.78,m,{rz:Math.PI/2,cast:!1})),i.add(W(new ze(.2,.2,.06,16),r,.84,.78,m,{rz:Math.PI/2})),i.add(W(new Zt(.16,.035,8,16),f,.84,.78,m,{rz:Math.PI/2,cast:!1}));i.add(W(new z(.06,.1,2.2),s,-.88,.55,-.15,{cast:!1})),i.add(W(new z(.06,.1,2.2),s,.88,.55,-.15,{cast:!1})),i.add(W(new z(1.58,.48,.55),n,0,.72,-1.45)),i.add(W(new Be(.42,12,10),n,-.65,.55,-1.35,{sx:.7,sy:.8,sz:1.05})),i.add(W(new Be(.42,12,10),n,.65,.55,-1.35,{sx:.7,sy:.8,sz:1.05})),i.add(W(new z(1,.1,.06),qe("#ff4040",.35,.5),0,.75,-1.72)),i.add(W(new z(.06,.62,.06),f,-.74,1.22,.7)),i.add(W(new z(.06,.62,.06),f,.74,1.22,.7)),i.add(W(new z(1.52,.06,.06),f,0,1.55,.68)),i.add(W(new z(1.5,.05,.05),r,0,.95,.76)),i.add(W(new z(1.44,.58,.04),t.glass,0,1.25,.7,{rx:-.1,cast:!1})),i.add(W(new z(.04,.45,.03),r,-.12,1.22,.76,{rz:.28,cast:!1})),i.add(W(new z(.08,.5,.45),n,-.84,1.2,-1.25)),i.add(W(new z(.08,.5,.45),n,.84,1.2,-1.25)),i.add(W(new z(.08,.06,.22),r,-.9,1.38,.62)),i.add(W(new z(.15,.12,.06),r,-.98,1.4,.52)),i.add(W(new z(.08,.06,.22),r,.9,1.38,.62)),i.add(W(new z(.15,.12,.06),r,.95,1.4,.52));const g=[.25,-.55];for(const m of g)for(const p of[-.36,.36])i.add(W(new z(.5,.15,.44),o,p,.98,m)),i.add(W(new z(.5,.55,.12),o,p,1.28,m-.2)),i.add(W(new z(.28,.13,.1),o,p,1.58,m-.2)),i.add(W(new z(.08,.11,.36),c,p-.26,1.1,m)),i.add(W(new z(.08,.11,.36),c,p+.26,1.1,m));i.add(W(new z(1.4,.28,.42),a,0,.98,.58)),i.add(W(new z(.45,.08,.22),s,0,1.1,.55,{cast:!1}));const _=new Y(new Zt(.17,.028,8,14),r);_.position.set(.32,1.15,.42),_.rotation.x=Math.PI/2.35,i.add(_),i.add(W(new ze(.04,.05,.32,8),r,.32,1,.48,{rx:.85})),hl(i,{track:1.08,wheelBase:1.65,radius:.45,width:.35,y:.45,tire:d,rim:l,hub:h,spokes:!0,spokeColor:l})}function Kv(i,e,t){const n=qe("#2a72c4",.24,.58),s=qe("#1c5a9e",.28,.52),r=qe("#3a82d4",.26,.55),a=qe("#e8ecf0",.28,.62),o=qe("#d4d9e0",.36,.5),c=qe("#f0f4f6",.14,.95),l=qe("#121214",.52,.28),h=qe("#1a1a1c",.8,.12),d=qe("#2a4f9a",.7,.15),u=qe("#d4dae4",.68,.1),f=qe("#7ec8f0",.32,.42),g=qe("#b0e4ff",.28,.48),_=qe("#101012",.92,.05),m=qe("#fff8e0",.14,.95);i.add(W(new z(1.55,.12,2.4),h,0,.36,0)),i.add(W(new z(.2,.06,1.15),o,-.84,.32,-.05)),i.add(W(new z(.2,.06,1.15),o,.84,.32,-.05)),i.add(W(new z(1.38,.58,1.55),n,0,.78,-.22)),i.add(W(new z(1.42,.05,1.5),c,0,1.06,-.2,{cast:!1})),i.add(W(new z(.08,.48,.95),s,-.68,.85,-.08)),i.add(W(new z(.08,.48,.95),s,.68,.85,-.08)),i.add(W(new z(.04,.06,1.2),c,-.72,.95,-.1,{cast:!1})),i.add(W(new z(.04,.06,1.2),c,.72,.95,-.1,{cast:!1})),i.add(W(new Be(.62,18,16),a,-.7,.56,.95,{sx:.92,sy:.74,sz:1.3})),i.add(W(new Be(.62,18,16),a,.7,.56,.95,{sx:.92,sy:.74,sz:1.3})),i.add(W(new Be(.32,14,12),a,-.55,.46,1.48,{sx:.95,sy:.72,sz:.9})),i.add(W(new Be(.32,14,12),a,.55,.46,1.48,{sx:.95,sy:.72,sz:.9})),i.add(W(new z(.78,.5,.72),a,0,.72,1.15)),i.add(W(new z(.42,.16,.68),o,0,1,1.08)),i.add(W(new Be(.38,14,12),a,0,.88,1.22,{sx:.95,sy:.48,sz:.72}));for(let y=-5;y<=5;y++)i.add(W(new z(.032,.44,.05),c,y*.06,.64,1.54,{cast:!1}));i.add(W(new z(.76,.05,.06),c,0,.88,1.54)),i.add(W(new z(.76,.05,.06),c,0,.4,1.54)),i.add(W(new z(.05,.5,.06),c,-.36,.64,1.54)),i.add(W(new z(.05,.5,.06),c,.36,.64,1.54)),i.add(W(new z(1.6,.1,.15),c,0,.28,1.6)),i.add(W(new Be(.11,12,10),c,-.8,.28,1.6)),i.add(W(new Be(.11,12,10),c,.8,.28,1.6)),i.add(W(new z(.09,.16,.12),c,-.48,.35,1.65)),i.add(W(new z(.09,.16,.12),c,.48,.35,1.65)),i.add(W(new Be(.14,14,12),m,-.74,.72,1.38)),i.add(W(new Be(.14,14,12),m,.74,.72,1.38)),i.add(W(new Zt(.15,.024,8,16),c,-.74,.72,1.38,{cast:!1})),i.add(W(new Zt(.15,.024,8,16),c,.74,.72,1.38,{cast:!1}));for(const y of[-1,1]){const A=y*.82;i.add(W(new z(.06,.1,.7),f,A,.62,.75,{cast:!1})),i.add(W(new z(.05,.16,.45),g,A,.72,1,{cast:!1})),i.add(W(new z(.045,.22,.28),f,A,.82,1.15,{cast:!1})),i.add(W(new z(.04,.12,.5),g,A,.55,.65,{cast:!1})),i.add(W(new z(.035,.18,.2),f,A,.9,1.25,{cast:!1}))}i.add(W(new Be(.52,16,14),r,-.64,.56,-1.05,{sx:.88,sy:.74,sz:1.2})),i.add(W(new Be(.52,16,14),r,.64,.56,-1.05,{sx:.88,sy:.74,sz:1.2})),i.add(W(new z(1.36,.5,.58),n,0,.74,-1.15)),i.add(W(new z(.95,.05,.05),c,0,.7,-1.45,{cast:!1})),i.add(W(new z(1.2,.12,.35),s,0,1,-1.25)),i.add(W(new z(1.28,.1,1.05),h,0,.5,-.08)),i.add(W(new z(1.22,.22,.4),l,0,.98,.48)),i.add(W(new z(.38,.06,.2),c,0,1.08,.45,{cast:!1})),i.add(W(new ze(.035,.04,.32,8),l,.28,.95,.34,{rx:.95}));const p=new Y(new Zt(.18,.03,10,18),l);p.position.set(.28,1.1,.28),p.rotation.x=Math.PI/2.4,i.add(p);for(const y of[-.34,.34])i.add(W(new z(.52,.16,.5),d,y,.96,0)),i.add(W(new z(.42,.1,.4),u,y,1.03,.02,{cast:!1})),i.add(W(new z(.52,.55,.14),d,y,1.28,-.22)),i.add(W(new z(.4,.4,.1),u,y,1.3,-.18,{cast:!1}));i.add(W(new z(1.18,.05,.05),c,0,1.48,.5)),i.add(W(new z(.05,.52,.05),c,-.56,1.2,.52)),i.add(W(new z(.05,.52,.05),c,.56,1.2,.52)),i.add(W(new z(1.12,.5,.04),t.glass,0,1.2,.52,{rx:-.16,cast:!1})),i.add(W(new z(.14,.09,.02),qe("#e8c84a",.48,.22),.38,1.38,.56,{cast:!1})),hl(i,{track:1.02,wheelBase:1.55,radius:.42,width:.3,y:.42,tire:_,rim:c,hub:c,spokes:!0,spokeColor:c})}function hl(i,e){const t=[[-e.track/2,e.wheelBase/2],[e.track/2,e.wheelBase/2],[-e.track/2,-e.wheelBase/2],[e.track/2,-e.wheelBase/2]];for(const[n,s]of t){const r=new Y(new ze(e.radius,e.radius,e.width,18),e.tire);if(r.rotation.z=Math.PI/2,r.position.set(n,e.y,s),r.castShadow=!0,i.add(r),e.whitewall){const c=new Y(new ze(e.radius*.72,e.radius*.72,e.width*1.05,16),e.whitewall);c.rotation.z=Math.PI/2,c.position.set(n,e.y,s),i.add(c)}const a=new Y(new ze(e.radius*.55,e.radius*.55,e.width*1.1,14),e.rim);a.rotation.z=Math.PI/2,a.position.set(n,e.y,s),i.add(a);const o=new Y(new ze(e.radius*.22,e.radius*.22,e.width*1.2,10),e.hub);if(o.rotation.z=Math.PI/2,o.position.set(n,e.y,s),i.add(o),e.spokes){const c=e.spokeColor??e.rim;for(let l=0;l<5;l++){const h=l/5*Math.PI*2,d=new Y(new z(e.radius*.08,e.radius*.9,e.width*.15),c);d.position.set(n,e.y,s),d.rotation.z=Math.PI/2,d.rotation.x=h,i.add(d)}}}}function wu(i,e,t){const n=document.createElement("canvas");n.width=512,n.height=128;const s=n.getContext("2d");s.clearRect(0,0,512,128),t!=="transparent"&&(s.fillStyle=t,s.beginPath(),s.roundRect(8,16,496,96,24),s.fill()),s.fillStyle=e,s.font="bold 48px DM Sans, system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,256,64);const r=new Na(n);return r.colorSpace=wt,new Kc(new La({map:r,transparent:!0,depthTest:!0}))}class Zv{renderer;scene;camera;racerMeshes=new Map;hazardMeshes=new Map;projectileMeshes=new Map;solidMarkers=new Map;pickupMeshes=new Map;gateArms=[];camPos=new D;camTarget=new D;lookAhead=new D;tmp=new D;clock=0;houseGeo;palmTrunkGeo;palmLeafGeo;materials;areaTheme=lr("spanish-springs").theme;activeAreaId="spanish-springs";cameraNeedsSnap=!0;trackBounds={minX:-200,maxX:200,minY:-200,maxY:200,cx:0,cz:0};constructor(e,t){this.materials=t??nM(),this.renderer=new Zx({canvas:e,antialias:!0,powerPreference:"high-performance",alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(window.innerWidth,window.innerHeight,!1),this.renderer.outputColorSpace=wt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=fd,this.renderer.toneMapping=Oc,this.renderer.toneMappingExposure=1.22,this.scene=new ep,this.scene.background=new Ue("#7ec8ef"),this.scene.fog=new wa("#c8e8f8",280,1100),this.camera=new sn(58,window.innerWidth/Math.max(1,window.innerHeight),.35,2800),this.houseGeo=new z(1,1,1),this.palmTrunkGeo=new ze(.16,.24,1,12),this.palmLeafGeo=new yr(1.1,1.85,8)}setMaterials(e){this.materials=e}buildWorld(e,t,n){n&&(this.activeAreaId=n,this.areaTheme=lr(n).theme);const s=this.areaTheme;for(this.trackBounds=Qv(e,160);this.scene.children.length;)this.scene.remove(this.scene.children[0]);this.racerMeshes.clear(),this.hazardMeshes.clear(),this.projectileMeshes.clear(),this.solidMarkers.clear(),this.pickupMeshes.clear(),this.gateArms=[],this.scene.background=new Ue(s.skyBottom);const r=Math.max(this.trackBounds.maxX-this.trackBounds.minX,this.trackBounds.maxY-this.trackBounds.minY),a=Math.max(380,r*1.1),o=Math.max(1400,r*3.5);this.scene.fog=new wa(s.skyBottom,a,o),this.camera.far=Math.max(3200,o+600),this.camera.updateProjectionMatrix(),this.materials.grass.color.set(s.grass),this.materials.grassDeep.color.set(s.grassDeep),this.materials.asphalt.color.set("#5a5e68"),this.materials.asphaltDark.color.set("#484c54"),this.materials.sidewalk.color.set(s.sidewalk),this.materials.curb.color.set("#3d9a58"),this.materials.water.color.set(s.water),this.materials.stucco.color.set(s.stucco[0]),this.materials.stuccoAlt.color.set(s.stucco[1]??s.stucco[0]),this.materials.roof.color.set(s.roof),this.materials.roofBlue.color.set(s.roofAlt),this.materials.roofGreen.color.set(s.roof),this.materials.plaza.color.set(s.plaza),this.materials.line.color.set("#ffffff"),this.materials.center.color.set("#f5d040");for(const c of[this.materials.asphalt,this.materials.asphaltDark,this.materials.line,this.materials.center,this.materials.curb,this.materials.sidewalk,this.materials.grass,this.materials.grassDeep,this.materials.fairway,this.materials.plaza,this.materials.parking,this.materials.sand])c.fog=!1;this.addLights(s),this.addGround(),this.addRoad(e),this.addSidewalks(e),this.addBridges(e),this.addRoundabouts(),this.addCommunityGates(),this.addDecor(t),this.addLandmarks(n),this.addStreetFurniture(e),this.addRoadsideDetail(e),this.addSkyDecor(),this.cameraNeedsSnap=!0,this.renderer.compile(this.scene,this.camera)}snapCameraToPlayer(e){this.cameraNeedsSnap=!0,this.updateCamera(e,1/60)}addLights(e){const t=new kp(e.skyBottom,e.grassDeep,1.15);this.scene.add(t);const n=new fa("#fff6e0",1.75);n.position.set(140,200,90),n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.camera.near=5,n.shadow.camera.far=700,n.shadow.camera.left=-280,n.shadow.camera.right=280,n.shadow.camera.top=280,n.shadow.camera.bottom=-280,n.position.set(this.trackBounds.cx+140,200,this.trackBounds.cz+90),n.target.position.set(this.trackBounds.cx,0,this.trackBounds.cz),this.scene.add(n.target),n.shadow.bias=-15e-5,n.shadow.normalBias=.04,this.scene.add(n);const s=new fa(e.skyMid,.45);s.position.set(-90,50,-70),this.scene.add(s);const r=new fa(e.accent,.3);r.position.set(40,20,-120),this.scene.add(r);const a=new Be(2200,32,16),o=new Ln({side:on,depthWrite:!1,uniforms:{topColor:{value:new Ue(e.skyTop)},midColor:{value:new Ue(e.skyMid)},bottomColor:{value:new Ue(e.skyBottom)}},vertexShader:`
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
      `});this.scene.add(new Y(a,o))}addGround(){const e=this.trackBounds,t=Math.max(900,(e.maxX-e.minX)*2.2),n=Math.max(900,(e.maxY-e.minY)*2.2),s=e.cx,r=e.cz,a=new Y(new Yi(t,n,24,24),this.materials.grass);a.rotation.x=-Math.PI/2,a.position.set(s,0,r),a.receiveShadow=!0,a.frustumCulled=!1,this.scene.add(a);const o=new vn(1,16),c=hd(42),l=new lt,h=[this.materials.grassDeep,re("#4aad68",.95,.12),re("#3d9458",.95,.12),re("#5cb87a",.92,.12)];for(const u of h){const f=new et(o,u,70);for(let g=0;g<70;g++){const _=e.minX+c()*(e.maxX-e.minX),m=e.minY+c()*(e.maxY-e.minY),p=6+c()*22;l.position.set(_,.02+c()*.02,m),l.scale.set(p,p*(.7+c()*.5),p),l.rotation.x=-Math.PI/2,l.rotation.z=c()*Math.PI,l.updateMatrix(),f.setMatrixAt(g,l.matrix)}f.receiveShadow=!0,this.scene.add(f)}const d=new et(o,this.materials.sand,50);for(let u=0;u<50;u++){const f=e.minX+c()*(e.maxX-e.minX),g=e.minY+c()*(e.maxY-e.minY),_=3+c()*12;l.position.set(f,.03,g),l.scale.set(_,_*.6,_),l.rotation.x=-Math.PI/2,l.updateMatrix(),d.setMatrixAt(u,l.matrix)}this.scene.add(d)}finalizePathMesh(e){e.frustumCulled=!1,e.geometry.computeBoundingSphere(),e.geometry.computeBoundingBox(),e.geometry.boundingSphere&&(e.geometry.boundingSphere.radius*=1.35),this.scene.add(e)}addRoad(e){if(e.length<2)return;const t=gt,n=.08,s=S=>n+(S.elev??0),r=[],a=[];for(const S of e){const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2),N=s(S);r.push(new D(S.x-L*t,N,S.y-O*t)),a.push(new D(S.x+L*t,N,S.y+O*t))}r.push(r[0].clone()),a.push(a[0].clone());const o=new Y(ni(r,a),this.materials.asphalt);o.receiveShadow=!0,this.finalizePathMesh(o);const c=[],l=[];let h=!1;for(const S of e){const L=S.elev??0;L>.35&&(h=!0);const O=Math.cos(S.angle+Math.PI/2),N=Math.sin(S.angle+Math.PI/2),V=s(S)-Math.min(.55,.2+L*.06);c.push(new D(S.x-O*(t+.15),V,S.y-N*(t+.15))),l.push(new D(S.x+O*(t+.15),V,S.y+N*(t+.15)))}if(h){c.push(c[0].clone()),l.push(l[0].clone());const S=re("#4a4e56",.85,.12);S.fog=!1;const L=new Y(ni(c,l),S);L.receiveShadow=!0,this.finalizePathMesh(L)}const d=t*.4,u=e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*d,s(S)+.005,S.y-O*d)}),f=e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*d,s(S)+.005,S.y+O*d)});u.push(u[0].clone()),f.push(f[0].clone()),this.finalizePathMesh(new Y(ni(u,f),this.materials.asphaltDark));const g=new lt,_=new z(2.6,.06,.2),m=Math.ceil(e.length/3),p=new et(_,this.materials.center,m),y=new et(_,this.materials.center,m);let A=0;for(let S=0;S<e.length&&!(A>=m);S+=3){if(S/3%2>=1)continue;const L=e[S],O=Math.cos(L.angle+Math.PI/2),N=Math.sin(L.angle+Math.PI/2),V=.22,B=s(L)+.04;g.position.set(L.x-O*V,B,L.y-N*V),g.rotation.y=-L.angle,g.scale.set(1,1,1),g.updateMatrix(),p.setMatrixAt(A,g.matrix),g.position.set(L.x+O*V,B,L.y+N*V),g.updateMatrix(),y.setMatrixAt(A,g.matrix),A++}p.count=A,y.count=A,p.instanceMatrix.needsUpdate=!0,y.instanceMatrix.needsUpdate=!0,p.frustumCulled=!1,y.frustumCulled=!1,this.scene.add(p),this.scene.add(y);const M=.55,T=S=>s(S)+.04,b=ni(e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*t,T(S),S.y-O*t)}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*t,T(S),S.y-O*t)})()]),e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*(t-M),T(S),S.y-O*(t-M))}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*(t-M),T(S),S.y-O*(t-M))})()])),R=ni(e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*(t-M),T(S),S.y+O*(t-M))}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*(t-M),T(S),S.y+O*(t-M))})()]),e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*t,T(S),S.y+O*t)}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*t,T(S),S.y+O*t)})()]));this.finalizePathMesh(new Y(b,this.materials.line)),this.finalizePathMesh(new Y(R,this.materials.line)),this.addRoadDirectionArrows(e);const x=t+Wi,w=S=>s(S)-.02,I=ni(e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*x,w(S),S.y-O*x)}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*x,w(S),S.y-O*x)})()]),e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*t,w(S),S.y-O*t)}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x-L*t,w(S),S.y-O*t)})()])),P=ni(e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*t,w(S),S.y+O*t)}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*t,w(S),S.y+O*t)})()]),e.map(S=>{const L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*x,w(S),S.y+O*x)}).concat([(()=>{const S=e[0],L=Math.cos(S.angle+Math.PI/2),O=Math.sin(S.angle+Math.PI/2);return new D(S.x+L*x,w(S),S.y+O*x)})()]));this.finalizePathMesh(new Y(I,this.materials.curb)),this.finalizePathMesh(new Y(P,this.materials.curb)),this.addStartFinishGate(e)}addRoadDirectionArrows(e){const t=new lt,n=new z(1.6,.05,.28),s=this.materials.line,r=Math.max(8,Math.floor(e.length/28)),a=Math.floor(e.length/r),o=new et(n,s,a),c=new et(n,s,a);let l=0;for(let h=r;h<e.length&&l<a;h+=r){if(h<12||h>e.length-8)continue;const d=e[h],u=Math.cos(d.angle),f=Math.sin(d.angle),g=.12+(d.elev??0),_=d.x,m=d.y;t.position.set(_-f*.35,g,m+u*.35),t.rotation.set(0,-d.angle+.55,0),t.scale.set(1,1,1),t.updateMatrix(),o.setMatrixAt(l,t.matrix),t.position.set(_+f*.35,g,m-u*.35),t.rotation.set(0,-d.angle-.55,0),t.updateMatrix(),c.setMatrixAt(l,t.matrix),l++}o.count=l,c.count=l,o.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0,o.frustumCulled=!1,c.frustumCulled=!1,this.scene.add(o),this.scene.add(c)}addRoundabouts(){if(In.length)for(const e of In)this.addRoundaboutIsland(e)}addRoundaboutIsland(e){const t=new Ot,n=.08,s=e.islandRadius,r=new Y(new Zt(s+.35,.22,8,40),re("#d8d4cc",.75,.12));r.rotation.x=-Math.PI/2,r.position.set(e.x,n+.12,e.y),r.receiveShadow=!0,t.add(r);const a=new Y(new vn(s,40),this.materials.grass);a.rotation.x=-Math.PI/2,a.position.set(e.x,n+.05,e.y),a.receiveShadow=!0,t.add(a);const o=new Y(new vn(s*.42,24),re("#8a6a48",.9,.05));o.rotation.x=-Math.PI/2,o.position.set(e.x,n+.07,e.y),t.add(o);const c=new Y(new ze(s*.22,s*.26,.45,16),re("#c8d0d8",.4,.55));c.position.set(e.x,n+.3,e.y),c.castShadow=!0,t.add(c);const l=new Y(new vn(s*.16,16),this.materials.water);l.rotation.x=-Math.PI/2,l.position.set(e.x,n+.54,e.y),t.add(l);const h=3+Math.floor((e.x*.1+e.y)%2);for(let u=0;u<h;u++){const f=u/h*Math.PI*2+.4,g=s*.68,_=e.x+Math.cos(f)*g,m=e.y+Math.sin(f)*g,p=new Y(this.palmTrunkGeo,this.materials.palmBark);p.position.set(_,n+1.1,m),p.scale.set(.7,2.2,.7),p.castShadow=!0,t.add(p);const y=new Y(this.palmLeafGeo,this.materials.palmFrond);y.position.set(_,n+2.5,m),y.scale.setScalar(.55),y.castShadow=!0,t.add(y)}const d=new Y(new Aa(s+1.2,s+1.55,48),re("#f5d040",.55,.2));d.rotation.x=-Math.PI/2,d.position.set(e.x,n+.04,e.y),t.add(d),this.scene.add(t)}addCommunityGates(){if(Ai.length)for(const e of Ai)this.addCommunityGate(e)}addCommunityGate(e){const t=new Ot,n=gt,s=Math.cos(e.angle+Math.PI/2),r=Math.sin(e.angle+Math.PI/2),a=Math.cos(e.angle),o=Math.sin(e.angle),c=0,l=re("#efe6d6",.82,.08),h=re("#d4c4a8",.7,.15),d=re("#4a5560",.4,.65),u=re("#c44738",.45,.35),f=re("#f5f5f0",.5,.2);for(const R of[-1,1]){const x=e.x+s*(n+1.35)*R,w=e.y+r*(n+1.35)*R,I=new Y(new z(1.15,2.8,1.15),l);I.position.set(x,c+1.4,w),I.castShadow=!0,I.receiveShadow=!0,t.add(I);const P=new Y(new z(1.4,.28,1.4),h);P.position.set(x,c+2.9,w),t.add(P);const S=new Y(new Be(.22,12,10),re("#fff6d0",.25,.8));S.position.set(x,c+3.25,w),t.add(S)}for(const R of[-1,1]){const x=e.x+s*(n+2.8)*R-a*.4,w=e.y+r*(n+2.8)*R-o*.4,I=new Y(new z(.55,1.1,2.2),re("#c4785a",.85,.08));I.position.set(x,c+.55,w),I.rotation.y=-e.angle,I.castShadow=!0,t.add(I)}const g=e.x+s*(n+.55),_=e.y+r*(n+.55),m=new Y(new ze(.18,.22,1.15,10),d);m.position.set(g,c+.7,_),t.add(m);const p=new Ot;p.position.set(g,c+1.05,_),p.rotation.y=-(e.angle+Math.PI/2);const y=n*2+1.6,A=new Y(new z(y,.18,.28),u);A.position.set(-y/2,0,0),A.castShadow=!0,p.add(A);for(let R=0;R<5;R++){const x=new Y(new z(y*.08,.2,.3),f);x.position.set(-y*(.15+R*.16),0,0),p.add(x)}const M=new Y(new Be(.14,8,8),re("#ff4444",.3,.7));M.position.set(-y+.1,0,0),p.add(M),t.add(p),this.gateArms.push({arm:p,site:e});const T=rr(e.label,"#1c2430","#f5efe4");T.position.set(e.x-s*(n+1.35),c+2,e.y-r*(n+1.35)),T.scale.set(4.2,1.1,1),t.add(T);const b=new Y(new z(n*2+1,.05,.9),re("#3a3e48",.8,.1));b.position.set(e.x,c+.1,e.y),b.rotation.y=-e.angle,t.add(b),this.scene.add(t)}updateGates(e){for(const{arm:t,site:n}of this.gateArms){const s=cu(e,n.phase);t.rotation.z=-s*(Math.PI/2)}}addStartFinishGate(e){if(!e.length)return;const t=gt,n=e[0],s=Math.cos(n.angle+Math.PI/2),r=Math.sin(n.angle+Math.PI/2),a=Math.cos(n.angle),o=Math.sin(n.angle),c=new Ot,l=8.2,h=re("#e8b84a",.35,.55),d=re("#1c2430",.5,.35),u=new z(.7,l,.7);for(const x of[-1,1]){const w=new Y(u,h);w.position.set(n.x+s*(t+1.1)*x,l/2,n.y+r*(t+1.1)*x),w.castShadow=!0,c.add(w);const I=new Y(new z(1.4,.35,1.4),d);I.position.set(n.x+s*(t+1.1)*x,.18,n.y+r*(t+1.1)*x),c.add(I)}const f=t*2+3.2,g=new Y(new z(f,.55,.55),h);g.position.set(n.x,l-.4,n.y),g.rotation.y=-n.angle,g.castShadow=!0,c.add(g);const _=14,m=3,p=f/_,y=1.05;for(let x=0;x<m;x++)for(let w=0;w<_;w++){const I=(x+w)%2===0,P=new Y(new z(p*.98,y*.95,.12),re(I?"#111318":"#f6f6f2",.55,.15)),S=(w-(_-1)/2)*p;P.position.set(n.x+s*S,l-1.15-x*y,n.y+r*S),P.rotation.y=-n.angle,c.add(P)}const A=new Y(new z(f*.55,1.15,.2),re("#e85d4c",.45,.35));A.position.set(n.x-a*.15,l+.55,n.y-o*.15),A.rotation.y=-n.angle,c.add(A);const M=rr("START / FINISH","#ffffff","#e85d4c");M.position.set(n.x,l+.55,n.y),M.scale.set(12,2.4,1),c.add(M);const T=2.4,b=12,R=t*2/b;for(let x=0;x<3;x++)for(let w=0;w<b;w++){const I=(x+w)%2===0,P=new Y(new z(R*.96,.06,T/3-.05),re(I?"#1a1e28":"#f2f2ee",.7,.1)),S=(w-(b-1)/2)*R,L=(x-1)*(T/3);P.position.set(n.x+s*S+a*L,.13,n.y+r*S+o*L),P.rotation.y=-n.angle,c.add(P)}for(const x of[-1,1]){const w=new Y(new ze(.12,.16,6.5,8),re("#c0c4cc",.45,.5)),I=n.x+s*(t+3.2)*x-a*2,P=n.y+r*(t+3.2)*x-o*2;w.position.set(I,3.25,P),c.add(w);for(let S=0;S<2;S++)for(let L=0;L<3;L++){const O=(S+L)%2===0,N=new Y(new z(.55,.45,.06),re(O?"#111":"#fff",.6,.1));N.position.set(I+a*(.4+L*.55),5.8-S*.45,P+o*(.4+L*.55)),c.add(N)}}this.scene.add(c)}addSidewalks(e){const t=gt+Wi,n=t+Ba,s=o=>.06+(o.elev??0),r=ni(e.map(o=>{const c=Math.cos(o.angle+Math.PI/2),l=Math.sin(o.angle+Math.PI/2);return new D(o.x-c*n,s(o),o.y-l*n)}),e.map(o=>{const c=Math.cos(o.angle+Math.PI/2),l=Math.sin(o.angle+Math.PI/2);return new D(o.x-c*t,s(o),o.y-l*t)})),a=ni(e.map(o=>{const c=Math.cos(o.angle+Math.PI/2),l=Math.sin(o.angle+Math.PI/2);return new D(o.x+c*t,s(o),o.y+l*t)}),e.map(o=>{const c=Math.cos(o.angle+Math.PI/2),l=Math.sin(o.angle+Math.PI/2);return new D(o.x+c*n,s(o),o.y+l*n)}));this.finalizePathMesh(new Y(r,this.materials.sidewalk)),this.finalizePathMesh(new Y(a,this.materials.sidewalk))}addBridges(e){if(!Mr.length)return;const t="#e8dcc4",n="#d4c4a0",s="#6b2e28",r="#4a201c";for(const a of Mr){const o=new Ot;o.position.set(a.x,0,a.y),o.rotation.y=-a.angle;const c=a.peakElev||ru,l=c+.08,h=8.5,d=1.1,u=4.8,f=l+h,g=f+d*.5,_=f+d,m=Math.max(48,a.halfSpan*2.2),p=m/2,y=56,A=gt,M=new Y(new z(y,.2,32),this.materials.asphalt);M.position.set(0,.1,0),M.receiveShadow=!0,o.add(M);for(const N of[-.2,.2]){const V=new Y(new z(y*.92,.04,.18),this.materials.center);V.position.set(0,.22,N),o.add(V)}for(const N of[-7.5,7.5]){const V=new Y(new z(y*.9,.035,.14),this.materials.line);V.position.set(0,.22,N),o.add(V)}const T=_+u+1.8,b=5.8,R=A+3.8;for(const N of[-p,p]){for(const B of[-1,1]){const Z=B*R,ie=new Y(new z(b*.8,T,b*.8),re(t,.9,.08));ie.position.set(Z,T/2,N),ie.castShadow=!0,o.add(ie);const ce=new Y(new z(b,1.15,b),re(n,.88,.1));ce.position.set(Z,.55,N),o.add(ce);const ae=new Y(new z(b*.95,.7,b*.95),re(t,.8,.12));ae.position.set(Z,T+.28,N),o.add(ae)}const V=new ua("#ffc878",1,34,2);V.position.set(0,c*.55,N),o.add(V)}const x=re("#5c4838",.55,.35),w=re("#3d3228",.6,.3),I=m-b*.45;for(const N of[-1,1]){const V=N*(A+1.8),B=new Y(new z(.85,d,I),x);B.position.set(V,g,0),B.castShadow=!0,o.add(B);for(const Z of[-p,p]){const ie=new Y(new z(1.35,d+.4,1.15),re(n,.8,.12));ie.position.set(V,g,Z*.9),o.add(ie)}}const P=8;for(let N=0;N<P;N++){const V=(N+.5)/P,B=-I*.42+V*I*.84,Z=new Y(new z(A*2+4.2,d*.75,.6),N%2===0?x:w);Z.position.set(0,g-.05,B),Z.castShadow=!0,o.add(Z)}for(const N of[-1,1]){const V=N*(A+1.8);for(const Z of[0,u]){const ie=new Y(new z(.35,.28,m*.9),re(s,.45,.4));ie.position.set(V,_+Z,0),ie.castShadow=!0,o.add(ie)}const B=8;for(let Z=0;Z<=B;Z++){const ie=Z/B,ce=-p*.88+ie*m*.88,ae=new Y(new z(.2,u,.2),re(Z%2===0?s:r,.5,.35));if(ae.position.set(V,_+u*.5,ce),o.add(ae),Z<B){const pe=new Y(new z(.14,u*1.1,.14),re(s,.5,.35)),Ze=-p*.88+(Z+1)/B*m*.88;pe.position.set(V,_+u*.5,(ce+Ze)/2),pe.rotation.x=(Z%2===0?1:-1)*.55,o.add(pe)}}}for(let N=0;N<=3;N++){const V=-p*.7+N/3*m*.7,B=new Y(new z(A*2+4.5,.22,.22),re(s,.45,.4));B.position.set(0,_+u+.15,V),o.add(B)}for(const N of[-1,1])for(let V=0;V<=8;V++){const B=-p*.75+V/8*m*.75,Z=new Y(new z(.2,.5,.2),re(t,.85,.1));Z.position.set(N*(A+.5),l+.25,B),o.add(Z)}for(const N of[-p,p]){const V=new Y(new z(18,c*.32,10),this.materials.grassDeep);V.position.set(0,c*.14,N*1.1),o.add(V)}const S=rr("The Villages","#f5e6c8","#5a2820");S.position.set(0,_+u*.45,0),S.scale.set(14,3.2,1),o.add(S);const L=new ua("#ffd090",.95,30,2);L.position.set(0,_+u*.4,0),o.add(L);const O=new ua("#fff0d0",.9,40,2);O.position.set(0,l+h*.45,0),o.add(O),this.scene.add(o)}}addDecor(e){const t=new lt,n=[],s=[],r=[],a=[],o=[];for(const H of e)if(H.kind==="pond"){if(!ct(H.x,H.y,H.r+bt))continue;const Q=new Y(new vn(H.r,28),this.materials.water);Q.rotation.x=-Math.PI/2,Q.position.set(H.x,.06,H.y),this.scene.add(Q);const de=new Y(new Aa(H.r*.9,H.r*1.12,28),this.materials.sand);de.rotation.x=-Math.PI/2,de.position.set(H.x,.07,H.y),this.scene.add(de);for(let Ae=0;Ae<5;Ae++){const Te=new Y(new vn(.9+Ae%2*.4,8),this.materials.palmFrond);Te.rotation.x=-Math.PI/2,Te.position.set(H.x+Math.cos(Ae*1.7)*H.r*.4,.09,H.y+Math.sin(Ae*1.7)*H.r*.4),this.scene.add(Te)}}else if(H.kind==="golf"){if(!ct(H.x,H.y,H.r*.5+bt))continue;const Q=new Y(new vn(H.r,24),this.materials.fairway);Q.rotation.x=-Math.PI/2,Q.position.set(H.x,.05,H.y),Q.scale.set(1,.6,1),this.scene.add(Q);for(let Te=0;Te<3;Te++){const le=new Y(new vn(H.r*.12,12),this.materials.sand);le.rotation.x=-Math.PI/2,le.position.set(H.x+Math.cos(Te*2.1)*H.r*.45,.06,H.y+Math.sin(Te*2.1)*H.r*.35),this.scene.add(le)}const de=new Y(new ze(.06,.06,4,6),re("#ffffff",.4,.5));de.position.set(H.x-H.r*.25,2,H.y),this.scene.add(de);const Ae=new Y(new z(1.4,.8,.08),re(vr.sunset,.5,.4));Ae.position.set(H.x-H.r*.25+.7,3.5,H.y),this.scene.add(Ae)}else if(H.kind==="parking"){if(!ct(H.x,H.y,bt+4))continue;const Q=new Y(new z(H.r*2.2,.08,H.r*1.4),this.materials.parking);Q.position.set(H.x,.05,H.y),this.scene.add(Q);for(let de=-3;de<=3;de++){const Ae=new Y(new z(.08,.04,H.r*1.1),this.materials.line);Ae.position.set(H.x+de*(H.r*.28),.1,H.y),this.scene.add(Ae)}}else if(H.kind==="plaza"){if(!ct(H.x,H.y,gt+1))continue;const Q=new Y(new ze(H.r,H.r,.12,28),this.materials.plaza);Q.position.set(H.x,.06,H.y),this.scene.add(Q)}else if(H.kind==="houses"){if(!ct(H.x,H.y,un))continue;let Q=0,de=1/0;for(let le=0;le<nn.length;le+=2){const He=nn[le],je=(He.x-H.x)**2+(He.y-H.y)**2;je<de&&(de=je,Q=Math.atan2(He.y-H.y,He.x-H.x))}n.push({x:H.x,z:H.y,yaw:Q});const Ae=H.x+Math.cos(Q)*6,Te=H.y+Math.sin(Q)*6;ct(Ae,Te,bt)&&o.push({x:Ae,z:Te,yaw:Q}),a.push({x:H.x+Math.cos(Q+Math.PI/2)*5,z:H.y+Math.sin(Q+Math.PI/2)*5,yaw:Q+Math.PI/2,len:8});for(let le=-1;le<=1;le++)r.push({x:H.x+Math.cos(Q)*4.5+Math.cos(Q+Math.PI/2)*le*2.2,z:H.y+Math.sin(Q)*4.5+Math.sin(Q+Math.PI/2)*le*2.2,s:.7+Math.abs(le)*.2})}else if(H.kind==="palm-grove")for(let Q=0;Q<4;Q++){const de=H.x+Math.cos(Q*1.4)*H.r*.45,Ae=H.y+Math.sin(Q*1.4)*H.r*.4;ct(de,Ae,Hi)&&s.push({x:de,z:Ae})}const c=Math.min(n.length,1400),l=[this.materials.stucco,re("#f5efe3",.88,.18),re("#efe4d2",.88,.18),re("#e8ddd0",.88,.18),re("#f0e8da",.88,.18)],h=l.map(H=>new et(this.houseGeo,H,Math.ceil(c/l.length)+8)),d=h.map(()=>0),u=new et(this.houseGeo,this.materials.roof,c),f=new et(this.houseGeo,this.materials.roofBlue,Math.floor(c/2)),g=new et(this.houseGeo,this.materials.roofGreen,Math.floor(c/3)),_=new et(this.houseGeo,this.materials.roof,c),m=new et(this.houseGeo,this.materials.stucco,c),p=new et(this.houseGeo,this.materials.window,c*4),y=new et(this.houseGeo,re("#ffffff",.7,.2),c*4),A=new et(this.houseGeo,this.materials.door,c),M=new et(this.houseGeo,re("#e8e0d0",.85,.2),c),T=new et(this.houseGeo,re("#b07060",.85,.2),c);let b=0,R=0,x=0,w=0,I=0,P=0,S=0,L=0,O=0,N=0,V=0;for(let H=0;H<n.length&&b<c;H++){const Q=n[H];if(!ct(Q.x,Q.z,un))continue;const de=5.8+H%5*.45,Ae=4.4+H%4*.35,Te=2.9+H%3*.3,le=Q.yaw+Math.PI,He=H%h.length;d[He]<h[He].count&&(t.position.set(Q.x,Te/2,Q.z),t.scale.set(de,Te,Ae),t.rotation.set(0,-le,0),t.updateMatrix(),h[He].setMatrixAt(d[He]++,t.matrix)),t.position.set(Q.x,Te+.95,Q.z),t.scale.set(de*1.18,1.35,Ae*1.18),t.rotation.set(0,-le,0),t.updateMatrix();const je=H%5;je===0&&x<f.count?f.setMatrixAt(x++,t.matrix):je===1&&w<g.count?g.setMatrixAt(w++,t.matrix):R<u.count&&u.setMatrixAt(R++,t.matrix),I<_.count&&(t.position.set(Q.x+Math.cos(le)*.15,Te+1.55,Q.z+Math.sin(le)*.15),t.scale.set(de*.95,.55,Ae*.95),t.updateMatrix(),_.setMatrixAt(I++,t.matrix)),N<M.count&&(t.position.set(Q.x+Math.cos(le)*(Ae*.55+.6),.12,Q.z+Math.sin(le)*(Ae*.55+.6)),t.scale.set(de*.7,.2,1.6),t.rotation.set(0,-le,0),t.updateMatrix(),M.setMatrixAt(N++,t.matrix)),V<T.count&&H%3!==0&&(t.position.set(Q.x+Math.cos(le+Math.PI/2)*(de*.28),Te+2,Q.z+Math.sin(le+Math.PI/2)*(de*.28)),t.scale.set(.7,1.6,.7),t.rotation.set(0,-le,0),t.updateMatrix(),T.setMatrixAt(V++,t.matrix));const Et=Q.x+Math.cos(le+Math.PI/2)*(de*.58),Ct=Q.z+Math.sin(le+Math.PI/2)*(de*.58);ct(Et,Ct,un)&&P<m.count&&(t.position.set(Et,1.25,Ct),t.scale.set(3.4,2.5,3.8),t.rotation.set(0,-le,0),t.updateMatrix(),m.setMatrixAt(P++,t.matrix),O<A.count&&(t.position.set(Et+Math.cos(le)*1.95,1.1,Ct+Math.sin(le)*1.95),t.scale.set(2.4,2,.12),t.updateMatrix(),A.setMatrixAt(O++,t.matrix))),O<A.count&&(t.position.set(Q.x+Math.cos(le)*(Ae*.52),1.05,Q.z+Math.sin(le)*(Ae*.52)),t.scale.set(.95,2,.14),t.rotation.set(0,-le,0),t.updateMatrix(),A.setMatrixAt(O++,t.matrix));const Ut=[[.52,1.55,-1.55],[.52,1.55,1.55],[.52,2.35,-1.55],[.52,2.35,1.55],[0,1.7,Ae*.52],[0,1.7,-Ae*.52]];for(const[at,Tt,xt]of Ut){if(S>=p.count)break;Q.x+Math.cos(le)*(Ae*at)+Math.cos(le+Math.PI/2)*xt*(at===0?0:1),Q.z+Math.sin(le)*(Ae*at)+Math.sin(le+Math.PI/2)*xt*(at===0?0:1);let F=Q.x+Math.cos(le)*(Ae*(at===0?0:at)),kt=Q.z+Math.sin(le)*(Ae*(at===0?0:at));at===0?(F=Q.x+Math.cos(le+Math.PI/2)*xt,kt=Q.z+Math.sin(le+Math.PI/2)*xt):(F=Q.x+Math.cos(le)*(Ae*at)+Math.cos(le+Math.PI/2)*xt,kt=Q.z+Math.sin(le)*(Ae*at)+Math.sin(le+Math.PI/2)*xt),t.position.set(F,Tt,kt),t.scale.set(at===0?.12:1.05,.95,at===0?1.05:.12),t.rotation.set(0,-le,0),t.updateMatrix(),p.setMatrixAt(S++,t.matrix),L<y.count&&(t.position.set(F,Tt,kt),t.scale.set(at===0?.16:1.2,1.1,at===0?1.2:.16),t.updateMatrix(),y.setMatrixAt(L++,t.matrix))}b++}for(const H of h)H.castShadow=!0,H.receiveShadow=!0,this.scene.add(H);u.castShadow=!0,_.castShadow=!0,this.scene.add(u),this.scene.add(f),this.scene.add(g),this.scene.add(_),this.scene.add(m),this.scene.add(p),this.scene.add(y),this.scene.add(A),this.scene.add(M),this.scene.add(T);const B=new et(this.houseGeo,this.materials.driveway,Math.min(o.length,800));for(let H=0;H<o.length&&H<B.count;H++){const Q=o[H];t.position.set(Q.x,.04,Q.z),t.scale.set(2.4,.08,7),t.rotation.set(0,-Q.yaw,0),t.updateMatrix(),B.setMatrixAt(H,t.matrix)}this.scene.add(B);const Z=new et(this.houseGeo,this.materials.hedge,Math.min(a.length,900));for(let H=0;H<a.length&&H<Z.count;H++){const Q=a[H];ct(Q.x,Q.z,bt)&&(t.position.set(Q.x,.55,Q.z),t.scale.set(Q.len,1.1,.55),t.rotation.set(0,-Q.yaw,0),t.updateMatrix(),Z.setMatrixAt(H,t.matrix))}this.scene.add(Z);const ie=new Be(1,8,6),ce=new et(ie,this.materials.shrub,Math.min(r.length+200,1200));let ae=0;for(const H of r){if(ae>=ce.count)break;ct(H.x,H.z,bt)&&(t.position.set(H.x,.45*H.s,H.z),t.scale.set(H.s,H.s*.85,H.s),t.rotation.set(0,0,0),t.updateMatrix(),ce.setMatrixAt(ae++,t.matrix))}for(let H=0;H<nn.length;H+=2){const Q=nn[H],de=nn[(H+1)%nn.length],Ae=Math.atan2(de.y-Q.y,de.x-Q.x)+Math.PI/2;for(const Te of[-1,1]){const le=Q.x+Math.cos(Ae)*(Hi+1.5)*Te,He=Q.y+Math.sin(Ae)*(Hi+1.5)*Te;ct(le,He,Hi)&&(s.push({x:le,z:He}),ae<ce.count&&(t.position.set(le+Te*1.2,.35,He),t.scale.set(.8,.6,.8),t.updateMatrix(),ce.setMatrixAt(ae++,t.matrix)))}}this.scene.add(ce);const pe=Math.min(s.length,700),Ze=new et(this.palmTrunkGeo,this.materials.palmBark,pe),Je=new et(this.palmLeafGeo,this.materials.palmFrond,pe*6),tt=new et(this.palmLeafGeo,this.materials.palmFrondLite,pe*3);let ee=0,ue=0,oe=0;for(let H=0;H<s.length&&ee<pe;H++){const Q=s[H];if(!ct(Q.x,Q.z,Hi))continue;const de=5+H%6*.65,Ae=(H%5-2)*.04;t.position.set(Q.x,de/2,Q.z),t.scale.set(1,de,1),t.rotation.set(Ae,H*.7%Math.PI,-Ae*.5),t.updateMatrix(),Ze.setMatrixAt(ee,t.matrix);for(let Te=0;Te<6&&ue<Je.count;Te++){const le=Te/6*Math.PI*2+H*.2;t.position.set(Q.x+Math.cos(le)*.35,de+.2,Q.z+Math.sin(le)*.35),t.scale.set(1.25,1.15,1.25),t.rotation.set(.75,le,.2),t.updateMatrix(),Je.setMatrixAt(ue++,t.matrix)}for(let Te=0;Te<3&&oe<tt.count;Te++){const le=Te/3*Math.PI*2+.4;t.position.set(Q.x+Math.cos(le)*.2,de+.45,Q.z+Math.sin(le)*.2),t.scale.set(.95,.9,.95),t.rotation.set(.95,le,0),t.updateMatrix(),tt.setMatrixAt(oe++,t.matrix)}ee++}Ze.castShadow=!0,Je.castShadow=!0,this.scene.add(Ze),this.scene.add(Je),this.scene.add(tt)}addLandmarks(e){const t=lr(e??this.activeAreaId),n=this.areaTheme,s=new Set([t.squareLandmarkId,...t.recCenterIds]);for(const r of wn){if(!s.has(r.id)&&r.kind==="town-square"||r.kind==="rec-center"&&!s.has(r.id)||r.kind==="flavor")continue;const a=new Ot;a.position.set(r.x,0,r.y);let o=0,c=1;{let l=1/0;for(let h=0;h<nn.length;h+=2){const d=nn[h],u=(d.x-r.x)**2+(d.y-r.y)**2;if(u<l){l=u;const f=Math.hypot(r.x-d.x,r.y-d.y)||1;o=(r.x-d.x)/f,c=(r.y-d.y)/f}}}if(r.kind==="town-square"){const l=n.stucco,h=n.landmarkStyle;for(let _=0;_<12;_++){const m=_/12*Math.PI*2,p=h==="western"?30:28,y=Math.cos(m)*p,A=Math.sin(m)*p,M=r.x+y,T=r.y+A;if(!ct(M,T,un))continue;let b=7+_%3,R=6.4+_%2*1.4,x=5.5;h==="western"?(b=5.5+_%2,R=7.5+_%3*1.2,x=4.8):h==="lighthouse"?(b=7.5+_%2,R=5.8+_%3*.8,x=5.2):h==="midcentury"?(b=8+_%2*1.5,R=5.5+_%2,x=6):h==="modern"&&(b=7.5+_%3*.8,R=5.2+_%2*1.6,x=5.8);const w=new Y(this.houseGeo,re(l[_%l.length],.88,.18));if(w.position.set(y,R/2,A),w.scale.set(b,R,x),w.castShadow=!0,a.add(w),h==="southwest"){const S=new Y(this.houseGeo,this.materials.roof);S.position.set(y,R+.9,A),S.scale.set(b+1.2,1.6,x+1),a.add(S)}else if(h==="western"){const S=new Y(this.houseGeo,re(n.roofAlt,.75,.15));S.position.set(y*.96,R+.6,A*.96),S.scale.set(b+.4,2.2,.4),a.add(S);const L=new Y(this.houseGeo,this.materials.roof);L.position.set(y,R+.4,A),L.scale.set(b+.6,.5,x+.4),a.add(L)}else if(h==="lighthouse"){const S=new Y(this.houseGeo,_%2===0?this.materials.roof:this.materials.roofBlue);S.position.set(y,R+.85,A),S.scale.set(b+1,1.5,x+.8),a.add(S)}else if(h==="midcentury"){const S=new Y(this.houseGeo,this.materials.roof);S.position.set(y,R+.35,A),S.scale.set(b+1.4,.45,x+1.2),a.add(S);const L=new Y(this.houseGeo,re(n.roofAlt,.5,.25));L.position.set(y*.97,R+.55,A*.97),L.scale.set(b+1.5,.25,.35),a.add(L)}else{const S=new Y(this.houseGeo,_%2===0?this.materials.roofGreen:this.materials.roof);S.position.set(y,R+.55,A),S.scale.set(b+1.1,.7,x+.9),a.add(S)}const I=new Y(this.houseGeo,re(_%2===0?n.accent:n.roofAlt,.55,.18));I.position.set(y*.9,2.2,A*.9),I.scale.set(Math.min(b-.5,6.2),.22,1.35),a.add(I);const P=new Y(this.houseGeo,this.materials.window);P.position.set(y*.86,1.7,A*.86),P.scale.set(Math.min(b-1.5,4.2),1.5,.18),a.add(P)}Jv(a,n);const d=o*30,u=c*30;if(ct(r.x+d,r.y+u,un)){const _=new Y(new z(16,1.4,9),re(n.roof,.7,.25));_.position.set(d,.7,u),a.add(_);const m=new Y(new z(18,.3,10),re(n.plaza,.6,.2));m.position.set(d,4.2,u),a.add(m)}const f=o*18+c*10,g=c*18-o*10;if(ct(r.x+f,r.y+g,bt)){const _=this.makeSign(r.shortName,n.accent);_.position.set(f,0,g),a.add(_)}}else if(r.kind==="rec-center"){const l=o*8,h=c*8,d=new Y(this.houseGeo,re("#e8f4ec",.9,.25));if(d.position.set(l,3.5,h),d.scale.set(18,7,12),d.castShadow=!0,ct(r.x+l,r.y+h,un)){a.add(d);const _=new Y(this.houseGeo,this.materials.roofGreen);_.position.set(l,7.5,h),_.scale.set(20,1.5,14),a.add(_);const m=new Y(this.houseGeo,re("#cfe8d8",.7,.2));m.position.set(l+o*8,2.2,h+c*8),m.scale.set(6,.4,4),a.add(m)}const u=l+c*14,f=h-o*14;if(ct(r.x+u,r.y+f,bt+4)){const _=new Y(new z(10,.4,6),this.materials.water);_.position.set(u,.2,f),a.add(_);const m=new Y(new z(14,.12,10),this.materials.sand);m.position.set(u,.08,f),a.add(m)}const g=this.makeSign(r.shortName,this.areaTheme.accent);g.position.set(l+o*14,0,h+c*14),ct(r.x+g.position.x,r.y+g.position.z,bt)&&a.add(g)}else ct(r.x,r.y,bt)&&a.add(this.makeSign(r.shortName,"#ffffff"));this.scene.add(a)}}makeSign(e,t){const n=new Ot,s=new Y(new ze(.12,.12,4,6),re("#666",.5,.4));s.position.y=2,n.add(s);const r=new Y(new z(Math.max(6,e.length*.55),1.4,.2),re(t,.5,.4));r.position.y=4.2,n.add(r);const a=rr(e,"#1c2430",t);return a.position.set(0,4.2,.2),a.scale.set(8,2.2,1),n.add(a),n}addStreetFurniture(e){const t=new ze(.08,.12,3.8,6),n=new z(.08,.08,.9),s=new Be(.22,8,8),r=Math.min(Math.floor(e.length/3),280),a=new et(t,re("#4a4a52",.5,.4),r),o=new et(n,re("#4a4a52",.5,.4),r),c=new et(s,this.materials.lamp,r),l=new lt;let h=0;const d=bt+.8;for(let x=0;x<e.length&&h<r;x+=3){const w=e[x],I=Math.cos(w.angle+Math.PI/2),P=Math.sin(w.angle+Math.PI/2),S=x%6<3?1:-1,L=w.x+I*d*S,O=w.y+P*d*S;ct(L,O,bt)&&(l.position.set(L,1.9,O),l.scale.set(1,1,1),l.rotation.set(0,0,0),l.updateMatrix(),a.setMatrixAt(h,l.matrix),l.position.set(L+I*S*.35,3.7,O+P*S*.35),l.scale.set(1,1,1),l.rotation.set(0,-w.angle,0),l.updateMatrix(),o.setMatrixAt(h,l.matrix),l.position.set(L+I*S*.7,3.55,O+P*S*.7),l.rotation.set(0,0,0),l.updateMatrix(),c.setMatrixAt(h,l.matrix),h++)}this.scene.add(a),this.scene.add(o),this.scene.add(c);const u=new z(.35,.55,.45),f=new ze(.06,.06,.9,6),g=new et(u,re("#c45c3a",.6,.25),120),_=new et(f,re("#6b5a45",.8,.2),120);let m=0;for(let x=2;x<e.length&&m<120;x+=5){const w=e[x],I=Math.cos(w.angle+Math.PI/2),P=Math.sin(w.angle+Math.PI/2),S=x%10<5?1:-1,L=w.x+I*(bt+1.2)*S,O=w.y+P*(bt+1.2)*S;ct(L,O,bt)&&(l.position.set(L,.45,O),l.scale.set(1,1,1),l.rotation.set(0,0,0),l.updateMatrix(),_.setMatrixAt(m,l.matrix),l.position.set(L,1.05,O),l.updateMatrix(),g.setMatrixAt(m,l.matrix),m++)}this.scene.add(_),this.scene.add(g);const p=new ze(.18,.22,.7,8),y=new et(p,re(vr.sunset,.55,.3),60);let A=0;for(let x=4;x<e.length&&A<60;x+=11){const w=e[x],I=Math.cos(w.angle+Math.PI/2),P=Math.sin(w.angle+Math.PI/2),S=w.x+I*(bt+.5),L=w.y+P*(bt+.5);ct(S,L,bt)&&(l.position.set(S,.35,L),l.scale.set(1,1,1),l.updateMatrix(),y.setMatrixAt(A++,l.matrix))}this.scene.add(y);const M=new z(.12,.55,.12),T=Math.min(Math.floor(e.length/2),320),b=new et(M,re("#c8cdd4",.45,.45),T);let R=0;for(let x=0;x<e.length&&R<T;x+=2){const w=e[x],I=Math.cos(w.angle+Math.PI/2),P=Math.sin(w.angle+Math.PI/2);for(const S of[-1,1]){if(R>=T)break;const L=w.x+I*(gt+Wi*.55)*S,O=w.y+P*(gt+Wi*.55)*S;l.position.set(L,.35,O),l.scale.set(1,1,1),l.rotation.set(0,0,0),l.updateMatrix(),b.setMatrixAt(R++,l.matrix)}}this.scene.add(b)}addRoadsideDetail(e){const t=new lt,n=[re("#e85d4c",.7,.15),re("#e8b84a",.7,.15),re("#f0f0f8",.7,.1),re("#c45c9a",.7,.15),re("#3aa6c9",.7,.15)],s=new z(1,.25,2.2),r=new Be(.22,8,6),a=new et(s,re("#5a4030",.9,.15),160),o=n.map(M=>new et(r,M,200)),c=o.map(()=>0);let l=0;for(let M=1;M<e.length&&l<a.count;M+=4){const T=e[M],b=Math.cos(T.angle+Math.PI/2),R=Math.sin(T.angle+Math.PI/2),x=M%8<4?1:-1,w=T.x+b*(bt+2.8)*x,I=T.y+R*(bt+2.8)*x;if(ct(w,I,bt+1)){t.position.set(w,.14,I),t.scale.set(1,1,1),t.rotation.set(0,-T.angle,0),t.updateMatrix(),a.setMatrixAt(l++,t.matrix);for(let P=0;P<5;P++){const S=(M+P)%o.length;c[S]>=o[S].count||(t.position.set(w+Math.cos(T.angle)*(P-2)*.35+b*x*.15,.38,I+Math.sin(T.angle)*(P-2)*.35+R*x*.15),t.scale.set(.7+P%3*.15,.7,.7),t.rotation.set(0,0,0),t.updateMatrix(),o[S].setMatrixAt(c[S]++,t.matrix))}}}this.scene.add(a);for(const M of o)this.scene.add(M);const h=new z(.12,1,2.4),d=new z(.16,1.2,.16),u=new et(h,this.materials.fence,280),f=new et(d,re("#ddd6c8",.75,.15),280);let g=0;for(let M=0;M<e.length&&g<u.count;M+=3){const T=e[M],b=Math.cos(T.angle+Math.PI/2),R=Math.sin(T.angle+Math.PI/2);for(const x of[-1,1]){if(g>=u.count)break;const w=un+2+M%5,I=T.x+b*w*x,P=T.y+R*w*x;ct(I,P,un)&&(t.position.set(I,.55,P),t.scale.set(1,1,1),t.rotation.set(0,-T.angle+Math.PI/2,0),t.updateMatrix(),u.setMatrixAt(g,t.matrix),t.position.set(I,.65,P),t.rotation.set(0,0,0),t.updateMatrix(),f.setMatrixAt(g,t.matrix),g++)}}this.scene.add(u),this.scene.add(f);const _=new ze(.06,.07,3.2,6),m=new z(1.8,.35,.08),p=new et(_,re("#6a6a72",.5,.4),40),y=new et(m,re("#1f6b4a",.5,.25),40);let A=0;for(let M=0;M<e.length&&A<40;M+=Math.floor(e.length/40)){const T=e[M],b=Math.cos(T.angle+Math.PI/2),R=Math.sin(T.angle+Math.PI/2),x=T.x+b*(bt+1.5),w=T.y+R*(bt+1.5);ct(x,w,bt)&&(t.position.set(x,1.6,w),t.scale.set(1,1,1),t.rotation.set(0,0,0),t.updateMatrix(),p.setMatrixAt(A,t.matrix),t.position.set(x,3,w),t.rotation.set(0,-T.angle,0),t.updateMatrix(),y.setMatrixAt(A,t.matrix),A++)}this.scene.add(p),this.scene.add(y)}addSkyDecor(){const e=new Be(1,12,10),t=new et(e,this.materials.cloud,120),n=new lt,s=hd(99);let r=0;for(let c=0;c<36&&r<120;c++){const l=Kt.minX+s()*Kt.width,h=48+s()*40,d=Kt.minY+s()*Kt.height,u=7+s()*10;for(let f=0;f<3&&r<120;f++){n.position.set(l+(f-1)*u*.55,h+(f===1?u*.15:0),d+(s()-.5)*u*.3);const g=u*(.7+s()*.5);n.scale.set(g*1.5,g*.65,g*1.1),n.updateMatrix(),t.setMatrixAt(r++,n.matrix)}}this.scene.add(t);const a=new Be(1,16,10),o=new et(a,re("#5a9a62",.95,.08),24);for(let c=0;c<24;c++){const l=c/24*Math.PI*2,h=Math.max(Kt.width,Kt.height)*.48,d=(Kt.minX+Kt.maxX)/2+Math.cos(l)*h,u=(Kt.minY+Kt.maxY)/2+Math.sin(l)*h;n.position.set(d,-8,u),n.scale.set(40+c%5*8,18+c%3*4,40+c%4*6),n.rotation.set(0,0,0),n.updateMatrix(),o.setMatrixAt(c,n.matrix)}this.scene.add(o)}ensureRacers(e,t){for(const n of e)if(!this.racerMeshes.has(n.id)){const s=Vv(n.cart,n.driver,n.isPlayer,this.materials,n.isPlayer?n.name:void 0,n.isPlayer?t??null:null);this.scene.add(s),this.racerMeshes.set(n.id,s)}}syncProjectiles(e){const t=new Set;for(const n of e){t.add(n.id);let s=this.projectileMeshes.get(n.id);s||(s=Tu(n.kind),this.scene.add(s),this.projectileMeshes.set(n.id,s));const r=n.kind==="fireball"?1.1+Math.sin(this.clock*18)*.08:.85+Math.sin(this.clock*10+n.id)*.05;if(s.position.set(n.x,r,n.y),s.rotation.y=Math.atan2(n.vy,n.vx),s.rotation.x=n.spin*.35,s.rotation.z=n.spin*.2,n.kind==="fireball"){const a=1+Math.sin(this.clock*22+n.id)*.18;s.scale.setScalar(a)}}for(const[n,s]of this.projectileMeshes)t.has(n)||(this.scene.remove(s),this.projectileMeshes.delete(n))}syncAmmoPickups(e){const t=new Set;for(const n of e){t.add(n.id);let s=this.pickupMeshes.get(n.id);if(s||(s=jv(n.kind),this.scene.add(s),this.pickupMeshes.set(n.id,s)),s.visible=n.active,!n.active)continue;const r=.35+Math.sin(n.phase)*.12;s.position.set(n.x,r,n.y),s.rotation.y=n.phase*.6}for(const[n,s]of this.pickupMeshes)t.has(n)||(this.scene.remove(s),this.pickupMeshes.delete(n))}syncSolids(e){for(const t of e)if(!(t.kind==="landmark"||t.kind==="gate"||t.kind==="island")&&t.destroyed){const n=this.solidMarkers.get(t.id);n&&(this.scene.remove(n),this.solidMarkers.delete(t.id))}}markSolidDestroyed(e){const t=this.solidMarkers.get(e);t&&(this.scene.remove(t),this.solidMarkers.delete(e))}syncHazards(e){const t=new Set;for(const n of e){if(!n.active)continue;t.add(n.id);let s=this.hazardMeshes.get(n.id);if(s&&!s.isSprite&&_u(n.type)&&(this.scene.remove(s.root),this.hazardMeshes.delete(n.id),s=void 0),!s){const o=ey(n);s={id:n.id,root:o.root,isSprite:o.isSprite,sprite:o.sprite,baseScaleX:o.sprite?Math.abs(o.sprite.scale.x):1,baseScaleY:o.sprite?o.sprite.scale.y:1},this.scene.add(s.root),this.hazardMeshes.set(n.id,s)}const r=n.type==="golf-ball"?Math.abs(Math.sin(this.clock*8+n.phase))*.35:n.type==="turtle"?Math.sin(this.clock*2+n.phase)*.04:n.type==="lightning"?Math.sin(this.clock*6+n.phase)*.08:0,a=this.elevAt(n.x,n.y,this.lastSamples);if(s.root.position.set(n.x,r+a,n.y),!s.isSprite)s.root.rotation.y=-n.angle+Math.PI/2;else if(s.sprite&&s.baseScaleX){ty(n,this.camera);const o=wM[n.type]?1:-1,c=n.faceSign*o,l=n.type==="lightning"?.94+Math.sin(this.clock*18+n.phase)*.08:1;s.sprite.scale.x=s.baseScaleX*c*l,s.sprite.scale.y=(s.baseScaleY??s.baseScaleX)*l}}for(const[n,s]of this.hazardMeshes)t.has(n)||(this.scene.remove(s.root),this.hazardMeshes.delete(n))}elevAt(e,t,n){const s=n??[];if(!s.length){let c=0,l=1/0;for(const h of nn){const d=(h.x-e)**2+(h.y-t)**2;d<l&&(l=d,c=h.elev??0)}return c}let r=0,a=1/0;const o=Math.max(1,Math.floor(s.length/300));for(let c=0;c<s.length;c+=o){const l=s[c],h=(l.x-e)**2+(l.y-t)**2;h<a&&(a=h,r=l.elev??0)}return r}lastSamples=[];updateRacers(e,t){t&&(this.lastSamples=t);for(const n of e){const s=this.racerMeshes.get(n.id);if(!s)continue;const r=this.elevAt(n.x,n.y,this.lastSamples);s.position.set(n.x,.15+r,n.y),s.rotation.y=-n.angle+Math.PI/2}}updateCamera(e,t){const n=Math.min(1,Math.abs(e.speed)/36),s=this.elevAt(e.x,e.y,this.lastSamples),r=11+n*3.5,a=6.2+n*1.2+s,o=32+n*8,c=1.1+n*.3+s,l=e.x-Math.cos(e.angle)*r,h=e.y-Math.sin(e.angle)*r;if(this.tmp.set(l,a,h),this.lookAhead.set(e.x+Math.cos(e.angle)*o,c,e.y+Math.sin(e.angle)*o),this.cameraNeedsSnap)this.camPos.copy(this.tmp),this.camTarget.copy(this.lookAhead),this.cameraNeedsSnap=!1;else{const d=1-Math.pow(2e-4,t);this.camPos.lerp(this.tmp,d),this.camTarget.lerp(this.lookAhead,Math.min(1,d*1.25))}this.camera.position.copy(this.camPos),this.camera.lookAt(this.camTarget)}render(e){this.clock+=e,this.renderer.render(this.scene,this.camera)}resize(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t,!1)}dispose(){this.renderer.dispose()}renderMenuBackdrop(e){this.scene.background=new Ue().setHSL(.35+Math.sin(e*2e-4)*.02,.45,.35),this.camera.position.set(0,40,80),this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera)}}function re(i,e,t){return new zt({color:i,roughness:e,metalness:t})}function Jv(i,e){const t=e.landmarkStyle,n=new Y(new ze(14,14,.18,28),re(e.plaza,.85,.08));if(n.position.y=.09,n.receiveShadow=!0,i.add(n),t==="lighthouse"){const s=new Y(new ze(2.4,2.8,1.2,12),re("#d8e4ec",.75,.15));s.position.y=.6,i.add(s);const r=new Y(new ze(1.35,1.85,14,14),re("#f4f8fc",.65,.18));r.position.y=8,r.castShadow=!0,i.add(r);for(const l of[4.5,9.5,13]){const h=new Y(new ze(1.5,1.5,1.1,14),re(l===9.5?e.accent:"#c45c48",.5,.25));h.position.y=l,i.add(h)}const a=new Y(new ze(2.1,1.55,2.2,10),re("#e8b84a",.35,.45));a.position.y=16,i.add(a);const o=new Y(new Be(.65,12,12),new zt({color:"#fff8c0",emissive:"#ffe080",emissiveIntensity:.9,roughness:.2,metalness:.5}));o.position.y=17.6,i.add(o);const c=new Y(new z(3.2,.35,10),re("#8b6a4a",.8,.1));c.position.set(0,.25,12),i.add(c)}else if(t==="western"){const s=new Y(new ze(.28,.38,13,8),re("#6b5344",.8,.15));s.position.y=6.5,s.castShadow=!0,i.add(s);for(let c=0;c<4;c++){const l=c*Math.PI/2,h=new Y(new z(.28,5.2,.9),re("#c4a574",.75,.12));h.position.set(Math.cos(l)*2.6,13,Math.sin(l)*2.6),h.rotation.z=l,i.add(h)}for(const[c,l]of[[-2.2,-2.2],[2.2,-2.2],[-2.2,2.2],[2.2,2.2]]){const h=new Y(new ze(.12,.16,7,6),re("#5a4030",.85,.15));h.position.set(9+c,3.5,l),i.add(h)}const r=new Y(new ze(2.6,2.6,3.2,14),re("#8b7355",.7,.22));r.position.set(9,8.5,0),r.castShadow=!0,i.add(r);const a=new Y(new yr(3,1.4,10),re(e.roof,.7,.2));a.position.set(9,10.8,0),i.add(a);const o=new Y(new z(8,.15,.15),re("#4a3428",.85,.1));o.position.set(-6,1.1,6),i.add(o)}else if(t==="southwest"){const s=new Y(new ze(5.2,5.8,1.1,20),re(e.plaza,.75,.15));s.position.y=.55,s.castShadow=!0,i.add(s);const r=new Y(new ze(4.2,4.2,.55,20),re(e.water,.12,.55));r.position.y=1.15,i.add(r);const a=new Y(new ze(2.2,2.6,1.4,14),re(e.stucco[1]??e.stucco[0],.8,.12));a.position.y=1.9,i.add(a);const o=new Y(new ze(.28,.45,2.8,8),re(e.accent,.45,.35));o.position.y=3.6,i.add(o);const c=new Y(new Be(.45,10,10),re(e.water,.2,.4));c.position.y=5.2,i.add(c);for(let l=0;l<6;l++){const h=l/6*Math.PI*2,d=new Y(new ze(.55,.7,1.1,8),re(e.roof,.7,.15));d.position.set(Math.cos(h)*8,.55,Math.sin(h)*8),i.add(d);const u=new Y(new Be(.55,8,8),re(e.grassDeep,.9,.05));u.position.set(Math.cos(h)*8,1.35,Math.sin(h)*8),i.add(u)}}else if(t==="midcentury"){const s=new Y(new z(14,.35,14),re(e.plaza,.7,.15));s.position.y=.18,i.add(s);for(const[l,h]of[[-5,-5],[5,-5],[-5,5],[5,5]]){const d=new Y(new ze(.32,.38,7,10),re(e.stucco[0],.75,.18));d.position.set(l,3.6,h),d.castShadow=!0,i.add(d)}const r=new Y(new z(16,.28,16),re(e.roof,.55,.28));r.position.y=7.2,r.rotation.x=.06,i.add(r);const a=new Y(new z(16.2,.35,.6),re(e.roofAlt,.5,.25));a.position.set(0,7.35,0),i.add(a);const o=new Y(new z(4,.9,4),re(e.accent,.45,.3));o.position.y=.55,i.add(o);const c=new Y(new z(3.2,.25,3.2),re(e.water,.15,.5));c.position.y=1.05,i.add(c)}else{const s=new Y(new ze(11,11,.22,28),re(e.plaza,.7,.15));s.position.y=.12,i.add(s);for(let o=0;o<8;o++){const c=o/8*Math.PI*2,l=Math.cos(c)*7.5,h=Math.sin(c)*7.5,d=new Y(new ze(.12,.16,5.5,6),re("#5a7060",.75,.15));d.position.set(l,2.75,h),i.add(d);const u=new Y(new Be(1.4,10,10),re(o%2===0?e.accent:e.grass,.55,.1));u.position.set(l,5.6,h),u.scale.y=.55,i.add(u)}const r=new Y(new Zt(2.8,.45,10,28),re(e.accent,.35,.45));r.position.y=3.8,r.rotation.x=Math.PI/2.4,i.add(r);const a=new Y(new z(8,.5,4),re(e.roof,.7,.2));a.position.set(0,.35,10),i.add(a)}}function Tu(i){const e=new Ot;if(i==="golf-ball"){const t=new Y(new Be(.38,24,20),new zt({color:"#f7f7f2",roughness:.45,metalness:.08}));t.castShadow=!0,e.add(t);for(let s=0;s<18;s++){const r=Math.acos(1-2*(s+.5)/18),a=Math.PI*(1+Math.sqrt(5))*s,o=.36,c=new Y(new Be(.035,6,6),re("#d8d8d4",.6,.05));c.position.set(o*Math.sin(r)*Math.cos(a),o*Math.sin(r)*Math.sin(a),o*Math.cos(r)),e.add(c)}const n=new Y(new Be(.42,12,10),new zt({color:"#ffffff",roughness:.2,metalness:.1,transparent:!0,opacity:.15}));e.add(n)}else if(i==="fireball"){const t=new Y(new Be(.28,16,14),new zt({color:"#1a0800",roughness:.9,metalness:.1,emissive:"#ff2200",emissiveIntensity:.8}));t.castShadow=!0,e.add(t);const n=new Y(new Be(.42,14,12),new zt({color:"#ff5510",roughness:.5,metalness:.15,emissive:"#ff4400",emissiveIntensity:.6,transparent:!0,opacity:.92}));e.add(n);const s=new Y(new Be(.58,12,10),new zt({color:"#ffcc33",roughness:.35,metalness:.1,emissive:"#ffaa00",emissiveIntensity:.45,transparent:!0,opacity:.45}));e.add(s);for(let r=0;r<4;r++){const a=r/4*Math.PI*2,o=new Y(new yr(.14,.55,6),new zt({color:r%2===0?"#ff6622":"#ffdd44",roughness:.4,emissive:"#ff6600",emissiveIntensity:.5,transparent:!0,opacity:.75}));o.position.set(Math.cos(a)*.15,Math.sin(a)*.15,-.45),o.rotation.x=Math.PI/2,e.add(o)}}else{const t=new zt({color:"#e0b85a",roughness:.95,metalness:.02}),n=re("#c49a40",.98,.02),s=new Y(new Be(.42,16,12),t);s.scale.set(1.15,.85,1),s.castShadow=!0,e.add(s);for(let a=0;a<22;a++){const o=Math.acos(1-2*(a+.5)/22),c=Math.PI*(1+Math.sqrt(5))*a,l=.38,h=new Y(new Be(.06,6,6),n);h.position.set(l*Math.sin(o)*Math.cos(c)*1.15,l*Math.sin(o)*Math.sin(c)*.85,l*Math.cos(o)),e.add(h)}const r=new Y(new Zt(.22,.035,6,14),re("#8b6914",.85,.1));r.position.set(.35,.15,0),r.rotation.y=Math.PI/2,e.add(r);for(let a=0;a<6;a++){const o=new Y(new ze(.015,.02,.35,4),re("#d4a84a",.9,.05));o.position.set((a-2.5)*.08,.25,.2),o.rotation.z=(a-2.5)*.15,o.rotation.x=.4,e.add(o)}}return e}function jv(i){const e=new Ot,t=i==="fireball"?"#e85d4c":i==="loofah"?"#e8b84a":"#3aa6c9",n=new Y(new ze(1.4,1.5,.12,20),new zt({color:t,roughness:.4,metalness:.35,emissive:t,emissiveIntensity:.35}));n.receiveShadow=!0,e.add(n);const s=new Y(new Zt(1.05,.08,8,24),new zt({color:"#fff8ee",roughness:.3,metalness:.4,emissive:"#ffffff",emissiveIntensity:.2}));s.rotation.x=Math.PI/2,s.position.y=.1,e.add(s);const r=Tu(i);r.scale.setScalar(.85),r.position.y=.85,e.add(r);const a=rr(`${al(i)} ${ki(i)}`,"#1c2430","rgba(255,248,238,0.9)");return a.position.set(0,1.6,0),a.scale.set(3.2,.9,1),e.add(a),e}function ni(i,e){const t=Math.min(i.length,e.length),n=[],s=[],r=[],a=[];for(let c=0;c<t;c++){const l=i[c],h=e[c];if(n.push(l.x,l.y,l.z,h.x,h.y,h.z),s.push(0,1,0,0,1,0),r.push(0,c*.1,1,c*.1),c<t-1){const d=c*2,u=d+1,f=d+2,g=d+3;a.push(d,u,f,u,g,f)}}const o=new qt;return o.setAttribute("position",new pt(n,3)),o.setAttribute("normal",new pt(s,3)),o.setAttribute("uv",new pt(r,2)),o.setIndex(a),o.computeBoundingSphere(),o.computeBoundingBox(),o}function Qv(i,e){let t=1/0,n=-1/0,s=1/0,r=-1/0;for(const a of i)t=Math.min(t,a.x),n=Math.max(n,a.x),s=Math.min(s,a.y),r=Math.max(r,a.y);return Number.isFinite(t)?{minX:t-e,maxX:n+e,minY:s-e,maxY:r+e,cx:(t+n)/2,cz:(s+r)/2}:{minX:-200,maxX:200,minY:-200,maxY:200,cx:0,cz:0}}function ey(i){const e=new Ot,t=xu(i.type);if(t){const a=new Y(new vn(.7,16),new si({color:"#1c2430",transparent:!0,opacity:.28,depthWrite:!1}));return a.rotation.x=-Math.PI/2,a.position.y=.04,e.add(a),e.add(t),{root:e,isSprite:!0,sprite:t}}const n=ga[i.type],s=n.scale*.55,r=new Y(new Be(.55*s,12,10),re(n.color,.55,.2));return r.position.y=.55*s,r.castShadow=!0,e.add(r),{root:e,isSprite:!1}}const xs=new D,No=new D,ld=new Yn;function ty(i,e){const t=Math.hypot(i.vx,i.vy),n=t>.12?i.vx:Math.cos(i.angle),s=t>.12?i.vy:Math.sin(i.angle);ld.copy(e.quaternion).invert(),No.set(n,0,s).applyQuaternion(ld),xs.set(1,0,0).applyQuaternion(e.quaternion),xs.y=0,xs.lengthSq()>1e-6&&xs.normalize();const r=n*xs.x+s*xs.z,a=Math.abs(No.x)>.08?No.x:r,o=.18;a>o?i.faceSign=1:a<-o&&(i.faceSign=-1)}function rr(i,e,t){const n=document.createElement("canvas");n.width=512,n.height=128;const s=n.getContext("2d");s.clearRect(0,0,512,128),t!=="transparent"&&(s.fillStyle=t,ny(s,8,16,496,96,24),s.fill()),s.fillStyle=e,s.font="bold 48px DM Sans, system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,256,64);const r=new Na(n);r.colorSpace=wt;const a=new La({map:r,transparent:!0,depthTest:!0});return new Kc(a)}function ny(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function hd(i){return function(){let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function iy(i,e,t,n){const s=i.canvas.width,r=i.canvas.height;i.clearRect(0,0,s,r);const a=i.createRadialGradient(s/2,r/2,10,s/2,r/2,s*.7);a.addColorStop(0,"#1a5a3c"),a.addColorStop(1,"#0c2e20"),i.fillStyle=a,i.fillRect(0,0,s,r);let o=1/0,c=-1/0,l=1/0,h=-1/0;for(let M=0;M<t.length;M+=3){const T=t[M];o=Math.min(o,T.x),c=Math.max(c,T.x),l=Math.min(l,T.y),h=Math.max(h,T.y)}Number.isFinite(o)||(o=Kt.minX,c=Kt.maxX,l=Kt.minY,h=Kt.maxY);const d=28;o-=d,c+=d,l-=d,h+=d;const u=Math.max(40,c-o),f=Math.max(40,h-l),g=Math.min(s/u,r/f)*.92,_=(s-u*g)/2,m=(r-f*g)/2,p=M=>_+(M-o)*g,y=M=>r-(m+(M-l)*g);i.fillStyle="rgba(61, 155, 95, 0.35)",i.fillRect(0,0,s,r),i.strokeStyle="rgba(70, 76, 88, 0.98)",i.lineWidth=9,i.lineJoin="round",i.lineCap="round",i.beginPath();for(let M=0;M<t.length;M+=2){const T=t[M];M===0?i.moveTo(p(T.x),y(T.y)):i.lineTo(p(T.x),y(T.y))}if(i.closePath(),i.stroke(),i.strokeStyle="rgba(245, 208, 64, 0.9)",i.lineWidth=2.2,i.stroke(),t[0]){const M=t[0];i.fillStyle="#e85d4c",i.beginPath(),i.arc(p(M.x),y(M.y),4.5,0,Math.PI*2),i.fill(),i.fillStyle="#fff",i.font="bold 8px DM Sans, sans-serif",i.textAlign="center",i.fillText("S",p(M.x),y(M.y)+3)}for(const M of wn)M.kind==="town-square"&&(M.x<o-40||M.x>c+40||M.y<l-40||M.y>h+40||(i.fillStyle=vr.gold,i.beginPath(),i.arc(p(M.x),y(M.y),3.5,0,Math.PI*2),i.fill(),i.fillStyle="rgba(255,255,255,0.85)",i.font="bold 7px DM Sans, sans-serif",i.textAlign="center",i.fillText(M.shortName.slice(0,10),p(M.x),y(M.y)-6)));for(const M of n)M.active&&(i.fillStyle="rgba(232, 93, 76, 0.85)",i.beginPath(),i.arc(p(M.x),y(M.y),2,0,Math.PI*2),i.fill());const A=[...e].sort((M,T)=>(M.isPlayer?1:0)-(T.isPlayer?1:0));for(const M of A){const T=p(M.x),b=y(M.y);M.isPlayer?(i.save(),i.translate(T,b),i.rotate(-M.angle),i.fillStyle=vr.gold,i.beginPath(),i.moveTo(7,0),i.lineTo(-5,4.5),i.lineTo(-5,-4.5),i.closePath(),i.fill(),i.strokeStyle="#1c2430",i.lineWidth=1,i.stroke(),i.restore(),i.fillStyle="#fff",i.font="bold 8px DM Sans, sans-serif",i.textAlign="center",i.fillText("YOU",T,b+12)):(i.fillStyle=M.cart.color,i.beginPath(),i.arc(T,b,3.2,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(255,255,255,0.5)",i.lineWidth=1,i.stroke())}}const sy=document.getElementById("game"),Eu=document.getElementById("ui"),Rt=new xM;let Dc=null,Bt=new Zv(sy),rt=null,rn="loading",Nc=null,Au=!1,Uc=0,dl=!1;const mn=new jM(Eu,{onStartSelect:()=>{rn="area",mn.showAreaSelect()},onShowHow:()=>{rn="how",mn.showHow()},onShowLeaderboard:()=>{},onShowDonate:()=>{rn="menu",mn.showDonate()},onBackMenu:()=>{ry()},onRace:i=>dd(i),onPlayAgain:()=>{Nc?dd(Nc):(Rt.enabled=!1,Rt.reset(),rn="area",mn.showAreaSelect())},onStopRace:()=>{rn==="race"&&rt&&!rt.finished&&rt.stopEarly()},onTouch:(i,e)=>{i==="throttle"&&Rt.set({throttle:e}),i==="brake"&&Rt.set({brake:e}),i==="left"&&Rt.set({left:e}),i==="right"&&Rt.set({right:e}),i==="fire"&&Rt.set({fire:e})},onRecenterTilt:()=>Rt.recenterTilt()});function Ru(){const i=window.innerWidth,e=window.innerHeight;Bt.resize(i,e)}function dd(i){Nc=i,Au=!1,Rt.reset(),Rt.enabled=!0,su()?Rt.startTilt().then(t=>{if(rn==="race"){if(!t){mn.setDrivePadMode("buttons");return}window.setTimeout(()=>{rn==="race"&&!Rt.tilt.ready&&mn.setDrivePadMode("buttons")},1600)}}):Rt.stopTilt(),Dc&&Bt.setMaterials(Dc.materials),rt=new qM({playerName:i.playerName,cartId:i.cartId,driverId:i.driverId,areaId:i.areaId,difficultyId:i.difficultyId}),Bt.buildWorld(rt.samples,rt.decor,rt.areaId),Bt.ensureRacers(rt.racers,$i()),Bt.snapCameraToPlayer(rt.getPlayer()),Bt.render(0),dl=!0,rn="race";const e=Ei.playForArea(i.areaId);mn.showRaceHud({musicLabel:`${e.title} — ${e.vibe}`,musicMuted:Ei.isMuted()}),Uc=performance.now()}function ry(){Rt.enabled=!1,Rt.stopTilt(),Rt.reset(),Ei.stop(),rt=null,dl=!1,rn="menu",mn.showMenu()}function Cu(i){requestAnimationFrame(Cu);const e=Math.min(.05,(i-Uc)/1e3||.016);if(Uc=i,rn==="race"&&rt){Rt.update(e),rt.update(e,Rt),Bt.ensureRacers(rt.racers,$i()),Bt.updateRacers(rt.racers,rt.samples),Bt.syncHazards(rt.hazards),Bt.syncProjectiles(rt.projectiles),Bt.syncSolids(rt.solids),Bt.syncAmmoPickups(rt.ammoPickups),Bt.updateGates(rt.time),Bt.updateCamera(rt.getPlayer(),e),Bt.render(e);const t=rt.getPlayer(),n=rt.events.find(o=>o.kind==="banner"),s=rt.events.find(o=>o.kind==="toast"||o.kind==="checkpoint"),r=s?s.sub?`${s.text} — ${s.sub}`:s.text:rt.upcomingHazard?rt.upcomingHazard:null;mn.updateHud({place:t.place,lap:t.lap,laps:_a,score:t.score,time:rt.time,playerName:t.name,areaName:rt.areaName,ammoLabel:`${al(rt.playerAmmo)} ${t.ammo}/${sr}`,banner:n?.text??null,toast:r,landmark:s||rt.upcomingHazard?null:rt.nearbyLandmark});const a=mn.getMiniMapCanvas();if(a){const o=a.getContext("2d");o&&iy(o,rt.racers,rt.samples,rt.hazards)}rt.finished&&(Rt.enabled=!1,Rt.stopTilt(),Rt.reset(),Ei.stop(),rn="results",mn.showResults(rt.getResult(),Au))}else rn!=="loading"?(Rt.enabled&&(Rt.enabled=!1,Rt.reset()),dl?Bt.render(e):Bt.renderMenuBackdrop(i)):Bt.renderMenuBackdrop(i)}Eu.innerHTML=`
  <div class="screen">
    <p class="brand-kicker">Art pack loading</p>
    <h1>The Villages Golf Cart Hero</h1>
    <p class="tagline">Loading photoreal texture packs for carts, houses, palms &amp; terrain…</p>
    <div class="panel tight" style="text-align:center">
      <p style="margin:0;color:var(--muted)">This only happens once at startup.</p>
    </div>
  </div>
`;Ru();window.addEventListener("resize",Ru);requestAnimationFrame(Cu);async function ud(){const i=new URLSearchParams(window.location.search),e=i.get("donate"),t=i.get("session_id");if(e||t){const n=window.location.pathname||"/";window.history.replaceState({},"",n)}if(e==="canceled")return"Checkout canceled — no charge. You can tip anytime from the menu.";if(e==="success"&&t){const n=await oM(t);return n.ok?n.message||(n.tier?`Thanks! $${n.amountUsd} tip recorded — ${n.tier===5?"Gold":n.tier===3?"Blue":"Red"} flag unlocked.`:"Thanks for the tip!"):n.error||"Could not verify tip. If you were charged, the flag may still unlock after refresh."}return null}tM().then(async i=>{Dc=i,Bt.setMaterials(i.materials);const e=Object.keys(i.textures).length;console.info(`[assets] Loaded ${e} textures`);const t=await ud();rn="menu",mn.showMenu({donateBanner:t})}).catch(async i=>{console.error("[assets] Load failed, using solid materials",i);const e=await ud();rn="menu",mn.showMenu({donateBanner:e})});window.addEventListener("keydown",i=>{if(rn!=="race")return;const e=i.target;if(e instanceof HTMLElement){const t=e.tagName;if(t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.isContentEditable)return}["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(i.key)&&i.preventDefault()},{passive:!1});

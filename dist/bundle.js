(()=>{var t={36:(t,e,r)=>{const n=r(899),{HeaderProperty:s,NoneProperty:i,BoolProperty:a,IntProperty:o,UInt32Property:y,Int64Property:p,StrProperty:h,EnumProperty:u,FloatProperty:c,StructProperty:l,ArrayProperty:d,MulticastInlineDelegateProperty:w,MapProperty:f,SetProperty:g,ObjectProperty:P,FileEndProperty:U}=r(61);function m(t){switch(t.type){case"HeaderProperty":return Object.setPrototypeOf(t,s.prototype);case"NoneProperty":return Object.setPrototypeOf(t,i.prototype);case"BoolProperty":return Object.setPrototypeOf(t,a.prototype);case"IntProperty":return Object.setPrototypeOf(t,o.prototype);case"UInt32Property":return Object.setPrototypeOf(t,y.prototype);case"Int64Property":return Object.setPrototypeOf(t,p.prototype);case"StrProperty":return Object.setPrototypeOf(t,h.prototype);case"EnumProperty":return Object.setPrototypeOf(t,u.prototype);case"FloatProperty":return Object.setPrototypeOf(t,c.prototype);case"StructProperty":return Object.setPrototypeOf(t,l.prototype);case"ArrayProperty":return Object.setPrototypeOf(t,d.prototype);case"MulticastInlineDelegateProperty":return Object.setPrototypeOf(t,w.prototype);case"MapProperty":return Object.setPrototypeOf(t,f.prototype);case"SetProperty":return Object.setPrototypeOf(t,g.prototype);case"ObjectProperty":return Object.setPrototypeOf(t,P.prototype);case"FileEndProperty":return Object.setPrototypeOf(t,U.prototype);default:throw new Error("Unknown property type: "+t.type)}}t.exports={convertSavToJson:function(t){const e=new n(t).readWholeBuffer();return JSON.stringify(e,null,2)},convertJsonToSav:function(t){let e=new Uint8Array(0);for(const r of JSON.parse(t))m(r),e=new Uint8Array([...e,...r.toBytes()]);return e},assignPrototype:m}},973:(t,e,r)=>{const n=r(358);class s{static padding=new Uint8Array([0,0,0,0]);static unknown=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);type="ArrayProperty";constructor(t,e){this.name=t;const r=e.readUInt32();if(e.readBytes(4),this.subtype=e.readString(),e.readBytes(1),"StructProperty"===this.subtype){const t=e.readUInt32();if(e.readString()!==this.name)throw new Error;if(e.readString()!==this.subtype)throw new Error;if(e.readUInt32(),e.readBytes(4),this.genericType=e.readString(),"0000000000000000000000000000000000"!==e.readBytes(17))throw new Error;if(this.value=[],"Guid"===this.genericType)for(let r=0;r<t;r++)this.value.push(e.readBytes(16));else for(let r=0;r<t;r++){const t=[];let r=null;for(;!(r instanceof n);)r=e.readProperty(),t.push(r);this.value.push(t)}}else this.value=e.readBytes(r)}toBytes(){const{writeBytes:t,writeString:e,writeUint32:n}=r(389),{assignPrototype:i}=r(36),a=this.value.length;let o,y=new Uint8Array(0);if("StructProperty"===this.subtype){if("Guid"===this.genericType)for(let e=0;e<a;e++)y=new Uint8Array([...y,...t(this.value[e])]);else for(let t=0;t<a;t++)if(Array.isArray(this.value[t]))for(let e=0;e<this.value[t].length;e++)i(this.value[t][e]),y=new Uint8Array([...y,...this.value[t][e].toBytes()]);else i(this.value[t]),y=new Uint8Array([...y,...this.value[t].toBytes()]);return o=8+this.name.length+1+4+this.subtype.length+1+4+s.padding.length+4+this.genericType.length+1+s.unknown.length+y.length,new Uint8Array([...e(this.name),...e(this.type),...n(o),...s.padding,...e(this.subtype),0,...n(a),...e(this.name),...e(this.subtype),...n(y.length),...s.padding,...e(this.genericType),...s.unknown,...y])}return o=this.value.length/2,new Uint8Array([...e(this.name),...e(this.type),...n(o),...s.padding,...e(this.subtype),0,...t(this.value)])}}t.exports=s},380:(t,e,r)=>{class n{static padding=new Uint8Array([0,0,0,0,0,0,0,0]);type="BoolProperty";constructor(t,e){this.name=t,e.readBytes(n.padding.length),this.value=e.readBoolean(),e.readBytes(1)}toBytes(){const{writeString:t}=r(389);let e=new Uint8Array([...t(this.name),...t(this.type),...n.padding]);return e=!0===this.value?new Uint8Array([...e,1]):new Uint8Array([...e,0]),new Uint8Array([...e,0])}}t.exports=n},65:(t,e,r)=>{class n{static padding=new Uint8Array([0,0,0,0]);type="EnumProperty";constructor(t,e){this.name=t,this.type="EnumProperty",e.readUInt32(),e.readBytes(n.padding.length),this.enum=e.readString(),e.readBytes(1),this.value=e.readString()}toBytes(){const{writeString:t,writeUint32:e}=r(389),s=4+this.value.length+1;return new Uint8Array([...t(this.name),...t(this.type),...e(s),...n.padding,...t(this.enum),0,...t(this.value)])}}t.exports=n},656:(t,e,r)=>{const n=r(358);class s{static bytes=new Uint8Array([...n.bytes,0,0,0,0]);type="FileEndProperty";toBytes(){return s.bytes}}t.exports=s},175:(t,e,r)=>{class n{static padding=new Uint8Array([4,0,0,0,0,0,0,0,0]);type="FloatProperty";constructor(t,e){this.name=t,e.readBytes(n.padding.length),this.value=e.readFloat32()}toBytes(){const{writeString:t,writeFloat32:e}=r(389);return new Uint8Array([...t(this.name),...t(this.type),...n.padding,...e(this.value)])}}t.exports=n},364:(t,e,r)=>{class n{static GVAS=new Uint8Array([71,86,65,83]);type="HeaderProperty";constructor(t){t.readBytes(n.GVAS.length),this.saveGameVersion=t.readInt32(),this.packageVersion=t.readInt32(),this.engineVersion=t.readInt16()+"."+t.readInt16()+"."+t.readInt16(),this.engineBuild=t.readUInt32(),this.engineBranch=t.readString(),this.customVersionFormat=t.readInt32();const e=t.readInt32(),r=new Map;for(let n=0;n<e;n++)r.set(t.readBytes(16),t.readInt32());this.customVersions=Array.from(r.entries()),this.saveGameClassName=t.readString()}toBytes(){const{writeInt32:t,writeInt16:e,writeUint32:s,writeString:i,writeBytes:a}=r(389);let o=new Uint8Array([...n.GVAS,...t(this.saveGameVersion),...t(this.packageVersion),...e(this.engineVersion.split(".")[0]),...e(this.engineVersion.split(".")[1]),...e(this.engineVersion.split(".")[2]),...s(this.engineBuild),...i(this.engineBranch),...t(this.customVersionFormat),...t(this.customVersions.length)]);for(let e=0;e<this.customVersions.length;e++)o=new Uint8Array([...o,...a(this.customVersions[e][0]),...t(this.customVersions[e][1])]);return o=new Uint8Array([...o,...i(this.saveGameClassName)]),o}}t.exports=n},453:(t,e,r)=>{class n{static padding=new Uint8Array([8,0,0,0,0,0,0,0,0]);type="Int64Property";constructor(t,e){this.name=t,e.readBytes(n.padding.length),this.value=e.readInt64()}toBytes(){const{writeString:t,writeInt64:e}=r(389);return new Uint8Array([...t(this.name),...t(this.type),...n.padding,...e(this.value)])}}t.exports=n},90:(t,e,r)=>{class n{static padding=new Uint8Array([4,0,0,0,0,0,0,0,0]);type="IntProperty";constructor(t,e){this.name=t,e.readBytes(n.padding.length),this.value=e.readInt32()}toBytes(){const{writeString:t,writeInt32:e}=r(389);return new Uint8Array([...t(this.name),...t(this.type),...n.padding,...e(this.value)])}}t.exports=n},786:(t,e,r)=>{const n=r(358);class s{static padding=new Uint8Array([0,0,0,0]);type="MapProperty";constructor(t,e){this.name=t,e.readUInt32(),e.readBytes(4),this.keyType=e.readString(),this.valueType=e.readString(),e.readBytes(1);const r=new Map;e.readBytes(4);const s=e.readUInt32();for(let t=0;t<s;t++){let t=null,s=null;switch(this.keyType){case"StructProperty":t=e.readBytes(16);break;case"IntProperty":t=e.readInt32();break;default:throw new Error("Key Type not implemented: "+this.keyType)}switch(this.valueType){case"StructProperty":s=[];let t=null;for(;!(t instanceof n);)t=e.readProperty(),s.push(t);break;case"IntProperty":s=e.readInt32();break;case"FloatProperty":s=e.readFloat32();break;case"BoolProperty":s=e.readBoolean();break;default:throw new Error("Value Type not implemented: "+this.valueType)}r.set(t,s)}this.value=Array.from(r.entries())}toBytes(){const{writeBytes:t,writeInt32:e,writeFloat32:n,writeString:i,writeUint32:a}=r(389),{assignPrototype:o}=r(36);let y=new Uint8Array(0);const p=new Map(this.value);for(let[r,s]of p){switch(this.keyType){case"StructProperty":y=new Uint8Array([...y,...t(r)]);break;case"IntProperty":y=new Uint8Array([...y,...e(r)]);break;default:throw new Error("Key Type not implemented: "+this.keyType)}switch(this.valueType){case"StructProperty":for(let t=0;t<s.length;t++)o(s[t]),y=new Uint8Array([...y,...s[t].toBytes()]);break;case"IntProperty":y=new Uint8Array([...y,...e(s)]);break;case"FloatProperty":y=new Uint8Array([...y,...n(s)]);break;case"BoolProperty":y=!0===s?new Uint8Array([...y,1]):new Uint8Array([...y,0]);break;default:throw new Error("Value Type not implemented: "+this.valueType)}}return new Uint8Array([...i(this.name),...i(this.type),...a(8+y.length),...s.padding,...i(this.keyType),...i(this.valueType),...s.padding,0,...a(p.size),...y])}}t.exports=s},299:(t,e,r)=>{class n{static padding=new Uint8Array([0,0,0,0,0]);static unknown=new Uint8Array([1,0,0,0]);type="MulticastInlineDelegateProperty";constructor(t,e){this.name=t,e.readUInt32(),e.readBytes(5),e.readBytes(4),this.object_name=e.readString(),this.function_name=e.readString()}toBytes(){const{writeString:t,writeUint32:e}=r(389),s=n.unknown.length+4+this.object_name.length+1+4+this.function_name.length+1;return new Uint8Array([...t(this.name),...t(this.type),...e(s),...n.padding,...n.unknown,...t(this.object_name),...t(this.function_name)])}}t.exports=n},358:t=>{class e{static bytes=new Uint8Array([5,0,0,0,78,111,110,101,0]);type="NoneProperty";toBytes(){return e.bytes}}t.exports=e},273:(t,e,r)=>{class n{static padding=new Uint8Array([0,0,0,0,0]);type="ObjectProperty";constructor(t,e){this.name=t,e.readUInt32(),e.readBytes(5),this.value=e.readString()}toBytes(){const{writeString:t,writeUint32:e}=r(389),s=4+this.value.length+1;return new Uint8Array([...t(this.name),...t(this.type),...e(s),...n.padding,...t(this.value)])}}t.exports=n},931:(t,e,r)=>{class n{static padding=new Uint8Array([0,0,0,0]);type="SetProperty";constructor(t,e){this.name=t;const r=e.readUInt32();if(e.readBytes(4),this.subtype=e.readString(),e.readBytes(1),"StructProperty"===this.subtype){e.readBytes(4);const t=e.readUInt32();this.value=[];for(let r=0;r<t;r++)this.value.push(e.readBytes(16));return this}this.value=e.readBytes(r)}toBytes(){const{writeBytes:t,writeString:e,writeUint32:s}=r(389);if("StructProperty"===this.subtype){const r=this.value.length;let i=new Uint8Array(0);for(let e=0;e<r;e++)i=new Uint8Array([...i,...t(this.value[e])]);return new Uint8Array([...e(this.name),...e(this.type),...s(8+i.length),...n.padding,...e(this.subtype),0,...n.padding,...s(r),...i])}return new Uint8Array([...e(this.name),...e(this.type),...s(this.value.length/2),...n.padding,...e(this.subtype),0,...t(this.value)])}}t.exports=n},397:(t,e,r)=>{const{writeUint32:n}=r(389);t.exports=class{type="StrProperty";constructor(t,e){this.name=t,e.readBytes(9),this.value=e.readString()}toBytes(){const{writeString:t}=r(389),e=this.value.length+5;return new Uint8Array([...t(this.name),...t(this.type),...n(e),0,0,0,0,0,...t(this.value)])}}},475:(t,e,r)=>{class n{static padding=new Uint8Array([0,0,0,0]);static unknown=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);type="StructProperty";constructor(t,e){this.name=t;const r=e.readUInt32();e.readBytes(4),this.subtype=e.readString(),e.readBytes(17);const n=e.offset+r;if("Guid"===this.subtype)return this.value=e.readBytes(16),this;if("DateTime"===this.subtype)return this.value=e.readDateTime(),this;for(this.value=[];e.offset<n;)this.value.push(e.readProperty())}toBytes(){const{writeString:t,writeUint32:e,writeBytes:s,writeDateTime:i}=r(389),{assignPrototype:a}=r(36);if("Guid"===this.subtype)return new Uint8Array([...t(this.name),...t(this.type),...e(16),...n.padding,...t("Guid"),...n.unknown,...s(this.value)]);if("DateTime"===this.subtype)return new Uint8Array([...t(this.name),...t(this.type),...e(8),...n.padding,...t("DateTime"),...n.unknown,...i(this.value)]);let o=new Uint8Array(0);for(let t=0;t<this.value.length;t++)if(Array.isArray(this.value[t]))for(let e=0;e<this.value[t].length;e++)a(this.value[t][e]),o=new Uint8Array([...o,...this.value[t][e].toBytes()]);else a(this.value[t]),o=new Uint8Array([...o,...this.value[t].toBytes()]);return new Uint8Array([...t(this.name),...t(this.type),...e(o.length),...n.padding,...t(this.subtype),...n.unknown,...o])}}t.exports=n},984:(t,e,r)=>{class n{static padding=new Uint8Array([4,0,0,0,0,0,0,0,0]);type="UInt32Property";constructor(t,e){this.name=t,e.readBytes(n.padding.length),this.value=e.readUInt32()}toBytes(){const{writeString:t,writeUint32:e}=r(389);return new Uint8Array([...t(this.name),...t(this.type),...n.padding,...e(this.value)])}}t.exports=n},61:(t,e,r)=>{const n=r(364),s=r(358),i=r(380),a=r(90),o=r(984),y=r(453),p=r(397),h=r(65),u=r(175),c=r(475),l=r(973),d=r(299),w=r(786),f=r(931),g=r(273),P=r(656);t.exports={HeaderProperty:n,NoneProperty:s,BoolProperty:i,IntProperty:a,UInt32Property:o,Int64Property:y,StrProperty:p,EnumProperty:h,FloatProperty:u,StructProperty:c,ArrayProperty:l,MulticastInlineDelegateProperty:d,MapProperty:w,SetProperty:f,ObjectProperty:g,FileEndProperty:P}},899:(t,e,r)=>{const{HeaderProperty:n,NoneProperty:s,BoolProperty:i,IntProperty:a,UInt32Property:o,Int64Property:y,StrProperty:p,EnumProperty:h,FloatProperty:u,StructProperty:c,ArrayProperty:l,MulticastInlineDelegateProperty:d,MapProperty:w,SetProperty:f,ObjectProperty:g,FileEndProperty:P}=r(61);t.exports=class{constructor(t){this.offset=0,this.fileArrayBuffer=t,this.fileSize=t.byteLength,this.dataView=new DataView(t)}readWholeBuffer(){const t=[],e=this.readHeader();for(console.log(JSON.stringify(e,null,2)),t.push(e);!this.hasFinished();){const e=this.readProperty();console.log(JSON.stringify(e,null,2)),t.push(e)}return t}hasFinished(){return this.offset===this.fileSize}readHeader(){return new n(this)}readProperty(){if(this.offset+P.bytes.length===this.fileSize&&new Uint8Array(this.fileArrayBuffer.slice(this.offset,this.offset+P.bytes.length)).every(((t,e)=>t===P.bytes[e])))return this.offset+=P.bytes.length,new P;const t=this.readString();if("None"===t)return new s;const e=this.readString();switch(e){case"BoolProperty":return new i(t,this);case"IntProperty":return new a(t,this);case"UInt32Property":return new o(t,this);case"Int64Property":return new y(t,this);case"StrProperty":return new p(t,this);case"EnumProperty":return new h(t,this);case"FloatProperty":return new u(t,this);case"StructProperty":return new c(t,this);case"ArrayProperty":return new l(t,this);case"MulticastInlineDelegateProperty":return new d(t,this);case"MapProperty":return new w(t,this);case"SetProperty":return new f(t,this);case"ObjectProperty":return new g(t,this);default:throw new Error("Unknown property type: "+e)}}readString(){const t=this.dataView.getUint32(this.offset,!0);this.offset+=4;const e=(new TextDecoder).decode(this.fileArrayBuffer.slice(this.offset,this.offset+t-1));return this.offset+=t,e}readBoolean(){const t=Boolean(this.dataView.getUint8(this.offset));return this.offset+=1,t}readFloat32(){const t=this.dataView.getFloat32(this.offset,!0);return this.offset+=4,t}readInt16(){const t=Number(this.dataView.getInt16(this.offset,!0));return this.offset+=2,t}readInt32(){const t=Number(this.dataView.getInt32(this.offset,!0));return this.offset+=4,t}readUInt32(){const t=Number(this.dataView.getUint32(this.offset,!0));return this.offset+=4,t}readInt64(){const t=Number(this.dataView.getBigInt64(this.offset,!0));return this.offset+=8,t}readDateTime(){const t=this.dataView.getBigUint64(this.offset,!0);return this.offset+=8,new Date(Number(t/10000n)+new Date("0001-01-01T00:00:00Z").getTime())}readBytes(t){const e=(r=this.fileArrayBuffer.slice(this.offset,this.offset+t),[...new Uint8Array(r)].reduce(((t,e)=>t+e.toString(16).padStart(2,"0")),""));var r;return this.offset+=t,e}}},389:t=>{function e(t){const e=new Uint8Array(4);return new DataView(e.buffer).setUint32(0,t,!0),e}t.exports={writeString:function(t){const r=e(t.length+1),n=(new TextEncoder).encode(t);return new Uint8Array([...r,...n,0])},writeInt16:function(t){const e=new Uint8Array(2);return new DataView(e.buffer).setInt16(0,t,!0),e},writeInt32:function(t){const e=new Uint8Array(4);return new DataView(e.buffer).setInt32(0,t,!0),e},writeUint32:e,writeInt64:function(t){const e=new Uint8Array(8);return new DataView(e.buffer).setBigInt64(0,BigInt(t),!0),e},writeFloat32:function(t){const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,t,!0),e},writeDateTime:function(t){const e=new Date(t),r=new Uint8Array(8),n=10000n*BigInt(e.getTime())+621355968000000000n;return new DataView(r.buffer).setBigUint64(0,n,!0),r},writeBytes:function(t){return Uint8Array.from(t.match(/../g).map((t=>parseInt(t,16))))}}}},e={};function r(n){var s=e[n];if(void 0!==s)return s.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,r),i.exports}(()=>{const{convertJsonToSav:t,convertSavToJson:e}=r(36);document.getElementById("sav-input").addEventListener("change",(function(){const t=new FileReader;t.fileName=this.files[0].name,t.onload=function(r){!function(t,e){const r=document.createElement("a");r.setAttribute("href","data:text/json;charset=utf-8,"+encodeURIComponent(e)),r.setAttribute("download",t),r.click()}(t.fileName+".json",e(r.target.result))},t.readAsArrayBuffer(this.files[0])})),document.getElementById("json-input").addEventListener("change",(function(){const e=new FileReader;e.fileName=this.files[0].name,e.onload=function(r){!function(t,e){const r=new Blob([e],{type:"octet/stream"}),n=document.createElement("a");n.setAttribute("href",window.URL.createObjectURL(r)),n.setAttribute("download",t),n.click()}(e.fileName+".sav",t(r.target.result))},e.readAsText(this.files[0])}))})()})();
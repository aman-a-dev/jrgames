import Image from "next/image";

export default function Logo() {
  return (
    <svg viewBox="0 0 500 500" width="70px" height="70px">
      <rect width="100%" height="100%" fill="transparent" />
      <g transform="translate(10, 10)">
        <path
          fill="var(--foreground)"
          d="
      M 191,175 
      L 191,245 
      C 191,268 171,278 136,278 
      C 111,278 91,263 86,250 
      L 121,237 
      C 124,243 129,246 138,246 
      C 148,246 153,241 153,232 
      L 153,175 
      L 191,175 Z
      
      M 219,175 
      L 311,175 
      C 346,175 366,195 366,223 
      C 366,245 351,260 324,266 
      L 367,278 
      L 322,278 
      L 286,266 
      L 253,266 
      L 253,278 
      L 219,278 
      L 219,175 Z
      
      M 253,204 
      L 253,238 
      L 304,238 
      C 318,238 327,232 327,221 
      C 327,210 318,204 304,204 
      L 253,204 Z"
        />

        <path
          d="M 208,232 L 246,194 L 249,197 L 211,235 Z"
          fill="var(--background)"
        />
      </g>
    </svg>
  );
}

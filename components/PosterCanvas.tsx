import React, { forwardRef } from 'react';
import { PosterData } from '../types';

interface PosterCanvasProps {
  data: PosterData;
}

// Forward ref to allow the parent to access the SVG element for downloading
export const PosterCanvas = forwardRef<SVGSVGElement, PosterCanvasProps>(({ data }, ref) => {
  return (
    <div className="bg-white shadow-2xl p-4 rounded-sm overflow-hidden">
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 800"
        className="w-full h-auto max-w-[450px] mx-auto border border-gray-100"
        style={{ maxHeight: '80vh' }}
      >
        {/* 白色背景 */}
        <rect width="600" height="800" fill="#ffffff" />
        
        {/* 灰色边框 */}
        <rect
          x="20"
          y="20"
          width="560"
          height="760"
          fill="none"
          stroke="#dedede"
          strokeWidth="1"
        />
        
        {/* 内层装饰边框 */}
        <rect
          x="40"
          y="40"
          width="520"
          height="720"
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="0.5"
          strokeDasharray="2,4"
        />
        
        {/* 标题区域 */}
        <text
          x="300"
          y="100"
          fontFamily="'Source Han Sans CN', 'Noto Sans SC', sans-serif"
          fontSize="46"
          fill="#000000"
          textAnchor="middle"
          fontWeight="300"
        >
          {data.titleCN}
        </text>
        
        {/* 英文标题 */}
        <text
          x="300"
          y="135"
          fontFamily="'Didot', 'Times New Roman', serif"
          fontSize="18"
          fill="#333333"
          textAnchor="middle"
          letterSpacing="4"
          fontWeight="300"
        >
          {data.titleEN}
        </text>
        
        {/* 导演演员信息 */}
        <text
          x="300"
          y="170"
          fontFamily="'Source Han Sans CN', 'Noto Sans SC', sans-serif"
          fontSize="14"
          fill="#666666"
          textAnchor="middle"
          letterSpacing="2"
          fontWeight="300"
        >
          {data.credits}
        </text>
        
        {/* 中央主图案区域 (AI Generated Image) */}
        {/* 
            Calculations for positioning:
            Available vertical space roughly: 
            Top text ends ~180. 
            Bottom text starts ~600. 
            Gap = 420.
            Image size 360x360 (Square).
            Center Y of gap ~390.
            Image Y = 390 - 180 = 210.
            Center X = 300. Image X = 300 - 180 = 120.
        */}
        <image
          href={data.posterImage}
          x="120"
          y="210"
          width="360"
          height="360"
          preserveAspectRatio="xMidYMid slice"
          opacity="0.9" 
        />
        
        {/* 底部分隔线 */}
        <line x1="200" y1="600" x2="400" y2="600" stroke="#dedede" strokeWidth="0.5" />
        
        {/* 故事简介 (3 Lines) */}
        {data.summary.map((line, index) => (
          <text
            key={index}
            x="300"
            y={640 + index * 30}
            fontFamily="'Source Han Sans CN', 'Noto Sans SC', sans-serif"
            fontSize="13"
            fill="#333333"
            textAnchor="middle"
            fontWeight="300"
            letterSpacing="1"
          >
            {line}
          </text>
        ))}
        
        {/* 年份 */}
        <text
          x="300"
          y="740"
          fontFamily="'Didot', 'Times New Roman', serif"
          fontSize="14"
          fill="#666666"
          textAnchor="middle"
          letterSpacing="2"
        >
          {data.year}
        </text>
      </svg>
    </div>
  );
});

PosterCanvas.displayName = "PosterCanvas";
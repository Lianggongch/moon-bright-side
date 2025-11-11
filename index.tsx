import React, { useState, useEffect, useRef } from "react";
import f01f5e2a09e8239e70d6551f2b052 from "./4385f01f5e2a09e8239e70d6551f2b05-2.png";
import { calculateMoonIllumination, getMoonPhaseNameFromDate } from "./moonPhaseCalculator";

// 月亮名称枚举
enum MoonPhase {
  NEW_MOON = "New Moon",
  WAXING_CRESCENT = "Waxing Crescent",
  FIRST_QUARTER = "First Quarter",
  WAXING_GIBBOUS = "Waxing Gibbous",
  FULL_MOON = "Full Moon",
  WANING_GIBBOUS = "Waning Gibbous",
  LAST_QUARTER = "Last Quarter",
  WANING_CRESCENT = "Waning Crescent",
}

export const Image = (): JSX.Element => {
  const [deviceOrientation, setDeviceOrientation] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  }>({ alpha: null, beta: null, gamma: null });
  
  const [moonAngle, setMoonAngle] = useState<number>(0); // 月亮方向角度（0-360度，方位角azimuth）
  const [moonElevation, setMoonElevation] = useState<number>(0); // 月亮高度角（-90到90度）
  const [moonRise, setMoonRise] = useState<string>(""); // 月升时间
  const [moonSet, setMoonSet] = useState<string>(""); // 月落时间
  const [location, setLocation] = useState<string>("获取位置中...");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [moonPhase, setMoonPhase] = useState<MoonPhase>(MoonPhase.FULL_MOON);
  const [moonIllumination, setMoonIllumination] = useState<number>(1.0); // 月相照明度（0.0-1.0）
  const [moonVisibility, setMoonVisibility] = useState<number>(0); // 月亮可见比例（0-100%）
  const [cloudCover, setCloudCover] = useState<number>(0); // 云量（0-100%）
  const containerRef = useRef<HTMLDivElement>(null);

  const IPGEOLOCATION_API_KEY = 'da4ee14a6a904b369cf22b13bcfade57';
  const VISUALCROSSING_API_KEY = 'K84ZRGQH2W3662DSD9QKHY239';

  // 获取GPS位置并调用API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          setLatitude(lat);
          setLongitude(lon);
          setLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);

          // 获取城市名称（逆地理编码）
          await getCityName(lat, lon);

          // 调用API获取月亮和天气数据
          await fetchMoonAndWeatherData(lat, lon);
        },
        (error) => {
          setLocation("位置获取失败");
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocation("不支持GPS");
    }
  }, []);

  // 逆地理编码：将坐标转换为城市名称
  const getCityName = async (lat: number, lon: number) => {
    try {
      // 使用Nominatim API（OpenStreetMap的免费逆地理编码服务）
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'MoonPhaseApp/1.0'
        }
      });
      
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        // 提取城市名称（优先使用city，如果没有则使用town或village）
        const city = address.city || address.town || address.village || address.county || '';
        const country = address.country || '';
        
        if (city) {
          setLocation(city + (country ? `, ${country}` : ''));
        }
      }
    } catch (error) {
      console.error("逆地理编码错误:", error);
      // 如果失败，保持显示坐标
    }
  };

  // 调用IPGeolocation Astronomy API和Visual Crossing Weather API
  const fetchMoonAndWeatherData = async (lat: number, lon: number) => {
    const date = new Date().toISOString().split('T')[0];
    const currentTime = new Date(); // 当前UTC时间

    try {
      // 1. 调用IPGeolocation Astronomy API获取月亮位置
      const astronomyUrl = `https://api.ipgeolocation.io/astronomy?apiKey=${IPGEOLOCATION_API_KEY}&lat=${lat}&long=${lon}&date=${date}`;
      const astronomyResponse = await fetch(astronomyUrl);
      const astronomyData = await astronomyResponse.json();
      
      if (astronomyData.moon && astronomyData.moon.azimuth !== undefined) {
        setMoonAngle(astronomyData.moon.azimuth); // 月亮方位角
        setMoonElevation(astronomyData.moon.elevation || 0); // 月亮高度角
        
        // 获取月升月落时间
        if (astronomyData.moon.moonrise) {
          setMoonRise(astronomyData.moon.moonrise);
        }
        if (astronomyData.moon.moonset) {
          setMoonSet(astronomyData.moon.moonset);
        }
      }

      // 2. 使用精确的天文学算法计算月相（基于UTC时间）
      // 月相是全球统一的，与地理位置无关，只与时间有关
      const calculatedIllumination = calculateMoonIllumination(currentTime);
      const phaseName = getMoonPhaseNameFromDate(currentTime);
      
      // 存储精确的月相照明度（用于可见度计算）
      setMoonIllumination(calculatedIllumination);
      
      // 将字符串转换为MoonPhase枚举
      const phaseMap: { [key: string]: MoonPhase } = {
        "New Moon": MoonPhase.NEW_MOON,
        "Waxing Crescent": MoonPhase.WAXING_CRESCENT,
        "First Quarter": MoonPhase.FIRST_QUARTER,
        "Waxing Gibbous": MoonPhase.WAXING_GIBBOUS,
        "Full Moon": MoonPhase.FULL_MOON,
        "Waning Gibbous": MoonPhase.WANING_GIBBOUS,
        "Last Quarter": MoonPhase.LAST_QUARTER,
        "Waning Crescent": MoonPhase.WANING_CRESCENT,
      };
      
      if (phaseMap[phaseName]) {
        setMoonPhase(phaseMap[phaseName]);
      }
      
      console.log(`精确月相计算: ${phaseName}, 照明度: ${(calculatedIllumination * 100).toFixed(2)}%`);

      // 3. 调用Visual Crossing Weather API获取天气（云量）
      const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${date}?key=${VISUALCROSSING_API_KEY}&unitGroup=metric&include=current`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      
      if (weatherData.currentConditions && weatherData.currentConditions.cloudcover !== undefined) {
        setCloudCover(weatherData.currentConditions.cloudcover); // 云量百分比
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  /**
   * 计算月亮可见度百分比（0-100%）
   * 
   * 逻辑关系：
   * 1. 水平方向对齐度：设备指向与月亮方向的水平夹角（0-30度范围内有效）
   * 2. 垂直方向可见度：月亮高度角（必须>0，越高越好）
   * 3. 天气影响：云量遮挡（0-100%，云量越少越好）
   * 4. 月相影响：满月=100%，其他月相按比例降低
   * 
   * 最终可见度 = 水平对齐度 × 高度角因子 × 云量因子 × 月相因子
   */
  const calculateMoonVisibility = (): number => {
    // 如果没有设备方向数据，返回0
    if (deviceOrientation.alpha === null) {
      return 0;
    }

    // ========== 1. 计算水平方向对齐度（方位角） ==========
    const deviceAzimuth = deviceOrientation.alpha; // 设备指向的方位角（0-360度）
    let horizontalAngleDiff = Math.abs(deviceAzimuth - moonAngle);
    
    // 处理360度边界情况（例如：359度和1度的夹角应该是2度，不是358度）
    if (horizontalAngleDiff > 180) {
      horizontalAngleDiff = 360 - horizontalAngleDiff;
    }
    
    // 如果设备指向不在月亮方向60度范围内（左右各30度），完全不可见
    if (horizontalAngleDiff > 30) {
      return 0;
    }
    
    // 水平对齐度：角度越小，对齐度越高（0度=100%，30度=0%）
    // 使用平滑曲线（余弦函数）使过渡更自然
    const horizontalAlignment = Math.cos((horizontalAngleDiff / 30) * (Math.PI / 2)) * 100;
    
    // ========== 2. 计算垂直方向可见度（高度角） ==========
    // 如果月亮在地平线以下（高度角<=0），完全不可见
    if (moonElevation <= 0) {
      return 0;
    }
    
    // 高度角因子：高度角越高，可见度越好
    // 0度=0%，90度=100%，使用平滑曲线
    const elevationFactor = Math.sin((moonElevation / 90) * (Math.PI / 2)) * 100;
    
    // ========== 3. 计算天气影响（云量） ==========
    // 云量因子：云量越少，可见度越好
    // 0%云量=100%可见度，100%云量=0%可见度
    const cloudFactor = 100 - cloudCover;
    
    // ========== 4. 计算月相影响 ==========
    // 使用精确计算的月相照明度（0.0-1.0），转换为百分比（0-100%）
    // 这是基于天文学算法的精确值，而不是简单的枚举映射
    const moonPhaseFactor = moonIllumination * 100;
    
    // ========== 5. 综合计算最终可见度 ==========
    // 最终可见度 = 水平对齐度 × 高度角因子 × 云量因子 × 月相因子 / (100^3)
    // 因为每个因子都是0-100的百分比，所以需要除以100^3来归一化
    const finalVisibility = (horizontalAlignment * elevationFactor * cloudFactor * moonPhaseFactor) / (100 * 100 * 100);
    
    // 确保结果在0-100范围内，并四舍五入
    return Math.round(Math.min(100, Math.max(0, finalVisibility)));
  };

  // ========== 功能流程确认 ==========
  // 1. 手机登录界面后，自动请求：
  //    - GPS位置权限（navigator.geolocation）
  //    - 陀螺仪权限（DeviceOrientationEvent）
  // 2. 获取到GPS后，调用API获取：
  //    - 云量（cloudCover）- 从Visual Crossing Weather API
  //    - 月亮方位角（moonAngle/azimuth）- 从IPGeolocation Astronomy API
  //    - 月亮高度角（moonElevation）- 从IPGeolocation Astronomy API
  //    - 月升月落时间（moonrise/moonset）- 从IPGeolocation Astronomy API
  // 3. 陀螺仪数据用于计算：
  //    - 设备指向方向（deviceOrientation.alpha）
  //    - 设备与月亮方向的差值（angleDiff）
  // 4. 综合计算月亮可见度百分比

  useEffect(() => {
    // 请求设备方向权限并监听陀螺仪
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha, // 绕Z轴旋转（0-360度）- 设备指向的方位角
        beta: event.beta,   // 绕X轴旋转（-180到180度）- 设备俯仰角
        gamma: event.gamma, // 绕Y轴旋转（-90到90度）- 设备横滚角
      });
    };

    // 监听设备方向变化
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  // 更新月亮可见比例（当任何相关数据变化时重新计算）
  useEffect(() => {
    const visibility = calculateMoonVisibility();
    setMoonVisibility(visibility);
  }, [deviceOrientation, moonAngle, moonElevation, cloudCover, moonIllumination]);

  // 计算圆盘应该显示的角度范围
  // 圆盘只在月亮方向60度范围内显示（左右各30度）
  const getDiskRotation = (): number => {
    if (deviceOrientation.alpha === null) return 0;
    
    // 计算设备指向方向与月亮方向的夹角
    const deviceDirection = deviceOrientation.alpha; // 设备指向的方向
    let angleDiff = Math.abs(deviceDirection - moonAngle);
    
    // 处理360度边界情况
    if (angleDiff > 180) {
      angleDiff = 360 - angleDiff;
    }
    
    // 如果设备指向在月亮方向60度范围内（左右各30度）
    if (angleDiff <= 30) {
      // 计算圆盘需要旋转的角度，使其以月亮为中心
      const rotationAngle = deviceDirection - moonAngle;
      return rotationAngle;
    }
    
    return 0; // 不在范围内，不显示圆盘
  };

  const diskRotation = getDiskRotation();
  const isInRange = Math.abs(diskRotation) <= 30;

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ 
        maxWidth: "100vw",
        height: "100vh",
        padding: "0",
        fontFamily: "var(--text-font-family)",
      }}
    >
      {/* 顶部：月亮名称 */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center"
        style={{
          paddingTop: "min(8vw, 40px)",
          paddingBottom: "min(4vw, 20px)",
        }}
      >
        <h1 
          className="text-white text-center"
          style={{
            fontSize: "min(6vw, 24px)",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          {moonPhase}
        </h1>
      </div>

      {/* 中间：月亮图片 - 响应式居中 */}
      <div 
        className="absolute"
        style={{
          width: "min(88vw, 318px)",
          height: "min(88vw, 318px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          className="w-full h-full object-cover rounded-full"
          alt="Moon"
          src={f01f5e2a09e8239e70d6551f2b052}
        />
        
        {/* 圆盘 - 只在月亮方向60度范围内显示，以月亮为中心滑动 */}
        {isInRange && (
          <div
            className="absolute inset-0 rounded-full border-2 border-white/30 pointer-events-none"
            style={{
              transform: `rotate(${diskRotation}deg)`,
              transition: "transform 0.1s ease-out",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* 圆盘可以添加更多视觉效果 */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.4)",
                transform: "scale(1.1)",
              }}
            />
          </div>
        )}
      </div>

      {/* 底部：地点和可见比例 */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex flex-col justify-center items-center"
        style={{
          paddingBottom: "min(8vw, 40px)",
          paddingTop: "min(4vw, 20px)",
        }}
      >
        {/* 地点 */}
        <div 
          className="text-white text-center mb-2"
          style={{
            fontSize: "min(4vw, 16px)",
            fontWeight: 400,
            opacity: 0.8,
          }}
        >
          {location}
        </div>
        
        {/* 月亮可见比例 */}
        <div 
          className="text-white text-center"
          style={{
            fontSize: "min(5vw, 20px)",
            fontWeight: 500,
          }}
        >
          {moonVisibility}%
        </div>
      </div>
    </div>
  );
};

/**
 * 精确月相计算模块
 * 基于天文学算法计算月亮的照明度（Illuminated Fraction）
 * 
 * 参考：Jean Meeus的《Astronomical Algorithms》和NASA的算法
 */

/**
 * 计算给定日期时间的月相照明度（0.0 - 1.0）
 * @param date 日期时间对象（UTC时间）
 * @returns 月相照明度（0.0 = 新月, 1.0 = 满月）
 */
export function calculateMoonIllumination(date: Date): number {
  // 转换为UTC时间
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  
  // 计算儒略日（Julian Day）
  const jd = toJulianDay(utcDate);
  
  // 计算月龄（Days since last new moon）
  const daysSinceNewMoon = calculateDaysSinceNewMoon(jd);
  
  // 计算照明度（Illuminated Fraction）
  // 使用公式：illumination = (1 - cos(phase_angle)) / 2
  // 其中 phase_angle = 2π * daysSinceNewMoon / 29.53058867
  const synodicMonth = 29.53058867; // 朔望月周期（天）
  const phaseAngle = (2 * Math.PI * daysSinceNewMoon) / synodicMonth;
  const illumination = (1 - Math.cos(phaseAngle)) / 2;
  
  return Math.max(0, Math.min(1, illumination));
}

/**
 * 将日期转换为儒略日（Julian Day）
 */
function toJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  const decimalDay = day + (hour / 24) + (minute / 1440) + (second / 86400);
  
  let a, b;
  if (month <= 2) {
    const yearAdj = year - 1;
    const monthAdj = month + 12;
    a = Math.floor(yearAdj / 100);
    b = 2 - a + Math.floor(a / 4);
  } else {
    a = Math.floor(year / 100);
    b = 2 - a + Math.floor(a / 4);
  }
  
  const jd = Math.floor(365.25 * (year + 4716)) + 
             Math.floor(30.6001 * (month + 1)) + 
             decimalDay + b - 1524.5;
  
  return jd;
}

/**
 * 计算距离最近一次新月的天数
 * 使用Jean Meeus的算法
 */
function calculateDaysSinceNewMoon(jd: number): number {
  // 计算平均新月时间（使用简化算法）
  // 更精确的方法需要使用ELP-2000/82月球理论，这里使用Meeus的简化公式
  
  // 计算平均月龄
  const k = Math.floor((jd - 2451545) / 29.53058867) + 0.5;
  const t = (jd - 2451545) / 36525;
  
  // 计算平均新月时间（儒略日）
  const jde = 2451545 + 29.53058867 * k;
  
  // 计算修正项（考虑月球轨道偏心率等）
  const e = 1 - 0.002516 * t - 0.0000074 * t * t;
  const m = (134.96340251 + 1717915923.2178 * t / 3600) % 360;
  const m_rad = (m * Math.PI) / 180;
  
  const m_prime = (357.5291092 + 129596581.0481 * t / 3600) % 360;
  const m_prime_rad = (m_prime * Math.PI) / 180;
  
  const f = (93.2720950 + 1739527262.8478 * t / 3600) % 360;
  const f_rad = (f * Math.PI) / 180;
  
  // 计算修正项（使用Meeus的公式）
  let correction = -0.40720 * Math.sin(m_rad);
  correction += 0.17241 * e * Math.sin(m_prime_rad);
  correction += 0.01608 * Math.sin(2 * m_rad);
  correction += 0.01039 * Math.sin(2 * f_rad);
  correction += 0.00739 * e * Math.sin(m_rad - m_prime_rad);
  correction -= 0.00514 * e * Math.sin(m_rad + m_prime_rad);
  correction += 0.00208 * e * e * Math.sin(2 * m_prime_rad);
  correction -= 0.00111 * Math.sin(m_rad - 2 * f_rad);
  correction -= 0.00057 * Math.sin(m_rad + 2 * f_rad);
  correction += 0.00056 * e * Math.sin(2 * m_rad + m_prime_rad);
  correction -= 0.00042 * Math.sin(3 * m_rad);
  correction += 0.00042 * e * Math.sin(m_prime_rad + 2 * f_rad);
  correction += 0.00038 * e * Math.sin(m_prime_rad - 2 * f_rad);
  correction -= 0.00024 * e * Math.sin(2 * m_rad - m_prime_rad);
  correction -= 0.00017 * Math.sin(m_prime_rad);
  correction -= 0.00007 * Math.sin(m_rad + 2 * m_prime_rad);
  correction += 0.00004 * Math.sin(2 * m_rad - 2 * f_rad);
  correction += 0.00004 * Math.sin(3 * m_prime_rad);
  correction += 0.00003 * Math.sin(m_rad + m_prime_rad - 2 * f_rad);
  correction += 0.00003 * Math.sin(2 * m_prime_rad - 2 * f_rad);
  correction -= 0.00003 * Math.sin(m_rad + m_prime_rad + 2 * f_rad);
  correction += 0.00003 * Math.sin(m_rad - m_prime_rad + 2 * f_rad);
  correction -= 0.00002 * Math.sin(m_rad - m_prime_rad - 2 * f_rad);
  correction -= 0.00002 * Math.sin(3 * m_rad + m_prime_rad);
  
  const newMoonJD = jde + correction;
  
  // 计算距离最近新月的天数
  let daysSinceNewMoon = jd - newMoonJD;
  
  // 确保结果在0到29.53之间
  while (daysSinceNewMoon < 0) {
    daysSinceNewMoon += 29.53058867;
  }
  while (daysSinceNewMoon >= 29.53058867) {
    daysSinceNewMoon -= 29.53058867;
  }
  
  return daysSinceNewMoon;
}

/**
 * 根据照明度确定月相名称
 */
export function getMoonPhaseName(illumination: number): string {
  // 将照明度转换为月龄（0-29.53天）
  const synodicMonth = 29.53058867;
  const phaseAngle = Math.acos(1 - 2 * illumination);
  const daysSinceNewMoon = (phaseAngle / (2 * Math.PI)) * synodicMonth;
  
  if (illumination < 0.01) {
    return "New Moon";
  } else if (illumination < 0.25) {
    return daysSinceNewMoon < synodicMonth / 2 ? "Waxing Crescent" : "Waning Crescent";
  } else if (illumination < 0.5) {
    return daysSinceNewMoon < synodicMonth / 2 ? "Waxing Crescent" : "Waning Crescent";
  } else if (illumination < 0.75) {
    return daysSinceNewMoon < synodicMonth / 2 ? "Waxing Gibbous" : "Waning Gibbous";
  } else if (illumination < 0.99) {
    return "Waxing Gibbous";
  } else {
    return "Full Moon";
  }
}

/**
 * 更精确的月相名称判断（基于月龄）
 */
export function getMoonPhaseNameFromDate(date: Date): string {
  const illumination = calculateMoonIllumination(date);
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const jd = toJulianDay(utcDate);
  const daysSinceNewMoon = calculateDaysSinceNewMoon(jd);
  const synodicMonth = 29.53058867;
  
  const phase = daysSinceNewMoon / synodicMonth;
  
  if (illumination < 0.01) {
    return "New Moon";
  } else if (phase < 0.0625) {
    return "Waxing Crescent";
  } else if (phase < 0.25) {
    return "Waxing Crescent";
  } else if (phase < 0.375) {
    return "First Quarter";
  } else if (phase < 0.5) {
    return "Waxing Gibbous";
  } else if (phase < 0.625) {
    return "Full Moon";
  } else if (phase < 0.75) {
    return "Waning Gibbous";
  } else if (phase < 0.875) {
    return "Last Quarter";
  } else {
    return "Waning Crescent";
  }
}

/**
 * 测试函数：计算指定城市和时间的月相
 */
export function testMoonPhaseCalculation() {
  const cities = [
    { name: "北京", lat: 39.9042, lon: 116.4074, timezone: 8 },
    { name: "上海", lat: 31.2304, lon: 121.4737, timezone: 8 },
    { name: "香港", lat: 22.3193, lon: 114.1694, timezone: 8 },
  ];
  
  // 测试当前时间
  const now = new Date();
  
  console.log("=== 月相计算测试 ===");
  console.log(`测试时间: ${now.toISOString()}`);
  console.log("");
  
  cities.forEach(city => {
    // 转换为UTC时间
    const utcTime = new Date(now.getTime() - (city.timezone * 3600000));
    
    const illumination = calculateMoonIllumination(utcTime);
    const phaseName = getMoonPhaseNameFromDate(utcTime);
    
    console.log(`城市: ${city.name}`);
    console.log(`  坐标: ${city.lat}°N, ${city.lon}°E`);
    console.log(`  月相照明度: ${(illumination * 100).toFixed(2)}%`);
    console.log(`  月相名称: ${phaseName}`);
    console.log("");
  });
}


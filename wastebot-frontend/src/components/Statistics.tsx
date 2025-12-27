import { useMemo, useRef } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';
import type { Robot, WasteEvent } from '../App';
import type { Waste } from '../types/api';

type StatisticsProps = {
  robots: Robot[];
  events: WasteEvent[];
  wastes: Waste[];
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

export function Statistics({ robots, events, wastes }: StatisticsProps) {
  const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Waste by location
  const wasteByLocation = useMemo(() => {
    const locationMap = new Map<string, number>();
    wastes.forEach((waste) => {
      const location = waste.region || 'Unknown';
      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    });
    return Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, waste: count }))
      .sort((a, b) => b.waste - a.waste)
      .slice(0, 10);
  }, [wastes]);

  // Waste by type
  const wasteTypes = useMemo(() => {
    const categoryMap = new Map<string, number>();
    wastes.forEach((waste) => {
      const category = waste.category || 'Unknown';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [wastes]);

  // Waste by robot
  const wasteByRobot = useMemo(() => {
    const robotMap = new Map<string, number>();
    wastes.forEach((waste) => {
      if (waste.robotId != null) {
        const robot = robots.find(r => {
          const robotIdStr = r.id.toString();
          const wasteRobotIdStr = waste.robotId!.toString();
          return robotIdStr === wasteRobotIdStr || r.id === waste.robotId;
        });
        const robotName = robot?.name || `Robot ${waste.robotId}`;
        robotMap.set(robotName, (robotMap.get(robotName) || 0) + 1);
      }
    });
    return Array.from(robotMap.entries())
      .map(([name, value]) => ({ name, waste: value }))
      .sort((a, b) => b.waste - a.waste)
      .slice(0, 10);
  }, [wastes, robots]);

  // Waste development by category over time
  const wasteOverTime = useMemo(() => {
    const map = new Map<string, Record<string, number>>(); // date => { category: count }
    wastes.forEach((waste) => {
      const date = new Date(waste.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!map.has(date)) map.set(date, {});
      const record = map.get(date)!;
      record[waste.category || 'Unknown'] = (record[waste.category || 'Unknown'] || 0) + 1;
    });
    const sortedDates = Array.from(map.keys()).sort();
    return sortedDates.map(date => ({ date, ...map.get(date) }));
  }, [wastes]);

  // Summary stats
  const totalWastes = wastes.length;
  const uniqueLocations = new Set(wastes.map(w => w.region)).size;
  const uniqueCategories = new Set(wastes.map(w => w.category)).size;
  const wastesWithRobots = wastes.filter(w => w.robotId).length;

  // Most active robot
  const mostActiveRobot = useMemo(() => {
    if (wasteByRobot.length === 0) return null;
    const topRobot = wasteByRobot[0];
    return {
      name: topRobot.name,
      count: topRobot.waste,
    };
  }, [wasteByRobot]);

  const hasData = wastes.length > 0;

  const generatePDF = async () => {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Waste Management Report', margin, yPosition);
    yPosition += 10;

    // Date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const now = new Date();
    const dateStr = now.toLocaleString();
    pdf.text(`Generated: ${dateStr}`, margin, yPosition);
    yPosition += 15;

    // Summary Stats
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary Statistics', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Waste Items: ${totalWastes}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Unique Categories: ${uniqueCategories}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Locations: ${uniqueLocations}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Assigned to Robots: ${wastesWithRobots}`, margin, yPosition);
    yPosition += 10;

    // Key Insight
    if (mostActiveRobot) {
      checkPageBreak(15);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Insight', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Most Active Robot: ${mostActiveRobot.name} (${mostActiveRobot.count} items collected)`,
        margin,
        yPosition
      );
      yPosition += 15;
    }

    // Add charts
    const chartSelectors = [
      { key: 'location', title: 'Waste by Location' },
      { key: 'category', title: 'Waste Categories' },
      { key: 'robot', title: 'Waste by Robot' },
      { key: 'overtime', title: 'Waste Development by Category Over Time' },
    ];

    for (const chart of chartSelectors) {
      const chartElement = chartRefs.current[chart.key];
      if (chartElement) {
        try {
          checkPageBreak(80);
          const canvas = await html2canvas(chartElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart title
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(chart.title, margin, yPosition);
          yPosition += 8;

          // Add chart image
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error(`Error capturing chart ${chart.key}:`, error);
        }
      }
    }

    // Generate filename
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const filename = `WasteManagementReport-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.pdf`;

    pdf.save(filename);
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Statistics & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
              Detailed insights into waste sorting performance
            </p>
          </div>
          <Button 
            onClick={generatePDF} 
            variant="outline" 
            size="sm"
            className="transition-premium hover:scale-105 hover:shadow-lg border-2 hover:border-blue-500 dark:hover:border-blue-400"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:scale-105 hover:shadow-premium-lg group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative">
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-2 font-medium uppercase tracking-wide">Total Waste Items</div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{totalWastes}</div>
          </div>
        </div>
        <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:scale-105 hover:shadow-premium-lg group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative">
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-2 font-medium uppercase tracking-wide">Unique Categories</div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">{uniqueCategories}</div>
          </div>
        </div>
        <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:scale-105 hover:shadow-premium-lg group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative">
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-2 font-medium uppercase tracking-wide">Locations</div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-green-600 to-emerald-400 bg-clip-text text-transparent">{uniqueLocations}</div>
          </div>
        </div>
        <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:scale-105 hover:shadow-premium-lg group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative">
            <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-2 font-medium uppercase tracking-wide">Assigned to Robots</div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">{wastesWithRobots}</div>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-12 text-center animate-scaleIn">
          <div className="relative inline-block mb-4">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 animate-pulse" />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Data Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Statistics will appear here once waste data is collected.
          </p>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Waste by Location */}
            <div
              ref={(el) => {
                chartRefs.current['location'] = el;
              }}
              className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:shadow-premium-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold relative z-10 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-400 rounded-full"></span>
                Waste by Location
              </h2>
              {wasteByLocation.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wasteByLocation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="location"
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                    <Bar dataKey="waste" fill="url(#greenGradient)" radius={[12, 12, 0, 0]} />
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No location data available
                </div>
              )}
            </div>

            {/* Waste Types Distribution */}
            <div
              ref={(el) => {
                chartRefs.current['category'] = el;
              }}
              className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:shadow-premium-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold relative z-10 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-400 rounded-full"></span>
                Waste Categories
              </h2>
              {wasteTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={wasteTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name = 'Unknown', percent = 0 }: PieLabelRenderProps) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {wasteTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Waste by Robot */}
          {wasteByRobot.length > 0 && (
            <div
              ref={(el) => {
                chartRefs.current['robot'] = el;
              }}
              className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 mb-6 transition-premium hover:shadow-premium-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold relative z-10 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full"></span>
                Waste by Robot
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wasteByRobot}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  <Bar dataKey="waste" fill="url(#blueGradient)" radius={[12, 12, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* NEW: Waste Development by Category Over Time */}
          {wasteOverTime.length > 0 && (
            <div
              ref={(el) => {
                chartRefs.current['overtime'] = el;
              }}
              className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:shadow-premium-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold relative z-10 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full"></span>
                Waste Development by Category Over Time
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={wasteOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  {Array.from(new Set(wastes.map(w => w.category || 'Unknown'))).map((cat, idx) => (
                    <Line
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

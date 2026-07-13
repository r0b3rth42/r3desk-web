import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardSummary } from '../../../../core/dto/dashboard-summary';
import { Dashboard } from '../../../../core/dto/dahboard';

// 1. Importar el componente de ApexCharts
import { NgApexchartsModule, ChartComponent, ApexYAxis } from "ng-apexcharts";
// 1. Agregar las interfaces necesarias para gráficos de barras/ejes
import { 
  ApexNonAxisChartSeries, 
  ApexAxisChartSeries,
  ApexChart, 
  ApexResponsive, 
  ApexLegend,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  // 1. Añadir importaciones para gráficos de líneas
  ApexStroke,
  ApexGrid,
  ApexMarkers
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  colors: string[];
};

// 2. Definir tipo para el gráfico de barras
export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
};

// 2. Definir tipo para el gráfico de líneas
export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  markers: ApexMarkers;
  colors: string[];
};

@Component({
  selector: 'app-dashboard-home',
  imports: [NgApexchartsModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit{

  @ViewChild("chart") chart!: ChartComponent;

  private dashboardService = inject(DashboardService);

  dashboard!: Dashboard;

  // 3. Propiedad que guardará la configuración del gráfico
  public chartOptions: Partial<ChartOptions>;
  // 3. Nueva propiedad para el gráfico de Prioridad (Barras)
  public barChartOptions: Partial<BarChartOptions>;
  // 3. Nueva propiedad para la tendencia (Líneas)
  public lineChartOptions: Partial<LineChartOptions>;

  constructor() {
    // Inicialización por defecto (vacio o cargando)
    this.chartOptions = {
      series: [],
      chart: {
        width: "100%",
        type: "donut" // Cambia a "pie" si lo prefieres cerrado
      },
      labels: [],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'], // Paleta Tailwind
      legend: {
        position: "bottom"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    // 4. Inicialización por defecto del gráfico de barras
    this.barChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: "620",
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false, // Cambia a 'true' si prefieres barras horizontales
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false // Desactiva los números encima de las barras (se ven al pasar el mouse)
      },
      colors: ['#6366f1'], // Color índigo por defecto para las barras
      xaxis: {
        categories: []
      },
      yaxis: {
        min: 0,
        forceNiceScale: true
      }
    };

    // 4. Inicialización por defecto del gráfico de líneas
    this.lineChartOptions = {
      series: [],
      chart: {
        height: 300, // Un poco más alto ya que abarca el ancho de la pantalla
        type: "line",
        zoom: { enabled: false },
        toolbar: { show: false }
      },
      dataLabels: {
        enabled: true // Muestra los números en los picos de la línea
      },
      stroke: {
        curve: "smooth", // Línea suavizada/curva. Usa "straight" si prefieres líneas rígidas
        width: 3
      },
      colors: ['#10b981'], // Color esmeralda/verde para reflejar flujo activo
      grid: {
        row: {
          colors: ["#f3f4f6", "transparent"], // Alternar colores de fondo en las rejillas
          opacity: 0.5
        }
      },
      markers: {
        size: 4 // Puntos en las uniones de las líneas
      },
      xaxis: {
        categories: []
      }
    };
  }
  

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: response => {
        this.dashboard = response;

        // 4. Mapear los datos que vienen del Map<String, Long> de Quarkus
        if (response.ticketsByStatus) {
          const estados = Object.keys(response.ticketsByStatus); // Ej: ['OPEN', 'CLOSED']
          const valores = Object.values(response.ticketsByStatus); // Ej: [10, 25]

          // Actualizamos de manera reactiva las opciones del gráfico
          this.chartOptions = {
            ...this.chartOptions,
            series: valores,
            labels: estados
          };
        }
        // 5. Mapear los datos de Prioridad (Map<String, Long> desde Quarkus)
        if (response.ticketsByPriority) {
          const prioridades = Object.keys(response.ticketsByPriority); // Ej: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
          const cantidades = Object.values(response.ticketsByPriority);  // Ej: [40, 23, 11, 4]

          this.barChartOptions = {
            ...this.barChartOptions,
            series: [
              {
                name: "Tickets",
                data: cantidades
              }
            ],
            xaxis: {
              ...this.barChartOptions.xaxis,
              categories: prioridades
            }
          };
        }
        // 5. Mapear la Tendencia de Tickets (Map<String, Long> desde Quarkus)
        if (response.ticketTrend) {
          const fechas = Object.keys(response.ticketTrend); // Ej: ['2026-07-07', '2026-07-08', ...]
          const totales = Object.values(response.ticketTrend); // Ej: [5, 12, 8, ...]

          this.lineChartOptions = {
            ...this.lineChartOptions,
            series: [
              {
                name: "Tickets Creados",
                data: totales
              }
            ],
            xaxis: {
              categories: fechas
            }
          };
        }
      }
    });
  }

}

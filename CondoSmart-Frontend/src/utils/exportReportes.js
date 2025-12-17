import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportarReportePDF = (tipo, datos, periodo = 'mensual') => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-ES');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue
    doc.text('CondoSmart', 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Reporte ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, 14, 30);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Período: ${periodo} | Generado: ${fecha}`, 14, 38);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 42, 196, 42);

    let yPosition = 50;

    if (tipo === 'financiero') {
        // KPIs
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Resumen Financiero', 14, yPosition);
        yPosition += 10;

        const kpis = [
            ['Concepto', 'Monto'],
            ['Ingresos (Pagos)', `$${datos.ingresos.toFixed(2)}`],
            ['Gastos (Cargos)', `$${datos.gastos.toFixed(2)}`],
            ['Saldo', `$${datos.saldo.toFixed(2)}`],
            ['Pendientes', `$${datos.pendientes.toFixed(2)}`],
        ];

        doc.autoTable({
            startY: yPosition,
            head: [kpis[0]],
            body: kpis.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
        });

    } else if (tipo === 'ocupacion') {
        doc.setFontSize(12);
        doc.text('Estadísticas de Ocupación', 14, yPosition);
        yPosition += 10;

        const stats = [
            ['Concepto', 'Cantidad'],
            ['Total Unidades', datos.total.toString()],
            ['Ocupadas', datos.ocupadas.toString()],
            ['Disponibles', datos.disponibles.toString()],
            ['Residentes', datos.residentes.toString()],
            ['Porcentaje Ocupación', `${datos.porcentaje}%`],
        ];

        doc.autoTable({
            startY: yPosition,
            head: [stats[0]],
            body: stats.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] },
        });

    } else if (tipo === 'mantenimiento') {
        doc.setFontSize(12);
        doc.text('Estadísticas de Mantenimiento', 14, yPosition);
        yPosition += 10;

        const stats = [
            ['Concepto', 'Cantidad'],
            ['Total Solicitudes', datos.total.toString()],
            ['Completadas', datos.completados.toString()],
            ['Pendientes', datos.pendientes.toString()],
            ['Tasa de Éxito', `${datos.porcentaje}%`],
        ];

        doc.autoTable({
            startY: yPosition,
            head: [stats[0]],
            body: stats.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [245, 158, 11] },
        });

    } else if (tipo === 'seguridad') {
        doc.setFontSize(12);
        doc.text('Estadísticas de Seguridad', 14, yPosition);
        yPosition += 10;

        const stats = [
            ['Concepto', 'Cantidad'],
            ['Accesos Registrados', datos.totalAccesos.toString()],
            ['Incidentes', datos.totalIncidentes.toString()],
            ['Resueltos', datos.resueltos.toString()],
            ['Tasa Resolución', `${datos.totalIncidentes > 0 ? ((datos.resueltos / datos.totalIncidentes) * 100).toFixed(0) : 0}%`],
        ];

        doc.autoTable({
            startY: yPosition,
            head: [stats[0]],
            body: stats.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [239, 68, 68] },
        });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save
    doc.save(`reporte-${tipo}-${fecha}.pdf`);
};

export const exportarReporteExcel = (tipo, datos) => {
    // Simulación de exportar a Excel (CSV)
    let csv = '';
    const fecha = new Date().toLocaleDateString('es-ES');

    csv += `CondoSmart - Reporte ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}\n`;
    csv += `Generado: ${fecha}\n\n`;

    if (tipo === 'financiero') {
        csv += 'Concepto,Monto\n';
        csv += `Ingresos,$${datos.ingresos.toFixed(2)}\n`;
        csv += `Gastos,$${datos.gastos.toFixed(2)}\n`;
        csv += `Saldo,$${datos.saldo.toFixed(2)}\n`;
        csv += `Pendientes,$${datos.pendientes.toFixed(2)}\n`;
    } else if (tipo === 'ocupacion') {
        csv += 'Concepto,Cantidad\n';
        csv += `Total Unidades,${datos.total}\n`;
        csv += `Ocupadas,${datos.ocupadas}\n`;
        csv += `Disponibles,${datos.disponibles}\n`;
        csv += `Residentes,${datos.residentes}\n`;
        csv += `Porcentaje Ocupación,${datos.porcentaje}%\n`;
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-${tipo}-${fecha}.csv`;
    link.click();
};
